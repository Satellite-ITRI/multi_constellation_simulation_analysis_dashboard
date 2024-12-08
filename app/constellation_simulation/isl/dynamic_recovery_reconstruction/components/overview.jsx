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
} from '@/app/constellation_simulation/isl/dynamic_recovery_reconstruction/service';

const CONSTELLATION_FILES = [
  {
    value: 'TLE_3P_22Sats_29deg_F1.txt',
    label: '3 * 22'
  }
];

const ISL_METHODS = [
  {
    value: 'minMaxR',
    label: 'Min Max Range'
  }
];

export default function DynamicRepairPage() {
  const [formData, setFormData] = useState({
    TLE_inputFileName: '',
    ISLLinkMethod: '',
    execute_function: 'simISLBreakPerformance',
    avgISLPerSat: 2.5,
    degreeConstraint: 3
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { downloadResult, isDownloading } = useDownloadResult();
  const { applications } = useHandoverData();

  const generateUID = () => {
    return 'dr_' + Math.random().toString(36).substr(2, 9);
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
          avgISLPerSat: formData.avgISLPerSat,
          degreeConstraint: formData.degreeConstraint
        },
        f_user_uid: userData.user_uid
      };

      const response = await postAPI(
        'meta_data_mgt/dynamicRepair/create_analysis',
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
              <h1 className="text-2xl font-bold">動態修復與重建</h1>
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
                <label className="text-sm font-medium">平均ISL連結數</label>
                <Input
                  type="number"
                  value={formData.avgISLPerSat}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      avgISLPerSat: parseFloat(e.target.value)
                    }))
                  }
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">角度限制</label>
                <Input
                  type="number"
                  value={formData.degreeConstraint}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      degreeConstraint: parseInt(e.target.value)
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
