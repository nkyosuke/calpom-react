import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";

export const getCalendarEvents = async (uid: string) => {
  const ref = collection(db, "users", uid, "events");
  const snap = await getDocs(ref);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};
