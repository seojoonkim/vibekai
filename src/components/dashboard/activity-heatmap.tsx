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
  // Format date helper - defined outside useMemo to use in component
  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const { weeks, activityMap, totalActivities, currentStreak } = useMemo(() => {
    // Use local date to avoid timezone issues
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const activityMap = new Map<string, number>();

    // Build activity map - aggregate by date
    activities.forEach(({ date, count }) => {
      activityMap.set(date, (activityMap.get(date) || 0) + count);
    });

    // Calculate current streak
    let currentStreak = 0;
    const todayStr = formatDate(today);

    // Check if there's activity today
    const hasActivityToday = activityMap.has(todayStr) && activityMap.get(todayStr)! > 0;

    // If no activity today, check if yesterday had activity to continue streak
    // Otherwise streak is broken
    if (hasActivityToday) {
      // Count from today backwards
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = formatDate(checkDate);

        if (activityMap.has(dateStr) && activityMap.get(dateStr)! > 0) {
          currentStreak++;
        } else {
          break;
        }
      }
    } else {
      // Check from yesterday - if yesterday has activity, show that streak
      // but add a note that today is not yet counted
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const yesterdayStr = formatDate(yesterday);

      if (activityMap.has(yesterdayStr) && activityMap.get(yesterdayStr)! > 0) {
        for (let i = 1; i < 365; i++) {
          const checkDate = new Date(today);
          checkDate.setDate(today.getDate() - i);
          const dateStr = formatDate(checkDate);

          if (activityMap.has(dateStr) && activityMap.get(dateStr)! > 0) {
            currentStreak++;
          } else {
            break;
          }
        }
      }
    }

    // Generate weeks array (52 weeks like GitHub)
    const weeksCount = 53;
    const weeks: { date: Date; dateStr: string }[][] = [];

    // Start from Sunday of the week containing the date ~1 year ago
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (weeksCount * 7) + (6 - today.getDay()) + 1);

    let currentWeek: { date: Date; dateStr: string }[] = [];

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDate(d);
      currentWeek.push({ date: new Date(d), dateStr });

      if (d.getDay() === 6) { // Saturday = end of week
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    const totalActivities = activities.reduce((sum, a) => sum + a.count, 0);

    return { weeks, activityMap, totalActivities, currentStreak };
  }, [activities]);

  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
  };

  // GitHub exact colors with border for grid effect
  const intensityColors = [
    "bg-[#161b22] border border-[#21262d]", // 0 - no activity (with subtle grid)
    "bg-[#0e4429] border border-[#0e4429]", // 1 - low
    "bg-[#006d32] border border-[#006d32]", // 2 - medium-low
    "bg-[#26a641] border border-[#26a641]", // 3 - medium-high
    "bg-[#39d353] border border-[#39d353]", // 4 - high
  ];

  const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  // Get month labels for the weeks
  const monthLabels = useMemo(() => {
    const labels: { month: string; colStart: number; colSpan: number }[] = [];
    let lastMonth = -1;
    let lastMonthStart = 0;

    weeks.forEach((week, weekIndex) => {
      const firstDay = week.find(d => {
        const month = d.date.getMonth();
        return month !== lastMonth;
      }) || week[0];

      if (firstDay) {
        const month = firstDay.date.getMonth();
        if (month !== lastMonth) {
          if (lastMonth !== -1) {
            labels[labels.length - 1].colSpan = weekIndex - lastMonthStart;
          }
          labels.push({ month: months[month], colStart: weekIndex, colSpan: 1 });
          lastMonth = month;
          lastMonthStart = weekIndex;
        }
      }
    });

    if (labels.length > 0) {
      labels[labels.length - 1].colSpan = weeks.length - lastMonthStart;
    }

    return labels;
  }, [weeks]);

  const now = new Date();
  const todayStr = formatDate(new Date(now.getFullYear(), now.getMonth(), now.getDate()));

  return (
    <div className={cn("", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#e6edf3]">
            지난 1년간 <span className="text-[#3fb950] font-bold">{totalActivities}</span>회 수련
          </span>
        </div>
        {currentStreak > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#238636]/20 rounded-md border border-[#238636]/30">
            <span className="text-xs text-[#3fb950] font-medium">🔥 {currentStreak}일 연속</span>
          </div>
        )}
      </div>

      {/* Heatmap Container */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          {/* Month labels row */}
          <div className="flex mb-1" style={{ paddingLeft: '28px' }}>
            {monthLabels.map(({ month, colSpan }, i) => (
              <div
                key={i}
                className="text-[10px] text-[#8b949e]"
                style={{
                  width: `${colSpan * 13}px`,
                  flexShrink: 0,
                }}
              >
                {colSpan >= 3 && month}
              </div>
            ))}
          </div>

          {/* Grid container */}
          <div className="flex">
            {/* Day labels column - all 7 days */}
            <div className="flex flex-col gap-[2px] mr-1 pt-0" style={{ width: '24px' }}>
              {days.map((day, i) => (
                <div
                  key={i}
                  className="h-[10px] text-[9px] text-[#8b949e] leading-[10px] text-right pr-1"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Weeks grid */}
            <div className="flex gap-[2px]">
              {weeks.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col gap-[2px]">
                  {/* Fill empty days at the start of first week */}
                  {weekIndex === 0 && week[0] && Array(week[0].date.getDay()).fill(null).map((_, i) => (
                    <div key={`empty-start-${i}`} className="w-[10px] h-[10px]" />
                  ))}

                  {week.map(({ dateStr, date }, dayIndex) => {
                    const count = activityMap.get(dateStr) || 0;
                    const intensity = getIntensity(count);
                    const isToday = dateStr === todayStr;

                    return (
                      <div
                        key={dayIndex}
                        className={cn(
                          "w-[10px] h-[10px] rounded-[2px]",
                          intensityColors[intensity],
                          isToday && "ring-1 ring-[#e6edf3] ring-offset-0",
                          "hover:ring-1 hover:ring-[#8b949e] cursor-pointer transition-all"
                        )}
                        title={`${date.getMonth() + 1}월 ${date.getDate()}일: ${count}회 수련`}
                      />
                    );
                  })}

                  {/* Fill empty days at the end of last week */}
                  {weekIndex === weeks.length - 1 && week.length > 0 && Array(6 - week[week.length - 1].date.getDay()).fill(null).map((_, i) => (
                    <div key={`empty-end-${i}`} className="w-[10px] h-[10px]" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-between mt-3 text-[10px] text-[#8b949e]">
            <div className="flex items-center gap-3">
              <span className="text-[#6e7681]">기준: 1회=연함, 2-3회=보통, 4-5회=진함, 6회+=최고</span>
            </div>
            <div className="flex items-center gap-1">
              <span>적음</span>
              {intensityColors.map((color, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-[10px] h-[10px] rounded-[2px]",
                    color
                  )}
                />
              ))}
              <span>많음</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
