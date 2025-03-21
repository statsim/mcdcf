const default_project = {
  autorun: false,
  model: {
    samples: 100,
    interval: 'Month',
    steps: 12,
    precision: 2,
    economic_growth: {
      active: true,
      type: 'Fixed',
      initial: 0,
      mean: 0,
      std: 0.1,
      df: 10,
      interval: 'Month',
      growth_values: [],
    },
    inflation: {
      active: true,
      type: 'Fixed',
      initial: 0,
      mean: 0,
      std: 0.1,
      df: 10,
      interval: 'Month',
      growth_values: [],
    },
    discount_rate: {
      active: true,
      type: 'Fixed',
      initial: 0,
      mean: 0,
      std: 0.1,
      df: 10,
      interval: 'Month',
      growth_values: [],
    }
  },
  property: {
    name: 'Example property',
    holdingPeriod: 5,
    debt: {
      amount: 0,
      term: 5,
      rate: 0,
      interval: 'Year',
    },
    purchase: {
      price: 0,
      costs: 0,
    },
    sale: {
      price: 0,
      costs: 0,
    }
  },
  taxes: {
    depreciation: {
      amount: 90,
      period: 27.5,
    },
    marginal_tax_rate: 40,
    capital_gains_tax_rate: 20,
    recapture_tax_rate: 25,
  },
  income: {
    items: []
  },
  expenses: {
    items: []
  },
  capex: {
    items: []
  }
}

const default_income = {
  id: 1,
  description: 'Item',
  active: true,
  amount: 22000,
  min: null,
  max: null,
  type: 'Absolute',
  amount_growth: {
    initial: 5,
    mean: 0,
    std: 0.1,
    df: 10,
    type: 'Fixed',
    interval: 'Year',
    factor: 1,
    target_values: [],
    growth_values: [],
  },
  units: 5,
  occupancy: 85,
  occupancy_growth: {
    initial: 0,
    mean: 0,
    std: 0,
    df: 10,
    type: 'Fixed',
    interval: 'Year',
    factor: 1,
    target_values: [],
    growth_values: [],
  },
  interval: 'Month',
}

const default_expense = {
  id: 1,
  description: 'Item',
  active: true,
  amount: 30000,
  min: null,
  max: null,
  type: 'Absolute',
  target: 'None',
  interval: 'Year',
  amount_growth: {
    initial: 5,
    mean: 0,
    std: 0,
    df: 10,
    type: 'Fixed',
    interval: 'Year',
    factor: 1,
    target_values: [],
    growth_values: [],
  },
}

const example_1_1 = {
  autorun: true,
  model: {
    samples: 1,
    interval: 'Year',
    steps: 10,
    precision: -3,
    economic_growth: {
      active: false,
    },
    inflation: {
      active: false,
    },
    discount_rate: {
      type: 'Fixed',
      initial: 12.5,
      interval: 'Year',
    }
  },
  property: {
    name: 'Simple property',
    holdingPeriod: 11,
    debt: {
      amount: 0,
      term: 20,
      rate: 8.0,
      interval: 'Year',
    },
    purchase: {
      price: 17_000_000,
      costs: 0,
    },
    sale: {
      price: 22_120_000,
      costs: 0,
    }
  },
  taxes: {
    depreciation: {
      amount: 81.26,
      period: 27.5,
    },
    marginal_tax_rate: 0,
    capital_gains_tax_rate: 0,
    recapture_tax_rate: 0,
  },
  income: {
    items: [
      {
        id: 1,
        description: 'Office Rent',
        active: true,
        amount: 4_590_000, // 30 per 170k sqft
        units: 1,
        min: null,
        max: null,
        type: 'Absolute',
        amount_growth: {
          initial: 3,
          type: 'Fixed',
          interval: 'Year',
        },
        occupancy: 95,
        occupancy_growth: {
          initial: 0,
          type: 'Fixed',
          interval: 'Year',
        },
        interval: 'Year',
      }
    ]
  },
  expenses: {
    items: [
      {
        id: 1,
        description: 'Expenses',
        active: true,
        amount: 2_550_000,
        type: 'Absolute',
        interval: 'Year',
        amount_growth: {
          initial: 3,
          type: 'Fixed',
          interval: 'Year',
        },
      }
    ]
  },
  capex: {
    items: [
      {
        id: 1,
        description: 'Capex',
        active: true,
        amount: 0.1,
        type: 'Relative',
        target: 'Net Operating Income',
        interval: 'Year',
        amount_growth: {
          initial: 0,
          type: 'Fixed',
          interval: 'Year',
        },
      }
    ]
  },
}

