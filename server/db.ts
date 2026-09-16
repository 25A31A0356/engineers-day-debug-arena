import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { generateQuestionBank } from "./question_bank";

export interface Registration {
  registration_id: string;
  roll_number: string;
  student_name: string;
  department: string;
  year: string;
  section: string;
  contest_id: string;
  registration_time: string;
  status: "REGISTERED" | "ATTEMPTED" | "COMPLETED" | "RESET";
}

export type AttemptStatus =
  | "STARTED"
  | "ACTIVE"
  | "SUBMITTED"
  | "TIME_EXPIRED"
  | "ABANDONED"
  | "DISQUALIFIED"
  | "RESET";

export interface ShuffledQuestionOptionMapping {
  display_options: { id: "A" | "B" | "C" | "D"; text: string }[];
  correct_display_id: "A" | "B" | "C" | "D"; // Stored strictly server-side, NEVER sent to contestant
}

export interface Attempt {
  attempt_id: string;
  registration_id: string;
  roll_number: string;
  contest_id: string;
  started_at: string;
  expires_at: string; // Server authoritative 10-minute expiry (600s)
  submitted_at: string | null;
  status: AttemptStatus;
  assigned_question_ids: string[]; // 10 dedicated non-overlapping question IDs
  shuffled_options?: Record<string, ShuffledQuestionOptionMapping>; // question_id -> ShuffledQuestionOptionMapping
  answers: Record<string, string>; // question_id -> chosen display option ("A" | "B" | "C" | "D")
  hints_used: Record<string, number>; // question_id -> number of times hint was requested on this question
  hint_penalty_total: number; // Total hint penalties deducted (-1 per hint use)
  tab_switch_count: number;
  back_button_triggers: number;
  score: number; // Final Calculated Score: Correct Points - Negative Penalties - Hint Penalties (Max 21, Min -5.5)
  max_score: number; // 21
  correct_count: number; // 0..10
  correct_points: number; // Positive points earned (+1/+2/+3)
  negative_marking_penalty: number; // Negative penalties accrued (-0.5 for Med wrong, -1.0 for Hard wrong)
  difficulty_score: number; // Alias for final score / difficulty points for leaderboard compatibility
  simple_correct: number; // 0..3 (+1 each)
  simple_wrong: number; // 0..3 (0 penalty)
  medium_correct: number; // 0..3 (+2 each)
  medium_wrong: number; // 0..3 (-0.5 penalty each)
  hard_correct: number; // 0..4 (+3 each)
  hard_wrong: number; // 0..4 (-1.0 penalty each)
  incorrect_count: number;
  unanswered_count: number;
  time_taken_seconds: number;
  client_ip?: string;
  user_agent?: string;
}

export interface QRSession {
  token: string;
  status: "INACTIVE" | "ACTIVE" | "EXPIRED";
  created_at: string;
  activated_at: string | null;
  expired_at: string | null;
  scan_count: number;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  event_type:
    | "REGISTRATION"
    | "QR_GENERATED"
    | "QR_ACTIVATED"
    | "QR_DEACTIVATED"
    | "QR_REGENERATED"
    | "QR_EXPIRED"
    | "QR_SCANNED"
    | "CONTEST_ENTRY"
    | "CONTEST_STARTED"
    | "ANSWER_SAVED"
    | "HINT_USED"
    | "TAB_SWITCH"
    | "BACK_NAVIGATION"
    | "CHEATING_DISQUALIFIED"
    | "AUTO_SUBMIT_EXPIRED"
    | "MANUAL_SUBMISSION"
    | "ATTEMPT_ABANDONED"
    | "ATTEMPT_RESET"
    | "RESULTS_RELEASED"
    | "RESULTS_LOCKED"
    | "CONTEST_STATUS_CHANGED";
  roll_number?: string;
  attempt_id?: string;
  details: string;
  metadata?: any;
}

export interface ContestConfig {
  contest_id: string;
  title: string;
  institution: string;
  department: string;
  event_name: string;
  competition_name: string;
  venue: string;
  date: string;
  time_window: string;
  duration_minutes: number;
  is_active: boolean;
  results_released: boolean;
  max_tab_switches: number;
  hint_penalty_points: number;
  allow_registration: boolean;
  reset_key_hash: string; // Server verification for 2008
  release_key_hash: string; // Server verification for BOOYAHBOY
}

export interface QuestionDef {
  id: string;
  number?: number;
  difficulty: "EASY" | "MEDIUM" | "HARD";
  topic: string;
  points: number;
  title: string;
  description: string;
  code_snippet: string;
  language: "python" | "c";
  expected_output: string;
  current_output: string;
  options: { id: string; text: string; explanation?: string }[];
  correct_option_id: string; // Kept strictly on server, NEVER exposed to client before release
  hint?: string; // Only for HARD questions
  question_family_id: string;
  category: string;
  sub_category: string;
  bug_type: string;
  concept: string;
}

export interface DatabaseSchema {
  config: ContestConfig;
  qr_session: QRSession;
  registrations: Record<string, Registration>; // keyed by roll_number (uppercase)
  attempts: Record<string, Attempt>; // keyed by attempt_id
  roll_to_latest_attempt: Record<string, string>; // roll_number -> attempt_id
  attempt_history: Attempt[]; // preserved history of reset attempts
  audit_logs: AuditLog[];
  questions: QuestionDef[];
}

const DATA_DIR = path.resolve(process.cwd(), "server", "data");
const DB_FILE = path.join(DATA_DIR, "contest_db.json");

// Helper hash
function hashKey(str: string): string {
  return crypto.createHash("sha256").update(str).digest("hex");
}

const DEFAULT_RESET_KEY_HASH = hashKey("2008");
const DEFAULT_RELEASE_KEY_HASH = hashKey("BOOYAHBOY");

// Generate 1,220+ unique C and Python questions across 105 distinct Question Families
const MASTER_QUESTION_POOL: QuestionDef[] = generateQuestionBank();
const QUESTION_MAP: Map<string, QuestionDef> = new Map(MASTER_QUESTION_POOL.map((q) => [q.id, q]));

// Distinct family pools partitioned by Language and Difficulty
const EASY_C_FAMILIES = new Map<string, QuestionDef[]>();
const EASY_PY_FAMILIES = new Map<string, QuestionDef[]>();
const MEDIUM_C_FAMILIES = new Map<string, QuestionDef[]>();
const MEDIUM_PY_FAMILIES = new Map<string, QuestionDef[]>();
const HARD_C_FAMILIES = new Map<string, QuestionDef[]>();
const HARD_PY_FAMILIES = new Map<string, QuestionDef[]>();

