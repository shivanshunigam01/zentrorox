import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

type Props = { score: number; size?: number; label?: string };

const color = (s: number) => (s >= 70 ? "#10b981" : s >= 45 ? "#f59e0b" : "#ef4444");

export const ScoreRing = ({ score, size = 160, label = "Score" }: Props) => {
  const data = [
    { value: score },
    { value: 100 - score },
  ];
  const c = color(score);

  return (
    <div className="flex flex-col items-center">
      <div style={{ width: size, height: size }} className="relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius="70%"
              outerRadius="100%"
              startAngle={90}
              endAngle={-270}
              dataKey="value"
              stroke="none"
            >
              <Cell fill={c} />
              <Cell fill="hsl(var(--muted))" />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-extrabold" style={{ color: c }}>{score}</span>
          <span className="text-xs text-muted-foreground">/100</span>
        </div>
      </div>
      <span className="text-sm font-semibold mt-2 text-muted-foreground">{label}</span>
    </div>
  );
};

export const CategoryBarChart = ({ items }: { items: { label: string; score: number }[] }) => (
  <div className="space-y-3">
    {items.map((item) => (
      <div key={item.label}>
        <div className="flex justify-between text-xs mb-1">
          <span className="font-medium">{item.label}</span>
          <span className="text-muted-foreground">{item.score}/100</span>
        </div>
        <div className="h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${item.score}%`, backgroundColor: color(item.score) }}
          />
        </div>
      </div>
    ))}
  </div>
);
