// input_format.ts
/**
 * 本檔案定義多星座模擬分析儀表板所有模擬情境的表單欄位格式、預設值與驗證規則。
 * 每個 export config 物件對應一種模擬情境，供 SimulationForm 等表單元件動態渲染欄位與驗證。
 * 方便維護者快速理解各參數意義與調整欄位。
 */

export interface InputOption {
  value: string | number; // 欄位可選值
  label: string;         // 顯示名稱
}

/**
 * PageConfigField 代表單一表單欄位的格式與驗證規則
 * - label: 欄位顯示名稱
 * - type: 欄位型態（select/number/text/decimal）
 * - options: 若為 select，提供選項
 * - validation: 驗證規則（最小/最大/必填）
 * - gridSpan: 欄位佔據的網格數
 * - show: 是否顯示（可用於動態顯示/隱藏）
 */
export interface PageConfigField {
  label: string;
  type: 'select' | 'number' | 'text' | 'decimal';
  options?: InputOption[];
  validation?: {
    min?: number;
    max?: number;
    required?: boolean;
  };
  gridSpan?: number;
  show?: boolean;
}

/**
 * PageConfig 代表一組模擬表單的格式
 * - fields: 各個欄位的設定
 * - defaultValues: 對應欄位的預設值
 */
export interface PageConfig {
  title?: string;
  fields: {
    [key: string]: PageConfigField;
  };
  defaultValues: {
    [key: string]: any;
  };
}

/**
 * 覆蓋分析模擬表單設定
 * - TLE_inputFileName: 星系配置選擇
 * - minLatitude/maxLatitude: 緯度範圍
 * - leastSatCount: 覆蓋所需最少衛星數
 * - simStartTime/simEndTime: 模擬時間區間
 */
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
      gridSpan: 1,
      show: false
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

/**
 * 連線時長模擬表單設定
 * - TLE_inputFileName: 星系配置
 * - stationLatitude/Longitude/Altitude: 地面站座標
 */
export const connection_time_simulationConnectedDurationConfig: PageConfig = {
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
      type: 'text',
      gridSpan: 1
    },
    stationLongitude: {
      label: '站點經度',
      type: 'text',
      gridSpan: 1
    },
    stationAltitude: {
      label: '站點高度',
      type: 'text',
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

/**
 * 參數選擇模擬表單設定
 * - TLE_inputFileName: 星系配置
 * - ISLLinkMethod: ISL連結方法
 */
export const phase_parameter_selectionPhaseConfig: PageConfig = {
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
      gridSpan: 1,
      show: false
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    ISLLinkMethod: 'minMaxR'
  }
};

/**
 * 星系策略模擬表單設定
 * - TLE_inputFileName: 星系配置
 * - observerId: 觀察者衛星ID
 * - ISLLinkMethod: ISL連結方法
 */
export const constellation_configuration_strategyConstellationStrategyConfig: PageConfig = {
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
    observerId: {
      label: '觀察者衛星ID',
      type: 'number',
      validation: {
        min: 101,
        max: 1222,
        required: true
      },
      gridSpan: 1
    },
    ISLLinkMethod: {
      label: 'ISL連結方法',
      type: 'select',
      options: [
        { value: 'minMaxR', label: 'minMaxR' },
        { value: 'minAERRange', label: 'minAERRange' }
      ],
      gridSpan: 1,
      show: false
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_3P_22Sats_29deg_F1.txt',
    ISLLinkMethod: 'minAERRange',
    observerId: '101'
  }
};

/**
 * ISL節能模擬表單設定
 * - TLE_inputFileName: 星系配置
 * - ISLLinkMethod: ISL連結方法
 * - avgISLPerSat: 平均ISL連結數
 * - degreeConstraint: ISL最大連線數
 */
