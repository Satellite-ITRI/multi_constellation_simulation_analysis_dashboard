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

export const constellationStrategyConfig = {
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
    },
    observerId: {
      label: '觀測者ID',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    ISLLinkMethod: 'minMaxR',
    execute_function: 'simSatToAllRightSatDistance',
    observerId: 101
  }
};

export const islBreakConfig = {
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
    },
    avgISLPerSat: {
      label: '平均ISL連結數',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    degreeConstraint: {
      label: '角度限制',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    ISLLinkMethod: 'minMaxR',
    execute_function: 'simISLBreakPerformance',
    avgISLPerSat: 2.5,
    degreeConstraint: 3
  }
};

export const dynamicRepairConfig = {
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
    },
    avgISLPerSat: {
      label: '平均ISL連結數',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    degreeConstraint: {
      label: '角度限制',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    ISLLinkMethod: 'minMaxR',
    execute_function: 'simISLBreakPerformance',
    avgISLPerSat: 2.5,
    degreeConstraint: 3
  }
};

export const singleToMultiConfig = {
  fields: {
    algorithm: {
      label: '路由演算法',
      type: 'select',
      options: [{ value: 'TLE_12P_22Sats_29deg_F7', label: 'IslState' }],
      gridSpan: 1
    },
    multi_path: {
      label: '多重路徑',
      type: 'select',
      options: [{ value: 'None', label: 'None' }],
      gridSpan: 1
    },
    'routing.ratio': {
      label: '路由比例',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'routing.round': {
      label: '模擬次數',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'routing.simulationTime': {
      label: '模擬時間',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'routing.throughput': {
      label: '傳輸量 (Gbps)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    simulationFunction: 'simSingleSatCapacity',
    algorithm: 'TLE_12P_22Sats_29deg_F7',
    multi_path: 'None',
    'routing.ratio': 0.001,
    'routing.round': 10,
    'routing.simulationTime': 20,
    'routing.throughput': 1
  }
};

export const multiToMultiConfig = {
  fields: {
    algorithm: {
      label: '路由演算法',
      type: 'select',
      options: [{ value: 'TLE_12P_22Sats_29deg_F7', label: 'IslState' }],
      gridSpan: 1
    },
    multi_path: {
      label: '多重路徑',
      type: 'select',
      options: [
        { value: 'None', label: 'None' },
        { value: 'throughput', label: 'throughput' },
        { value: 'blcc', label: 'blcc' }
      ],
      gridSpan: 1
    },
    'routing.ratio': {
      label: '路由比例',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'routing.round': {
      label: '模擬次數',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'routing.simulationTime': {
      label: '模擬時間',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'routing.throughput': {
      label: '傳輸量 (Gbps)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    simulationFunction: 'simSingleSatCapacity',
    algorithm: 'TLE_12P_22Sats_29deg_F7',
    multi_path: 'None',
    'routing.ratio': 0.001,
    'routing.round': 10,
    'routing.simulationTime': 20,
    'routing.throughput': 1
  }
};

export const energyRoutingConfig = {
  fields: {
    multi_path: {
      label: '多重路徑',
      type: 'select',
      options: [
        { value: 'None', label: 'None' },
        { value: 'throughput', label: 'throughput' },
        { value: 'blcc', label: 'blcc' }
      ],
      gridSpan: 1
    },
    'routing.ratio': {
      label: '路由比例',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'isl.ratio': {
      label: 'ISL掉包率',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'energy.collectionRate': {
      label: '每秒能量收集 (瓦)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'energy.hardwareConsumption': {
      label: '硬體能量消耗 (瓦)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'energy.maxBatteryCapacity': {
      label: '最大電池容量 (焦耳)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'energy.receivePower': {
      label: '接收功率 (焦耳)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'energy.transmitPower': {
      label: '傳輸功率 (焦耳)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'energy.txBufferTimeLimit': {
      label: '傳輸緩衝時間限制 (秒)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    multi_path: 'None',
    handover_strategy: 'MinRange',
    'isl.ratio': 0,
    'routing.ratio': 0.001,
    'energy.evaluation': true,
    'energy.efficiency': true,
    'energy.collectionRate': 20,
    'energy.hardwareConsumption': 4,
    'energy.maxBatteryCapacity': 11700000,
    'energy.receivePower': 0,
    'energy.transmitPower': 0.85,
    'energy.txBufferTimeLimit': 20
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
