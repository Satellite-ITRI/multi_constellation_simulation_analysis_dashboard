// service.jsx
'use client';
import { useEffect, useState } from 'react';
import { postAPI, downloadPDF } from '@/app/api/entrypoint';
const mockISLData = [
  {
    isl_uid: '1',
    isl_name: 'ISL Analysis 1',
    isl_status: 'completed',
    isl_create_time: '2024-11-25T10:00:00Z',
    isl_update_time: '2024-11-25T10:30:00Z',
    isl_parameter: {
      constellation: '3x22',
      isl_link_method: 'minMaxR',
      execute_function: 'simGroundStationCoverSat',
      station_location_latitude: 25.049126147527762,
      station_location_longitude: 121.51379754215354,
      station_location_altitude: 0.192742
    }
  }
];
export const useISLData = () => {
  const [islData, setISLData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: '',
    message: ''
  });

  const fetchISLData = async () => {
    setIsLoading(true);
    try {
      // 模擬 API 請求延遲
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 使用模擬資料
      setISLData(mockISLData);
      setToast({
        show: true,
        type: 'success',
        message: '成功獲取 ISL 資料'
      });
    } catch (error) {
      console.error('獲取 ISL 資料錯誤:', error);
      setToast({
        show: true,
        type: 'error',
        message: error.message || '獲取 ISL 資料失敗'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchISLData();
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
    applications: islData,
    isLoading,
    showToast: toast.show,
    setShowToast: (show) => setToast((prev) => ({ ...prev, show })),
    toastType: toast.type,
    toastMessage: toast.message,
    fetchISLData
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
        'simulation_data_mgt/handoverSimJobManager/download_isl_sim_result_tmp',
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
      link.download = `simulation-result-ISL.pdf`;

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