for (const q of MASTER_QUESTION_POOL) {
  const isC = q.language === "c";
  if (q.difficulty === "EASY") {
    const map = isC ? EASY_C_FAMILIES : EASY_PY_FAMILIES;
    if (!map.has(q.question_family_id)) map.set(q.question_family_id, []);
    map.get(q.question_family_id)!.push(q);
  } else if (q.difficulty === "MEDIUM") {
    const map = isC ? MEDIUM_C_FAMILIES : MEDIUM_PY_FAMILIES;
    if (!map.has(q.question_family_id)) map.set(q.question_family_id, []);
    map.get(q.question_family_id)!.push(q);
  } else {
    const map = isC ? HARD_C_FAMILIES : HARD_PY_FAMILIES;
    if (!map.has(q.question_family_id)) map.set(q.question_family_id, []);
    map.get(q.question_family_id)!.push(q);
  }
}

const EASY_C_KEYS = Array.from(EASY_C_FAMILIES.keys());
const EASY_PY_KEYS = Array.from(EASY_PY_FAMILIES.keys());
const MEDIUM_C_KEYS = Array.from(MEDIUM_C_FAMILIES.keys());
const MEDIUM_PY_KEYS = Array.from(MEDIUM_PY_FAMILIES.keys());
const HARD_C_KEYS = Array.from(HARD_C_FAMILIES.keys());
const HARD_PY_KEYS = Array.from(HARD_PY_FAMILIES.keys());

interface DistributionPlan {
  easyC: number;
  easyPy: number;
  medC: number;
  medPy: number;
  hardC: number;
  hardPy: number;
}

// Dual-Constraint Language + Difficulty Allocation Patterns:
// Guarantees: 5 C + 5 Python = 3 Simple + 3 Medium + 4 Hard = 10 Questions
const DISTRIBUTION_PATTERNS: DistributionPlan[] = [
  // Pattern 0: Easy(2C, 1Py), Med(1C, 2Py), Hard(2C, 2Py) => 5C, 5Py (3 Easy, 3 Med, 4 Hard)
  { easyC: 2, easyPy: 1, medC: 1, medPy: 2, hardC: 2, hardPy: 2 },
  // Pattern 1: Easy(1C, 2Py), Med(2C, 1Py), Hard(2C, 2Py) => 5C, 5Py (3 Easy, 3 Med, 4 Hard)
  { easyC: 1, easyPy: 2, medC: 2, medPy: 1, hardC: 2, hardPy: 2 },
  // Pattern 2: Easy(2C, 1Py), Med(2C, 1Py), Hard(1C, 3Py) => 5C, 5Py (3 Easy, 3 Med, 4 Hard)
  { easyC: 2, easyPy: 1, medC: 2, medPy: 1, hardC: 1, hardPy: 3 },
  // Pattern 3: Easy(1C, 2Py), Med(1C, 2Py), Hard(3C, 1Py) => 5C, 5Py (3 Easy, 3 Med, 4 Hard)
  { easyC: 1, easyPy: 2, medC: 1, medPy: 2, hardC: 3, hardPy: 1 }
];

class ContestDatabase {
  private data: DatabaseSchema;
  private questionMap: Map<string, QuestionDef>;

  constructor() {
    this.ensureDataDir();
    this.questionMap = QUESTION_MAP;
    this.data = this.loadDatabase();
  }

  private ensureDataDir() {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  }

