'use client';

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
import { useState } from 'react';
import { postAPI } from '@/app/api/entrypoint';
import { ToastProvider } from '@/components/ui/toast';
import {
  useHandoverData,
  useSimulation,
  useDownloadResult
} from '@/app/constellation_simulation/constellation/coverage_analysis/service';
const CONSTELLATION_FILES = [
  {
    value: 'TLE_6P_22Sats_29deg_F1.txt',
    label: '6 * 22'
  }
];

const ISL_METHODS = [
  {
    value: 'minMaxR',
    label: 'Min Max Range'
  }
];

export default function CoverageAnalysisPage() {
  const [formData, setFormData] = useState({
    TLE_inputFileName: '',
    ISLLinkMethod: '',
    execute_function: 'simSatCoverageLatitude',
    stationLatitude: 25.049126147527762,
    stationLongitude: 121.51379754215354,
    stationAltitude: 0.192742,
    minLatitude: -50,
    maxLatitude: 50,
    leastSatCount: 1
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const generateUID = () => {
    return 'ca_' + Math.random().toString(36).substr(2, 9);
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
        analysis_parameter: {
          TLE_inputFileName: formData.TLE_inputFileName,
          ISLLinkMethod: formData.ISLLinkMethod,
          execute_function: formData.execute_function,
          stationLatitude: formData.stationLatitude,
          stationLongitude: formData.stationLongitude,
          stationAltitude: formData.stationAltitude,
          minLatitude: formData.minLatitude,
          maxLatitude: formData.maxLatitude,
          leastSatCount: formData.leastSatCount
        },
        f_user_uid: userData.user_uid
      };

      const response = await postAPI(
        'meta_data_mgt/coverageAnalysis/create_analysis',
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

  const isFormValid = () => {
    return formData.TLE_inputFileName && formData.ISLLinkMethod;
  };
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
    await downloadResult('latestHandover.handover_uid');
    // if (!canDownloadResult()) return;

    // // 找出 id 最大的記錄`
    // const latestHandover = applications.reduce((prev, current) => {
    //   return prev.id > current.id ? prev : current;
    // });

    // try {
    //   await downloadResult(latestHandover.handover_uid);
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
              <h1 className="text-2xl font-bold">覆蓋率分析</h1>
              <Button
                onClick={handleDownloadResult}
                // disabled={!canDownloadResult() || isDownloading}
                className="w-32"
              >
                {isDownloading ? '下載中...' : '查看結果'}
              </Button>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">星系檔案</label>
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
                    <SelectValue placeholder="選擇星系檔案" />
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
                <label className="text-sm font-medium">ISL連結方法</label>
                <Select
                  value={formData.ISLLinkMethod}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, ISLLinkMethod: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇連結方法" />
                  </SelectTrigger>
                  <SelectContent>
                    {ISL_METHODS.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        {method.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">站點緯度</label>
                <Input
                  type="number"
                  value={formData.stationLatitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stationLatitude: parseFloat(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">站點經度</label>
                <Input
                  type="number"
                  value={formData.stationLongitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stationLongitude: parseFloat(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">站點高度</label>
                <Input
                  type="number"
                  value={formData.stationAltitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      stationAltitude: parseFloat(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">最小緯度</label>
                <Input
                  type="number"
                  value={formData.minLatitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      minLatitude: parseInt(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">最大緯度</label>
                <Input
                  type="number"
                  value={formData.maxLatitude}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      maxLatitude: parseInt(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">最少衛星數量</label>
                <Input
                  type="number"
                  value={formData.leastSatCount}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      leastSatCount: parseInt(e.target.value)
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
