export type PartSpec = {
  id: string;
  name: string;
  desc: string[];
};

export const PARTS: PartSpec[] = [
  {
    id: 'nose_cone',
    name: 'Nose Cone',
    desc: [
      'Streamlined tip that reduces aerodynamic drag.',
      'Often integrated with (or sits above) the payload fairing.'
    ]
  },
  {
    id: 'payload_fairing',
    name: 'Payload Fairing',
    desc: [
      'Protects the payload during ascent through the atmosphere.',
      'Typically jettisoned once outside dense air.'
    ]
  },
  {
    id: 'payload',
    name: 'Payload (Demo)',
    desc: [
      'The spacecraft / satellite / cargo the rocket is delivering.',
      'This is a simplified placeholder.'
    ]
  },
  {
    id: 'stage2_tank',
    name: 'Stage 2 Tank',
    desc: [
      'Holds propellants for the upper stage.',
      'Upper stage performs orbit insertion and precise burns.'
    ]
  },
  {
    id: 'interstage',
    name: 'Interstage',
    desc: [
      'Structural section between stages.',
      'Houses separation hardware and sometimes supports the upper stage engine nozzle.'
    ]
  },
  {
    id: 'stage1_tank',
    name: 'Stage 1 Tank',
    desc: [
      'Largest propellant volume; provides most of the liftoff thrust and early acceleration.'
    ]
  },
  {
    id: 'engine_cluster',
    name: 'Engine Cluster',
    desc: [
      'Main engines that produce thrust by expelling high-speed exhaust.',
      'This app shows a simplified cluster.'
    ]
  },
  {
    id: 'fins',
    name: 'Fins (Optional)',
    desc: [
      'Some rockets use aerodynamic fins for stability/control in atmosphere.',
      'Not all vehicles have fins; this is a simplified visual.'
    ]
  }
];

export const PARTS_BY_ID = new Map(PARTS.map(p => [p.id, p] as const));
