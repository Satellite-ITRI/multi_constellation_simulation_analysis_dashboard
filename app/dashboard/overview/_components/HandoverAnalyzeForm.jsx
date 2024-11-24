'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { postAPI } from '@/app/api/entrypoint';
import { Alert, AlertDescription } from '@/components/ui/alert';

// 常數定義
const STRATEGIES = [
  'MaxVisibleTime',
  'MinRange',
  'MinAvrRange',
  'MaxElevation',
  'MaxSNR',
  'MaxPredictedAvgSNR'
];

const TIMINGS = ['Preemptive', 'Nonpreemptive'];

const FLEETS = [
  'TLE_3P_22Sats_29deg_F1',
  'TLE_6P_22Sats_29deg_F1',
  'TLE_12P_22Sats_29deg_F7'
];

const CELL_UT_OPTIONS = [
  { value: '28Cell_1UT', label: '28 Cells, 1 UT' },
  { value: '38Cell_1UT', label: '38 Cells, 1 UT' }
];

const BEAM_COUNT_OPTIONS = [
  { value: 28, label: '28 Beams' },
  { value: 38, label: '37 Beams' }
];

const REUSE_FACTOR_OPTIONS = [
  { value: 1, label: 'Factor 1' },
  { value: 3, label: 'Factor 3' },
  { value: 4, label: 'Factor 4' }
];

const HandoverAnalyzeForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    handover_name: '',
    constellation: '',
    handover_strategy: '',
    handover_decision: '',
    beam_count: 28,
    reuse_factor: 1,
    cell_ut: '28Cell_1UT'
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setIsLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData?.user_uid) {
        throw new Error('未找到使用者資料');
      }

      const payload = {
        handover_name: formData.handover_name,
        handover_parameter: {
          constellation: formData.constellation,
          handover_strategy: formData.handover_strategy,
          handover_decision: formData.handover_decision,
          beam_count: formData.beam_count,
          reuse_factor: formData.reuse_factor,
          cell_ut: formData.cell_ut
        },
        f_user_uid: userData.user_uid
      };

      const response = await postAPI(
        'meta_data_mgt/handoverManager/create_handover',
        payload
      );

      if (response.data.status === 'success') {
        onSuccess?.(response.data.data);
        onClose();
      } else if (
        response.data.status === 'error' &&
        response.data.existing_handover
      ) {
        setError('相同參數的交接班分析已存在');
      } else {
        throw new Error(response.data.message || '建立失敗');
      }
    } catch (error) {
      setError(error.message || '系統錯誤，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return (
      formData.handover_name &&
      formData.constellation &&
      formData.handover_strategy &&
      formData.handover_decision
    );
  };

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>建立交接班分析</CardTitle>
        <button
          onClick={onClose}
          className="rounded-full p-2 hover:bg-gray-100"
          disabled={isLoading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 分析名稱 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">分析名稱</label>
          <Input
            value={formData.handover_name}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                handover_name: e.target.value
              }))
            }
            placeholder="輸入分析名稱"
          />
        </div>

        {/* 星系選擇 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">星系</label>
          <Select
            value={formData.constellation}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, constellation: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="選擇星系" />
            </SelectTrigger>
            <SelectContent>
              {FLEETS.map((fleet) => (
                <SelectItem key={fleet} value={fleet}>
                  {fleet}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 策略選擇 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">策略</label>
          <Select
            value={formData.handover_strategy}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, handover_strategy: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="選擇策略" />
            </SelectTrigger>
            <SelectContent>
              {STRATEGIES.map((strategy) => (
                <SelectItem key={strategy} value={strategy}>
                  {strategy}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 時機選擇 */}
        <div className="space-y-2">
          <label className="text-sm font-medium">決策時機</label>
          <Select
            value={formData.handover_decision}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, handover_decision: value }))
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="選擇決策時機" />
            </SelectTrigger>
            <SelectContent>
              {TIMINGS.map((timing) => (
                <SelectItem key={timing} value={timing}>
                  {timing}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 其他參數設定 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Cell/UT 配置</label>
            <Select
              value={formData.cell_ut}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, cell_ut: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇配置" />
              </SelectTrigger>
              <SelectContent>
                {CELL_UT_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">重用因子</label>
            <Select
              value={formData.reuse_factor}
              onValueChange={(value) =>
                setFormData((prev) => ({
                  ...prev,
                  reuse_factor: parseInt(value)
                }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="選擇重用因子" />
              </SelectTrigger>
              <SelectContent>
                {REUSE_FACTOR_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Submit Button */}
        <Button
          className="mt-6 w-full"
          onClick={handleSubmit}
          disabled={!isFormValid() || isLoading}
        >
          {isLoading ? '處理中...' : '建立分析'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default HandoverAnalyzeForm;
