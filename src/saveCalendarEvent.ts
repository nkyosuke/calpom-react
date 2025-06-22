import { db } from './firebase';
import {  setDoc, doc } from 'firebase/firestore';

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  uid: string;
};

export const saveCalendarEvent = async (event: CalendarEvent) => {
  await setDoc(doc(db, 'calendarEvents', event.id), event);
};