// src/types/calendar.ts
export interface CalendarEvent {
  id: string;
  uid: string; // 所属ユーザーのUID
  title: string;
  start: string;
  end: string;
  allDay?: boolean;
  note?: string;
  color?: string; // Geminiかユーザー作成かで色分け用
}
