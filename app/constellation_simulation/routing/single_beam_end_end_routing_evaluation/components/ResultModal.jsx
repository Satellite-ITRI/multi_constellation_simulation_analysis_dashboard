// components/ResultModal.jsx
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';

const ResultModal = ({ isOpen, onClose, data }) => {
  const results = data?.handover_simulation_result?.handover_simulation_result;

  const resultGroups = {
    連接統計: {
      換手次數: results?.handover_count,
      換手失敗次數: results?.handover_fail_count,
      有效區間數: results?.valid_interval_count,
      '連接持續時間 (最大)': `${results?.connection_duration_max?.toFixed(
        2
      )} 秒`,
      '連接持續時間 (最小)': `${results?.connection_duration_min?.toFixed(
        2
      )} 秒`,
      '連接持續時間 (平均)': `${results?.connection_duration_mean?.toFixed(
        2
      )} 秒`
    },
    'SNR 數據': {
      '下行 SNR 最大值': `${results?.dl_snr_of_available_gs_of_cell_mean_max?.toFixed(
        2
      )} dB`,
      '下行 SNR 最小值': `${results?.dl_snr_of_available_gs_of_cell_mean_min?.toFixed(
        2
      )} dB`,
      '下行 SNR 平均值': `${results?.dl_snr_of_available_gs_of_cell_mean_mean?.toFixed(
        2
      )} dB`,
      '上行 SNR 最大值': `${results?.ul_snr_of_available_gs_of_cell_mean_max?.toFixed(
        2
      )} dB`,
      '上行 SNR 最小值': `${results?.ul_snr_of_available_gs_of_cell_mean_min?.toFixed(
        2
      )} dB`,
      '上行 SNR 平均值': `${results?.ul_snr_of_available_gs_of_cell_mean_mean?.toFixed(
        2
      )} dB`
    },
    距離與仰角: {
      距離最大值: `${results?.distance_of_available_gs_of_cell_mean_max?.toFixed(
        2
      )} km`,
      距離最小值: `${results?.distance_of_available_gs_of_cell_mean_min?.toFixed(
        2
      )} km`,
      距離平均值: `${results?.distance_of_available_gs_of_cell_mean_mean?.toFixed(
        2
      )} km`,
      仰角最大值: `${results?.elevation_of_available_gs_of_cell_mean_max?.toFixed(
        2
      )}°`,
      仰角最小值: `${results?.elevation_of_available_gs_of_cell_mean_min?.toFixed(
        2
      )}°`,
      仰角平均值: `${results?.elevation_of_available_gs_of_cell_mean_mean?.toFixed(
        2
      )}°`
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[50vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">模擬結果詳情</DialogTitle>
        </DialogHeader>
        <div className="mt-4 max-h-[50vh] space-y-6 overflow-y-auto">
          {Object.entries(resultGroups).map(([groupName, items]) => (
            <div key={groupName} className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                {groupName}
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(items).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm text-gray-500">{key}</p>
                    <p className="font-medium text-gray-900">
                      {value ?? '無數據'}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <DialogClose className="mt-4 w-full rounded-lg bg-primary px-4 py-2 font-bold text-white transition-all hover:bg-primary/90">
          關閉
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
};

export default ResultModal;
