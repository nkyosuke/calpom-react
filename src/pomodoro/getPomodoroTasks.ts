import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export type PomodoroTask = {
  id: string;
  task: string;
  note: string;
  sets: number;
  date: string; // YYYY-MM-DD
  uid: string;
};



export const getPomodoroTasks = async (uid: string) => {
  // users/{uid}/events コレクションを直接取得
  const colRef = collection(db, 'users', uid, 'events');
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => doc.data());  // date など取得
};