import { db } from './firebase';
import { collection, doc, setDoc } from 'firebase/firestore';

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
};

export const saveCalendarEvent = async (event: CalendarEvent) => {
  try {
    // `events/<event.id>` に固定で保存
    const eventRef = doc(collection(db, 'events'), event.id);
    await setDoc(eventRef, event);
    console.log('✅ イベント保存完了');
  } catch (error) {
    console.error('❌ イベント保存失敗:', error);
  }
};