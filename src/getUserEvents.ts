import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "./firebase";

export const getUserEvents = async (userId: string) => {
  const q = query(collection(db, "events"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  })) as {
    id: string;
    title: string;
    start: string;
    end: string;
  }[];
};