// pages/multibeam-handover.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SimulationForm from '@/components/base/SimulationForm';
import { multibeamHandoverConfig } from '@/app/constellation_simulation/input_format';
import {
  useHandoverData,
  useSimulation,
  useDownloadResult
} from '@/app/constellation_simulation/handover/multibeam/service';
import PageContainer from '@/components/layout/page-container';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';
import CustomToast from '@/components/base/CustomToast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { postAPI } from '@/app/api/entrypoint';

export default function OverViewPage() {
  const router = useRouter();
  const {
    applications,
    isLoading,
    toastType,
    showToast,
    setShowToast,
    toastMessage,
    fetchHandoverData
  } = useHandoverData();
  const { downloadResult, isDownloading } = useDownloadResult();
  const { runSimulation, isSimulating } = useSimulation();

  const [lastHandoverStatus, setLastHandoverStatus] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [duplicateHandoverId, setDuplicateHandoverId] = useState(null);
  const [statusKey, setStatusKey] = useState(0);
  const [formData, setFormData] = useState(
    multibeamHandoverConfig.defaultValues
  );
  const handleSubmit = async () => {
    setError('');
    setDuplicateWarning(false);
    setIsSubmitting(true);

    try {
      const beamCount = parseInt(formData.beam_count);
      if (isNaN(beamCount) || beamCount < 1 || beamCount > 100) {
        setError('波束數量必須是 1 到 100 之間的數字');
        setIsSubmitting(false);
        return;
      }

      // 檢查是否有相同的實驗參數
      if (applications && applications.length > 0) {
        const duplicateExperiment = applications.find((app) => {
          const params = app.handover_parameter;
          return (
            params.cell_ut === formData.cell_ut &&
            params.beam_counts === beamCount &&
            params.reuse_factor === formData.reuse_factor &&
            params.constellation === formData.constellation &&
            params.handover_decision === formData.handover_decision &&
            params.handover_strategy === formData.handover_strategy
          );
        });

        if (duplicateExperiment) {
          setDuplicateWarning(true);
          setDuplicateHandoverId(duplicateExperiment.handover_uid);
          setIsSubmitting(false);
          return;
        }
      }

      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.user_uid) {
        throw new Error('未找到使用者資料');
      }

      const handoverName = generateHandoverName(formData);
      const payload = {
        handover_name: handoverName,
        handover_parameter: {
          constellation: formData.constellation,
          handover_strategy: formData.handover_strategy,
          handover_decision: formData.handover_decision,
          beam_counts: beamCount,
          reuse_factor: formData.reuse_factor,
          cell_ut: formData.cell_ut
        },
        f_user_uid: userData.user_uid
      };

      // 建立 handover
      const response = await postAPI(
        'meta_data_mgt/handoverManager/create_handover',
        payload
      );

      if (response.data.status === 'success') {
        setShowToast(true);
        // 立即執行模擬
        try {
          await runSimulation(response.data.data.handover_uid);
          // 可以在這裡加入模擬成功的提示
          // 開始輪詢更新狀態
          await fetchHandoverData();
          setShowToast(true);
        } catch (simError) {
          throw new Error('模擬執行失敗: ' + simError.message);
        }
      } else {
        throw new Error(response.data.message || '建立失敗');
      }
    } catch (error) {
      setError(error.message || '系統錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 處理下載結果的函數
  const handleDownloadResult = async () => {
    if (!canDownloadResult()) return;

    // 找出 id 最大的記錄
    const latestHandover = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });

    try {
      await downloadResult(latestHandover.handover_uid);
    } catch (error) {
      setError('下載結果失敗');
    }
  };

  const handleHistoryClick = () => {
    router.push('/constellation_simulation/handover/multibeam/history');
  };
  const generateHandoverName = (formData) => {
    // 直接從 constellation 值中提取數字
    const constellationParts = formData.constellation.split('_');
    const fleetLabel = `${constellationParts[1]}x${constellationParts[2]}`; // 例如 "3x22"

    const strategyLabel = formData.handover_strategy;
    const timingLabel = formData.handover_decision;

    // 從 cell_ut 中提取數字
    const cellNumber = formData.cell_ut.split('Cell')[0]; // 例如 "28"

    const beamCountLabel = formData.beam_count;
    const reuseFactorLabel = `F${formData.reuse_factor}`;

    // 組合名稱
    const name = `${fleetLabel}_${strategyLabel}_${timingLabel}_${cellNumber}Cell_1UT_${beamCountLabel}Beam_${reuseFactorLabel}`;

    return name;
  };
  // 檢查是否可以下載結果的函數
  const canDownloadResult = () => {
    if (!applications || applications.length === 0) return false;

    // 找出 id 最大的記錄
    const latestHandover = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });

    // 檢查是否完成且狀態為 completed
    return latestHandover.handover_status === 'completed';
  };
  useEffect(() => {
    if (!applications || applications.length === 0) {
      setLastHandoverStatus(null);
      return;
    }

    // 如果有重複實驗的警告
    if (duplicateWarning) {
      setLastHandoverStatus({
        status: '發現相同參數的實驗記錄，請先查看歷史紀錄',
        style:
          'bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-sm font-medium ml-4'
      });
      return;
    }

    // 找出 id 最大的記錄
    const latestHandover = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });

    // 定義狀態映射
    const statusMap = {
      simulation_failed: 'Failed',
      completed: '',
      None: 'None',
      processing: 'Processing'
    };

    // 使用 Tailwind 預設的顏色系統
    const statusStyles = {
      None: 'bg-muted text-muted-foreground',
      Processing: 'bg-primary text-primary-foreground animate-pulse',
      Failed: 'bg-destructive text-destructive-foreground',
      Done: 'bg-accent text-accent-foreground'
    };

    const status = statusMap[latestHandover.handover_status];
    const statusStyle = statusStyles[status];

    setLastHandoverStatus({
      status,
      style: `${statusStyle} px-2 py-1 rounded-sm text-sm font-medium ml-4`
    });
  }, [applications, duplicateWarning]);
  const isFormValid = () => {
    return (
      formData.constellation &&
      formData.handover_strategy &&
      formData.handover_decision &&
      formData.beam_count
    );
  };
  return (
    <PageContainer scrollable>
      <ToastProvider>
        <div className="mx-auto min-h-screen bg-black px-40 pt-32">
          <div className="mx-auto max-w-4xl">
            {/* 保持原有的標題和按鈕 */}
            <div className="mb-6 flex items-center justify-between">
              <h1 className="flex items-center text-2xl font-bold">
                多波束換手效能分析
                <div key={statusKey}>
                  {lastHandoverStatus && (
                    <span className={lastHandoverStatus.style}>
                      {lastHandoverStatus.status}
                    </span>
                  )}
                </div>
              </h1>
              <div className="flex gap-4">
                <Button onClick={handleHistoryClick} className="w-32">
                  歷史紀錄
                </Button>
                <Button
                  onClick={handleDownloadResult}
                  disabled={!canDownloadResult() || isDownloading}
                  className="w-32"
                >
                  {isDownloading ? '下載中...' : '查看最新結果'}
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isSubmitting || isSimulating}
                  className="w-32"
                >
                  {isSubmitting || isSimulating ? '處理中...' : '執行分析'}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {/* 使用新的表單組件 */}
            <SimulationForm
              formData={formData}
              setFormData={setFormData}
              config={multibeamHandoverConfig}
            />
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
