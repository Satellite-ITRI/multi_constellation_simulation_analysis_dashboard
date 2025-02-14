'use client';
// applicationCard.jsx

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { formatDistance } from 'date-fns';
import { useSimulation, useDeleteHandover } from '../service';
import ResultModal from './ResultModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import CustomToast from '@/components/base/CustomToast';
import { useDownloadResult } from '../service';
// import { toast } from '@/components/ui/use-toast';
const ISLCard = ({ data, onRefresh }) => {
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    deleteHandover,
    isDeleting,
    showToast,
    setShowToast,
    toastType,
    toastMessage
  } = useDeleteHandover();

  const handleDeleteConfirm = async () => {
    const success = await deleteHandover(data.handover_uid);
    if (success) {
      onRefresh?.(); // 調用父組件傳入的刷新函數
    }
    setIsDeleteModalOpen(false);
  };
  const getConstellationLabel = (constellation) => {
    const match = constellation.match(/TLE_(\d+)P_22Sats/);
    if (match && match[1]) {
      return `${match[1]} * 22`;
    }
    // 如果沒匹配到，就直接回傳原字串
    return constellation;
  };
  const getStatusBadge = (status) => {
    // 修改狀態映射
    const statusMap = {
      simulation_failed: 'Failed',
      completed: 'Done',
      None: 'None',
      processing: 'Processing'
    };

    const statusStyles = {
      None: 'bg-gray-500 text-black',
      Processing: 'bg-blue-500 text-black',
      Failed: 'bg-red-500 text-black',
      Done: 'bg-green-500 text-black'
    };

    const displayStatus = statusMap[status] || status;

    return (
      <Badge
        className={`${statusStyles[displayStatus] || statusStyles.None} ml-2`}
      >
        {displayStatus}
      </Badge>
    );
  };
  const { downloadResult, isDownloading } = useDownloadResult();

  // 修改 handleDetailsClick 函數
  const handleDetailsClick = async () => {
    const success = await downloadResult(data.isl_name);
    if (!success) {
      // 可以加入錯誤處理，例如顯示錯誤提示
      console.error('下載失敗');
    }
  };
  const getTimeAgo = (dateString) => {
    return formatDistance(new Date(dateString), new Date(), {
      addSuffix: true
    });
  };

  const { runSimulation, isSimulating } = useSimulation();

  const handleRunSimulation = async () => {
    try {
      const result = await runSimulation(data.handover_uid);
      if (result.status === 'success' || result.status === 'info') {
        onRefresh?.(); // 使用相同的 onRefresh 函數重新獲取資料
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
            <h2 className="text-xl font-semibold">{data.routing_name}</h2>
            {getStatusBadge(data.routing_status)}
          </div>
          <div className="space-x-2">
            {/* 查看結果按鈕 */}
            {data.routing_status === 'completed' && (
              <button
                onClick={handleDetailsClick}
                disabled={isDownloading}
                className="transform rounded-lg bg-primary px-4 py-2 font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
              >
                {isDownloading ? '下載中...' : '查看結果'}
              </button>
            )}

            {/* 執行模擬按鈕 */}
            {/* <button
              onClick={handleRunSimulation}
              disabled={
                isSimulating ||
                data.routing_status === 'processing' ||
                data.routing_status === 'completed'
              }
              className="transform rounded-lg bg-primary px-4 py-2 font-bold text-white transition-all hover:scale-105 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSimulating ? '執行中...' : '執行模擬'}
            </button> */}

            {/* 刪除按鈕 */}
            {/* <button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={isDeleting || data.routing_status === 'processing'}
              className="transform rounded-lg bg-destructive px-4 py-2 font-bold text-white transition-all hover:scale-105 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? '刪除中...' : '刪除'}
            </button> */}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">能量評估</p>
            <p className="font-medium">
              {data.routing_parameter.energyEvaluate ? '是' : '否'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">能量效率函數</p>
            <p className="font-medium">
              {data.routing_parameter.energyEfficiencyFunction ? '是' : '否'}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">每秒能量收集 (瓦)</p>
            <p className="font-medium">
              {data.routing_parameter.energyHarvestingEverySecond}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">硬體能量消耗 (瓦)</p>
            <p className="font-medium">
              {data.routing_parameter.hardwareEnergyConsumption}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">最大電池容量 (焦耳)</p>
            <p className="font-medium">
              {data.routing_parameter.maximumBatteryCapacity}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">接收功率 (焦耳)</p>
            <p className="font-medium">
              {data.routing_parameter.receptionPower}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">傳輸功率 (焦耳)</p>
            <p className="font-medium">
              {data.routing_parameter.transmissionPower}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">傳輸緩衝時間限制 (秒)</p>
            <p className="font-medium">
              {data.routing_parameter.txBufferTimeLimit}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>建立時間: {getTimeAgo(data.routing_create_time)}</span>
          <span>更新時間: {getTimeAgo(data.routing_update_time)}</span>
        </div>
      </div>
      <div className="h-[1/10]">
        <ResultModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          data={data}
        />
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          handoverName={data.handover_name}
        />

        <CustomToast
          type={toastType}
          message={toastMessage}
          showToast={showToast}
          setShowToast={setShowToast}
        />
      </div>
    </>
  );
};

export default ISLCard;
