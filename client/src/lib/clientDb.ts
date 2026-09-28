import { generateQuestionBank } from "../../../server/question_bank";
import type {
  Attempt,
  AttemptStatus,
  AuditLog,
  ContestConfig,
  DatabaseSchema,
  QRSession,
  QuestionDef,
  Registration,
  ShuffledQuestionOptionMapping
} from "@shared/types";

const STORAGE_KEY = "engineers_day_contest_db_v2";

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

const DISTRIBUTION_PATTERNS: DistributionPlan[] = [
  { easyC: 2, easyPy: 1, medC: 1, medPy: 2, hardC: 2, hardPy: 2 },
  { easyC: 1, easyPy: 2, medC: 2, medPy: 1, hardC: 2, hardPy: 2 },
  { easyC: 2, easyPy: 1, medC: 2, medPy: 1, hardC: 1, hardPy: 3 },
  { easyC: 1, easyPy: 2, medC: 1, medPy: 2, hardC: 3, hardPy: 1 }
];

function generateRandomHex(length = 8): string {
  const chars = "0123456789ABCDEF";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[Math.floor(Math.random() * chars.length)];
  }
  return result;
}

export class ClientContestDatabase {
  private data: DatabaseSchema;
  private questionMap: Map<string, QuestionDef>;

  constructor() {
    this.questionMap = QUESTION_MAP;
    this.data = this.loadDatabase();
  }

