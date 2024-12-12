'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useState } from 'react';
import { postAPI } from '@/app/api/entrypoint';
import { ToastProvider } from '@/components/ui/toast';
import {
  useHandoverData,
  useSimulation,
  useDownloadResult
} from '@/app/constellation_simulation/routing/point_multipoint_transmission/service';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
const ROUTING_ALGO = [{ value: 'TLE_12P_22Sats_29deg_F7', label: 'IslState' }];
const MULTIPATH = [
  {
    value: 'None',
    label: 'None'
  }
];
export default function SingleToMultiPage() {
  const [formData, setFormData] = useState({
    simulationFunction: 'simSingleSatCapacity',
    algorithm: ROUTING_ALGO[0].value,
    multi_path: MULTIPATH[0].value,
    'routing.ratio': 0.001,
    'routing.round': 10,
    'routing.simulationTime': 20,
    'routing.throughput': 1
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { downloadResult, isDownloading } = useDownloadResult();
  const { applications } = useHandoverData();

  const generateUID = () => {
    return 'sm_' + Math.random().toString(36).substr(2, 9);
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
        'meta_data_mgt/singleToMulti/create_analysis',
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
              <h1 className="text-2xl font-bold">單點對多點傳輸</h1>
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
                <label className="text-sm font-medium">路由演算法</label>
                <Select
                  value={formData.algorithm}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, algorithm: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {ROUTING_ALGO.map((fleet) => (
                      <SelectItem key={fleet.value} value={fleet.value}>
                        {fleet.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">多重路徑</label>
                <Select
                  value={formData.multi_path}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, multi_path: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="" />
                  </SelectTrigger>
                  <SelectContent>
                    {MULTIPATH.map((fleet) => (
                      <SelectItem key={fleet.value} value={fleet.value}>
                        {fleet.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">路由比例</label>
                <Input
                  type="number"
                  value={formData['routing.ratio']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      'routing.ratio': parseFloat(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">模擬次數</label>
                <Input
                  type="number"
                  value={formData['routing.round']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      'routing.round': parseInt(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">模擬時間</label>
                <Input
                  type="number"
                  value={formData['routing.simulationTime']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      'routing.simulationTime': parseInt(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{`傳輸量 (Gbps)`}</label>
                <Input
                  type="number"
                  value={formData['routing.throughput']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      'routing.throughput': parseInt(e.target.value)
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
