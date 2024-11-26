// service.jsx
'use client';
import { useEffect, useState } from 'react';
import { postAPI } from '@/app/api/entrypoint';

export const useHandoverData = () => {
  const [handoverData, setHandoverData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState({
    show: false,
    type: '',
    message: ''
  });

  const fetchHandoverData = async () => {
    setIsLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.user_uid) {
        throw new Error('未找到使用者資料');
      }

      const response = await postAPI(
        'meta_data_mgt/handoverManager/query_handoverData_by_user',
        {
          user_uid: userData.user_uid
        }
      );

      if (response.data.status === 'success') {
        setHandoverData(response.data.data.handovers);
        setToast({
          show: true,
          type: 'success',
          message: '成功獲取Handover資料'
        });
      } else {
        throw new Error(response.data?.message || '獲取資料失敗');
      }
    } catch (error) {
      console.error('獲取Handover資料錯誤:', error);
      setToast({
        show: true,
        type: 'error',
        message: error.message || '獲取Handover資料失敗'
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHandoverData();
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
    applications: handoverData, // 改名以匹配父組件的期望
    isLoading,
    showToast: toast.show, // 解構 toast 物件
    setShowToast: (show) => setToast((prev) => ({ ...prev, show })),
    toastType: toast.type,
    toastMessage: toast.message
  };
};

export const useSimulation = () => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationToast, setSimulationToast] = useState({
    show: false,
    type: '',
    message: ''
  });

  const runSimulation = async (handoverUid) => {
    setIsSimulating(true);
    try {
      const response = await postAPI(
        'simulation_data_mgt/handoverSimJobManager/run_handover_sim_job',
        {
          handover_uid: handoverUid
        }
      );

      if (
        response.data.status === 'success' ||
        response.data.status === 'info'
      ) {
        setSimulationToast({
          show: true,
          type: 'success',
          message: response.data.message
        });
        return response.data;
      } else {
        throw new Error(response.data?.message || '模擬啟動失敗');
      }
    } catch (error) {
      console.error('執行模擬錯誤:', error);
      setSimulationToast({
        show: true,
        type: 'error',
        message: error.message || '模擬啟動失敗'
      });
      throw error;
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    if (simulationToast.show) {
      const timer = setTimeout(() => {
        setSimulationToast((prev) => ({ ...prev, show: false }));
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [simulationToast.show]);

  return {
    runSimulation,
    isSimulating,
    simulationToast,
    setSimulationToast
  };
};
