// src/firebaseTest.ts
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";

export const testFirebaseConnection = async () => {
  try {
    const testData = {
      id: "test-id",
      title: "テストイベント",
      start: new Date().toISOString(),
      end: new Date().toISOString(),
    };

    await addDoc(collection(db, "events"), testData);
  } catch (error) {
    console.error("❌ Firestore接続失敗:", error);
  }
};
