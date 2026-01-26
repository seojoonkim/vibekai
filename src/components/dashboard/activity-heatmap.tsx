"use client";

import { useMemo, useState, useEffect, useRef } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [visibleWeeks, setVisibleWeeks] = useState(53); // Default to full year

  // Format date helper
  const formatDate = (d: Date) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Calculate how many weeks can fit based on container width
  useEffect(() => {
    const updateVisibleWeeks = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const dayLabelWidth = 24; // Width for day labels (일,월,화...)
        const cellSize = 13; // Cell width + gap (11px + 2px)
        const availableWidth = containerWidth - dayLabelWidth - 8; // padding
        const maxWeeks = Math.floor(availableWidth / cellSize);
        // Clamp between 12 weeks (minimum) and 53 weeks (full year)
        setVisibleWeeks(Math.min(53, Math.max(12, maxWeeks)));
      }
    };

    updateVisibleWeeks();
    window.addEventListener('resize', updateVisibleWeeks);
    return () => window.removeEventListener('resize', updateVisibleWeeks);
  }, []);

  const { weeks, activityMap, totalActivities, totalDays, currentStreak } = useMemo(() => {
    const now = new Date();
    // Get today in KST to match the server-side date format
    const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
    const todayStr = kstNow.toISOString().split('T')[0];
    // Parse back for date calculations
    const [y, m, d] = todayStr.split('-').map(Number);
    const today = new Date(y, m - 1, d);

    const activityMap = new Map<string, number>();

    // Build activity map
    activities.forEach(({ date, count }) => {
      activityMap.set(date, (activityMap.get(date) || 0) + count);
    });

    // Calculate current streak
    let currentStreak = 0;
    const todayStrForStreak = formatDate(today);
    const hasActivityToday = activityMap.has(todayStrForStreak) && activityMap.get(todayStrForStreak)! > 0;

    if (hasActivityToday) {
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

    // Generate full 53 weeks of data
    const weeksCount = 53;
    const weeks: { date: Date; dateStr: string }[][] = [];
    const endDate = new Date(today);
    const startDate = new Date(today);
    startDate.setDate(today.getDate() - (weeksCount * 7) + (6 - today.getDay()) + 1);

    let currentWeek: { date: Date; dateStr: string }[] = [];
    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      const dateStr = formatDate(d);
      currentWeek.push({ date: new Date(d), dateStr });
      if (d.getDay() === 6) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    if (currentWeek.length > 0) {
      weeks.push(currentWeek);
    }

    const totalActivities = activities.reduce((sum, a) => sum + a.count, 0);
    const totalDays = activities.filter(a => a.count > 0).length;

    return { weeks, activityMap, totalActivities, totalDays, currentStreak };
  }, [activities]);

  // Get only the visible weeks (most recent)
  const displayWeeks = useMemo(() => {
    return weeks.slice(-visibleWeeks);
  }, [weeks, visibleWeeks]);

  const getIntensity = (count: number) => {
    if (count === 0) return 0;
    if (count === 1) return 1;
    if (count <= 3) return 2;
    if (count <= 5) return 3;
    return 4;
  };

  const intensityColors = [
    "bg-[#161b22] border border-[#21262d]",
    "bg-[#0e4429] border border-[#0e4429]",
    "bg-[#006d32] border border-[#006d32]",
    "bg-[#26a641] border border-[#26a641]",
    "bg-[#39d353] border border-[#39d353]",
  ];

  const months = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
  const days = ["일", "월", "화", "수", "목", "금", "토"];

  // Get month labels for visible weeks only
  const monthLabels = useMemo(() => {
    const labels: { month: string; weekIndex: number }[] = [];
    let lastMonth = -1;

    displayWeeks.forEach((week, weekIndex) => {
      const firstDay = week[0];
      if (firstDay) {
        const month = firstDay.date.getMonth();
        if (month !== lastMonth) {
          labels.push({ month: months[month], weekIndex });
          lastMonth = month;
        }
      }
    });

    return labels;
  }, [displayWeeks]);

  // Get today in KST to match server-side dates
  const now = new Date();
  const kstNow = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const todayStr = kstNow.toISOString().split('T')[0];

  return (
    <div ref={containerRef} className={cn("w-full", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div className="flex flex-wrap items-center gap-x-1 gap-y-1">
          <span className="text-sm font-medium text-[#e6edf3]">
            지난 1년간
          </span>
          <span className="text-sm font-medium">
            <span className="text-[#58a6ff] font-bold">{totalDays}</span>
            <span className="text-[#e6edf3]">일 방문,</span>
          </span>
          <span className="text-sm font-medium">
            <span className="text-[#3fb950] font-bold">{totalActivities}</span>
            <span className="text-[#e6edf3]">회 수련</span>
          </span>
        </div>
        {currentStreak > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 bg-[#238636]/20 rounded-md border border-[#238636]/30 shrink-0">
            <span className="text-xs text-[#3fb950] font-medium">🔥 {currentStreak}일 연속</span>
          </div>
        )}
      </div>

      {/* Heatmap Grid - Responsive, no scroll */}
      <div className="w-full">
        {/* Month labels */}
        <div className="flex mb-1 pl-5">
          {monthLabels.map(({ month, weekIndex }, i) => {
            // Calculate position based on week index
            const nextLabelIndex = monthLabels[i + 1]?.weekIndex ?? displayWeeks.length;
            const span = nextLabelIndex - weekIndex;
            return (
              <div
                key={i}
                className="text-[10px] text-[#8b949e] shrink-0"
                style={{ width: `${span * 13}px` }}
              >
                {span >= 3 ? month : ''}
              </div>
            );
          })}
        </div>

        {/* Grid */}
        <div className="flex">
          {/* Day labels */}
          <div className="flex flex-col gap-[2px] mr-1.5 shrink-0" style={{ width: '20px' }}>
            {days.map((day, i) => (
              <div
                key={i}
                className="h-[11px] text-[9px] text-[#8b949e] leading-[11px] text-right"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Weeks - flex grow to fill space */}
          <div className="flex-1 flex gap-[2px]">
            {displayWeeks.map((week, weekIndex) => (
              <div key={weekIndex} className="flex-1 flex flex-col gap-[2px]" style={{ maxWidth: '13px' }}>
                {/* Empty days at start */}
                {weekIndex === 0 && week[0] && Array(week[0].date.getDay()).fill(null).map((_, i) => (
                  <div key={`empty-start-${i}`} className="w-full aspect-square max-w-[11px] max-h-[11px]" />
                ))}

                {week.map(({ dateStr, date }, dayIndex) => {
                  const count = activityMap.get(dateStr) || 0;
                  const intensity = getIntensity(count);
                  const isToday = dateStr === todayStr;

                  return (
                    <div
                      key={dayIndex}
                      className={cn(
                        "w-full aspect-square max-w-[11px] max-h-[11px] rounded-[2px]",
                        intensityColors[intensity],
                        isToday && "ring-1 ring-[#e6edf3] ring-offset-0",
                        "hover:ring-1 hover:ring-[#8b949e] cursor-pointer transition-all"
                      )}
                      title={`${date.getMonth() + 1}월 ${date.getDate()}일: ${count}회 수련`}
                    />
                  );
                })}

                {/* Empty days at end */}
                {weekIndex === displayWeeks.length - 1 && week.length > 0 && Array(6 - week[week.length - 1].date.getDay()).fill(null).map((_, i) => (
                  <div key={`empty-end-${i}`} className="w-full aspect-square max-w-[11px] max-h-[11px]" />
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-3 text-[10px] text-[#8b949e]">
          <span className="text-[#6e7681]">
            💡 수련 = 로그인, 수강 완료, 글쓰기, 답글 (좋아요 제외)
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <span>적음</span>
            {intensityColors.map((color, i) => (
              <div
                key={i}
                className={cn("w-[11px] h-[11px] rounded-[2px]", color)}
              />
            ))}
            <span>많음</span>
          </div>
        </div>
      </div>
    </div>
  );
}
