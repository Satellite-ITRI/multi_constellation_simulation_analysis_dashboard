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
} from '@/app/constellation_simulation/handover/gso_protection/service';

export default function GSOProtectionPage() {
  const [formData, setFormData] = useState({
    'tle.inputFileName': 'TLE_3P_22Sats_29deg_F1.txt',
    'handover.strategy': 'MinRange',
    'station.latitude': 25.05,
    'station.longitude': 121.51,
    'station.altitude': 0.19,
    'handover.decision': 'Nonpreemptive'
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { downloadResult, isDownloading } = useDownloadResult();
  const { applications } = useHandoverData();

  const generateUID = () => {
    return 'gp_' + Math.random().toString(36).substr(2, 9);
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
        'meta_data_mgt/gsoProtection/create_analysis',
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
              <h1 className="text-2xl font-bold">GSO Protection</h1>
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
                <label className="text-sm font-medium">星系配置檔案</label>
                <Select
                  value={formData['tle.inputFileName']}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      'tle.inputFileName': value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇配置檔案" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TLE_3P_22Sats_29deg_F1.txt">
                      TLE_3P_22Sats_29deg_F1.txt
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">換手策略</label>
                <Select
                  value={formData['handover.strategy']}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      'handover.strategy': value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇換手策略" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MinRange">MinRange</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">地面站緯度</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData['station.latitude']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      'station.latitude': parseFloat(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">地面站經度</label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData['station.longitude']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      'station.longitude': parseFloat(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  地面站海拔高度 (公里)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  value={formData['station.altitude']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      'station.altitude': parseFloat(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">換手決策</label>
                <Select
                  value={formData['handover.decision']}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      'handover.decision': value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇換手決策" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Nonpreemptive">Nonpreemptive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </ToastProvider>
    </PageContainer>
  );
}
