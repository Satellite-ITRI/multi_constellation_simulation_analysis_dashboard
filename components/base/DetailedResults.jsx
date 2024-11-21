import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function DetailedResults({ data }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Detailed Simulation Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* 平均吞吐量 */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Average Throughput
              </p>
              <p className="text-2xl font-semibold">
                {data.averageThroughput}%
              </p>
            </div>

            {/* 平均延遲 */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Average Latency</p>
              <p className="text-2xl font-semibold">{data.averageLatency} ms</p>
            </div>

            {/* 封包遺失率 */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Packet Loss Rate</p>
              <p className="text-2xl font-semibold">{data.packetLoss}%</p>
            </div>

            {/* 切換成功率 */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Handover Success Rate
              </p>
              <p className="text-2xl font-semibold">{data.handoverSuccess}%</p>
            </div>

            {/* 覆蓋區域 */}
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Coverage Area</p>
              <p className="text-2xl font-semibold">{data.coverageArea}%</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
