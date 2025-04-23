'use client';
import { TrendingUp } from 'lucide-react';
import {
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer
} from 'recharts';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';

const chartConfig = {
  throughput: {
    label: 'Throughput',
    color: 'red'
  },
  latency: {
    label: 'Latency',
    color: 'green'
  }
};

/**
 * StrategyMetricsChart 元件
 * 顯示網路策略的吞吐量與延遲指標，並計算趨勢。
 * @param data 要顯示的指標資料陣列
 */
export function StrategyMetricsChart({ data }) {
  // 計算吞吐量趨勢百分比
  const lastTwo = data.slice(-2);
  const trend = (
    ((lastTwo[1].throughput - lastTwo[0].throughput) / lastTwo[0].throughput) *
    100
  ).toFixed(1);
  const isPositive = trend > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Network Metrics</CardTitle>
        <CardDescription>Throughput and Latency Indicators</CardDescription>
      </CardHeader>
      <CardContent>
        {/* 使用 Recharts 畫出吞吐量與延遲折線圖 */}
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis
              yAxisId="left"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 100]}
              orientation="left"
            />
            <YAxis
              yAxisId="right"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              domain={[0, 50]}
              orientation="right"
            />
            {/* 吞吐量折線 */}
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="throughput"
              stroke={chartConfig.throughput.color}
              strokeWidth={2}
              dot={false}
            />
            {/* 延遲折線 */}
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="latency"
              stroke={chartConfig.latency.color}
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex items-center gap-2 font-medium leading-none">
          <span>
            Throughput {isPositive ? 'up' : 'down'} by {Math.abs(trend)}%
          </span>
          <TrendingUp className={`h-4 w-4 ${!isPositive && 'rotate-180'}`} />
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3"
              style={{ backgroundColor: chartConfig.throughput.color }}
            />
            <span>Throughput</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className="h-3 w-3"
              style={{ backgroundColor: chartConfig.latency.color }}
            />
            <span>Latency</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
