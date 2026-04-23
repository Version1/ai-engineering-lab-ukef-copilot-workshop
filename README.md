# UKEF Copilot Enablement Day

A full-day, hands-on session for UKEF engineers who already use GitHub Copilot. The day is built around UKEF's own engineering standards (or government engineering standards if UKEF standards are not ready in time). You work through problems, not slides, so that the code you produce meets the quality bar and passes review. It is not a first-time introduction.

## What this is

Before the session, your delivery partner works with the UKEF lead to turn UKEF's quality expectations, pull request (PR) standards, and review processes into prompts and guardrails you can use. You work through practical exercises: code quality and PR review with UKEF standards, custom instructions, and building your own tooling. After lunch, a live MCP server demo shows how to connect Copilot to UKEF standards; Exercise 3 lets you extend that or choose another track. By the end of the day you will know how to use Copilot so that pull requests are accepted, not sent back.

By the end of the day you will have:

- used Copilot to identify violations in flawed code, refactor to meet UKEF standards, add tests, set up the PR review skill, run it against sample code, and extended it with your team's rules (Exercise 1)
- seen how to connect Copilot to UKEF standards via a local MCP server (demo after lunch)
- written a custom instructions file (e.g. `.github/copilot-instructions.md`) so Copilot follows UKEF standards by default, and tested it against Exercise 1 code (Exercise 2)
- built or extended tooling in one of four tracks: custom instructions, MCP server, test generation pipeline, or an open brief (Exercise 3)

## Who this is for

- UKEF engineers (developers) who have Copilot licences
- People who want to use Copilot in a way that fits UKEF's code quality and review process
- Mixed experience: from those who use Copilot a little to those who use it often

## Before you start

See [SETUP-GUIDE.md](SETUP-GUIDE.md). Complete it at least one week before the day. You need:

- GitHub Copilot working in your editor (integrated development environment, or IDE)
- Python or Node.js set up and the sample code for the exercises
- A real piece of your own work (e.g. an open pull request, or code that needs tests or tidying) for Exercise 3
- For the MCP demo and Exercise 3: your facilitator will provide the local MCP server (repo or run instructions); see SETUP-GUIDE.md

Your facilitator may share the sample code or point you to it in this repository.

## Day timetable (10:00 to 16:20, 45 min lunch)

| Time | What happens                                                                                                                                    |
|------|-------------------------------------------------------------------------------------------------------------------------------------------------|
| 10:00 | Welcome and Context (15 min). Why we are here; Kapil on UKEF's AI ambition.                                                                     |
| 10:15 | REACH Session — Cleo and Ant (60 min).                                                                                                          |
| 11:15 | Live Demo: Copilot Beyond Autocomplete (15 min). Chat, refactoring, tests, @workspace, slash commands.                                          |
| 11:30 | Exercise 1 Briefing (5 min)                                                                                                                    |
| 11:35 | Exercise 1: Code Quality & PR Review (30 min). Flawed files; identify violations, refactor, add tests, set up PR review skill.                 |
| 12:05 | Exercise 1 Debrief (15 min)                                                                                                                    |
| 12:20 | Lunch (45 min)                                                                                                                                  |
| 13:05 | Whiteboard Session: Designing a UKEF Standard for AI Usage (30 min). Group session to define and agree principles for AI use at UKEF.           |
| 13:35 | Energy Reset + MCP Server Demo (15 min). Connecting Copilot to UKEF standards via a local MCP server.                                           |
| 13:50 | Exercise 2 Briefing (5 min)                                                                                                                    |
| 13:55 | Exercise 2: Custom Instructions Library (50 min). Write `.github/copilot-instructions.md`; test against Exercise 1 code. Bonus: prompt library. |
| 14:45 | Exercise 3 Briefing (5 min)                                                                                                                    |
| 14:50 | Exercise 3: Build Your Own Tooling (60 min). Track A–D: custom instructions, MCP server, test pipeline, or open brief.                         |
| 15:50 | Show and Tell (20 min). Each team demos what they built.                                                                     |
| 16:10 | Wrap-up, Commitments & Next Steps (10 min).                                                                                                     |
| 16:20 | End                                                                                                                                             |

Times may change slightly. Your facilitator will confirm on the day.

## What is included

- `README.md` (this file): overview and timetable
- `SETUP-GUIDE.md`: what to do before the day
- `participant-handout.md`: short reference for the day
  - [Exercise 1: Code Quality & PR Review with UKEF Standards](exercise-01-code-quality-pr-review/) (30 min)
  - [Exercise 2: Custom Instructions Library](exercise-02-custom-instructions-library/) (50 min)
  - [Exercise 3: Build Your Own Tooling](exercise-03-build-your-own-tooling/) (60 min), including:
    - `mcp-server/` — Node.js stdio server (`mcp-stdin-server/`) and Python HTTP server (`mcp-http-server/`) that expose UKEF coding standards. See `mcp-server/README.md` for setup.
    - `mcp-exercises/` — demo workspace with Node.js and Python starter code, five exercises, and `SETUP.md` for editor configuration. Used in the post-lunch demo and in Exercise 3 Track B.

Sample code is in `python-samples/` and `node-samples/`. Use one language for the day (Python or Node.js). For Exercise 1, the `pr-review-skill/` folder contains the skill prompt file, example custom instructions, three sample PR diffs, and a starter review prompt; see that folder's README for setup (skill workflow or chat workflow).

---
Version: 1.0
Last updated: April 2026
