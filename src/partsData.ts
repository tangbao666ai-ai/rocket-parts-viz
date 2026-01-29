export type PartSpec = {
  id: string;
  name: string;
  desc: string[];
};

// Saturn V–inspired (educational, simplified) parts list.
export const PARTS: PartSpec[] = [
  // Top / spacecraft
  {
    id: 'les',
    name: 'Launch Escape System (LES)',
    desc: [
      'Solid rocket tower used to pull the crew capsule away in an emergency.',
      'Jettisoned after leaving dense atmosphere.'
    ]
  },
  {
    id: 'command_module',
    name: 'Command Module (CM)',
    desc: [
      'Crew capsule for re-entry and splashdown.',
      'On Saturn V, sat at the very top under the escape tower.'
    ]
  },
  {
    id: 'service_module',
    name: 'Service Module (SM)',
    desc: [
      'Provided propulsion, power, and life-support consumables (Apollo-era concept).',
      'This is a simplified placeholder cylinder.'
    ]
  },

  // Stages (outer shells)
  {
    id: 's_ivb_shell',
    name: 'S-IVB (3rd Stage) — Outer Shell',
    desc: [
      'Third stage used for Earth orbit insertion and translunar injection (TLI).',
      'Single-engine stage (J-2 style in this simplified model).'
    ]
  },
  {
    id: 's_ii_shell',
    name: 'S-II (2nd Stage) — Outer Shell',
    desc: [
      'Second stage, typically a 5-engine cluster (J-2 family in real Saturn V).',
      'Provides high-altitude ascent after first-stage separation.'
    ]
  },
  {
    id: 's_ic_shell',
    name: 'S-IC (1st Stage) — Outer Shell',
    desc: [
      'First stage used for liftoff, with a 5-engine cluster (F-1 in Saturn V).',
      'Provides the majority of thrust at launch.'
    ]
  },

  // Interstages / structure
  {
    id: 'interstage_1_2',
    name: 'Interstage (S-IC → S-II)',
    desc: [
      'Structural adapter between Stage 1 and Stage 2.',
      'Houses separation hardware and provides stiffness.'
    ]
  },
  {
    id: 'interstage_2_3',
    name: 'Interstage (S-II → S-IVB)',
    desc: [
      'Adapter between Stage 2 and Stage 3.',
      'Simplified ring/segment in this model.'
    ]
  },
  {
    id: 'instrument_unit',
    name: 'Instrument Unit (IU)',
    desc: [
      'Guidance and control ring (Saturn-era).',
      'Housed avionics for navigation and flight control.'
    ]
  },

  // Propulsion
  {
    id: 'stage1_engines',
    name: 'Stage 1 Engine Cluster (F-1 style, simplified)',
    desc: [
      'Five large engines providing liftoff thrust.',
      'This model shows simplified bells and a mount ring.'
    ]
  },
  {
    id: 'stage2_engines',
    name: 'Stage 2 Engines (J-2 style, simplified)',
    desc: [
      'Five vacuum-optimized engines for the second stage (simplified).'
    ]
  },
  {
    id: 'stage3_engine',
    name: 'Stage 3 Engine (J-2 style, simplified)',
    desc: [
      'Single vacuum engine for the third stage (simplified).'
    ]
  },

  // Internals (generic “as much as possible” without going full CAD)
  {
    id: 'lox_tank',
    name: 'LOX Tank (Concept)',
    desc: [
      'Liquid oxygen tank (oxidizer).',
      'Real Saturn V had separate LOX/fuel tanks per stage.'
    ]
  },
  {
    id: 'fuel_tank',
    name: 'Fuel Tank (Concept)',
    desc: [
      'Liquid fuel tank (e.g., RP-1 or LH2 depending on stage).',
      'This model uses generic internal cylinders.'
    ]
  },
  {
    id: 'feed_lines',
    name: 'Feed Lines (Concept)',
    desc: [
      'Piping routing propellants from tanks to engines.',
      'Includes valves/sensors/insulation on real vehicles.'
    ]
  },
  {
    id: 'pressurant_bottles',
    name: 'Pressurant Bottles (Concept)',
    desc: [
      'High-pressure gas bottles used for tank pressurization.',
      'Commonly helium in many designs.'
    ]
  }
];

export const PARTS_BY_ID = new Map(PARTS.map(p => [p.id, p] as const));
