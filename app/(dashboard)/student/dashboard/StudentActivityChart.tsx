'use client';

import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

interface ActivityPoint {
  name: string;
  hours: number;
}

export default function StudentActivityChart({ chartData }: { chartData: ActivityPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={chartData}>
        <defs>
          <linearGradient id="colorHours" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.2}/>
            <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0}/>
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="6 6" vertical={false} stroke="var(--color-border)" />
        <XAxis 
          dataKey="name" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 700 }}
          dy={15}
        />
        <YAxis 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: 'var(--color-text-secondary)', fontSize: 10, fontWeight: 700 }}
        />
        <Tooltip 
          contentStyle={{ 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--color-border)', 
            backgroundColor: 'var(--color-bg-card)',
            color: 'var(--color-text-primary)',
            boxShadow: 'var(--shadow-lg)',
            padding: '12px'
          }}
          itemStyle={{ fontWeight: 800, fontSize: '12px' }}
          labelStyle={{ fontWeight: 800, fontSize: '10px', textTransform: 'uppercase', marginBottom: '4px', opacity: 0.6 }}
        />
        <Area 
          type="monotone" 
          dataKey="hours" 
          stroke="var(--color-primary)" 
          strokeWidth={4}
          fillOpacity={1} 
          fill="url(#colorHours)" 
          animationDuration={2000}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
