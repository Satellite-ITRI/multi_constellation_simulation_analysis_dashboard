// pages/connection_time_simulation-connectedDuration.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SimulationForm from '@/components/base/SimulationForm';
import { connection_time_simulationConnectedDurationConfig } from '@/app/constellation_simulation/input_format';
import {
  useConnectedDurationData,
  useSimulation,
  useDownloadResult
} from '@/app/constellation_simulation/constellation/connection_time_simulation/service';
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
    fetchConnectedDurationData
  } = useConnectedDurationData();
  const { downloadResult, isDownloading } = useDownloadResult();
  const { runSimulation, isSimulating } = useSimulation();

  const [lastConnectedDurationStatus, setLastConnectedDurationStatus] =
    useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [duplicateConnectedDurationId, setDuplicateConnectedDurationId] =
    useState(null);
  const [statusKey, setStatusKey] = useState(0);
  const [formData, setFormData] = useState(
    connection_time_simulationConnectedDurationConfig.defaultValues
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
          const params = app.connectedDuration_parameter;
          return (
            params.cell_ut === formData.cell_ut &&
            params.beam_counts === beamCount &&
            params.reuse_factor === formData.reuse_factor &&
            params.constellation === formData.constellation &&
            params.connectedDuration_decision ===
              formData.connectedDuration_decision &&
            params.connectedDuration_strategy ===
              formData.connectedDuration_strategy
          );
        });

        if (duplicateExperiment) {
          setDuplicateWarning(true);
          setDuplicateConnectedDurationId(
            duplicateExperiment.connectedDuration_uid
          );
          setIsSubmitting(false);
          return;
        }
      }

      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.user_uid) {
        throw new Error('未找到使用者資料');
      }

      const connectedDurationName = generateConnectedDurationName(formData);
      // ★ 修正：以字面 key 的方式建立物件 (coverage_name / coverage_parameter ...)
      const payload = {
        connectedDuration_name: connectedDurationName,
        connectedDuration_parameter: {
          constellation: formData.constellation,
          connectedDuration_strategy: formData.connectedDuration_strategy,
          connectedDuration_decision: formData.connectedDuration_decision,
          beam_counts: beamCount,
          reuse_factor: formData.reuse_factor,
          cell_ut: formData.cell_ut
        },
        f_user_uid: userData.user_uid
      };

      // 建立 connectedDuration
      const response = await postAPI(
        `meta_data_mgt/connectedDurationManager/create_connectedDuration`,
        payload
      );

      if (response.data.status === 'success') {
        setShowToast(true);
        // 立即執行模擬
        try {
          await runSimulation(response.data.data.connectedDuration_uid);
          // 重新抓取 connectedDuration 資料
          await fetchConnectedDurationData();
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
    const latestConnectedDuration = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });

    try {
      await downloadResult(latestConnectedDuration.connectedDuration_uid);
    } catch (error) {
      setError('下載結果失敗');
    }
  };

  const handleHistoryClick = () => {
    // 前往歷史紀錄頁面
    router.push(
      `/constellation_simulation/constellation/connection_time_simulation/history`
    );
  };

  const generateConnectedDurationName = (formData) => {
    // 直接從 constellation 值中提取數字
    const constellationParts = formData.constellation.split('_');
    const fleetLabel = `${constellationParts[1]}x${constellationParts[2]}`;

    const strategyLabel = formData.connectedDuration_strategy;
    const timingLabel = formData.connectedDuration_decision;

    // 從 cell_ut 中提取數字
    const cellNumber = formData.cell_ut.split('Cell')[0];

    const beamCountLabel = formData.beam_count;
    const reuseFactorLabel = `F${formData.reuse_factor}`;

    // 組合名稱
    const name = `${fleetLabel}_${strategyLabel}_${timingLabel}_${cellNumber}Cell_1UT_${beamCountLabel}Beam_${reuseFactorLabel}`;
    return name;
  };

  // 檢查是否可以下載結果
  const canDownloadResult = () => {
    if (!applications || applications.length === 0) return false;

    // 找出 id 最大的記錄
    const latestConnectedDuration = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });

    // 檢查是否完成且狀態為 completed
    return latestConnectedDuration.connectedDuration_status === 'completed';
  };

  useEffect(() => {
    if (!applications || applications.length === 0) {
      setLastConnectedDurationStatus(null);
      return;
    }

    // 如果有重複實驗的警告
    if (duplicateWarning) {
      setLastConnectedDurationStatus({
        status: '發現相同參數的實驗記錄，請先查看歷史紀錄',
        style:
          'bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-sm font-medium ml-4'
      });
      return;
    }

    // 找出 id 最大的記錄
    const latestConnectedDuration = applications.reduce((prev, current) => {
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

    const status = statusMap[latestConnectedDuration.connectedDuration_status];
    const statusStyle = statusStyles[status];

    setLastConnectedDurationStatus({
      status,
      style: `${statusStyle} px-2 py-1 rounded-sm text-sm font-medium ml-4`
    });
  }, [applications, duplicateWarning]);

  const isFormValid = () => {
    return (
      formData.constellation &&
      formData.connectedDuration_strategy &&
      formData.connectedDuration_decision &&
      formData.beam_count
    );
  };

  return (
    <PageContainer scrollable>
      <ToastProvider>
        <div className="mx-auto min-h-screen bg-black px-40 pt-32">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="flex items-center text-2xl font-bold">
                連線時間模擬
                <div key={statusKey}>
                  {lastConnectedDurationStatus && (
                    <span className={lastConnectedDurationStatus.style}>
                      {lastConnectedDurationStatus.status}
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

            <SimulationForm
              formData={formData}
              setFormData={setFormData}
              config={connection_time_simulationConnectedDurationConfig}
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