  private getInitialData(): DatabaseSchema {
    const initialToken = generateRandomHex(8).toUpperCase();
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
        reset_key_hash: "2008",
        release_key_hash: "BOOYAHBOY"
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
          id: `LOG-${Date.now()}`,
          timestamp: new Date().toISOString(),
          event_type: "CONTEST_STATUS_CHANGED",
          details: `In-browser client database initialized with ${MASTER_QUESTION_POOL.length} master questions. 15-min timer, negative marking enabled.`
        }
      ],
      questions: MASTER_QUESTION_POOL
    };
  }

  private loadDatabase(): DatabaseSchema {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        const stored = window.localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as DatabaseSchema;
          parsed.questions = MASTER_QUESTION_POOL;
          if (parsed.config) {
            parsed.config.duration_minutes = 15;
            parsed.config.hint_penalty_points = 1;
          }
          return parsed;
        }
      }
    } catch (e) {
      console.error("Failed to load local contest database, using defaults:", e);
    }
    const initial = this.getInitialData();
    this.saveDatabase(initial);
    return initial;
  }

  private saveDatabase(state = this.data) {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        // Save without full questions array to keep storage lightweight
        const toSave = { ...state, questions: [] };
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      }
    } catch (e) {
      console.error("Error saving local contest database:", e);
    }
  }

  public logAudit(
    event_type: AuditLog["event_type"],
    details: string,
    roll_number?: string,
    attempt_id?: string,
    metadata?: any
  ) {
    const log: AuditLog = {
      id: `LOG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp: new Date().toISOString(),
      event_type,
      roll_number: roll_number?.toUpperCase(),
      attempt_id,
      details,
      metadata
    };
    this.data.audit_logs.unshift(log);
    if (this.data.audit_logs.length > 500) {
      this.data.audit_logs.length = 500;
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

  public registerStudent(data: {
    roll_number: string;
    student_name: string;
    department?: string;
    year?: string;
    section?: string;
  }): { success: boolean; message: string; registration?: Registration } {
    const roll = data.roll_number.trim().toUpperCase();
    if (!roll) {
      return { success: false, message: "Roll Number is required." };
    }
    if (!data.student_name?.trim()) {
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
      department: data.department?.trim() || "Mechanical Engineering",
      year: data.year?.trim() || "2nd Year",
      section: data.section?.trim() || "A",
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

  public getQRSession(): QRSession {
    return { ...this.data.qr_session };
  }

  public generateQR(activateImmediately = true): QRSession {
    const token = generateRandomHex(8).toUpperCase();
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

  public recordRealScan(token: string, clientIp?: string, userAgent?: string): { success: boolean; scan_count: number; message: string } {
    if (this.data.qr_session.status !== "ACTIVE" || this.data.qr_session.token !== token.toUpperCase().trim()) {
      return { success: false, scan_count: this.data.qr_session.scan_count, message: "Invalid or inactive QR token." };
    }
    this.data.qr_session.scan_count += 1;
    this.saveDatabase();
    this.logAudit(
      "QR_SCANNED",
      `Verified real QR code scan. Live verified scan count: ${this.data.qr_session.scan_count}`,
      undefined,
      undefined,
      { clientIp, userAgent }
    );
    return { success: true, scan_count: this.data.qr_session.scan_count, message: "Real scan verified and recorded." };
  }

  public assignUniqueQuestionsForAttempt(attemptIndex: number, _rollNumber: string): string[] {
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

    // 1. Easy Questions (Total = 3)
    pickFromPool(EASY_C_KEYS, EASY_C_FAMILIES, plan.easyC, 3);
    pickFromPool(EASY_PY_KEYS, EASY_PY_FAMILIES, plan.easyPy, 3);

    // 2. Medium Questions (Total = 3)
    pickFromPool(MEDIUM_C_KEYS, MEDIUM_C_FAMILIES, plan.medC, 3);
    pickFromPool(MEDIUM_PY_KEYS, MEDIUM_PY_FAMILIES, plan.medPy, 3);

    // 3. Hard Questions (Total = 4)
    pickFromPool(HARD_C_KEYS, HARD_C_FAMILIES, plan.hardC, 4);
    pickFromPool(HARD_PY_KEYS, HARD_PY_FAMILIES, plan.hardPy, 4);

    return assignedIds;
  }

  public verifyEntry(roll_number: string, token?: string): {
    can_start: boolean;
    reason?: string;
    registration?: Registration;
    existing_attempt?: Attempt;
    requires_reattempt_reset?: boolean;
  } {
    const roll = roll_number.trim().toUpperCase();

    if (!this.data.config.is_active) {
      return { can_start: false, reason: "The contest is currently paused or inactive." };
    }

    if (this.data.qr_session.status !== "ACTIVE" || (token && token.toUpperCase() !== this.data.qr_session.token)) {
      return { can_start: false, reason: "Contest access is currently closed or invalid QR session." };
    }

    const reg = this.data.registrations[roll];
    if (!reg) {
      return {
        can_start: false,
        reason: `Roll Number ${roll} is NOT registered. Please register at the registration desk first.`
      };
    }

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
      student_name: attempt.student_name || this.data.registrations[attempt.roll_number]?.student_name,
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

    const durationSeconds = (this.data.config.duration_minutes || 15) * 60;
    const startTime = new Date();
    const expiryTime = new Date(startTime.getTime() + durationSeconds * 1000);

    const attemptIndex = Object.keys(this.data.attempts).length;
    const assignedQuestionIds = this.assignUniqueQuestionsForAttempt(attemptIndex, roll);

    // Randomize presentation order
    for (let i = assignedQuestionIds.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [assignedQuestionIds[i], assignedQuestionIds[j]] = [assignedQuestionIds[j], assignedQuestionIds[i]];
    }

    // Generate randomized option shuffling
    const shuffledOptions: Record<string, ShuffledQuestionOptionMapping> = {};
    for (const qId of assignedQuestionIds) {
      const q = this.questionMap.get(qId);
      if (q) {
        const rawOptions = [...q.options];
        for (let i = rawOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [rawOptions[i], rawOptions[j]] = [rawOptions[j], rawOptions[i]];
        }

        const letters: ("A" | "B" | "C" | "D")[] = ["A", "B", "C", "D"];
        let correctDisplayId: "A" | "B" | "C" | "D" = "A";

        const displayOptions = rawOptions.map((opt, oIdx) => {
          const displayLetter = letters[oIdx];
          if (opt.id === q.correct_option_id) {
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
      student_name: verify.registration.student_name,
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

    this.logAudit("CONTEST_STARTED", `Contestant ${roll} started official 15-minute contest with ${assignedQuestionIds.length} unique questions.`, roll, attemptId);

    return {
      success: true,
      message: "Contest started successfully.",
      attempt: this.sanitizeAttemptForContestant(attempt),
      questions: this.getAttemptPublicQuestions(attemptId)
    };
  }

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
        points: q.points,
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

  public getHint(attempt_id: string, question_id: string): {
    success: boolean;
    hint?: string;
    hints_used_count?: number;
    hint_penalty_total?: number;
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

    if (q.difficulty !== "HARD") {
      return {
        success: false,
        message: "Hints are strictly available ONLY for Hard difficulty questions."
      };
    }

    if (!attempt.hints_used) {
      attempt.hints_used = {};
    }
    attempt.hints_used[question_id] = (attempt.hints_used[question_id] || 0) + 1;
    attempt.hint_penalty_total = (attempt.hint_penalty_total || 0) + 1;

    this.saveDatabase();
    this.logAudit(
      "HINT_USED",
      `Contestant ${attempt.roll_number} requested hint on Hard question ${question_id}.`,
      attempt.roll_number,
      attempt_id
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

  public finalizeAttempt(attempt_id: string, final_status: AttemptStatus, reason?: string): boolean {
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
      ? (attempt.assigned_question_ids.map((id) => this.questionMap.get(id)).filter(Boolean) as QuestionDef[])
      : this.data.questions.slice(0, 10);

    for (const q of questionsToScore) {
      const userChoice = attempt.answers[q.id];
      const mapping = attempt.shuffled_options?.[q.id];
      const correctChoice = mapping ? mapping.correct_display_id : q.correct_option_id;

      if (!userChoice) {
        unansweredCount += 1;
      } else if (userChoice === correctChoice) {
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
        incorrectCount += 1;
        if (q.difficulty === "EASY") {
          simpleWrong += 1;
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
      `Attempt ${attempt_id} marked as ${final_status}. Correct: ${attempt.correct_count}/10, Final Score: ${attempt.score}/21. ${reason || ""}`,
      attempt.roll_number,
      attempt_id
    );

    return true;
  }

  public resetAttemptForRoll(roll_number: string, reset_key: string): { success: boolean; message: string } {
    const roll = roll_number.trim().toUpperCase();
    if (reset_key !== "2008") {
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
    this.logAudit("ATTEMPT_RESET", `Host authorized re-attempt for ${roll} using reset key.`, roll, latestAttemptId);

    return {
      success: true,
      message: `Re-attempt successfully authorized for ${roll}. Student can now scan QR and start a fresh attempt.`
    };
  }

  public releaseResults(passkey: string): { success: boolean; message: string } {
    if (passkey !== "BOOYAHBOY") {
      return { success: false, message: "Invalid passkey. Access denied." };
    }

    this.data.config.results_released = true;
    this.saveDatabase();
    this.logAudit("RESULTS_RELEASED", "Official contest results released to public leaderboard by Event Host.");
    return { success: true, message: "Official results released successfully." };
  }

  public lockResults(passkey: string): { success: boolean; message: string } {
    if (passkey !== "BOOYAHBOY") {
      return { success: false, message: "Invalid passkey. Access denied." };
    }

    this.data.config.results_released = false;
    this.saveDatabase();
    this.logAudit("RESULTS_LOCKED", "Contest results locked by Event Host.");
    return { success: true, message: "Results locked." };
  }

  public getLeaderboard(isHost = false) {
    const attemptsList = Object.values(this.data.attempts).filter(
      (a) => a.status === "SUBMITTED" || a.status === "TIME_EXPIRED" || a.status === "DISQUALIFIED" || a.status === "ABANDONED"
    );

    // Sort: 1) Score DESC, 2) Time Taken ASC, 3) Submitted At ASC
    attemptsList.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (a.time_taken_seconds !== b.time_taken_seconds) {
        return a.time_taken_seconds - b.time_taken_seconds;
      }
      return new Date(a.submitted_at || 0).getTime() - new Date(b.submitted_at || 0).getTime();
    });

    const leaderboard = attemptsList.map((a, idx) => {
      const reg = this.data.registrations[a.roll_number];
      const mins = Math.floor(a.time_taken_seconds / 60);
      const secs = a.time_taken_seconds % 60;
      const timeFormatted = `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;

      const maskedRoll = isHost
        ? a.roll_number
        : `${a.roll_number.slice(0, 4)}••••${a.roll_number.slice(-2)}`;

      const displayName = reg ? reg.student_name : a.student_name || "Contestant";

      return {
        rank: idx + 1,
        roll_number: maskedRoll,
        raw_roll_number: a.roll_number,
        student_name: isHost ? displayName : this.data.config.results_released ? displayName : `Participant #${idx + 1}`,
        department: reg ? reg.department : "Mechanical Engineering",
        year: reg ? reg.year : "2nd Year",
        section: reg ? reg.section : "A",
        correct_count: a.correct_count,
        difficulty_score: a.score,
        score: a.score,
        max_score: 21,
        correct_points: a.correct_points || 0,
        negative_marking_penalty: a.negative_marking_penalty || 0,
        hint_penalty_total: a.hint_penalty_total || 0,
        simple_correct: a.simple_correct,
        simple_wrong: a.simple_wrong || 0,
        medium_correct: a.medium_correct,
        medium_wrong: a.medium_wrong || 0,
        hard_correct: a.hard_correct,
        hard_wrong: a.hard_wrong || 0,
        incorrect_count: a.incorrect_count,
        unanswered_count: a.unanswered_count,
        time_taken_seconds: a.time_taken_seconds,
        time_formatted: timeFormatted,
        submitted_at: a.submitted_at,
        status: a.status
      };
    });

    const totalParticipants = Object.keys(this.data.registrations).length;
    const completedCount = leaderboard.length;
    const avgScore = completedCount > 0
      ? (leaderboard.reduce((acc, curr) => acc + curr.score, 0) / completedCount).toFixed(1)
      : "0.0";
    const avgCorrect = completedCount > 0
      ? (leaderboard.reduce((acc, curr) => acc + curr.correct_count, 0) / completedCount).toFixed(1)
      : "0.0";
    const avgTimeSecs = completedCount > 0
      ? Math.round(leaderboard.reduce((acc, curr) => acc + curr.time_taken_seconds, 0) / completedCount)
      : 0;
    const avgMins = Math.floor(avgTimeSecs / 60);
    const avgSecs = avgTimeSecs % 60;
    const avgTimeFormatted = `${avgMins.toString().padStart(2, "0")}:${avgSecs.toString().padStart(2, "0")}`;

    return {
      results_released: this.data.config.results_released,
      stats: {
        total_participants: totalParticipants,
        completed_count: completedCount,
        average_correct: avgCorrect,
        average_difficulty_score: avgScore,
        average_time_formatted: avgTimeFormatted
      },
      leaderboard: isHost || this.data.config.results_released ? leaderboard : leaderboard.slice(0, 10)
    };
  }

  public getHostDashboardData() {
    const stats = {
      total_registered: Object.keys(this.data.registrations).length,
      active_attempts: Object.values(this.data.attempts).filter((a) => a.status === "ACTIVE" || a.status === "STARTED").length,
      completed_attempts: Object.values(this.data.attempts).filter((a) => a.status === "SUBMITTED" || a.status === "TIME_EXPIRED").length,
      disqualified_attempts: Object.values(this.data.attempts).filter((a) => a.status === "DISQUALIFIED").length,
      total_hints_used: Object.values(this.data.attempts).reduce((acc, a) => acc + (a.hint_penalty_total || 0), 0)
    };

    return {
      config: this.getConfig(),
      qr_session: this.getQRSession(),
      registrations: Object.values(this.data.registrations),
      attempts: Object.values(this.data.attempts),
      audit_logs: this.data.audit_logs,
      stats
    };
  }

  public getQuestionAnalytics() {
    const attempts = Object.values(this.data.attempts).filter((a) => a.status === "SUBMITTED" || a.status === "TIME_EXPIRED");
    return this.data.questions.slice(0, 20).map((q) => {
      let attemptsCount = 0;
      let correctCount = 0;
      for (const att of attempts) {
        if (att.answers && att.answers[q.id]) {
          attemptsCount += 1;
          const mapping = att.shuffled_options?.[q.id];
          const correctChoice = mapping ? mapping.correct_display_id : q.correct_option_id;
          if (att.answers[q.id] === correctChoice) {
            correctCount += 1;
          }
        }
      }
      return {
        question_id: q.id,
        title: q.title,
        difficulty: q.difficulty,
        attempts: attemptsCount,
        correct: correctCount,
        accuracy: attemptsCount > 0 ? `${Math.round((correctCount / attemptsCount) * 100)}%` : "0%"
      };
    });
  }

  public purgeAllContestData(passkey: string): { success: boolean; message: string } {
    if (passkey !== "BOOYAHBOY") {
      return { success: false, message: "Invalid passkey. Purge aborted." };
    }

    this.data.registrations = {};
    this.data.attempts = {};
    this.data.roll_to_latest_attempt = {};
    this.data.attempt_history = [];
    this.data.qr_session.scan_count = 0;
    this.data.audit_logs = [
      {
        id: `LOG-${Date.now()}`,
        timestamp: new Date().toISOString(),
        event_type: "CONTEST_STATUS_CHANGED",
        details: "Contest database purged and reset to pristine state by Event Host."
      }
    ];

    this.saveDatabase();
    return { success: true, message: "Contest database purged successfully. Ready for official start." };
  }
}

export const clientContestDb = new ClientContestDatabase();
