// src/pomodoro/getPomodoroTasks.ts
import { collectionGroup, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export type PomodoroTask = {
  id: string;
  eventId: string;
  task: string;
  note: string;
  sets: number;
  start: string;      // ISO 文字列
  date:  string;      // YYYY-MM-DD
  uid:   string;      // ← 残していても OK
};

/**
 * ログインユーザーの pomodoros サブコレクションを横断取得
 * users/{uid}/events/{eventId}/pomodoros/{pid}
 */
export const getPomodoroTasks = async (uid: string): Promise<PomodoroTask[]> => {
  // uid フィールドを残しているなら ↓を再追加
  // const q = query(collectionGroup(db, 'pomodoros'), where('uid', '==', uid));

  // uid フィールドを省いた場合はフィルター不要
  const snap = await getDocs(collectionGroup(db, 'pomodoros'));

  // 自分の uid だけを抽出
  return snap.docs
    .filter(d => (d.data() as any).uid === uid)      // ← 必要に応じて追加
    .map(d => ({ id: d.id, ...(d.data() as Omit<PomodoroTask, 'id'>) }));
};
