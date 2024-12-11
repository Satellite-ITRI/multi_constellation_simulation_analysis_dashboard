'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Switch } from '@/components/ui/switch';
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
} from '@/app/constellation_simulation/routing/energy_efficient_routing_evaluation/service';

const EFFICIENCY = [
  {
    value: false,
    label: 'F'
  }
];
export default function EnergyRoutingPage() {
  const [formData, setFormData] = useState({
    'energy.evaluation': true,
    'energy.efficiency': true,
    'energy.collectionRate': 20,
    'energy.hardwareConsumption': 4,
    'energy.maxBatteryCapacity': 11700000,
    'energy.receivePower': 0,
    'energy.transmitPower': 0.85,
    'energy.txBufferTimeLimit': 20
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { downloadResult, isDownloading } = useDownloadResult();
  const { applications } = useHandoverData();

  const generateUID = () => {
    return 'er_' + Math.random().toString(36).substr(2, 9);
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
        'meta_data_mgt/energyRouting/create_analysis',
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
              <h1 className="text-2xl font-bold">節能繞送評估</h1>
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
                <label className="text-sm font-medium">每秒能量收集 (瓦)</label>
                <Input
                  type="number"
                  value={formData['energy.collectionRate']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      'energy.collectionRate': parseFloat(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">硬體能量消耗 (瓦)</label>
                <Input
                  type="number"
                  value={formData['energy.hardwareConsumption']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      'energy.hardwareConsumption': parseFloat(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  最大電池容量 (焦耳)
                </label>
                <Input
                  type="number"
                  value={formData['energy.maxBatteryCapacity']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      'energy.maxBatteryCapacity': parseFloat(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">接收功率 (焦耳)</label>
                <Input
                  type="number"
                  value={formData['energy.receivePower']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      'energy.receivePower': parseFloat(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">傳輸功率 (焦耳)</label>
                <Input
                  type="number"
                  value={formData['energy.transmitPower']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      'energy.transmitPower': parseFloat(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  傳輸緩衝時間限制 (秒)
                </label>
                <Input
                  type="number"
                  value={formData['energy.txBufferTimeLimit']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      'energy.txBufferTimeLimit': parseInt(e.target.value)
                    }))
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </ToastProvider>
    </PageContainer>
  );
}
