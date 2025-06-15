import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
};

export const saveCalendarEvent = async (event: CalendarEvent) => {
  try {
    await addDoc(collection(db, 'events'), event);
    console.log('✅ イベント保存完了');
  } catch (error) {
    console.error('❌ イベント保存失敗:', error);
  }
};