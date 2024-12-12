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

export const coverageAnalysisConfig = {
  fields: {
    TLE_inputFileName: {
      label: '星系配置',
      type: 'select',
      options: [
        { value: 'TLE_3P_22Sats_29deg_F1.txt', label: '3 * 22' },
        { value: 'TLE_6P_22Sats_29deg_F1.txt', label: '6 * 22' },
        { value: 'TLE_12P_22Sats_29deg_F7.txt', label: '12 * 22' }
      ],
      gridSpan: 2
    },
    stationLatitude: {
      label: '站點緯度',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    stationLongitude: {
      label: '站點經度',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    stationAltitude: {
      label: '站點高度',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    minLatitude: {
      label: '最小緯度',
      type: 'number',
      validation: {
        required: true,
        min: -90,
        max: 0
      },
      gridSpan: 1
    },
    maxLatitude: {
      label: '最大緯度',
      type: 'number',
      validation: {
        required: true,
        min: 0,
        max: 90
      },
      gridSpan: 1
    },
    leastSatCount: {
      label: '最少衛星數量',
      type: 'number',
      validation: {
        required: true,
        min: 1
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    execute_function: 'simSatCoverageLatitude',
    stationLatitude: 25.049126147527762,
    stationLongitude: 121.51379754215354,
    stationAltitude: 0.192742,
    minLatitude: -50,
    maxLatitude: 50,
    leastSatCount: 1
  }
};

export const connectionTimeConfig = {
  fields: {
    TLE_inputFileName: {
      label: '星系配置',
      type: 'select',
      options: [
        { value: 'TLE_3P_22Sats_29deg_F1.txt', label: '3 * 22' },
        { value: 'TLE_6P_22Sats_29deg_F1.txt', label: '6 * 22' },
        { value: 'TLE_12P_22Sats_29deg_F7.txt', label: '12 * 22' }
      ],
      gridSpan: 2
    },
    stationLatitude: {
      label: '站點緯度',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    stationLongitude: {
      label: '站點經度',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    stationAltitude: {
      label: '站點高度',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    ISLLinkMethod: '',
    execute_function: 'simGroundStationCoverSat',
    stationLatitude: 25.049126147527762,
    stationLongitude: 121.51379754215354,
    stationAltitude: 0.192742
  }
};

export const phaseParameterConfig = {
  fields: {
    TLE_inputFileName: {
      label: '星系配置',
      type: 'select',
      options: [
        { value: 'TLE_3P_22Sats_29deg_F1.txt', label: '3 * 22' },
        { value: 'TLE_6P_22Sats_29deg_F1.txt', label: '6 * 22' },
        { value: 'TLE_12P_22Sats_29deg_F7.txt', label: '12 * 22' }
      ],
      gridSpan: 1
    },
    ISLLinkMethod: {
      label: 'ISL連結方法',
      type: 'select',
      options: [
        { value: 'minMaxR', label: 'minMaxR' },
        { value: 'minDiffAER', label: 'minDiffAER' },
        { value: 'relativePhasing', label: 'relativePhasing' },
        { value: 'minAvgR', label: 'minAvgR' }
      ],
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    ISLLinkMethod: 'minMaxR',
    execute_function: 'simMinDistanceBetweenSatellites'
  }
};

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