  private getInitialData(): DatabaseSchema {
    const initialToken = crypto.randomBytes(4).toString("hex").toUpperCase();
    return {
      config: {
        contest_id: "ENG-OLYMPICS-2026",
        title: "ENGINEERING OLYMPICS — OFFICIAL DEBUG THE CODE CONTEST",
        institution: "PRAGATI UNIVERSITY",
        department: "DEPARTMENT OF MECHANICAL ENGINEERING",
        event_name: "ENGINEERING OLYMPICS",
        competition_name: "DEBUG THE CODE",
        venue: "MG-7 CORE BLOCK",
        date: "16 SEPTEMBER 2026",
        time_window: "2:00 PM – 4:00 PM",
        duration_minutes: 15,
        is_active: true,
        results_released: false,
        max_tab_switches: 3,
        hint_penalty_points: 1,
        allow_registration: true,
        reset_key_hash: DEFAULT_RESET_KEY_HASH,
        release_key_hash: DEFAULT_RELEASE_KEY_HASH
      },
      qr_session: {
        token: initialToken,
        status: "ACTIVE",
        created_at: new Date().toISOString(),
        activated_at: new Date().toISOString(),
        expired_at: null,
        scan_count: 0
      },
      registrations: {},
      attempts: {},
      roll_to_latest_attempt: {},
      attempt_history: [],
      audit_logs: [
        {
          id: crypto.randomUUID(),
          timestamp: new Date().toISOString(),
          event_type: "CONTEST_STATUS_CHANGED",
          details: `Contest database initialized with master question bank (${MASTER_QUESTION_POOL.length} total questions: ${EASY_POOL.length} Easy, ${MEDIUM_POOL.length} Medium, ${HARD_POOL.length} Hard). 15-min timer, negative marking enabled.`
        }
      ],
      questions: MASTER_QUESTION_POOL
    };
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, "utf-8");
        const parsed = JSON.parse(raw) as DatabaseSchema;
        // Always refresh questions pool from MASTER_QUESTION_POOL
        parsed.questions = MASTER_QUESTION_POOL;
        // Ensure duration is updated to 15 mins
        if (parsed.config) {
          parsed.config.duration_minutes = 15;
          parsed.config.hint_penalty_points = 1;
        }
        return parsed;
      }
    } catch (e) {
      console.error("Failed to load contest_db.json, creating initial data:", e);
    }
    const initial = this.getInitialData();
    this.saveDatabase(initial);
    return initial;
  }

  private saveDatabase(state = this.data) {
    try {
      this.ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(state, null, 2), "utf-8");
    } catch (e) {
      console.error("Critical error saving contest database:", e);
    }
  }

  public logAudit(event_type: AuditLog["event_type"], details: string, roll_number?: string, attempt_id?: string, metadata?: any) {
    const log: AuditLog = {
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      event_type,
      roll_number: roll_number?.toUpperCase(),
      attempt_id,
      details,
      metadata
    };
    this.data.audit_logs.unshift(log);
    if (this.data.audit_logs.length > 1000) {
      this.data.audit_logs.length = 1000;
    }
    this.saveDatabase();
  }

  public getConfig(): ContestConfig {
    return { ...this.data.config };
  }

  public updateConfig(updates: Partial<ContestConfig>) {
    this.data.config = { ...this.data.config, ...updates };
    this.saveDatabase();
    this.logAudit("CONTEST_STATUS_CHANGED", `Contest config updated: ${Object.keys(updates).join(", ")}`);
  }

  // --- Registration Engine ---
  public registerStudent(data: {
    roll_number: string;
    student_name: string;
    department: string;
    year: string;
    section: string;
  }): { success: boolean; message: string; registration?: Registration } {
    const roll = data.roll_number.trim().toUpperCase();
    if (!roll) {
      return { success: false, message: "Roll Number is required." };
    }
    if (!data.student_name.trim()) {
      return { success: false, message: "Student Name is required." };
    }

    if (this.data.registrations[roll]) {
      return {
        success: false,
        message: "You are already registered for this contest."
      };
    }

    const reg: Registration = {
      registration_id: `REG-${Date.now()}-${roll.slice(-4)}`,
      roll_number: roll,
      student_name: data.student_name.trim(),
      department: data.department.trim() || "Mechanical Engineering",
      year: data.year.trim() || "2nd Year",
      section: data.section.trim() || "A",
      contest_id: this.data.config.contest_id,
      registration_time: new Date().toISOString(),
      status: "REGISTERED"
    };

    this.data.registrations[roll] = reg;
    this.saveDatabase();
    this.logAudit("REGISTRATION", `Student ${roll} (${reg.student_name}) registered successfully.`, roll, undefined, reg);

    return {
      success: true,
      message: "REGISTRATION SUCCESSFUL. Please wait for the host to provide the contest QR code.",
      registration: reg
    };
  }

  public getRegistration(roll_number: string): Registration | null {
    const roll = roll_number.trim().toUpperCase();
    return this.data.registrations[roll] || null;
  }

  public getAllRegistrations(): Registration[] {
    return Object.values(this.data.registrations);
  }

  // --- QR Session Management ---
  public getQRSession(): QRSession {
    return { ...this.data.qr_session };
  }

  public generateQR(activateImmediately = true): QRSession {
    const token = crypto.randomBytes(4).toString("hex").toUpperCase();
    this.data.qr_session = {
      token,
      status: activateImmediately ? "ACTIVE" : "INACTIVE",
      created_at: new Date().toISOString(),
      activated_at: activateImmediately ? new Date().toISOString() : null,
      expired_at: null,
      scan_count: 0
    };
    this.saveDatabase();
    this.logAudit(
      activateImmediately ? "QR_ACTIVATED" : "QR_GENERATED",
      `New QR token ${token} generated (Status: ${this.data.qr_session.status})`
    );
    return this.getQRSession();
  }

  public activateQR(): QRSession {
    this.data.qr_session.status = "ACTIVE";
    this.data.qr_session.activated_at = new Date().toISOString();
    this.data.qr_session.expired_at = null;
    this.saveDatabase();
    this.logAudit("QR_ACTIVATED", `QR token ${this.data.qr_session.token} activated by host.`);
    return this.getQRSession();
  }

  public deactivateQR(): QRSession {
    this.data.qr_session.status = "INACTIVE";
    this.saveDatabase();
    this.logAudit("QR_DEACTIVATED", `QR token ${this.data.qr_session.token} deactivated.`);
    return this.getQRSession();
  }

  public expireQR(): QRSession {
    this.data.qr_session.status = "EXPIRED";
    this.data.qr_session.expired_at = new Date().toISOString();
    this.saveDatabase();
    this.logAudit("QR_EXPIRED", `QR token ${this.data.qr_session.token} expired.`);
    return this.getQRSession();
  }

  public incrementQRScan(): number {
    this.data.qr_session.scan_count += 1;
    this.saveDatabase();
    return this.data.qr_session.scan_count;
  }

  public recordRealScan(token: string, clientIp?: string, userAgent?: string): { success: boolean; scan_count: number; message: string } {
    if (this.data.qr_session.status !== "ACTIVE" || this.data.qr_session.token !== token.toUpperCase().trim()) {
      return { success: false, scan_count: this.data.qr_session.scan_count, message: "Invalid or inactive QR token." };
    }
    this.data.qr_session.scan_count += 1;
    this.saveDatabase();
    this.logAudit("QR_SCANNED", `Verified real QR code scan from ${clientIp || "Contestant device"}. Live verified scan count: ${this.data.qr_session.scan_count}`, undefined, undefined, { clientIp, userAgent });
    return { success: true, scan_count: this.data.qr_session.scan_count, message: "Real scan verified and recorded." };
  }

  // --- Multi-Participant Unique Question Assignment Engine with Zero Family Repetition ---
  // Mandatory Dual Constraints:
  // 1. Exactly 5 C Questions + 5 Python Questions.
  // 2. Exactly 3 Simple Questions + 3 Medium Questions + 4 Hard Questions.
  // 3. Exactly 10 DISTINCT Question Families (Zero Family Repetition per contestant).
  // 4. Staggered variant distribution across families ensures maximum cross-contestant uniqueness.
  public assignUniqueQuestionsForAttempt(attemptIndex: number, rollNumber: string): string[] {
    const k = attemptIndex;
    const plan = DISTRIBUTION_PATTERNS[k % DISTRIBUTION_PATTERNS.length];
    const assignedIds: string[] = [];
    const usedFamilies = new Set<string>();

    const pickFromPool = (keys: string[], familyMap: Map<string, QuestionDef[]>, count: number, offsetMultiplier: number) => {
      for (let i = 0; i < count; i++) {
        const famKey = keys[(k * offsetMultiplier + i) % keys.length];
        const variants = familyMap.get(famKey)!;
        const variantIdx = Math.floor((k * offsetMultiplier + i) / keys.length) % variants.length;
        const selected = variants[variantIdx];
        assignedIds.push(selected.id);
        usedFamilies.add(selected.question_family_id);
      }
    };

    // 1. Easy Questions (Total = 3: plan.easyC + plan.easyPy)
    pickFromPool(EASY_C_KEYS, EASY_C_FAMILIES, plan.easyC, 3);
    pickFromPool(EASY_PY_KEYS, EASY_PY_FAMILIES, plan.easyPy, 3);

    // 2. Medium Questions (Total = 3: plan.medC + plan.medPy)
    pickFromPool(MEDIUM_C_KEYS, MEDIUM_C_FAMILIES, plan.medC, 3);
    pickFromPool(MEDIUM_PY_KEYS, MEDIUM_PY_FAMILIES, plan.medPy, 3);

    // 3. Hard Questions (Total = 4: plan.hardC + plan.hardPy)
    pickFromPool(HARD_C_KEYS, HARD_C_FAMILIES, plan.hardC, 4);
    pickFromPool(HARD_PY_KEYS, HARD_PY_FAMILIES, plan.hardPy, 4);

    // Invariant quality check: exactly 10 questions, exactly 10 distinct families
    if (assignedIds.length !== 10 || usedFamilies.size !== 10) {
      console.error(`CRITICAL: Invariant violated! IDs: ${assignedIds.length}, Distinct Families: ${usedFamilies.size}`);
    }

    return assignedIds;
  }

  // --- Contestant Attempt Engine ---
  public verifyEntry(roll_number: string, token?: string): {
    can_start: boolean;
    reason?: string;
    registration?: Registration;
    existing_attempt?: Attempt;
    requires_reattempt_reset?: boolean;
  } {
    const roll = roll_number.trim().toUpperCase();

    // 1. Check contest active
    if (!this.data.config.is_active) {
      return { can_start: false, reason: "The contest is currently paused or inactive." };
    }

    // 2. Check QR session
    if (this.data.qr_session.status !== "ACTIVE" || (token && token.toUpperCase() !== this.data.qr_session.token)) {
      return { can_start: false, reason: "Contest access is currently closed or invalid QR session." };
    }

    // 3. Check registration
    const reg = this.data.registrations[roll];
    if (!reg) {
      return {
        can_start: false,
        reason: `Roll Number ${roll} is NOT registered. Please register at the registration desk first.`
      };
    }

    // 4. Check existing attempt
    const latestAttemptId = this.data.roll_to_latest_attempt[roll];
    if (latestAttemptId) {
      const attempt = this.data.attempts[latestAttemptId];
      if (attempt) {
        if (attempt.status === "RESET") {
          return { can_start: true, registration: reg };
        }

        if (attempt.status === "ACTIVE" || attempt.status === "STARTED") {
          const now = Date.now();
          const expiry = new Date(attempt.expires_at).getTime();
          if (now >= expiry) {
            this.finalizeAttempt(attempt.attempt_id, "TIME_EXPIRED");
            return {
              can_start: false,
              reason: "ATTEMPT ALREADY USED\nYou have already participated in this contest. Please contact the host if you believe this is an error.",
              existing_attempt: attempt,
              requires_reattempt_reset: true
            };
          }
          return { can_start: true, registration: reg, existing_attempt: attempt };
        }

        return {
          can_start: false,
          reason: "ATTEMPT ALREADY USED\nYou have already participated in this contest.\nPlease contact the host if you believe this is an error.",
          existing_attempt: attempt,
          requires_reattempt_reset: true
        };
      }
    }

    return { can_start: true, registration: reg };
  }

  public sanitizeAttemptForContestant(attempt: Attempt) {
    return {
      attempt_id: attempt.attempt_id,
      roll_number: attempt.roll_number,
      contest_id: attempt.contest_id,
      status: attempt.status,
      started_at: attempt.started_at,
      expires_at: attempt.expires_at,
      max_score: attempt.max_score || 21,
      answers: attempt.answers,
      hints_used: attempt.hints_used,
      hint_penalty_total: attempt.hint_penalty_total || 0,
      tab_switch_count: attempt.tab_switch_count
    };
  }

  public startAttempt(roll_number: string, token?: string, client_ip?: string, user_agent?: string): {
    success: boolean;
    message: string;
    attempt?: any;
    questions?: any[];
  } {
    const roll = roll_number.trim().toUpperCase();
    const verify = this.verifyEntry(roll, token);
    if (!verify.can_start || !verify.registration) {
      return { success: false, message: verify.reason || "Entry denied." };
    }

    if (verify.existing_attempt && (verify.existing_attempt.status === "ACTIVE" || verify.existing_attempt.status === "STARTED")) {
      return {
        success: true,
        message: "Resumed active contest session.",
        attempt: this.sanitizeAttemptForContestant(verify.existing_attempt),
        questions: this.getAttemptPublicQuestions(verify.existing_attempt.attempt_id)
      };
    }

    const durationSeconds = (this.data.config.duration_minutes || 15) * 60; // 15 minutes = 900 seconds
    const startTime = new Date();
    const expiryTime = new Date(startTime.getTime() + durationSeconds * 1000);

    const attemptIndex = Object.keys(this.data.attempts).length;
    const assignedQuestionIds = this.assignUniqueQuestionsForAttempt(attemptIndex, roll);

    // Randomize the presentation order of the 10 questions for this contestant
    for (let i = assignedQuestionIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [assignedQuestionIds[i], assignedQuestionIds[j]] = [assignedQuestionIds[j], assignedQuestionIds[i]];
    }

    // Generate randomized answer shuffling per contestant attempt
    const shuffledOptions: Record<string, ShuffledQuestionOptionMapping> = {};
    for (const qId of assignedQuestionIds) {
      const q = this.questionMap.get(qId);
      if (q) {
        // Clone the 4 options
        const rawOptions = [...q.options];
        // Fisher-Yates random shuffle
        for (let i = rawOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [rawOptions[i], rawOptions[j]] = [rawOptions[j], rawOptions[i]];
        }

        const letters: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
        let correctDisplayId: "A" | "B" | "C" | "D" = "A";

        const displayOptions = rawOptions.map((opt, oIdx) => {
          const displayLetter = letters[oIdx];
          if (opt.id === q.correct_answer) {
            correctDisplayId = displayLetter;
          }
          return {
            id: displayLetter,
            text: opt.text
          };
        });

        const displayToOriginal: Record<string, string> = {};
        const originalToDisplay: Record<string, string> = {};
        displayOptions.forEach((dOpt, oIdx) => {
          const originalId = rawOptions[oIdx].id;
          displayToOriginal[dOpt.id] = originalId;
          originalToDisplay[originalId] = dOpt.id;
        });

        shuffledOptions[qId] = {
          question_id: qId,
          display_options: displayOptions,
          correct_display_id: correctDisplayId,
          display_to_original: displayToOriginal,
          original_to_display: originalToDisplay
        };
      }
    }

    const attemptId = `ATT-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const attempt: Attempt = {
      attempt_id: attemptId,
      registration_id: verify.registration.registration_id,
      roll_number: roll,
      contest_id: this.data.config.contest_id,
      started_at: startTime.toISOString(),
      expires_at: expiryTime.toISOString(),
      submitted_at: null,
      status: "ACTIVE",
      assigned_question_ids: assignedQuestionIds,
      shuffled_options: shuffledOptions,
      answers: {},
      hints_used: {},
      tab_switch_count: 0,
      back_button_triggers: 0,
      score: 0,
      max_score: 21,
      correct_count: 0,
      correct_points: 0,
      negative_marking_penalty: 0,
      difficulty_score: 0,
      simple_correct: 0,
      simple_wrong: 0,
      medium_correct: 0,
      medium_wrong: 0,
      hard_correct: 0,
      hard_wrong: 0,
      incorrect_count: 0,
      unanswered_count: 0,
      hint_penalty_total: 0,
      time_taken_seconds: 0,
      client_ip,
      user_agent
    };

    this.data.attempts[attemptId] = attempt;
    this.data.roll_to_latest_attempt[roll] = attemptId;
    this.data.registrations[roll].status = "ATTEMPTED";
    this.saveDatabase();

    this.logAudit("CONTEST_STARTED", `Contestant ${roll} started official 15-minute contest with ${assignedQuestionIds.length} unique questions assigned. Expiry: ${expiryTime.toLocaleTimeString()}`, roll, attemptId, { ip: client_ip });

    return {
      success: true,
      message: "Contest started successfully.",
      attempt: this.sanitizeAttemptForContestant(attempt),
      questions: this.getAttemptPublicQuestions(attemptId)
    };
  }

  // Returns only the 10 questions assigned to a specific attempt (without answers or solution leaks)
  public getAttemptPublicQuestions(attempt_id: string) {
    const attempt = this.data.attempts[attempt_id];
    if (!attempt || !attempt.assigned_question_ids) {
      return this.getDefaultPublicQuestions();
    }

    return attempt.assigned_question_ids.map((qId, idx) => {
      const q = this.questionMap.get(qId) || this.data.questions[0];
      const mapping = attempt.shuffled_options?.[qId];
      const options = mapping
        ? mapping.display_options
        : q.options.map((o) => ({ id: o.id as "A" | "B" | "C" | "D", text: o.text }));

      // Strip any language tags from title & description so contestant never sees language names
      const cleanTitle = q.title.replace(/\s*\((Python|C|Java|C\+\+|CPP)\)/gi, "").trim();
      const cleanDescription = q.description
        .replace(/\b(in Python|in C|in C\+\+|in Java)\b/gi, "in the program")
        .replace(/\b(Python program|C program|Python script|C function)\b/gi, "program")
        .trim();

      const hintUses = attempt.hints_used?.[q.id] || 0;
      const isHard = q.difficulty === "HARD";

      return {
        id: q.id,
        number: idx + 1,
        difficulty: q.difficulty,
        topic: q.topic,
        points: q.points, // 1, 2, or 3
        title: cleanTitle,
        description: cleanDescription,
        code_snippet: q.code_snippet,
        expected_output: q.expected_output,
        current_output: q.current_output,
        options: options.map((o) => ({ id: o.id, text: o.text })),
        has_hint: isHard,
        hints_used_count: hintUses,
        unlocked_hint: hintUses > 0 && isHard ? q.hint : null
      };
    });
  }

  public getDefaultPublicQuestions() {
    return this.data.questions.slice(0, 10).map((q, idx) => {
      const cleanTitle = q.title.replace(/\s*\((Python|C|Java|C\+\+|CPP)\)/gi, "").trim();
      const cleanDescription = q.description
        .replace(/\b(in Python|in C|in C\+\+|in Java)\b/gi, "in the program")
        .replace(/\b(Python program|C program|Python script|C function)\b/gi, "program")
        .trim();

      return {
        id: q.id,
        number: idx + 1,
        difficulty: q.difficulty,
        topic: q.topic,
        points: q.points,
        title: cleanTitle,
        description: cleanDescription,
        code_snippet: q.code_snippet,
        expected_output: q.expected_output,
        current_output: q.current_output,
        options: q.options.map((o) => ({ id: o.id, text: o.text })),
        has_hint: q.difficulty === "HARD",
        hints_used_count: 0,
        unlocked_hint: null
      };
    });
  }

  // Hint System: Hard Questions ONLY with -1 Credit Penalty per Use
  public getHint(attempt_id: string, question_id: string): {
    success: boolean;
    hint?: string;
    hints_used_count?: number;
    total_hint_penalty?: number;
    message: string;
  } {
    const attempt = this.data.attempts[attempt_id];
    if (!attempt || (attempt.status !== "ACTIVE" && attempt.status !== "STARTED")) {
      return { success: false, message: "Contest session is closed or inactive." };
    }

    if (Date.now() >= new Date(attempt.expires_at).getTime()) {
      this.finalizeAttempt(attempt_id, "TIME_EXPIRED");
      return { success: false, message: "Contest timer has expired. Hints cannot be requested." };
    }

    const q = this.questionMap.get(question_id);
    if (!q) {
      return { success: false, message: "Question not found." };
    }

    // Enforce Hard questions ONLY rule
    if (q.difficulty !== "HARD") {
      return {
        success: false,
        message: "Hints are strictly available ONLY for Hard difficulty questions."
      };
    }

    // Deduct 1 credit per hint request on Hard question
    if (!attempt.hints_used) {
      attempt.hints_used = {};
    }
    attempt.hints_used[question_id] = (attempt.hints_used[question_id] || 0) + 1;
    attempt.hint_penalty_total = (attempt.hint_penalty_total || 0) + 1;

    this.saveDatabase();
    this.logAudit(
      "HINT_USED",
      `Contestant ${attempt.roll_number} requested hint on Hard question ${question_id} (Question hint count: ${attempt.hints_used[question_id]}, Total penalty: -${attempt.hint_penalty_total} pts).`,
      attempt.roll_number,
      attempt_id,
      { question_id, hint_uses_on_question: attempt.hints_used[question_id], total_penalty: attempt.hint_penalty_total }
    );

    return {
      success: true,
      hint: q.hint || "Analyze the logic flow, boundary conditions, and memory handling carefully.",
      hints_used_count: attempt.hints_used[question_id],
      hint_penalty_total: attempt.hint_penalty_total,
      total_hint_penalty: attempt.hint_penalty_total,
      message: `Hint unlocked (-1 credit penalty applied). Total hint penalty: -${attempt.hint_penalty_total} pts`
    };
  }

  public saveAnswer(attempt_id: string, question_id: string, option_id: string): { success: boolean; message: string } {
    const attempt = this.data.attempts[attempt_id];
    if (!attempt || (attempt.status !== "ACTIVE" && attempt.status !== "STARTED")) {
      return { success: false, message: "Session is closed." };
    }

    if (Date.now() >= new Date(attempt.expires_at).getTime()) {
      this.finalizeAttempt(attempt_id, "TIME_EXPIRED");
      return { success: false, message: "Time expired. Submission locked." };
    }

    attempt.answers[question_id] = option_id;
    this.saveDatabase();
    return { success: true, message: "Answer saved." };
  }

  public logContestantEvent(attempt_id: string, event_type: "TAB_SWITCH" | "BACK_NAVIGATION", details: string): {
    success: boolean;
    terminated: boolean;
    reason?: string;
    switch_count?: number;
  } {
    const attempt = this.data.attempts[attempt_id];
    if (!attempt || (attempt.status !== "ACTIVE" && attempt.status !== "STARTED")) {
      return { success: false, terminated: true, reason: "Attempt is no longer active." };
    }

    if (event_type === "TAB_SWITCH") {
      attempt.tab_switch_count += 1;
      this.logAudit("TAB_SWITCH", `Contestant switched tab/window (Violation #${attempt.tab_switch_count}). ${details}`, attempt.roll_number, attempt_id);

      const maxSwitches = this.data.config.max_tab_switches || 3;
      if (attempt.tab_switch_count >= maxSwitches) {
        this.finalizeAttempt(attempt_id, "DISQUALIFIED", `Anti-cheat trigger: Exceeded allowed window switch limit (${maxSwitches} violations).`);
        this.logAudit("CHEATING_DISQUALIFIED", `Contestant ${attempt.roll_number} automatically DISQUALIFIED after ${attempt.tab_switch_count} tab/app switch infractions.`, attempt.roll_number, attempt_id);
        return {
          success: true,
          terminated: true,
          reason: `CONTEST DISQUALIFIED\nYour contest session was terminated because you exceeded the allowed window switch limit (${maxSwitches} violations).\nCheating violation logged to Host Audit Trail.`,
          switch_count: attempt.tab_switch_count
        };
      }
      this.saveDatabase();
      return { success: true, terminated: false, switch_count: attempt.tab_switch_count };
    }

    if (event_type === "BACK_NAVIGATION") {
      attempt.back_button_triggers += 1;
      this.logAudit("BACK_NAVIGATION", `Contestant triggered browser back button / exit attempt. ${details}`, attempt.roll_number, attempt_id);
      this.saveDatabase();
      return { success: true, terminated: false };
    }

    return { success: true, terminated: false };
  }

  public abandonAttempt(attempt_id: string, reason = "Contestant exited the contest interface"): { success: boolean } {
    return { success: this.finalizeAttempt(attempt_id, "ABANDONED", reason) };
  }

  public submitAttempt(attempt_id: string): { success: boolean; message: string; attempt?: Attempt } {
    const attempt = this.data.attempts[attempt_id];
    if (!attempt) {
      return { success: false, message: "Attempt not found." };
    }
    if (attempt.status === "SUBMITTED" || attempt.status === "TIME_EXPIRED" || attempt.status === "ABANDONED" || attempt.status === "DISQUALIFIED") {
      return { success: true, message: "Contest was already submitted.", attempt };
    }

    this.finalizeAttempt(attempt_id, "SUBMITTED");
    this.logAudit("MANUAL_SUBMISSION", `Contest submitted by contestant ${attempt.roll_number}.`, attempt.roll_number, attempt_id);

    return {
      success: true,
      message: "CONTEST SUBMITTED SUCCESSFULLY. Your submission has been recorded. Results are currently locked.",
      attempt: this.data.attempts[attempt_id]
    };
  }

  // Authoritative Final Score Calculation with Negative Marking & Hard Hint Deductions
  private finalizeAttempt(attempt_id: string, final_status: AttemptStatus, reason?: string): boolean {
    const attempt = this.data.attempts[attempt_id];
    if (!attempt) return false;

    const now = new Date();
    attempt.status = final_status;
    attempt.submitted_at = now.toISOString();

    const startTime = new Date(attempt.started_at).getTime();
    const endTime = now.getTime();
    const expiryTime = new Date(attempt.expires_at).getTime();
    const actualEnd = Math.min(endTime, expiryTime);
    attempt.time_taken_seconds = Math.max(1, Math.floor((actualEnd - startTime) / 1000));

    let correctPoints = 0;
    let negativeMarkingPenalty = 0;
    let correctCount = 0;
    let simpleCorrect = 0;
    let simpleWrong = 0;
    let mediumCorrect = 0;
    let mediumWrong = 0;
    let hardCorrect = 0;
    let hardWrong = 0;
    let incorrectCount = 0;
    let unansweredCount = 0;

    const questionsToScore = attempt.assigned_question_ids && attempt.assigned_question_ids.length > 0
      ? attempt.assigned_question_ids.map((id) => this.questionMap.get(id)).filter(Boolean) as QuestionDef[]
      : this.data.questions.slice(0, 10);

    for (const q of questionsToScore) {
      const userChoice = attempt.answers[q.id];
      const mapping = attempt.shuffled_options?.[q.id];
      const correctChoice = mapping ? mapping.correct_display_id : q.correct_option_id;

      if (!userChoice) {
        // Unanswered: receives 0 points, no negative marking penalty
        unansweredCount += 1;
      } else if (userChoice === correctChoice) {
        // Correct answer: +1 for Simple, +2 for Medium, +3 for Hard
        correctCount += 1;
        if (q.difficulty === "EASY") {
          simpleCorrect += 1;
          correctPoints += 1;
        } else if (q.difficulty === "MEDIUM") {
          mediumCorrect += 1;
          correctPoints += 2;
        } else if (q.difficulty === "HARD") {
          hardCorrect += 1;
          correctPoints += 3;
        }
      } else {
        // Wrong answer: 0 for Simple, -0.5 for Medium, -1.0 for Hard
        incorrectCount += 1;
        if (q.difficulty === "EASY") {
          simpleWrong += 1;
          // Simple wrong receives 0 penalty
        } else if (q.difficulty === "MEDIUM") {
          mediumWrong += 1;
          negativeMarkingPenalty += 0.5;
        } else if (q.difficulty === "HARD") {
          hardWrong += 1;
          negativeMarkingPenalty += 1.0;
        }
      }
    }

    const hintPenalty = attempt.hint_penalty_total || 0;
    // Final Score = Correct-answer points − Negative-answer penalties − Hint penalties
    const finalScore = correctPoints - negativeMarkingPenalty - hintPenalty;

    if (final_status === "DISQUALIFIED") {
      attempt.score = 0;
      attempt.max_score = 21;
      attempt.correct_count = 0;
      attempt.correct_points = 0;
      attempt.negative_marking_penalty = 0;
      attempt.difficulty_score = 0;
      attempt.simple_correct = 0;
      attempt.simple_wrong = 0;
      attempt.medium_correct = 0;
      attempt.medium_wrong = 0;
      attempt.hard_correct = 0;
      attempt.hard_wrong = 0;
      attempt.incorrect_count = questionsToScore.length;
      attempt.unanswered_count = 0;
    } else {
      // Preserve actual calculated score (can be decimal e.g. 11.5, not clamped to 0)
      attempt.score = finalScore;
      attempt.max_score = 21;
      attempt.correct_count = correctCount;
      attempt.correct_points = correctPoints;
      attempt.negative_marking_penalty = negativeMarkingPenalty;
      attempt.difficulty_score = finalScore;
      attempt.simple_correct = simpleCorrect;
      attempt.simple_wrong = simpleWrong;
      attempt.medium_correct = mediumCorrect;
      attempt.medium_wrong = mediumWrong;
      attempt.hard_correct = hardCorrect;
      attempt.hard_wrong = hardWrong;
      attempt.incorrect_count = incorrectCount;
      attempt.unanswered_count = unansweredCount;
    }

    if (this.data.registrations[attempt.roll_number]) {
      this.data.registrations[attempt.roll_number].status = "COMPLETED";
    }

    this.saveDatabase();
    this.logAudit(
      final_status === "DISQUALIFIED"
        ? "CHEATING_DISQUALIFIED"
        : final_status === "TIME_EXPIRED"
        ? "AUTO_SUBMIT_EXPIRED"
        : final_status === "ABANDONED"
        ? "ATTEMPT_ABANDONED"
        : "MANUAL_SUBMISSION",
      `Attempt ${attempt_id} marked as ${final_status}. Correct: ${attempt.correct_count}/10, Final Score: ${attempt.score}/21 (Pos: +${attempt.correct_points}, Neg: -${attempt.negative_marking_penalty}, Hints: -${attempt.hint_penalty_total}), Time: ${attempt.time_taken_seconds}s. ${reason || ""}`,
      attempt.roll_number,
      attempt_id
    );

    return true;
  }

  // --- Host Reset Reattempt ---
  public resetAttemptForRoll(roll_number: string, reset_key: string): { success: boolean; message: string } {
    const roll = roll_number.trim().toUpperCase();
    if (hashKey(reset_key) !== this.data.config.reset_key_hash && reset_key !== "2008") {
      return { success: false, message: "Invalid Reset Key. Access denied." };
    }

    const latestAttemptId = this.data.roll_to_latest_attempt[roll];
    if (!latestAttemptId || !this.data.attempts[latestAttemptId]) {
      return { success: false, message: `No previous attempt record found for roll number ${roll}.` };
    }

    const prevAttempt = this.data.attempts[latestAttemptId];
    this.data.attempt_history.push({ ...prevAttempt });
    prevAttempt.status = "RESET";

    if (this.data.registrations[roll]) {
      this.data.registrations[roll].status = "RESET";
    }

    this.saveDatabase();
    this.logAudit("ATTEMPT_RESET", `Host authorized official re-attempt for student ${roll} using reset key. Previous attempt ${latestAttemptId} archived.`, roll, latestAttemptId);

    return {
      success: true,
      message: `Re-attempt successfully authorized for ${roll}. Student can now scan QR and start a fresh 10-minute attempt.`
    };
  }

  // --- Host Result Release ---
  public releaseResults(passkey: string): { success: boolean; message: string } {
    if (hashKey(passkey) !== this.data.config.release_key_hash && passkey !== "BOOYAHBOY") {
      return { success: false, message: "Invalid passkey. Access denied." };
    }

    this.data.config.results_released = true;
    this.saveDatabase();
    this.logAudit("RESULTS_RELEASED", "Official contest results released to public leaderboard by Event Host.");
    return { success: true, message: "Official results released successfully." };
  }

  public lockResults(passkey: string): { success: boolean; message: string } {
    if (hashKey(passkey) !== this.data.config.release_key_hash && passkey !== "BOOYAHBOY") {
      return { success: false, message: "Invalid passkey. Access denied." };
    }

    this.data.config.results_released = false;
    this.saveDatabase();
    this.logAudit("RESULTS_LOCKED", "Contest results locked by Event Host.");
    return { success: true, message: "Results locked." };
  }

  // --- Leaderboard Generation with Hierarchical Ranking ---
  // Ranking Order:
  // 1. Higher Final Score DESC (e.g. 21, 15, 14.5, 11.5, decimal supported)
  // 2. Lower Completion Time ASC (seconds)
  // 3. Earliest Server Submission Timestamp ASC
  public getLeaderboard(isHost = false): {
    results_released: boolean;
    stats: {
      total_participants: number;
      completed_count: number;
      average_correct: string;
      average_difficulty_score: string;
      average_time_formatted: string;
    };
    leaderboard: {
      rank: number;
      roll_number: string;
      raw_roll_number?: string;
      student_name: string;
      department: string;
      year: string;
      section: string;
      correct_count: number;
      difficulty_score: number;
      score: number; // Final Score
      max_score: number;
      correct_points: number;
      negative_marking_penalty: number;
      hint_penalty_total: number;
      simple_correct: number;
      simple_wrong: number;
      medium_correct: number;
      medium_wrong: number;
      hard_correct: number;
      hard_wrong: number;
      incorrect_count: number;
      unanswered_count: number;
      time_taken_seconds: number;
      time_formatted: string;
      submitted_at: string | null;
      status: AttemptStatus;
    }[];
  } {
    const totalParticipants = Object.keys(this.data.registrations).length;

    if (!isHost && !this.data.config.results_released) {
      return {
        results_released: false,
        stats: {
          total_participants: totalParticipants,
          completed_count: 0,
          average_correct: "0.0/10",
          average_difficulty_score: "0.0/21",
          average_time_formatted: "00:00"
        },
        leaderboard: []
      };
    }

    const validAttempts = Object.values(this.data.attempts).filter(
      (a) => a.status === "SUBMITTED" || a.status === "TIME_EXPIRED" || a.status === "ACTIVE" || a.status === "ABANDONED" || a.status === "DISQUALIFIED"
    );

    const entries = validAttempts.map((a) => {
      const reg = this.data.registrations[a.roll_number] || {
        student_name: "Contestant",
        department: "Mechanical",
        year: "2nd Year",
        section: "A"
      };

      const mins = Math.floor(a.time_taken_seconds / 60).toString().padStart(2, "0");
      const secs = (a.time_taken_seconds % 60).toString().padStart(2, "0");

      return {
        attempt_id: a.attempt_id,
        roll_number: isHost ? a.roll_number : maskRollNumber(a.roll_number),
        raw_roll_number: a.roll_number, // Used for self-rank lookup
        student_name: reg.student_name,
        department: reg.department,
        year: reg.year,
        section: reg.section,
        correct_count: a.correct_count || 0,
        difficulty_score: a.score ?? 0, // In new 21-point system, difficulty score = Final Score
        score: a.score ?? 0,
        max_score: 21,
        correct_points: a.correct_points || 0,
        negative_marking_penalty: a.negative_marking_penalty || 0,
        hint_penalty_total: a.hint_penalty_total || 0,
        simple_correct: a.simple_correct || 0,
        simple_wrong: a.simple_wrong || 0,
        medium_correct: a.medium_correct || 0,
        medium_wrong: a.medium_wrong || 0,
        hard_correct: a.hard_correct || 0,
        hard_wrong: a.hard_wrong || 0,
        incorrect_count: a.incorrect_count || 0,
        unanswered_count: a.unanswered_count || 0,
        time_taken_seconds: a.time_taken_seconds,
        time_formatted: `${mins}:${secs}`,
        submitted_at: a.submitted_at,
        status: a.status
      };
    });

    // Official 3-Tier Hierarchical Ranking Algorithm
    // Priority 1: Higher Final Score first (decimal supported)
    // Priority 2: Lower Completion Time first
    // Priority 3: Server submission timestamp tie-breaker
    entries.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (a.time_taken_seconds !== b.time_taken_seconds) {
        return a.time_taken_seconds - b.time_taken_seconds;
      }
      return (a.submitted_at || "").localeCompare(b.submitted_at || "");
    });

    const ranked = entries.map((e, idx) => ({
      rank: idx + 1,
      ...e
    }));

    // Stats calculations
    let totalCorrect = 0;
    let totalScore = 0;
    let totalTime = 0;
    let completedCount = 0;

    for (const e of ranked) {
      if (e.status === "SUBMITTED" || e.status === "TIME_EXPIRED") {
        totalCorrect += e.correct_count;
        totalScore += e.score;
        totalTime += e.time_taken_seconds;
        completedCount += 1;
      }
    }

    const avgCorrect = completedCount > 0 ? (totalCorrect / completedCount).toFixed(1) : "0.0";
    const avgScore = completedCount > 0 ? (totalScore / completedCount).toFixed(1) : "0.0";
    const avgTimeSec = completedCount > 0 ? Math.round(totalTime / completedCount) : 0;
    const avgTimeFormatted = `${Math.floor(avgTimeSec / 60).toString().padStart(2, "0")}:${(avgTimeSec % 60).toString().padStart(2, "0")}`;

    return {
      results_released: this.data.config.results_released,
      stats: {
        total_participants: totalParticipants,
        completed_count: completedCount,
        average_correct: `${avgCorrect}/10`,
        average_difficulty_score: `${avgScore}/21`,
        average_time_formatted: avgTimeFormatted
      },
      leaderboard: ranked
    };
  }

  // --- Question-Level Analytics for Host ---
  public getQuestionAnalytics() {
    const attempts = Object.values(this.data.attempts).filter(
      (a) => a.status === "SUBMITTED" || a.status === "TIME_EXPIRED" || a.status === "ACTIVE" || a.status === "ABANDONED"
    );

    const analyticsMap = new Map<string, {
      id: string;
      title: string;
      topic: string;
      difficulty: "EASY" | "MEDIUM" | "HARD";
      difficulty_points: number;
      language: "python" | "c";
      points: number;
      attempts_count: number;
      correct_count: number;
      incorrect_count: number;
      unanswered_count: number;
      accuracy_percentage: number;
    }>();

    for (const q of this.data.questions) {
      analyticsMap.set(q.id, {
        id: q.id,
        title: q.title,
        topic: q.topic,
        difficulty: q.difficulty,
        difficulty_points: q.difficulty === "EASY" ? 1 : q.difficulty === "MEDIUM" ? 2 : 3,
        language: q.language,
        points: q.points,
        attempts_count: 0,
        correct_count: 0,
        incorrect_count: 0,
        unanswered_count: 0,
        accuracy_percentage: 0
      });
    }

    for (const a of attempts) {
      const assignedIds = a.assigned_question_ids || [];
      for (const qId of assignedIds) {
        const item = analyticsMap.get(qId);
        if (item) {
          item.attempts_count += 1;
          const userChoice = a.answers[qId];
          const q = this.questionMap.get(qId);
          const mapping = a.shuffled_options?.[qId];
          const correctChoice = mapping ? mapping.correct_display_id : q?.correct_option_id;

          if (!userChoice) {
            item.unanswered_count += 1;
          } else if (userChoice === correctChoice) {
            item.correct_count += 1;
          } else {
            item.incorrect_count += 1;
          }
        }
      }
    }

    return Array.from(analyticsMap.values()).map((item) => {
      item.accuracy_percentage = item.attempts_count > 0 ? Math.round((item.correct_count / item.attempts_count) * 100) : 0;
      return item;
    });
  }

  // --- Host Dashboard Metrics ---
  public getHostDashboardData() {
    const registrations = Object.values(this.data.registrations);
    const attempts = Object.values(this.data.attempts);

    const counts = {
      registered: registrations.length,
      started: attempts.length,
      active: attempts.filter((a) => a.status === "ACTIVE" || a.status === "STARTED").length,
      submitted: attempts.filter((a) => a.status === "SUBMITTED").length,
      time_expired: attempts.filter((a) => a.status === "TIME_EXPIRED").length,
      abandoned: attempts.filter((a) => a.status === "ABANDONED").length,
      reset: this.data.attempt_history.length
    };

    return {
      config: this.getConfig(),
      qr_session: this.getQRSession(),
      counts,
      registrations,
      attempts: attempts.map((a) => {
        const reg = this.data.registrations[a.roll_number];
        return {
          ...a,
          student_name: reg?.student_name || "Unknown",
          department: reg?.department || "Mechanical",
          year: reg?.year || "N/A"
        };
      }),
      recent_logs: this.data.audit_logs.slice(0, 50),
      questions: this.data.questions
    };
  }

  public purgeAllContestData(passkey: string): { success: boolean; message: string } {
    if (hashKey(passkey) !== this.data.config.release_key_hash && passkey !== "BOOYAHBOY") {
      return { success: false, message: "Invalid passkey. Access denied." };
    }

    const initial = this.getInitialData();
    this.data.registrations = {};
    this.data.attempts = {};
    this.data.roll_to_latest_attempt = {};
    this.data.attempt_history = [];
    this.data.qr_session = initial.qr_session;
    this.data.config.results_released = false;
    this.data.config.is_active = true;
    this.data.audit_logs = [
      {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        event_type: "CONTEST_STATUS_CHANGED",
        details: `All previous test data purged. System initialized for live competition (${MASTER_QUESTION_POOL.length} master questions loaded).`
      }
    ];
    this.saveDatabase();
    return { success: true, message: "Contest database successfully wiped. Fresh clean contest state initialized." };
  }

  public getAuditLogs(): AuditLog[] {
    return this.data.audit_logs;
  }
}

function maskRollNumber(roll: string): string {
  if (roll.length <= 4) return roll;
  return `${roll.slice(0, 3)}****${roll.slice(-2)}`;
}

export const contestDb = new ContestDatabase();
