'use client';

import PageContainer from '@/components/layout/page-container';
import { useCoverageData } from '@/app/constellation_simulation/constellation/coverage_analysis/history/service';
import CoverageCard from '@/app/constellation_simulation/constellation/coverage_analysis/history/components/coverageCard';
import CustomToast from '@/components/base/CustomToast';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';
import { useState } from 'react';

export default function OverViewPage() {
  const {
    applications,
    isLoading,
    showToast,
    setShowToast,
    toastType,
    toastMessage,
    fetchCoverageData // 確保 useCoverageData hook 導出這個函數
  } = useCoverageData();

  const [showAnalyzeForm, setShowAnalyzeForm] = useState(false);

  // 對 applications 進行排序
  const sortedApplications = applications?.sort((a, b) => b.id - a.id) || [];

  return (
    <PageContainer scrollable>
      <ToastProvider>
        <div className="mx-auto min-h-screen bg-gray-50 px-40 pt-32">
          <div className="mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="mb-2 text-2xl font-bold">Coverage 歷史紀錄</h1>
            </div>
            {isLoading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="max-h-[630px] space-y-4 overflow-y-auto">
                {!isLoading &&
                  sortedApplications.map((item) => (
                    <CoverageCard
                      key={item.coverage_uid}
                      data={item}
                      onRefresh={fetchCoverageData}
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
              ></div>
            </div>
          )}

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
