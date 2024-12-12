'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useState } from 'react';
import { postAPI } from '@/app/api/entrypoint';
import { ToastProvider } from '@/components/ui/toast';
import {
  useHandoverData,
  useSimulation,
  useDownloadResult
} from '@/app/constellation_simulation/routing/single_beam_end_end_routing_evaluation/service';
const CONSTELLATION_FILES = [
  {
    value: 'TLE_3P_22Sats_29deg_F1.txt',
    label: '3 * 22'
  },
  {
    value: 'TLE_6P_22Sats_29deg_F1.txt',
    label: '6 * 22'
  },
  {
    value: 'TLE_12P_22Sats_29deg_F7.txt',
    label: '12 * 22'
  }
];

const STRATEGIES = [
  'MinRange',
  'MaxVisibleTime',
  'MinAvrRange',
  'MaxElevation',
  'MaxSNR'
];

const TIMINGS = [
  'Preemptive',
  'Nonpreemptive',
  'Load Balancing',
  'Hybrid Load Balancing',
  'Satellite Load Balancing',
  'Nonpreemptive Load Balancing',
  'Preemptive Load Balancing'
];

export default function SingleBeamE2ERoutingPage() {
  const [formData, setFormData] = useState({
    TLE_inputFileName: CONSTELLATION_FILES[0].value,
    handover_strategy: STRATEGIES[0],
    timing: TIMINGS[0],
    round: 1,
    time: 1,
    'active.user.ratio': 0.5
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { downloadResult, isDownloading } = useDownloadResult();
  const { applications } = useHandoverData();

  const generateUID = () => {
    return 'sb_' + Math.random().toString(36).substr(2, 9);
  };

  const handleSubmit = async () => {
    setError('');
    setIsSubmitting(true);

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.user_uid) {
        throw new Error('未找到使用者資料');
      }

      const analysisName = generateUID();
      const payload = {
        analysis_name: analysisName,
        analysis_parameter: formData,
        f_user_uid: userData.user_uid
      };

      const response = await postAPI(
        'meta_data_mgt/singleBeamE2E/create_analysis',
        payload
      );

      if (response.data.status !== 'success') {
        throw new Error(response.data.message || '建立失敗');
      }
    } catch (error) {
      setError(error.message || '系統錯誤，請稍後再試');
    } finally {
      setIsSubmitting(false);
    }
  };

  const canDownloadResult = () => {
    if (!applications || applications.length === 0) return false;
    const latestAnalysis = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });
    return latestAnalysis.status === 'completed';
  };

  const handleDownloadResult = async () => {
    await downloadResult('latestAnalysis.analysis_uid');
    // if (!canDownloadResult()) return;
    // const latestAnalysis = applications.reduce((prev, current) => {
    //   return prev.id > current.id ? prev : current;
    // });
    // try {
    //   await downloadResult(latestAnalysis.analysis_uid);
    // } catch (error) {
    //   setError('下載結果失敗');
    // }
  };

  return (
    <PageContainer scrollable>
      <ToastProvider>
        <div className="mx-auto min-h-screen bg-gray-50 px-40 pt-32">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">單波束End-to-End繞送評估</h1>
              <div className="flex gap-4">
                <Button
                  onClick={handleDownloadResult}
                  // disabled={!canDownloadResult() || isDownloading}
                  className="w-32"
                >
                  {isDownloading ? '下載中...' : '查看結果'}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">星系配置</label>
                <Select
                  value={formData.TLE_inputFileName}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      TLE_inputFileName: value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {CONSTELLATION_FILES.map((file) => (
                      <SelectItem key={file.value} value={file.value}>
                        {file.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
                    <SelectValue placeholder="" />
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
              <div className="space-y-2">
                <label className="text-sm font-medium">換手決策</label>
                <Select
                  value={formData.timing}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      timing: value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="" />
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
              <div className="space-y-2">
                <label className="text-sm font-medium">模擬次數</label>
                <Input
                  type="number"
                  value={formData.round}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      round: parseInt(e.target.value)
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">模擬時間</label>
                <Input
                  type="number"
                  value={formData.time}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      time: parseInt(e.target.value)
                    }))
                  }
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  當前活躍用戶終端比例
                </label>
                <Input
                  type="number"
                  min="0"
                  max="1"
                  step="0.01" // 設定步進值為0.01，讓使用者可以輸入兩位小數
                  value={formData['active.user.ratio']}
                  onChange={(e) => {
                    const value = parseFloat(e.target.value);
                    // 確保輸入值在0-1之間
                    if (value >= 0 && value <= 1) {
                      setFormData((prev) => ({
                        ...prev,
                        'active.user.ratio': value
                      }));
                    }
                  }}
                  onBlur={(e) => {
                    // 當離開輸入框時，確保值在有效範圍內
                    const value = parseFloat(e.target.value);
                    if (value < 0) {
                      setFormData((prev) => ({
                        ...prev,
                        'active.user.ratio': 0
                      }));
                    } else if (value > 1) {
                      setFormData((prev) => ({
                        ...prev,
                        'active.user.ratio': 1
                      }));
                    }
                  }}
                  placeholder="請輸入0-1之間的數值"
                />
              </div>
            </div>
          </div>
        </div>
      </ToastProvider>
    </PageContainer>
  );
}
