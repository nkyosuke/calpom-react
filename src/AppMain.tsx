import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // ✅ 時間単位のビューを追加
import interactionPlugin from "@fullcalendar/interaction"; // ✅ `EventDropStopArg` をインポート
import Tooltip from "./Tooltip";
import { addHours } from "date-fns";
import { DateClickArg } from "@fullcalendar/interaction"; // ✅ 型をインポート
import { EventClickArg } from "@fullcalendar/core";
import { format } from "date-fns";
import React, { useState, useEffect, useRef } from 'react'; // useEffect をインポート
import jaLocale from '@fullcalendar/core/locales/ja'; 
import { saveCalendarEvent } from './saveCalendarEvent';
import { deleteCalendarEvent } from './deleteCalendarEvent';
import { updateCalendarEvent } from './updateCalendarEvent';
import { getCalendarEvents } from './getCalendarEvents'; // ✅ 追加
import { getAuth, onAuthStateChanged, User ,signOut} from 'firebase/auth';
import { auth } from './firebase';
import SignIn from './auth/SignIn'; // 作成したコンポーネントをインポート
import './App.css';
import PomodoroFab    from './components/PomodoroFab';
import PomodoroPanel  from './components/PomodoroPanel';
import { savePomodoroTask } from './pomodoro/savePomodoroTask';

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
};

type PomodoroInput = {
  task: string;
  note: string;
  sets: number;
};
function AppMain() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventStartTime, setNewEventStartTime] = useState("12:00"); // ✅ 開始時間
  const [newEventEndTime, setNewEventEndTime] = useState("13:00"); // ✅ 終了時間
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [tooltip, setTooltip] = useState<{ top: number; left: number; title: string; start: string; end: string;} | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    if (currentUser) {
      console.log("✅ ログインユーザーのUID:", currentUser.uid);
      const fetched = await getCalendarEvents(currentUser.uid);
      console.log("fetched events:", fetched); // ← ここを確認
      setEvents(fetched);
      const normalized = fetched.map(e => ({
        ...e,
        start: new Date(e.start).toISOString(),
        end: new Date(e.end).toISOString()
      }));
      console.log("カレンダーに渡す形式:", normalized);
      setEvents(normalized);
    }
  });
  return () => unsubscribe();
  }, []);

  const handleDateClick = (arg: DateClickArg) => { // ✅ 正しい型に修正
    console.log("📅 Selected Date:", arg.dateStr);
    arg.jsEvent.preventDefault(); // 👈 これで自動スクロール抑止
    arg.jsEvent.stopPropagation();
    // クリックした日付を保存
    setSelectedDate(arg.dateStr);

    // 既存の背景色をリセット
    const previousSelected = document.querySelector('.selected-date');
    if (previousSelected) {
    previousSelected.classList.remove('selected-date');
    }

    // クリックされた日付の背景色を変更
    const clickedDateElement = document.querySelector(`[data-date="${arg.dateStr}"]`);
    if (clickedDateElement) {
      clickedDateElement.classList.add('selected-date');
    }
    setEditingEvent(null); // 編集モード解除
  };
  // useRef はここで定義
  const calendarRef = useRef<FullCalendar | null>(null); // FullCalendar の参照を保持
  // Firebase 登録（ステップ2で実装）
  const handleRegister = async (input: PomodoroInput) => {
    await savePomodoroTask(input);
  };

  // 予定追加処理
  const addEvent = async () => {
    if (selectedDate && newEventTitle.trim() !== "" && user) {
      const newEvent: CalendarEvent = {
        id: String(Date.now()),
        title: newEventTitle,
        start: `${selectedDate}T${newEventStartTime}`,
        end: `${selectedDate}T${newEventEndTime}`,
      };
      try {
        await saveCalendarEvent({ ...newEvent, uid: user.uid });
        setEvents([...events, newEvent]);
        closeModal();
      } catch (error) {
        alert('イベントの保存に失敗しました');
        console.error(error);
      }
    }
  };

  const updateEvent = () => {  
    if (!user) return; // ユーザーがいない場合は処理しない
    if (editingEvent && newEventTitle.trim() !== "") {
      const updatedEvent: CalendarEvent = {
        ...editingEvent,
        title: newEventTitle,
        start: `${selectedDate}T${newEventStartTime}`,
        end: `${selectedDate}T${newEventEndTime}`,
      };
      setEvents(events.map(e => e.id === editingEvent.id ? updatedEvent : e));
      saveCalendarEvent({ ...updatedEvent, uid: user.uid }); // ← Firebase 更新
      closeModal();
    }
  };

  const deleteEvent = async () => {
  if (editingEvent) {
    // Firestore から削除
    await deleteCalendarEvent(editingEvent.id);

    // ローカル状態からも削除
    setEvents(events.filter(e => e.id !== editingEvent.id));
    closeModal();
  }
};

  const handleEventClick = (arg: EventClickArg) => {
    arg.jsEvent.preventDefault(); 
    const event = events.find(e => e.id === arg.event.id);
    if (event) {
      setEditingEvent(event);
      setNewEventTitle(event.title);
      setSelectedDate(
        typeof event.start === "string"
          ? event.start.split("T")[0]
          : format(new Date(event.start), "yyyy-MM-dd")
      );
      setNewEventStartTime(
        typeof event.start === "string"
          ? event.start.split("T")[1].slice(0, 5)
          : format(new Date(event.start), "HH:mm")
      );// ✅ 開始時間をセット
      setNewEventEndTime(
        typeof event.end === "string"
          ? event.end.split("T")[1].slice(0, 5)
          : format(new Date(event.end), "HH:mm")
      );// ✅ 終了時間をセット
      setShowInput(true);
    }
  };

   // 🎯 モーダルを閉じる処理
  const closeModal = () => {
    setShowInput(false); // ✅ モーダルを非表示にする
    setNewEventTitle("");
    setNewEventStartTime("12:00");
    setNewEventEndTime("13:00");
    setEditingEvent(null);
    setSelectedDate(null);
  };

  // ① drag & drop／resize で呼ばれる共通ハンドラ
