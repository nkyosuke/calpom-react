import './App.css';
import { format } from "date-fns";
import React, { useState, useEffect, useRef } from 'react'; 
import { saveCalendarEvent } from './saveCalendarEvent';
import { deleteCalendarEvent } from './deleteCalendarEvent';
import { updateCalendarEvent } from './updateCalendarEvent';
import { getCalendarEvents } from './getCalendarEvents'; 
import { getAuth, onAuthStateChanged, User ,signOut} from 'firebase/auth';
import { auth } from './firebase';
import SignIn from './auth/SignIn'; 
import PomodoroFab    from './components/PomodoroFab';
import PomodoroPanel  from './components/PomodoroPanel';
import { savePomodoroTask } from './pomodoro/savePomodoroTask';
import { getPomodoroTasks } from './pomodoro/getPomodoroTasks';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; 
import interactionPlugin from "@fullcalendar/interaction"; 
import { DateClickArg } from "@fullcalendar/interaction"; 
import { EventClickArg } from "@fullcalendar/core";
import jaLocale from '@fullcalendar/core/locales/ja'; 
import type { PomodoroTask } from './pomodoro/getPomodoroTasks';
import StatsFab   from './components/StatsFab';
import StatsPanel from './components/StatsPanel';
import { parseISO } from "date-fns";

type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
};

