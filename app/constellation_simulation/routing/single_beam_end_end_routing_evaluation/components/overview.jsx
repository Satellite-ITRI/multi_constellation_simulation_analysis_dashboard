// pages/single_beam_end_end_routing_evaluation-endToEndRouting.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SimulationForm from '@/components/base/SimulationForm';
import { single_beam_end_end_routing_evaluationEndToEndRoutingConfig } from '@/app/constellation_simulation/input_format';
import {
  useEndToEndRoutingData,
  useSimulation,
  useDownloadResult
} from '@/app/constellation_simulation/routing/single_beam_end_end_routing_evaluation/history/service';
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
    fetchEndToEndRoutingData
  } = useEndToEndRoutingData();
  const { downloadResult, isDownloading } = useDownloadResult();
  const { runSimulation, isSimulating } = useSimulation();

  const [lastEndToEndRoutingStatus, setLastEndToEndRoutingStatus] =
    useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [duplicateEndToEndRoutingId, setDuplicateEndToEndRoutingId] =
    useState(null);
  const [statusKey, setStatusKey] = useState(0);
  const [formData, setFormData] = useState(
    single_beam_end_end_routing_evaluationEndToEndRoutingConfig.defaultValues
  );

  const handleSubmit = async () => {
    setError('');
    setDuplicateWarning(false);
    setIsSubmitting(true);

    try {
      // ❶ 在送出前，先把 beamBandwidth 乘上 0.1 後，再用 toFixed + parseFloat 處理多餘小數
      const rawValue = Number(formData.islBandwidth) * 0.1;
      const fixedValue = parseFloat(rawValue.toFixed(4));
      // 例如保留 6 位小數 (你可改成 1, 2, 或其他需要的位數)

      const updatedFormData = {
        ...formData,
        islBandwidth: fixedValue
      };
      // 檢查重複實驗
      const keysToCheck = Object.keys(
        single_beam_end_end_routing_evaluationEndToEndRoutingConfig.defaultValues
      );
      const duplicateExperiment = applications?.find((app) => {
        const params = app.endToEndRouting_parameter || {};
        return keysToCheck.every((key) => {
          // 因為 updatedFormData 中已經把 beamBandwidth 改成乘以 0.1 的值了
          // 這裡會去比對更新後的數值
          return String(params[key]) === String(updatedFormData[key]);
        });
      });
      if (duplicateExperiment) {
        setDuplicateWarning(true);
        setDuplicateEndToEndRoutingId(duplicateExperiment.endToEndRouting_uid);
        setIsSubmitting(false);
        return;
      }

      // 取得使用者資訊
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.user_uid) {
        throw new Error('未找到使用者資料');
      }

      // 產生實驗名稱
      const endToEndRoutingName = generateEndToEndRoutingName();

      // 組合參數
      const endToEndRouting_parameter = Object.entries(updatedFormData).reduce(
        (acc, [key, value]) => {
          acc[key] = String(value);
          return acc;
        },
        {}
      );

      // 最終要送往後端的 payload
      const payload = {
        endToEndRouting_name: endToEndRoutingName,
        endToEndRouting_parameter,
        f_user_uid: userData.user_uid
      };

      // 建立 endToEndRouting
      const response = await postAPI(
        `meta_data_mgt/endToEndRoutingManager/create_endToEndRouting`,
        payload
      );

      if (response.data.status === 'success') {
        setShowToast(true);
        // 立即執行模擬
        try {
          await runSimulation(response.data.data.endToEndRouting_uid);
          await fetchEndToEndRoutingData();
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

    const latestEndToEndRouting = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });

    try {
      await downloadResult(latestEndToEndRouting.endToEndRouting_uid);
    } catch (error) {
      setError('下載結果失敗');
    }
  };

  const handleHistoryClick = () => {
    router.push(
      `/constellation_simulation/routing/single_beam_end_end_routing_evaluation/history`
    );
  };

  const generateEndToEndRoutingName = () => {
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `endToEndRouting_${randomStr}`;
  };

  const canDownloadResult = () => {
    if (!applications || applications.length === 0) return false;
    const latestEndToEndRouting = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });
    return latestEndToEndRouting.endToEndRouting_status === 'completed';
  };

  useEffect(() => {
    if (!applications || applications.length === 0) {
      setLastEndToEndRoutingStatus(null);
      return;
    }

    if (duplicateWarning) {
      setLastEndToEndRoutingStatus({
        status: '發現相同參數的實驗記錄，請先查看歷史紀錄',
        style:
          'bg-secondary text-secondary-foreground px-2 py-1 rounded-sm text-sm font-medium ml-4'
      });
      return;
    }

    const latestEndToEndRouting = applications.reduce((prev, current) => {
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
      statusMap[latestEndToEndRouting.endToEndRouting_status] || 'None';
    const statusStyle = statusStyles[status] || statusStyles.None;

    setLastEndToEndRoutingStatus({
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
                End-to-End繞送整合評估
                <div key={statusKey}>
                  {lastEndToEndRoutingStatus && (
                    <span className={lastEndToEndRoutingStatus.style}>
                      {lastEndToEndRoutingStatus.status}
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
              config={
                single_beam_end_end_routing_evaluationEndToEndRoutingConfig
              }
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