export const energy_saving_connection_isl_disconnectionIslHoppingConfig: PageConfig = {
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
      type: 'text',
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

/**
 * 動態恢復/重建模擬表單設定
 * - TLE_inputFileName: 星系配置
 * - ISLLinkMethod: ISL連結方法
 * - Action: 動作
 * - avgISLPerSat: 平均ISL連結數
 * - degreeConstraint: ISL最大連線數
 */
export const dynamic_recovery_reconstructionModifyRegenRoutingConfig: PageConfig = {
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
      type: 'text',
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

/**
 * 能效路由評估模擬表單設定
 * - blccVersion: 星系配置
 * - multiPathCriteria: 傳輸路徑決策
 * - ratio: 傳輸數量比例
 * - globalIslPacketDropRate: ISL掉包率
 */
export const energy_efficient_routing_evaluationSaveErRoutingConfig: PageConfig = {
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
      label: '傳輸路徑決策',
      type: 'select',
      options: [
        { value: 'blcc', label: 'blcc' },
        { value: 'None', label: 'None' }
      ],
      gridSpan: 1
    },
    ratio: {
      label: '傳輸數量比例',
      type: 'text',

      gridSpan: 1
    },
    globalIslPacketDropRate: {
      label: 'ISL掉包率',
      type: 'text',

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

/**
 * 單波束端到端路由評估模擬表單設定
 * - TLE_inputFileName: 星系配置
 * - handoverDecision: 換手決策
 * - cell_ut: 評估情境
 * - flBeamCount: FT波束數量
 * - islBandwidth: ISL頻寬
 */
export const single_beam_end_end_routing_evaluationEndToEndRoutingConfig: PageConfig = {
  fields: {
    TLE_inputFileName: {
      label: '星系配置',
      type: 'select',
      options: [{ value: 'TLE_12P_22Sats_29deg_F7.txt', label: '12 * 22' }],
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
      show: false,
      gridSpan: 1
    },
    cell_ut: {
      label: '評估情境',
      type: 'select',
      options: [
        { value: '31Cell', label: '31 Cell' },
        // {
        //   value: '150UTsAccessLink',
        //   label: '150UTs'
        // },
        { value: '38Cell', label: '38 Cell' }
      ],
      gridSpan: 1
    },
    flBeamCount: {
      label: 'FT波束數量',
      type: 'select',
      options: [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' },
        { value: '4', label: '4' }
      ],
      gridSpan: 1
    },
    islBandwidth: {
      label: 'ISL頻寬(Gbps)',
      type: 'text',
      gridSpan: 1
    }
  },
  defaultValues: {
    TLE_inputFileName: 'TLE_12P_22Sats_29deg_F7.txt',
    handoverDecision: 'HybridLoadBalancing',
    cell_ut: '31Cell',
    islBandwidth: '4.2',
    flBeamCount: '1',
    gsoProtection: '1',
    beamCount: '16',
    handoverStrategy: 'MaxVisibleTimeCoverage',
    trafficDirection: '2'
  }
};

/**
 * 單波束設定模擬表單設定
 * - TLE_inputFileName: 星系配置
 * - handoverStrategy: 換手策略
 * - handoverDecision: 換手決策
 * - areaStationLatitudes: 站點緯度
 * - areaStationLongitudes: 站點經度
 * - areaStationAltitudes: 站點高度
 */
export const singlebeamSingleBeamConfig: PageConfig = {
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

/**
 * GSO保護模擬表單設定
 * - constellation: 星系配置
 * - handover_strategy: 換手策略
 * - handover_decision: 換手時機
 * - cell_ut: Cell/UT配置
 * - beams_per_satellite: 波束數量
 * - frequencies_per_satellite: 衛星頻率數
 */
export const gso_protectionGsoConfig: PageConfig = {
  fields: {
    constellation: {
      label: '星系配置',
      type: 'select',
      options: [
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
    constellation: 'TLE_6P_22Sats_29deg_F1',
    handover_strategy: 'MinRange',
    handover_decision: 'Nonpreemptive',
    gsoProtectionMode: '1',
    beams_per_satellite: '28',
    frequencies_per_satellite: '10',
    cell_ut: '35Cell_300UT',
    simStartTime: '0',
    simEndTime: '600',
    cell_topology_mode: 'dynamic',
    reuse_factor: 'None'
  }
};

/**
 * 多波束換手模擬表單設定
 * - constellation: 星系配置
 * - handover_strategy: 換手策略
 * - handover_decision: 換手時機
 * - cell_topology_mode: 頻率規劃
 * - gsoProtectionMode: GSO保護
 * - replacement_mode: 波束交換
 * - cell_ut: 評估情境
 * - beams_per_satellite: 波束數量
 * - frequencies_per_satellite: 衛星頻率數
 */
export const multibeamHandoverConfig: PageConfig = {
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
    cell_topology_mode: {
      label: '頻率規劃',
      type: 'select',
      options: [
        { value: 'dynamic', label: '動態' },
        { value: 'static', label: '靜態' }
      ]
    },
    gsoProtectionMode: {
      label: 'GSO Protection',
      type: 'select',
      options: [
        { value: '1', label: 'open' },
        { value: '0', label: 'close' }
      ]
    },
    replacement_mode: {
      label: '波束交換',
      type: 'select',
      options: [
        { value: '1', label: 'open' },
        { value: '0', label: 'close' }
      ]
    },
    cell_ut: {
      label: '評估情境',
      type: 'select',
      options: [
        { value: '31Cell_220UT', label: '31 Cells' },
        { value: '38Cell_300UT', label: '38 Cells' }
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
    },
    gso_protection_csv: {
      label: 'GSO 保護 CSV',
      type: 'text',
      gridSpan: 1,
      show: false
    }
  },
  defaultValues: {
    constellation: 'TLE_3P_22Sats_29deg_F1',
    handover_strategy: 'MinRange',
    handover_decision: 'Nonpreemptive',
    gsoProtectionMode: '0',
    replacement_mode: '0',
    beams_per_satellite: '28',
    frequencies_per_satellite: '10',
    cell_ut: '31Cell_220UT',
    simStartTime: '0',
    simEndTime: '86399',
    cell_topology_mode: 'dynamic',
    reuse_factor: 'None',
    gso_protection_csv: ''
  }
};

/**
 * 一對多傳輸模擬表單設定
 * - constellation: 星系配置
 * - multiPathCriteria: 傳輸路徑決策
 * - ratio: 傳輸數量比例
 */
export const point_multipoint_transmissionOneToMultiConfig: PageConfig = {
  fields: {
    constellation: {
      label: '星系配置',
      type: 'select',
      options: [
        { value: '3x22', label: '3 * 22' },
        { value: '6x22', label: '6 * 22' },
        { value: '12x22', label: '12 * 22' }
      ],
      gridSpan: 1
    },
    multiPathCriteria: {
      label: '傳輸路徑決策',
      type: 'select',
      options: [
        { value: 'throughput', label: 'throughput' },
        { value: 'None', label: 'None' }
      ],
      gridSpan: 1
    },
    ratio: {
      label: '傳輸數量比例',
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
    constellation: '3x22',
    ratio: '0.0001',
    multiPathCriteria: 'throughput'
  }
};

/**
 * 多對多傳輸模擬表單設定
 * - constellation: 星系配置
 * - multiPathCriteria: 傳輸路徑決策
 * - ratio: 傳輸數量比例
 */
export const multipoint_multipoint_transmissionMultiToMultiConfig: PageConfig = {
  fields: {
    constellation: {
      label: '星系配置',
      type: 'select',
      options: [
        { value: '3x22', label: '3 * 22' },
        { value: '6x22', label: '6 * 22' },
        { value: '12x22', label: '12 * 22' }
      ],
      gridSpan: 1
    },
    multiPathCriteria: {
      label: '傳輸路徑決策',
      type: 'select',
      options: [
        { value: 'throughput', label: 'throughput' },
        { value: 'None', label: 'None' }
      ],
      gridSpan: 1
    },
    ratio: {
      label: '傳輸數量比例',
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
    constellation: '3x22',
    multiPathCriteria: 'throughput',
    ratio: '0.0001'
  }
};
