// service.jsx
'use client';
import { useEffect, useState } from 'react';
import { postAPI, downloadPDF } from '@/app/api/entrypoint';
const mockRoutingData = [
  {
    routing_uid: '1',
    routing_name: 'Routing Analysis 1',
    routing_status: 'completed',
    routing_create_time: '2024-11-25T10:00:00Z',
    routing_update_time: '2024-11-25T10:30:00Z',
    routing_parameter: {
      energyEvaluate: true,
      energyEfficiencyFunction: true,
      energyHarvestingEverySecond: 20,
      hardwareEnergyConsumption: 4,
      maximumBatteryCapacity: 11700000,
      receptionPower: 0,
      transmissionPower: 0.85,
      txBufferTimeLimit: 20
    }
  }
];
export const useRoutingData = () => {
  const [routingData, setRoutingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: '',
    message: ''
  });

  const fetchRoutingData = async () => {
    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setRoutingData(mockRoutingData);
      setToast({
        show: true,
        type: 'success',
        message: '成功獲取 Routing 資料'
      });
    } catch (error) {
      console.error('獲取 Routing 資料錯誤:', error);
      setToast({
        show: true,
        type: 'error',
        message: error.message || '獲取 Routing 資料失敗'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutingData();
  }, []);

  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  return {
    applications: routingData,
    isLoading,
    showToast: toast.show,
    setShowToast: (show) => setToast((prev) => ({ ...prev, show })),
    toastType: toast.type,
    toastMessage: toast.message,
    fetchRoutingData
  };
};

export const useSimulation = () => {
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = async (handoverUid) => {
    setIsSimulating(true);
    try {
      const response = await postAPI(
        'simulation_data_mgt/handoverSimJobManager/run_handover_sim_job',
        { handover_uid: handoverUid }
      );

      if (response.data.status === 'success') {
        return { status: 'success' };
      } else {
        throw new Error(response.data.message || '模擬執行失敗');
      }
    } catch (error) {
      console.error('模擬執行錯誤:', error);
      throw error;
    } finally {
      setIsSimulating(false);
    }
  };

  return { runSimulation, isSimulating };
};
export const useDeleteHandover = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteToast, setDeleteToast] = useState({
    show: false,
    type: '',
    message: ''
  });

  const deleteHandover = async (handoverUid) => {
    setIsDeleting(true);
    try {
      const response = await postAPI(
        'meta_data_mgt/handoverManager/delete_handover',
        {
          handover_uid: handoverUid
        }
      );

      if (response.data.status === 'success') {
        setDeleteToast({
          show: true,
          type: 'success',
          message: '成功刪除 Handover 資料'
        });
        return true;
      } else {
        throw new Error(response.data?.message || '刪除失敗');
      }
    } catch (error) {
      setDeleteToast({
        show: true,
        type: 'error',
        message: error.message || '刪除過程發生錯誤'
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (deleteToast.show) {
      const timer = setTimeout(() => {
        setDeleteToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [deleteToast.show]);

  return {
    deleteHandover,
    isDeleting,
    showToast: deleteToast.show,
    setShowToast: (show) => setDeleteToast((prev) => ({ ...prev, show })),
    toastType: deleteToast.type,
    toastMessage: deleteToast.message
  };
};
export const useDownloadResult = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadResult = async (handoverUid) => {
    setIsDownloading(true);
    try {
      const response = await downloadPDF(
        'simulation_data_mgt/handoverSimJobManager/download_routing_sim_result_tmp',
        {}
      );

      if (response instanceof Error) {
        throw response;
      }

      // 建立 Blob 物件
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // 建立下載連結
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `simulation-result-Routing.pdf`;

      // 觸發下載
      document.body.appendChild(link);
      link.click();

      // 清理
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      return true;
    } catch (error) {
      console.error('下載結果失敗:', error);
      return false;
    } finally {
      setIsDownloading(false);
    }
  };

  return { downloadResult, isDownloading };
};
