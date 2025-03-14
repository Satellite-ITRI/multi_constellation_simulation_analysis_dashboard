'use client';

import PageContainer from '@/components/layout/page-container';

import { Button } from '@/components/ui/button';

import { useISLData } from '@/app/constellation_simulation/isl/service';
import HandoverCard from '@/app/constellation_simulation/isl/components/islCard';
import HandoverAnalyzeForm from '@/app/constellation_simulation/isl/components/islAnalyzeForm';
import CustomToast from '@/components/base/CustomToast';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';
import { useState } from 'react';
import { useRouter } from 'next/navigation'; // 引入 useRouter
import { useEffect } from 'react'; // 引入 useEffect
export default function OverViewPage() {
  const router = useRouter(); // 初始化 router
  useEffect(() => {
    router.push(
      '/constellation_simulation/isl/energy_saving_connection_isl_disconnection'
    );
  }, []);
  const {
    applications,
    isLoading,
    showToast,
    setShowToast,
    toastType,
    toastMessage,
    fetchHandoverData // 確保 useHandoverData hook 導出這個函數
  } = useISLData();

  const [showAnalyzeForm, setShowAnalyzeForm] = useState(false);
  const handleAnalyzeFormSuccess = () => {
    fetchHandoverData(); // 重新獲取資料
    setShowAnalyzeForm(false); // 關閉表單
  };
  return (
    <PageContainer scrollable>
      <ToastProvider>
        {/* 將所有吐司相關的組件包裹在 ToastProvider 內部 */}
        <div className="mx-auto min-h-screen bg-gray-50 px-40 pt-32">
          <div className="mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="mb-2 text-2xl font-bold">ISL Record</h1>
              {/* <Button
                onClick={() => setShowAnalyzeForm(true)}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Create ISL Analyze
              </Button> */}
            </div>
            {isLoading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="max-h-[630px] space-y-4 overflow-y-auto">
                {!isLoading &&
                  applications.map((handover) => (
                    <HandoverCard
                      key={handover.handover_uid}
                      data={handover}
                      onRefresh={fetchHandoverData} // 傳入刷新函數
                    />
                  ))}
              </div>
            )}
          </div>
          {showAnalyzeForm && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowAnalyzeForm(false);
                }
              }}
            >
              <div
                className="relative transform transition-all duration-300 ease-in-out"
                style={{
                  animation: 'slideIn 0.3s ease-out'
                }}
              >
                <HandoverAnalyzeForm
                  onClose={() => setShowAnalyzeForm(false)}
                  onSuccess={handleAnalyzeFormSuccess} // 傳入成功處理函數
                />
              </div>
            </div>
          )}

          {/* 使用封裝的 CustomToast 組件來顯示吐司通知 */}
          <CustomToast
            type={toastType}
            message={toastMessage}
            showToast={showToast}
            setShowToast={setShowToast}
          />
          {/* 確保包含 ToastViewport 組件 */}
          <ToastViewport />
        </div>
      </ToastProvider>
    </PageContainer>
  );
}