const example_1_2 = {
  autorun: true,
  model: {
    samples: 100,
    interval: 'Year',
    steps: 10,
    precision: -3,
    economic_growth: {
      active: false,
    },
    inflation: {
      active: false,
    },
    discount_rate: {
      type: 'Fixed',
      initial: 12.5,
      interval: 'Year',
    }
  },
  property: {
    name: 'Simple property',
    holdingPeriod: 11,
    debt: {
      amount: 0,
      term: 20,
      rate: 8.0,
      interval: 'Year',
    },
    purchase: {
      price: 17_000_000,
      costs: 0,
    },
    sale: {
      price: 22_120_000,
      costs: 0,
    }
  },
  taxes: {
    depreciation: {
      amount: 81.26,
      period: 27.5,
    },
    marginal_tax_rate: 0,
    capital_gains_tax_rate: 0,
    recapture_tax_rate: 0,
  },
  income: {
    items: [
      {
        id: 1,
        description: 'Office Rent',
        active: true,
        amount: 4_590_000, // 30 per 170k sqft
        units: 1,
        min: null,
        max: null,
        type: 'Absolute',
        amount_growth: {
          initial: 3,
          type: 'Sample Once',
          mean: 3,
          std: 1,
          df: 99,
          interval: 'Year',
        },
        occupancy: 95,
        occupancy_growth: {
          initial: 0,
          type: 'Fixed',
          interval: 'Year',
        },
        interval: 'Year',
      }
    ]
  },
  expenses: {
    items: [
      {
        id: 1,
        description: 'Expenses',
        active: true,
        amount: 2_550_000,
        type: 'Absolute',
        interval: 'Year',
        amount_growth: {
          initial: 3,
          type: 'Fixed',
          interval: 'Year',
        },
      }
    ]
  },
  capex: {
    items: [
      {
        id: 1,
        description: 'Capex',
        active: true,
        amount: 0.1,
        type: 'Relative',
        target: 'Net Operating Income',
        interval: 'Year',
        amount_growth: {
          initial: 0,
          type: 'Fixed',
          interval: 'Year',
        },
      }
    ]
  },
}


const example_2 = {
  model: {
    samples: 1,
    interval: 'Year',
    steps: 6,
    precision: -2,
    economic_growth: {
      active: false,
      type: 'Tabular',
      initial: 4,
      mean: 0,
      std: 0.1,
      df: 10,
      interval: 'Month',
      growth_values: [3.783784, 0, -2.083, 0, 0]
    },
    inflation: {
      active: true,
      type: 'Tabular',
      initial: 5,
      mean: 0.01,
      std: 0.1,
      df: 10,
      interval: 'Month',
      growth_values: [5, 5, 3.5, 3.5, 3.5]
    },
    discount_rate: {
      type: 'Tabular',
      initial: 5,
      mean: 0,
      std: 0.1,
      df: 10,
      interval: 'Month',
    }
  },
  property: {
    name: 'Example property',
    holdingPeriod: 5,
    debt: {
      amount: 8_000_000,
      term: 20,
      rate: 8.0,
      interval: 'Year',
    },
    purchase: {
      price: 11_444_500,
      costs:    150_000,
    },
    sale: {
      price: 17_800_000,
      costs:    890_000,
    }
  },
  taxes: {
    depreciation: {
      amount: 81.26,
      period: 27.5,
    },
    marginal_tax_rate: 40,
    capital_gains_tax_rate: 20,
    recapture_tax_rate: 25,
  },
  income: {
    items: [
      {
        id: 1,
        description: 'Two Bedroom',
        active: true,
        amount: 858,
        units: 50,
        min: null,
        max: null,
        type: 'Absolute',
        amount_growth: {
          type: 'Inflation',
          interval: 'Month',
          factor: 1,
        },
        occupancy: 100,
        occupancy_growth: {
          type: 'Economic Growth',
          interval: 'Year',
          factor: 1,
        },
        interval: 'Month',
      },
      {
        id: 2,
        description: 'One Bedroom',
        active: true,
        amount: 704,
        units: 150,
        min: null,
        max: null,
        type: 'Absolute',
        amount_growth: {
          type: 'Inflation',
          interval: 'Month',
          factor: 1,
        },
        occupancy: 100,
        occupancy_growth: {
          type: 'Economic Growth',
          interval: 'Year',
          factor: 1,
        },
        interval: 'Month',
      },
      {
        id: 3,
        description: 'Studio',
        active: true,
        amount: 528,
        units: 80,
        min: null,
        max: null,
        type: 'Absolute',
        amount_growth: {
          type: 'Inflation',
          interval: 'Month',
          factor: 1,
        },
        occupancy: 100,
        occupancy_growth: {
          type: 'Economic Growth',
          interval: 'Year',
          factor: 1,
        },
        interval: 'Month',
      },
    ]
  },
  expenses: {
    items: [
      {
        id: 1,
        description: 'Salaries',
        active: true,
        amount: 204000,
        min: null,
        max: null,
        type: 'Absolute',
        target: 'None',
        interval: 'Year',
        amount_growth: {
          initial: 3.5,
          mean: 0,
          std: 0,
          df: 10,
          type: 'Fixed',
          interval: 'Year',
          factor: 1,
          target_values: [],
          growth_values: [],
        },
      },
      {
        id: 2,
        description: 'Utilities',
        active: true,
        amount: 109000,
        min: null,
        max: null,
        type: 'Absolute',
        target: 'None',
        interval: 'Year',
        amount_growth: {
          initial: 3.5,
          mean: 0,
          std: 0,
          df: 10,
          type: 'Fixed',
          interval: 'Year',
          factor: 1,
          target_values: [],
          growth_values: [],
        },
      },
      {
        id: 3,
        description: 'Management fee',
        active: true,
        amount: 0.05,
        min: null,
        max: null,
        type: 'Relative',
        target: 'Gross Income',
        interval: 'Year',
        amount_growth: {
          initial: 0,
          mean: 0,
          std: 0,
          df: 10,
          type: 'Random Walk',
          interval: 'Month',
          factor: 1,
          target_values: [],
          growth_values: [],
        },
      },
    ]
  },
}

