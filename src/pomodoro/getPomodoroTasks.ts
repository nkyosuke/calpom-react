import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export type PomodoroTask = {
  id: string;
  eventId: string; // ← 追加
  task: string;
  note: string;
  sets: number;
  date?: string; // YYYY-MM-DD (任意)
  start?: string; // 任意
  uid: string;
};

export const getPomodoroTasks = async (uid: string) => {
  const colRef = collection(db, 'users', uid, 'events');
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // eventIdも含める
};