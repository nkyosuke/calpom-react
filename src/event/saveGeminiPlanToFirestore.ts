import { v4 as uuidv4 } from "uuid";
import { db } from "../firebase";
import { collection, setDoc, doc } from "firebase/firestore";
import { CalendarEvent } from "../types/CalendarEvent";
import { GeminiPlan } from "../lib/generatePlanWithGemini";

function isWeekendOrHoliday(dateStr: string): boolean {
  const date = new Date(dateStr);
  const day = date.getDay(); // 0:日, 6:土
  return day === 0 || day === 6;
}

function formatTime(date: Date): string {
  return date.toISOString();
}

const utcToJst = (utcString: string) => {
  const date = new Date(utcString);
  // JSTのISO 8601文字列を返す
  return date.toISOString().replace("Z", "+09:00");
};

export const saveGeminiPlanToFirestore = async (
  uid: string,
  plan: GeminiPlan,
  onSuccess?: () => void,
  onError?: (error: any) => void
) => {
  console.log("saveGeminiPlanToFirestore uid:", uid);
  console.log("saveGeminiPlanToFirestore plan:", plan);
  if (!uid || !plan || !plan.schedule) return;
  try {
    const batchPromises = plan.schedule.flatMap((day) => {
      const baseStartHour = isWeekendOrHoliday(day.date) ? 10 : 20;
      let current = new Date(
        `${day.date}T${String(baseStartHour).padStart(2, "0")}:00`
      );

      return day.tasks.map((task) => {
        const eventId = uuidv4();

        const start = new Date(current);
        const end = new Date(current.getTime() + task.minutes * 60000);
        current = new Date(end); // 次のタスク開始時間を更新

        const newEvent: CalendarEvent = {
          id: eventId,
          uid,
          title: task.title,
          start: utcToJst(formatTime(start)),
          end: utcToJst(formatTime(end)),
          color: "#08db13ff",
          note: task.note,
          source: "gemini",
        };

        return setDoc(
          doc(collection(db, "users", uid, "events"), eventId),
          newEvent
        );
      });
    });

    await Promise.all(batchPromises);
    if (onSuccess) onSuccess(); // ✅ 成功時コールバック
  } catch (error) {
    console.error("❌ Geminiプラン保存エラー:", error);
    if (onError) onError(error); // ❌ 失敗時コールバック
  }
};
