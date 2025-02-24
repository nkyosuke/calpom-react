import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import interactionPlugin from "@fullcalendar/interaction";
import { DateClickArg } from "@fullcalendar/interaction"; // ✅ 型をインポート
import { format } from "date-fns";
import React, { useState, useEffect, useRef } from 'react'; // useEffect をインポート
import jaLocale from '@fullcalendar/core/locales/ja'; 
import './App.css';

type Event = {
  id: string;
  title: string;
  start: string;
};

function App() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [newEventTitle, setNewEventTitle] = useState("");

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
  };
  // useRef はここで定義
  const calendarRef = useRef<FullCalendar | null>(null); // FullCalendar の参照を保持
  
  // 予定追加処理
  const addEvent = () => {
    if (selectedDate && newEventTitle.trim() !== "") {
      const newEvent: Event = {
        id: String(events.length + 1),
        title: newEventTitle,
        start: selectedDate,
      };
      setEvents([...events, newEvent]);
      setNewEventTitle(""); // 入力欄リセット
      setSelectedDate(null); // モーダルを閉じる
    }
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
      <FullCalendar 
        ref={calendarRef} // FullCalendar の参照を渡す
        plugins={[dayGridPlugin, interactionPlugin]} // ✅ interactionPlugin を追加！
        initialView="dayGridMonth"
        locales={[jaLocale]}
        locale='ja'
        events={events}
        dateClick={handleDateClick} // 日付クリックイベント
        height={420} // 固定の高さを設定
      />
      {/* 予定登録フォーム（モーダル風に表示） */}
      {selectedDate && (
        <div className="mt-4 p-4 border rounded shadow">
          <h2 className="text-lg font-semibold">
            予定を追加 ({selectedDate ? format(new Date(selectedDate), "yyyy-MM-dd"):" "})
          </h2>
          <input
            type="text"
            placeholder="予定を入力"
            value={newEventTitle}
            onChange={(e) => setNewEventTitle(e.target.value)}
            className="border p-2 w-full mt-2"
          />
          <button
            onClick={addEvent}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
          >
            追加
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

