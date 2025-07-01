import { db } from "./firebase";
import { doc, updateDoc } from "firebase/firestore";

/** Firestore に保存しているイベント型 */
export interface CalendarEvent {
  id:    string;
  uid:   string;   // ← 追加。所属ユーザーの UID
  title: string;
  start: string;
  end:   string;
}

/**
 * カレンダーイベントを更新
 * @param event { id, uid, title, start, end }
 */
export const updateCalendarEvent = async (event: CalendarEvent) => {
  const { id, uid, title, start, end } = event;

  try {
    // users/{uid}/events/{id} というコレクション構造を想定
    const docRef = doc(db, "users", uid, "events", id);

    // uid は書き込まない
    await updateDoc(docRef, { title, start, end });

    console.log("🔄 イベント更新完了");
  } catch (error) {
    console.error("❌ イベント更新失敗:", error);
  }
};