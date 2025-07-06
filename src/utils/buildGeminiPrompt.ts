import { format, subDays } from "date-fns";

export type GoalPlanInput = {
  goal: string; // 目標（例: “TOEIC 800点”）
  deadline: string; // ISO 日付 “YYYY-MM-DD”
  roughTasks: string; // 既知タスク（空文字可）
  weekdayHours: number; // 平日の学習可能時間 (h/日)
  weekendHours: number; // 休日の学習可能時間 (h/日)
};

/** Gemini に渡すプロンプトを生成する */
export function buildGeminiPrompt(input: GoalPlanInput): string {
  const { goal, deadline, roughTasks, weekdayHours, weekendHours } = input;

  const today = format(new Date(), "yyyy-MM-dd");
  const targetFinish = format(subDays(new Date(deadline), 7), "yyyy-MM-dd"); // 〆切の 1 週間前

  return `
あなたは学習計画を立てるプロフェッショナルアシスタントです。
以下の制約を厳守し、30分=1タスクへ細分化した学習スケジュールを作成してください。

【目標】
${goal}

【締切と達成目標】
- 締切日: ${deadline}
- 合格点／ゴール達成日は **${targetFinish}** とする（締切の1週間前）

【利用可能時間】
- 平日: 1日あたり **${weekdayHours} 時間** (= ${weekdayHours * 2} タスク)
- 土日: 1日あたり **${weekendHours} 時間** (= ${weekendHours * 2} タスク)

【既知タスク・教材 (任意入力)】
${roughTasks || "特になし"}

【要件】
1. 計画期間は本日 (${today}) から ${targetFinish} まで。  
2. 30分 = 1タスク としてスケジュールを割り当てること。  
3. 必要に応じてタスクを AI が追加・分割してよい。  
4. **マイルストーン** を最低でも 2 つ設定し、達成基準を明記する  
   - 例: “公式問題集 Part5 80% 正答” “模試で700点相当” など  
5. 各日の学習内容には  
   - 何をするか  
   - 目的 / ゴールへの寄与  
   - 想定タスク数 (30分単位)  
   を具体的に記述すること。  
6. 3か月以内に収まるよう調整すること（ただし上記日程が優先）。  
7. 曖昧表現は避け、数量・範囲を明示すること。

【出力形式 (Markdown)】
\`\`\`markdown
## マイルストーン
1. <日付> - <内容>
2. ...

## 学習スケジュール
| 日付 | タスク (30min) | 内容 | 目的/メモ |
| ---- | -------------- | ---- | -------- |
| 2025-07-08 | 2 | 単語帳 Unit1-2 復習 | 語彙強化 |
| 2025-07-09 | 3 | 公式問題集 Part5 Q1-20 | 文法演習 |
...
\`\`\`

出力は必ず上記 Markdown 形式のみを返してください。
`.trim();
}
