'use client';
import { useEffect, useState } from 'react';

// 模擬的應用程序數據
const MOCK_APPLICATIONS = {
  1: {
    strategy: 'MaxVisibleTime',
    timing: 'Preemptive',
    fleet: 'TLE_3P_22Sats_29deg_F1',
    status: 'In Progress'
  },
  2: {
    strategy: 'MaxVisibleTime',
    timing: 'Nonpreemptive',
    fleet: 'TLE_3P_22Sats_29deg_F1',
    status: 'Done'
  },
  3: {
    strategy: 'MinRange',
    timing: 'Preemptive',
    fleet: 'TLE_3P_22Sats_29deg_F1',
    status: 'Failed'
  }
  // ... 其他數據
};

export const useFetchApplications = () => {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      setIsLoading(true);

      // 模擬 API 調用延遲
      await new Promise((resolve) => setTimeout(resolve, 1000));

      try {
        // 將對象轉換為數組格式，以便於在UI中渲染
        const formattedApplications = Object.entries(MOCK_APPLICATIONS).map(
          ([id, data]) => ({
            uid: id,
            title: `${data.strategy} - ${data.timing}`,
            status: data.status, // 你可以根據需要設置狀態
            createdAt: new Date().toISOString(), // 模擬創建時間
            updatedAt: new Date().toISOString(), // 模擬更新時間
            description: `Fleet: ${data.fleet}`,
            strategy: data.strategy,
            timing: data.timing,
            fleet: data.fleet
          })
        );

        setApplications(formattedApplications);
        setToastType('success');
        setToastMessage('Handover records fetched successfully!');
        setShowToast(true);
      } catch (error) {
        setToastType('error');
        setToastMessage('Failed to fetch handover records.');
        setShowToast(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => setShowToast(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  return {
    applications,
    isLoading,
    showToast,
    setShowToast,
    toastType,
    toastMessage
  };
};
