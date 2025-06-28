import { db } from './firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { CalendarEvent } from './saveCalendarEvent';

export const updateCalendarEvent = async (event: CalendarEvent) => {
  try {
    const docRef = doc(db,'users',uid,'events',eventId);
    await updateDoc(docRef, {
      title: event.title,
      start: event.start,
      end: event.end,
    });
    console.log('🔄 イベント更新完了');
  } catch (error) {
    console.error('❌ イベント更新失敗:', error);
  }
};