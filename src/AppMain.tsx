import "./App.css";
import { format } from "date-fns";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { saveCalendarEvent } from "./event/saveCalendarEvent";
import { deleteCalendarEvent } from "./event/deleteCalendarEvent";
import { updateCalendarEvent } from "./event/updateCalendarEvent";
import { getCalendarEvents } from "./event/getCalendarEvents";
import { saveGeminiPlanToFirestore } from "./event/saveGeminiPlanToFirestore";
import { getAuth, onAuthStateChanged, User, signOut } from "firebase/auth";
import { auth } from "./firebase";
import SignIn from "./auth/SignIn";
import PomodoroFab from "./components/PomodoroFab";
import PomodoroPanel from "./components/PomodoroPanel";
import { savePomodoroTask } from "./pomodoro/savePomodoroTask";
import { getPomodoroTasks } from "./pomodoro/getPomodoroTasks";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventClickArg } from "@fullcalendar/core";
import jaLocale from "@fullcalendar/core/locales/ja";
import type { PomodoroTask } from "./pomodoro/getPomodoroTasks";
import StatsFab from "./components/StatsFab";
import StatsPanel from "./components/StatsPanel";
import EventPanel from "./components/EventPanel";
import GoalPlanPanel from "./components/GoalPlanPanel";
import { AdRewardPanel } from "./components/AdRewardPanel";
import { GeminiPlanPreviewPanel } from "./components/GeminiPlanPreviewPanel";
import { parseISO } from "date-fns";
import { toast } from "react-hot-toast";
import {
  generatePlanWithGemini,
  type GenerateInput,
  type GeminiPlan,
} from "./lib/generatePlanWithGemini";
import { AdBanner } from "./components/AdBanner";
import { type CalendarEvent } from "../types/CalendarEvent";

