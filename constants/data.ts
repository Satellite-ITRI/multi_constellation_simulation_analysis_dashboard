import { NavItem } from '@/types';

export type User = {
  id: number;
  name: string;
  company: string;
  role: string;
  verified: boolean;
  status: string;
};
export const users: User[] = [
  {
    id: 1,
    name: 'Candice Schiner',
    company: 'Dell',
    role: 'Frontend Developer',
    verified: false,
    status: 'Active'
  },
  {
    id: 2,
    name: 'John Doe',
    company: 'TechCorp',
    role: 'Backend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 3,
    name: 'Alice Johnson',
    company: 'WebTech',
    role: 'UI Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 4,
    name: 'David Smith',
    company: 'Innovate Inc.',
    role: 'Fullstack Developer',
    verified: false,
    status: 'Inactive'
  },
  {
    id: 5,
    name: 'Emma Wilson',
    company: 'TechGuru',
    role: 'Product Manager',
    verified: true,
    status: 'Active'
  },
  {
    id: 6,
    name: 'James Brown',
    company: 'CodeGenius',
    role: 'QA Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 7,
    name: 'Laura White',
    company: 'SoftWorks',
    role: 'UX Designer',
    verified: true,
    status: 'Active'
  },
  {
    id: 8,
    name: 'Michael Lee',
    company: 'DevCraft',
    role: 'DevOps Engineer',
    verified: false,
    status: 'Active'
  },
  {
    id: 9,
    name: 'Olivia Green',
    company: 'WebSolutions',
    role: 'Frontend Developer',
    verified: true,
    status: 'Active'
  },
  {
    id: 10,
    name: 'Robert Taylor',
    company: 'DataTech',
    role: 'Data Analyst',
    verified: false,
    status: 'Active'
  }
];

export type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  gender: string;
  date_of_birth: string; // Consider using a proper date type if possible
  street: string;
  city: string;
  state: string;
  country: string;
  zipcode: string;
  longitude?: number; // Optional field
  latitude?: number; // Optional field
  job: string;
  profile_picture?: string | null; // Profile picture can be a string (URL) or null (if no picture)
};

export type Product = {
  photo_url: string;
  name: string;
  description: string;
  created_at: string;
  price: number;
  id: number;
  category: string;
  updated_at: string;
};

export const navItems: NavItem[] = [
  {
    title: 'Home',
    url: '/constellation_simulation',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd']
  },
  {
    title: 'Constellation',
    url: '/constellation_simulation/constellation',
    icon: 'kanban',
    isActive: false,
    shortcut: ['c', 'c'],
    items: [
      {
        title: '覆蓋率分析',
        url: '/constellation_simulation/constellation/coverage_analysis',
        shortcut: ['c', 'a']
      },
      {
        title: '連線時間模擬',
        url: '/constellation_simulation/constellation/connection_time_simulation',
        shortcut: ['ct', 's']
      },
      {
        title: '相位參數選擇',
        url: '/constellation_simulation/constellation/phase_parameter_selection',
        shortcut: ['pp', 's']
      },
      {
        title: '星系構型與策略',
        url: '/constellation_simulation/constellation/constellation_configuration_strategy',
        shortcut: ['cc', 's']
      }
    ]
  },
  {
    title: 'ISL',
    url: '/constellation_simulation/isl',
    icon: 'kanban',
    isActive: false,
    shortcut: ['i', 'i'],
    items: [
      {
        title: '節能連線ISL斷線',
        url: '/constellation_simulation/isl/energy_saving_connection_isl_disconnection',
        shortcut: ['i', 'l']
      },
      {
        title: '動態修復與重建',
        url: '/constellation_simulation/isl/dynamic_recovery_reconstruction',
        shortcut: ['i', 'c']
      }
    ]
  },
  {
    title: 'Routing',
    url: '/constellation_simulation/routing',
    icon: 'product',
    isActive: false,
    shortcut: ['r', 'r'],
    items: [
      {
        title: '單點對多點傳輸',
        url: '/constellation_simulation/routing/point_multipoint_transmission',
        shortcut: ['r', 'p']
      },
      {
        title: '多點對多點傳輸',
        url: '/constellation_simulation/routing/multipoint_multipoint_transmission',
        shortcut: ['r', 't']
      },
      {
        title: '節能繞送評估',
        url: '/constellation_simulation/routing/energy_efficient_routing_evaluation',
        shortcut: ['r', 't']
      },
      {
        title: '單波束End-to-End繞送評估',
        url: '/constellation_simulation/routing/single_beam_end_end_routing_evaluation',
        shortcut: ['r', 't']
      }
    ]
  },
  {
    title: 'Handover',
    url: '/constellation_simulation/handover',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['h', 'h'],
    items: [
      {
        title: '單波束換手效能分析',
        url: '/constellation_simulation/handover/singlebeam',
        shortcut: ['h', 's']
      },
      {
        title: 'GSO Protection',
        url: '/constellation_simulation/handover/gso_protection',
        shortcut: ['h', 's']
      },
      {
        title: '多波束換手效能分析',
        url: '/constellation_simulation/handover/multibeam',
        shortcut: ['h', 'm']
      }
    ]
  }
  // {
  //   title: 'UT',
  //   url: '/constellation_simulation/ut',
  //   icon: 'dashboard',
  //   isActive: false,
  //   shortcut: ['h', 'h'],
  //   items: [
  //     {
  //       title: '星網功能模擬',
  //       url: '/constellation_simulation/ut/constellation_system_simulation',
  //       shortcut: ['h', 's']
  //     }
  //   ]
  // }
];
