import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Label } from 'recharts';

interface RadialScoreProps {
  score: number;
  label: string;
  color?: string;
}

const RadialScore: React.FC<RadialScoreProps> = ({ score, label, color = "#2563eb" }) => {
  const data = [
    { name: 'Score', value: score },
    { name: 'Rest', value: 100 - score },
  ];

  // Determine color based on score if not overridden
  const getScoreColor = (val: number) => {
    if (val >= 80) return '#16a34a'; // green-600
    if (val >= 60) return '#ea580c'; // orange-600
    return '#dc2626'; // red-600
  };

  const finalColor = score ? getScoreColor(score) : color;

  return (
    <div className="flex flex-col items-center justify-center h-48 w-full">
      <div className="h-40 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              startAngle={180}
              endAngle={0}
              paddingAngle={0}
              dataKey="value"
            >
              <Cell key="score" fill={finalColor} cornerRadius={10} />
              <Cell key="rest" fill="#e2e8f0" />
              <Label
                value={`${score}%`}
                position="center"
                className="text-3xl font-bold fill-slate-800"
                dy={-10}
              />
              <Label
                value="ATS Score"
                position="center"
                className="text-sm font-medium fill-slate-500"
                dy={15}
              />
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </div>
      <p className="text-slate-600 font-medium -mt-4">{label}</p>
    </div>
  );
};

export default RadialScore;
