// input_format.ts
export interface InputOption {
  value: string | number;
  label: string;
}

export interface PageConfig {
  title: string;
  fields: {
    [key: string]: {
      label: string;
      type: 'select' | 'number' | 'text';
      options?: InputOption[];
      validation?: {
        min?: number;
        max?: number;
        required?: boolean;
      };
      gridSpan?: number; // 控制欄位寬度
    };
  };
  defaultValues: {
    [key: string]: any;
  };
}

export const multibeamHandoverConfig = {
  fields: {
    constellation: {
      label: '星系配置',
      type: 'select',
      options: [
        { value: 'TLE_3P_22Sats_29deg_F1', label: '3 * 22' },
        { value: 'TLE_6P_22Sats_29deg_F1', label: '6 * 22' },
        { value: 'TLE_12P_22Sats_29deg_F7', label: '12 * 22' }
      ]
    },
    handover_strategy: {
      label: '換手策略',
      type: 'select',
      options: [{ value: 'MinRange', label: 'MinRange' }]
    },
    handover_decision: {
      label: '換手時機',
      type: 'select',
      options: [
        { value: 'Preemptive', label: 'Preemptive' },
        { value: 'Nonpreemptive', label: 'Nonpreemptive' }
      ]
    },
    cell_ut: {
      label: 'Cell/UT 配置',
      type: 'select',
      options: [
        { value: '28Cell_1UT', label: '28 Cells, 1 UT' },
        { value: '38Cell_1UT', label: '38 Cells, 1 UT' }
      ],
      gridSpan: 1
    },
    beam_count: {
      label: '波束數量',
      type: 'number',
      validation: {
        min: 1,
        max: 100,
        required: true
      },
      gridSpan: 1
    },
    reuse_factor: {
      label: '頻率數',
      type: 'number',
      validation: {
        min: 1,
        max: 100,
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    constellation: 'TLE_3P_22Sats_29deg_F1',
    handover_strategy: 'MinRange',
    handover_decision: 'Nonpreemptive',
    beam_count: 28,
    reuse_factor: 1,
    cell_ut: '28Cell_1UT'
  }
};