function AppMain() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [panelOpen, setPanelOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [pomodoroTasks, setPomodoroTasks] = useState<PomodoroTask[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [pomodoroEventTitle, setPomodoroEventTitle] = useState<string | null>(
    null
  );
  const [selectedPomodoros, setSelectedPomodoros] = useState<PomodoroTask[]>(
    []
  );
  const [statsOpen, setStatsOpen] = useState(false);
  const [eventPanelOpen, setEventPanelOpen] = useState(false);
  const [editingEventData, setEditingEventData] = useState<{
    title: string;
    date: string;
    start: string;
    end: string;
  } | null>(null);
  const [goalPanelOpen, setGoalPanelOpen] = useState(false);
  const [showAdPanel, setShowAdPanel] = useState(false);
  const [showPreviewPanel, setShowPreviewPanel] = useState(false);
  const [goalInput, setGoalInput] = useState<GenerateInput | null>(null);
  const [hasExistingPlan, setHasExistingPlan] = useState(false);
  const [isGenerating, setGenerating] = useState(false); // ローディング
  const [currentPlan, setCurrentPlan] = useState<GeminiPlan | null>(null);
  const HEADER_HEIGHT = 56;

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const fetched = await getCalendarEvents(currentUser.uid);
        setEvents(fetched);
        const normalized = fetched.map((e) => ({
          ...e,
          start: new Date(e.start).toISOString(),
          end: new Date(e.end).toISOString(),
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
      const [calendarEvents, , holidayEvents] = await Promise.all([
        getCalendarEvents(user.uid),
        getPomodoroTasks(user.uid),
        loadHolidays(),
      ]);
      const normalizedCalendar = calendarEvents.map((e) => ({
        ...e,
        start: new Date(e.start).toISOString(),
        end: new Date(e.end).toISOString(),
      }));
      setEvents([...normalizedCalendar, ...holidayEvents]);
    })();
  }, [user]);

  const handleDateClick = (arg: DateClickArg) => {
    arg.jsEvent.preventDefault();
    /* クリックした日付に予定が無ければ選択解除 */
    const dayEvents = events.filter((e) => e.start.startsWith(arg.dateStr));
    if (dayEvents.length === 0) {
      setSelectedEventId(null);
      setPomodoroEventTitle(null);
      setPanelOpen(false);
      setStatsOpen(false);
      setEditingEvent(null);
      setEditingEventData(null);
    }
  };
  const calendarRef = useRef<FullCalendar | null>(null);
  // Firebase 登録（ステップ2で実装）
  const handleRegister = async (input) => {
    // 🍅パネルは「現在選択中の予定」に対して登録する
    if (!selectedEventId) return; // 何も選ばれていない
    if (selectedEventId.startsWith("holiday-")) return; // 念のため祝日ガード
    await savePomodoroTask({ ...input, eventId: selectedEventId });
    // 実績を最新化
    if (user) {
      const tasks = await getPomodoroTasks(user.uid, selectedEventId);
      setSelectedPomodoros(tasks);
      setPomodoroTasks(await getPomodoroTasks(user.uid)); // 全体も更新
    }
  };

  const toDateStr = (d: string | Date) => {
    // ISO 文字列なら parseISO、Dateならそのまま format
    return typeof d === "string"
      ? format(parseISO(d), "yyyy-MM-dd")
      : format(d, "yyyy-MM-dd");
  };

  const toTimeStr = (d: string | Date) => {
    return typeof d === "string"
      ? format(parseISO(d), "HH:mm")
      : format(d, "HH:mm");
  };

  const handleEventClick = async (arg: EventClickArg) => {
    arg.jsEvent.preventDefault();
    // 祝日や Pomodoro ダミーは無視
    if (
      arg.event.id.startsWith("holiday-") ||
      arg.event.id.startsWith("pomodoro-")
    )
      return;
    // すでに選択中 → 2 回目のクリック：編集パネルを開く
    if (selectedEventId === arg.event.id) {
      const ev = events.find((e) => e.id === arg.event.id)!;
      /* 編集用データを注入 */
      setEditingEvent(ev);
      setEditingEventData({
        title: ev.title,
        date: toDateStr(ev.start),
        start: toTimeStr(ev.start),
        end: toTimeStr(ev.end),
        note: ev.note,
      });
      openEventPanelOnly(); // ← 他パネルを閉じ、EventPanel を開く
      return;
    }
    setSelectedEventId(arg.event.id); // 予定を選択状態に
    setPomodoroEventTitle(arg.event.title); // 🍅 ボタン活性用
    setPanelOpen(false); // ← 他のパネルは閉じておく
    // ついでに、その予定に紐づく Pomodoro 実績を取得（非同期）
    if (user) {
      const tasks = await getPomodoroTasks(user.uid, arg.event.id);
      setSelectedPomodoros(tasks);
    }
  };

  const handleDeleteEvent = async (eventData: {
    title: string;
    date: string;
    start: string;
    end: string;
  }) => {
    if (!user || !editingEvent) return;
    try {
      await deleteCalendarEvent(user.uid, editingEvent.id);
      setEvents((prev) => prev.filter((e) => e.id !== editingEvent.id));
      setEventPanelOpen(false);
    } catch (err) {
      alert("削除に失敗しました");
      console.error("削除エラー:", err);
    }
  };

  /* 予定保存ハンドラ */
  const handleSaveEvent = async (
    title: string,
    date: string,
    start: string,
    end: string,
    note: string,
    allDay: boolean
  ) => {
    if (!user) return;
    if (editingEvent) {
      // 更新
      const updated: CalendarEvent = {
        ...editingEvent,
        title,
        start: `${date}T${start}`,
        end: `${date}T${end}`,
        note,
        allDay,
      };
      await saveCalendarEvent({ ...updated, uid: user.uid });
      setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
    } else {
      // 新規
      const newEvent: CalendarEvent = {
        id: String(Date.now()),
        title,
        start: `${date}T${start}`,
        end: `${date}T${end}`,
        note,
        allDay,
      };
      await saveCalendarEvent({ ...newEvent, uid: user.uid });
      setEvents((prev) => [...prev, newEvent]);
    }
    setEventPanelOpen(false);
  };

  // ① drag & drop／resize で呼ばれる共通ハンドラ
  const handleEventChange = async (arg: any) => {
    const ev = arg.event; // FullCalendar の Event オブジェクト
    const updated = {
      id: ev.id, // ← Firestore ドキュメント ID と一致
      title: ev.title,
      start: ev.startStr,
      end: ev.endStr,
    };
    if (ev.id.startsWith("holiday-")) {
      // ← ドラッグ／リサイズで祝日が変更されないように元に戻す
      ev.setStart(ev.start);
      ev.setEnd(ev.end);
      return;
    }

    // 1. ローカル state を更新
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));

    // 2. Firestore を更新
    try {
      await updateCalendarEvent({ ...updated, uid: user!.uid });
    } catch (err) {
      console.error("Firestore 更新失敗", err);
    }
  };
  const handleLogout = async () => {
    await signOut(auth);
  };

  const openEventPanelOnly = () => {
    setEventPanelOpen(true);
    setPanelOpen(false);
    setStatsOpen(false);
    setGoalPanelOpen(false);
  };

  const openPomodoroPanelOnly = () => {
    setEventPanelOpen(false);
    setPanelOpen(true);
    setStatsOpen(false);
    setGoalPanelOpen(false);
  };

  const openStatsPanelOnly = () => {
    setEventPanelOpen(false);
    setPanelOpen(false);
    setStatsOpen(true);
    setGoalPanelOpen(false);
  };

  const openGoalPanelOnly = () => {
    setGoalPanelOpen(true);
    setEventPanelOpen(false);
    setPanelOpen(false);
    setStatsOpen(false);
  };

  const handleStartAdReward = () => {
    setGoalPanelOpen(false);
    setShowAdPanel(true);
  };

  const handleGoalComplete = (input: typeof goalInput) => {
    console.log("handleGoalComplete called:", input);
    setGoalInput(input);
    setGoalPanelOpen(false);
    setShowAdPanel(true);
  };

  const handleGenerate = useCallback(async (input: GenerateInput) => {
    setGenerating(true);
    try {
      console.log("handleGenerate start");
      const plan = await generatePlanWithGemini(input);
      console.log("🔥 Geminiから返ってきたplan:", plan);
      setCurrentPlan(plan);
    } catch (e: unknown) {
      console.error("🚨 Gemini生成エラー:", e);

      if (e instanceof Error) {
        toast.error(e.message ?? "計画生成に失敗しました");
      } else {
        toast.error("不明なエラーが発生しました");
      }
    } finally {
      setGenerating(false);
    }
  }, []);

  const handleAdRewardConfirmed = () => {
    setShowAdPanel(false);
    handleGenerate(goalInput!); // 生成を開始
    setShowPreviewPanel(true);
  };
  const fetchEvents = async () => {
    if (!user) return;
    const events = await getCalendarEvents(user.uid);
    setEvents(events); // ← useState に格納されてるイベント更新
  };

  const handleSave = async (plan: GeminiPlan) => {
    try {
      await saveGeminiPlanToFirestore(user.uid, plan); // Firestore保存関数
      await fetchEvents(); // 🔄 カレンダー再読み込み
      setShowPreviewPanel(false);
    } catch (err) {
      console.error("保存エラー:", err);
      alert("保存失敗");
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

    window.addEventListener("resize", handleResize); // リサイズイベントをリッスン

    return () => {
      window.removeEventListener("resize", handleResize); // クリーンアップ
    };
  }, []);
  if (!user) {
    return <SignIn />;
  }
  return (
    <div className="min-h-screen flex flex-col overflow-hidden pb-36 sm:pb-24 bg-white">
      {/* ヘッダー */}
      <header className="h-14 flex justify-end items-center px-4 shadow-sm bg-gray-100">
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded text-sm"
        >
          ログアウト
        </button>
      </header>

      {/* カレンダー */}
      <main className="flex-1 overflow-hidden">
        <FullCalendar
          ref={calendarRef}
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          height={`calc(100dvh - ${HEADER_HEIGHT}px)`}
          titleFormat={{ year: "numeric", month: "long" }}
          initialView={"timeGridWeek"}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            meridiem: false,
            hour12: false,
          }}
          views={{
            dayGridMonth: {
              dayHeaderFormat: { weekday: "short" }, // 月表示：曜日だけ（例: 月, 火）
            },
            timeGridWeek: {
              dayHeaderFormat: { weekday: "short", day: "numeric" }, // 週表示：曜日+日付（例: 火 2）
            },
            timeGridDay: {
              dayHeaderFormat: { weekday: "short", day: "numeric" }, // 日表示：同上
            },
          }}
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
              start: event.start?.toISOString() || "",
              end: event.end?.toISOString() || "",
              uid: user!.uid,
            });
          }}
          /*eventContent={(arg) => {
            const isHoliday = arg.event.id.startsWith("holiday-");
            const common: React.CSSProperties = {
              color: isHoliday ? "red" : undefined,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: isHoliday ? "bold" : undefined,
            };
            return (
              <div style={common}>
                {arg.view.type === "dayGridMonth" ? (
                  arg.event.title
                ) : (
                  <b>{arg.event.title}</b>
                )}
              </div>
            );
          }}*/
          eventContent={(arg) => {
            const isHoliday = arg.event.id.startsWith("holiday-");
            const isMilestone = arg.event.extendedProps?.isMilestone === true;

            const common: React.CSSProperties = {
              color: isHoliday ? "red" : isMilestone ? "white" : undefined,
              //backgroundColor: isMilestone ? "#007bff" : undefined, // マイルストーンの背景色
              padding: isMilestone ? "2px 4px" : undefined,
              borderRadius: isMilestone ? "4px" : undefined,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              fontWeight: isHoliday || isMilestone ? "bold" : undefined,
              fontSize: "0.85em",
            };

            return (
              <div style={common}>
                {arg.view.type === "dayGridMonth" ? (
                  arg.event.title
                ) : (
                  <b>{arg.event.title}</b>
                )}
              </div>
            );
          }}
          dayCellDidMount={(arg) => {
            const day = arg.date.getDay();
            if (day === 0) arg.el.style.backgroundColor = "#ffe4e4";
            else if (day === 6) arg.el.style.backgroundColor = "#e4f0ff";
          }}
        />
      </main>

      {/* モバイル用FAB（3ボタン） */}
      <div className="fixed bottom-4 left-0 right-0 z-50 px-4 flex justify-between sm:hidden">
        {/* 🎯 目標 */}
        <button
          onClick={openGoalPanelOnly}
          className="bg-purple-600 text-white px-4 py-3 rounded-full shadow-lg w-1/4 mr-2"
        >
          🎯
        </button>
        <button
          className="bg-blue-500 text-white px-4 py-3 rounded-full shadow-lg w-1/3 mr-2"
          onClick={() => {
            setSelectedEventId(null);
            setEditingEvent(null);
            setEditingEventData(null);
            openEventPanelOnly();
          }}
        >
          ＋予定
        </button>

        <button
          onClick={() => selectedEventId && openPomodoroPanelOnly()}
          className={`w-1/3 mx-1 px-4 py-3 rounded-full shadow-lg ${
            selectedEventId
              ? "bg-red-500 text-white"
              : "bg-gray-400 text-gray-200 cursor-not-allowed"
          }`}
          disabled={!selectedEventId}
        >
          🍅
        </button>

        <button
          onClick={() => openStatsPanelOnly()}
          className="bg-green-600 text-white px-4 py-3 rounded-full shadow-lg w-1/3 ml-2"
        >
          📊
        </button>
      </div>

      {/* PC用FAB群 */}
      <div className="hidden sm:block fixed bottom-4 left-4 z-50">
        {/* 🎯 Goal */}
        <button
          onClick={openGoalPanelOnly}
          className="bg-purple-600 text-white px-4 py-3 rounded-full shadow-lg"
        >
          🎯
        </button>
        <button
          onClick={() => {
            setSelectedEventId(null);
            setEditingEvent(null);
            setEditingEventData(null);
            openEventPanelOnly();
          }}
          className="bg-blue-500 text-white px-4 py-3 rounded-full shadow-lg"
        >
          ＋予定
        </button>
      </div>
      <div className="hidden sm:block fixed bottom-20 right-4 z-50">
        <PomodoroFab
          onClick={() => openPomodoroPanelOnly()}
          disabled={!selectedEventId}
        />
      </div>
      <div className="hidden sm:block fixed bottom-36 right-4 z-50">
        <StatsFab onClick={() => openStatsPanelOnly()} />
      </div>

      <AdBanner />

      {/* パネル群 */}
      <EventPanel
        isOpen={eventPanelOpen}
        onClose={() => setEventPanelOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        defaultDate={format(new Date(), "yyyy-MM-dd")}
        editing={editingEventData}
      />
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
      {goalPanelOpen && (
        <GoalPlanPanel
          isOpen={goalPanelOpen}
          onClose={() => setGoalPanelOpen(false)}
          hasExistingPlan={hasExistingPlan}
          onNext={handleGoalComplete}
        />
      )}
      {showAdPanel && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center"
          onClick={() => setGoalPanelOpen(false)}
        >
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 w-full max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <AdRewardPanel
              onRewardConfirmed={handleAdRewardConfirmed}
              loading={false} // Gemini呼び出し中のローディング状態をあとで対応
            />
          </div>
        </div>
      )}
      {showPreviewPanel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div
            className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <GeminiPlanPreviewPanel
              input={goalInput}
              plan={currentPlan}
              onSave={handleSave}
              onBack={() => setShowPreviewPanel(false)}
              uid={user.uid}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default AppMain;
