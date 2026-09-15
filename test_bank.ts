import { generateQuestionBank } from "./server/question_bank";

const bank = generateQuestionBank();
console.log("==========================================");
console.log("QUESTION BANK VERIFICATION SUMMARY");
console.log("==========================================");
console.log("Total Questions Generated:", bank.length);

const easy = bank.filter((q) => q.difficulty === "EASY");
const med = bank.filter((q) => q.difficulty === "MEDIUM");
const hard = bank.filter((q) => q.difficulty === "HARD");

console.log(`Easy:   ${easy.length} questions (10 pts each)`);
console.log(`Medium: ${med.length} questions (15 pts each)`);
console.log(`Hard:   ${hard.length} questions (20 pts each)`);

const pyCount = bank.filter((q) => q.language === "python").length;
const cCount = bank.filter((q) => q.language === "c").length;
console.log(`Python: ${pyCount} questions`);
console.log(`C:      ${cCount} questions`);

const uniqueIds = new Set(bank.map((q) => q.id));
console.log("Unique Question IDs:", uniqueIds.size);

// Verify every question has expected output, current output, and 4 options
let errors = 0;
bank.forEach((q, idx) => {
  if (!q.expected_output || !q.current_output || q.options.length !== 4 || !q.correct_option_id) {
    console.error(`Invalid question at index ${idx}:`, q.id);
    errors++;
  }
  if (q.difficulty === "HARD" && !q.hint) {
    console.error(`Missing hint for hard question:`, q.id);
    errors++;
  }
});

console.log("Validation Errors:", errors);
console.log("==========================================");
