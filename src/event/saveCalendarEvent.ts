import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth } from "firebase/auth";
import { CalendarEvent } from "../types/calendar";

/*export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  uid: string;
};*/

export const saveCalendarEvent = async (event: CalendarEvent) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    throw new Error("ユーザーがログインしていません");
  }

  const docRef = doc(db, "users", user.uid, "events", event.id);
  await setDoc(docRef, event);
};
