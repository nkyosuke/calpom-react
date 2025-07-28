import { format, subDays } from "date-fns";

export function buildGeminiPromptJSON(input: GoalPlanInput) {
  const { goal, deadline, roughTasks, weekdayHours, weekendHours } = input;
  const today = format(new Date(), "yyyy-MM-dd");
  const targetFinish = format(subDays(new Date(deadline), 7), "yyyy-MM-dd");

  return `
あなたはプロの学習計画コーチです。

## 目標
${goal}

## 締切
${deadline}（${targetFinish}までに完了）

## 1日の学習時間
平日: ${weekdayHours}時間 / 週末: ${weekendHours}時間

## 既知のタスク
${roughTasks || "なし"}

## 要件
- 計画期間: ${today} から ${targetFinish} まで
- このスケジュールは ${today}（今日）を起点として作成してください。
- すべての日付は必ず ${today} 以降の日付にしてください。過去の日付を含めないでください。
- タスクは30分単位に分割してください。
- 必要に応じてタスクを追加・分割してください。ただし、1日の合計時間は1日の制限内に収めてください。
- **マイルストーンは必ず ${today} 以降の日付にしてください。**
- **マイルストーンは最大2つまで作成してください。学習期間に余裕がない場合は、1つでも構いません。**
- 曖昧な表現は避け、具体的な数字、ページ数、問題範囲を使ってください。
- 以下のJSON形式のみを出力してください。その他の出力は禁止です。
- noteにはタスクの合格目標も記載してください。

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
