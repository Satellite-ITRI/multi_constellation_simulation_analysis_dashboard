'use client';

// 1. 引入
import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { postAPI } from '@/app/api/entrypoint';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';
import CustomToast from '@/components/base/CustomToast';
import {
  useHandoverData,
  useSimulation,
  useDownloadResult
} from '@/app/constellation_simulation/handover/multibeam/service';

// 2. 常數定義
const STRATEGIES = ['MinRange'];
const TIMINGS = ['Preemptive', 'Nonpreemptive'];
const FLEETS = [
  { value: 'TLE_3P_22Sats_29deg_F1', label: '3 * 22' },
  { value: 'TLE_6P_22Sats_29deg_F1', label: '6 * 22' },
  { value: 'TLE_12P_22Sats_29deg_F7', label: '12 * 22' }
];
const CELL_UT_OPTIONS = [
  { value: '28Cell_1UT', label: '28 Cells, 1 UT' },
  { value: '38Cell_1UT', label: '38 Cells, 1 UT' }
];
const BEAM_COUNT_OPTIONS = [
  { value: 28, label: '28 Beams' },
  { value: 38, label: '37 Beams' }
];
const REUSE_FACTOR_OPTIONS = [{ value: 1, label: 'Factor 1' }];

// 3. 主要元件
export default function OverViewPage() {
  // 4. Hook 相關邏輯
  const router = useRouter();
  const {
    applications,
    isLoading,
    showToast,
    setShowToast,
    toastType,
    toastMessage,
    fetchHandoverData
  } = useHandoverData();
  const { downloadResult, isDownloading } = useDownloadResult();
  const { runSimulation, isSimulating } = useSimulation();

  const [formData, setFormData] = useState({
    handover_name: '',
    constellation: '',
    handover_strategy: '',
    handover_decision: '',
    beam_count: 28,
    reuse_factor: 1,
    cell_ut: '28Cell_1UT'
  });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateWarning, setDuplicateWarning] = useState(false);
  const [duplicateHandoverId, setDuplicateHandoverId] = useState(null);
  const [statusKey, setStatusKey] = useState(0);
  const [lastHandoverStatus, setLastHandoverStatus] = useState(null);
  const generateHandoverName = (formData) => {
    // 找到對應的標籤文字
    const fleetLabel =
      FLEETS.find((f) => f.value === formData.constellation)?.label?.replace(
        ' * ',
        'x'
      ) || '';
    const strategyLabel = formData.handover_strategy;
    const timingLabel = formData.handover_decision;
    const cellUtLabel =
      CELL_UT_OPTIONS.find((c) => c.value === formData.cell_ut)?.label?.replace(
        ' Cells, 1 UT',
        ''
      ) || '';
    const beamCountLabel = formData.beam_count;
    const reuseFactorLabel =
      REUSE_FACTOR_OPTIONS.find(
        (r) => r.value === formData.reuse_factor
      )?.label?.replace('Factor ', 'F') || '';

    // 組合名稱
    const name = `${fleetLabel}_${strategyLabel}_${timingLabel}_${cellUtLabel}Cell_1UT_${beamCountLabel}Beam_${reuseFactorLabel}`;

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

      // 原有的提交邏輯...
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
  useEffect(() => {
    console.log(applications);
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
  // 處理 beam count 變更的函數
  const handleBeamCountChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({
      ...prev,
      beam_count: value
    }));
  };
  // 處理歷史紀錄按鈕點擊
  const handleHistoryClick = () => {
    router.push('/constellation_simulation/handover/multibeam/history');
  };

  return (
    <PageContainer scrollable>
      <ToastProvider>
        <div className="mx-auto min-h-screen bg-gray-50 px-40 pt-32">
          <div className="mx-auto max-w-4xl">
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
                {/* 新增 flex container */}
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

            <div className="grid grid-cols-2 gap-6">
              {/* 星系選擇 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">星系配置</label>
                <Select
                  value={formData.constellation}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, constellation: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇星系" />
                  </SelectTrigger>
                  <SelectContent>
                    {FLEETS.map((fleet) => (
                      <SelectItem key={fleet.value} value={fleet.value}>
                        {fleet.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 策略選擇 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">換手策略</label>
                <Select
                  value={formData.handover_strategy}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      handover_strategy: value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇策略" />
                  </SelectTrigger>
                  <SelectContent>
                    {STRATEGIES.map((strategy) => (
                      <SelectItem key={strategy} value={strategy}>
                        {strategy}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {/* 時機選擇 */}
              <div className="space-y-2">
                <label className="text-sm font-medium">換手時機</label>
                <Select
                  value={formData.handover_decision}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      handover_decision: value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇決策時機" />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMINGS.map((timing) => (
                      <SelectItem key={timing} value={timing}>
                        {timing}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Cell/UT 配置</label>
                  <Select
                    value={formData.cell_ut}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, cell_ut: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇配置" />
                    </SelectTrigger>
                    <SelectContent>
                      {CELL_UT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {/* 新增 Beam Count 顯示 */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">波束數量</label>
                  <Input
                    type="number"
                    value={formData.beam_count}
                    onChange={handleBeamCountChange}
                    min={1}
                    max={100}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">重用因子</label>
                  <Select
                    value={formData.reuse_factor}
                    onValueChange={(value) =>
                      setFormData((prev) => ({
                        ...prev,
                        reuse_factor: parseInt(value)
                      }))
                    }
                    disabled
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="選擇重用因子" />
                    </SelectTrigger>
                    <SelectContent>
                      {REUSE_FACTOR_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
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
