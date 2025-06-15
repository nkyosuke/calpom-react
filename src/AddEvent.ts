import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export const addEvent = async (event: {
  title: string;
  start: string;
  end: string;
}) => {
  try {
    const docRef = await addDoc(collection(db, 'events'), event);
    console.log('Event saved with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding event: ', e);
  }
};
