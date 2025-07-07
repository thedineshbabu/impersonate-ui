export interface Client {
  id: string;
  name: string;
  description: string;
  subscribedProducts: string[];
}

export const clients: Client[] = [
  {
    id: '1',
    name: 'Client Alpha',
    description: 'Details about Client Alpha.',
    subscribedProducts: [
      'Pay & Markets',
      'Select',
      'Assess',
      'Profile Manager',
      'Content Library',
      'Organizational Data Collection',
      'Insight',
      'KF Architect',
      'Pay Equity',
    ],
  },
  {
    id: '2',
    name: 'Client Beta',
    description: 'Details about Client Beta.',
    subscribedProducts: [
      'Pay & Markets',
      'Select',
      'Assess',
      'Profile Manager',
      'Content Library',
      'Organizational Data Collection',
      'Insight',
      'KF Architect',
      'Pay Equity',
    ],
  },
  {
    id: '3',
    name: 'Client Gamma',
    description: 'Details about Client Gamma.',
    subscribedProducts: [
      'Pay & Markets',
      'Select',
      'Assess',
      'Profile Manager',
      'Content Library',
      'Organizational Data Collection',
      'Insight',
      'KF Architect',
      'Pay Equity',
    ],
  },
];
