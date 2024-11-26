'use client';
// applicationCard.jsx

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from 'date-fns';
import { useSimulation } from '../service';
import ResultModal from './ResultModal';

const ApplicationCard = ({ data }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { runSimulation, isSimulating } = useSimulation();
  const getStatusBadge = (status) => {
    const statusStyles = {
      None: 'bg-gray-500 text-black',
      Processing: 'bg-blue-500 text-black',
      Failed: 'bg-red-500 text-black',
      Done: 'bg-green-500 text-black'
    };

    return (
      <Badge className={`${statusStyles[status] || statusStyles.None} ml-2`}>
        {status}
      </Badge>
    );
  };

  const handleDetailsClick = () => {
    // router.push(`/dashboard/overview/result/${data.handover_uid}`);
    setIsModalOpen(true);
  };

  const getTimeAgo = (dateString) => {
    return formatDistance(new Date(dateString), new Date(), {
      addSuffix: true
    });
  };
  const handleRunSimulation = async () => {
    try {
      const result = await runSimulation(data.handover_uid);
      if (result.status === 'success' || result.status === 'info') {
        onSimulationComplete?.(); // 通知父組件重新獲取資料
      }
    } catch (error) {
      console.error('模擬執行失敗:', error);
    }
  };
  return (
    <>
      <div className="relative flex flex-col rounded-lg bg-white p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">{data.handover_name}</h2>
            {getStatusBadge(data.handover_status)}
          </div>
          <div className="space-x-2">
            {data.handover_status === 'completed' && (
              <button
                onClick={handleDetailsClick}
                className="transform rounded-lg bg-primary px-4 py-2 font-bold text-white transition-all hover:scale-105"
              >
                查看結果
              </button>
            )}
            {data.handover_status === 'None' && (
              <button
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="transform rounded-lg bg-primary px-4 py-2 font-bold text-white transition-all hover:scale-105"
              >
                {isSimulating ? '執行中...' : '執行模擬'}
              </button>
            )}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">星系配置</p>
            <p className="font-medium">
              {data.handover_parameter.constellation}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">換手策略</p>
            <p className="font-medium">
              {data.handover_parameter.handover_strategy}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">決策時機</p>
            <p className="font-medium">
              {data.handover_parameter.handover_decision}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cell/UT 配置</p>
            <p className="font-medium">{data.handover_parameter.cell_ut}</p>
          </div>
        </div>

        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>建立時間: {getTimeAgo(data.handover_create_time)}</span>
          <span>更新時間: {getTimeAgo(data.handover_update_time)}</span>
        </div>
      </div>
      <div className="h-[1/10]">
        <ResultModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={data}
        />
      </div>
    </>
  );
};

export default ApplicationCard;
