// src/pomodoro/savePomodoroTask.ts

import { getAuth } from 'firebase/auth';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';

export type PomodoroTaskInput = {
  eventId: string; // ← 追加
  task: string;
  note: string;
  sets: number;
};

// 👇 export を使うことで、モジュールとして認識される
export const savePomodoroTask = async ({ eventId, task, note, sets }: PomodoroTaskInput) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert('ユーザーがログインしていません');
    return;
  }

  const uid = user.uid;
  const timestamp = Date.now().toString();
  const now = new Date().toISOString();

  const pomodoroData = {
    id: timestamp,
    eventId, // ← 追加
    task,
    note,
    sets,
    start: now,
    uid,
  };

  try {
    await setDoc(doc(db, 'users', uid, 'events', timestamp), pomodoroData);
    console.log('🔥 Pomodoro 登録成功:', pomodoroData);
  } catch (error) {
    console.error('❌ Pomodoro 登録失敗:', error);
    alert(`登録に失敗しました: ${error}`);
  }
};