const handleEventChange = async (arg: any) => {
  const ev = arg.event;                         // FullCalendar の Event オブジェクト
  const updated = {
    id: ev.id,                                  // ← Firestore ドキュメント ID と一致
    title: ev.title,
    start: ev.startStr,
    end:   ev.endStr,
  };

  // 1. ローカル state を更新
  setEvents(prev =>
    prev.map(e => (e.id === updated.id ? updated : e))
  );

  // 2. Firestore を更新
  try {
    await updateCalendarEvent({ ...updated, uid: user!.uid });
    console.log('🔄 Firestore 更新 OK');
  } catch (err) {
    console.error('Firestore 更新失敗', err);
  }
};
 const handleLogout = async () => {
    await signOut(auth);
  };

  const handleEventMouseEnter = (info: any) => {
    const calendarApi = calendarRef.current?.getApi();
    const viewType = calendarApi?.view?.type;

    // 🎯 月ビュー（dayGridMonth）のみツールチップを表示
    if (viewType !== 'dayGridMonth') return;

    const rect = info.el.getBoundingClientRect();
    const top = rect.top + window.scrollY;
    const left = rect.left + window.scrollX;

    setTooltip({
      top,
      left,
      title: info.event.title,
      start: info.event.start ? format(new Date(info.event.start), "HH:mm") : "",
      end: info.event.end ? format(new Date(info.event.end), "HH:mm") : format(addHours(new Date(info.event.start), 1), "HH:mm"),
    });
  };
  const handleEventMouseLeave = () => {
    setTooltip(null); // マウスが離れたら非表示
  };
  const handleViewDidMount = () => {
  setTooltip(null); // ビューが変わったときにツールチップを削除
};

  useEffect(() => {
    // 画面サイズが変更されたときにカレンダーをリサイズ
    const handleResize = () => {
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        calendarApi.updateSize(); // updateSize() を呼び出す
      }
    };

    window.addEventListener('resize', handleResize); // リサイズイベントをリッスン

    return () => {
      window.removeEventListener('resize', handleResize); // クリーンアップ
    };
  }, []);
  if (!user) {
    return <SignIn />;
  }
  return (  
   <div className="calendar-container">
       <div className="flex justify-end p-2">
        <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">
          ログアウト
        </button>
      </div>
      {/* ✅ ホバー時のツールチップ表示 */}
      <Tooltip tooltip={tooltip} />   {/* ← Portal に差し替え */}
      <FullCalendar 
        ref={calendarRef} // FullCalendar の参照を渡す
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // ✅ timeGridPlugin を追加
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        initialView="dayGridMonth"
        locales={[jaLocale]}
        locale='ja'
        scrollTime="08:00:00"
        scrollTimeReset={false}
        events={events}
        dateClick={handleDateClick} // 日付クリックイベント
        eventClick={handleEventClick} // 予定クリックイベント追加
        eventDrop={handleEventChange} // ✅ 予定をドラッグ＆ドロップで移動できるように追加
        eventResize={handleEventChange}   // 長さ変更
        eventChange={handleEventChange}   // （オプション）何らかの変更
        editable={true} // ✅ 予定を編集可能にする
        droppable={true} // ✅ ドロップ可能にする
        height={420} // 固定の高さを設定
        viewDidMount={handleViewDidMount}  // ← ここに追加
        eventMouseEnter={handleEventMouseEnter} // ✅ ホバー時の処理
        eventMouseLeave={handleEventMouseLeave} // ✅ ホバー解除時の処理
        selectable={true}       // ← これが日付選択などを許可
        eventAdd={(info) => {
          const event = info.event;
          saveCalendarEvent({
            id: event.id, // ✅ 必須のIDを追加
            title: event.title,
            start: event.start?.toISOString() || '',
            end: event.end?.toISOString() || '',
            uid: user!.uid, // ✅ ログインユーザーのUID
          });
        }}
      />

      <button
        onClick={() => {
        setShowInput(true);
        setSelectedDate(format(new Date(), "yyyy-MM-dd")); // 今日の日付をセット
        setEditingEvent(null);
        }}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
      ＋ 予定を追加
      </button>
      {/* 予定登録フォーム（モーダル風に表示） */}
      {showInput && (
        <div className="mt-4 p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">
          {editingEvent ? "予定を編集" : "予定を追加"} ({selectedDate ? format(new Date(selectedDate), "yyyy-MM-dd") : ""})
          </h2>
          <input
            type="text"
            placeholder="予定を入力"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            className="border p-2 w-full mt-2"
          />
          {/* 日付選択 */}
          <label>日付:</label>
          <input 
            type="date" 
            value={selectedDate || ""} 
            onChange={(e) => setSelectedDate(e.target.value)} 
            className="border p-2 w-full mt-2"
          />
          {/* 開始時間 */}
          <label>開始時間:</label>
          <input
            type="time"
            value={newEventStartTime}
            onChange={(e) => setNewEventStartTime(e.target.value)}
            className="border p-2 w-full mt-2"
          />
          {/* 終了時間 */}
          <label>終了時間:</label>
          <input
            type="time"
            value={newEventEndTime}
            onChange={(e) => setNewEventEndTime(e.target.value)}
            className="border p-2 w-full mt-2"
          />
          {editingEvent  ? (
            <div>
              <button
                onClick={updateEvent}
                className="mt-2 bg-green-500 text-white px-4 py-2 rounded mr-2"
              >
                更新
              </button>
              <button
                onClick={deleteEvent}
                className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
              >
                削除
              </button>
            </div>
          ) : (
            <button
              onClick={addEvent}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
            >
              追加
            </button>
          )}
        </div>
      )}
      <PomodoroFab onClick={() => setPanelOpen(true)} />
      <PomodoroPanel
        isOpen={panelOpen}
        onClose={() => setPanelOpen(false)}
        onRegister={handleRegister}
      />
    </div>
  );
}

export default AppMain;

