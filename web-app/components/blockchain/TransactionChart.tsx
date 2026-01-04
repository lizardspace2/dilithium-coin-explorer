'use client';

import { useMemo, useState, useEffect } from 'react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts';
import { supabase } from '@/lib/supabase';
import { GlassCard } from '@/components/ui/GlassCard';

type ChartData = {
    date: string;
    count: number;
};

export function TransactionChart() {
    const [data, setData] = useState<ChartData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            // Fetch last 7 days of blocks approximately
            // Assuming 1 block per minute -> 60 * 24 * 7 = ~10000 blocks
            // Let's fetch last 2000 for now to keep it light
            const { data: blocks } = await supabase
                .from('blocks')
                .select('timestamp, transaction_count')
                .order('index', { ascending: false })
                .limit(2000);

            if (!blocks) {
                setLoading(false);
                return;
            }

            // Aggregate by Day
            const aggregated = blocks.reduce((acc, block) => {
                const date = new Date(block.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                acc[date] = (acc[date] || 0) + block.transaction_count;
                return acc;
            }, {} as Record<string, number>);

            // Convert to array and reverse to show oldest first
            const chartData = Object.entries(aggregated)
                .map(([date, count]) => ({ date, count }))
                .reverse();

            setData(chartData);
            setLoading(false);
        };

        fetchData();
    }, []);

    if (loading) return (
        <GlassCard className="h-[300px] flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neon-blue"></div>
        </GlassCard>
    );

    return (
        <GlassCard title="Transaction History (Last 7 Days)" className="h-[350px]">
            <div className="h-full w-full pt-4">
                <ResponsiveContainer width="100%" height="85%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                                <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#6b7280"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#00f3ff' }}
                            labelStyle={{ color: '#fff' }}
                        />
                        <Area
                            type="monotone"
                            dataKey="count"
                            stroke="#00f3ff"
                            strokeWidth={2}
                            fillOpacity={1}
                            fill="url(#colorCount)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </GlassCard>
    );
}
