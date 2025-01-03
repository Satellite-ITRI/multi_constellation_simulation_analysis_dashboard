'use client';

import PageContainer from '@/components/layout/page-container';
import { useHandoverData } from '@/app/constellation_simulation/handover/multibeam/history/service';
import HandoverCard from '@/app/constellation_simulation/handover/multibeam/history/components/handoverCard';
import CustomToast from '@/components/base/CustomToast';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';

export default function OverViewPage() {
  const {
    applications,
    isLoading,
    showToast,
    setShowToast,
    toastType,
    toastMessage,
    fetchHandoverData // 確保 useHandoverData hook 導出這個函數
  } = useHandoverData();

  // 對 applications 進行排序
  const sortedApplications = applications?.sort((a, b) => b.id - a.id) || [];

  return (
    <PageContainer scrollable>
      <ToastProvider>
        <div className="mx-auto min-h-screen bg-gray-50 px-40 pt-32">
          <div className="mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="mb-2 text-2xl font-bold">Handover 歷史紀錄</h1>
            </div>
            {isLoading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="max-h-[630px] space-y-4 overflow-y-auto">
                {!isLoading &&
                  sortedApplications.map((item) => (
                    <HandoverCard
                      key={item.handover_uid}
                      data={item}
                      onRefresh={fetchHandoverData}
                    />
                  ))}
              </div>
            )}
          </div>

          <CustomToast
            type={toastType}
            message={toastMessage}
            showToast={showToast}
            setShowToast={setShowToast}
          />
          <ToastViewport />
        </div>
      </ToastProvider>
    </PageContainer>
  );
}
