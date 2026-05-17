'use client';

import { Card } from '@/components/ui/Card';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, LineChart, Line 
} from 'recharts';

export default function AnalyticsCharts() {
  const data = [
    { name: 'Jan', value: 400 },
    { name: 'Feb', value: 300 },
    { name: 'Mar', value: 600 },
    { name: 'Apr', value: 800 },
    { name: 'May', value: 500 },
    { name: 'Jun', value: 900 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-md rounded-[2.5rem] border border-[var(--color-border)] shadow-2xl">
        <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-8">User Engagement</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120,120,120,0.1)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-bg-card)', 
                  borderColor: 'var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-text-primary)'
                }} 
              />
              <Bar dataKey="value" fill="var(--color-primary)" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card className="p-8 bg-[var(--color-bg-card)]/60 backdrop-blur-md rounded-[2.5rem] border border-[var(--color-border)] shadow-2xl">
        <h3 className="font-black text-xl text-[var(--color-text-primary)] mb-8">System Performance</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(120,120,120,0.1)" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: 'var(--color-text-secondary)', fontSize: 12 }} />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'var(--color-bg-card)', 
                  borderColor: 'var(--color-border)',
                  borderRadius: '12px',
                  color: 'var(--color-text-primary)'
                }} 
              />
              <Line type="monotone" dataKey="value" stroke="var(--color-primary)" strokeWidth={4} dot={{ r: 6, fill: 'var(--color-primary)', strokeWidth: 0 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