const example_3 = {
  model: {
    samples: 100,
    interval: 'Month',
    steps: 12,
    precision: 2,
    economic_growth: {
      active: true,
      type: 'Random Walk',
      initial: 4,
      mean: 0,
      std: 0.1,
      df: 10,
      interval: 'Month',
      growth_values: [],
    },
    inflation: {
      active: true,
      type: 'Random Walk',
      initial: 2,
      mean: 0.01,
      std: 0.1,
      df: 10,
      interval: 'Month',
      growth_values: [],
    },
    discount_rate: {
      active: true,
      type: 'Random Walk',
      initial: 5,
      mean: 0,
      std: 0.1,
      df: 10,
      interval: 'Month',
      growth_values: [],
    }
  },
  property: {
    name: 'Example property',
    holdingPeriod: 5,
    debt: {
      amount: 8000000,
      term: 20,
      rate: 8,
      interval: 'Month',
    },
    purchase: {
      price: 10000000,
      costs: 10000,
    },
    sale: {
      price: 11000000,
      costs: 20000,
    }
  },
  taxes: {
    depreciation: {
      amount: 90,
      period: 27.5,
    },
    marginal_tax_rate: 40,
    capital_gains_tax_rate: 20,
    recapture_tax_rate: 25,
  },
  income: {
    items: [
      {
        id: 1,
        description: 'Parking',
        active: true,
        amount: 22000,
        min: null,
        max: null,
        type: 'Absolute',
        amount_growth: {
          initial: 5,
          mean: 0,
          std: 0.1,
          df: 10,
          type: 'Random Walk',
          interval: 'Month',
          factor: 1,
          target_values: [],
          growth_values: [],
        },
        units: 5,
        occupancy: 85,
        occupancy_growth: {
          initial: 0,
          mean: 0,
          std: 0,
          df: 10,
          type: 'Random Walk',
          interval: 'Month',
          factor: 1,
          target_values: [],
          growth_values: [],
        },
        interval: 'Month',
      },
    ]
  },
  expenses: {
    items: [
      {
        id: 1,
        description: 'Insurance',
        active: true,
        amount: 30000,
        min: null,
        max: null,
        type: 'Absolute',
        target: 'None',
        interval: 'Year',
        amount_growth: {
          initial: 5,
          mean: 0,
          std: 0,
          df: 10,
          type: 'Random Walk',
          interval: 'Year',
          factor: 1,
          target_values: [],
          growth_values: [],
        },
      },
      {
        id: 2,
        description: 'Management fee',
        active: true,
        amount: 0.05,
        min: null,
        max: null,
        type: 'Relative',
        target: 'Gross Income',
        interval: 'Month',
        amount_growth: {
          initial: 0,
          mean: 0,
          std: 0,
          df: 10,
          type: 'Random Walk',
          interval: 'Month',
          factor: 1,
          target_values: [],
          growth_values: [],
        },
      },
    ]
  },

}

export {
  default_project,
  default_income,
  default_expense,
  example_1_1,
  example_1_2,
  example_2,
  example_3
}