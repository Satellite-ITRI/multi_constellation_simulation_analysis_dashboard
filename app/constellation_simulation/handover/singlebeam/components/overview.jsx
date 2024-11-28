'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import { postAPI } from '@/app/api/entrypoint';
import { ToastProvider, ToastViewport } from '@/components/ui/toast';
import CustomToast from '@/components/base/CustomToast';
import {
  useHandoverData,
  useSimulation,
  useDownloadResult
} from '@/app/constellation_simulation/handover/singlebeam/service';

const STRATEGIES = ['MinRange'];

const TIMINGS = ['Nonpreemptive'];

const FLEETS = [
  {
    value: 'TLE_3P_22Sats_29deg_F1',
    label: '3 * 22'
  },
  {
    value: 'TLE_6P_22Sats_29deg_F1',
    label: '6 * 22'
  },
  {
    value: 'TLE_12P_22Sats_29deg_F7',
    label: '12 * 22'
  }
];

const CELL_UT_OPTIONS = [{ value: '12', label: '台北車站' }];

const REUSE_FACTOR_OPTIONS = [
  { value: 1, label: 'Factor 1' }
  // { value: 3, label: 'Factor 3' },
  // { value: 4, label: 'Factor 4' }
];

export default function OverViewPage() {
  const {
    isLoading,
    showToast,
    setShowToast,
    toastType,
    toastMessage,
    fetchHandoverData
  } = useHandoverData();
  const { downloadResult, isDownloading } = useDownloadResult();
  const { applications } = useHandoverData(); // 新增這行來獲取 handover 資料

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
  const { runSimulation, isSimulating } = useSimulation();
  const [formData, setFormData] = useState({
    handover_name: 'test',
    constellation: '3 * 22',
    handover_strategy: '',
    handover_decision: '',
    beam_count: 1,
    reuse_factor: 1,
    cell_ut: '28Cell_1UT'
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateUID = () => {
    return 'ho_' + Math.random().toString(36).substr(2, 9);
  };

  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);
    // 驗證 beam count
    const beamCount = parseInt(formData.beam_count);
    if (isNaN(beamCount) || beamCount < 1 || beamCount > 100) {
      setError('波束數量必須是 1 到 100 之間的數字');
      setIsSubmitting(false);
      return;
    }
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.user_uid) {
        throw new Error('未找到使用者資料');
      }

      const handoverName = generateUID();
      const payload = {
        handover_name: handoverName,
        handover_parameter: {
          constellation: formData.constellation,
          handover_strategy: formData.handover_strategy,
          handover_decision: formData.handover_decision,
          beam_counts: beamCount, // 使用驗證過的數值
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
        fetchHandoverData();

        // 立即執行模擬
        try {
          await runSimulation(response.data.data.handover_uid);
          // 可以在這裡加入模擬成功的提示
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
  return (
    <PageContainer scrollable>
      <ToastProvider>
        <div className="mx-auto min-h-screen bg-gray-50 px-40 pt-32">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">單波束換手效能分析</h1>
              <div className="flex gap-4">
                {/* 新增 flex container */}
                <Button
                  onClick={handleDownloadResult}
                  // disabled={!canDownloadResult() || isDownloading}
                  className="w-32"
                >
                  {isDownloading ? '下載中...' : '查看結果'}
                </Button>
                {/* <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isSubmitting || isSimulating}
                  className="w-32"
                >
                  {isSubmitting || isSimulating ? '處理中...' : '執行分析'}
                </Button> */}
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
                  <label className="text-sm font-medium">UT 配置</label>
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
                {/* <div className="space-y-2">
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
                </div> */}
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
