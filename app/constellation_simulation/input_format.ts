// input_format.ts

export interface InputOption {
  value: string | number;
  label: string;
}

export interface PageConfigField {
  label: string;
  type: 'select' | 'number' | 'text' | 'decimal'; // 新增 'decimal'
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
      type: 'decimal',
      validation: {
        required: true,
        min: -90,
        max: 0
      },
      gridSpan: 1
    },
    maxLatitude: {
      label: '最大緯度',
      type: 'decimal',
      validation: {
        required: true,
        min: 0,
        max: 90
      },
      gridSpan: 1
    },
    leastSatCount: {
      label: '最少衛星數量',
      type: 'decimal',
      validation: {
        required: true,
        min: 1
      },
      gridSpan: 1
    },
    simStartTime: {
      label: '模擬開始時間',
      type: 'decimal',
      validation: {
        required: true
      },
      gridSpan: 2,
      show: false
    },
    simEndTime: {
      label: '模擬開始時間',
      type: 'decimal',
      validation: {
        required: true
      },
      gridSpan: 2,
      show: false
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    minLatitude: '-50',
    maxLatitude: '50',
    leastSatCount: '1',
    simStartTime: '0',
    simEndTime: '600'
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
      type: 'decimal',
      validation: {
        min: 0,
        max: 30,
        required: true
      },
      gridSpan: 1
    },
    stationLongitude: {
      label: '站點經度',
      type: 'decimal',
      validation: {
        min: 0,
        max: 130,
        required: true
      },
      gridSpan: 1
    },
    stationAltitude: {
      label: '站點高度',
      type: 'decimal',
      validation: {
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    stationLatitude: '26.0',
    stationLongitude: '122.0',
    stationAltitude: '0.01'
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
        min: 101,
        max: 1222,
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    ISLLinkMethod: 'minAERRange',
    observerId: '101'
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
      type: 'decimal',
      validation: {
        min: 0,
        max: 3,
        required: true
      },
      gridSpan: 1
    },
    degreeConstraint: {
      label: 'ISL最大連線數',
      type: 'number',
      validation: {
        min: 0,
        max: 3,
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    ISLLinkMethod: 'minMaxR',
    avgISLPerSat: '2.5',
    degreeConstraint: '3'
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
    Action: {
      label: '動作',
      type: 'select',
      options: [
        { value: 'Recover', label: 'Recover' },
        { value: 'Regenerate', label: 'Regenerate' }
      ],
      gridSpan: 1
    },
    avgISLPerSat: {
      label: '平均ISL連結數',
      type: 'decimal',
      validation: {
        min: 0,
        max: 3,
        required: true
      },
      gridSpan: 1
    },
    degreeConstraint: {
      label: 'ISL最大連線數',
      type: 'number',
      validation: {
        min: 0,
        max: 3,
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    ISLLinkMethod: 'minMaxR',
    Action: 'Recover',
    avgISLPerSat: '2.5',
    degreeConstraint: '3'
  }
};

export const point_multipoint_transmissionOneToMultiConfig = {
  fields: {
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
      type: 'decimal',
      validation: {
        min: 0,
        max: 1,
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    ratio: '0.0001',
    multiPathCriteria: 'throughput'
  }
};

export const multipoint_multipoint_transmissionMultiToMultiConfig = {
  fields: {
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
      type: 'decimal',
      validation: {
        min: 0,
        max: 1,
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    multiPathCriteria: 'throughput',
    ratio: '0.0001'
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
      type: 'decimal',
      validation: {
        min: 0,
        max: 1,
        required: true
      },
      gridSpan: 1
    },
    globalIslPacketDropRate: {
      label: 'ISL掉包率',
      type: 'number',
      validation: {
        min: 0,
        max: 1,
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    multiPathCriteria: 'blcc',
    ratio: '0.0001',
    globalIslPacketDropRate: '0',
    blccVersion: 'blcc3x22'
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
        },
        { value: '300UTs', label: '300UTs' }
      ],
      gridSpan: 1
    },
    beamBandwidth: {
      label: '波束頻寬',
      type: 'number',
      validation: {
        min: 1,
        max: 9999999999999,
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_6P_22Sats_29deg_F1.txt',
    handoverDecision: 'SatelliteLoadBalancing',
    useCaseVersion: '237UTsSatelliteLB',
    beamBandwidth: '216000000'
  }
};

export const singlebeamSingleBeamConfig = {
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
    handoverStrategy: {
      label: '換手策略',
      type: 'select',
      options: [{ value: 'MinRange', label: 'MinRange' }],
      gridSpan: 1
    },
    handoverDecision: {
      label: '換手決策',
      type: 'select',
      options: [
        { value: 'Preemptive', label: 'Preemptive' },
        { value: 'Nonpreemptive', label: 'Nonpreemptive' }
      ],
      gridSpan: 1
    },
    areaStationLatitudes: {
      label: '站點緯度',
      type: 'number',
      validation: {
        min: 0,
        max: 30,
        required: true
      },
      gridSpan: 1
    },
    areaStationLongitudes: {
      label: '站點經度',
      type: 'number',
      validation: {
        min: 0,
        max: 130,
        required: true
      },
      gridSpan: 1
    },
    areaStationAltitudes: {
      label: '站點高度',
      type: 'number',
      validation: {
        min: 0,
        max: 1,
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    handoverStrategy: 'MinRange',
    handoverDecision: 'Nonpreemptive',
    areaStationLatitudes: '22.6645',
    areaStationLongitudes: '120.3012',
    areaStationAltitudes: '0.01'
  }
};

export const gsoProtectionConfig = {
  fields: {
    TLE_inputFileName: {
      label: '星系配置',
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
      label: '換手時機',
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
        { value: '28Cell_220UT', label: '28 Cells, 220 UT' },
        { value: '35Cell_237UT', label: '38 Cells, 237 UT' },
        { value: '35Cell_300UT', label: '38 Cells, 300 UT' }
      ],
      gridSpan: 1
    },
    beams_per_satellite: {
      label: '波束數量',
      type: 'number',
      validation: {
        min: 1,
        max: 50,
        required: true
      },
      gridSpan: 1
    },
    frequencies_per_satellite: {
      label: '衛星頻率數',
      type: 'number',
      validation: {
        min: 1,
        max: 10,
        required: true
      },
      gridSpan: 1
    }
  },
  defaultValues: {
    constellation: 'TLE_3P_22Sats_29deg_F1',
    handover_strategy: 'MinRange',
    handover_decision: 'Nonpreemptive',
    gsoProtectionMode: 'false',
    beams_per_satellite: '28',
    frequencies_per_satellite: '10',
    cell_ut: '35Cell_300UT',
    simStartTime: '0',
    simEndTime: '600',
    cell_topology_mode: 'dynamic',
    reuse_factor: 'None'
  }
};
