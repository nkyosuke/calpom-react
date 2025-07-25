import { db } from "../firebase";
import { doc, updateDoc } from "firebase/firestore";
import { CalendarEvent } from "../types/calendar";

/** Firestore に保存しているイベント型 */
/*export interface CalendarEvent {
  id: string;
  uid: string; // ← 追加。所属ユーザーの UID
  title: string;
  start: string;
  end: string;
  note?: string; // ← 追加
  color?: string; // ← 追加
}*/

/**
 * カレンダーイベントを更新
 * @param event { id, uid, title, start, end }
 */
export const updateCalendarEvent = async (event: CalendarEvent) => {
  const { id, uid, title, start, end } = event;

  try {
    const docRef = doc(db, "users", uid, "events", id);

    await updateDoc(docRef, { title, start, end });

    console.log("🔄 イベント更新完了");
  } catch (error) {
    console.error("❌ イベント更新失敗:", error);
  }
};
