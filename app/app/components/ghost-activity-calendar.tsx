"use client";

import React from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";

type DayData = {
  date: string;
  wordCount: number;
  sessionCount: number;
};

/**
 * Transform raw daily stats into the format expected by react-activity-calendar.
 * Generates a full year of data (from today back 365 days), filling gaps with zeros.
 */
function transformActivityData(days: DayData[]) {
  const dayMap = new Map(days.map((d) => [d.date, d]));

  const today = new Date();
  const yearAgo = new Date();
  yearAgo.setFullYear(yearAgo.getFullYear() - 1);
  yearAgo.setDate(yearAgo.getDate() + 1); // Start one day after to get exactly 365 days

  // Find the max word count to compute levels
  let maxWords = 0;
  for (const d of days) {
    if (d.wordCount > maxWords) maxWords = d.wordCount;
  }

  const result: {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }[] = [];

  const current = new Date(yearAgo);
  while (current <= today) {
    const dateStr = current.toISOString().slice(0, 10);
    const entry = dayMap.get(dateStr);
    const count = entry?.wordCount ?? 0;

    let level: 0 | 1 | 2 | 3 | 4 = 0;
    if (count > 0 && maxWords > 0) {
      const ratio = count / maxWords;
      if (ratio > 0.75) level = 4;
      else if (ratio > 0.5) level = 3;
      else if (ratio > 0.25) level = 2;
      else level = 1;
    }

    result.push({ date: dateStr, count, level });
    current.setDate(current.getDate() + 1);
  }

  return result;
}

export function GhostActivityCalendar({ days }: { days: DayData[] }) {
  const data = transformActivityData(days);

  return (
    <div className="rounded-xl border border-border bg-white p-5">
      <p className="mb-4 text-sm font-medium text-ink">Activity</p>
      <div className="flex items-center justify-center overflow-x-auto">
        <ActivityCalendar
          data={data}
          colorScheme="light"
          weekStart={1}
          showWeekdayLabels
          showTotalCount
          blockSize={11}
          blockRadius={3}
          blockMargin={3}
          fontSize={11}
          theme={{
            light: ["#e8e8e8", "#d4c4ec", "#b399d4", "#8b63c2", "#6944AE"],
          }}
          renderBlock={(block, activity) =>
            React.cloneElement(block, {
              "data-tooltip-id": "ghost-activity-tooltip",
              "data-tooltip-content": `${activity.count.toLocaleString()} words on ${activity.date}`,
            })
          }
          labels={{
            months: [
              "Jan",
              "Feb",
              "Mar",
              "Apr",
              "May",
              "Jun",
              "Jul",
              "Aug",
              "Sep",
              "Oct",
              "Nov",
              "Dec",
            ],
            weekdays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            totalCount: "{{count}} words this year",
          }}
        />
        <Tooltip id="ghost-activity-tooltip" />
      </div>
    </div>
  );
}
