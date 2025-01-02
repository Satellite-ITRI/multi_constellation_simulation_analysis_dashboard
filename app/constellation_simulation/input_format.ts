// input_format.ts

export interface InputOption {
  value: string | number;
  label: string;
}

export interface PageConfigField {
  label: string;
  type: 'select' | 'number' | 'text';
  options?: InputOption[];
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
  };
  gridSpan?: number;

  show?: boolean;
}

export interface PageConfig {
  title?: string;
  fields: {
    [key: string]: PageConfigField;
  };
  defaultValues: {
    [key: string]: any;
  };
}

export const coverage_analysisCoverageConfig: PageConfig = {
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
    },
    simStartTime: {
      label: '模擬開始時間',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 2,
      show: false
    },
    simEndTime: {
      label: '模擬開始時間',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 2,
      show: false
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    minLatitude: -50,
    maxLatitude: 50,
    leastSatCount: 1,
    simStartTime: 0,
    simEndTime: 600
  }
};

export const connection_time_simulationConnectedDurationConfig = {
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
    stationLatitude: 26.0,
    stationLongitude: 122.0,
    stationAltitude: 101
  }
};

export const phase_parameter_selectionPhaseConfig = {
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
    ISLLinkMethod: 'minMaxR'
  }
};

export const constellation_configuration_strategyConstellationStrategyConfig = {
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
        { value: 'minAERRange', label: 'minAERRange' }
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
    ISLLinkMethod: 'minAERRange',
    execute_function: 'simSatToAllRightSatDistance',
    observerId: 101
  }
};

export const energy_saving_connection_isl_disconnectionIslHoppingConfig = {
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
    avgISLPerSat: 2.5,
    degreeConstraint: 3
  }
};

export const dynamic_recovery_reconstructionModifyRegenRoutingConfig = {
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
    Action: {
      label: '動作',
      type: 'select',
      options: [
        { value: 'Recover', label: 'Recover' },
        { value: 'Regenerate', label: 'Regenerate' }
      ],
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
    Action: 'Recover',
    avgISLPerSat: 2.5,
    degreeConstraint: 3
  }
};

