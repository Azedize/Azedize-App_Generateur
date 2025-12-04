import React, { useEffect, useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { PasswordEntry, LanguageCode } from '../types';
import gsap from 'gsap';

interface Props {
  entries: PasswordEntry[];
  lang: LanguageCode;
}

import { translations } from '../services/i18nService';

const AuditDashboard: React.FC<Props> = ({ entries, lang }) => {
  const t = translations;
  const total = entries.length;
  const weak = entries.filter(e => (e.password?.length || 0) < 8).length;
  const reused = new Set(entries.map(e => e.password)).size !== total;
  const reusedCount = total - new Set(entries.map(e => e.password)).size;

  const dataStrength = [
    { name: 'Weak', value: weak },
    { name: 'Strong', value: total - weak },
  ];
  const COLORS = ['#ef4444', '#10b981'];

  const dataCat = [
      { name: 'Social', value: entries.filter(e => e.category === 'social').length },
      { name: 'Work', value: entries.filter(e => e.category === 'work').length },
      { name: 'Finance', value: entries.filter(e => e.category === 'finance').length },
      { name: 'Personal', value: entries.filter(e => e.category === 'personal').length },
  ];

  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardsRef.current) {
        gsap.fromTo(cardsRef.current.children, 
            { y: 20, opacity: 0 },
            { y: 0, opacity: 1, stagger: 0.1, duration: 0.4, ease: "power2.out" }
        );
    }
  }, []);

  if (total === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-10 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-2">{t.audit_no_data[lang]}</h2>
            <p className="text-muted-foreground">{t.audit_no_data_desc[lang]}</p>
        </div>
      );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto">
        <div className="mb-8">
            <h2 className="text-3xl font-bold tracking-tight text-foreground">{t.audit_title[lang]}</h2>
            <p className="text-muted-foreground">{t.audit_subtitle[lang]}</p>
        </div>
        
        <div ref={cardsRef} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <StatCard label={t.audit_total[lang]} value={total} delay={0} />
            <StatCard label={t.audit_weak[lang]} value={weak} color={weak > 0 ? "text-destructive" : "text-emerald-500"} delay={0.1} />
            <StatCard label={t.audit_reused[lang]} value={reusedCount} color={reusedCount > 0 ? "text-orange-500" : "text-emerald-500"} delay={0.2} />
            <StatCard label={t.audit_score[lang]} value={`${Math.round(((total - weak)/total) * 100)}%`} color="text-primary" delay={0.3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border h-96">
                <h3 className="font-bold mb-6 text-lg">{t.audit_dist[lang]}</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <PieChart>
                        <Pie 
                            data={dataStrength} 
                            innerRadius={80} 
                            outerRadius={110} 
                            paddingAngle={5} 
                            dataKey="value" 
                            stroke="none"
                            startAngle={90}
                            endAngle={-270}
                        >
                            {dataStrength.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', background: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }} 
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border h-96">
                <h3 className="font-bold mb-6 text-lg">{t.audit_cats[lang]}</h3>
                <ResponsiveContainer width="100%" height="85%">
                    <BarChart data={dataCat}>
                        <XAxis dataKey="name" fontSize={12} stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                        <YAxis stroke="hsl(var(--muted-foreground))" tickLine={false} axisLine={false} />
                        <Tooltip 
                            cursor={{fill: 'hsl(var(--muted))'}} 
                            contentStyle={{ borderRadius: '12px', border: 'none', background: 'hsl(var(--popover))', color: 'hsl(var(--popover-foreground))', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            itemStyle={{ color: 'hsl(var(--foreground))' }}
                        />
                        <Bar dataKey="value" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} barSize={40} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    </div>
  );
};

const StatCard = ({ label, value, color, delay }: any) => (
    <div className="bg-card text-card-foreground p-6 rounded-xl shadow-sm border border-border flex flex-col justify-center">
        <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">{label}</h3>
        <p className={`text-3xl font-bold mt-2 ${color || 'text-foreground'}`}>{value}</p>
    </div>
);

export default AuditDashboard;