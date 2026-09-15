# 🏆 Engineering Olympics 2026 — Debug The Code Arena

<div align="center">
  <img src="client/public/pragati_crest.jpg" width="120" height="120" alt="Pragati University Crest" />
  <h2>PRAGATI UNIVERSITY</h2>
  <p><strong>Department of Mechanical Engineering · Engineers' Day 2026</strong></p>
  <p><em>Official Autonomous Code Diagnostics & Competitive Debugging System</em></p>
</div>

---

## 📌 Overview

**Debug The Code Arena** is an autonomous, real-time, multi-device competitive coding and debugging platform built for the **Engineering Olympics (Engineers' Day 2026)** at **Pragati University**.

The platform is designed to test 2nd and 3rd-year engineering students across core programming languages (C and Python) on algorithmic debugging, memory management, pointer traps, control flow, data structures, and mathematics.

---

## ✨ Key Features

### 1. 🧠 Master Question Generation & Zero-Repetition Engine
- **1,221 Unique Debugging Questions** organized into **105 Distinct Question Families**.
- **Difficulty-Weighted Distribution**: Every participant receives **exactly 10 questions** (3 Simple + 3 Medium + 4 Hard).
- **Strict Anti-Repetition**: Guaranteed **0% collision rate** — a contestant never receives two questions from the same Question Family.
- **Cognitive Syllabus Coverage**: Control Flow, Arrays & Matrices, Strings, Functions & Scope, Recursion & Backtracking, Pointers & Dynamic Memory, Data Structures (Linked Lists, Stacks, Queues, Trees, Heaps), Algorithms (Two-Pointers, Sliding Window, DP), Mathematics & Logic, and I/O.

### 2. 🛡️ Anti-Cheat & Security Architecture
- **Zero Correct-Answer Leaks**: Correct answers, keys, and solutions exist strictly server-side and are NEVER sent to the contestant browser.
- **Client-Side Option Shuffling**: Options (A, B, C, D) are uniquely randomized per contestant attempt.
- **Window/Tab Switch Detection**: 3-strike tab/window switch enforcement with automated disqualification.
- **Server-Authoritative 15-Minute Timer**: Expiration evaluated server-side to prevent client clock tampering.
- **No Language Directives**: Contestant questions show code without giveaway language hints.

### 3. 📊 Real-Time Master Leaderboard (4-Priority Ranking)
- **Priority 1**: Total Correct Answers count ($\text{Score} \downarrow$)
- **Priority 2**: Difficulty-Weighted Score ($\text{Simple}=1\text{pt}, \text{Medium}=2\text{pts}, \text{Hard}=3\text{pts} \downarrow$)
- **Priority 3**: Time Taken in Seconds ($\text{Lower Time} \uparrow$)
- **Priority 4**: Server Submission Timestamp ($\text{Earlier Submission} \uparrow$)
- **Live Search**: Contestants can enter their roll number to securely look up their live rank and score breakdown.

### 4. 🎛️ Event Host Command Center
- Real-time live status of registered students, active exams, and submissions.
- Live QR session activation, regeneration, and real-scan tracking.
- Automated CSV / Excel export for official record keeping.
- Secure results release and lock controls.
- Single-click database reset and purge protected by host secret passkey.

---

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, Framer Motion, Sonner Toast, Wouter
- **Backend**: Node.js, Express, TypeScript, Server-Side Authoritative State Engine
- **Network / Deployment**: Multi-Device LAN Gateway, Cloudflare Tunnel, Vite

---

## 🛠️ Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm / npm / yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/25A31A0356/engineers-day-debug-arena.git
cd engineers-day-debug-arena

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
npm start
```

---

## 🏛️ Conducting Committee

- **Institution**: Pragati University
- **Department**: Department of Mechanical Engineering
- **Venue**: MG-7 Core Block
- **Event**: Engineers' Day 2026 — Engineering Olympics

---

<div align="center">
  <sub>Engineers' Day 2026 · Official Examination System · Department of Mechanical Engineering</sub>
</div>
