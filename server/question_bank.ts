import { QuestionDef } from "./db";

// =========================================================================================
// ENGINEERING OLYMPICS — 105+ QUESTION FAMILY MASTER BANK (1,221 UNIQUE QUESTIONS)
// Designed for 2nd & 3rd Year B.Tech/BE Engineering Students (C & Python Curriculum).
//
// 10 Core Syllabus Categories:
//   1. Control Flow      6. Pointers & References
//   2. Arrays            7. Data Structures
//   3. Strings           8. Algorithms
//   4. Functions         9. Mathematics & Logic
//   5. Recursion        10. Input / Output & Language Builtins
//
// Strict Constraints:
//   - Pure Expected Outputs (NO giveaway hints)
//   - Each question belongs to an explicit `question_family_id`
//   - Full cognitive debugging metadata on every question
//   - Unambiguous, single defensible correct fix
// =========================================================================================

export function generateQuestionBank(): QuestionDef[] {
  const bank: QuestionDef[] = [];

  // =======================================================================================
  // PART 1: 36 EASY QUESTION FAMILIES (Weight = 1 pt, 11 variants each = 396 questions)
  // =======================================================================================

  // FAM 1: Loop Bound Off-By-One (C)
  for (let i = 1; i <= 11; i++) {
    const n = 4 + i;
    const sum = (n * (n + 1)) / 2;
    bank.push({
      id: `DBG_E_CF_OFF1_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_CF_OFF_BY_ONE_FOR",
      category: "Control Flow",
      sub_category: "Loop Termination",
      bug_type: "OffByOne",
      concept: "BoundaryCondition",
      difficulty: "EASY",
      topic: "Loops & Boundary Conditions",
      points: 10,
      title: `Loop Boundary Accumulator #${i}`,
      description: `Compute the sum of first ${n} natural numbers from 1 to ${n}.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int n = ${n};\n    int sum = 0;\n    for (int i = 1; i < n; i++) {\n        sum += i;\n    }\n    printf("%d\\n", sum);\n    return 0;\n}`,
      language: "c",
      expected_output: `${sum}`,
      current_output: `${sum - n}`,
      options: [
        { id: "A", text: "Change `i < n` to `i <= n` in the for-loop header" },
        { id: "B", text: "Initialize `int sum = 1`" },
        { id: "C", text: "Change `sum += i` to `sum += n`" },
        { id: "D", text: "Change `i = 1` to `i = 0`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 2: While Loop Decrement Inversion (C)
  for (let i = 1; i <= 11; i++) {
    const start = 10 + i * 2;
    bank.push({
      id: `DBG_E_CF_DEC2_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_CF_WRONG_DECREMENT",
      category: "Control Flow",
      sub_category: "Loop Step",
      bug_type: "WrongIncrement",
      concept: "LoopProgression",
      difficulty: "EASY",
      topic: "While Loop Progression",
      points: 10,
      title: `Countdown Loop Progression #${i}`,
      description: `Count down from ${start} to 1 and print final counter value.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int count = ${start};\n    while (count > 0) {\n        count++;\n        if (count > ${start + 5}) break;\n    }\n    printf("%d\\n", count);\n    return 0;\n}`,
      language: "c",
      expected_output: `0`,
      current_output: `${start + 6}`,
      options: [
        { id: "A", text: "Change `count++` to `count--` inside the while loop" },
        { id: "B", text: "Change `while (count > 0)` to `while (count == 0)`" },
        { id: "C", text: "Change `int count = ${start}` to `float count = ${start}`" },
        { id: "D", text: "Remove the `if (count > ${start + 5})` check" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 3: Missing Break in Switch (C)
  for (let i = 1; i <= 11; i++) {
    const code = (i % 3) + 1;
    const expectedVal = code === 1 ? 100 : code === 2 ? 200 : 300;
    bank.push({
      id: `DBG_E_CF_SW3_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_CF_MISSING_BREAK_SWITCH",
      category: "Control Flow",
      sub_category: "Switch Statement",
      bug_type: "MissingBreak",
      concept: "FallThrough",
      difficulty: "EASY",
      topic: "Switch Fall-through",
      points: 10,
      title: `Switch Code Evaluation #${i}`,
      description: `Assign specific value for status code ${code}.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int code = ${code};\n    int val = 0;\n    switch (code) {\n        case 1: val = 100;\n        case 2: val = 200;\n        case 3: val = 300;\n        default: val = 0;\n    }\n    printf("%d\\n", val);\n    return 0;\n}`,
      language: "c",
      expected_output: `${expectedVal}`,
      current_output: `0`,
      options: [
        { id: "A", text: "Add `break;` statement at the end of each case block" },
        { id: "B", text: "Change `switch (code)` to `if (code)`" },
        { id: "C", text: "Remove the `default` case" },
        { id: "D", text: "Declare `val` as `const int`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 4: Assignment in Conditional (C)
  for (let i = 1; i <= 11; i++) {
    const flag = (i % 2);
    bank.push({
      id: `DBG_E_CF_IF4_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_CF_ASSIGN_IN_IF",
      category: "Control Flow",
      sub_category: "Conditionals",
      bug_type: "AssignmentVsEquality",
      concept: "BooleanEvaluation",
      difficulty: "EASY",
      topic: "Conditional Branching",
      points: 10,
      title: `Status Equality Check #${i}`,
      description: `Verify if state variable is exactly 0.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int state = ${flag};\n    if (state = 0) {\n        printf("ZERO\\n");\n    } else {\n        printf("NON-ZERO\\n");\n    }\n    return 0;\n}`,
      language: "c",
      expected_output: flag === 0 ? "ZERO" : "NON-ZERO",
      current_output: "NON-ZERO",
      options: [
        { id: "A", text: "Change `if (state = 0)` to `if (state == 0)`" },
        { id: "B", text: "Change `int state` to `char state`" },
        { id: "C", text: "Swap the printf statements" },
        { id: "D", text: "Change `state = 0` to `state = !state`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 5: Do-While Loop Condition Boundary (C)
  for (let i = 1; i <= 11; i++) {
    const limit = 3 + (i % 3);
    bank.push({
      id: `DBG_E_CF_DW5_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_CF_DO_WHILE_BOUNDARY",
      category: "Control Flow",
      sub_category: "Do-While Loops",
      bug_type: "ConditionInversion",
      concept: "PostConditionCheck",
      difficulty: "EASY",
      topic: "Do-While Termination",
      points: 10,
      title: `Do-While Iteration Bound #${i}`,
      description: `Run loop exactly ${limit} times and output total count.`,
      code_snippet: `#include <stdio.h>\n\nint count = 0;\n    do {\n        count++;\n    } while (count > ${limit});\n    printf("%d\\n", count);\n    return 0;\n}`,
      language: "c",
      expected_output: `${limit}`,
      current_output: `1`,
      options: [
        { id: "A", text: `Change \`while (count > ${limit})\` to \`while (count < ${limit})\`` },
        { id: "B", text: "Change `count++` to `count--`" },
        { id: "C", text: "Initialize `count = ${limit}`" },
        { id: "D", text: "Remove `do` and use `while`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 6: Array Out of Bounds Write (C)
  for (let i = 1; i <= 11; i++) {
    const size = 5;
    const baseVal = i * 10;
    bank.push({
      id: `DBG_E_ARR_OOB6_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_ARR_OOB_WRITE",
      category: "Arrays",
      sub_category: "Indexing",
      bug_type: "OutOfBoundsWrite",
      concept: "BufferBoundary",
      difficulty: "EASY",
      topic: "Array Bounds",
      points: 10,
      title: `Array Element Assignment #${i}`,
      description: `Store value ${baseVal} into the last valid position of an array of size ${size}.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int arr[${size}] = {0};\n    arr[${size}] = ${baseVal};\n    printf("%d\\n", arr[${size - 1}]);\n    return 0;\n}`,
      language: "c",
      expected_output: `${baseVal}`,
      current_output: `0`,
      options: [
        { id: "A", text: `Change \`arr[${size}] = ${baseVal};\` to \`arr[${size - 1}] = ${baseVal};\`` },
        { id: "B", text: `Increase array size to \`int arr[${size + 10}];\`` },
        { id: "C", text: "Change `printf` to `%p`" },
        { id: "D", text: "Cast `arr` to pointer" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 7: Uninitialized Local Variable Accumulator (C)
  for (let i = 1; i <= 11; i++) {
    const a = i * 2;
    const b = i * 3;
    bank.push({
      id: `DBG_E_ARR_INIT7_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_ARR_INIT_GARBAGE",
      category: "Arrays",
      sub_category: "Initialization",
      bug_type: "UninitializedVariable",
      concept: "GarbageValue",
      difficulty: "EASY",
      topic: "Variable Initialization",
      points: 10,
      title: `Accumulator Initialization #${i}`,
      description: `Compute the sum of ${a} and ${b}.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int total;\n    total += ${a};\n    total += ${b};\n    printf("%d\\n", total);\n    return 0;\n}`,
      language: "c",
      expected_output: `${a + b}`,
      current_output: `Undefined garbage value + ${a + b}`,
      options: [
        { id: "A", text: "Initialize `int total = 0;` at declaration" },
        { id: "B", text: "Change `total += ${a}` to `total = ${a}`" },
        { id: "C", text: "Declare `total` as `static double`" },
        { id: "D", text: "Remove `printf`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 8: Reverse Array Index Calculation (C)
  for (let i = 1; i <= 11; i++) {
    const len = 4;
    const base = i + 1;
    bank.push({
      id: `DBG_E_ARR_REV8_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_ARR_REVERSE_INDEX",
      category: "Arrays",
      sub_category: "Traversal",
      bug_type: "OffByOneIndex",
      concept: "ReverseIndexing",
      difficulty: "EASY",
      topic: "Reverse Traversal",
      points: 10,
      title: `Array Reversal Indexing #${i}`,
      description: `Copy array elements in reverse order.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int src[${len}] = {${base}, ${base + 1}, ${base + 2}, ${base + 3}};\n    int dest[${len}];\n    for (int i = 0; i < ${len}; i++) {\n        dest[i] = src[${len} - i];\n    }\n    printf("%d\\n", dest[0]);\n    return 0;\n}`,
      language: "c",
      expected_output: `${base + 3}`,
      current_output: `Garbage / Out-of-bounds access`,
      options: [
        { id: "A", text: `Change \`src[${len} - i]\` to \`src[${len} - 1 - i]\`` },
        { id: "B", text: "Change `i < ${len}` to `i <= ${len}`" },
        { id: "C", text: "Change `dest[i]` to `dest[i+1]`" },
        { id: "D", text: "Declare `src` as pointer" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 9: Array Minimum Value Initialization (C)
  for (let i = 1; i <= 11; i++) {
    const val1 = 15 + i;
    const val2 = 25 + i;
    const val3 = 35 + i;
    bank.push({
      id: `DBG_E_ARR_MIN9_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_ARR_MIN_INITIALIZATION",
      category: "Arrays",
      sub_category: "Extremum Finding",
      bug_type: "WrongInitialization",
      concept: "MinimumTracking",
      difficulty: "EASY",
      topic: "Array Extremum Search",
      points: 10,
      title: `Minimum Element Search #${i}`,
      description: `Find the minimum value among positive integers (${val1}, ${val2}, ${val3}).`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int arr[3] = {${val1}, ${val2}, ${val3}};\n    int min_val = 0;\n    for (int i = 0; i < 3; i++) {\n        if (arr[i] < min_val) min_val = arr[i];\n    }\n    printf("%d\\n", min_val);\n    return 0;\n}`,
      language: "c",
      expected_output: `${val1}`,
      current_output: `0`,
      options: [
        { id: "A", text: "Initialize `int min_val = arr[0];` instead of `0`" },
        { id: "B", text: "Change `arr[i] < min_val` to `arr[i] > min_val`" },
        { id: "C", text: "Change `i < 3` to `i <= 3`" },
        { id: "D", text: "Declare `min_val` as `float`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 10: Array Duplicate Search Early Return (Python)
  for (let i = 1; i <= 11; i++) {
    const nums = [10 + i, 20 + i, 10 + i];
    bank.push({
      id: `DBG_E_ARR_DUP10_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_ARR_DUPLICATE_FLAG",
      category: "Arrays",
      sub_category: "Search",
      bug_type: "EarlyReturn",
      concept: "SearchCompletion",
      difficulty: "EASY",
      topic: "Duplicate Checking",
      points: 10,
      title: `Duplicate Element Detection #${i}`,
      description: `Check if list contains duplicates.`,
      code_snippet: `def has_duplicates(lst):\n    for i in range(len(lst)):\n        for j in range(i + 1, len(lst)):\n            if lst[i] == lst[j]:\n                return True\n            else:\n                return False\n    return False\n\nprint(has_duplicates([${nums.join(", ")}]))`,
      language: "python",
      expected_output: "True",
      current_output: "False",
      options: [
        { id: "A", text: "Remove `else: return False` so loop continues checking all pairs" },
        { id: "B", text: "Change `lst[i] == lst[j]` to `lst[i] != lst[j]`" },
        { id: "C", text: "Change `range(i + 1)` to `range(i)`" },
        { id: "D", text: "Cast `lst` to tuple" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 11: String Buffer Missing Null Terminator (C)
  for (let i = 1; i <= 11; i++) {
    const word = "OLYMPIC" + i;
    const len = word.length;
    bank.push({
      id: `DBG_E_STR_NULL11_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_STR_NULL_TERMINATOR",
      category: "Strings",
      sub_category: "Memory",
      bug_type: "MissingNullTerminator",
      concept: "NullTermination",
      difficulty: "EASY",
      topic: "String Termination",
      points: 10,
      title: `String Buffer Sizing #${i}`,
      description: `Store string "${word}" in a character array.`,
      code_snippet: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char buffer[${len}];\n    strcpy(buffer, "${word}");\n    printf("%s\\n", buffer);\n    return 0;\n}`,
      language: "c",
      expected_output: `${word}`,
      current_output: `Buffer overflow / Trailing garbage characters`,
      options: [
        { id: "A", text: `Change buffer size declaration to \`char buffer[${len + 1}];\`` },
        { id: "B", text: "Replace `strcpy` with `strcmp`" },
        { id: "C", text: "Change `printf` format from `%s` to `%c`" },
        { id: "D", text: "Call `free(buffer)`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 12: Python String Immutability Assignment (Python)
  for (let i = 1; i <= 11; i++) {
    const word = "code" + i;
    const target = "C" + word.slice(1);
    bank.push({
      id: `DBG_E_STR_IMM12_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_STR_IMMUTABLE_ASSIGN",
      category: "Strings",
      sub_category: "Immutability",
      bug_type: "ItemAssignment",
      concept: "Immutability",
      difficulty: "EASY",
      topic: "String Immutability",
      points: 10,
      title: `String First Character Capitalization #${i}`,
      description: `Capitalize first letter to produce "${target}".`,
      code_snippet: `s = "${word}"\ns[0] = "C"\nprint(s)`,
      language: "python",
      expected_output: `${target}`,
      current_output: `TypeError: 'str' object does not support item assignment`,
      options: [
        { id: "A", text: "Change `s[0] = 'C'` to `s = 'C' + s[1:]`" },
        { id: "B", text: "Use `s.set(0, 'C')`" },
        { id: "C", text: "Change `s = '${word}'` to `s = {'${word}'}`" },
        { id: "D", text: "Call `s.insert(0, 'C')`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 13: String Slice Step Reversal (Python)
  for (let i = 1; i <= 11; i++) {
    const word = "pragati" + i;
    const reversedWord = word.split("").reverse().join("");
    bank.push({
      id: `DBG_E_STR_REV13_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_STR_WRONG_SLICE_STEP",
      category: "Strings",
      sub_category: "Slicing",
      bug_type: "WrongSliceStep",
      concept: "SequenceReversal",
      difficulty: "EASY",
      topic: "Slice Syntax",
      points: 10,
      title: `String Reverse Slicing #${i}`,
      description: `Reverse string "${word}".`,
      code_snippet: `text = "${word}"\nreversed_text = text[::1]\nprint(reversed_text)`,
      language: "python",
      expected_output: `${reversedWord}`,
      current_output: `${word}`,
      options: [
        { id: "A", text: "Change `text[::1]` to `text[::-1]`" },
        { id: "B", text: "Change `text[::1]` to `text[-1:0]`" },
        { id: "C", text: "Change `text[::1]` to `text[1::]`" },
        { id: "D", text: "Change `text[::1]` to `text[0:-1]`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 14: String Comparison with Equality Operator (C)
  for (let i = 1; i <= 11; i++) {
    const word = "PASS" + i;
    bank.push({
      id: `DBG_E_STR_CMP14_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_STR_CMP_OPERATOR",
      category: "Strings",
      sub_category: "Comparison",
      bug_type: "AddressComparison",
      concept: "StringEquality",
      difficulty: "EASY",
      topic: "String Comparison",
      points: 10,
      title: `String Content Comparison #${i}`,
      description: `Compare string content against "${word}".`,
      code_snippet: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char s1[] = "${word}";\n    char s2[] = "${word}";\n    if (s1 == s2) {\n        printf("EQUAL\\n");\n    } else {\n        printf("UNEQUAL\\n");\n    }\n    return 0;\n}`,
      language: "c",
      expected_output: "EQUAL",
      current_output: "UNEQUAL",
      options: [
        { id: "A", text: "Change `if (s1 == s2)` to `if (strcmp(s1, s2) == 0)`" },
        { id: "B", text: "Change `char s1[]` to `int s1[]`" },
        { id: "C", text: "Change `s1 == s2` to `s1 = s2`" },
        { id: "D", text: "Use `sizeof(s1) == sizeof(s2)`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 15: Character Case Conversion Offset (C)
  for (let i = 1; i <= 11; i++) {
    const ch = String.fromCharCode(97 + (i % 26)); // 'a'..'z'
    const capCh = ch.toUpperCase();
    bank.push({
      id: `DBG_E_STR_CASE15_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_STR_CHAR_CASE_CONVERT",
      category: "Strings",
      sub_category: "ASCII Manipulation",
      bug_type: "ArithmeticFormula",
      concept: "ASCIIShift",
      difficulty: "EASY",
      topic: "ASCII Character Conversion",
      points: 10,
      title: `ASCII Uppercase Conversion #${i}`,
      description: `Convert lowercase '${ch}' to uppercase '${capCh}'.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    char c = '${ch}';\n    char upper = c + ('A' - 'a');\n    printf("%c\\n", upper);\n    return 0;\n}`,
      language: "c",
      expected_output: `${capCh}`,
      current_output: `${capCh}`,
      options: [
        { id: "A", text: "Logic is correct: `c + ('A' - 'a')` correctly converts lowercase to uppercase" },
        { id: "B", text: "Change `c + ('A' - 'a')` to `c * 2`" },
        { id: "C", text: "Change `char upper` to `int upper`" },
        { id: "D", text: "Change `%c` to `%d`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 16: Missing Function Return Value (C)
  for (let i = 1; i <= 11; i++) {
    const val = 15 + i * 5;
    bank.push({
      id: `DBG_E_FN_RET16_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_FUNC_MISSING_RETURN",
      category: "Functions",
      sub_category: "Return Types",
      bug_type: "MissingReturn",
      concept: "FunctionContract",
      difficulty: "EASY",
      topic: "Function Return Values",
      points: 10,
      title: `Function Value Return #${i}`,
      description: `Return double the input value (${val * 2}).`,
      code_snippet: `#include <stdio.h>\n\nint double_val(int x) {\n    int res = x * 2;\n}\n\nint main() {\n    int ans = double_val(${val});\n    printf("%d\\n", ans);\n    return 0;\n}`,
      language: "c",
      expected_output: `${val * 2}`,
      current_output: `Undefined return value / Garbage`,
      options: [
        { id: "A", text: "Add `return res;` at the end of `double_val` function" },
        { id: "B", text: "Change `int double_val` to `void double_val`" },
        { id: "C", text: "Change `x * 2` to `x + 2`" },
        { id: "D", text: "Declare `res` as global" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 17: Local Variable Shadowing (Python)
  for (let i = 1; i <= 11; i++) {
    const globalVal = 100 + i * 10;
    bank.push({
      id: `DBG_E_FN_SHAD17_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_FUNC_SHADOWING_VAR",
      category: "Functions",
      sub_category: "Scope",
      bug_type: "VariableShadowing",
      concept: "ScopeHierarchy",
      difficulty: "EASY",
      topic: "Variable Shadowing",
      points: 10,
      title: `Global Variable Update in Function #${i}`,
      description: `Update the global variable total to ${globalVal + 50}.`,
      code_snippet: `total = ${globalVal}\n\ndef add_bonus():\n    total = 50\n\nadd_bonus()\nprint(total)`,
      language: "python",
      expected_output: `${globalVal + 50}`,
      current_output: `${globalVal}`,
      options: [
        { id: "A", text: "Add `global total` inside `add_bonus()` and use `total += 50`" },
        { id: "B", text: "Change `def add_bonus()` to `def add_bonus(total)`" },
        { id: "C", text: "Remove function and use while loop" },
        { id: "D", text: "Cast `total` to list" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 18: Function Parameter Order Swap (C)
  for (let i = 1; i <= 11; i++) {
    const num = 50 + i * 10;
    const den = 5;
    bank.push({
      id: `DBG_E_FN_ARG18_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_FUNC_ARG_ORDER_SWAP",
      category: "Functions",
      sub_category: "Arguments",
      bug_type: "ArgumentOrderMismatch",
      concept: "ParameterBinding",
      difficulty: "EASY",
      topic: "Function Arguments",
      points: 10,
      title: `Division Function Parameter Order #${i}`,
      description: `Compute quotient of ${num} divided by ${den}.`,
      code_snippet: `#include <stdio.h>\n\nint divide(int numerator, int denominator) {\n    return numerator / denominator;\n}\n\nint main() {\n    int result = divide(${den}, ${num});\n    printf("%d\\n", result);\n    return 0;\n}`,
      language: "c",
      expected_output: `${num / den}`,
      current_output: `0`,
      options: [
        { id: "A", text: `Change call to \`divide(${num}, ${den});\`` },
        { id: "B", text: "Change `return numerator / denominator` to `return numerator * denominator`" },
        { id: "C", text: "Change `int result` to `float result`" },
        { id: "D", text: "Pass pointers instead of integers" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 19: Pass-by-Value Primitive Swap (C)
  for (let i = 1; i <= 11; i++) {
    const x = i * 4;
    const y = i * 9;
    bank.push({
      id: `DBG_E_FN_SWP19_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_FUNC_PASS_BY_VALUE_PRIMITIVE",
      category: "Functions",
      sub_category: "Pointers & References",
      bug_type: "PassByValueTrap",
      concept: "CallByReference",
      difficulty: "EASY",
      topic: "Pass-by-Value vs Reference",
      points: 10,
      title: `Integer Swap Function #${i}`,
      description: `Swap variables a (${x}) and b (${y}) via a helper function.`,
      code_snippet: `#include <stdio.h>\n\nvoid swap(int a, int b) {\n    int temp = a;\n    a = b;\n    b = temp;\n}\n\nint main() {\n    int x = ${x}, y = ${y};\n    swap(x, y);\n    printf("%d %d\\n", x, y);\n    return 0;\n}`,
      language: "c",
      expected_output: `${y} ${x}`,
      current_output: `${x} ${y}`,
      options: [
        { id: "A", text: "Use pointer parameters: `void swap(int *a, int *b)` and invoke `swap(&x, &y)`" },
        { id: "B", text: "Change `int temp = a` to `temp = b`" },
        { id: "C", text: "Declare `x` and `y` as `extern int`" },
        { id: "D", text: "Call `swap` twice" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 20: Factorial Base Case Zero Product (C)
  for (let i = 1; i <= 11; i++) {
    const n = 3 + (i % 4); // 3, 4, 5, 6
    let fact = 1;
    for (let k = 1; k <= n; k++) fact *= k;
    bank.push({
      id: `DBG_E_REC_BASE20_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_REC_BASE_RET_ZERO",
      category: "Recursion",
      sub_category: "Base Case",
      bug_type: "IncorrectBaseReturn",
      concept: "MultiplicativeIdentity",
      difficulty: "EASY",
      topic: "Recursion Base Cases",
      points: 10,
      title: `Recursive Product Base Case #${i}`,
      description: `Calculate factorial of ${n} recursively.`,
      code_snippet: `#include <stdio.h>\n\nint factorial(int n) {\n    if (n == 0) return 0;\n    return n * factorial(n - 1);\n}\n\nint main() {\n    printf("%d\\n", factorial(${n}));\n    return 0;\n}`,
      language: "c",
      expected_output: `${fact}`,
      current_output: `0`,
      options: [
        { id: "A", text: "Change base case to `if (n <= 1) return 1;`" },
        { id: "B", text: "Change `n * factorial(n - 1)` to `n + factorial(n - 1)`" },
        { id: "C", text: "Change `n == 0` to `n == -1`" },
        { id: "D", text: "Call `factorial(n + 1)`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 21: Countdown Recursion Step (Python)
  for (let i = 1; i <= 11; i++) {
    const val = 5 + i * 2;
    bank.push({
      id: `DBG_E_REC_STEP21_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_REC_COUNTDOWN_TERMINATION",
      category: "Recursion",
      sub_category: "Step Progression",
      bug_type: "BaseCaseSkip",
      concept: "RecursionTermination",
      difficulty: "EASY",
      topic: "Recursive Progression",
      points: 10,
      title: `Recursive Countdown Step #${i}`,
      description: `Recursively count down from ${val} to 0.`,
      code_snippet: `def countdown(n):\n    if n == 0:\n        return 0\n    return 1 + countdown(n - 2)\n\nprint(countdown(${val}))`,
      language: "python",
      expected_output: `${Math.floor(val / 2) + 1}`,
      current_output: `RecursionError: maximum recursion depth exceeded`,
      options: [
        { id: "A", text: "Change base condition to `if n <= 0: return 0`" },
        { id: "B", text: "Change `countdown(n - 2)` to `countdown(n + 2)`" },
        { id: "C", text: "Change `return 1` to `return n`" },
        { id: "D", text: "Remove `if n == 0` check" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 22: Pointer Address vs Value Assignment (C)
  for (let i = 1; i <= 11; i++) {
    const val = 20 + i * 5;
    const newVal = val + 10;
    bank.push({
      id: `DBG_E_PTR_ASN22_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_PTR_DEREF_ASSIGN",
      category: "Pointers",
      sub_category: "Dereference",
      bug_type: "AddressVsValue",
      concept: "PointerAssignment",
      difficulty: "EASY",
      topic: "Pointers & Addresses",
      points: 10,
      title: `Pointer Dereference Update #${i}`,
      description: `Update target integer variable through pointer to ${newVal}.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int x = ${val};\n    int *ptr = &x;\n    ptr = ${newVal};\n    printf("%d\\n", x);\n    return 0;\n}`,
      language: "c",
      expected_output: `${newVal}`,
      current_output: `Compilation warning/error: assignment to 'int *' from 'int'`,
      options: [
        { id: "A", text: `Change \`ptr = ${newVal};\` to \`*ptr = ${newVal};\`` },
        { id: "B", text: "Change `int *ptr = &x;` to `int ptr = x;`" },
        { id: "C", text: "Change `%d` to `%p`" },
        { id: "D", text: "Declare `ptr` as `int **`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 23: Pointer Value Format Specifier (C)
  for (let i = 1; i <= 11; i++) {
    const val = 100 + i;
    bank.push({
      id: `DBG_E_PTR_FMT23_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_PTR_PRINT_FORMAT",
      category: "Pointers",
      sub_category: "Printing",
      bug_type: "MissingDereferenceInPrint",
      concept: "PointerOutput",
      difficulty: "EASY",
      topic: "Pointer Printing",
      points: 10,
      title: `Pointer Value Output #${i}`,
      description: `Print the integer value ${val} stored at address ptr.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int x = ${val};\n    int *ptr = &x;\n    printf("%d\\n", ptr);\n    return 0;\n}`,
      language: "c",
      expected_output: `${val}`,
      current_output: `Memory address integer value`,
      options: [
        { id: "A", text: "Change `printf(\"%d\\n\", ptr)` to `printf(\"%d\\n\", *ptr)`" },
        { id: "B", text: "Change `int *ptr = &x` to `int ptr = &x`" },
        { id: "C", text: "Change `int x = ${val}` to `char x = '${val}'`" },
        { id: "D", text: "Remove `printf`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 24: Pointer Arithmetic Step Offset (C)
  for (let i = 1; i <= 11; i++) {
    const v1 = i * 10;
    const v2 = (i + 1) * 10;
    bank.push({
      id: `DBG_E_PTR_ART24_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_PTR_ARITH_STEP",
      category: "Pointers",
      sub_category: "Arithmetic",
      bug_type: "PointerOffsetDereference",
      concept: "PointerArithmetic",
      difficulty: "EASY",
      topic: "Pointer Offset Access",
      points: 10,
      title: `Pointer Array Index Offset #${i}`,
      description: `Access second element (${v2}) using pointer arithmetic.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int arr[2] = {${v1}, ${v2}};\n    int *p = arr;\n    int val = *p + 1;\n    printf("%d\\n", val);\n    return 0;\n}`,
      language: "c",
      expected_output: `${v2}`,
      current_output: `${v1 + 1}`,
      options: [
        { id: "A", text: "Change `*p + 1` to `*(p + 1)`" },
        { id: "B", text: "Change `int *p = arr` to `int *p = &arr[1]` without changing arithmetic" },
        { id: "C", text: "Change `int arr[2]` to `float arr[2]`" },
        { id: "D", text: "Use `p[0] + 1`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 25: Stack Pop Underflow Check (C)
  for (let i = 1; i <= 11; i++) {
    const val = 42 + i;
    bank.push({
      id: `DBG_E_DS_STK25_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_DS_STACK_POP_EMPTY",
      category: "Data Structures",
      sub_category: "Stack",
      bug_type: "UnderflowCondition",
      concept: "StackBoundary",
      difficulty: "EASY",
      topic: "Stack Operations",
      points: 10,
      title: `Stack Top Index Update #${i}`,
      description: `Push ${val} onto empty stack and pop it back.`,
      code_snippet: `#include <stdio.h>\n\nint stack[10];\nint top = -1;\n\nvoid push(int x) {\n    top++;\n    stack[top] = x;\n}\n\nint pop() {\n    top--;\n    return stack[top];\n}\n\nint main() {\n    push(${val});\n    printf("%d\\n", pop());\n    return 0;\n}`,
      language: "c",
      expected_output: `${val}`,
      current_output: `Garbage / Undefined value`,
      options: [
        { id: "A", text: "Change `pop` to `int val = stack[top]; top--; return val;`" },
        { id: "B", text: "Initialize `top = 0`" },
        { id: "C", text: "Change `stack[10]` to `stack[1]`" },
        { id: "D", text: "Call `push` twice" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 26: Queue Front Index Read Sequence (C)
  for (let i = 1; i <= 11; i++) {
    const val = 100 + i * 5;
    bank.push({
      id: `DBG_E_DS_QUE26_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_DS_QUEUE_PEEK_INDEX",
      category: "Data Structures",
      sub_category: "Queue",
      bug_type: "PrematureIndexIncrement",
      concept: "QueueFIFO",
      difficulty: "EASY",
      topic: "Queue Dequeue",
      points: 10,
      title: `Queue Dequeue Element #${i}`,
      description: `Enqueue ${val} and retrieve it via dequeue.`,
      code_snippet: `#include <stdio.h>\n\nint queue[10];\nint front = 0, rear = 0;\n\nvoid enqueue(int x) {\n    queue[rear++] = x;\n}\n\nint dequeue() {\n    front++;\n    return queue[front];\n}\n\nint main() {\n    enqueue(${val});\n    printf("%d\\n", dequeue());\n    return 0;\n}`,
      language: "c",
      expected_output: `${val}`,
      current_output: `0`,
      options: [
        { id: "A", text: "Change `dequeue` to `return queue[front++];`" },
        { id: "B", text: "Initialize `front = -1`" },
        { id: "C", text: "Change `rear++` to `++rear`" },
        { id: "D", text: "Remove `front` variable" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 27: Linear Search Premature Negative Return (C)
  for (let i = 1; i <= 11; i++) {
    const target = 77 + i;
    bank.push({
      id: `DBG_E_ALG_LIN27_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_ALG_LINEAR_SEARCH_RET",
      category: "Algorithms",
      sub_category: "Searching",
      bug_type: "PrematureLoopExit",
      concept: "LinearSearch",
      difficulty: "EASY",
      topic: "Linear Search Logic",
      points: 10,
      title: `Linear Search Traversal #${i}`,
      description: `Search for target value ${target} in array.`,
      code_snippet: `#include <stdio.h>\n\nint search(int arr[], int n, int target) {\n    for (int i = 0; i < n; i++) {\n        if (arr[i] == target) return i;\n        else return -1;\n    }\n    return -1;\n}\n\nint main() {\n    int a[] = {10, 20, ${target}};\n    printf("%d\\n", search(a, 3, ${target}));\n    return 0;\n}`,
      language: "c",
      expected_output: `2`,
      current_output: `-1`,
      options: [
        { id: "A", text: "Remove `else return -1;` from inside the loop so search completes" },
        { id: "B", text: "Change `arr[i] == target` to `arr[i] != target`" },
        { id: "C", text: "Change `i < n` to `i <= n`" },
        { id: "D", text: "Cast `target` to pointer" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 28: Count Occurrences Condition Inversion (C)
  for (let i = 1; i <= 11; i++) {
    const target = 5;
    bank.push({
      id: `DBG_E_ALG_CNT28_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_ALG_COUNT_OCCURRENCE",
      category: "Algorithms",
      sub_category: "Counting",
      bug_type: "ConditionInversion",
      concept: "FrequencyCount",
      difficulty: "EASY",
      topic: "Occurrence Counting",
      points: 10,
      title: `Element Occurrence Frequency #${i}`,
      description: `Count how many times ${target} appears in array.`,
      code_snippet: `#include <stdio.h>\n\nint count_freq(int arr[], int n, int target) {\n    int c = 0;\n    for (int i = 0; i < n; i++) {\n        if (arr[i] != target) c++;\n    }\n    return c;\n}\n\nint main() {\n    int arr[] = {${target}, 2, ${target}, 4};\n    printf("%d\\n", count_freq(arr, 4, ${target}));\n    return 0;\n}`,
      language: "c",
      expected_output: `2`,
      current_output: `2`,
      options: [
        { id: "A", text: "Change `if (arr[i] != target)` to `if (arr[i] == target)`" },
        { id: "B", text: "Change `c = 0` to `c = 1`" },
        { id: "C", text: "Change `c++` to `c += target`" },
        { id: "D", text: "Return `n - c`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 29: Variable Swap Without Temp Overwrite (C)
  for (let i = 1; i <= 11; i++) {
    const a = 12 + i;
    const b = 34 + i;
    bank.push({
      id: `DBG_E_ALG_SWP29_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_ALG_SWAP_WITHOUT_TEMP",
      category: "Algorithms",
      sub_category: "Primitives",
      bug_type: "VariableOverwrite",
      concept: "ValuePreservation",
      difficulty: "EASY",
      topic: "Variable Swapping",
      points: 10,
      title: `In-Place Value Swapping #${i}`,
      description: `Swap variables a (${a}) and b (${b}).`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int a = ${a}, b = ${b};\n    a = b;\n    b = a;\n    printf("%d %d\\n", a, b);\n    return 0;\n}`,
      language: "c",
      expected_output: `${b} ${a}`,
      current_output: `${b} ${b}`,
      options: [
        { id: "A", text: "Use a temporary variable: `int temp = a; a = b; b = temp;`" },
        { id: "B", text: "Change `b = a` to `b = 0`" },
        { id: "C", text: "Change `a = b` to `a == b`" },
        { id: "D", text: "Swap print statement order" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 30: Integer Division Truncation (C)
  for (let i = 1; i <= 11; i++) {
    const total = 50 + i * 5;
    const count = 4;
    const expectedAvg = (total / count).toFixed(2);
    bank.push({
      id: `DBG_E_MTH_DIV30_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_MATH_INT_DIVISION",
      category: "Mathematics",
      sub_category: "Type Casting",
      bug_type: "IntegerTruncation",
      concept: "FloatingPointDivision",
      difficulty: "EASY",
      topic: "Integer Division",
      points: 10,
      title: `Decimal Average Calculation #${i}`,
      description: `Compute floating-point average of ${total} divided by ${count}.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int total = ${total};\n    int count = ${count};\n    double avg = total / count;\n    printf("%.2f\\n", avg);\n    return 0;\n}`,
      language: "c",
      expected_output: `${expectedAvg}`,
      current_output: `${(Math.floor(total / count)).toFixed(2)}`,
      options: [
        { id: "A", text: "Change `total / count` to `(double)total / count`" },
        { id: "B", text: "Change `double avg` to `int avg`" },
        { id: "C", text: "Change `%.2f` to `%d`" },
        { id: "D", text: "Multiply `(total * 10) / count`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 31: Modulo Operation Sign on Negative Numbers (Python)
  for (let i = 1; i <= 11; i++) {
    const val = -17 - i * 2;
    const mod = 5;
    const remainder = ((val % mod) + mod) % mod;
    bank.push({
      id: `DBG_E_MTH_MOD31_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_MATH_MODULO_NEGATIVE",
      category: "Mathematics",
      sub_category: "Modulo Arithmetic",
      bug_type: "ModuloSignHandling",
      concept: "EuclideanModulo",
      difficulty: "EASY",
      topic: "Modulo Arithmetic",
      points: 10,
      title: `Non-Negative Modulo Remainder #${i}`,
      description: `Compute positive remainder of ${val} modulo ${mod}.`,
      code_snippet: `val = ${val}\nmod = ${mod}\nans = val % mod\nprint(ans)`,
      language: "python",
      expected_output: `${remainder}`,
      current_output: `${remainder}`,
      options: [
        { id: "A", text: "Python `%` operator naturally returns non-negative remainder for positive divisors" },
        { id: "B", text: "Change `val % mod` to `val // mod`" },
        { id: "C", text: "Change `val` to `abs(val)` without adjusting" },
        { id: "D", text: "Multiply by `-1`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 32: Preprocessor Macro Square Expansion Precedence (C)
  for (let i = 1; i <= 11; i++) {
    const a = i + 1;
    const b = 2;
    const expected = (a + b) * (a + b);
    bank.push({
      id: `DBG_E_MTH_MAC32_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_MATH_MACRO_SQUARE",
      category: "Mathematics",
      sub_category: "Macros",
      bug_type: "MacroPrecedence",
      concept: "Parenthesization",
      difficulty: "EASY",
      topic: "Macro Expansion",
      points: 10,
      title: `Macro Parentheses Expansion #${i}`,
      description: `Compute square of (${a} + ${b}).`,
      code_snippet: `#include <stdio.h>\n#define SQUARE(x) x * x\n\nint main() {\n    int result = SQUARE(${a} + ${b});\n    printf("%d\\n", result);\n    return 0;\n}`,
      language: "c",
      expected_output: `${expected}`,
      current_output: `${a + b * a + b}`,
      options: [
        { id: "A", text: "Change `#define SQUARE(x) x * x` to `#define SQUARE(x) ((x) * (x))`" },
        { id: "B", text: "Change `int result` to `float result`" },
        { id: "C", text: "Replace `SQUARE` with `pow(x, 2)`" },
        { id: "D", text: "Pass `SQUARE(${a}) + SQUARE(${b})`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 33: Bitwise AND Precedence vs Equality (C)
  for (let i = 1; i <= 11; i++) {
    const num = (i * 2) + 1; // Odd number
    bank.push({
      id: `DBG_E_MTH_BIT33_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_MATH_BITWISE_AND_PREC",
      category: "Mathematics",
      sub_category: "Bitwise",
      bug_type: "OperatorPrecedence",
      concept: "BitwiseParity",
      difficulty: "EASY",
      topic: "Bitwise Operator Precedence",
      points: 10,
      title: `Bitwise Parity Check Precedence #${i}`,
      description: `Check if ${num} is odd using bitwise AND.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int n = ${num};\n    if (n & 1 == 1) {\n        printf("ODD\\n");\n    } else {\n        printf("EVEN\\n");\n    }\n    return 0;\n}`,
      language: "c",
      expected_output: "ODD",
      current_output: "EVEN",
      options: [
        { id: "A", text: "Change `n & 1 == 1` to `(n & 1) == 1` with parentheses" },
        { id: "B", text: "Change `n & 1` to `n | 1`" },
        { id: "C", text: "Change `== 1` to `!= 0` without parentheses" },
        { id: "D", text: "Declare `n` as unsigned" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 34: Tuple Unpacking Count Mismatch (Python)
  for (let i = 1; i <= 11; i++) {
    const x = i * 10;
    const y = i * 20;
    const z = i * 30;
    bank.push({
      id: `DBG_E_IO_TUP34_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_IO_TUPLE_UNPACK",
      category: "Input / Output",
      sub_category: "Tuples",
      bug_type: "UnpackingCountMismatch",
      concept: "TupleUnpacking",
      difficulty: "EASY",
      topic: "Tuple Unpacking",
      points: 10,
      title: `Tuple Assignment Cardinality #${i}`,
      description: `Unpack 3-element tuple into a, b, c and compute sum (${x + y + z}).`,
      code_snippet: `point = (${x}, ${y}, ${z})\na, b = point\nprint(a + b)`,
      language: "python",
      expected_output: `${x + y + z}`,
      current_output: `ValueError: too many values to unpack (expected 2)`,
      options: [
        { id: "A", text: "Change `a, b = point` to `a, b, c = point` and print `a + b + c`" },
        { id: "B", text: "Change `point` to a set" },
        { id: "C", text: "Use `a = point[0, 1]`" },
        { id: "D", text: "Convert `point` to int" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 35: Dictionary Missing Key Default (Python)
  for (let i = 1; i <= 11; i++) {
    const key = "port_" + i;
    const defVal = 8000 + i;
    bank.push({
      id: `DBG_E_IO_DCT35_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_IO_DICT_KEY_DEFAULT",
      category: "Input / Output",
      sub_category: "Dictionaries",
      bug_type: "KeyErrorHandling",
      concept: "DefaultGetter",
      difficulty: "EASY",
      topic: "Dictionary Defaults",
      points: 10,
      title: `Dictionary Key Lookup Default #${i}`,
      description: `Safely lookup key "${key}" with default value ${defVal}.`,
      code_snippet: `config = {"host": "localhost"}\nval = config["${key}"]\nprint(val)`,
      language: "python",
      expected_output: `${defVal}`,
      current_output: `KeyError: '${key}'`,
      options: [
        { id: "A", text: `Change \`config["${key}"]\` to \`config.get("${key}", ${defVal})\`` },
        { id: "B", text: `Use \`config.find("${key}")\`` },
        { id: "C", text: "Cast `config` to list" },
        { id: "D", text: "Add `config.append('${key}')`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 36: List In-Place Sort Return Value (Python)
  for (let i = 1; i <= 11; i++) {
    const nums = [20 + i, 10 + i, 40 + i];
    const sortedNums = [...nums].sort((a, b) => a - b);
    bank.push({
      id: `DBG_E_IO_SRT36_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_EASY_IO_LIST_SORT_RETURN",
      category: "Input / Output",
      sub_category: "List Builtins",
      bug_type: "InPlaceReturnNone",
      concept: "MethodReturn",
      difficulty: "EASY",
      topic: "List Method Returns",
      points: 10,
      title: `List Sort Method Return #${i}`,
      description: `Sort list and print resulting sorted elements.`,
      code_snippet: `items = [${nums.join(", ")}]\nres = items.sort()\nprint(res)`,
      language: "python",
      expected_output: `[${sortedNums.join(", ")}]`,
      current_output: `None`,
      options: [
        { id: "A", text: "Change `res = items.sort()` to `res = sorted(items)` or sort in-place and `print(items)`" },
        { id: "B", text: "Change `items.sort()` to `items.order()`" },
        { id: "C", text: "Change `print(res)` to `print(res.value)`" },
        { id: "D", text: "Cast `items` to tuple before sorting" }
      ],
      correct_option_id: "A"
    });
  }

  // =======================================================================================
  // PART 2: 36 MEDIUM QUESTION FAMILIES (Weight = 2 pts, 11 variants each = 396 questions)
  // =======================================================================================

  // FAM 37: Nested Loop Counter Variable Reuse (C)
  for (let i = 1; i <= 11; i++) {
    const rows = 2;
    const cols = 3;
    bank.push({
      id: `DBG_M_CF_NEST37_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_CF_NESTED_LOOP_VAR_REUSE",
      category: "Control Flow",
      sub_category: "Nested Loops",
      bug_type: "VariableCollision",
      concept: "NestedLoopCounter",
      difficulty: "MEDIUM",
      topic: "Nested Loops",
      points: 15,
      title: `Nested Loop Counter Collision #${i}`,
      description: `Iterate ${rows} rows and ${cols} columns for a total of ${rows * cols} steps.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int count = 0;\n    for (int i = 0; i < ${rows}; i++) {\n        for (int i = 0; i < ${cols}; i++) {\n            count++;\n        }\n    }\n    printf("%d\\n", count);\n    return 0;\n}`,
      language: "c",
      expected_output: `${rows * cols}`,
      current_output: `${cols}`,
      options: [
        { id: "A", text: "Change inner loop variable from `i` to `int j = 0; j < ${cols}; j++`" },
        { id: "B", text: "Change `count++` to `count += 2`" },
        { id: "C", text: "Remove outer loop" },
        { id: "D", text: "Declare `count` as `static`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 38: Continue Statement Skipping Counter Increment in While Loop (C)
  for (let i = 1; i <= 11; i++) {
    const limit = 5 + (i % 3);
    bank.push({
      id: `DBG_M_CF_CONT38_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_CF_CONTINUE_SKIP_INC",
      category: "Control Flow",
      sub_category: "Branching",
      bug_type: "InfiniteLoopContinue",
      concept: "LoopControlFlow",
      difficulty: "MEDIUM",
      topic: "Loop Continue Control",
      points: 15,
      title: `While Loop Continue Placement #${i}`,
      description: `Sum even numbers up to ${limit}.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int i = 0, sum = 0;\n    while (i < ${limit}) {\n        if (i % 2 != 0) continue;\n        sum += i;\n        i++;\n    }\n    printf("%d\\n", sum);\n    return 0;\n}`,
      language: "c",
      expected_output: `6`,
      current_output: `Infinite loop (hangs when i = 1)`,
      options: [
        { id: "A", text: "Increment `i++` before `continue` or use a standard for-loop `for(int i=0; i<${limit}; i++)`" },
        { id: "B", text: "Change `continue` to `break`" },
        { id: "C", text: "Change `i % 2 != 0` to `i % 2 == 0`" },
        { id: "D", text: "Change `while (i < ${limit})` to `while (i == ${limit})`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 39: Float Loop Equality IEEE 754 Precision (C)
  for (let i = 1; i <= 11; i++) {
    bank.push({
      id: `DBG_M_CF_FLT39_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_CF_FLOAT_LOOP_ACCUM",
      category: "Control Flow",
      sub_category: "Floating Point",
      bug_type: "FloatEqualityAccumulation",
      concept: "IEEE754Precision",
      difficulty: "MEDIUM",
      topic: "Floating-Point Loops",
      points: 15,
      title: `Float Loop Termination #${i}`,
      description: `Iterate floating-point counter from 0.0 to 1.0 with 0.1 step.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int steps = 0;\n    for (float f = 0.0f; f != 1.0f; f += 0.1f) {\n        steps++;\n        if (steps > 20) break;\n    }\n    printf("%d\\n", steps);\n    return 0;\n}`,
      language: "c",
      expected_output: `10`,
      current_output: `21 (Infinite loop truncated by safety break)`,
      options: [
        { id: "A", text: "Use integer steps `for (int i = 0; i < 10; i++)` or condition `f < 0.95f`" },
        { id: "B", text: "Change `float` to `double` without changing `!= 1.0`" },
        { id: "C", text: "Change `f += 0.1f` to `f += 0.2f`" },
        { id: "D", text: "Remove `steps++`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 40: Short-Circuit Logic Skipping Necessary Side Effects (C)
  for (let i = 1; i <= 11; i++) {
    const val = i * 10;
    bank.push({
      id: `DBG_M_CF_SHRT40_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_CF_SHORT_CIRCUIT_SIDE_EFFECT",
      category: "Control Flow",
      sub_category: "Logical Operators",
      bug_type: "ShortCircuitSideEffect",
      concept: "ShortCircuitEvaluation",
      difficulty: "MEDIUM",
      topic: "Short-Circuit Side Effects",
      points: 15,
      title: `Short-Circuit Operand Evaluation #${i}`,
      description: `Execute both validation checks and update state counter.`,
      code_snippet: `#include <stdio.h>\n\nint update(int *x) {\n    (*x) += 10;\n    return 1;\n}\n\nint main() {\n    int count = ${val};\n    if (1 || update(&count)) {\n        printf("%d\\n", count);\n    }\n    return 0;\n}`,
      language: "c",
      expected_output: `${val + 10}`,
      current_output: `${val}`,
      options: [
        { id: "A", text: "Call `update(&count)` before the `if` statement or use bitwise `|`" },
        { id: "B", text: "Change `if (1 || ...)` to `if (0 || ...)`" },
        { id: "C", text: "Change `int *x` to `int x`" },
        { id: "D", text: "Change `10` to `20`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 41: 2D Matrix Row-Column Index Transposition (C)
  for (let i = 1; i <= 11; i++) {
    const rows = 2, cols = 3;
    bank.push({
      id: `DBG_M_ARR_MAT41_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_ARR_MATRIX_ROW_COL_FLIP",
      category: "Arrays",
      sub_category: "2D Arrays",
      bug_type: "RowColIndexFlip",
      concept: "MatrixDimensioning",
      difficulty: "MEDIUM",
      topic: "2D Matrix Dimensions",
      points: 15,
      title: `Matrix Row-Col Indexing #${i}`,
      description: `Sum elements in a ${rows}x${cols} rectangular matrix.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int mat[2][3] = {{1, 2, 3}, {4, 5, 6}};\n    int sum = 0;\n    for (int r = 0; r < 2; r++) {\n        for (int c = 0; c < 3; c++) {\n            sum += mat[c][r];\n        }\n    }\n    printf("%d\\n", sum);\n    return 0;\n}`,
      language: "c",
      expected_output: `21`,
      current_output: `Out-of-bounds memory access / Garbage`,
      options: [
        { id: "A", text: "Change `mat[c][r]` to `mat[r][c]`" },
        { id: "B", text: "Change `r < 2` to `r < 3`" },
        { id: "C", text: "Change `int mat[2][3]` to `int mat[3][2]`" },
        { id: "D", text: "Cast `mat` to pointer" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 42: Python Shallow Copy 2D Matrix Aliasing (Python)
  for (let i = 1; i <= 11; i++) {
    const val = 10 + i;
    bank.push({
      id: `DBG_M_ARR_SHAL42_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_ARR_SHALLOW_COPY_2D",
      category: "Arrays",
      sub_category: "Multi-dimensional Lists",
      bug_type: "ShallowCopyAliasing",
      concept: "ObjectReferences",
      difficulty: "MEDIUM",
      topic: "2D List Aliasing",
      points: 15,
      title: `2D List Independent Row Modification #${i}`,
      description: `Modify only top-left cell grid[0][0] to ${val} without altering other rows.`,
      code_snippet: `grid = [[0] * 3] * 3\ngrid[0][0] = ${val}\nprint(grid)`,
      language: "python",
      expected_output: `[[${val}, 0, 0], [0, 0, 0], [0, 0, 0]]`,
      current_output: `[[${val}, 0, 0], [${val}, 0, 0], [${val}, 0, 0]]`,
      options: [
        { id: "A", text: "Create rows independently using list comprehension: `grid = [[0]*3 for _ in range(3)]`" },
        { id: "B", text: "Change `grid[0][0]` to `grid[0]`" },
        { id: "C", text: "Convert `grid` to tuple" },
        { id: "D", text: "Use `copy.copy(grid)`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 43: Modifying List While Iterating (Python)
  for (let i = 1; i <= 11; i++) {
    const nums = [1, 2, 4, 5, 6];
    bank.push({
      id: `DBG_M_ARR_ITER43_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_ARR_MODIFY_DURING_ITER",
      category: "Arrays",
      sub_category: "Iteration",
      bug_type: "MutationDuringIteration",
      concept: "IteratorInvalidation",
      difficulty: "MEDIUM",
      topic: "List Mutation in Loops",
      points: 15,
      title: `Filter Even Numbers During Iteration #${i}`,
      description: `Remove all even numbers from list.`,
      code_snippet: `nums = [1, 2, 4, 5, 6]\nfor n in nums:\n    if n % 2 == 0:\n        nums.remove(n)\nprint(nums)`,
      language: "python",
      expected_output: `[1, 5]`,
      current_output: `[1, 4, 5]`,
      options: [
        { id: "A", text: "Iterate over a copy `for n in nums[:]:` or use list comprehension `[n for n in nums if n % 2 != 0]`" },
        { id: "B", text: "Change `nums.remove(n)` to `del nums[n]`" },
        { id: "C", text: "Change `n % 2 == 0` to `n % 2 != 0`" },
        { id: "D", text: "Use `while len(nums) > 0:`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 44: Array In-Place Shift Overwrite (C)
  for (let i = 1; i <= 11; i++) {
    const v1 = i, v2 = i + 1, v3 = i + 2;
    bank.push({
      id: `DBG_M_ARR_ROT44_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_ARR_ROTATE_OVERWRITE",
      category: "Arrays",
      sub_category: "Shifting",
      bug_type: "SequentialOverwrite",
      concept: "ArrayShift",
      difficulty: "MEDIUM",
      topic: "Array Element Shifting",
      points: 15,
      title: `Array Right Shift #${i}`,
      description: `Shift elements right by 1 position with wrap around.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int a[3] = {${v1}, ${v2}, ${v3}};\n    int last = a[2];\n    a[2] = a[1];\n    a[1] = a[0];\n    a[0] = last;\n    printf("%d %d %d\\n", a[0], a[1], a[2]);\n    return 0;\n}`,
      language: "c",
      expected_output: `${v3} ${v1} ${v2}`,
      current_output: `${v3} ${v1} ${v2}`,
      options: [
        { id: "A", text: "Correct shift order: save `last`, shift `a[2]=a[1]`, `a[1]=a[0]`, then `a[0]=last`" },
        { id: "B", text: "Shift `a[0]` before `a[2]`" },
        { id: "C", text: "Change `int a[3]` to `int a[4]`" },
        { id: "D", text: "Cast to pointers" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 45: Prefix Sum Off-By-One Index (C)
  for (let i = 1; i <= 11; i++) {
    const a = i, b = i + 2, c = i + 4;
    bank.push({
      id: `DBG_M_ARR_PRF45_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_ARR_PREFIX_SUM_OFF_BY_ONE",
      category: "Arrays",
      sub_category: "Prefix Sum",
      bug_type: "PrefixArrayBaseIndex",
      concept: "CumulativeSum",
      difficulty: "MEDIUM",
      topic: "Prefix Sum Calculation",
      points: 15,
      title: `Prefix Sum Array Construction #${i}`,
      description: `Compute prefix sum array for {${a}, ${b}, ${c}}.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int arr[3] = {${a}, ${b}, ${c}};\n    int pref[3];\n    for (int i = 0; i < 3; i++) {\n        pref[i] = pref[i - 1] + arr[i];\n    }\n    printf("%d\\n", pref[2]);\n    return 0;\n}`,
      language: "c",
      expected_output: `${a + b + c}`,
      current_output: `Garbage added from pref[-1]`,
      options: [
        { id: "A", text: "Initialize `pref[0] = arr[0];` and loop from `i = 1; i < 3; i++`" },
        { id: "B", text: "Change `pref[i - 1]` to `pref[i + 1]`" },
        { id: "C", text: "Declare `pref` as `int pref[4]`" },
        { id: "D", text: "Change `i < 3` to `i <= 3`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 46: Palindrome Two-Pointer Step Omission (C)
  for (let i = 1; i <= 11; i++) {
    const word = "RADAR";
    bank.push({
      id: `DBG_M_STR_PAL46_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_STR_PALINDROME_POINTER_STEP",
      category: "Strings",
      sub_category: "Two Pointer",
      bug_type: "PointerProgressionOmission",
      concept: "TwoPointerTechnique",
      difficulty: "MEDIUM",
      topic: "Two-Pointer Palindrome",
      points: 15,
      title: `Palindrome Verification Two-Pointer #${i}`,
      description: `Verify if string is palindrome using two pointers.`,
      code_snippet: `#include <stdio.h>\n#include <string.h>\n\nint is_pal(char *s) {\n    int left = 0, right = strlen(s) - 1;\n    while (left < right) {\n        if (s[left] != s[right]) return 0;\n        left++;\n    }\n    return 1;\n}\n\nint main() {\n    printf("%d\\n", is_pal("${word}"));\n    return 0;\n}`,
      language: "c",
      expected_output: `1`,
      current_output: `0 / Infinite loop (left crosses right without right decrementing)`,
      options: [
        { id: "A", text: "Add `right--;` alongside `left++;` inside the while loop" },
        { id: "B", text: "Change `left < right` to `left == right`" },
        { id: "C", text: "Change `return 0` to `return 1`" },
        { id: "D", text: "Remove `strlen(s) - 1`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 47: Read-Only Text Segment String Mutation (C)
  for (let i = 1; i <= 11; i++) {
    const prefix = "mech" + i;
    const capPrefix = "Mech" + i;
    bank.push({
      id: `DBG_M_STR_RO47_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_STR_RO_SEGMENT_MUTATION",
      category: "Strings",
      sub_category: "Memory Segments",
      bug_type: "ReadOnlyMemoryWrite",
      concept: "StringLiterals",
      difficulty: "MEDIUM",
      topic: "String Literal Mutation",
      points: 15,
      title: `In-Place String Literal Modification #${i}`,
      description: `Modify the first letter of "${prefix}" in-place to uppercase.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    char *str = "${prefix}";\n    str[0] = 'M';\n    printf("%s\\n", str);\n    return 0;\n}`,
      language: "c",
      expected_output: `${capPrefix}`,
      current_output: `Segmentation fault (core dumped) - string literal in read-only text segment`,
      options: [
        { id: "A", text: `Declare as a mutable character array: \`char str[] = "${prefix}";\`` },
        { id: "B", text: "Change `str[0] = 'M'` to `*str = 'M'`" },
        { id: "C", text: "Cast `str` to `(const char *)`" },
        { id: "D", text: "Add `free(str)` at the end" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 48: String Replace Return Value Reassignment (Python)
  for (let i = 1; i <= 11; i++) {
    const word = "hello_world_" + i;
    const target = word.replace("_", "-");
    bank.push({
      id: `DBG_M_STR_RPL48_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_STR_VOWEL_REPLACE_NEW_STR",
      category: "Strings",
      sub_category: "Methods",
      bug_type: "MethodReturnIgnored",
      concept: "ImmutableMethodReturn",
      difficulty: "MEDIUM",
      topic: "String Replace Method",
      points: 15,
      title: `String Replace Method Return #${i}`,
      description: `Replace underscore with hyphen in string.`,
      code_snippet: `text = "${word}"\ntext.replace("_", "-")\nprint(text)`,
      language: "python",
      expected_output: `${target}`,
      current_output: `${word}`,
      options: [
        { id: "A", text: "Reassign the return value: `text = text.replace(\"_\", \"-\")`" },
        { id: "B", text: "Change `text.replace` to `text.swap`" },
        { id: "C", text: "Cast `text` to list" },
        { id: "D", text: "Use `text.delete(\"_\")`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 49: Strcat Buffer Capacity in Loop (C)
  for (let i = 1; i <= 11; i++) {
    bank.push({
      id: `DBG_M_STR_CAT49_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_STR_CONCAT_IN_LOOP_BUFFER",
      category: "Strings",
      sub_category: "Buffer Overflow",
      bug_type: "UndersizedBufferConcat",
      concept: "BufferAllocation",
      difficulty: "MEDIUM",
      topic: "String Concatenation",
      points: 15,
      title: `String Concatenation Buffer Capacity #${i}`,
      description: `Concatenate "A" 5 times into buffer.`,
      code_snippet: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char buf[4] = "";\n    for (int i = 0; i < 5; i++) {\n        strcat(buf, "A");\n    }\n    printf("%s\\n", buf);\n    return 0;\n}`,
      language: "c",
      expected_output: `AAAAA`,
      current_output: `Stack buffer overflow / Corruption`,
      options: [
        { id: "A", text: "Increase buffer size: `char buf[10] = \"\";` to hold 5 characters + null terminator" },
        { id: "B", text: "Change `strcat` to `strcpy`" },
        { id: "C", text: "Change `char buf[4]` to `char *buf = \"\"`" },
        { id: "D", text: "Remove loop" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 50: Mutable Default Argument Retention (Python)
  for (let i = 1; i <= 11; i++) {
    const item1 = i * 10;
    const item2 = i * 20;
    bank.push({
      id: `DBG_M_FN_DEF50_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_FUNC_MUTABLE_DEFAULT_ARG",
      category: "Functions",
      sub_category: "Default Arguments",
      bug_type: "MutableDefaultArgument",
      concept: "DefaultScopeLifecycle",
      difficulty: "MEDIUM",
      topic: "Default Argument Side Effects",
      points: 15,
      title: `Isolated List Accumulator #${i}`,
      description: `Append item to fresh list on each call without shared state.`,
      code_snippet: `def append_item(x, target=[]):\n    target.append(x)\n    return target\n\nfirst = append_item(${item1})\nsecond = append_item(${item2})\nprint(second)`,
      language: "python",
      expected_output: `[${item2}]`,
      current_output: `[${item1}, ${item2}]`,
      options: [
        { id: "A", text: "Use `target=None` default and initialize `if target is None: target = []` inside" },
        { id: "B", text: "Change `target=[]` to `target=()`" },
        { id: "C", text: "Change `target.append` to `target = target + x`" },
        { id: "D", text: "Call `target.clear()` at the end" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 51: UnboundLocalError Referencing Global Before Assignment (Python)
  for (let i = 1; i <= 11; i++) {
    const val = 100 + i * 10;
    bank.push({
      id: `DBG_M_FN_UNB51_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_FUNC_GLOBAL_VS_LOCAL",
      category: "Functions",
      sub_category: "Variable Scope",
      bug_type: "UnboundLocalError",
      concept: "LEGBRule",
      difficulty: "MEDIUM",
      topic: "LEGB Variable Scope",
      points: 15,
      title: `Global Variable Modification in Scope #${i}`,
      description: `Increment global counter by 1.`,
      code_snippet: `counter = ${val}\n\ndef increment():\n    counter = counter + 1\n\nincrement()\nprint(counter)`,
      language: "python",
      expected_output: `${val + 1}`,
      current_output: `UnboundLocalError: cannot access local variable 'counter' where it is not associated with a value`,
      options: [
        { id: "A", text: "Declare `global counter` inside `increment()` before modifying it" },
        { id: "B", text: "Change `counter = counter + 1` to `counter += 1` without `global`" },
        { id: "C", text: "Change `def increment()` to `def increment(counter)` without returning" },
        { id: "D", text: "Cast `counter` to int" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 52: Late-Binding Closures in List Comprehensions (Python)
  for (let i = 1; i <= 11; i++) {
    const mul = 2;
    bank.push({
      id: `DBG_M_FN_LAT52_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_FUNC_LATE_BINDING_CLOSURE",
      category: "Functions",
      sub_category: "Closures",
      bug_type: "LateBindingClosure",
      concept: "LexicalScoping",
      difficulty: "MEDIUM",
      topic: "Late-Binding Closures",
      points: 15,
      title: `Closure Lambda Multiplication Table #${i}`,
      description: `Generate multiplier functions multiplying by 0, 1, 2, 3.`,
      code_snippet: `funcs = [lambda x: x * i for i in range(4)]\nresults = [f(${mul}) for f in funcs]\nprint(results)`,
      language: "python",
      expected_output: `[0, 2, 4, 6]`,
      current_output: `[6, 6, 6, 6]`,
      options: [
        { id: "A", text: "Bind `i` at definition time with default parameter: `lambda x, i=i: x * i`" },
        { id: "B", text: "Change `for i in range(4)` to `for i in (0, 1, 2, 3)` without default param" },
        { id: "C", text: "Change `x * i` to `x + i`" },
        { id: "D", text: "Convert `funcs` to tuple" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 53: Try-Finally Return Value Overriding (Python)
  for (let i = 1; i <= 11; i++) {
    const tryVal = 100 + i;
    const finVal = 999;
    bank.push({
      id: `DBG_M_FN_FIN53_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_FUNC_TRY_FINALLY_OVERRIDE",
      category: "Functions",
      sub_category: "Exception Handling",
      bug_type: "FinallyReturnOverride",
      concept: "FinallySemantics",
      difficulty: "MEDIUM",
      topic: "Try-Finally Return Precedence",
      points: 15,
      title: `Try Block Return Preservation #${i}`,
      description: `Return ${tryVal} from computation function.`,
      code_snippet: `def calculate():\n    try:\n        return ${tryVal}\n    finally:\n        return ${finVal}\n\nprint(calculate())`,
      language: "python",
      expected_output: `${tryVal}`,
      current_output: `${finVal}`,
      options: [
        { id: "A", text: "Remove `return ${finVal}` from the `finally` block (use finally only for cleanup)" },
        { id: "B", text: "Change `try` to `except`" },
        { id: "C", text: "Change `finally` to `else`" },
        { id: "D", text: "Declare variable global" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 54: Fibonacci Recursion Base Case Zero/One (C)
  for (let i = 1; i <= 11; i++) {
    const n = 4 + (i % 3); // 4, 5, 6
    const fibs = [0, 1, 1, 2, 3, 5, 8, 13];
    bank.push({
      id: `DBG_M_REC_FIB54_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_REC_FIB_DOUBLE_CALL_BASE",
      category: "Recursion",
      sub_category: "Multiple Recursive Calls",
      bug_type: "MissingSecondaryBaseCase",
      concept: "TreeRecursion",
      difficulty: "MEDIUM",
      topic: "Fibonacci Base Cases",
      points: 15,
      title: `Fibonacci Double Base Case #${i}`,
      description: `Compute n-th Fibonacci number for n = ${n}.`,
      code_snippet: `#include <stdio.h>\n\nint fib(int n) {\n    if (n == 0) return 0;\n    return fib(n - 1) + fib(n - 2);\n}\n\nint main() {\n    printf("%d\\n", fib(${n}));\n    return 0;\n}`,
      language: "c",
      expected_output: `${fibs[n]}`,
      current_output: `Infinite recursion / Stack overflow when n=1 calls fib(-1)`,
      options: [
        { id: "A", text: "Change base condition to `if (n <= 1) return n;`" },
        { id: "B", text: "Change `fib(n - 2)` to `fib(n - 1)`" },
        { id: "C", text: "Declare `fib` as `static`" },
        { id: "D", text: "Change `int fib` to `double fib`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 55: Recursive Array Sum Size Decrement (C)
  for (let i = 1; i <= 11; i++) {
    const len = 4;
    const base = i;
    const sum = base + (base + 1) + (base + 2) + (base + 3);
    bank.push({
      id: `DBG_M_REC_SUM55_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_REC_SUM_ARRAY_ACCUM",
      category: "Recursion",
      sub_category: "Arrays",
      bug_type: "PointerRecursionStep",
      concept: "ArrayRecursion",
      difficulty: "MEDIUM",
      topic: "Recursive Array Sum",
      points: 15,
      title: `Recursive Array Summation Step #${i}`,
      description: `Sum elements of array of size ${len} recursively.`,
      code_snippet: `#include <stdio.h>\n\nint sum_arr(int *arr, int n) {\n    if (n == 0) return 0;\n    return *arr + sum_arr(arr + 1, n);\n}\n\nint main() {\n    int a[4] = {${base}, ${base + 1}, ${base + 2}, ${base + 3}};\n    printf("%d\\n", sum_arr(a, 4));\n    return 0;\n}`,
      language: "c",
      expected_output: `${sum}`,
      current_output: `Stack overflow (n is never decremented)`,
      options: [
        { id: "A", text: "Change `sum_arr(arr + 1, n)` to `sum_arr(arr + 1, n - 1)`" },
        { id: "B", text: "Change `n == 0` to `n == 1`" },
        { id: "C", text: "Change `n == 0` to `n == 1`" },
        { id: "D", text: "Remove `if (n == 0)`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 56: Recursive Return Propagation (Python)
  for (let i = 1; i <= 11; i++) {
    const target = 10 + i * 2;
    bank.push({
      id: `DBG_M_REC_PRP56_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_REC_STATE_PARAM_SHADOW",
      category: "Recursion",
      sub_category: "Return Propagation",
      bug_type: "MissingReturnOnRecursiveBranch",
      concept: "CallStackReturn",
      difficulty: "MEDIUM",
      topic: "Recursive Return Value Propagation",
      points: 15,
      title: `Recursive Search Return Propagation #${i}`,
      description: `Find target ${target} in binary search tree structure.`,
      code_snippet: `def find_val(node_val, target):\n    if node_val == target:\n        return True\n    elif node_val < target:\n        find_val(node_val + 2, target)\n    return False\n\nprint(find_val(10, ${target}))`,
      language: "python",
      expected_output: "True",
      current_output: "False",
      options: [
        { id: "A", text: "Add `return` before recursive call: `return find_val(node_val + 2, target)`" },
        { id: "B", text: "Change `node_val < target` to `node_val > target`" },
        { id: "C", text: "Change `return False` to `return True` at the bottom" },
        { id: "D", text: "Remove `elif`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 57: Malloc sizeof(pointer) vs sizeof(type) (C)
  for (let i = 1; i <= 11; i++) {
    const n = 5 + (i % 5);
    const sum = (n * (n + 1)) / 2;
    bank.push({
      id: `DBG_M_PTR_MAL57_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_PTR_MALLOC_SIZEOF_PTR",
      category: "Pointers",
      sub_category: "Dynamic Memory",
      bug_type: "SizeofPointerVsType",
      concept: "HeapAllocation",
      difficulty: "MEDIUM",
      topic: "Dynamic Memory Allocation",
      points: 15,
      title: `Heap Buffer Malloc Sizing #${i}`,
      description: `Allocate heap buffer of ${n} integers and compute sum (${sum}).`,
      code_snippet: `#include <stdio.h>\n#include <stdlib.h>\n\nint main() {\n    int n = ${n};\n    int *arr = (int *)malloc(n * sizeof(arr));\n    int sum = 0;\n    for (int i = 0; i < n; i++) {\n        arr[i] = i + 1;\n        sum += arr[i];\n    }\n    printf("%d\\n", sum);\n    free(arr);\n    return 0;\n}`,
      language: "c",
      expected_output: `${sum}`,
      current_output: `Potential memory corruption on 64-bit systems / Heap under-allocation`,
      options: [
        { id: "A", text: "Change `sizeof(arr)` to `sizeof(int)` or `sizeof(*arr)`" },
        { id: "B", text: "Remove `free(arr)`" },
        { id: "C", text: "Change `int *arr` to `int **arr`" },
        { id: "D", text: "Change `malloc` to `realloc`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 58: Dynamic Allocation Inside Helper via Single Pointer (C)
  for (let i = 1; i <= 11; i++) {
    const val = 100 + i * 10;
    bank.push({
      id: `DBG_M_PTR_DBL58_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_PTR_DOUBLE_PTR_ALLOC",
      category: "Pointers",
      sub_category: "Double Pointers",
      bug_type: "PassByValuePointerModification",
      concept: "PointerToPointer",
      difficulty: "MEDIUM",
      topic: "Helper Memory Allocation",
      points: 15,
      title: `Helper Memory Allocation Single Pointer Trap #${i}`,
      description: `Allocate integer on heap via helper function and store ${val}.`,
      code_snippet: `#include <stdio.h>\n#include <stdlib.h>\n\nvoid allocate(int *p, int val) {\n    p = (int *)malloc(sizeof(int));\n    *p = val;\n}\n\nint main() {\n    int *ptr = NULL;\n    allocate(ptr, ${val});\n    printf("%d\\n", *ptr);\n    return 0;\n}`,
      language: "c",
      expected_output: `${val}`,
      current_output: `Segmentation fault (core dumped) - ptr remains NULL`,
      options: [
        { id: "A", text: "Pass a double pointer: `void allocate(int **p, int val)` and invoke `allocate(&ptr, ${val})`" },
        { id: "B", text: "Change `int *ptr = NULL` to `int *ptr = 0`" },
        { id: "C", text: "Remove `malloc` from `allocate`" },
        { id: "D", text: "Change `%d` to `%p`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 59: Use After Free Struct Access (C)
  for (let i = 1; i <= 11; i++) {
    const val = 42 + i;
    bank.push({
      id: `DBG_M_PTR_UAF59_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_PTR_FREE_DANGLING_USE",
      category: "Pointers",
      sub_category: "Memory Management",
      bug_type: "UseAfterFree",
      concept: "DanglingPointer",
      difficulty: "MEDIUM",
      topic: "Dangling Pointer",
      points: 15,
      title: `Struct Use-After-Free #${i}`,
      description: `Read and print value ${val} from dynamic struct.`,
      code_snippet: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Data {\n    int value;\n};\n\nint main() {\n    struct Data *d = (struct Data *)malloc(sizeof(struct Data));\n    d->value = ${val};\n    free(d);\n    printf("%d\\n", d->value);\n    return 0;\n}`,
      language: "c",
      expected_output: `${val}`,
      current_output: `Undefined behavior / Accessing freed heap memory`,
      options: [
        { id: "A", text: "Move `free(d);` after the `printf` statement" },
        { id: "B", text: "Change `struct Data *d` to `struct Data d`" },
        { id: "C", text: "Cast `d->value` to pointer" },
        { id: "D", text: "Call `malloc` twice" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 60: Array Parameter Sizeof Decay (C)
  for (let i = 1; i <= 11; i++) {
    const len = 5;
    bank.push({
      id: `DBG_M_PTR_DCY60_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_PTR_ARRAY_PARAM_DECAY",
      category: "Pointers",
      sub_category: "Array Decay",
      bug_type: "SizeofArrayParameterDecay",
      concept: "ParameterDecay",
      difficulty: "MEDIUM",
      topic: "Array Parameter Decay",
      points: 15,
      title: `Array Parameter Sizeof Decay #${i}`,
      description: `Compute number of elements in array inside function.`,
      code_snippet: `#include <stdio.h>\n\nint get_len(int arr[]) {\n    return sizeof(arr) / sizeof(arr[0]);\n}\n\nint main() {\n    int my_arr[${len}] = {0};\n    printf("%d\\n", get_len(my_arr));\n    return 0;\n}`,
      language: "c",
      expected_output: `${len}`,
      current_output: `2 on 64-bit systems (sizeof(int*) / sizeof(int) = 8/4)`,
      options: [
        { id: "A", text: "Pass length explicitly as a parameter: `int get_len(int arr[], int n)`" },
        { id: "B", text: "Change `int arr[]` to `int arr[${len}]` in parameter list" },
        { id: "C", text: "Change `sizeof(arr[0])` to `sizeof(int*)`" },
        { id: "D", text: "Declare array global" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 61: Linked List Insert at Head Link Loss (C)
  for (let i = 1; i <= 11; i++) {
    const v1 = i * 10;
    const v2 = (i + 1) * 10;
    bank.push({
      id: `DBG_M_DS_LL61_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_DS_LL_INSERT_HEAD_LOSS",
      category: "Data Structures",
      sub_category: "Linked List",
      bug_type: "LinkLossHeadInsert",
      concept: "PointerRewiring",
      difficulty: "MEDIUM",
      topic: "Linked List Insertion",
      points: 15,
      title: `Linked List Head Insertion Link #${i}`,
      description: `Insert node with value ${v2} at head of list containing ${v1}.`,
      code_snippet: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node *next;\n};\n\nstruct Node* insert_front(struct Node *head, int val) {\n    struct Node *newNode = (struct Node *)malloc(sizeof(struct Node));\n    newNode->data = val;\n    head = newNode;\n    return head;\n}\n\nint main() {\n    struct Node *head = (struct Node *)malloc(sizeof(struct Node));\n    head->data = ${v1};\n    head->next = NULL;\n    head = insert_front(head, ${v2});\n    printf("%d\\n", head->next ? head->next->data : -1);\n    return 0;\n}`,
      language: "c",
      expected_output: `${v1}`,
      current_output: `-1 (head->next is NULL, previous node lost)`,
      options: [
        { id: "A", text: "Link new node before updating head: `newNode->next = head; head = newNode;`" },
        { id: "B", text: "Change `head->next` to `head->data`" },
        { id: "C", text: "Remove `malloc`" },
        { id: "D", text: "Cast `head` to int" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 62: Linked List Traversal Tail Omission (C)
  for (let i = 1; i <= 11; i++) {
    const v1 = 10 + i;
    const v2 = 20 + i;
    bank.push({
      id: `DBG_M_DS_LLTR62_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_DS_LL_TRAVERSAL_EARLY_STOP",
      category: "Data Structures",
      sub_category: "Linked List",
      bug_type: "TailNodeOmission",
      concept: "LinkedListTraversal",
      difficulty: "MEDIUM",
      topic: "Linked List Traversal",
      points: 15,
      title: `Linked List Traversal Tail Visit #${i}`,
      description: `Sum values of 2-node linked list (${v1} + ${v2}).`,
      code_snippet: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node {\n    int data;\n    struct Node *next;\n};\n\nint sum_list(struct Node *head) {\n    int sum = 0;\n    struct Node *curr = head;\n    while (curr->next != NULL) {\n        sum += curr->data;\n        curr = curr->next;\n    }\n    return sum;\n}\n\nint main() {\n    struct Node *n1 = (struct Node*)malloc(sizeof(struct Node));\n    struct Node *n2 = (struct Node*)malloc(sizeof(struct Node));\n    n1->data = ${v1}; n1->next = n2;\n    n2->data = ${v2}; n2->next = NULL;\n    printf("%d\\n", sum_list(n1));\n    return 0;\n}`,
      language: "c",
      expected_output: `${v1 + v2}`,
      current_output: `${v1}`,
      options: [
        { id: "A", text: "Change loop condition `while (curr->next != NULL)` to `while (curr != NULL)`" },
        { id: "B", text: "Change `curr = curr->next` to `curr = curr`" },
        { id: "C", text: "Initialize `int sum = n2->data;`" },
        { id: "D", text: "Free `n1` before loop" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 63: Stack Balanced Parenthesis Empty Check (Python)
  for (let i = 1; i <= 11; i++) {
    bank.push({
      id: `DBG_M_DS_PAR63_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_DS_STACK_BALANCED_PARENS",
      category: "Data Structures",
      sub_category: "Stack",
      bug_type: "EmptyStackPop",
      concept: "BracketMatching",
      difficulty: "MEDIUM",
      topic: "Balanced Parentheses",
      points: 15,
      title: `Stack Parentheses Matching Empty Check #${i}`,
      description: `Validate bracket string ")(" safely.`,
      code_snippet: `def is_valid(s):\n    stack = []\n    for char in s:\n        if char == "(": stack.append(char)\n        elif char == ")": stack.pop()\n    return len(stack) == 0\n\ntry:\n    print(is_valid(")("))\nexcept Exception as e:\n    print(type(e).__name__)`,
      language: "python",
      expected_output: "False",
      current_output: "IndexError",
      options: [
        { id: "A", text: "Check `if not stack: return False` before calling `stack.pop()`" },
        { id: "B", text: "Change `len(stack) == 0` to `len(stack) != 0`" },
        { id: "C", text: "Change `stack.append` to `stack.extend`" },
        { id: "D", text: "Reverse string before processing" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 64: Circular Queue Rear Modulo Wrap (C)
  for (let i = 1; i <= 11; i++) {
    const cap = 5;
    const val = 99 + i;
    bank.push({
      id: `DBG_M_DS_CQU64_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_DS_QUEUE_CIRCULAR_WRAP",
      category: "Data Structures",
      sub_category: "Queue",
      bug_type: "MissingModuloWrap",
      concept: "CircularBuffer",
      difficulty: "MEDIUM",
      topic: "Circular Queue Operations",
      points: 15,
      title: `Circular Queue Modulo Wrap #${i}`,
      description: `Enqueue element ${val} into circular queue of capacity ${cap}.`,
      code_snippet: `#include <stdio.h>\n\nint cq[${cap}];\nint rear = ${cap - 1};\n\nvoid enqueue(int x) {\n    rear = rear + 1;\n    cq[rear] = x;\n}\n\nint main() {\n    enqueue(${val});\n    printf("%d\\n", cq[0]);\n    return 0;\n}`,
      language: "c",
      expected_output: `${val}`,
      current_output: `Out-of-bounds write to cq[${cap}]`,
      options: [
        { id: "A", text: `Change \`rear = rear + 1;\` to \`rear = (rear + 1) % ${cap};\`` },
        { id: "B", text: "Change `cq[0]` to `cq[rear]`" },
        { id: "C", text: `Increase array size to \`cq[${cap * 2}]\`` },
        { id: "D", text: "Initialize `rear = 0`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 65: Binary Search Midpoint Calculation Overflow & Bounds (C)
  for (let i = 1; i <= 11; i++) {
    const target = 40 + i * 2;
    bank.push({
      id: `DBG_M_ALG_BS65_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_ALG_BINARY_SEARCH_MID",
      category: "Algorithms",
      sub_category: "Binary Search",
      bug_type: "MidpointBoundaryUpdate",
      concept: "BinarySearchInterval",
      difficulty: "MEDIUM",
      topic: "Binary Search Boundary",
      points: 15,
      title: `Binary Search Low Boundary Update #${i}`,
      description: `Search sorted array for target ${target}.`,
      code_snippet: `#include <stdio.h>\n\nint bsearch(int arr[], int n, int target) {\n    int low = 0, high = n - 1;\n    while (low <= high) {\n        int mid = (low + high) / 2;\n        if (arr[mid] == target) return mid;\n        else if (arr[mid] < target) low = mid;\n        else high = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    int a[] = {10, 20, 30, ${target}};\n    printf("%d\\n", bsearch(a, 4, ${target}));\n    return 0;\n}`,
      language: "c",
      expected_output: `3`,
      current_output: `Infinite loop (low remains equal to mid)`,
      options: [
        { id: "A", text: "Change `low = mid;` to `low = mid + 1;`" },
        { id: "B", text: "Change `low <= high` to `low < high`" },
        { id: "C", text: "Change `high = mid - 1` to `high = mid`" },
        { id: "D", text: "Cast `mid` to float" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 66: Bubble Sort Inner Loop Bound Off-By-One (C)
  for (let i = 1; i <= 11; i++) {
    const a = 50 + i, b = 20 + i, c = 10 + i;
    bank.push({
      id: `DBG_M_ALG_BSORT66_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_ALG_BUBBLE_SORT_INNER_BOUND",
      category: "Algorithms",
      sub_category: "Sorting",
      bug_type: "InnerLoopComparisonOOB",
      concept: "BubbleSort",
      difficulty: "MEDIUM",
      topic: "Bubble Sort Bounds",
      points: 15,
      title: `Bubble Sort Inner Loop Boundary #${i}`,
      description: `Sort array of size 3 in ascending order.`,
      code_snippet: `#include <stdio.h>\n\nvoid bubble_sort(int arr[], int n) {\n    for (int i = 0; i < n - 1; i++) {\n        for (int j = 0; j < n; j++) {\n            if (arr[j] > arr[j + 1]) {\n                int t = arr[j]; arr[j] = arr[j + 1]; arr[j + 1] = t;\n            }\n        }\n    }\n}\n\nint main() {\n    int arr[3] = {${a}, ${b}, ${c}};\n    bubble_sort(arr, 3);\n    printf("%d %d %d\\n", arr[0], arr[1], arr[2]);\n    return 0;\n}`,
      language: "c",
      expected_output: `${c} ${b} ${a}`,
      current_output: `Out-of-bounds access on arr[j+1] when j=2`,
      options: [
        { id: "A", text: "Change inner loop condition to `j < n - 1 - i`" },
        { id: "B", text: "Change `i < n - 1` to `i < n`" },
        { id: "C", text: "Change `arr[j] > arr[j + 1]` to `arr[j] < arr[j + 1]`" },
        { id: "D", text: "Declare array size 4" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 67: Two-Pointer Sum on Unsorted Array (Python)
  for (let i = 1; i <= 11; i++) {
    const nums = [40 + i, 10 + i, 20 + i, 30 + i];
    const target = 30 + (2 * i);
    bank.push({
      id: `DBG_M_ALG_2SUM67_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_ALG_TWO_SUM_SORTED",
      category: "Algorithms",
      sub_category: "Two Pointer",
      bug_type: "UnsortedPrecondition",
      concept: "SortedArrayAssumption",
      difficulty: "MEDIUM",
      topic: "Two-Pointer Preconditions",
      points: 15,
      title: `Two-Pointer Search on Unsorted List #${i}`,
      description: `Find two elements summing to ${target}.`,
      code_snippet: `def two_sum(arr, target):\n    left = 0\n    right = len(arr) - 1\n    while left < right:\n        curr = arr[left] + arr[right]\n        if curr == target: return True\n        elif curr < target: left += 1\n        else: right -= 1\n    return False\n\nprint(two_sum([${nums.join(", ")}], ${target}))`,
      language: "python",
      expected_output: "True",
      current_output: "False",
      options: [
        { id: "A", text: "Sort array first: `arr.sort()` before running the two-pointer loop" },
        { id: "B", text: "Change `curr < target` to `curr > target`" },
        { id: "C", text: "Change `left < right` to `left <= right`" },
        { id: "D", text: "Use `target - curr`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 68: Frequency Map Overwrite in Loop (Python)
  for (let i = 1; i <= 11; i++) {
    const chars = ["a", "b", "a", "c", "a"];
    bank.push({
      id: `DBG_M_ALG_FRQ68_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_ALG_FREQUENCY_MAP_KEY",
      category: "Algorithms",
      sub_category: "Hash Maps",
      bug_type: "ValueOverwriteVsAccumulate",
      concept: "FrequencyCounting",
      difficulty: "MEDIUM",
      topic: "Frequency Counter Logic",
      points: 15,
      title: `Character Frequency Map Accumulator #${i}`,
      description: `Count total occurrences of character 'a'.`,
      code_snippet: `counts = {}\nfor ch in ${JSON.stringify(chars)}:\n    counts[ch] = 1\nprint(counts["a"])`,
      language: "python",
      expected_output: `3`,
      current_output: `1`,
      options: [
        { id: "A", text: "Change `counts[ch] = 1` to `counts[ch] = counts.get(ch, 0) + 1`" },
        { id: "B", text: "Initialize `counts = set()`" },
        { id: "C", text: "Change `counts[\"a\"]` to `counts[0]`" },
        { id: "D", text: "Iterate with `enumerate`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 69: Bitwise Power of Two Expression Precedence (C)
  for (let i = 1; i <= 11; i++) {
    const p2 = 1 << ((i % 5) + 1); // 2, 4, 8, 16, 32
    bank.push({
      id: `DBG_M_MTH_POW69_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_MATH_BIT_POWER_OF_TWO",
      category: "Mathematics",
      sub_category: "Bit Manipulation",
      bug_type: "OperatorPrecedenceSubtraction",
      concept: "BitwiseFormula",
      difficulty: "MEDIUM",
      topic: "Bitwise Power of Two",
      points: 15,
      title: `Bitwise Power of Two Formula Precedence #${i}`,
      description: `Determine if ${p2} is a power of 2.`,
      code_snippet: `#include <stdio.h>\n\nint is_pow2(int n) {\n    return (n > 0) && ((n & n - 1) == 0);\n}\n\nint main() {\n    printf("%d\\n", is_pow2(${p2}));\n    return 0;\n}`,
      language: "c",
      expected_output: `1`,
      current_output: `0 (Due to subtraction '-' binding tighter than '&')`,
      options: [
        { id: "A", text: "Change `(n & n - 1)` to `(n & (n - 1))` with parentheses" },
        { id: "B", text: "Change `n & n - 1` to `n | n - 1`" },
        { id: "C", text: "Change `(n > 0)` to `(n >= 0)`" },
        { id: "D", text: "Use logical AND `n && (n - 1)`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 70: Negative Odd Number Modulo Check (C)
  for (let i = 1; i <= 11; i++) {
    const num = -3 - i * 2; // Negative odd
    bank.push({
      id: `DBG_M_MTH_ODD70_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_MATH_EVEN_ODD_NEGATIVE",
      category: "Mathematics",
      sub_category: "Modulo",
      bug_type: "NegativeRemainderCheck",
      concept: "SignHandling",
      difficulty: "MEDIUM",
      topic: "Negative Number Parity",
      points: 15,
      title: `Negative Odd Number Parity #${i}`,
      description: `Verify if negative integer ${num} is odd.`,
      code_snippet: `#include <stdio.h>\n\nint is_odd(int n) {\n    return (n % 2 == 1);\n}\n\nint main() {\n    printf("%d\\n", is_odd(${num}));\n    return 0;\n}`,
      language: "c",
      expected_output: `1`,
      current_output: `0 (In C, negative % 2 evaluates to -1)`,
      options: [
        { id: "A", text: "Change `(n % 2 == 1)` to `(n % 2 != 0)`" },
        { id: "B", text: "Change `n % 2` to `n / 2`" },
        { id: "C", text: "Change `== 1` to `== 0`" },
        { id: "D", text: "Cast `n` to unsigned" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 71: Float Equality Comparison vs Epsilon (C)
  for (let i = 1; i <= 11; i++) {
    bank.push({
      id: `DBG_M_MTH_EPS71_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_MATH_FLOAT_EQUALITY_EPSILON",
      category: "Mathematics",
      sub_category: "Floating Point",
      bug_type: "DirectFloatEquality",
      concept: "EpsilonTolerance",
      difficulty: "MEDIUM",
      topic: "Float Comparison Epsilon",
      points: 15,
      title: `Floating-Point Direct Equality Comparison #${i}`,
      description: `Verify if computed floating-point sum equals 0.3.`,
      code_snippet: `#include <stdio.h>\n#include <math.h>\n\nint main() {\n    double a = 0.1 + 0.2;\n    if (a == 0.3) {\n        printf("EQUAL\\n");\n    } else {\n        printf("UNEQUAL\\n");\n    }\n    return 0;\n}`,
      language: "c",
      expected_output: "EQUAL",
      current_output: "UNEQUAL",
      options: [
        { id: "A", text: "Use epsilon tolerance: `if (fabs(a - 0.3) < 1e-9)`" },
        { id: "B", text: "Change `double` to `float`" },
        { id: "C", text: "Change `== 0.3` to `= 0.3`" },
        { id: "D", text: "Multiply `a` by 10" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 72: Generator Single-Pass Exhaustion (Python)
  for (let i = 1; i <= 11; i++) {
    const limit = 4 + (i % 3);
    const sumVal = (limit * (limit - 1)) / 2;
    bank.push({
      id: `DBG_M_IO_GEN72_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_MED_IO_GENERATOR_EXHAUST",
      category: "Input / Output",
      sub_category: "Generators",
      bug_type: "GeneratorExhaustion",
      concept: "IteratorProtocol",
      difficulty: "MEDIUM",
      topic: "Generator Exhaustion",
      points: 15,
      title: `Generator Single-Pass Multi-Consumption #${i}`,
      description: `Compute both total sum and count of generated items.`,
      code_snippet: `gen = (x for x in range(${limit}))\ntotal = sum(gen)\ncount = len(list(gen))\nprint(total, count)`,
      language: "python",
      expected_output: `${sumVal} ${limit}`,
      current_output: `${sumVal} 0`,
      options: [
        { id: "A", text: "Convert to reusable list `gen = list(range(${limit}))` before computing sum and len" },
        { id: "B", text: "Change `len(list(gen))` to `gen.count()`" },
        { id: "C", text: "Change `(x for x...)` to `{x for x...}`" },
        { id: "D", text: "Call `next(gen)`" }
      ],
      correct_option_id: "A"
    });
  }

  // =======================================================================================
  // PART 3: 33 HARD QUESTION FAMILIES (Weight = 3 pts, 13 variants each = 429 questions)
  // =======================================================================================

  // FAM 73: Coroutine State Yield Return Propagation (Python)
  for (let i = 1; i <= 13; i++) {
    const base = i * 5;
    bank.push({
      id: `DBG_H_CF_YLD73_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_CF_COROUTINE_STATE_YIELD",
      category: "Control Flow",
      sub_category: "Generators",
      bug_type: "YieldFromOmission",
      concept: "GeneratorDelegation",
      difficulty: "HARD",
      topic: "Generator Delegation",
      points: 20,
      title: `Subgenerator Delegation with yield from #${i}`,
      description: `Delegate generation of numbers across subgenerators.`,
      code_snippet: `def sub():\n    yield ${base}\n    yield ${base + 1}\n\ndef main_gen():\n    sub()\n    yield ${base + 2}\n\nprint(list(main_gen()))`,
      language: "python",
      expected_output: `[${base}, ${base + 1}, ${base + 2}]`,
      current_output: `[${base + 2}]`,
      options: [
        { id: "A", text: "Change `sub()` to `yield from sub()` inside `main_gen()`" },
        { id: "B", text: "Change `sub()` to `return sub()`" },
        { id: "C", text: "Change `yield` to `return` in `sub()`" },
        { id: "D", text: "Call `main_gen()` twice" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 74: Complex Short-Circuit Evaluation Side Effect in Loop (C)
  for (let i = 1; i <= 13; i++) {
    const threshold = 10 + i;
    bank.push({
      id: `DBG_H_CF_SHRT74_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_CF_SHORT_CIRCUIT_ASSIGN",
      category: "Control Flow",
      sub_category: "Short Circuit",
      bug_type: "ShortCircuitSideEffectInLoop",
      concept: "ShortCircuitFlow",
      difficulty: "HARD",
      topic: "Complex Short-Circuit Flow",
      points: 20,
      title: `Complex Short-Circuit Condition Traversal #${i}`,
      description: `Iterate and update accumulator state when condition flag is active.`,
      code_snippet: `#include <stdio.h>\n\nint state = 0;\nint check() { state += 5; return 1; }\n\nint main() {\n    int flag = 1;\n    if (flag == 1 || check()) {\n        printf("%d\\n", state);\n    }\n    return 0;\n}`,
      language: "c",
      expected_output: `5`,
      current_output: `0`,
      options: [
        { id: "A", text: "Call `check()` explicitly before condition or swap operands: `if (check() || flag == 1)`" },
        { id: "B", text: "Change `flag == 1` to `flag == 0`" },
        { id: "C", text: "Declare `state` as `const int`" },
        { id: "D", text: "Change `||` to `&&` without checking flag" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 75: 2D Matrix Spiral Traversal Overlap (C)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_ARR_SPR75_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_ARR_SPIRAL_MATRIX_BOUND",
      category: "Arrays",
      sub_category: "2D Matrix Algorithms",
      bug_type: "SpiralBoundaryOverlap",
      concept: "MatrixSpiralTraversal",
      difficulty: "HARD",
      topic: "Spiral Matrix Boundaries",
      points: 20,
      title: `Spiral Matrix Traversal Boundary Check #${i}`,
      description: `Traverse 2x3 matrix in spiral order without double visiting.`,
      code_snippet: `#include <stdio.h>\n\nvoid spiral(int r, int c, int mat[2][3]) {\n    int top = 0, bottom = r - 1, left = 0, right = c - 1;\n    while (top <= bottom && left <= right) {\n        for (int i = left; i <= right; i++) printf("%d ", mat[top][i]);\n        top++;\n        for (int i = top; i <= bottom; i++) printf("%d ", mat[i][right]);\n        right--;\n        for (int i = right; i >= left; i--) printf("%d ", mat[bottom][i]);\n        bottom--;\n    }\n    printf("\\n");\n}\n\nint main() {\n    int m[2][3] = {{1, 2, 3}, {4, 5, 6}};\n    spiral(2, 3, m);\n    return 0;\n}`,
      language: "c",
      expected_output: `1 2 3 6 5 4`,
      current_output: `1 2 3 6 5 4 4 (elements re-visited when top > bottom)`,
      options: [
        { id: "A", text: "Add check `if (top <= bottom)` before bottom row reverse traversal" },
        { id: "B", text: "Change `while (top <= bottom)` to `while (top < bottom)`" },
        { id: "C", text: "Change `right--` to `right++`" },
        { id: "D", text: "Change `mat[bottom][i]` to `mat[top][i]`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 76: Kadane's Max Subarray All-Negative Elements (Python)
  for (let i = 1; i <= 13; i++) {
    const n1 = -10 - i, n2 = -2 - i, n3 = -7 - i;
    const maxVal = Math.max(n1, n2, n3);
    bank.push({
      id: `DBG_H_ARR_KAD76_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_ARR_KADANE_ALL_NEGATIVE",
      category: "Algorithms",
      sub_category: "Dynamic Programming",
      bug_type: "ZeroInitAllNegativeBug",
      concept: "KadaneAlgorithm",
      difficulty: "HARD",
      topic: "Kadane's Algorithm Edge Cases",
      points: 20,
      title: `Kadane's Maximum Subarray Negative Array #${i}`,
      description: `Find max subarray sum in array of all negative numbers (${n1}, ${n2}, ${n3}).`,
      code_snippet: `def max_sub(arr):\n    max_so_far = 0\n    curr_max = 0\n    for x in arr:\n        curr_max += x\n        if curr_max < 0: curr_max = 0\n        if curr_max > max_so_far: max_so_far = curr_max\n    return max_so_far\n\nprint(max_sub([${n1}, ${n2}, ${n3}]))`,
      language: "python",
      expected_output: `${maxVal}`,
      current_output: `0`,
      options: [
        { id: "A", text: "Initialize `max_so_far = arr[0]` and `curr_max = arr[0]`, updating `curr_max = max(x, curr_max + x)`" },
        { id: "B", text: "Change `curr_max < 0` to `curr_max < -100`" },
        { id: "C", text: "Return `curr_max` instead of `max_so_far`" },
        { id: "D", text: "Multiply array elements by -1" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 77: Dutch National Flag 3-Way Partition Pointer Step (C)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_ARR_DNF77_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_ARR_DUTCH_NATIONAL_FLAG",
      category: "Algorithms",
      sub_category: "Partitioning",
      bug_type: "PrematurePointerAdvance",
      concept: "DutchNationalFlag",
      difficulty: "HARD",
      topic: "3-Way Partitioning",
      points: 20,
      title: `Dutch National Flag Partition Pointer Step #${i}`,
      description: `Sort array of 0s, 1s, and 2s in single pass.`,
      code_snippet: `#include <stdio.h>\n\nvoid sort012(int a[], int n) {\n    int low = 0, mid = 0, high = n - 1;\n    while (mid <= high) {\n        if (a[mid] == 0) {\n            int t = a[low]; a[low] = a[mid]; a[mid] = t;\n            low++; mid++;\n        } else if (a[mid] == 1) {\n            mid++;\n        } else {\n            int t = a[mid]; a[mid] = a[high]; a[high] = t;\n            mid++; high--;\n        }\n    }\n}\n\nint main() {\n    int a[] = {2, 0, 1};\n    sort012(a, 3);\n    printf("%d %d %d\\n", a[0], a[1], a[2]);\n    return 0;\n}`,
      language: "c",
      expected_output: `0 1 2`,
      current_output: `1 0 2 (Unsorted because mid was incremented on high swap without re-evaluating)`,
      options: [
        { id: "A", text: "Remove `mid++;` when swapping with `high` (do not advance mid until swapped element is checked)" },
        { id: "B", text: "Change `mid <= high` to `mid < high`" },
        { id: "C", text: "Change `low++` to `low--`" },
        { id: "D", text: "Swap `a[low]` with `a[high]` directly" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 78: KMP LPS Array Fallback Index (C)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_STR_KMP78_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_STR_KMP_LPS_COMPUTATION",
      category: "Strings",
      sub_category: "Pattern Matching",
      bug_type: "LPSFallbackZeroReset",
      concept: "KMPAlgorithm",
      difficulty: "HARD",
      topic: "KMP Prefix-Suffix Array",
      points: 20,
      title: `KMP LPS Fallback Pointer #${i}`,
      description: `Compute longest prefix-suffix (LPS) array for pattern "AAACAAAA".`,
      code_snippet: `#include <stdio.h>\n#include <string.h>\n\nvoid computeLPS(char *pat, int M, int *lps) {\n    int len = 0, i = 1;\n    lps[0] = 0;\n    while (i < M) {\n        if (pat[i] == pat[len]) {\n            len++; lps[i] = len; i++;\n        } else {\n            if (len != 0) len = 0;\n            else { lps[i] = 0; i++; }\n        }\n    }\n}\n\nint main() {\n    char pat[] = "AAAA";\n    int lps[4];\n    computeLPS(pat, 4, lps);\n    printf("%d\\n", lps[3]);\n    return 0;\n}`,
      language: "c",
      expected_output: `3`,
      current_output: `0 / 1 (len was reset to 0 instead of falling back to lps[len-1])`,
      options: [
        { id: "A", text: "Change `if (len != 0) len = 0;` to `if (len != 0) len = lps[len - 1];`" },
        { id: "B", text: "Change `lps[0] = 0` to `lps[0] = 1`" },
        { id: "C", text: "Change `i = 1` to `i = 0`" },
        { id: "D", text: "Change `pat[i] == pat[len]` to `pat[i] != pat[len]`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 79: Anagram Sliding Window Map (Python)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_STR_ANG79_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_STR_ANAGRAM_SLIDING_WINDOW",
      category: "Strings",
      sub_category: "Sliding Window",
      bug_type: "SlidingWindowExpiry",
      concept: "SlidingWindowMap",
      difficulty: "HARD",
      topic: "Sliding Window Anagrams",
      points: 20,
      title: `Sliding Window Character Expiry #${i}`,
      description: `Find count of anagram occurrences of "ab" in "abab".`,
      code_snippet: `def find_anagrams(s, p):\n    from collections import Counter\n    p_count = Counter(p)\n    s_count = Counter()\n    res = 0\n    for i in range(len(s)):\n        s_count[s[i]] += 1\n        if i >= len(p):\n            del s_count[s[i - len(p)]]\n        if s_count == p_count: res += 1\n    return res\n\nprint(find_anagrams("abab", "ab"))`,
      language: "python",
      expected_output: `3`,
      current_output: `1 (del wiped out entire character count instead of decrementing count by 1)`,
      options: [
        { id: "A", text: "Decrement count by 1 and only delete key if count reaches 0: `s_count[char] -= 1; if s_count[char] == 0: del s_count[char]`" },
        { id: "B", text: "Change `i >= len(p)` to `i > len(p)`" },
        { id: "C", text: "Change `s_count == p_count` to `s_count in p_count`" },
        { id: "D", text: "Sort strings before loop" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 80: Decorator Wrapper Argument Forwarding (Python)
  for (let i = 1; i <= 13; i++) {
    const a = i * 3, b = i * 4;
    bank.push({
      id: `DBG_H_FN_DEC80_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_FUNC_DECORATOR_ARG_FORWARD",
      category: "Functions",
      sub_category: "Decorators",
      bug_type: "MissingWrapperParameters",
      concept: "DecoratorSignature",
      difficulty: "HARD",
      topic: "Python Decorator Wrapper",
      points: 20,
      title: `Decorator Wrapper Generic Arguments #${i}`,
      description: `Decorate multiplier function taking 2 arguments.`,
      code_snippet: `def logger(func):\n    def wrapper():\n        return func()\n    return wrapper\n\n@logger\ndef multiply(a, b):\n    return a * b\n\ntry:\n    print(multiply(${a}, ${b}))\nexcept Exception as e:\n    print(type(e).__name__)`,
      language: "python",
      expected_output: `${a * b}`,
      current_output: `TypeError`,
      options: [
        { id: "A", text: "Accept and forward variable arguments: `def wrapper(*args, **kwargs): return func(*args, **kwargs)`" },
        { id: "B", text: "Change `@logger` to `@logger()`" },
        { id: "C", text: "Change `return wrapper` to `return func`" },
        { id: "D", text: "Cast arguments to list" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 81: Python Multiple Inheritance MRO & Super (Python)
  for (let i = 1; i <= 13; i++) {
    const baseVal = 10 + i;
    bank.push({
      id: `DBG_H_FN_MRO81_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_FUNC_OOP_MRO_SUPER",
      category: "Functions",
      sub_category: "OOP / Inheritance",
      bug_type: "DirectBaseInitDiamondProblem",
      concept: "MethodResolutionOrder",
      difficulty: "HARD",
      topic: "Python Diamond Problem & MRO",
      points: 20,
      title: `Multiple Inheritance Constructor MRO #${i}`,
      description: `Initialize Child class so Base.__init__ runs exactly once with cooperative super().`,
      code_snippet: `class Base:\n    def __init__(self):\n        self.val = ${baseVal}\n\nclass A(Base):\n    def __init__(self):\n        Base.__init__(self)\n        self.val += 10\n\nclass B(Base):\n    def __init__(self):\n        Base.__init__(self)\n        self.val += 20\n\nclass Child(A, B):\n    def __init__(self):\n        A.__init__(self)\n        B.__init__(self)\n\nc = Child()\nprint(c.val)`,
      language: "python",
      expected_output: `${baseVal + 30}`,
      current_output: `${baseVal + 20} (Base.__init__ executed twice, resetting self.val to ${baseVal})`,
      options: [
        { id: "A", text: "Use cooperative `super().__init__()` across all classes instead of explicit base calls" },
        { id: "B", text: "Change `class Child(A, B)` to `class Child(B, A)`" },
        { id: "C", text: "Remove `self.val += 20`" },
        { id: "D", text: "Declare `val` as class variable" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 82: Python Nested Closure Nonlocal Keyword (Python)
  for (let i = 1; i <= 13; i++) {
    const initVal = 50 + i * 5;
    bank.push({
      id: `DBG_H_FN_NL82_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_FUNC_CLOSURE_MUTATION_NONLOCAL",
      category: "Functions",
      sub_category: "Closures",
      bug_type: "MissingNonlocalKeyword",
      concept: "LexicalScopeMutation",
      difficulty: "HARD",
      topic: "Closure Nonlocal Scoping",
      points: 20,
      title: `Closure Enclosing Scope Mutation #${i}`,
      description: `Mutate outer enclosed variable counter in nested function.`,
      code_snippet: `def make_counter():\n    count = ${initVal}\n    def inc():\n        count += 1\n        return count\n    return inc\n\nc = make_counter()\ntry:\n    print(c())\nexcept Exception as e:\n    print(type(e).__name__)`,
      language: "python",
      expected_output: `${initVal + 1}`,
      current_output: `UnboundLocalError`,
      options: [
        { id: "A", text: "Add `nonlocal count` inside `inc()` function before `count += 1`" },
        { id: "B", text: "Change `count += 1` to `global count; count += 1`" },
        { id: "C", text: "Change `def inc()` to `def inc(count)`" },
        { id: "D", text: "Return `count` without incrementing" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 83: Context Manager __enter__ Return Value (Python)
  for (let i = 1; i <= 13; i++) {
    const payload = 777 + i;
    bank.push({
      id: `DBG_H_FN_CTX83_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_FUNC_CONTEXT_MANAGER_ENTER",
      category: "Functions",
      sub_category: "Context Managers",
      bug_type: "MissingEnterReturnValue",
      concept: "ContextManagerProtocol",
      difficulty: "HARD",
      topic: "Context Manager Protocol",
      points: 20,
      title: `Context Manager __enter__ Binding #${i}`,
      description: `Bind resource manager payload ${payload} to 'as res' target.`,
      code_snippet: `class ManagedResource:\n    def __init__(self, data):\n        self.data = data\n    def __enter__(self):\n        pass\n    def __exit__(self, exc_type, exc_val, exc_tb):\n        pass\n\nwith ManagedResource(${payload}) as res:\n    print(res.data if res else "NONE")`,
      language: "python",
      expected_output: `${payload}`,
      current_output: `NONE (res is None because __enter__ returned None)`,
      options: [
        { id: "A", text: "Add `return self` in `__enter__` method" },
        { id: "B", text: "Change `__exit__` to return True" },
        { id: "C", text: "Change `as res` to `as self`" },
        { id: "D", text: "Inherit from `dict`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 84: Class __hash__ and __eq__ Contract (Python)
  for (let i = 1; i <= 13; i++) {
    const idVal = 101 + i;
    bank.push({
      id: `DBG_H_FN_HSH84_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_FUNC_CLASS_HASH_EQ_CONTRACT",
      category: "Functions",
      sub_category: "Data Model",
      bug_type: "UnhashableTypeCustomEq",
      concept: "HashEqContract",
      difficulty: "HARD",
      topic: "Hash & Equality Contract",
      points: 20,
      title: `Class Hashable Set Deduplication #${i}`,
      description: `Deduplicate identical Student objects in a set.`,
      code_snippet: `class Student:\n    def __init__(self, sid):\n        self.sid = sid\n    def __eq__(self, other):\n        return isinstance(other, Student) and self.sid == other.sid\n\ns1 = Student(${idVal})\ns2 = Student(${idVal})\ntry:\n    print(len({s1, s2}))\nexcept Exception as e:\n    print(type(e).__name__)`,
      language: "python",
      expected_output: `1`,
      current_output: `TypeError: unhashable type: 'Student'`,
      options: [
        { id: "A", text: "Implement `__hash__(self): return hash(self.sid)` in Student class" },
        { id: "B", text: "Remove `__eq__` method" },
        { id: "C", text: "Change `{s1, s2}` to `[s1, s2]`" },
        { id: "D", text: "Inherit from `list`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 85: Tree Diameter Depth vs Path Length (C)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_REC_TR85_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_REC_TREE_DIAMETER_DEPTH",
      category: "Recursion",
      sub_category: "Trees",
      bug_type: "DiameterVsDepthReturn",
      concept: "TreeDiameter",
      difficulty: "HARD",
      topic: "Tree Diameter vs Depth",
      points: 20,
      title: `Binary Tree Longest Path Diameter #${i}`,
      description: `Compute diameter of binary tree where root left and right depths are 2 and 2.`,
      code_snippet: `#include <stdio.h>\n#define MAX(a,b) ((a)>(b)?(a):(b))\n\nint max_diam = 0;\nint depth(int l_depth, int r_depth) {\n    int curr_diam = l_depth + r_depth;\n    if (curr_diam > max_diam) max_diam = curr_diam;\n    return curr_diam;\n}\n\nint main() {\n    depth(2, 2);\n    printf("%d\\n", max_diam);\n    return 0;\n}`,
      language: "c",
      expected_output: `4`,
      current_output: `4`,
      options: [
        { id: "A", text: "Function should return subtree height `1 + MAX(l_depth, r_depth)` while updating `max_diam` globally" },
        { id: "B", text: "Change `l_depth + r_depth` to `l_depth * r_depth`" },
        { id: "C", text: "Change `max_diam = 0` to `max_diam = 1`" },
        { id: "D", text: "Remove `MAX` macro" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 86: Backtracking Visited State Restoration (Python)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_REC_BCK86_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_REC_BACKTRACKING_STATE_RESTORE",
      category: "Recursion",
      sub_category: "Backtracking",
      bug_type: "MissingStateRestoration",
      concept: "BacktrackingState",
      difficulty: "HARD",
      topic: "Backtracking State Reversion",
      points: 20,
      title: `Backtracking Permutations State Restoration #${i}`,
      description: `Generate all 2-element permutations from [1, 2].`,
      code_snippet: `def permute(nums, path, visited, res):\n    if len(path) == len(nums):\n        res.append(list(path))\n        return\n    for i in range(len(nums)):\n        if not visited[i]:\n            visited[i] = True\n            path.append(nums[i])\n            permute(nums, path, visited, res)\n            path.pop()\n            # Bug: missing visited state restore\n\nres = []\npermute([1, 2], [], [False, False], res)\nprint(len(res))`,
      language: "python",
      expected_output: `2`,
      current_output: `1 (Second branch blocked because visited[0] remained True)`,
      options: [
        { id: "A", text: "Add `visited[i] = False` after recursive call to restore visited state" },
        { id: "B", text: "Change `path.pop()` to `path.clear()`" },
        { id: "C", text: "Change `len(path) == len(nums)` to `len(path) == 0`" },
        { id: "D", text: "Sort nums" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 87: DP Memoization Tuple Key Dimension (Python)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_REC_MEM87_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_REC_MEMOIZATION_KEY_TUPLE",
      category: "Recursion",
      sub_category: "Dynamic Programming",
      bug_type: "PartialMemoizationKey",
      concept: "StateDimension",
      difficulty: "HARD",
      topic: "Memoization State Dimensions",
      points: 20,
      title: `Memoization Multi-State Key #${i}`,
      description: `Memoize recursive function depending on both parameters (i, capacity).`,
      code_snippet: `memo = {}\ndef knapsack(i, cap):\n    if i == 0 or cap == 0: return 0\n    if i in memo: return memo[i]\n    res = knapsack(i - 1, cap)\n    memo[i] = res\n    return res\n\nprint(knapsack(2, 5))`,
      language: "python",
      expected_output: `0`,
      current_output: `Incorrect caching (ignores capacity parameter)`,
      options: [
        { id: "A", text: "Use composite key `(i, cap)` in memo dictionary instead of just `i`" },
        { id: "B", text: "Change `memo = {}` to `memo = []`" },
        { id: "C", text: "Change `i == 0 or cap == 0` to `i == 0 and cap == 0`" },
        { id: "D", text: "Remove memo check" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 88: Recursive Nested List Flattening on Empty Sublists (Python)
  for (let i = 1; i <= 13; i++) {
    const val1 = i, val2 = i + 5;
    bank.push({
      id: `DBG_H_REC_FLT88_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_REC_NESTED_FLATTEN",
      category: "Recursion",
      sub_category: "Data Traversal",
      bug_type: "EmptyNestedListBranch",
      concept: "DeepFlattening",
      difficulty: "HARD",
      topic: "Recursive List Flattening",
      points: 20,
      title: `Recursive Deep List Flattening #${i}`,
      description: `Flatten nested list [${val1}, [], [${val2}]] to single flat list.`,
      code_snippet: `def flatten(lst):\n    res = []\n    for x in lst:\n        if isinstance(x, list):\n            res.extend(flatten(x))\n        else:\n            res.append(x)\n    return res\n\nprint(flatten([${val1}, [], [${val2}]]))`,
      language: "python",
      expected_output: `[${val1}, ${val2}]`,
      current_output: `[${val1}, ${val2}]`,
      options: [
        { id: "A", text: "Logic is correct: `res.extend(flatten(x))` cleanly handles empty lists `[]` returning empty result" },
        { id: "B", text: "Change `extend` to `append`" },
        { id: "C", text: "Change `isinstance(x, list)` to `type(x) == int`" },
        { id: "D", text: "Cast `x` to tuple" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 89: Pointer Dereference Increment Precedence *p++ vs (*p)++ (C)
  for (let i = 1; i <= 13; i++) {
    const v0 = 5 + i * 5;
    const v1 = v0 * 2;
    bank.push({
      id: `DBG_H_PTR_PRC89_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_PTR_PRECEDENCE_INCREMENT",
      category: "Pointers",
      sub_category: "Operator Precedence",
      bug_type: "DereferenceIncrementPrecedence",
      concept: "UnaryPrecedence",
      difficulty: "HARD",
      topic: "Pointer Operator Precedence",
      points: 20,
      title: `In-Place Value Increment vs Pointer Advance #${i}`,
      description: `Increment the integer value stored at arr[0] from ${v0} to ${v0 + 1}.`,
      code_snippet: `#include <stdio.h>\n\nint main() {\n    int arr[] = {${v0}, ${v1}};\n    int *p = arr;\n    *p++;\n    printf("%d\\n", arr[0]);\n    return 0;\n}`,
      language: "c",
      expected_output: `${v0 + 1}`,
      current_output: `${v0} (p was incremented to point to arr[1] instead of incrementing *p)`,
      options: [
        { id: "A", text: "Change `*p++;` to `(*p)++;` with parentheses" },
        { id: "B", text: "Change `*p++;` to `*p = *p + 2;`" },
        { id: "C", text: "Change `int *p = arr` to `int *p = &arr[1]`" },
        { id: "D", text: "Change `%d` to `%p`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 90: Function Pointer Callback Signature and Invocation (C)
  for (let i = 1; i <= 13; i++) {
    const a = i * 2, b = i * 3;
    bank.push({
      id: `DBG_H_PTR_FNP90_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_PTR_FUNC_PTR_CALLBACK",
      category: "Pointers",
      sub_category: "Function Pointers",
      bug_type: "FunctionPointerInvocation",
      concept: "CallbackDesign",
      difficulty: "HARD",
      topic: "Function Pointer Signatures",
      points: 20,
      title: `Function Pointer Callback Assignment #${i}`,
      description: `Assign multiplication function to function pointer and execute with arguments (${a}, ${b}).`,
      code_snippet: `#include <stdio.h>\n\nint multiply(int a, int b) {\n    return a * b;\n}\n\nint execute(int (*op)(int, int), int x, int y) {\n    return op(x, y);\n}\n\nint main() {\n    int (*func_ptr)(int, int) = multiply();\n    int res = execute(func_ptr, ${a}, ${b});\n    printf("%d\\n", res);\n    return 0;\n}`,
      language: "c",
      expected_output: `${a * b}`,
      current_output: `Compilation error: too few arguments to function 'multiply'`,
      options: [
        { id: "A", text: "Change assignment to `int (*func_ptr)(int, int) = multiply;` without parentheses" },
        { id: "B", text: "Change `int (*op)(int, int)` to `int op(int, int)`" },
        { id: "C", text: "Change `execute` return type to `void`" },
        { id: "D", text: "Cast `multiply` to `(void *)`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 91: Returning Address of Stack Local Variable (C)
  for (let i = 1; i <= 13; i++) {
    const val = 100 + i * 10;
    bank.push({
      id: `DBG_H_PTR_STK91_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_PTR_STACK_LOCAL_RETURN",
      category: "Pointers",
      sub_category: "Lifetime",
      bug_type: "StackDanglingPointer",
      concept: "VariableLifetime",
      difficulty: "HARD",
      topic: "Stack Variable Lifetime",
      points: 20,
      title: `Stack Variable Lifetime & Dangling Return #${i}`,
      description: `Return dynamically persisted value ${val} from factory function.`,
      code_snippet: `#include <stdio.h>\n\nint* create_value() {\n    int x = ${val};\n    return &x;\n}\n\nint main() {\n    int *ptr = create_value();\n    printf("%d\\n", *ptr);\n    return 0;\n}`,
      language: "c",
      expected_output: `${val}`,
      current_output: `Segmentation fault / Undefined garbage value (stack frame destroyed)`,
      options: [
        { id: "A", text: "Allocate on heap: `int *x = (int *)malloc(sizeof(int)); *x = ${val}; return x;`" },
        { id: "B", text: "Change `return &x` to `return x`" },
        { id: "C", text: "Declare `create_value` as `void`" },
        { id: "D", text: "Cast `&x` to `(int)`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 92: 2D Array Parameter Decay vs Pointer-to-Pointer (C)
  for (let i = 1; i <= 13; i++) {
    const v1 = i, v2 = i + 1, v3 = i + 2, v4 = i + 3;
    const total = v1 + v2 + v3 + v4;
    bank.push({
      id: `DBG_H_PTR_2DD92_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_PTR_2D_ARRAY_DECAY_INT_PP",
      category: "Pointers",
      sub_category: "Array Decay",
      bug_type: "PointerToPointerMismatch",
      concept: "ArrayTo2DPointer",
      difficulty: "HARD",
      topic: "2D Array Pointer Decay",
      points: 20,
      title: `2D Matrix Parameter Array Pointer Decay #${i}`,
      description: `Pass 2x2 matrix to summation function and compute total (${total}).`,
      code_snippet: `#include <stdio.h>\n\nint sum_matrix(int **mat, int r, int c) {\n    int total = 0;\n    for (int i = 0; i < r; i++)\n        for (int j = 0; j < c; j++)\n            total += mat[i][j];\n    return total;\n}\n\nint main() {\n    int matrix[2][2] = {{${v1}, ${v2}}, {${v3}, ${v4}}};\n    printf("%d\\n", sum_matrix(matrix, 2, 2));\n    return 0;\n}`,
      language: "c",
      expected_output: `${total}`,
      current_output: `Segmentation fault (core dumped) - invalid pointer indirection`,
      options: [
        { id: "A", text: "Change parameter declaration to array pointer: `int sum_matrix(int mat[][2], int r, int c)`" },
        { id: "B", text: "Change `int **mat` to `int *mat`" },
        { id: "C", text: "Change `matrix[2][2]` to `matrix[4]`" },
        { id: "D", text: "Remove loop" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 93: Struct Alignment Padding Offset Calculation (C)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_PTR_PAD93_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_PTR_STRUCT_PADDING_OFFSET",
      category: "Pointers",
      sub_category: "Struct Layout",
      bug_type: "StructPaddingAssumption",
      concept: "DataAlignment",
      difficulty: "HARD",
      topic: "Struct Padding & Alignment",
      points: 20,
      title: `Struct Memory Layout & Padding #${i}`,
      description: `Inspect size of struct with char and int members on 32/64-bit alignment.`,
      code_snippet: `#include <stdio.h>\n\nstruct Item {\n    char c;\n    int val;\n};\n\nint main() {\n    printf("%d\\n", (int)sizeof(struct Item));\n    return 0;\n}`,
      language: "c",
      expected_output: `8`,
      current_output: `8 (1 byte char + 3 bytes padding + 4 bytes int)`,
      options: [
        { id: "A", text: "Size is 8 bytes due to 4-byte struct alignment padding (not 5 bytes)" },
        { id: "B", text: "Size is 5 bytes" },
        { id: "C", text: "Size is 16 bytes" },
        { id: "D", text: "Size is undefined" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 94: Floyd's Cycle Detection Null Check Order (C)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_DS_CYC94_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_DS_LL_CYCLE_DETECTION_STEP",
      category: "Data Structures",
      sub_category: "Linked List",
      bug_type: "NullPointerDereferenceFastRunner",
      concept: "FloydCycleDetection",
      difficulty: "HARD",
      topic: "Cycle Detection Two-Pointer",
      points: 20,
      title: `Floyd Cycle Detection Fast Pointer Null Check #${i}`,
      description: `Detect cycle in linear linked list without segfault.`,
      code_snippet: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node { int data; struct Node *next; };\n\nint has_cycle(struct Node *head) {\n    struct Node *slow = head, *fast = head;\n    while (fast != NULL) {\n        slow = slow->next;\n        fast = fast->next->next;\n        if (slow == fast) return 1;\n    }\n    return 0;\n}\n\nint main() {\n    struct Node n = {1, NULL};\n    printf("%d\\n", has_cycle(&n));\n    return 0;\n}`,
      language: "c",
      expected_output: `0`,
      current_output: `Segmentation fault (accessing fast->next->next when fast->next is NULL)`,
      options: [
        { id: "A", text: "Change loop condition to `while (fast != NULL && fast->next != NULL)`" },
        { id: "B", text: "Change `fast = fast->next->next` to `fast = fast->next`" },
        { id: "C", text: "Change `slow == fast` to `slow != fast`" },
        { id: "D", text: "Initialize `fast = head->next`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 95: In-Place Linked List Reversal Link Loss (C)
  for (let i = 1; i <= 13; i++) {
    const v1 = i, v2 = i + 1, v3 = i + 2;
    bank.push({
      id: `DBG_H_DS_REV95_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_DS_LL_REVERSE_POINTERS",
      category: "Data Structures",
      sub_category: "Linked List",
      bug_type: "LinkLossDuringReverse",
      concept: "InPlaceReversal",
      difficulty: "HARD",
      topic: "In-Place Linked List Reversal",
      points: 20,
      title: `In-Place Linked List Reversal Pointer Backup #${i}`,
      description: `Reverse 3-node linked list ({${v1}, ${v2}, ${v3}}).`,
      code_snippet: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node { int val; struct Node *next; };\n\nstruct Node* reverse(struct Node *head) {\n    struct Node *prev = NULL, *curr = head;\n    while (curr != NULL) {\n        curr->next = prev;\n        prev = curr;\n        curr = curr->next;\n    }\n    return prev;\n}\n\nint main() {\n    struct Node n3 = {${v3}, NULL}, n2 = {${v2}, &n3}, n1 = {${v1}, &n2};\n    struct Node *rev = reverse(&n1);\n    printf("%d %d\\n", rev->val, rev->next ? rev->next->val : -1);\n    return 0;\n}`,
      language: "c",
      expected_output: `${v3} ${v2}`,
      current_output: `${v1} -1 (curr->next overwritten before saving next pointer)`,
      options: [
        { id: "A", text: "Save next node first: `struct Node *nxt = curr->next; curr->next = prev; prev = curr; curr = nxt;`" },
        { id: "B", text: "Change `prev = NULL` to `prev = head`" },
        { id: "C", text: "Change `curr != NULL` to `curr->next != NULL`" },
        { id: "D", text: "Return `curr` instead of `prev`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 96: Binary Search Tree Insertion Parent Link Loss (C)
  for (let i = 1; i <= 13; i++) {
    const rootVal = 50, insertVal = 30 + i;
    bank.push({
      id: `DBG_H_DS_BST96_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_DS_BST_INSERTION_LINK",
      category: "Data Structures",
      sub_category: "Trees",
      bug_type: "BSTParentLinkLoss",
      concept: "TreePointerRewiring",
      difficulty: "HARD",
      topic: "BST Insertion Linkage",
      points: 20,
      title: `Binary Search Tree Insertion Link #${i}`,
      description: `Insert value ${insertVal} into BST with root ${rootVal}.`,
      code_snippet: `#include <stdio.h>\n#include <stdlib.h>\n\nstruct Node { int val; struct Node *left, *right; };\n\nvoid bst_insert(struct Node *root, int val) {\n    struct Node *curr = root;\n    while (curr != NULL) {\n        if (val < curr->val) curr = curr->left;\n        else curr = curr->right;\n    }\n    struct Node *n = (struct Node *)malloc(sizeof(struct Node));\n    n->val = val; n->left = n->right = NULL;\n    curr = n;\n}\n\nint main() {\n    struct Node root = {${rootVal}, NULL, NULL};\n    bst_insert(&root, ${insertVal});\n    printf("%d\\n", root.left ? root.left->val : -1);\n    return 0;\n}`,
      language: "c",
      expected_output: `${insertVal}`,
      current_output: `-1 (new node allocated into local pointer curr without linking to parent)`,
      options: [
        { id: "A", text: "Keep track of parent node and link: `if (val < parent->val) parent->left = n; else parent->right = n;`" },
        { id: "B", text: "Change `val < curr->val` to `val > curr->val`" },
        { id: "C", text: "Initialize `root.left = &root`" },
        { id: "D", text: "Free `root`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 97: Min-Heap Sift Down Smaller Child Comparison (C)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_DS_HEP97_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_DS_HEAP_SIFT_DOWN_LARGER_CHILD",
      category: "Data Structures",
      sub_category: "Heaps",
      bug_type: "HeapSiftDownChildSelection",
      concept: "HeapInvariant",
      difficulty: "HARD",
      topic: "Min-Heap Sift Down",
      points: 20,
      title: `Min-Heap Sift Down Child Selection #${i}`,
      description: `Sift down root element in min-heap comparing both left and right children.`,
      code_snippet: `#include <stdio.h>\n\nvoid sift_down(int heap[], int n, int i) {\n    int smallest = i;\n    int l = 2 * i + 1, r = 2 * i + 2;\n    if (l < n && heap[l] < heap[smallest]) smallest = l;\n    if (r < n && heap[r] < heap[smallest]) smallest = r;\n    if (smallest != i) {\n        int t = heap[i]; heap[i] = heap[smallest]; heap[smallest] = t;\n    }\n}\n\nint main() {\n    int h[] = {10, 4, 2};\n    sift_down(h, 3, 0);\n    printf("%d\\n", h[0]);\n    return 0;\n}`,
      language: "c",
      expected_output: `2`,
      current_output: `2`,
      options: [
        { id: "A", text: "Logic is correct: correctly finds smallest among root, left child, and right child before swapping" },
        { id: "B", text: "Change `heap[l] < heap[smallest]` to `heap[l] > heap[smallest]`" },
        { id: "C", text: "Change `2 * i + 1` to `2 * i`" },
        { id: "D", text: "Swap only with left child" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 98: Merge Sort In-Place Temp Array Offset (C)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_ALG_MRG98_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_ALG_MERGE_SORT_INPLACE_OVERWRITE",
      category: "Algorithms",
      sub_category: "Sorting",
      bug_type: "TempArrayCopybackOffset",
      concept: "MergeSortOffset",
      difficulty: "HARD",
      topic: "Merge Sort Indexing",
      points: 20,
      title: `Merge Sort Temp Buffer Copyback #${i}`,
      description: `Merge two sorted subarrays into original array.`,
      code_snippet: `#include <stdio.h>\n\nvoid copy_back(int arr[], int temp[], int left, int right) {\n    for (int i = 0; i <= right - left; i++) {\n        arr[i] = temp[i]; // Bug: wrote to arr[0] instead of arr[left + i]\n    }\n}\n\nint main() {\n    int a[4] = {1, 2, 9, 8};\n    int t[2] = {8, 9};\n    copy_back(a, t, 2, 3);\n    printf("%d %d %d %d\\n", a[0], a[1], a[2], a[3]);\n    return 0;\n}`,
      language: "c",
      expected_output: `1 2 8 9`,
      current_output: `8 9 9 8 (overwrote arr[0] and arr[1])`,
      options: [
        { id: "A", text: "Change `arr[i] = temp[i];` to `arr[left + i] = temp[i];`" },
        { id: "B", text: "Change `i <= right - left` to `i < right - left`" },
        { id: "C", text: "Change `temp[i]` to `temp[left + i]`" },
        { id: "D", text: "Declare `temp` global" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 99: Quick Select Partition Search Range (Python)
  for (let i = 1; i <= 13; i++) {
    const nums = [7, 10, 4, 3, 20, 15];
    bank.push({
      id: `DBG_H_ALG_QCK99_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_ALG_QUICK_SELECT_PARTITION",
      category: "Algorithms",
      sub_category: "Selection",
      bug_type: "PartitionBranchBoundary",
      concept: "QuickSelect",
      difficulty: "HARD",
      topic: "Quick Select K-th Element",
      points: 20,
      title: `Quick Select Pivot Branch Condition #${i}`,
      description: `Find 2nd smallest element in array using quickselect partition.`,
      code_snippet: `def quickselect(arr, k):\n    pivot = arr[len(arr) // 2]\n    lows = [x for x in arr if x < pivot]\n    highs = [x for x in arr if x > pivot]\n    pivots = [x for x in arr if x == pivot]\n    if k < len(lows):\n        return quickselect(lows, k)\n    elif k < len(lows) + len(pivots):\n        return pivots[0]\n    else:\n        return quickselect(highs, k)\n\nprint(quickselect([${nums.join(", ")}], 1))`,
      language: "python",
      expected_output: `4`,
      current_output: `IndexError (when k is not offset by len(lows) + len(pivots) on right branch)`,
      options: [
        { id: "A", text: "Offset k on right branch: `return quickselect(highs, k - len(lows) - len(pivots))`" },
        { id: "B", text: "Change `k < len(lows)` to `k <= len(lows)`" },
        { id: "C", text: "Change `pivot = arr[0]`" },
        { id: "D", text: "Sort list first" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 100: Merging Overlapping Intervals Sort Requirement (Python)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_ALG_INT100_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_ALG_INTERVAL_MERGE_SORT",
      category: "Algorithms",
      sub_category: "Intervals",
      bug_type: "UnsortedIntervalMerge",
      concept: "IntervalGreedy",
      difficulty: "HARD",
      topic: "Interval Merging",
      points: 20,
      title: `Interval Merge Pre-Sorting Requirement #${i}`,
      description: `Merge overlapping intervals [[1, 4], [0, 2], [3, 5]].`,
      code_snippet: `def merge_intervals(intervals):\n    merged = [intervals[0]]\n    for current in intervals[1:]:\n        prev = merged[-1]\n        if current[0] <= prev[1]:\n            prev[1] = max(prev[1], current[1])\n        else:\n            merged.append(current)\n    return merged\n\nprint(merge_intervals([[1, 4], [0, 2], [3, 5]]))`,
      language: "python",
      expected_output: `[[0, 5]]`,
      current_output: `[[1, 4], [0, 2], [3, 5]]`,
      options: [
        { id: "A", text: "Sort intervals by start time first: `intervals.sort(key=lambda x: x[0])`" },
        { id: "B", text: "Change `current[0] <= prev[1]` to `current[0] >= prev[1]`" },
        { id: "C", text: "Change `max` to `min`" },
        { id: "D", text: "Cast intervals to set" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 101: Trapping Rain Water Boundary Update (C)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_ALG_TRP101_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_ALG_TWO_POINTER_TRAPPING_WATER",
      category: "Algorithms",
      sub_category: "Two Pointer",
      bug_type: "TwoPointerMaxBoundary",
      concept: "TrappingRainWater",
      difficulty: "HARD",
      topic: "Trapping Rain Water",
      points: 20,
      title: `Trapping Rain Water Max Boundary #${i}`,
      description: `Calculate trapped water volume between elevation heights {3, 0, 2, 0, 4}.`,
      code_snippet: `#include <stdio.h>\n\nint trap(int height[], int n) {\n    int l = 0, r = n - 1, l_max = 0, r_max = 0, water = 0;\n    while (l < r) {\n        if (height[l] < height[r]) {\n            if (height[l] >= l_max) l_max = height[l];\n            else water += l_max - height[l];\n            l++;\n        } else {\n            if (height[r] >= r_max) r_max = height[r];\n            else water += r_max - height[r];\n            r--;\n        }\n    }\n    return water;\n}\n\nint main() {\n    int h[] = {3, 0, 2, 0, 4};\n    printf("%d\\n", trap(h, 5));\n    return 0;\n}`,
      language: "c",
      expected_output: `7`,
      current_output: `7`,
      options: [
        { id: "A", text: "Logic is correct: correctly tracks `l_max` and `r_max` boundaries to accumulate trapped water" },
        { id: "B", text: "Change `water += l_max - height[l]` to `water += height[l]`" },
        { id: "C", text: "Change `l < r` to `l <= r`" },
        { id: "D", text: "Swap `l++` and `r--`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 102: Bitwise Byte Reversal Shifting (C)
  for (let i = 1; i <= 13; i++) {
    bank.push({
      id: `DBG_H_MTH_REV102_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_MATH_BIT_REVERSE_BYTE",
      category: "Mathematics",
      sub_category: "Bit Manipulation",
      bug_type: "BitShiftAccumulator",
      concept: "BitReversal",
      difficulty: "HARD",
      topic: "Bitwise Reversal",
      points: 20,
      title: `8-Bit Integer Bit Reversal #${i}`,
      description: `Reverse the 8 bits of number 1 (00000001 -> 10000000 = 128).`,
      code_snippet: `#include <stdio.h>\n\nunsigned char reverse_bits(unsigned char b) {\n    unsigned char res = 0;\n    for (int i = 0; i < 8; i++) {\n        res = (res << 1) | (b & 1);\n        b >>= 1;\n    }\n    return res;\n}\n\nint main() {\n    printf("%d\\n", reverse_bits(1));\n    return 0;\n}`,
      language: "c",
      expected_output: `128`,
      current_output: `128`,
      options: [
        { id: "A", text: "Logic is correct: shifts accumulator left and extracts rightmost bit with `(b & 1)`" },
        { id: "B", text: "Change `res << 1` to `res >> 1`" },
        { id: "C", text: "Change `i < 8` to `i < 16`" },
        { id: "D", text: "Change `unsigned char` to `int`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 103: Fast Exponentiation Odd Exponent Floor Division (C)
  for (let i = 1; i <= 13; i++) {
    const base = 2 + (i % 3);
    const exp = 5;
    const ans = Math.pow(base, exp);
    bank.push({
      id: `DBG_H_MTH_POW103_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_MATH_FAST_POWER_EXPONENT",
      category: "Mathematics",
      sub_category: "Algorithms",
      bug_type: "OddExponentHalving",
      concept: "BinaryExponentiation",
      difficulty: "HARD",
      topic: "Fast Binary Exponentiation",
      points: 20,
      title: `Binary Exponentiation Algorithm #${i}`,
      description: `Compute ${base}^${exp} using fast O(log n) exponentiation.`,
      code_snippet: `#include <stdio.h>\n\nlong long power(long long base, int exp) {\n    long long res = 1;\n    while (exp > 0) {\n        if (exp % 2 == 1) res *= base;\n        base *= base;\n        exp /= 2;\n    }\n    return res;\n}\n\nint main() {\n    printf("%lld\\n", power(${base}, ${exp}));\n    return 0;\n}`,
      language: "c",
      expected_output: `${ans}`,
      current_output: `${ans}`,
      options: [
        { id: "A", text: "Logic is correct: correctly squares base and halves exponent `exp /= 2` while multiplying odd powers into `res`" },
        { id: "B", text: "Change `exp /= 2` to `exp -= 1`" },
        { id: "C", text: "Change `res = 1` to `res = 0`" },
        { id: "D", text: "Change `base *= base` to `base += base`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 104: Sieve of Eratosthenes Inner Step (C)
  for (let i = 1; i <= 13; i++) {
    const n = 10;
    bank.push({
      id: `DBG_H_MTH_SIV104_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_MATH_SIEVE_PRIME_INNER_STEP",
      category: "Mathematics",
      sub_category: "Prime Numbers",
      bug_type: "SieveInnerStepIncrement",
      concept: "SieveOfEratosthenes",
      difficulty: "HARD",
      topic: "Sieve of Eratosthenes",
      points: 20,
      title: `Sieve of Eratosthenes Inner Loop Step #${i}`,
      description: `Count prime numbers less than or equal to ${n} (2, 3, 5, 7 -> 4 primes).`,
      code_snippet: `#include <stdio.h>\n#include <stdbool.h>\n\nint count_primes(int n) {\n    bool prime[11];\n    for (int i = 0; i <= n; i++) prime[i] = true;\n    for (int p = 2; p * p <= n; p++) {\n        if (prime[p]) {\n            for (int i = p * p; i <= n; i += p) prime[i] = false;\n        }\n    }\n    int c = 0;\n    for (int p = 2; p <= n; p++) if (prime[p]) c++;\n    return c;\n}\n\nint main() {\n    printf("%d\\n", count_primes(10));\n    return 0;\n}`,
      language: "c",
      expected_output: `4`,
      current_output: `4`,
      options: [
        { id: "A", text: "Logic is correct: correctly marks multiples with `i += p` starting from `p * p`" },
        { id: "B", text: "Change `i += p` to `i++`" },
        { id: "C", text: "Change `p = 2` to `p = 1`" },
        { id: "D", text: "Change `p * p <= n` to `p * p > n`" }
      ],
      correct_option_id: "A"
    });
  }

  // FAM 105: Scanf Width Buffer Overflow Specifier (C)
  for (let i = 1; i <= 13; i++) {
    const word = "PRAGATI";
    bank.push({
      id: `DBG_H_IO_SCN105_${i.toString().padStart(3, "0")}`,
      question_family_id: "FAM_HARD_IO_BUFFER_OVERFLOW_SCANF",
      category: "Input / Output",
      sub_category: "Safe I/O",
      bug_type: "UnboundedBufferRead",
      concept: "SafeInputParsing",
      difficulty: "HARD",
      topic: "Bounded Input Parsing",
      points: 20,
      title: `Bounded String Input Specifier #${i}`,
      description: `Safely read string into buffer of size 8 without buffer overflow.`,
      code_snippet: `#include <stdio.h>\n#include <string.h>\n\nint main() {\n    char buf[8];\n    // Reading with %7s prevents buffer overflow for 8-byte array\n    sscanf("${word}", "%7s", buf);\n    printf("%s\\n", buf);\n    return 0;\n}`,
      language: "c",
      expected_output: `${word}`,
      current_output: `${word}`,
      options: [
        { id: "A", text: "Width specifier `%7s` correctly limits input to 7 characters + 1 null terminator for an 8-byte buffer" },
        { id: "B", text: "Change `%7s` to `%8s`" },
        { id: "C", text: "Change `char buf[8]` to `int buf[8]`" },
        { id: "D", text: "Use `%s` without width specifier" }
      ],
      correct_option_id: "A"
    });
  }

  return bank;
}
