// components/SimulationForm.tsx

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface SimulationFormProps {
  formData: any;
  setFormData: (data: any) => void;
  config: any;
}

export default function SimulationForm({
  formData,
  setFormData,
  config
}: SimulationFormProps) {
  const renderField = (fieldName: string, fieldConfig: any) => {
    // 如果 show === false，就直接不渲染
    if (fieldConfig.show === false) {
      return null;
    }

    switch (fieldConfig.type) {
      case 'select':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">{fieldConfig.label}</label>
            <Select
              value={formData[fieldName]}
              onValueChange={(value) =>
                setFormData((prev: any) => ({ ...prev, [fieldName]: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={`選擇${fieldConfig.label}`} />
              </SelectTrigger>
              <SelectContent>
                {fieldConfig.options?.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'number':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">{fieldConfig.label}</label>
            <Input
              type="number"
              value={formData[fieldName]}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  [fieldName]: parseInt(e.target.value) || 0
                }))
              }
              min={fieldConfig.validation?.min}
              max={fieldConfig.validation?.max}
            />
          </div>
        );

      // 新增 decimal case：允許輸入浮點數，但在 state 中儲存為字串
      case 'decimal':
        return (
          <div className="space-y-2">
            <label className="text-sm font-medium">{fieldConfig.label}</label>
            <Input
              type="number"
              step="any" // 允許輸入小數
              value={formData[fieldName]}
              onChange={(e) =>
                setFormData((prev: any) => ({
                  ...prev,
                  [fieldName]: e.target.value // 直接存字串
                }))
              }
              min={fieldConfig.validation?.min}
              max={fieldConfig.validation?.max}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      {Object.entries(config.fields).map(
        ([fieldName, fieldConfig]: [string, any]) => {
          const spanClass = fieldConfig.gridSpan
            ? `col-span-${fieldConfig.gridSpan}`
            : '';
          return (
            <div key={fieldName} className={spanClass}>
              {renderField(fieldName, fieldConfig)}
            </div>
          );
        }
      )}
    </div>
  );
}
