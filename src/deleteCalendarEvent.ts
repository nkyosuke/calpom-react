import { db } from './firebase';
import { doc, deleteDoc } from 'firebase/firestore';

// Firestore からイベントを削除する関数
export const deleteCalendarEvent = async (id: string) => {
  try {
    await deleteDoc(doc(db, 'events', id));
    console.log('✅ イベント削除成功');
  } catch (error) {
    console.error('❌ イベント削除失敗:', error);
  }
};