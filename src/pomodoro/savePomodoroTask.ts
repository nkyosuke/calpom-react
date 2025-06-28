import { getAuth } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

type PomodoroTaskInput = {
  eventId: string;
  task: string;
  note: string;
  sets: number;
};

export const savePomodoroTask = async ({ eventId, task, note, sets }: PomodoroTaskInput) => {
  const auth = getAuth();
  const user = auth.currentUser;

  if (!user) {
    alert('ユーザーがログインしていません');
    return;
  }

  const uid = user.uid;
  const now = new Date();
  const timestamp = Date.now().toString();

  const pomodoroData = {
    id: timestamp,
    eventId,
    task,
    note,
    sets,
    start: now.toISOString(),
    date:  now.toISOString().split('T')[0],
    uid,
  };

  try {
    await setDoc(
      doc(db, 'users', uid, 'events', eventId, 'pomodoros', timestamp), // ✅ 修正
      pomodoroData
    );
    console.log('🔥 Pomodoro 登録成功:', pomodoroData);
  } catch (error) {
    console.error('❌ Pomodoro 登録失敗:', error);
    alert(`登録に失敗しました: ${error}`);
  }
};
