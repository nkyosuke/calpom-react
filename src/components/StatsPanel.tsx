// src/components/StatsPanel.tsx
import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import type { PomodoroTask } from '../pomodoro/getPomodoroTasks';
import { eachDayOfInterval, format, subDays } from 'date-fns';
import { startOfYear, endOfMonth } from 'date-fns';

/* ---------- 定数 ---------- */
const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#14b8a6'];
const chartOptions = ['bar', 'line', 'pie', 'stack', 'heatmap', 'github'] as const;
//const today = new Date();
//const threeMonthsAgo = subDays(today, 90);
//const sixMonthsAgo   = subDays(today, 180);

type ChartType = typeof chartOptions[number];

/* ---------- props ---------- */
interface Props {
  isOpen: boolean;
  onClose: () => void;
  tasks: PomodoroTask[];
}

const StatsPanel: React.FC<Props> = ({ isOpen, onClose, tasks }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');

  /* ---------- データ整形 ---------- */
  // 直近 7 日
  const dailyData = useMemo(() => {
    const today = new Date();
    const days  = eachDayOfInterval({ start: subDays(today, 6), end: today });

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

  // Pie
  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(t => map.set(t.task, (map.get(t.task) || 0) + t.sets));
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [tasks]);

  // Stack
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

  // GitHub 風ヒートマップ用
  const heatmapValues = useMemo( () =>
    tasks.map(t => ({
      date: t.date,        // 'YYYY-MM-DD'
      count: t.sets,       // 濃さの判定用
    })),
  [tasks],
 );

  /* ---------- guard 判定 ---------- */
  const noData = tasks.length === 0;
  const noStack   = chartType === 'stack'   && taskKeys.length === 0;
  const noPie     = chartType === 'pie'     && pieData.length  === 0;
  const noHeatBar   = chartType === 'heatmap' && dailyData.every(d => d.sets === 0);
  const noGitHubMap = chartType === 'github'  && heatmapValues.every(v => v.count === 0);
  // データを2分割
  //const upperHeatmap = heatmapValues.filter(v => new Date(v.date) >= sixMonthsAgo && new Date(v.date) < threeMonthsAgo);
  //const lowerHeatmap = heatmapValues.filter(v => new Date(v.date) >= threeMonthsAgo && new Date(v.date) <= today);
  const today = new Date();
  const yearStart = startOfYear(today);  // 1月1日
  const juneEnd = endOfMonth(new Date(today.getFullYear(), 5)); // 6月30日
  const decEnd  = endOfMonth(new Date(today.getFullYear(), 11)); // 12月31日
  const heatTop = heatmapValues.filter(
    v => new Date(v.date) >= yearStart && new Date(v.date) <= juneEnd
  );
  const heatBottom = heatmapValues.filter(
    v => new Date(v.date) > juneEnd && new Date(v.date) <= decEnd
  );

  const canDraw = !noData && !noStack && !noPie && !noHeatBar && !noGitHubMap;

  /* ---------- チャート JSX ---------- */
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
            <Bar dataKey="sets" fill={COLORS[0]} />
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
            <Line type="monotone" dataKey="sets" stroke={COLORS[2]} />
          </LineChart>
        );
        break;

      case 'pie':
        chartEl = (
          <PieChart>
            <Tooltip />
            <Pie data={pieData} dataKey="value" nameKey="name"
                 outerRadius={110} label>
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
              <Bar key={k} dataKey={k} stackId="a"
                   fill={COLORS[i % COLORS.length]} />
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
                <Cell key={i}
                      fill={`rgba(239,68,68,${d.sets / 10 || 0.05})`} />
              ))}
            </Bar>
          </BarChart>
        );
        break;

      case 'github':
        chartEl = (
          <div className="overflow-x-auto space-y-4 scale-[0.85] origin-top-left">
            <CalendarHeatmap
              startDate={yearStart}
              endDate={juneEnd}
              values={heatTop}
              classForValue={(v) => {
                if (!v || v.count === 0) return 'heat-empty';
                if (v.count >= 8) return 'heat-4';
                if (v.count >= 5) return 'heat-3';
                if (v.count >= 3) return 'heat-2';
                return 'heat-1';
              }}
              showWeekdayLabels={false}
              tooltipDataAttrs={(v) =>
                v?.date
                ? { 'data-tip': `${v.date}: ${v.count ?? 0} セット` }
                : undefined
              }
            />
            <CalendarHeatmap
              startDate={new Date(today.getFullYear(), 6, 1)}
              endDate={decEnd}
              values={heatBottom}
              classForValue={(v) => {
                if (!v || v.count === 0) return 'heat-empty';
                if (v.count >= 8) return 'heat-4';
                if (v.count >= 5) return 'heat-3';
                if (v.count >= 3) return 'heat-2';
                return 'heat-1';
              }}
              showWeekdayLabels={false}
              tooltipDataAttrs={(v) =>
                v?.date
                ? { 'data-tip': `${v.date}: ${v.count ?? 0} セット` }
                : undefined
             }
            />
          </div>
        );
        break;  
      }
    }

  /* ---------- UI ---------- */
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-40 flex flex-col">
      {/* ヘッダー */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Pomodoro 実績</h2>
        <button onClick={onClose}
                className="text-gray-500 hover:text-black">
          ×
        </button>
      </div>

      {/* ボタン */}
      <div className="flex gap-2 p-4 flex-wrap">
        {chartOptions.map(t => (
          <button key={t}
                  onClick={() => setChartType(t)}
                  className={`px-3 py-1 rounded ${
                    chartType === t ? 'bg-emerald-600 text-white'
                                     : 'bg-gray-200'}`}>
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 本体 */}
      <div className="flex-1 p-4">
        {canDraw ? (
          chartType === 'github' ? (
            chartEl
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              {chartEl}
            </ResponsiveContainer>
          )
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
