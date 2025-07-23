import { format, subDays } from "date-fns";

export function buildGeminiPromptJSON(input: GoalPlanInput) {
  const { goal, deadline, roughTasks, weekdayHours, weekendHours } = input;
  const today = format(new Date(), "yyyy-MM-dd");
  const targetFinish = format(subDays(new Date(deadline), 7), "yyyy-MM-dd");

  return `
You are a professional study‑plan coach.

## Goal
${goal}

## Deadline
${deadline} (complete by ${targetFinish})

## Daily time
Weekday: ${weekdayHours}h  /  Weekend: ${weekendHours}h

## Known tasks
${roughTasks || "None"}

## Requirements
- Plan period: ${today} – ${targetFinish}
- Split tasks into 30‑minute blocks.
- Add or split tasks as needed, but keep each day's total within the daily limit.
- Define **at least two milestones** with clear success metrics.
- Avoid vague wording; use concrete numbers, pages, question ranges.
- Output **ONLY** the following JSON, nothing else:

{
  "milestones": [
    { "date": "YYYY-MM-DD", "title": "...", "criteria": "..." }
  ],
  "schedule": [
    {
      "date": "YYYY-MM-DD",
      "tasks": [
        { "title": "...", "minutes": 30, "note": "..." }
      ]
    }
  ]
}
`
    .trim()
    .replace(/\s+\n/g, "\n"); // 無駄改行を圧縮
}
