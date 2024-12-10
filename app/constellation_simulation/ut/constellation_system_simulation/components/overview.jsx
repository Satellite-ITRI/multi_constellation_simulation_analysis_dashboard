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
} from '@/app/constellation_simulation/ut/constellation_system_simulation/service';

export default function ConstellationSystemSimulationPage() {
  const [formData, setFormData] = useState({
    GroundStation_Count: '100',
    UE_count: 1000,
    CPE_count: 50,
    UT_type: '手機',
    streaming: '上傳'
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { downloadResult, isDownloading } = useDownloadResult();
  const { applications } = useHandoverData();

  const generateUID = () => {
    return 'css_' + Math.random().toString(36).substr(2, 9);
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
        'meta_data_mgt/systemSimulation/create_analysis',
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

  const handleDownloadResult = async () => {
    await downloadResult('latestAnalysis.analysis_uid');
  };

  return (
    <PageContainer scrollable>
      <ToastProvider>
        <div className="mx-auto min-h-screen bg-gray-50 px-40 pt-32">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">星網功能模擬</h1>
              <div className="flex gap-4">
                <Button onClick={handleDownloadResult} className="w-32">
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
                <label className="text-sm font-medium">地面站數量</label>
                <Select
                  value={formData['GroundStation_Count']}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      GroundStation_Count: value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇地面站數量" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">100</SelectItem>
                    <SelectItem value="200">200</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">UE 數量</label>
                <Input
                  type="number"
                  value={formData['UE_count']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      UE_count: parseInt(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">CPE 數量</label>
                <Input
                  type="number"
                  value={formData['CPE_count']}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      CPE_count: parseInt(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">UT 類型</label>
                <Select
                  value={formData['UT_type']}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      UT_type: value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇 UT 類型" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="手機">手機</SelectItem>
                    <SelectItem value="CPE">CPE</SelectItem>
                    <SelectItem value="無人機">無人機</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">串流方向</label>
                <Select
                  value={formData['streaming']}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      streaming: value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇串流方向" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="上傳">上傳</SelectItem>
                    <SelectItem value="下載">下載</SelectItem>
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
