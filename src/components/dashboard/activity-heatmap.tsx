"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface ActivityData {
  date: string; // YYYY-MM-DD
  count: number;
}

interface ActivityHeatmapProps {
  activities: ActivityData[];
  className?: string;
}

export function ActivityHeatmap({ activities, className }: ActivityHeatmapProps) {
  // Generate last 15 weeks (105 days) of dates
  const { weeks, activityMap, totalActivities, currentStreak, longestStreak } = useMemo(() => {
    const today = new Date();
    const activityMap = new Map<string, number>();

    // Build activity map
    activities.forEach(({ date, count }) => {
      activityMap.set(date, count);
    });

    // Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Check from today backwards for current streak
    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(today.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      if (activityMap.has(dateStr) && activityMap.get(dateStr)! > 0) {
        if (i === 0 || currentStreak > 0) {
          currentStreak++;
        }
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        if (i > 0) tempStreak = 0;
        if (i > 0 && currentStreak > 0) break;
      }
    }

    // Generate weeks array (15 weeks)
    const weeks: { date: Date; dateStr: string }[][] = [];
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - 104); // 15 weeks ago

    // Adjust to start from Sunday
    const dayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - dayOfWeek);

    let currentWeek: { date: Date; dateStr: string }[] = [];
    const endDate = new Date(today);

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      currentWeek.push({ date: new Date(d), dateStr });

      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    const totalActivities = activities.reduce((sum, a) => sum + a.count, 0);

    return { weeks, activityMap, totalActivities, currentStreak, longestStreak };
  }, [activities]);

  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
  };

  const intensityColors = [
    "bg-[#161b22]", // 0 - no activity
    "bg-[#0e4429]", // 1 - low
    "bg-[#006d32]", // 2 - medium-low
    "bg-[#26a641]", // 3 - medium-high
    "bg-[#39d353]", // 4 - high
  ];

  const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  // Get month labels for the weeks
  const monthLabels = useMemo(() => {
    const labels: { month: string; position: number }[] = [];
    let lastMonth = -1;

    weeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = firstDay.date.getMonth();
        if (month !== lastMonth) {
          labels.push({ month: months[month], position: weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [weeks]);

  return (
    <div className={cn("", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#e6edf3]">수련 기록</h3>
          <span className="text-xs text-[#8b949e]">최근 15주</span>
        </div>
        <div className="flex items-center gap-4 text-xs text-[#8b949e]">
          <span>총 <span className="text-[#e6edf3] font-semibold">{totalActivities}</span>회</span>
          <span>연속 <span className="text-[#3fb950] font-semibold">{currentStreak}</span>일</span>
        </div>
      </div>

      {/* Heatmap */}
      <div className="overflow-x-auto pb-2">
        <div className="inline-block">
          {/* Month labels */}
          <div className="flex text-[10px] text-[#8b949e] mb-1 ml-7">
            {monthLabels.map(({ month, position }, i) => (
              <span
                key={i}
                className="absolute"
                style={{ marginLeft: `${position * 13}px` }}
              >
                {month}
              </span>
            ))}
          </div>

          <div className="flex gap-[3px] mt-4">
            {/* Day labels */}
            <div className="flex flex-col gap-[3px] mr-1 text-[10px] text-[#8b949e]">
              {days.map((day, i) => (
                <div key={i} className="h-[11px] leading-[11px]">
                  {i % 2 === 1 ? day : ""}
                </div>
              ))}
            </div>

            {/* Weeks */}
            {weeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex flex-col gap-[3px]">
                {week.map(({ dateStr }, dayIndex) => {
                  const count = activityMap.get(dateStr) || 0;
                  const intensity = getIntensity(count);
                  const date = new Date(dateStr);
                  const isToday = dateStr === new Date().toISOString().split('T')[0];

                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        "w-[11px] h-[11px] rounded-sm transition-all",
                        intensityColors[intensity],
                        isToday && "ring-1 ring-[#f0b429]",
                        count > 0 && "hover:ring-1 hover:ring-[#8b949e]"
                      )}
                      title={`${date.getMonth() + 1}월 ${date.getDate()}일: ${count}회 활동`}
                    />
                  );
                })}
                {/* Fill empty days at the end */}
                {week.length < 7 && Array(7 - week.length).fill(null).map((_, i) => (
                  <div key={`empty-${i}`} className="w-[11px] h-[11px]" />
                ))}
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex items-center justify-end gap-1 mt-3 text-[10px] text-[#8b949e]">
            <span>적음</span>
            {intensityColors.map((color, i) => (
              <div key={i} className={cn("w-[11px] h-[11px] rounded-sm", color)} />
            ))}
            <span>많음</span>
          </div>
        </div>
      </div>
    </div>
  );
}
