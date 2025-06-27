import { PomodoroTask } from "../pomodoro/getPomodoroTasks";

export const convertPomodoroToEvents = (tasks: PomodoroTask[]) => {
  return tasks.map(task => {
    return {
      id: `pomodoro-${task.id}`,
      title: `🍅${task.task} x${task.sets}`,
      start: `${task.date}T08:00:00`, // 固定時間で表示（実績なので時刻不要）
      end: `${task.date}T08:30:00`,
      backgroundColor: "#f87171", // 赤系背景
      borderColor: "#f87171",
      textColor: "white",
      extendedProps: {
        isPomodoro: true,
        note: task.note,
        sets: task.sets,
      },
    };
  });
};