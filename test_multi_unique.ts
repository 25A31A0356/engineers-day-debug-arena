import { contestDb } from "./server/db";

console.log("==================================================");
console.log("SIMULATING 100 PARTICIPANTS UNIQUE ASSIGNMENT TEST");
console.log("==================================================");

const NUM_PARTICIPANTS = 100;
const assignedSets: Set<string>[] = [];
const allAssignedQuestions: string[] = [];

// Ensure QR is active
contestDb.activateQR();
const qr = contestDb.getQRSession();
const batchId = Date.now().toString().slice(-4);

for (let i = 1; i <= NUM_PARTICIPANTS; i++) {
  const roll = `MECH${batchId}${i.toString().padStart(3, "0")}`;
  const name = `Mechanical Contestant #${i}`;

  // 1. Register
  const regRes = contestDb.registerStudent({
    roll_number: roll,
    student_name: name,
    department: "Mechanical Engineering",
    year: "2nd Year",
    section: i % 2 === 0 ? "A" : "B"
  });

  if (!regRes.success) {
    console.error(`Failed to register ${roll}:`, regRes.message);
    process.exit(1);
  }

  // 2. Start Attempt
  const startRes = contestDb.startAttempt(roll, qr.token);
  if (!startRes.success || !startRes.attempt || !startRes.questions) {
    console.error(`Failed to start attempt for ${roll}:`, startRes.message);
    process.exit(1);
  }

  const questions = startRes.questions;
  if (questions.length !== 10) {
    console.error(`Expected 10 questions for ${roll}, got ${questions.length}`);
    process.exit(1);
  }

  const easy = questions.filter((q) => q.difficulty === "EASY").length;
  const med = questions.filter((q) => q.difficulty === "MEDIUM").length;
  const hard = questions.filter((q) => q.difficulty === "HARD").length;

  if (easy !== 3 || med !== 3 || hard !== 4) {
    console.error(`Invalid composition for ${roll}: Easy=${easy}, Med=${med}, Hard=${hard}`);
    process.exit(1);
  }

  const qIds = questions.map((q) => q.id);
  const participantSet = new Set(qIds);
  assignedSets.push(participantSet);
  allAssignedQuestions.push(...qIds);

  // 3. Save some answers and submit
  contestDb.saveAnswer(startRes.attempt.attempt_id, qIds[0], "A");
  contestDb.saveAnswer(startRes.attempt.attempt_id, qIds[1], "A");
  contestDb.submitAttempt(startRes.attempt.attempt_id);
}

console.log(`Successfully generated and tested attempts for ${NUM_PARTICIPANTS} participants.`);
console.log(`Total questions assigned: ${allAssignedQuestions.length}`);

// Check for question overlap between ANY two participants among the 100
let overlaps = 0;
for (let i = 0; i < NUM_PARTICIPANTS; i++) {
  for (let j = i + 1; j < NUM_PARTICIPANTS; j++) {
    const setA = assignedSets[i];
    const setB = assignedSets[j];
    for (const qId of setA) {
      if (setB.has(qId)) {
        console.error(`OVERLAP DETECTED between Contestant ${i + 1} and ${j + 1} on question ${qId}!`);
        overlaps++;
      }
    }
  }
}

console.log(`Total Question Overlaps across all 100 participants: ${overlaps}`);
if (overlaps === 0) {
  console.log("✅ PERFECT: ZERO question repetition! Every single participant received a 100% unique set of 10 questions!");
}

const totalUniqueQuestionsUsed = new Set(allAssignedQuestions).size;
console.log(`Total Unique Questions Distributed: ${totalUniqueQuestionsUsed} / 1000`);

const lb = contestDb.getLeaderboard(true);
console.log(`Leaderboard entries: ${lb.leaderboard.length}`);
console.log("Top 3 Podium:", lb.leaderboard.slice(0, 3).map((e) => ({ rank: e.rank, roll: e.roll_number, score: e.score })));
console.log("==================================================");
