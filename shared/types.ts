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
  question_id?: string;
  display_options: { id: "A" | "B" | "C" | "D"; text: string }[];
  correct_display_id: "A" | "B" | "C" | "D";
  display_to_original?: Record<string, string>;
  original_to_display?: Record<string, string>;
}

export interface Attempt {
  attempt_id: string;
  registration_id: string;
  roll_number: string;
  student_name?: string;
  contest_id: string;
  started_at: string;
  expires_at: string;
  submitted_at: string | null;
  status: AttemptStatus;
  assigned_question_ids: string[];
  shuffled_options?: Record<string, ShuffledQuestionOptionMapping>;
  answers: Record<string, string>;
  hints_used: Record<string, number>;
  hint_penalty_total: number;
  tab_switch_count: number;
  back_button_triggers: number;
  score: number;
  max_score: number;
  correct_count: number;
  correct_points: number;
  negative_marking_penalty: number;
  difficulty_score: number;
  simple_correct: number;
  simple_wrong: number;
  medium_correct: number;
  medium_wrong: number;
  hard_correct: number;
  hard_wrong: number;
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
  reset_key_hash: string;
  release_key_hash: string;
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
  correct_option_id: string;
  hint?: string;
  question_family_id: string;
  category: string;
  sub_category: string;
  bug_type: string;
  concept: string;
}

export interface DatabaseSchema {
  config: ContestConfig;
  qr_session: QRSession;
  registrations: Record<string, Registration>;
  attempts: Record<string, Attempt>;
  roll_to_latest_attempt: Record<string, string>;
  attempt_history: Attempt[];
  audit_logs: AuditLog[];
  questions: QuestionDef[];
}
