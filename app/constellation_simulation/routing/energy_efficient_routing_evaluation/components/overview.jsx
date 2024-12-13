'use client';

import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import SimulationForm from '@/components/base/SimulationForm';
import { energyRoutingConfig } from '@/app/constellation_simulation/input_format';
import { useDownloadResult } from '@/app/constellation_simulation/routing/energy_efficient_routing_evaluation/service';
import { ToastProvider } from '@/components/ui/toast';
import { useState } from 'react';

export default function EnergyRoutingPage() {
  const [formData, setFormData] = useState(energyRoutingConfig.defaultValues);
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
              <h1 className="text-2xl font-bold">節能繞送評估</h1>
              <div className="flex gap-4">
                <Button onClick={handleDownloadResult} className="w-32">
                  {isDownloading ? '下載中...' : '查看結果'}
                </Button>
              </div>
            </div>

            <SimulationForm
              formData={formData}
              setFormData={setFormData}
              config={energyRoutingConfig}
            />
          </div>
        </div>
      </ToastProvider>
    </PageContainer>
  );
}
