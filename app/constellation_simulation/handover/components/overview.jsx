'use client';

import PageContainer from '@/components/layout/page-container';

import { Button } from '@/components/ui/button';

import { useHandoverData } from '@/app/constellation_simulation/handover/service';
import HandoverCard from '@/app/constellation_simulation/handover/components/handoverCard';
import HandoverAnalyzeForm from '@/app/constellation_simulation/handover/components/HandoverAnalyzeForm';
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
    toastMessage
  } = useHandoverData();

  const [showAnalyzeForm, setShowAnalyzeForm] = useState(false);
  return (
    <PageContainer scrollable>
      <ToastProvider>
        {/* 將所有吐司相關的組件包裹在 ToastProvider 內部 */}
        <div className="mx-auto min-h-screen bg-gray-50 px-40 pt-32">
          <div className="mx-auto">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">Handover Record</h1>
              <Button
                onClick={() => setShowAnalyzeForm(true)}
                className="bg-primary text-white hover:bg-primary/90"
              >
                Create Handover Analyze
              </Button>
            </div>
            {isLoading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <p>Loading...</p>
              </div>
            ) : (
              <div className="max-h-[630px] space-y-4 overflow-y-auto">
                {!isLoading &&
                  applications.map((handover) => (
                    <HandoverCard key={handover.handover_uid} data={handover} />
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