function AppMain() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventStartTime, setNewEventStartTime] = useState("12:00"); //  開始時間
  const [newEventEndTime, setNewEventEndTime] = useState("13:00"); //  終了時間
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [panelOpen, setPanelOpen] = useState(false);
  //const [pomodoroDates, setPomodoroDates] = useState<string[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [pomodoroTasks, setPomodoroTasks] = useState<PomodoroTask[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [pomodoroEventTitle, setPomodoroEventTitle] = useState<string | null>(null);
  const [selectedPomodoros, setSelectedPomodoros] = useState<PomodoroTask[]>([]);
  const [statsOpen, setStatsOpen] = useState(false);
  const HEADER_HEIGHT = 56;
  

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
    setUser(currentUser);
    if (currentUser) {
      const fetched = await getCalendarEvents(currentUser.uid);
      setEvents(fetched);
      const normalized = fetched.map(e => ({
        ...e,
        start: new Date(e.start).toISOString(),
        end: new Date(e.end).toISOString()
      }));
      setEvents(normalized);
    }
  });
  return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    getPomodoroTasks(user.uid).then((tasks) => {
      setPomodoroTasks(tasks);
      //const uniqueDates = [...new Set(tasks.map((t) => t.date))];
      //setPomodoroDates(uniqueDates);
    });
  }, [user]);

  const loadHolidays = async (): Promise<CalendarEvent[]> => {
    const res = await fetch("https://holidays-jp.github.io/api/v1/date.json");
    const data = await res.json();
    return Object.entries(data).map(([date, name]) => ({
      id: `holiday-${date}`,
      title: name as string,
      start: date,
      end: date,
      allDay: true,
      display: "background",
      color: "#ffe4e4",
      editable: false,
    }));
  };

  useEffect(() => {
    if (!user) return;
    (async () => {
      const [calendarEvents,, holidayEvents] = await Promise.all([
        getCalendarEvents(user.uid),
        getPomodoroTasks(user.uid),
        loadHolidays(),
      ]);
      const normalizedCalendar = calendarEvents.map(e => ({
        ...e,
        start: new Date(e.start).toISOString(),
        end: new Date(e.end).toISOString()
      }));
      setEvents([...normalizedCalendar, ...holidayEvents]);
      //setPomodoroDates([...new Set(pomodoroTasks.map(t => t.date))]);
    })();
  }, [user]);

  

  const handleDateClick = (arg: DateClickArg) => { 
    arg.jsEvent.preventDefault(); 
    arg.jsEvent.stopPropagation();
    // クリックした日付を保存
    setSelectedDate(arg.dateStr);
    setEditingEvent(null); // 編集モードを解除

    // 入力欄を初期化
    setNewEventTitle("");
    setNewEventStartTime("12:00");
    setNewEventEndTime("13:00");
    // 選択された日付のイベントを初期化
    setSelectedEventId(null);
    setPomodoroEventTitle(null);

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
  const calendarRef = useRef<FullCalendar | null>(null);
  // Firebase 登録（ステップ2で実装）
  const handleRegister = async (input) => {
    if (!editingEvent || editingEvent.id.startsWith("holiday-")) return; // 紐付くイベントがなければ何もしない
    await savePomodoroTask({ ...input, eventId: editingEvent.id });
    // 実績を再取得
    if (user) {
      const tasks = await getPomodoroTasks(user.uid);
      setPomodoroTasks(tasks);
      //setPomodoroDates([...new Set(tasks.map((t) => t.date))]);
    }
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
      try{
        const uid = user?.uid;
        if (!uid) throw new Error("uidが未取得");
        await deleteCalendarEvent(uid,editingEvent.id);
        // ローカル状態からも削除
        setEvents(events.filter(e => e.id !== editingEvent.id));
        closeModal();
      } catch (err) {
        alert('イベントの削除に失敗しました');
        console.error('❌ イベント削除処理中にエラー:', err);
      }     
    }
  };

  const handleEventClick = async (arg: EventClickArg) => {
    arg.jsEvent.preventDefault(); 
    const event = events.find(e => e.id === arg.event.id);
    if (arg.event.id.startsWith("holiday-")) return; 
    if (event?.id.startsWith("pomodoro-")) return;

    if (event) {
      setEditingEvent(event);
      setNewEventTitle(event.title);
      setSelectedDate(
        typeof event.start === "string"
          ? event.start.split("T")[0]
          : format(parseISO(event.start.toString()), "yyyy-MM-dd")
      );
      setNewEventStartTime(
        typeof event.start === "string"
          ? event.start.split("T")[1].slice(0, 5)
          : format(parseISO(event.start.toString()), "HH:mm")
      );// ✅ 開始時間をセット
      setNewEventEndTime(
        typeof event.end === "string"
          ? event.end.split("T")[1].slice(0, 5)
          : format(parseISO(event.end.toString()), "HH:mm")
      );// ✅ 終了時間をセット
      setShowInput(true);  
    }
    if (user) {
      const tasks = await getPomodoroTasks(user.uid, event.id);
      setSelectedPomodoros(tasks); // ✅ 実績をセット
    }
    setPomodoroEventTitle(event.title);
    setSelectedEventId(arg.event.id);
    setPanelOpen(false); 
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
    if (ev.id.startsWith("holiday-")) {
      // ← ドラッグ／リサイズで祝日が変更されないように元に戻す
      ev.setStart(ev.start);
      ev.setEnd(ev.end);
      return;
    }

    // 1. ローカル state を更新
    setEvents(prev =>
      prev.map(e => (e.id === updated.id ? updated : e))
    );

    // 2. Firestore を更新
    try {
      await updateCalendarEvent({ ...updated, uid: user!.uid });
    } catch (err) {
      console.error('Firestore 更新失敗', err);
    }
  };
  const handleLogout = async () => {
    await signOut(auth);
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
  <div className="min-h-screen flex flex-col overflow-hidden pb-36 sm:pb-24 bg-white">
    {/* ヘッダー */}
    <header className="h-14 flex justify-end items-center px-4 shadow-sm bg-gray-100">
      <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded text-sm">
        ログアウト
      </button>
    </header>

    {/* カレンダービュー */}
    <main className="flex-1 overflow-hidden">
      <FullCalendar
        ref={calendarRef}
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        height={typeof window !== 'undefined' && window.innerWidth < 640
          ? `calc(100dvh - ${HEADER_HEIGHT}px)`
          : 420}
        titleFormat={{ year: 'numeric', month: 'long' }}
        initialView={'timeGridWeek'}
        slotLabelFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false,
        }}
        dayHeaderFormat={typeof window !== 'undefined' && window.innerWidth < 640
          ? { weekday: 'short' }
          : { weekday: 'short', day: 'numeric' }}
        locales={[jaLocale]}
        locale="ja"
        scrollTime="08:00:00"
        scrollTimeReset={false}
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        eventDrop={handleEventChange}
        eventResize={handleEventChange}
        eventChange={handleEventChange}
        editable
        droppable
        selectable
        eventDisplay="block"
        dayCellContent={(arg) => (
          <div className="fc-daygrid-day-number">{arg.dayNumberText}</div>
        )}
        eventAdd={(info) => {
          const event = info.event;
          saveCalendarEvent({
            id: event.id,
            title: event.title,
            start: event.start?.toISOString() || '',
            end: event.end?.toISOString() || '',
            uid: user!.uid,
          });
        }}
        eventContent={(arg) => {
          const isHoliday = arg.event.id.startsWith('holiday-');
          const common: React.CSSProperties = {
            color: isHoliday ? 'red' : undefined,
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            fontWeight: isHoliday ? 'bold' : undefined,
          };
          return (
            <div style={common}>
              {arg.view.type === 'dayGridMonth' ? arg.event.title : <b>{arg.event.title}</b>}
            </div>
          );
        }}
        dayCellDidMount={(arg) => {
          const day = arg.date.getDay();
          if (day === 0) arg.el.style.backgroundColor = '#ffe4e4';
          else if (day === 6) arg.el.style.backgroundColor = '#e4f0ff';
        }}
      />
    </main>

    {/* 予定追加 FAB（モバイルのみ） */}
    <button
      onClick={() => {
        setShowInput(true);
        setSelectedDate(format(new Date(), 'yyyy-MM-dd'));
        setEditingEvent(null);
      }}
      className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-3 rounded-full shadow-lg sm:hidden"
    >
      ＋
    </button>

    {/* 予定追加 / 編集モーダル */}
    {showInput && (
      <div className="mt-4 p-4 border rounded shadow relative z-30 bg-white dark:bg-gray-800">
        <h2 className="text-lg font-semibold">
          {editingEvent ? '予定を編集' : '予定を追加'} ({selectedDate ? format(new Date(selectedDate), 'yyyy-MM-dd') : ''})
        </h2>
        <input
          type="text"
          placeholder="予定を入力"
          value={newEventTitle}
          onChange={(e) => setNewEventTitle(e.target.value)}
          className="border p-2 w-full mt-2"
        />
        <label>日付:</label>
        <input
          type="date"
          value={selectedDate || ''}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="border p-2 w-full mt-2"
        />
        <label>開始時間:</label>
        <input
          type="time"
          value={newEventStartTime}
          onChange={(e) => setNewEventStartTime(e.target.value)}
          className="border p-2 w-full mt-2"
        />
        <label>終了時間:</label>
        <input
          type="time"
          value={newEventEndTime}
          onChange={(e) => setNewEventEndTime(e.target.value)}
          className="border p-2 w-full mt-2"
        />
        {editingEvent ? (
          <div>
            <button
              onClick={updateEvent}
              className="mt-2 bg-green-500 text-white px-4 py-2 rounded mr-2"
            >更新</button>
            <button
              onClick={deleteEvent}
              className="mt-2 bg-red-500 text-white px-4 py-2 rounded"
            >削除</button>
          </div>
        ) : (
          <button
            onClick={addEvent}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >追加</button>
        )}
      </div>
    )}

    {/* FAB: Pomodoro & Stats (固定表示) */}
    {/* ✅ モバイル用フッターボタン：3つ横並び */}
  <div className="fixed bottom-4 left-0 right-0 z-50 px-4 flex justify-between sm:hidden">
    <button
      onClick={() => {
        setShowInput(true);
        setSelectedDate(format(new Date(), "yyyy-MM-dd"));
        setEditingEvent(null);
      }}
      className="bg-blue-500 text-white px-4 py-3 rounded-full shadow-lg w-1/3 mr-2"
    >
    ＋予定
    </button>

    <button
      onClick={() => setPanelOpen(true)}
      className="bg-red-500 text-white px-4 py-3 rounded-full shadow-lg w-1/3 mx-1"
      disabled={!selectedEventId}
    >
      🍅
    </button>

    <button
    onClick={() => setStatsOpen(true)}
    className="bg-green-600 text-white px-4 py-3 rounded-full shadow-lg w-1/3 ml-2"
    >
    📊
    </button>
  </div>

    {/* --- PC / タブレット用 FAB（従来の位置）--- */}
    <div className="hidden sm:block fixed bottom-20 right-4 z-50">
      <PomodoroFab onClick={() => setPanelOpen(true)} disabled={!selectedEventId} />
    </div>
    <div className="hidden sm:block fixed bottom-36 right-4 z-50">
      <StatsFab onClick={() => setStatsOpen(true)} />
    </div>

    {/* --- パネル群 --- */}
    <PomodoroPanel
      isOpen={panelOpen}
      onClose={() => setPanelOpen(false)}
      onRegister={handleRegister}
      eventId={selectedEventId}
      eventTitle={pomodoroEventTitle}
      tasks={selectedPomodoros}
    />
    <StatsPanel
      isOpen={statsOpen}
      onClose={() => setStatsOpen(false)}
      tasks={pomodoroTasks}
    />
  </div>
  );
}

export default AppMain;

