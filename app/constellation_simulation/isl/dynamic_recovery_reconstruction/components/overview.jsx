// pages/dynamic_recovery_reconstruction-modifyRegenRouting.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SimulationForm from '@/components/base/SimulationForm';
import { dynamic_recovery_reconstructionModifyRegenRoutingConfig } from '@/app/constellation_simulation/input_format';
import {
  useModifyRegenRoutingData,
  useSimulation,
  useDownloadResult
} from '@/app/constellation_simulation/isl/dynamic_recovery_reconstruction/history/service';
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
    fetchModifyRegenRoutingData
  } = useModifyRegenRoutingData();
  const { downloadResult, isDownloading } = useDownloadResult();
  const { runSimulation, isSimulating } = useSimulation();

  const [lastModifyRegenRoutingStatus, setLastModifyRegenRoutingStatus] =
    useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [duplicateModifyRegenRoutingId, setDuplicateModifyRegenRoutingId] =
    useState(null);
  const [statusKey, setStatusKey] = useState(0);
  const [formData, setFormData] = useState(
    dynamic_recovery_reconstructionModifyRegenRoutingConfig.defaultValues
  );

  const handleSubmit = async () => {
    setError('');
    setDuplicateWarning(false);
    setIsSubmitting(true);

    try {
      const rawValue = Number(formData.avgISLPerSat);
      const fixedValue = parseFloat(rawValue.toFixed(1));
      // 例如保留 6 位小數 (你可改成 1, 2, 或其他需要的位數)

      const updatedFormData = {
        ...formData,
        avgISLPerSat: fixedValue
      };
      // 取得我們想要檢查的鍵值 (可自行排除不想檢查的欄位)
      const keysToCheck = Object.keys(
        dynamic_recovery_reconstructionModifyRegenRoutingConfig.defaultValues
      );

      // 檢查重複實驗
      const duplicateExperiment = applications?.find((app) => {
        const params = app.modifyRegenRouting_parameter || {};
        return keysToCheck.every((key) => {
          return String(params[key]) === String(updatedFormData[key]);
        });
      });
      if (duplicateExperiment) {
        setDuplicateWarning(true);
        setDuplicateModifyRegenRoutingId(
          duplicateExperiment.modifyRegenRouting_uid
        );
        setIsSubmitting(false);
        return;
      }

      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.user_uid) {
        throw new Error('未找到使用者資料');
      }

      // 產生 modifyRegenRouting_xxx 的隨機名稱
      const modifyRegenRoutingName = generateModifyRegenRoutingName();

      // 將 formData 的欄位動態組成 modifyRegenRouting_parameter
      const modifyRegenRouting_parameter = Object.entries(
        updatedFormData
      ).reduce((acc, [key, value]) => {
        acc[key] = String(value);
        return acc;
      }, {});

      // 組合最終 payload (不再出現 formData 層)
      const payload = {
        modifyRegenRouting_name: modifyRegenRoutingName,
        modifyRegenRouting_parameter: modifyRegenRouting_parameter,
        f_user_uid: userData.user_uid
      };

      // 建立 modifyRegenRouting
      const response = await postAPI(
        `meta_data_mgt/modifyRegenRoutingManager/create_modifyRegenRouting`,
        payload
      );

      if (response.data.status === 'success') {
        setShowToast(true);
        // 立即執行模擬
        try {
          await runSimulation(response.data.data.modifyRegenRouting_uid);
          // 重新抓取 modifyRegenRouting 資料
          await fetchModifyRegenRoutingData();
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
    const latestModifyRegenRouting = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });

    try {
      await downloadResult(latestModifyRegenRouting.modifyRegenRouting_uid);
    } catch (error) {
      setError('下載結果失敗');
    }
  };

  const handleHistoryClick = () => {
    // 前往歷史紀錄頁面
    router.push(
      `/constellation_simulation/isl/dynamic_recovery_reconstruction/history`
    );
  };

  const generateModifyRegenRoutingName = () => {
    // 使用 Math.random() 搭配 toString(36) 產生 Base36 字串
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `modifyRegenRouting_${randomStr}`;
  };

  // 檢查是否可以下載結果
  const canDownloadResult = () => {
    if (!applications || applications.length === 0) return false;
    const latestModifyRegenRouting = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });
    return latestModifyRegenRouting.modifyRegenRouting_status === 'completed';
  };

  useEffect(() => {
    if (!applications || applications.length === 0) {
      setLastModifyRegenRoutingStatus(null);
      return;
    }

    if (duplicateWarning) {
      setLastModifyRegenRoutingStatus({
        status: '發現相同參數的實驗記錄，請先查看歷史紀錄',
        style:
          'bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-sm font-medium ml-4'
      });
      return;
    }

    const latestModifyRegenRouting = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });

    const statusMap = {
      simulation_failed: 'Failed',
      completed: '',
      None: 'None',
      processing: 'Processing'
    };

    const statusStyles = {
      None: 'bg-muted text-muted-foreground',
      Processing: 'bg-primary text-primary-foreground animate-pulse',
      Failed: 'bg-destructive text-destructive-foreground',
      Done: 'bg-accent text-accent-foreground'
    };

    const status =
      statusMap[latestModifyRegenRouting.modifyRegenRouting_status];
    const statusStyle = statusStyles[status];

    setLastModifyRegenRoutingStatus({
      status,
      style: `${statusStyle} px-2 py-1 rounded-sm text-sm font-medium ml-4`
    });
  }, [applications, duplicateWarning]);

  return (
    <PageContainer scrollable>
      <ToastProvider>
        <div className="mx-auto min-h-screen bg-black px-40 pt-32">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="flex items-center text-2xl font-bold">
                動態修復與重建
                <div key={statusKey}>
                  {lastModifyRegenRoutingStatus && (
                    <span className={lastModifyRegenRoutingStatus.style}>
                      {lastModifyRegenRoutingStatus.status}
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
                  disabled={isSimulating || isSubmitting}
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
              config={dynamic_recovery_reconstructionModifyRegenRoutingConfig}
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
