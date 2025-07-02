import { db } from './firebase';
import { collection,doc, deleteDoc,getDocs } from 'firebase/firestore';

// Firestore からイベントを削除する関数
export const deleteCalendarEvent = async (uid: string,eventId: string) => {
   // 🔍 ログで確認
   if (!uid || !eventId) {
    console.error('❌ uid または eventId が undefined です');
    return;
  }
  try {
    // 1. pomodorosサブコレクションのドキュメントを取得
    const pomodorosRef = collection(db, 'users', uid, 'events', eventId, 'pomodoros');
    const pomodorosSnapshot = await getDocs(pomodorosRef);

    // 2. pomodorosの各ドキュメントを削除
    const deletePromises = pomodorosSnapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);

    // 3. イベントドキュメントを削除
    await deleteDoc(doc(db, 'users', uid, 'events', eventId));
    //await deleteDoc(doc(db,'users',uid,'events',eventId));
    console.log('✅ イベント削除成功');
  } catch (error) {
    console.error('❌ イベント削除失敗:', error);
  }
};