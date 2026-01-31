export type PartSpec = {
  id: string;
  name: string;
  desc: string[];
};

// Saturn V–inspired (educational) internal/external parts.
// Goal: "how it works" cutaway, not CAD accuracy.
export const PARTS: PartSpec[] = [
  // Crew spacecraft
  {
    id: 'les',
    name: 'Launch Escape System (LES)',
    desc: [
      'Solid rocket escape tower used to pull the crew capsule away during an emergency.',
      'Jettisoned after leaving dense atmosphere.'
    ]
  },
  {
    id: 'command_module',
    name: 'Command Module (CM)',
    desc: [
      'Crew capsule for re-entry and splashdown.',
      'Contains the heat shield (not modeled) and crew systems (not modeled).'
    ]
  },
  {
    id: 'service_module',
    name: 'Service Module (SM)',
    desc: [
      'Houses propulsion, power, and consumables (Apollo concept).',
      'In this model it’s simplified to a cylinder.'
    ]
  },

  // External structure
  {
    id: 's_ic_shell',
    name: 'S-IC (Stage 1) — Outer Shell',
    desc: [
      'First stage used for liftoff. In reality: RP-1 (fuel) + LOX (oxidizer).',
      'Provides most of the thrust at launch (F-1 engines).'
    ]
  },
  {
    id: 'interstage_1_2',
    name: 'Interstage (S-IC → S-II)',
    desc: [
      'Structural adapter between Stage 1 and Stage 2.',
      'Contains separation hardware (simplified) and load paths.'
    ]
  },
  {
    id: 's_ii_shell',
    name: 'S-II (Stage 2) — Outer Shell',
    desc: [
      'Second stage. In reality: LH2 (fuel) + LOX (oxidizer).',
      'High-altitude ascent after first-stage separation.'
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
  {
    id: 's_ivb_shell',
    name: 'S-IVB (Stage 3) — Outer Shell',
    desc: [
      'Third stage. In reality: LH2 + LOX.',
      'Used for orbit insertion and translunar injection (TLI).' 
    ]
  },

  // Engines
  {
    id: 'stage1_engines',
    name: 'Stage 1 Engine Cluster (F-1 style, simplified)',
    desc: [
      'Five large engines providing liftoff thrust.',
      'This model shows simplified bells and mount ring.'
    ]
  },
  {
    id: 'stage2_engines',
    name: 'Stage 2 Engines (J-2 style, simplified)',
    desc: [
      'Five vacuum engines on the second stage (simplified).'
    ]
  },
  {
    id: 'stage3_engine',
    name: 'Stage 3 Engine (J-2 style, simplified)',
    desc: [
      'Single vacuum engine on the third stage (simplified).'
    ]
  },

  // Stage 1 internals
  {
    id: 's_ic_fuel_tank',
    name: 'S-IC Fuel Tank (RP-1 concept)',
    desc: [
      'Stores kerosene-like fuel (RP-1) for Stage 1 (concept).'
    ]
  },
  {
    id: 's_ic_lox_tank',
    name: 'S-IC LOX Tank',
    desc: [
      'Stores liquid oxygen (oxidizer) for Stage 1.'
    ]
  },
  {
    id: 's_ic_feed_lines',
    name: 'S-IC Feed Lines / Downcomers (concept)',
    desc: [
      'Pipes routing RP-1 and LOX from tanks down to the engine bay.',
      'Real vehicles include valves, sensors, insulation, and anti-vortex devices.'
    ]
  },
  {
    id: 's_ic_valves',
    name: 'S-IC Main Valves / Manifold (concept)',
    desc: [
      'Valves control propellant flow to engines.',
      'Manifolds split flow to multiple engines.'
    ]
  },
  {
    id: 's_ic_turbopumps',
    name: 'S-IC Turbopumps (concept)',
    desc: [
      'High-speed pumps raise propellant pressure before combustion.',
      'Driven by a turbine powered by hot gas (gas-generator cycle, concept).' 
    ]
  },
  {
    id: 's_ic_gas_generator',
    name: 'S-IC Gas Generator (concept)',
    desc: [
      'Small combustor that produces hot gas to drive turbines (concept).'
    ]
  },
  {
    id: 's_ic_thrust_structure',
    name: 'S-IC Thrust Structure / Engine Mount',
    desc: [
      'Structural frame that carries engine thrust loads into the stage.',
      'One of the most important load paths in the vehicle.'
    ]
  },
  {
    id: 's_ic_gimbals',
    name: 'S-IC Gimbal Actuators (concept)',
    desc: [
      'Actuators pivot engines for steering (thrust vector control).'
    ]
  },
  {
    id: 's_ic_copv',
    name: 'S-IC Pressurant Bottles (Helium COPVs, concept)',
    desc: [
      'High-pressure gas used to pressurize tanks as propellant drains.'
    ]
  },

  // Stage 2 internals
  {
    id: 's_ii_lh2_tank',
    name: 'S-II LH2 Tank (fuel)',
    desc: [
      'Liquid hydrogen tank (fuel) for Stage 2 (concept).',
      'Very low density → large volume tanks in real life.'
    ]
  },
  {
    id: 's_ii_lox_tank',
    name: 'S-II LOX Tank',
    desc: [
      'Liquid oxygen tank for Stage 2 (concept).'
    ]
  },
  {
    id: 's_ii_feed_lines',
    name: 'S-II Feed Lines (concept)',
    desc: [
      'Routes LH2/LOX to the J-2 engine cluster (concept).' 
    ]
  },
  {
    id: 's_ii_copv',
    name: 'S-II Pressurant Bottles (concept)',
    desc: [
      'Pressurization bottles (concept) maintaining propellant feed pressure.'
    ]
  },

  // Stage 3 internals
  {
    id: 's_ivb_lh2_tank',
    name: 'S-IVB LH2 Tank (fuel)',
    desc: [
      'Liquid hydrogen tank (fuel) for Stage 3 (concept).' 
    ]
  },
  {
    id: 's_ivb_lox_tank',
    name: 'S-IVB LOX Tank',
    desc: [
      'Liquid oxygen tank for Stage 3 (concept).'
    ]
  },
  {
    id: 's_ivb_feed_lines',
    name: 'S-IVB Feed Lines (concept)',
    desc: [
      'Routes LH2/LOX to the single J-2 engine (concept).' 
    ]
  },
  {
    id: 's_ivb_copv',
    name: 'S-IVB Pressurant Bottles (concept)',
    desc: [
      'Pressurization bottles (concept) for Stage 3.'
    ]
  },

  // Avionics detail
  {
    id: 'iu_imu',
    name: 'IMU (Inertial Measurement Unit) (concept)',
    desc: [
      'Measures rotation and acceleration for navigation.',
      'Key input for guidance and control.'
    ]
  },
  {
    id: 'iu_flight_computer',
    name: 'Flight Computer (concept)',
    desc: [
      'Computes guidance commands and controls staging/engine commands (concept).' 
    ]
  },
  {
    id: 'iu_power_bus',
    name: 'Power Distribution / Bus (concept)',
    desc: [
      'Distributes electrical power to avionics, sensors, and actuators (concept).' 
    ]
  },
  {
    id: 'wiring_harness',
    name: 'Wiring Harness (concept)',
    desc: [
      'Cables routing power and signals throughout the vehicle (concept).'
    ]
  }
];

export const PARTS_BY_ID = new Map(PARTS.map(p => [p.id, p] as const));
