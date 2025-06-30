import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import type { PomodoroTask } from '../pomodoro/getPomodoroTasks';
import {
  eachDayOfInterval, eachWeekOfInterval, eachMonthOfInterval,
  format, subDays, subWeeks, subMonths, startOfWeek,
  startOfYear, endOfMonth,
} from 'date-fns';

/* ---------- 定数 ---------- */
const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#14b8a6'];
const chartOptions = ['bar', 'line', 'pie', 'stack', 'heatmap', 'github'] as const;
const timeRanges  = ['daily', 'weekly', 'monthly'] as const;

type ChartType   = typeof chartOptions[number];
type TimeRange   = typeof timeRanges[number];

/* ---------- props ---------- */
interface Props {
  isOpen: boolean;
  onClose: () => void;
  tasks: PomodoroTask[];
}

const StatsPanel: React.FC<Props> = ({ isOpen, onClose, tasks }) => {
  const [chartType, setChartType]   = useState<ChartType>('bar');
  const [timeRange, setTimeRange]   = useState<TimeRange>('daily');

  /* ---------- データ抽出 & フィルタリング ---------- */
  const today = useMemo(() => new Date(), []);

  /**
   * 選択中の timeRange に応じて対象期間を返却
   */
  const getPeriodStart = (range: TimeRange): Date => {
    switch (range) {
      case 'daily':   return subDays(today, 6);          // 直近 7 日間
      case 'weekly':  return subWeeks(today, 11);        // 直近 12 週
      case 'monthly': return subMonths(today, 11);       // 直近 12 ヶ月
    }
  };

  const periodStart = getPeriodStart(timeRange);

  // 選択期間内のタスクだけを抽出
  const filteredTasks = useMemo(() => (
    tasks.filter(t => new Date(t.date) >= periodStart && new Date(t.date) <= today)
  ), [tasks, periodStart, today]);

  /* ---------- 集計ユーティリティ ---------- */
  const labelForDate = (date: Date, range: TimeRange): string => {
    switch (range) {
      case 'daily':   return format(date, 'MM/dd');
      case 'weekly':  return format(startOfWeek(date, { weekStartsOn: 1 }), "yy-'W'II");
      case 'monthly': return format(date, 'yyyy/MM');
    }
  };

 /* const generateBuckets = (range: TimeRange): Date[] => {
    switch (range) {
      case 'daily':   return eachDayOfInterval({ start: periodStart, end: today });
      case 'weekly':  return eachWeekOfInterval({ start: periodStart, end: today }, { weekStartsOn: 1 });
      case 'monthly': return eachMonthOfInterval({ start: periodStart, end: today });
    }
  };*/

  /* ---------- 共通集計 ---------- */
  const buckets = useMemo(() => {
  switch (timeRange) {
    case 'daily':
      return eachDayOfInterval({ start: periodStart, end: today });
    case 'weekly':
      return eachWeekOfInterval({ start: periodStart, end: today }, { weekStartsOn: 1 });
    case 'monthly':
      return eachMonthOfInterval({ start: periodStart, end: today });
    default:
      return [];
  }
  }, [timeRange, periodStart, today]);

  // Bar / Line 用
  const aggregatedData = useMemo(() => {
    const base: Record<string, number> = Object.fromEntries(
      buckets.map(d => [labelForDate(d, timeRange), 0]),
    );

    filteredTasks.forEach(t => {
      const key = labelForDate(new Date(t.date), timeRange);
      base[key] = (base[key] || 0) + t.sets;
    });

    return Object.entries(base).map(([label, sets]) => ({ label, sets }));
  }, [filteredTasks, buckets, timeRange]);

  // Stack 用
  const stackedData = useMemo(() => {
    const base: Record<string, Record<string, number>> = {};
    filteredTasks.forEach(({ task, date, sets }) => {
      const key = labelForDate(new Date(date), timeRange);
      base[key] = base[key] || {};
      base[key][task] = (base[key][task] || 0) + sets;
    });
    return Object.entries(base).map(([label, v]) => ({ label, ...v }));
  }, [filteredTasks, timeRange]);

  // Pie 用
  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    filteredTasks.forEach(t => map.set(t.task, (map.get(t.task) || 0) + t.sets));
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [filteredTasks]);

  // Heatmap / GitHub 風ヒートマップは年間を対象にするのでオリジナルのロジックを維持
  const heatmapValues = useMemo(() =>
    tasks.map(t => ({
      date: t.date,
      count: t.sets,
    })),
    [tasks],
  );

  /* ---------- guard 判定 ---------- */
  const noData     = tasks.length === 0;
  const noStack    = chartType === 'stack'   && stackedData.length === 0;
  const noPie      = chartType === 'pie'     && pieData.length    === 0;
  const noHeatBar  = chartType === 'heatmap' && aggregatedData.every(d => d.sets === 0);
  const noGitHubMap= chartType === 'github'  && heatmapValues.every(v => v.count === 0);

  const canDraw = !noData && !noStack && !noPie && !noHeatBar && !noGitHubMap;

  /* ---------- チャート JSX ---------- */
  let chartEl: React.ReactElement | null = null;

  if (canDraw) {
    switch (chartType) {
      case 'bar':
        chartEl = (
          <BarChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="sets" fill={COLORS[0]} />
          </BarChart>
        );
        break;

      case 'line':
        chartEl = (
          <LineChart data={aggregatedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
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
        const taskKeys = Object.keys(stackedData[0] || {}).filter(k => k !== 'label');
        chartEl = (
          <BarChart data={stackedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
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
          <BarChart data={aggregatedData}>
            <XAxis dataKey="label" />
            <Tooltip />
            <Bar dataKey="sets">
              {aggregatedData.map((d, i) => (
                <Cell
                  key={i}
                  fill={`rgba(239,68,68,${d.sets / 10 || 0.05})`}
                />
              ))}
            </Bar>
          </BarChart>
        );
        break;

      case 'github':
        const yearStart = startOfYear(today);
        const juneEnd   = endOfMonth(new Date(today.getFullYear(), 5)); // 6/30
        const decEnd    = endOfMonth(new Date(today.getFullYear(), 11));
        const heatTop   = heatmapValues.filter(v => new Date(v.date) >= yearStart && new Date(v.date) <= juneEnd);
        const heatBottom= heatmapValues.filter(v => new Date(v.date) >  juneEnd   && new Date(v.date) <= decEnd);

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
                v?.date ? { 'data-tip': `${v.date}: ${v.count ?? 0} セット` } : undefined
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
                v?.date ? { 'data-tip': `${v.date}: ${v.count ?? 0} セット` } : undefined
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
        <button onClick={onClose} className="text-gray-500 hover:text-black">×</button>
      </div>

      {/* グラフ種別ボタン */}
      <div className="flex gap-2 p-4 flex-wrap">
        {chartOptions.map(t => (
          <button
            key={t}
            onClick={() => setChartType(t)}
            className={`px-3 py-1 rounded ${chartType === t ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}
          >
            {t.toUpperCase()}
          </button>
        ))}
      </div>

      {/* 期間切替ボタン */}
      {['bar', 'line', 'stack', 'pie'].includes(chartType) && (
        <div className="flex gap-2 px-4 pb-2 flex-wrap">
          {timeRanges.map(r => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1 rounded ${timeRange === r ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}
            >
              {r.toUpperCase()}
            </button>
          ))}
        </div>
      )}

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
            {noData ? 'データがありません' : 'このグラフに表示できるデータがありません'}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatsPanel;
