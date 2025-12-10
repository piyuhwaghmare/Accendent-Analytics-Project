
import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { EnvironmentalAnalysis } from '../../types';

interface EnvironmentalRadarProps {
  data: EnvironmentalAnalysis;
}

const EnvironmentalRadar: React.FC<EnvironmentalRadarProps> = ({ data }) => {
  // Normalize data for the chart (0-100 scale where 100 is high risk)
  
  // Friction: 0.1 (Ice) is high risk, 0.9 (Dry) is low risk. 
  // Formula: (1 - coefficient) * 100
  const frictionRisk = Math.min(100, Math.max(0, (0.9 - data.roadFrictionCoefficient) * 125)); 
  
  // Visibility: 0ft is high risk, 1000ft+ is low risk.
  const visibilityRisk = Math.min(100, Math.max(0, (1000 - data.visibilityDistance) / 10));

  // Hydroplaning: If threshold is low (e.g. 45mph), risk is high. 
  // Base 65mph as standard highway speed.
  const hydroRisk = data.hydroplaningThresholdSpeed 
    ? Math.min(100, Math.max(0, (75 - data.hydroplaningThresholdSpeed) * 2.5))
    : 0;

  const chartData = [
    { subject: 'Friction Loss', A: frictionRisk, fullMark: 100 },
    { subject: 'Visibility Impairment', A: visibilityRisk, fullMark: 100 },
    { subject: 'Hydroplaning Potential', A: hydroRisk, fullMark: 100 },
    { subject: 'Light Deficiency', A: data.lightCondition.includes('Night') ? 80 : 20, fullMark: 100 },
    { subject: 'Severity Contribution', A: data.weatherContributionPercentage, fullMark: 100 },
  ];

  return (
    <div className="w-full h-64 bg-slate-950 border border-slate-800 rounded-lg p-2 relative">
      <div className="absolute top-2 left-2 text-xs font-mono text-slate-500">FIG 3.0 - ENV RISK PROFILE</div>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
          <PolarGrid stroke="#334155" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Risk Level"
            dataKey="A"
            stroke="#ef4444"
            strokeWidth={2}
            fill="#ef4444"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f1f5f9' }}
            itemStyle={{ color: '#ef4444' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EnvironmentalRadar;
