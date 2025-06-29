// src/components/StatsPanel.tsx
import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { PomodoroTask } from '../pomodoro/getPomodoroTasks';
import { eachDayOfInterval, format, subDays } from 'date-fns';

const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#14b8a6'];

const chartOptions = ['bar', 'line', 'pie', 'stack', 'heatmap'] as const;
type ChartType = typeof chartOptions[number];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tasks: PomodoroTask[];
}

const StatsPanel: React.FC<Props> = ({ isOpen, onClose, tasks }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');

  /* ---------- データ整形 ---------- */
  // 1週間分（棒・折れ線・ヒートマップ）
  const dailyData = useMemo(() => {
    const today = new Date();
    const days = eachDayOfInterval({ start: subDays(today, 6), end: today });
    const base: Record<string, number> =
      Object.fromEntries(days.map(d => [format(d, 'yyyy-MM-dd'), 0]));

    tasks.forEach(t => {
      base[t.date] = (base[t.date] || 0) + t.sets;
    });

    return Object.entries(base).map(([date, sets]) => ({
      date: format(new Date(date), 'MM/dd'),
      sets,
    }));
  }, [tasks]);

  // パイチャート用
  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(t => {
      map.set(t.task, (map.get(t.task) || 0) + t.sets);
    });
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [tasks]);

  // 積み上げ棒グラフ用
  const stacked = useMemo(() => {
    const base: Record<string, Record<string, number>> = {};
    tasks.forEach(({ task, date, sets }) => {
      const d = format(new Date(date), 'MM/dd');
      base[d] = base[d] || {};
      base[d][task] = (base[d][task] || 0) + sets;
    });
    return Object.entries(base).map(([date, v]) => ({ date, ...v }));
  }, [tasks]);

  const taskKeys = useMemo(
    () => Array.from(new Set(tasks.map(t => t.task))),
    [tasks],
  );

  /* ---------- guard 判定 ---------- */
  const noData    = tasks.length === 0;
  const noStack   = chartType === 'stack'   && taskKeys.length === 0;
  const noPie     = chartType === 'pie'     && pieData.length  === 0;
  const noHeatBar = chartType === 'heatmap' && dailyData.every(d => d.sets === 0);

  // *ResponsiveContainer* を描画してよいか？
  const canDraw =
    !noData && !noStack && !noPie && !noHeatBar;

  /* ---------- チャート Element を組み立て ---------- */
  let chartEl: React.ReactElement | null = null;

  if (canDraw) {
    switch (chartType) {
      case 'bar':
        chartEl = (
          <BarChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="sets" fill="#ef4444" />
          </BarChart>
        );
        break;
      case 'line':
        chartEl = (
          <LineChart data={dailyData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Line type="monotone" dataKey="sets" stroke="#3b82f6" />
          </LineChart>
        );
        break;
      case 'pie':
        chartEl = (
          <PieChart>
            <Tooltip />
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              outerRadius={110}
              label
            >
              {pieData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        );
        break;
      case 'stack':
        chartEl = (
          <BarChart data={stacked}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            {taskKeys.map((k, i) => (
              <Bar key={k} dataKey={k} stackId="a" fill={COLORS[i % COLORS.length]} />
            ))}
          </BarChart>
        );
        break;
      case 'heatmap':
        chartEl = (
          <BarChart data={dailyData}>
            <XAxis dataKey="date" />
            <Tooltip />
            <Bar dataKey="sets">
              {dailyData.map((d, i) => (
                <Cell key={i} fill={`rgba(255,0,0,${d.sets / 10})`} />
              ))}
            </Bar>
          </BarChart>
        );
        break;
    }
  }

  /* ---------- UI ---------- */
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-40 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Pomodoro 実績</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>

      {/* チャート選択ボタン */}
      <div className="flex gap-2 p-4 flex-wrap">
        {chartOptions.map(t => (
          <button
            key={t}
            onClick={() => setChartType(t)}
            className={`px-3 py-1 rounded ${
              chartType === t ? 'bg-emerald-600 text-white' : 'bg-gray-200'
            }`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 本体 */}
      <div className="flex-1 p-4">
        {canDraw ? (
          <ResponsiveContainer width="100%" height="100%">
            {chartEl}
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-500 mt-20">
            {noData
              ? 'データがありません'
              : 'このグラフに表示できるデータがありません'}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsPanel;
