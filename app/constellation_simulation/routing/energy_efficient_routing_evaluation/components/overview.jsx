// pages/energy_efficient_routing_evaluation-saveErRouting.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SimulationForm from '@/components/base/SimulationForm';
import { energy_efficient_routing_evaluationSaveErRoutingConfig } from '@/app/constellation_simulation/input_format';
import {
  useSaveErRoutingData,
  useSimulation,
  useDownloadResult
} from '@/app/constellation_simulation/routing/energy_efficient_routing_evaluation/history/service';
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
    fetchSaveErRoutingData
  } = useSaveErRoutingData();
  const { downloadResult, isDownloading } = useDownloadResult();
  const { runSimulation, isSimulating } = useSimulation();

  const [lastSaveErRoutingStatus, setLastSaveErRoutingStatus] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [duplicateSaveErRoutingId, setDuplicateSaveErRoutingId] =
    useState(null);
  const [statusKey, setStatusKey] = useState(0);
  const [formData, setFormData] = useState(
    energy_efficient_routing_evaluationSaveErRoutingConfig.defaultValues
  );

  const handleSubmit = async () => {
    setError('');
    setDuplicateWarning(false);
    setIsSubmitting(true);

    try {
      const rawValue = Number(formData.ratio);
      const fixedValue = parseFloat(rawValue.toFixed(4));
      const rawValue1 = Number(formData.globalIslPacketDropRate);
      const fixedValue1 = parseFloat(rawValue1.toFixed(4));
      // 例如保留 6 位小數 (你可改成 1, 2, 或其他需要的位數)

      const updatedFormData = {
        ...formData,
        ratio: fixedValue,
        globalIslPacketDropRate: fixedValue1
      };
      // 取得我們想要檢查的鍵值 (可自行排除不想檢查的欄位)
      const keysToCheck = Object.keys(
        energy_efficient_routing_evaluationSaveErRoutingConfig.defaultValues
      );

      // 檢查重複實驗
      const duplicateExperiment = applications?.find((app) => {
        const params = app.saveErRouting_parameter || {};
        return keysToCheck.every((key) => {
          return String(params[key]) === String(updatedFormData[key]);
        });
      });
      if (duplicateExperiment) {
        setDuplicateWarning(true);
        setDuplicateSaveErRoutingId(duplicateExperiment.saveErRouting_uid);
        setIsSubmitting(false);
        return;
      }

      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.user_uid) {
        throw new Error('未找到使用者資料');
      }

      // 產生 saveErRouting_xxx 的隨機名稱
      const saveErRoutingName = generateSaveErRoutingName();

      // 將 formData 的欄位動態組成 saveErRouting_parameter
      const saveErRouting_parameter = Object.entries(updatedFormData).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        },
        {}
      );

      // 組合最終 payload (不再出現 formData 層)
      const payload = {
        saveErRouting_name: saveErRoutingName,
        saveErRouting_parameter: saveErRouting_parameter,
        f_user_uid: userData.user_uid
      };

      // 建立 saveErRouting
      const response = await postAPI(
        `meta_data_mgt/saveErRoutingManager/create_saveErRouting`,
        payload
      );

      if (response.data.status === 'success') {
        setShowToast(true);
        // 立即執行模擬
        try {
          await runSimulation(response.data.data.saveErRouting_uid);
          // 重新抓取 saveErRouting 資料
          await fetchSaveErRoutingData();
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
    const latestSaveErRouting = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });

    try {
      await downloadResult(latestSaveErRouting.saveErRouting_uid);
    } catch (error) {
      setError('下載結果失敗');
    }
  };

  const handleHistoryClick = () => {
    // 前往歷史紀錄頁面
    router.push(
      `/constellation_simulation/routing/energy_efficient_routing_evaluation/history`
    );
  };

  const generateSaveErRoutingName = () => {
    // 使用 Math.random() 搭配 toString(36) 產生 Base36 字串
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `saveErRouting_${randomStr}`;
  };

  // 檢查是否可以下載結果
  const canDownloadResult = () => {
    if (!applications || applications.length === 0) return false;
    const latestSaveErRouting = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });
    return latestSaveErRouting.saveErRouting_status === 'completed';
  };

  useEffect(() => {
    if (!applications || applications.length === 0) {
      setLastSaveErRoutingStatus(null);
      return;
    }

    if (duplicateWarning) {
      setLastSaveErRoutingStatus({
        status: '發現相同參數的實驗記錄，請先查看歷史紀錄',
        style:
          'bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-sm font-medium ml-4'
      });
      return;
    }

    const latestSaveErRouting = applications.reduce((prev, current) => {
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

    const status = statusMap[latestSaveErRouting.saveErRouting_status];
    const statusStyle = statusStyles[status];

    setLastSaveErRoutingStatus({
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
                節能繞送評估
                <div key={statusKey}>
                  {lastSaveErRoutingStatus && (
                    <span className={lastSaveErRoutingStatus.style}>
                      {lastSaveErRoutingStatus.status}
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
              config={energy_efficient_routing_evaluationSaveErRoutingConfig}
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
