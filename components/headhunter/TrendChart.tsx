"use client";

import { ResponsiveContainer, LineChart, XAxis, YAxis, Tooltip, Line, CartesianGrid } from "recharts";

interface ReviewPoint {
  date: string;
  rating: number;
}

interface Props {
  reviews: ReviewPoint[];
}

export default function RatingTrendChart({ reviews }: Props) {
  if (reviews.length < 3) {
    return (
      <div className="flex items-center justify-center h-[280px] text-center">
        <p className="text-sm text-[var(--muted)]">
          리뷰가 더 쌓이면 추이를 확인할 수 있습니다
        </p>
      </div>
    );
  }

  // 최근 10개, 오래된순 정렬
  const sorted = [...reviews]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-10);

  const data = sorted.map((r) => {
    const d = new Date(r.date);
    return {
      label: `${d.getFullYear()}.${d.getMonth() + 1}`,
      rating: r.rating,
    };
  });

  return (
    <div className="w-full h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--card-border)" />
          <XAxis
            dataKey="label"
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--card-border)" }}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fill: "var(--muted)", fontSize: 11 }}
            axisLine={{ stroke: "var(--card-border)" }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: "8px",
              fontSize: "12px",
            }}
            formatter={(value) => [Number(value).toFixed(1), "종합 평점"]}
          />
          <Line
            type="monotone"
            dataKey="rating"
            stroke="#2563EB"
            strokeWidth={2}
            dot={{ r: 4, fill: "#2563EB", stroke: "#fff", strokeWidth: 2 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
