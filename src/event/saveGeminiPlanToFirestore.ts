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

function formatDateTimeWithoutSeconds(date: Date): string {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}T${hh}:${min}`;
}

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
    const batchPromises: Promise<void>[] = [];

    // 通常のタスクイベントを登録
    plan.schedule.forEach((day) => {
      /*const baseStartHour = isWeekendOrHoliday(day.date) ? 10 : 20;
      let current = new Date(
        `${day.date}T${String(baseStartHour).padStart(2, "0")}:00`
      );*/
      /*console.log(
        "保存前のstart",
        day.date,
        day.startTime,
        new Date(`${day.date}T${day.startTime}`)
      );*/

      let current = new Date(`${day.date}T${day.startTime}`);

      day.tasks.forEach((task) => {
        const eventId = uuidv4();
        const start = new Date(current);
        const end = new Date(current.getTime() + task.minutes * 60000);
        current = new Date(end);

        const newEvent: CalendarEvent = {
          id: eventId,
          uid,
          title: task.title,
          start: formatDateTimeWithoutSeconds(start),
          end: formatDateTimeWithoutSeconds(end),
          color: "#08db13ff",
          note: task.note,
          source: "gemini",
        };

        batchPromises.push(
          setDoc(doc(collection(db, "users", uid, "events"), eventId), newEvent)
        );
      });
    });

    // 🎯 マイルストーンも登録
    if (plan.milestones && plan.milestones.length > 0) {
      plan.milestones.forEach((milestone) => {
        const eventId = uuidv4();

        const milestoneEvent: CalendarEvent = {
          id: eventId,
          uid,
          title: milestone.title,
          start: `${milestone.date}T00:00`,
          end: `${milestone.date}T23:59`,
          note: milestone.criteria,
          allDay: true,
          color: "#f5b042", // オレンジ系（お好みで変更可）
          source: "gemini",
          isMilestone: true,
        };

        batchPromises.push(
          setDoc(
            doc(collection(db, "users", uid, "events"), eventId),
            milestoneEvent
          )
        );
      });
    }

    await Promise.all(batchPromises);
    if (onSuccess) onSuccess(); // ✅ 成功時コールバック
  } catch (error) {
    console.error("❌ Geminiプラン保存エラー:", error);
    if (onError) onError(error); // ❌ 失敗時コールバック
  }
};
