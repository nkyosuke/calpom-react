import {
  collection,
  doc,
  writeBatch,
  serverTimestamp,
} from "firebase/firestore";
import { auth, db } from "../firebase";
import { GeminiPlan, GenerateInput } from "../lib/generatePlanWithGemini";
import { v4 as uuid } from "uuid";

export async function saveGeneratedPlan(
  input: GenerateInput,
  plan: GeminiPlan
): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error("未ログインです");

  const batch = writeBatch(db);
  const planId = uuid();
  const planRef = doc(collection(db, "users", user.uid, "studyPlans"), planId);

  batch.set(planRef, {
    ...input,
    createdAt: serverTimestamp(),
    milestones: plan.milestones,
  });

  for (const day of plan.schedule) {
    for (const t of day.tasks) {
      const taskRef = doc(collection(planRef, "tasks"));
      batch.set(taskRef, {
        date: day.date,
        ...t,
      });
    }
  }

  await batch.commit();
}
