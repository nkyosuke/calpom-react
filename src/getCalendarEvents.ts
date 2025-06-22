import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  uid: string;
};

export const getCalendarEvents = async (uid: string): Promise<CalendarEvent[]> => {
  const q = query(collection(db, "calendarEvents"), where("uid", "==", uid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...(doc.data() as Omit<CalendarEvent, "id">),
  }));
};