export const point_multipoint_transmissionOneToMultiConfig = {
  fields: {
    algorithm: {
      label: '路由演算法',
      type: 'select',
      options: [{ value: 'IslState', label: 'IslState' }],
      gridSpan: 1
    },
    multiPathCriteria: {
      label: '多重路徑',
      type: 'select',
      options: [
        { value: 'throughput', label: 'throughput' },
        { value: 'None', label: 'None' }
      ],
      gridSpan: 1
    },
    ratio: {
      label: '路由比例',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    round: {
      label: '模擬次數',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    simulationTime: {
      label: '模擬時間',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    throughput: {
      label: '傳輸量 (Gbps)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    algorithm: 'IslState',
    ratio: 0.001,
    multiPathCriteria: 'throughput',
    round: 10,
    simulationTime: 20,
    throughput: 1
  }
};

export const multipoint_multipoint_transmissionMultiToMultiConfig = {
  fields: {
    algorithm: {
      label: '路由演算法',
      type: 'select',
      options: [{ value: 'IslState', label: 'IslState' }],
      gridSpan: 1
    },
    multiPathCriteria: {
      label: '多重路徑',
      type: 'select',
      options: [
        { value: 'throughput', label: 'throughput' },
        { value: 'None', label: 'None' }
      ],
      gridSpan: 1
    },
    ratio: {
      label: '路由比例',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    round: {
      label: '模擬次數',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    simulationTime: {
      label: '模擬時間',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    throughput: {
      label: '傳輸量 (Gbps)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    algorithm: 'IslState',
    multiPathCriteria: 'throughput',
    ratio: 0.001,
    round: 10,
    simulationTime: 20,
    throughput: 1
  }
};

export const energy_efficient_routing_evaluationSaveErRoutingConfig = {
  fields: {
    blccVersion: {
      label: '星系配置',
      type: 'select',
      options: [
        { value: 'blcc3x22', label: '3 * 22' },
        { value: 'blcc6x22', label: '6 * 22' },
        { value: 'blcc12x22', label: '12 * 22' }
      ],
      gridSpan: 1
    },
    multiPathCriteria: {
      label: '多重路徑',
      type: 'select',
      options: [
        { value: 'blcc', label: 'blcc' },
        { value: 'None', label: 'None' }
      ],
      gridSpan: 1
    },
    ratio: {
      label: '路由比例',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    globalIslPacketDropRate: {
      label: 'ISL掉包率',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    collectionRate: {
      label: '每秒能量收集 (瓦)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    hardwareConsumption: {
      label: '硬體能量消耗 (瓦)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    maxBatteryCapacity: {
      label: '最大電池容量 (焦耳)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    receivePower: {
      label: '接收功率 (焦耳)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    transmitPower: {
      label: '傳輸功率 (焦耳)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    txBufferTimeLimit: {
      label: '傳輸緩衝時間限制 (秒)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    multiPathCriteria: 'blcc',
    ratio: 0.0001,
    globalIslPacketDropRate: 0,
    blccVersion: 'blcc3x22',
    collectionRate: 20,
    hardwareConsumption: 4,
    maxBatteryCapacity: 11700000,
    receivePower: 0,
    transmitPower: 0.85,
    txBufferTimeLimit: 20
  }
};

export const single_beam_end_end_routing_evaluationEndToEndRoutingConfig = {
  fields: {
    TLE_inputFileName: {
      label: '星系配置',
      type: 'select',
      options: [
        { value: 'TLE_6P_22Sats_29deg_F1.txt', label: '6 * 22' },
        { value: 'TLE_12P_22Sats_29deg_F7.txt', label: '12 * 22' }
      ],
      gridSpan: 1
    },
    handoverDecision: {
      label: '換手決策',
      type: 'select',
      options: [
        { value: 'LoadBalancing', label: 'Load Balancing' },
        {
          value: 'SatelliteLoadBalancing',
          label: 'Satellite Load Balancing'
        }
      ],
      gridSpan: 1
    },
    useCaseVersion: {
      label: '評估情境',
      type: 'select',
      options: [
        { value: '237UTsSatelliteLB', label: '237UTs' },
        {
          value: '150UTsAccessLink',
          label: '150UTsAccessLink'
        },
        { value: '150UTsAccessLinkScale', label: '150UTsAccessLinkScale' },
        {
          value: '150UTsAccessLinkLoadBalance',
          label: '150UTsAccessLinkLoadBalance'
        },
        {
          value: '150UTsAccessLinkLoadBalanceScale',
          label: '150UTsAccessLinkLoadBalanceScale'
        }
      ],
      gridSpan: 1
    },
    handover_strategy: {
      label: '換手策略',
      type: 'select',
      options: [
        { value: 'MinRange', label: 'MinRange' },
        { value: 'MaxVisibleTime', label: 'MaxVisibleTime' },
        { value: 'MinAvrRange', label: 'MinAvrRange' },
        { value: 'MaxElevation', label: 'MaxElevation' },
        { value: 'MaxSNR', label: 'MaxSNR' }
      ],
      gridSpan: 1
    },

    round: {
      label: '模擬次數',
      type: 'number',
      validation: {
        required: true,
        min: 1
      },
      gridSpan: 1
    },
    time: {
      label: '模擬時間',
      type: 'number',
      validation: {
        required: true,
        min: 1
      },
      gridSpan: 1
    },
    ActiveUserRatio: {
      label: '當前活躍用戶終端比例',
      type: 'number',
      validation: {
        required: true,
        min: 0,
        max: 1
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_6P_22Sats_29deg_F1.txt',
    handover_strategy: 'MinRange',
    handoverDecision: 'LoadBalancing',
    useCaseVersion: '237UTsSatelliteLB',
    round: 1,
    time: 1,
    ActiveUserRatio: 0.5
  }
};

export const singlebeamHandoverConfig = {
  fields: {
    constellation: {
      label: '星系配置',
      type: 'select',
      options: [
        { value: 'TLE_3P_22Sats_29deg_F1', label: '3 * 22' },
        { value: 'TLE_6P_22Sats_29deg_F1', label: '6 * 22' },
        { value: 'TLE_12P_22Sats_29deg_F7', label: '12 * 22' }
      ],
      gridSpan: 1
    },
    handover_strategy: {
      label: '換手策略',
      type: 'select',
      options: [{ value: 'MinRange', label: 'MinRange' }],
      gridSpan: 1
    },
    handover_decision: {
      label: '換手決策',
      type: 'select',
      options: [
        { value: 'Preemptive', label: 'Preemptive' },
        { value: 'Nonpreemptive', label: 'Nonpreemptive' }
      ],
      gridSpan: 1
    },
    cell_ut: {
      label: 'UT 配置',
      type: 'select',
      options: [{ value: '12', label: '台北車站' }],
      gridSpan: 1
    }
  },
  defaultValues: {
    handover_name: 'test',
    constellation: 'TLE_3P_22Sats_29deg_F1',
    handover_strategy: 'MinRange',
    handover_decision: 'Nonpreemptive',
    beam_count: 1,
    reuse_factor: 1,
    cell_ut: '12'
  }
};

export const gsoProtectionConfig = {
  fields: {
    TLE_inputFileName: {
      label: '星系配置檔案',
      type: 'select',
      options: [
        { value: 'TLE_3P_22Sats_29deg_F1', label: '3 * 22' },
        { value: 'TLE_6P_22Sats_29deg_F1', label: '6 * 22' },
        { value: 'TLE_12P_22Sats_29deg_F7', label: '12 * 22' }
      ],
      gridSpan: 1
    },
    'handover.strategy': {
      label: '換手策略',
      type: 'select',
      options: [{ value: 'MinRange', label: 'MinRange' }],
      gridSpan: 1
    },
    handover_decision: {
      label: '換手決策',
      type: 'select',
      options: [
        { value: 'Preemptive', label: 'Preemptive' },
        { value: 'Nonpreemptive', label: 'Nonpreemptive' }
      ],
      gridSpan: 1
    },
    'station.latitude': {
      label: '地面站緯度',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'station.longitude': {
      label: '地面站經度',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    },
    'station.altitude': {
      label: '地面站海拔高度 (公里)',
      type: 'number',
      validation: {
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1',
    'handover.strategy': 'MinRange',
    handover_decision: 'Nonpreemptive',
    'station.latitude': 25.05,
    'station.longitude': 121.51,
    'station.altitude': 0.19
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
