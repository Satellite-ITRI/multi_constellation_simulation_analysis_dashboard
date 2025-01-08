'use client';
// applicationCard.jsx

import React, { useState } from 'react';
import { formatDistance } from 'date-fns';
import { useSimulation, useDeleteEndToEndRouting } from '../service';
import DeleteConfirmModal from '@/components/base/DeleteConfirmModal';
import CustomToast from '@/components/base/CustomToast';
import { useDownloadResult } from '../service';

const ApplicationCard = ({ data, onRefresh }) => {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const {
    deleteEndToEndRouting,
    isDeleting,
    showToast,
    setShowToast,
    toastType,
    toastMessage
  } = useDeleteEndToEndRouting();

  const handleDeleteConfirm = async () => {
    const success = await deleteEndToEndRouting(data.endToEndRouting_uid);
    if (success) {
      onRefresh?.(); // 調用父組件傳入的刷新函數
    }
    setIsDeleteModalOpen(false);
  };

  const getConstellationLabel = (constellation) => {
    const constellationMap = {
      TLE_3P_22Sats_29deg_F1: '3*22',
      TLE_6P_22Sats_29deg_F1: '6*22',
      TLE_12P_22Sats_29deg_F7: '12*22'
    };
    return constellationMap[constellation] || constellation;
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

    return <></>;
  };

  const { downloadResult, isDownloading } = useDownloadResult();

  // 修改 handleDetailsClick 函數
  const handleDetailsClick = async () => {
    const success = await downloadResult(data.endToEndRouting_uid);
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
      const result = await runSimulation(data.endToEndRouting_uid);
      if (result.status === 'success' || result.status === 'info') {
        onRefresh?.(); // 使用相同的 onRefresh 函數重新獲取資料
      }
    } catch (error) {
      console.error('模擬執行失敗:', error);
    }
  };

  return (
    <>
      <div className="relative flex flex-col rounded-lg bg-secondary p-6 shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">
              {data.endToEndRouting_name}
            </h2>
            {getStatusBadge(data.endToEndRouting_status)}
          </div>
          <div className="space-x-2">
            {/* 查看結果按鈕 */}
            {data.endToEndRouting_status === 'completed' && (
              <button
                onClick={handleDetailsClick}
                disabled={isDownloading}
                className="transform rounded-lg bg-primary px-4 py-2 font-bold text-white transition-all hover:scale-105 disabled:opacity-50"
              >
                {isDownloading ? '下載中...' : '查看結果'}
              </button>
            )}
            {/* 刪除按鈕 */}
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              disabled={
                isDeleting || data.endToEndRouting_status === 'processing'
              }
              className="transform rounded-lg bg-destructive px-4 py-2 font-bold text-white transition-all hover:scale-105 hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isDeleting ? '刪除中...' : '刪除'}
            </button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">星系配置</p>
            <p className="font-medium">
              {getConstellationLabel(
                data.endToEndRouting_parameter.TLE_inputFileName
              )}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">換手決策</p>
            <p className="font-medium">
              {data.endToEndRouting_parameter.handoverDecision}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">換手策略</p>
            <p className="font-medium">
              {data.endToEndRouting_parameter.handover_strategy}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">評估情境</p>
            <p className="font-medium">
              {data.endToEndRouting_parameter.useCaseVersion}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">波束頻寬</p>
            <p className="font-medium">
              {data.endToEndRouting_parameter.beamBandwidth}
            </p>
          </div>
        </div>

        <div className="mt-4 flex justify-between text-sm text-gray-500">
          <span>建立時間: {getTimeAgo(data.endToEndRouting_create_time)}</span>
          <span>更新時間: {getTimeAgo(data.endToEndRouting_update_time)}</span>
        </div>
      </div>
      <div className="h-[1/10]">
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleDeleteConfirm}
          endToEndRoutingName={data.endToEndRouting_name}
          typeName="endToEndRouting"
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

export default ApplicationCard;
