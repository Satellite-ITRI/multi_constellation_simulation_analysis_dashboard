'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import SimulationForm from '@/components/base/SimulationForm';
import { constellationStrategyConfig } from '@/app/constellation_simulation/input_format';
import { useDownloadResult } from '@/app/constellation_simulation/constellation/constellation_configuration_strategy/service';
import { ToastProvider } from '@/components/ui/toast';
import { useState } from 'react';

export default function ConstellationStrategyPage() {
  const [formData, setFormData] = useState(
    constellationStrategyConfig.defaultValues
  );
  const { downloadResult, isDownloading } = useDownloadResult();

  const handleDownloadResult = async () => {
    await downloadResult('latestAnalysis.analysis_uid');
  };

  return (
    <PageContainer scrollable>
      <ToastProvider>
        <div className="mx-auto min-h-screen bg-gray-50 px-40 pt-32">
          <div className="mx-auto max-w-4xl">
            <div className="mb-6 flex items-center justify-between">
              <h1 className="text-2xl font-bold">星系構型與策略</h1>
              <div className="flex gap-4">
                <Button onClick={handleDownloadResult} className="w-32">
                  {isDownloading ? '下載中...' : '查看結果'}
                </Button>
              </div>
            </div>

            <SimulationForm
              formData={formData}
              setFormData={setFormData}
              config={constellationStrategyConfig}
            />
          </div>
        </div>
      </ToastProvider>
    </PageContainer>
  );
}
