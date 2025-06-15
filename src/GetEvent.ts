import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase';

export const getEvents = async () => {
  const querySnapshot = await getDocs(collection(db, 'events'));
  return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};
