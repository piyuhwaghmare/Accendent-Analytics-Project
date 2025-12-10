import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';

const data = [
  { time: -3.0, speedA: 44, speedB: 35 },
  { time: -2.5, speedA: 44, speedB: 35 },
  { time: -2.0, speedA: 43, speedB: 35 },
  { time: -1.5, speedA: 43, speedB: 34 },
  { time: -1.0, speedA: 42, speedB: 34 },
  { time: -0.5, speedA: 41, speedB: 28 },
  { time: 0.0, speedA: 0, speedB: 0 }, // Impact
  { time: 0.5, speedA: 0, speedB: 0 },
];

const SpeedProfileChart: React.FC = () => {
  return (
    <div className="h-64 w-full bg-slate-900 p-4 rounded-lg border border-slate-700">
      <h3 className="text-xs font-mono text-slate-400 mb-2">FIG 1.2 - VELOCITY PROFILE (T-3s to IMPACT)</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis 
            dataKey="time" 
            label={{ value: 'Time (s)', position: 'insideBottomRight', offset: 0, fill: '#94a3b8' }} 
            stroke="#94a3b8"
          />
          <YAxis 
            label={{ value: 'Speed (mph)', angle: -90, position: 'insideLeft', fill: '#94a3b8' }} 
            stroke="#94a3b8"
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ fontFamily: 'monospace' }}
          />
          <Legend wrapperStyle={{ fontFamily: 'sans-serif', fontSize: '12px' }} />
          <ReferenceLine x={0} stroke="#f97316" label="IMPACT" />
          <Line type="monotone" dataKey="speedA" name="Vehicle A (Def)" stroke="#ef4444" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="speedB" name="Vehicle B (Plt)" stroke="#3b82f6" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpeedProfileChart;