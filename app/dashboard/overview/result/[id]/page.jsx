// app/experiment-results/[id]/page.jsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { SatelliteConnectionChart } from '@/components/base/SatelliteConnectionChart';
import { TaiwanCellMap } from '@/components/base/TaiwanCellMap';
import { StrategyMetricsChart } from '@/components/base/StrategyMetricsChart';
import { DetailedResults } from '@/components/base/DetailedResults';
const MOCK_RESULTS = {
  1: {
    ideal: {
      satelliteData: [
        { time: '00:00', connection: 95 },
        { time: '04:00', connection: 98 },
        { time: '08:00', connection: 97 },
        { time: '12:00', connection: 99 },
        { time: '16:00', connection: 96 },
        { time: '20:00', connection: 97 }
      ],
      cellData: [
        { lat: 25.033, lng: 121.5654, strength: 0.9 }, // 台北
        { lat: 24.1477, lng: 120.6736, strength: 0.85 }, // 台中
        { lat: 22.9998, lng: 120.2268, strength: 0.88 }, // 台南
        { lat: 22.6273, lng: 120.3014, strength: 0.92 } // 高雄
      ],
      metricsData: [
        { timestamp: '00:00', throughput: 95, latency: 20 },
        { timestamp: '04:00', throughput: 98, latency: 18 },
        { timestamp: '08:00', throughput: 97, latency: 19 },
        { timestamp: '12:00', throughput: 99, latency: 17 },
        { timestamp: '16:00', throughput: 96, latency: 21 },
        { timestamp: '20:00', throughput: 97, latency: 20 }
      ],
      detailedData: {
        averageThroughput: 97,
        averageLatency: 19,
        packetLoss: 0.1,
        handoverSuccess: 99.9,
        coverageArea: 98.5
      }
    },
    actual: {
      satelliteData: [
        { time: '00:00', connection: 92 },
        { time: '04:00', connection: 94 },
        { time: '08:00', connection: 91 },
        { time: '12:00', connection: 95 },
        { time: '16:00', connection: 93 },
        { time: '20:00', connection: 92 }
      ],
      cellData: [
        { lat: 25.033, lng: 121.5654, strength: 0.85 }, // 台北
        { lat: 24.1477, lng: 120.6736, strength: 0.82 }, // 台中
        { lat: 22.9998, lng: 120.2268, strength: 0.84 }, // 台南
        { lat: 22.6273, lng: 120.3014, strength: 0.87 } // 高雄
      ],
      metricsData: [
        { timestamp: '00:00', throughput: 92, latency: 25 },
        { timestamp: '04:00', throughput: 94, latency: 23 },
        { timestamp: '08:00', throughput: 91, latency: 24 },
        { timestamp: '12:00', throughput: 95, latency: 22 },
        { timestamp: '16:00', throughput: 93, latency: 26 },
        { timestamp: '20:00', throughput: 92, latency: 25 }
      ],
      detailedData: {
        averageThroughput: 92.8,
        averageLatency: 24.2,
        packetLoss: 0.3,
        handoverSuccess: 98.5,
        coverageArea: 96.2
      }
    }
  },
  2: {
    ideal: {
      satelliteData: [
        { time: '00:00', connection: 96 },
        { time: '04:00', connection: 97 },
        { time: '08:00', connection: 98 },
        { time: '12:00', connection: 99 },
        { time: '16:00', connection: 97 },
        { time: '20:00', connection: 98 }
      ],
      cellData: [
        { lat: 25.033, lng: 121.5654, strength: 0.92 },
        { lat: 24.1477, lng: 120.6736, strength: 0.88 },
        { lat: 22.9998, lng: 120.2268, strength: 0.9 },
        { lat: 22.6273, lng: 120.3014, strength: 0.94 }
      ],
      metricsData: [
        { timestamp: '00:00', throughput: 96, latency: 19 },
        { timestamp: '04:00', throughput: 97, latency: 18 },
        { timestamp: '08:00', throughput: 98, latency: 17 },
        { timestamp: '12:00', throughput: 99, latency: 16 },
        { timestamp: '16:00', throughput: 97, latency: 18 },
        { timestamp: '20:00', throughput: 98, latency: 17 }
      ],
      detailedData: {
        averageThroughput: 97.5,
        averageLatency: 17.5,
        packetLoss: 0.08,
        handoverSuccess: 99.8,
        coverageArea: 99.0
      }
    },
    actual: {
      satelliteData: [
        { time: '00:00', connection: 93 },
        { time: '04:00', connection: 95 },
        { time: '08:00', connection: 94 },
        { time: '12:00', connection: 96 },
        { time: '16:00', connection: 94 },
        { time: '20:00', connection: 93 }
      ],
      cellData: [
        { lat: 25.033, lng: 121.5654, strength: 0.86 },
        { lat: 24.1477, lng: 120.6736, strength: 0.83 },
        { lat: 22.9998, lng: 120.2268, strength: 0.85 },
        { lat: 22.6273, lng: 120.3014, strength: 0.88 }
      ],
      metricsData: [
        { timestamp: '00:00', throughput: 93, latency: 24 },
        { timestamp: '04:00', throughput: 95, latency: 22 },
        { timestamp: '08:00', throughput: 94, latency: 23 },
        { timestamp: '12:00', throughput: 96, latency: 21 },
        { timestamp: '16:00', throughput: 94, latency: 23 },
        { timestamp: '20:00', throughput: 93, latency: 24 }
      ],
      detailedData: {
        averageThroughput: 94.2,
        averageLatency: 22.8,
        packetLoss: 0.25,
        handoverSuccess: 98.8,
        coverageArea: 96.5
      }
    }
  }
};
export default function ExperimentResult() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      setLoading(true);
      try {
        // 模擬 API 調用
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setResult(MOCK_RESULTS[id]);
      } catch (error) {
        console.error('Failed to fetch result:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResult();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-xl">No result found for experiment {id}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-y-auto">
      <div className="container mx-auto space-y-8 p-6">
        <h1 className="text-3xl font-bold">
          Experiment Result - Handover {id}
        </h1>

        {/* 理想結果 */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Ideal Results</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <SatelliteConnectionChart data={result.ideal.satelliteData} />
            <TaiwanCellMap data={result.ideal.cellData} />
            <StrategyMetricsChart data={result.ideal.metricsData} />
            <DetailedResults data={result.ideal.detailedData} />
          </div>
        </div>

        {/* 實際結果 */}
        <div>
          <h2 className="mb-4 text-2xl font-semibold">Actual Results</h2>
          <div className="grid gap-6 lg:grid-cols-2">
            <SatelliteConnectionChart data={result.actual.satelliteData} />
            <TaiwanCellMap data={result.actual.cellData} />
            <StrategyMetricsChart data={result.actual.metricsData} />
            <DetailedResults data={result.actual.detailedData} />
          </div>
        </div>
      </div>
    </div>
  );
}
