import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebase";

export const addEvent = async (event: {
  title: string;
  start: string;
  end: string;
}) => {
  try {
    await addDoc(collection(db, "events"), event);
  } catch (e) {
    console.error("Error adding event: ", e);
  }
};
