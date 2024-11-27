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

export default function SingleBeamE2ERoutingPage() {
  const [formData, setFormData] = useState({
    'constellation.config': 'TLE_6P_22Sats_29deg_F1.txt',
    'handover.timing': 'Nonpreemptive'
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
    if (!canDownloadResult()) return;
    const latestAnalysis = applications.reduce((prev, current) => {
      return prev.id > current.id ? prev : current;
    });
    try {
      await downloadResult(latestAnalysis.analysis_uid);
    } catch (error) {
      setError('下載結果失敗');
    }
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
                  disabled={!canDownloadResult() || isDownloading}
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
                  value={formData['constellation.config']}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      'constellation.config': value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇星系配置" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TLE_6P_22Sats_29deg_F1.txt">
                      TLE_6P_22Sats_29deg_F1.txt
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">換手時機</label>
                <Select
                  value={formData['handover.timing']}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      'handover.timing': value
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選擇換手時機" />
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
