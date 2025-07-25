import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { CalendarEvent } from "../types/calendar";

/*export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  uid: string;
  note?: string;   // ← 追加
  color?: string;  // ← 追加
};*/

export const getCalendarEvents = async (uid: string) => {
  const ref = collection(db, "users", uid, "events");
  const snap = await getDocs(ref);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
