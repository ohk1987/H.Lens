"use client";

import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import type { Ratings } from "@/lib/types";
import { RATING_LABELS } from "@/lib/review-constants";

interface Props {
  ratings: Ratings;
}

export default function RatingRadarChart({ ratings }: Props) {
  const data = (Object.keys(RATING_LABELS) as (keyof Ratings)[]).map((key) => ({
    subject: RATING_LABELS[key],
    value: ratings[key],
    fullMark: 5,
  }));

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid stroke="var(--card-border)" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fill: "var(--muted)", fontSize: 12 }}
          />
          <Radar
            name="평점"
            dataKey="value"
            stroke="#2563EB"
            fill="#2563EB"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
