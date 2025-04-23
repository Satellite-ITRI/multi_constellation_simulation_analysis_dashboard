// components/SimulationForm.tsx

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

/**
 * SimulationForm 元件 props 介面
 */
interface SimulationFormProps {
  /**
   * 當前表單資料
   */
  formData: any;
  /**
   * 設定表單資料的函式
   */
  setFormData: (data: any) => void;
  /**
   * 欄位設定（包含欄位型態、顯示、驗證等）
   */
  config: any;
}

/**
 * SimulationForm 元件
 * 用於動態渲染模擬參數表單。根據 config 內容自動產生欄位，支援 select、number 等型態。
 * @param formData 當前表單資料
 * @param setFormData 設定表單資料的函式
 * @param config 欄位設定（包含欄位型態、顯示、驗證等）
 */
export default function SimulationForm({
  formData,
  setFormData,
  config
}: SimulationFormProps) {
  /**
   * 動態渲染單一欄位
   * @param fieldName 欄位名稱
   * @param fieldConfig 欄位設定
   * @returns React 元素
   */
  const renderField = (fieldName: string, fieldConfig: any) => {
    // 如果 show === false，就直接不渲染
    if (fieldConfig.show === false) {
      return null;
    }

    switch (fieldConfig.type) {
      case 'select':
        // 下拉選單欄位
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
        // 數值輸入欄位
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
                  [fieldName]: parseInt(e.target.value) || 0
                }))
              }
              min={fieldConfig.validation?.min}
              max={fieldConfig.validation?.max}
            />
          </div>
        );
      case 'decimal':
        // 小數輸入欄位
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

  // 主渲染區塊，依據 config.fields 動態產生所有欄位
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
