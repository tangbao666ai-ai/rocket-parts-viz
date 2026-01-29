export type PartSpec = {
  id: string;
  name: string;
  desc: string[];
};

export const PARTS: PartSpec[] = [
  // Exterior
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
    id: 'payload_adapter',
    name: 'Payload Adapter',
    desc: [
      'Mechanical interface between payload and upper stage.',
      'Provides mounting points and separation interface.'
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
    id: 'interstage',
    name: 'Interstage',
    desc: [
      'Structural section between stages.',
      'Houses separation hardware and routes loads between stages.'
    ]
  },
  {
    id: 'stage1_shell',
    name: 'Stage 1 Airframe / Tank Shell',
    desc: [
      'Primary structural cylinder; often also forms the outer wall of propellant tanks.',
      'In this model we treat it as the outer shell of Stage 1.'
    ]
  },
  {
    id: 'stage2_shell',
    name: 'Stage 2 Airframe / Tank Shell',
    desc: [
      'Outer cylinder of the upper stage.',
      'Houses propellant tanks, avionics, and upper stage engine mount.'
    ]
  },
  {
    id: 'fins',
    name: 'Fins (Optional)',
    desc: [
      'Some rockets use aerodynamic fins for stability/control in atmosphere.',
      'Not all vehicles have fins; this is a simplified visual.'
    ]
  },

  // Internal tanks & structures (generic)
  {
    id: 'stage1_lox_tank',
    name: 'Stage 1 LOX Tank',
    desc: [
      'Stores liquid oxygen (oxidizer) for Stage 1.',
      'LOX + fuel are fed to engines through valves/lines.'
    ]
  },
  {
    id: 'stage1_fuel_tank',
    name: 'Stage 1 Fuel Tank',
    desc: [
      'Stores liquid fuel (e.g., RP-1 or methane) for Stage 1.',
      'Separated from LOX by a bulkhead/intertank structure.'
    ]
  },
  {
    id: 'common_bulkhead',
    name: 'Common Bulkhead (Concept)',
    desc: [
      'A shared wall between LOX and fuel tanks (used on some designs).',
      'Reduces mass but adds thermal/structural complexity.'
    ]
  },
  {
    id: 'tank_domes',
    name: 'Tank Domes',
    desc: [
      'Curved end-caps that close cylindrical tanks.',
      'Domes efficiently handle internal pressure loads.'
    ]
  },
  {
    id: 'stage2_lox_tank',
    name: 'Stage 2 LOX Tank',
    desc: [
      'Upper stage oxidizer tank.',
      'Smaller volume than Stage 1; used for orbit insertion burns.'
    ]
  },
  {
    id: 'stage2_fuel_tank',
    name: 'Stage 2 Fuel Tank',
    desc: [
      'Upper stage fuel tank.',
      'Feeds the upper stage engine for precision maneuvers.'
    ]
  },

  // Propulsion & feed system
  {
    id: 'engine_cluster',
    name: 'Engine Cluster',
    desc: [
      'Main engines that produce thrust by expelling high-speed exhaust.',
      'This model shows a simplified cluster.'
    ]
  },
  {
    id: 'engine_turbopump',
    name: 'Turbopump (Concept)',
    desc: [
      'High-speed pumps that raise propellant pressure before combustion.',
      'Driven by a turbine powered by hot gas (simplified here).' 
    ]
  },
  {
    id: 'engine_thrust_chamber',
    name: 'Thrust Chamber & Nozzle',
    desc: [
      'Where propellants burn and expand through the nozzle to create thrust.',
      'Nozzle shape affects efficiency at different altitudes.'
    ]
  },
  {
    id: 'gimbal_mount',
    name: 'Gimbal Mount (Concept)',
    desc: [
      'Allows the engine(s) to pivot for steering (thrust vector control).',
      'Often controlled by hydraulic/electric actuators.'
    ]
  },
  {
    id: 'feed_lines',
    name: 'Feed Lines (Concept)',
    desc: [
      'Piping that routes propellants from tanks to engines.',
      'Includes valves, sensors, and insulation in real vehicles.'
    ]
  },

  // Guidance / control / pressurization
  {
    id: 'avionics_bay',
    name: 'Avionics Bay',
    desc: [
      'Computers, IMU, power distribution, and communications.',
      'Runs guidance, navigation, and control (GNC).' 
    ]
  },
  {
    id: 'battery_pack',
    name: 'Battery / Power',
    desc: [
      'Provides electrical power for avionics, valves, and actuators.',
      'Some vehicles use batteries, others use fuel cells or generators.'
    ]
  },
  {
    id: 'pressurant_bottles',
    name: 'Pressurant Bottles (COPVs)',
    desc: [
      'High-pressure gas (e.g., helium) used to pressurize propellant tanks.',
      'Maintains feed pressure as propellant drains.'
    ]
  },
  {
    id: 'rcs_thrusters',
    name: 'RCS Thrusters (Concept)',
    desc: [
      'Small thrusters for attitude control, especially in space.',
      'Often used by the upper stage for pointing and settling propellants.'
    ]
  },

  // Separation
  {
    id: 'stage_separation',
    name: 'Stage Separation System (Concept)',
    desc: [
      'Hardware that separates stages (clamps, pushers, pyros, or pneumatic systems).',
      'This is simplified in the model.'
    ]
  }
];

export const PARTS_BY_ID = new Map(PARTS.map(p => [p.id, p] as const));
