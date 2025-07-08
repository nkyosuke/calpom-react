import { httpsCallable } from "firebase/functions";
import { functions, db, auth } from "../firebase"; // ← 既存の初期化コードを流用
import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { v4 as uuid } from "uuid";

/* ---------- 型定義 ---------- */
export interface GenerateInput {
  goal: string;
  deadline: string;
  roughTasks: string;
  weekdayHours: number;
  weekendHours: number;
}

export interface GeminiTask {
  title: string;
  minutes: number;
  note: string;
}

export interface GeminiDay {
  date: string; // YYYY‑MM‑DD
  tasks: GeminiTask[];
}

export interface GeminiMilestone {
  date: string;
  title: string;
  criteria: string;
}

export interface GeminiPlan {
  milestones: GeminiMilestone[];
  schedule: GeminiDay[];
}

/* ---------- 型ガード ---------- */
function isGeminiPlan(obj: any): obj is GeminiPlan {
  return obj && Array.isArray(obj.milestones) && Array.isArray(obj.schedule);
}

/* ---------- Main ---------- */
export async function generatePlanWithGemini(
  input: GenerateInput
): Promise<GeminiPlan> {
  const callable = httpsCallable(functions, "generateStudyPlan");
  const { data } = await callable(input);

  /* --- JSON or string に来るパターンを両対応 --- */
  let plan: GeminiPlan | null = null;

  if (typeof data === "string") {
    try {
      plan = JSON.parse(data);
    } catch {
      throw new Error("AI から想定外の文字列が返されました");
    }
  } else {
    plan = data as GeminiPlan;
  }

  if (!isGeminiPlan(plan)) {
    throw new Error("AI レスポンスの形式が不正です");
  }

  /* ---------- Firestore 保存 ---------- */
  const user = auth.currentUser;
  if (!user) throw new Error("未ログインです");

  const batch = writeBatch(db);
  const planId = uuid();

  // 親ドキュメント (plan メタ)
  const planRef = doc(collection(db, "users", user.uid, "studyPlans"), planId);
  batch.set(planRef, {
    ...input,
    createdAt: serverTimestamp(),
    milestones: plan.milestones,
  });

  // サブコレクションに日別タスク
  for (const day of plan.schedule) {
    for (const t of day.tasks) {
      const taskRef = doc(
        collection(planRef, "tasks") // users/{uid}/studyPlans/{planId}/tasks/{autoId}
      );
      batch.set(taskRef, {
        date: day.date,
        ...t,
      });
    }
  }

  await batch.commit();
  return plan;
}
