import React, { useState, useEffect } from "react";

/* ---------- 型定義 ---------- */
export type EditingData = {
  title: string;
  date: string; // YYYY‑MM‑DD
  start: string; // HH:mm
  end: string; // HH:mm
  note?: string;
  isMilestone?: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  /** 新規 or 更新の保存 */
  onSave: (
    title: string,
    date: string,
    start: string,
    end: string,
    note?: string,
    isMilestone?: boolean
  ) => void;
  /** 更新モード時のみ利用。渡されていれば「削除」ボタンを表示 */
  onDelete?: (editing: EditingData) => void;
  defaultDate: string;
  editing?: EditingData | null;
};

/* ---------- 本体 ---------- */
const EventPanel: React.FC<Props> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  defaultDate,
  editing,
}) => {
  /* 入力ステート */
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(defaultDate);
  const [start, setStart] = useState("12:00");
  const [end, setEnd] = useState("13:00");
  const [note, setNote] = useState("");
  const [isMilestone, setIsMilestone] = useState(false);
  /* 編集モードなら初期値を注入 */
  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setDate(editing.date);
      setStart(editing.start);
      setEnd(editing.end);
      setNote(editing.note || "");
      setIsMilestone(editing.isMilestone ?? false);
    } else {
      setTitle("");
      setDate(defaultDate);
      setStart("12:00");
      setEnd("13:00");
      setNote("");
      setIsMilestone(false);
    }
  }, [editing, defaultDate]);

  if (!isOpen) return null;

  return (
    <>
      {/* ----- オーバーレイ ----- */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* ----- パネル ----- */}
      <div className="fixed inset-0 z-50 flex sm:justify-end">
        <div className="flex-1" onClick={onClose} />{" "}
        {/* クリックで閉じる余白 */}
        <div className="relative w-full sm:w-96 bg-white dark:bg-gray-900 shadow-xl p-6 overflow-y-auto">
          {/* × ボタン */}
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-white text-xl font-bold"
            aria-label="閉じる"
          >
            ×
          </button>

          <h2 className="text-lg font-semibold mb-4">
            {editing ? "予定を編集" : "予定を追加"}
          </h2>

          {/* ------- 入力フォーム ------- */}
          <label className="text-sm">タイトル</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border p-2 w-full mb-3 bg-gray-100 dark:bg-gray-800"
          />

          <label className="text-sm">日付</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border p-2 w-full mb-3 bg-gray-100 dark:bg-gray-800"
          />

          {/*<label className="flex items-center space-x-2 text-sm mb-2">
            <input
              type="checkbox"
              checked={isMilestone}
              onChange={(e) => setIsMilestone(e.target.checked)}
            />
            <span>マイルストーンとして登録</span>
          </label>*/}

          <div className="flex gap-2">
            <div className="flex-1">
              <label className="text-sm">開始</label>
              <input
                type="time"
                value={start}
                onChange={(e) => setStart(e.target.value)}
                className="border p-2 w-full bg-gray-100 dark:bg-gray-800"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm">終了</label>
              <input
                type="time"
                value={end}
                onChange={(e) => setEnd(e.target.value)}
                className="border p-2 w-full bg-gray-100 dark:bg-gray-800"
              />
            </div>
          </div>
          <label className="text-sm">メモ</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="border p-2 w-full mb-3 bg-gray-100 dark:bg-gray-800"
          />

          {/* ------- アクション ------- */}
          <button
            onClick={() => onSave(title, date, start, end, note, isMilestone)}
            disabled={title.trim() === ""}
            className={`w-full mt-5 py-2 rounded ${
              title.trim()
                ? "bg-blue-600 hover:bg-blue-700 text-white"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            {editing ? "更新する" : "登録する"}
          </button>

          {editing && onDelete && (
            <button
              onClick={() => onDelete(editing)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-3 w-full"
            >
              削除
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default EventPanel;
