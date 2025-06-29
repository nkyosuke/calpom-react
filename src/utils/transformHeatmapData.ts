// src/components/StatsPanel.tsx
import React, { useMemo, useState } from 'react';
import {
  BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { PomodoroTask } from '../pomodoro/getPomodoroTasks';
import { eachDayOfInterval, format, subDays, startOfYear, endOfYear } from 'date-fns';

const COLORS = ['#ef4444', '#f97316', '#3b82f6', '#14b8a6'];

const chartOptions = ['bar', 'line', 'pie', 'stack', 'heatmap', 'calendar'] as const;
type ChartType = typeof chartOptions[number];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  tasks: PomodoroTask[];
}

const StatsPanel: React.FC<Props> = ({ isOpen, onClose, tasks }) => {
  const [chartType, setChartType] = useState<ChartType>('bar');

  const dailyData = useMemo(() => {
    const today = new Date();
    const days = eachDayOfInterval({ start: subDays(today, 6), end: today });
    const base: Record<string, number> = Object.fromEntries(days.map(d => [format(d, 'yyyy-MM-dd'), 0]));
    tasks.forEach(t => {
      base[t.date] = (base[t.date] || 0) + t.sets;
    });
    return Object.entries(base).map(([date, sets]) => ({
      date: format(new Date(date), 'MM/dd'),
      sets,
    }));
  }, [tasks]);

  const pieData = useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(t => {
      map.set(t.task, (map.get(t.task) || 0) + t.sets);
    });
    return Array.from(map, ([name, value]) => ({ name, value }));
  }, [tasks]);

  const stackedData = useMemo(() => {
    const taskMap: Record<string, Record<string, number>> = {};
    tasks.forEach(({ task, date, sets }) => {
      const d = format(new Date(date), 'MM/dd');
      taskMap[d] = taskMap[d] || {};
      taskMap[d][task] = (taskMap[d][task] || 0) + sets;
    });
    return Object.entries(taskMap).map(([date, values]) => ({ date, ...values }));
  }, [tasks]);

  const calendarHeatmap = useMemo(() => {
    const start = startOfYear(new Date());
    const end = endOfYear(new Date());
    const days = eachDayOfInterval({ start, end });
    const base: Record<string, number> = Object.fromEntries(days.map(d => [format(d, 'yyyy-MM-dd'), 0]));
    tasks.forEach(t => {
      base[t.date] = (base[t.date] || 0) + t.sets;
    });
    return days.map(d => ({
      date: d,
      sets: base[format(d, 'yyyy-MM-dd')] || 0
    }));
  }, [tasks]);

  const taskKeys = Array.from(new Set(tasks.map(t => t.task)));

  if (!isOpen) return null;

  return (
    <div className="fixed top-0 right-0 h-full w-96 bg-white shadow-xl z-40 flex flex-col">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Pomodoro 実績</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-black">×</button>
      </div>

      <div className="flex gap-2 p-4 flex-wrap">
        {chartOptions.map(t => (
          <button
            key={t}
            onClick={() => setChartType(t)}
            className={`px-3 py-1 rounded ${chartType === t ? 'bg-emerald-600 text-white' : 'bg-gray-200'}`}
          >{t.toUpperCase()}</button>
        ))}
      </div>

      <div className="flex-1 p-4 overflow-auto">
        {chartType !== 'calendar' && (
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'bar' && (
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="sets" fill="#ef4444" />
              </BarChart>
            )}

            {chartType === 'line' && (
              <LineChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="sets" stroke="#3b82f6" />
              </LineChart>
            )}

            {chartType === 'pie' && (
              <PieChart>
                <Tooltip />
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  outerRadius={110}
                  label
                >
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
              </PieChart>
            )}

            {chartType === 'stack' && (
              <BarChart data={stackedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                {taskKeys.map((key, i) => (
                  <Bar key={key} dataKey={key} stackId="a" fill={COLORS[i % COLORS.length]} />
                ))}
              </BarChart>
            )}

            {chartType === 'heatmap' && (
              <BarChart data={dailyData}>
                <XAxis dataKey="date" />
                <Tooltip />
                <Bar dataKey="sets" fill="#8884d8">
                  {dailyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`rgba(255,0,0,${entry.sets / 10})`} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        )}

        {chartType === 'calendar' && (
          <div className="grid grid-cols-53 gap-[2px] text-[8px] leading-none">
            {calendarHeatmap.map(({ date, sets }) => (
              <div
                key={date.toISOString()}
                title={`${format(date, 'yyyy-MM-dd')} ${sets}セット`}
                style={{
                  backgroundColor: sets === 0 ? '#eee' : `rgba(239, 68, 68, ${Math.min(1, sets / 8)})`,
                  width: 10,
                  height: 10,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StatsPanel;
