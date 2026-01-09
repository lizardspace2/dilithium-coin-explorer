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

            // 1. Prepare Last 7 Days structure (Keys)
            const daysMap: Record<string, number> = {};
            const dayKeys: string[] = [];

            for (let i = 6; i >= 0; i--) {
                const d = new Date();
                d.setDate(d.getDate() - i);
                const dateStr = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                daysMap[dateStr] = 0; // Initialize with 0
                dayKeys.push(dateStr);
            }

            // 2. Filter and Aggregate Blocks
            // Calculate timestamp for 7 days ago (roughly) to filter out very old blocks (optimization)
            // But strict filtering happens via the date string match
            const sevenDaysAgoSeconds = Math.floor(Date.now() / 1000) - (7 * 24 * 60 * 60);

            blocks.forEach(block => {
                if (block.timestamp < sevenDaysAgoSeconds) return;

                const dateStr = new Date(block.timestamp * 1000).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
                // Only count if it falls within our generated last 7 days (handles edge cases)
                if (daysMap[dateStr] !== undefined) {
                    daysMap[dateStr] += block.transaction_count;
                }
            });

            // 3. Map to Chart Data
            const chartData = dayKeys.map(date => ({
                date,
                count: daysMap[date]
            }));

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
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                        <XAxis
                            dataKey="date"
                            stroke="#4b5563"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#4b5563"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: 'rgba(5, 5, 8, 0.9)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
                                backdropFilter: 'blur(8px)'
                            }}
                            itemStyle={{ color: '#00f3ff' }}
                            labelStyle={{ color: '#9ca3af', marginBottom: '4px', fontSize: '12px' }}
                            cursor={{ stroke: 'rgba(0, 243, 255, 0.2)', strokeWidth: 2 }}
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
