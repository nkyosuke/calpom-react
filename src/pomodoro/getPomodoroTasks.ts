// src/pomodoro/getPomodoroTasks.ts
import { collectionGroup, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

export type PomodoroTask = {
  id: string;
  eventId: string;
  task: string;
  note: string;
  sets: number;
  start: string;   // ISO 文字列
  date:  string;   // YYYY-MM-DD
  uid:   string;
};

/**
 * uid で横断取得。eventId を渡すとそのイベントの実績だけを取得します
 *
 * @param uid        ログインユーザー UID（必須）
 * @param eventId?   予定のドキュメントID（省略可）
 */
export const getPomodoroTasks = async (
  uid: string,
  eventId?: string
): Promise<PomodoroTask[]> => {
  // 基本フィルター
  let q = query(collectionGroup(db, 'pomodoros'), where('uid', '==', uid));

  // イベント単位で絞り込みたい場合
  if (eventId) {
    q = query(
      collectionGroup(db, 'pomodoros'),
      where('uid', '==', uid),
      where('eventId', '==', eventId)
    );
    // ※ uid + eventId の複合インデックスが無い場合、
    //    コンソールに表示されるリンクから作成してください
  }

  const snap = await getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...(d.data() as Omit<PomodoroTask, 'id'>) }));
};
