// service_template.jsx
'use client';
import { useEffect, useState } from 'react';
import { postAPI, downloadPDF } from '@/app/api/entrypoint';

export const useIslHoppingData = () => {
  const [islHoppingData, setIslHoppingData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: '',
    message: ''
  });

  const fetchIslHoppingData = async () => {
    setIsLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.user_uid) {
        throw new Error('未找到使用者資料');
      }

      const response = await postAPI(
        `meta_data_mgt/islHoppingManager/query_islHoppingData_by_user`,
        {
          user_uid: userData.user_uid
        }
      );

      if (response.data.status === 'success') {
        setIslHoppingData(response.data.data.islHoppings);
        setToast({
          show: true,
          type: 'success',
          message: `成功獲取IslHopping資料`
        });
      } else {
        throw new Error(response.data?.message || '獲取資料失敗');
      }
    } catch (error) {
      console.error(`獲取IslHopping資料錯誤:`, error);
      setToast({
        show: true,
        type: 'error',
        message: error.message || `獲取IslHopping資料失敗`
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIslHoppingData();
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
    applications: islHoppingData,
    isLoading,
    showToast: toast.show,
    setShowToast: (show) => setToast((prev) => ({ ...prev, show })),
    toastType: toast.type,
    toastMessage: toast.message,
    fetchIslHoppingData // 導出刷新函數
  };
};

export const useSimulation = () => {
  const [isSimulating, setIsSimulating] = useState(false);

  const runSimulation = async (islHoppingUid) => {
    setIsSimulating(true);
    try {
      const response = await postAPI(
        `simulation_data_mgt/islHoppingSimJobManager/run_islHopping_sim_job`,
        { islHopping_uid: islHoppingUid }
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
    }
  };

  return { runSimulation, isSimulating };
};

export const useDeleteIslHopping = () => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteToast, setDeleteToast] = useState({
    show: false,
    type: '',
    message: ''
  });

  const deleteIslHopping = async (islHoppingUid) => {
    setIsDeleting(true);
    try {
      const response = await postAPI(
        `meta_data_mgt/islHoppingManager/delete_islHopping`,
        {
          islHopping_uid: islHoppingUid
        }
      );

      if (response.data.status === 'success') {
        setDeleteToast({
          show: true,
          type: 'success',
          message: `成功刪除 IslHopping 資料`
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
    deleteIslHopping,
    isDeleting,
    showToast: deleteToast.show,
    setShowToast: (show) => setDeleteToast((prev) => ({ ...prev, show })),
    toastType: deleteToast.type,
    toastMessage: deleteToast.message
  };
};

export const useDownloadResult = () => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadResult = async (islHoppingUid) => {
    setIsDownloading(true);
    try {
      const response = await downloadPDF(
        `simulation_data_mgt/islHoppingSimJobManager/download_islHopping_sim_result`,
        { islHopping_uid: islHoppingUid }
      );

      if (response instanceof Error) {
        throw response;
      }

      const blob = new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `simulation-result-islHopping.pdf`;

      document.body.appendChild(link);
      link.click();

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