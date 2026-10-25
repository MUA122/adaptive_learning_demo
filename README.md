# LearnFlow — Adaptive Bilingual Learning Student Journey Prototype

An interactive React + Vite demonstration mapping the student scenarios from `Screen-by-Screen Scenarios: Student and Instructor Journeys` (ST1–ST17).

## Run

```bash
npm install
npm run dev
```

## Demo accounts

- **Mahmoud Usama** — returning student with example learning data.
- **Omar Abdelaal** — first-time student. Goes through consent, language selection, a 10-item sample diagnostic, initial skill map, and the student dashboard. Use **Reset first-time student** on the login screen to restart.

Data is saved separately per student in browser `localStorage`. Use the sidebar **Log out** control to switch accounts. There is no actual university authentication.

## Student journey coverage

| Journey | Screen | Prototype location |
|---|---|---|
| ST1 | Login and consent | Account selection + Omar consent |
| ST2 | Pick language | Omar onboarding, RTL/LTR and question language |
| ST3 | Diagnostic quiz | Omar onboarding, 10 sample questions |
| ST4 | Skill map | Initial results after diagnostic |
| ST5 | Home | Student dashboard |
| ST6 | Concept page | Open topic from home/map |
| ST7 | Practice | Practice navigation or concept page |
| ST8 | Feedback | After checking practice answer |
| ST9 | Mastered | After evidence threshold, or when route reached |
| ST10 | Prerequisites check | After three consecutive incorrect answers |
| ST11 | Tutor chat | Tutor navigation |
| ST12 | Daily review | Daily Review navigation |
| ST13 | Readiness view | Home readiness card or shortcut |
| ST14 | Mock quiz | Readiness → Take a mock quiz |
| ST15 | Post-test | Course completion navigation or journey shortcut |
| ST16 | Survey | Submit post-test |
| ST17 | Summary | Submit survey |

## Important prototype limits

- All course information, mastery updates, questions, readiness estimates, citation labels, and tutor responses are **demo / mock content** and not production AI or an approved real course question bank.
- The tutor demonstrates bilingual/course-scoped responses but does not perform live retrieval, grounding verification, or source-file navigation. The source labels are illustrative.
- Diagnostic selection is a fixed sample rather than fully graph-adaptive; the user journey and flow are represented without an actual GNN/BKT/KT model.
- The mock quiz illustrates question flow, but has no real countdown timer. Consent is a prototype toggle; research exports, secure identity separation, offline synchronization, accessibility audit, and all instructor screens require future engineering.
- Course Completion stays locked until all 18 required lessons are marked explored. Its hover/tap popover previews the connected course roadmap. Diagnostic readiness does not bypass this gate. Passing the sample Final Assessment (70% pass mark) completes Introduction to Programming and marks Machine Learning as the next unlocked course; future-course lesson content is not included in this prototype.
- Student-facing screens exist for ST1–ST17, but several deeper rules described in the source are deliberately simulated rather than production-functional.

## Files

- `src/main.jsx` — React UI, routes, and demo state
- `src/style.css` — responsive styles
- `index.html` — Vite entry

## Interactive skill tree

- Onboarding and the dashboard share `src/components/SkillMap.jsx` and the prerequisite graph in `src/skill-path.js`. Select a node to preview lessons, highlight its prerequisite branches, and open its next available prerequisite or lesson.
- **Skip Diagnosis (Start from Level 0)** opens the beginner tree immediately. The diagnostic averages all answers for each concept before personalizing the same tree after path preparation.
- A concept unlocks dependent skills when all three of its lessons have been explored or its diagnostic readiness reaches 80. These remain illustrative prototype rules, not validated mastery estimates. Progress is saved per account.
- The tree supports English/Arabic, RTL layouts, keyboard navigation, mobile skill previews, and reduced-motion preferences.
- Validate with `npm run build` and `node --test src/skill-path.test.js src/course-completion.test.js`.

## v0.4 — Interactive lesson experience and course orientation

- The Skill Map now opens a learning hub for each of the six sample concepts. Each concept contains three demo lessons. Opening a lesson presents **Watch Video**, **Read & Explore**, **Play a Mini Game**, and **Quick Check** as separate options. The learner can switch methods and mark lessons explored; that state is saved locally per account.
- The video iframe uses a real public YouTube variables tutorial by Tech With Tim (https://www.youtube.com/watch?v=OFrLs22MDAw). It is an **external temporary demo**, not an instructor-uploaded lesson, and may be unavailable when offline or blocked by the video provider. For concepts other than Variables, a replacement topic-specific video is still required.
- The mini-game is a 3-question, client-side multiple-choice challenge with instant right/wrong feedback and XP. It is not the research-grade adaptive question bank or tracer.
- Omar Abdelaal's first-time onboarding now includes a **Course Introduction and Objectives** screen before the ST3 diagnostic. After the quiz, an approximately 12-second **simulated path preparation** screen runs before ST4 Skill Map. This visualization does not execute an AI model.
- Mahmoud Usama remains the preloaded returning student. The login screen supports account switching and resetting Omar to the first-time journey.
- Learning lesson copy, sample code and lecture citations are **illustrative demo content** pending upload and instructor approval of actual course materials. Existing ST1–ST17 prototype routes remain.

Run with `npm install` and `npm run dev`.
# adaptive_learning_demo
