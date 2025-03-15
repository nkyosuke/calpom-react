import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid'; // ✅ 時間単位のビューを追加
import interactionPlugin, { EventDragStopArg } from "@fullcalendar/interaction"; // ✅ `EventDropStopArg` をインポート
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import interactionPlugin from "@fullcalendar/interaction";
import { DateClickArg } from "@fullcalendar/interaction"; // ✅ 型をインポート
import { EventClickArg } from "@fullcalendar/core";
import { format } from "date-fns";
import React, { useState, useEffect, useRef } from 'react'; // useEffect をインポート
import jaLocale from '@fullcalendar/core/locales/ja'; 
import './App.css';

type Event = {
  id: string;
  title: string;
  start: string;
  end: string; // ✅ 終了時間を追加
};

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventStartTime, setNewEventStartTime] = useState("12:00"); // ✅ 開始時間
  const [newEventEndTime, setNewEventEndTime] = useState("13:00"); // ✅ 終了時間
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [showInput, setShowInput] = useState(false);
  const [tooltip, setTooltip] = useState<{ top: number; left: number; title: string; start: string; end: string;} | null>(null);


  const handleDateClick = (arg: DateClickArg) => { // ✅ 正しい型に修正
    console.log("📅 Selected Date:", arg.dateStr);
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
  
  // 予定追加処理
  const addEvent = () => {
    if (selectedDate && newEventTitle.trim() !== "") {
      const newEvent: Event = {
        id: String(events.length + 1),
        title: newEventTitle,
        start: `${selectedDate}T${newEventStartTime}`, // ✅ 開始時間を適用
        end: `${selectedDate}T${newEventEndTime}`, // ✅ 終了時間を適用
      };
      setEvents([...events, newEvent]);
      closeModal();
    }
  };

  const updateEvent = () => {
    if (editingEvent && newEventTitle.trim() !== "") {
      setEvents(events.map(e => e.id === editingEvent.id ? { ...e, title: newEventTitle, 
        start: `${selectedDate}T${newEventStartTime}`,  // ✅ 開始時間を更新
        end: `${selectedDate}T${newEventEndTime}` 
      } : e
    ));
      closeModal();
    }
  };

  const deleteEvent = () => {
    if (editingEvent) {
      setEvents(events.filter(e => e.id !== editingEvent.id));
      closeModal();
    }
  };

  const handleEventClick = (arg: EventClickArg) => {
    const event = events.find(e => e.id === arg.event.id);
    if (event) {
      setEditingEvent(event);
      setNewEventTitle(event.title);
      setSelectedDate(event.start.split("T")[0]);
      setNewEventStartTime(event.start.split("T")[1]); // ✅ 開始時間をセット
      setNewEventEndTime(event.end.split("T")[1]); // ✅ 終了時間をセット
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

  // 🔄 予定をドラッグ＆ドロップで移動
  const handleEventDrop = (arg: EventDragStopArg) => {
    const { event } = arg;
    setEvents(events.map(e =>
      e.id === event.id ? { ...e, start: event.startStr } : e // ✅ 予定の開始日を更新
    ));
  };

  const handleEventMouseEnter = (info: any) => {
    const rect = info.el.getBoundingClientRect(); // イベントの位置を取得
    setTooltip({
      top: rect.top + window.scrollY - 40, // ポップアップを少し上に
      left: rect.left + window.scrollX + rect.width / 2, // 水平方向の中心に
      title: info.event.title, // イベントのタイトル
      start: info.event.startStr.slice(11, 16), // ⏰ 開始時間
      end: info.event.endStr.slice(11, 16),     // ⏰ 終了時間
    });
  };
  const handleEventMouseLeave = () => {
    setTooltip(null); // マウスが離れたら非表示
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
  return (
    <div className="calendar-container">
      {/* ✅ ホバー時のツールチップ表示 */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            top: `${tooltip.top}px`,
            left: `${tooltip.left}px`,
            background: "#333",
            color: "#fff",
            padding: "8px 10px",
            borderRadius: "5px",
            pointerEvents: "none",
            transform: "translateX(-50%)",
            whiteSpace: "nowrap",
            fontSize: "14px",
            boxShadow: "2px 2px 10px rgba(0, 0, 0, 0.5)", // ✅ 影を追加して見やすく
          }}
        >
          <div><strong>{tooltip.title}</strong></div>
          <div>{tooltip.start} ~ {tooltip.end}</div> {/* ⏰ ここを追加 */}
        </div>
      )}
      <FullCalendar 
        ref={calendarRef} // FullCalendar の参照を渡す
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]} // ✅ timeGridPlugin を追加
        initialView="dayGridMonth"
        locales={[jaLocale]}
        locale='ja'
        events={events}
        dateClick={handleDateClick} // 日付クリックイベント
        eventClick={handleEventClick} // 予定クリックイベント追加
        eventDrop={handleEventDrop} // ✅ 予定をドラッグ＆ドロップで移動できるように追加
        editable={true} // ✅ 予定を編集可能にする
        droppable={true} // ✅ ドロップ可能にする
        height={420} // 固定の高さを設定
        eventMouseEnter={handleEventMouseEnter} // ✅ ホバー時の処理
        eventMouseLeave={handleEventMouseLeave} // ✅ ホバー解除時の処理
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
          <input
            type="time"
            value={newEventStartTime}
            onChange={(e) => setNewEventStartTime(e.target.value)}
            className="border p-2 w-full mt-2"
          />
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
    </div>
  );
}

export default App;

