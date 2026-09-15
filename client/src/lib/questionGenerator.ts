// Procedural Question & Code Synthesizer for Pragati University Engineering Olympics 2026
// Generates 100% unique code snippets, variable names, parameters, and shuffled options per student roll number.

export type Difficulty = "Easy" | "Medium" | "Hard";
export type Discipline =
  | "Kinematics & Robotics"
  | "Thermodynamics"
  | "Solid Mechanics"
  | "Manufacturing & CNC"
  | "Fluid Power & Hydraulics"
  | "Control Systems";

export type Question = {
  id: number;
  title: string;
  discipline: Discipline;
  difficulty: Difficulty;
  language: string;
  prompt: string;
  code: string[];
  bug: string;
  answer: string;
  options: string[];
  hint: string;
  formula?: string;
  unitRigId?: string;
};

// Deterministic PRNG seeded by roll number
function createPrng(seedStr: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seedStr.length; i++) {
    h = Math.imul(h ^ seedStr.charCodeAt(i), 16777619);
  }
  let state = h >>> 0;

  return function next(min = 0, max = 1): number {
    state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
    const val = state / 4294967296;
    return min + Math.floor(val * (max - min + 1));
  };
}

function shuffleArray<T>(arr: T[], rng: (min?: number, max?: number) => number): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = rng(0, i);
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function generateMissionsForRoll(rollNumber: string): Question[] {
  const cleanRoll = rollNumber.trim().toUpperCase() || "25A31A0301";
  const rng = createPrng(cleanRoll);
  const suffix = cleanRoll.slice(-4).toLowerCase();

  // 10 Generators for distinct Mechanical Engineering Challenges:

  // Mission 1: Gear Train Ratio
  const g1_driverRPM = [900, 1200, 1500, 1800, 2400][rng(0, 4)];
  const g1_t1 = [16, 18, 20, 24, 25, 30][rng(0, 5)];
  const g1_ratioMult = [2, 3, 4, 5][rng(0, 3)];
  const g1_t2 = g1_t1 * g1_ratioMult;
  const g1_expectedRPM = Math.round(g1_driverRPM / g1_ratioMult);
  const g1_fn = `calc_gear_rpm_${suffix}`;
  const m1: Question = {
    id: 101,
    title: "Gear Train Velocity Ratio",
    discipline: "Kinematics & Robotics",
    difficulty: "Easy",
    language: "Python",
    prompt: `Spur pinion gear (T1=${g1_t1} teeth) drives gear T2 (${g1_t2} teeth) at ${g1_driverRPM} RPM. Output speed must equal ${g1_expectedRPM} RPM. Fix the inverted velocity ratio formula.`,
    formula: `N2 = N1 * (T1 / T2) = ${g1_driverRPM} * (${g1_t1} / ${g1_t2}) = ${g1_expectedRPM} RPM`,
    code: [
      `# PRAGATI UNIVERSITY · ENGINEERING OLYMPICS 2026`,
      `# Contestant: ${cleanRoll} · Rig Station: MG-7 · Challenge 01`,
      `def ${g1_fn}(n1_driver=${g1_driverRPM}, t1_pinion=${g1_t1}, t2_gear=${g1_t2}):`,
      `    # Diagnostic Bug: Inverted tooth ratio causes speed increase`,
      `    gear_ratio = t2_gear / t1_pinion`,
      `    n2_driven = n1_driver * gear_ratio`,
      `    return round(n2_driven)`,
      ``,
      `# Test: ${g1_fn}() currently returns ${Math.round(g1_driverRPM * g1_ratioMult)} RPM (Expected: ${g1_expectedRPM} RPM)`,
    ],
    bug: "gear_ratio = t2_gear / t1_pinion",
    answer: "Change gear_ratio = t1_pinion / t2_gear",
    options: shuffleArray(
      [
        "Change gear_ratio = t1_pinion / t2_gear",
        "Change gear_ratio = t2_gear / t1_pinion",
        `Multiply n2_driven by ${g1_ratioMult * 2}`,
        "Square the entire gear_ratio variable",
      ],
      rng
    ),
    hint: `When the driven gear has more teeth (${g1_t2} vs ${g1_t1}), the output speed must reduce to ${g1_expectedRPM} RPM.`,
  };

  // Mission 2: Carnot Thermal Cycle
  const g2_tHot = [360, 420, 500, 580, 650][rng(0, 4)];
  const g2_tCold = [20, 25, 30, 35][rng(0, 3)];
  const g2_thK = g2_tHot + 273.15;
  const g2_tcK = g2_tCold + 273.15;
  const g2_actualEff = ((1 - g2_tcK / g2_thK) * 100).toFixed(1);
  const g2_fn = `carnot_efficiency_${suffix}`;
  const m2: Question = {
    id: 102,
    title: "Carnot Thermal Cycle Efficiency",
    discipline: "Thermodynamics",
    difficulty: "Easy",
    language: "Python",
    prompt: `An engineer is computing the ideal thermal efficiency of a heat engine operating between hot reservoir (${g2_tHot}°C) and cold sink (${g2_tCold}°C). Resolve the absolute temperature scale bug.`,
    formula: `η = 1 - (T_cold_K / T_hot_K) = 1 - (${g2_tcK.toFixed(1)} / ${g2_thK.toFixed(1)}) = ${g2_actualEff}%`,
    code: [
      `# PRAGATI UNIVERSITY · ENGINEERING OLYMPICS 2026`,
      `# Contestant: ${cleanRoll} · Thermal Diagnostics Unit`,
      `def ${g2_fn}(t_hot_celsius=${g2_tHot}, t_cold_celsius=${g2_tCold}):`,
      `    # Thermodynamic 2nd law requires absolute temperature in Kelvin`,
      `    efficiency = 1.0 - (t_cold_celsius / t_hot_celsius)`,
      `    return round(efficiency * 100, 1)`,
      ``,
      `# Test: ${g2_fn}(${g2_tHot}, ${g2_tCold}) fails because Celsius ratio is invalid`,
    ],
    bug: "The formula evaluates Celsius values directly without Kelvin conversion.",
    answer: "Convert both temperatures to Kelvin by adding 273.15 before calculating",
    options: shuffleArray(
      [
        "Convert both temperatures to Kelvin by adding 273.15 before calculating",
        "The formula evaluates Celsius values directly without Kelvin conversion.",
        "Invert the ratio to t_hot_celsius / t_cold_celsius",
        "Multiply the resulting efficiency by Rankine conversion factor 1.8",
      ],
      rng
    ),
    hint: `Thermodynamic cycle formulas only hold when temperatures are in Kelvin (K = °C + 273.15).`,
  };

  // Mission 3: Cantilever Beam Deflection
  const g3_P = [800, 1200, 1600, 2000, 2500][rng(0, 4)];
  const g3_L = [1000, 1200, 1500, 1800][rng(0, 3)];
  const g3_E = 200000; // MPa
  const g3_I = [45000, 60000, 80000, 100000][rng(0, 3)];
  const g3_fn = `cantilever_tip_deflection_${suffix}`;
  const m3: Question = {
    id: 103,
    title: "Cantilever Beam Max Deflection",
    discipline: "Solid Mechanics",
    difficulty: "Easy",
    language: "Python",
    prompt: `Compute maximum tip deflection δ for a structural steel cantilever under point load P=${g3_P} N, length L=${g3_L} mm, E=${g3_E} MPa, I=${g3_I} mm⁴. Fix the power operator error in the numerator.`,
    formula: `δ_max = (P * L^3) / (3 * E * I)`,
    code: [
      `# PRAGATI UNIVERSITY · ENGINEERING OLYMPICS 2026`,
      `# Contestant: ${cleanRoll} · Beam Stress Station`,
      `def ${g3_fn}(P=${g3_P}, L=${g3_L}, E=${g3_E}, I=${g3_I}):`,
      `    # δ_max = (P * L^3) / (3 * E * I)`,
      `    delta_max = (P * L * 3) / (3 * E * I)`,
      `    return delta_max`,
      ``,
      `# Test: P=${g3_P}N, L=${g3_L}mm -> numerator must be P * (L cubed)`,
    ],
    bug: "L * 3 multiplies length by 3 instead of cubing it.",
    answer: "Change P * L * 3 to P * (L ** 3)",
    options: shuffleArray(
      [
        "Change P * L * 3 to P * (L ** 3)",
        "L * 3 multiplies length by 3 instead of cubing it.",
        "Change the denominator to (6 * E * I)",
        "Multiply P by 9.81 to convert from Newtons to kgf",
      ],
      rng
    ),
    hint: `In Python, exponential cubing requires the ** operator, not single multiplication *.`,
  };

  // Mission 4: CNC Milling Table Feed Rate
  const g4_rpm = [1800, 2200, 2500, 3000][rng(0, 3)];
  const g4_flutes = [2, 3, 4, 6][rng(0, 3)];
  const g4_fz = [0.05, 0.08, 0.10, 0.12][rng(0, 3)];
  const g4_expectedFeed = Math.round(g4_rpm * g4_flutes * g4_fz);
  const g4_fn = `calculateTableFeed_${suffix}`;
  const m4: Question = {
    id: 104,
    title: "CNC Milling Table Feed Rate",
    discipline: "Manufacturing & CNC",
    difficulty: "Medium",
    language: "TypeScript",
    prompt: `An end mill (${g4_flutes} flutes) machines a titanium block at ${g4_rpm} RPM with ${g4_fz} mm/tooth chip load. Correct the formula so the CNC table feed rate calculates to ${g4_expectedFeed} mm/min.`,
    formula: `Feed Rate (F) = N * z * fz = ${g4_rpm} * ${g4_flutes} * ${g4_fz} = ${g4_expectedFeed} mm/min`,
    code: [
      `// PRAGATI UNIVERSITY · ENGINEERING OLYMPICS 2026`,
      `// Contestant: ${cleanRoll} · CNC Machining Telemetry`,
      `function ${g4_fn}(rpm: number = ${g4_rpm}, flutes: number = ${g4_flutes}, fz: number = ${g4_fz}): number {`,
      `  // Bug: dividing by flute count instead of multiplying`,
      `  const feedRate = (rpm * fz) / flutes;`,
      `  return feedRate;`,
      `}`,
      ``,
      `// Expected: ${g4_fn}() should equal ${g4_expectedFeed} mm/min`,
    ],
    bug: "The calculation divides by flute count instead of multiplying.",
    answer: "Change to const feedRate = rpm * flutes * fz;",
    options: shuffleArray(
      [
        "Change to const feedRate = rpm * flutes * fz;",
        "The calculation divides by flute count instead of multiplying.",
        "Change feedRate to (rpm / flutes) * fz;",
        "Multiply by tool diameter in millimeters",
      ],
      rng
    ),
    hint: `Every extra tooth that passes the workpiece removes chips per revolution. Table feed rate is proportional to flute count.`,
  };

  // Mission 5: 2-DOF Robot Arm Forward Kinematics
  const g5_L1 = [250, 300, 350][rng(0, 2)];
  const g5_L2 = [200, 250, 280][rng(0, 2)];
  const g5_th1 = [30, 45, 60][rng(0, 2)];
  const g5_th2 = [15, 30, 45][rng(0, 2)];
  const g5_fn = `getRobotEndEffectorX_${suffix}`;
  const m5: Question = {
    id: 105,
    title: "2-DOF Robot Arm Forward Kinematics",
    discipline: "Kinematics & Robotics",
    difficulty: "Medium",
    language: "JavaScript",
    prompt: `Compute the end-effector coordinate for robotic arm links L1=${g5_L1}mm, L2=${g5_L2}mm at joint angles θ1=${g5_th1}°, θ2=${g5_th2}°. Spot why the trigonometric function yields erratic coordinates.`,
    formula: `X = L1 * cos(θ1_rad) + L2 * cos(θ1_rad + θ2_rad)`,
    code: [
      `// PRAGATI UNIVERSITY · ENGINEERING OLYMPICS 2026`,
      `// Contestant: ${cleanRoll} · Autonomous Robotics Cell`,
      `function ${g5_fn}(L1 = ${g5_L1}, L2 = ${g5_L2}, theta1_deg = ${g5_th1}, theta2_deg = ${g5_th2}) {`,
      `  // JS Math.cos expects RADIANS, but degrees were supplied directly`,
      `  const x = L1 * Math.cos(theta1_deg) + L2 * Math.cos(theta1_deg + theta2_deg);`,
      `  return x;`,
      `}`,
      ``,
      `// Test: ${g5_fn}() produces wrong Cartesian position without radian conversion`,
    ],
    bug: "Joint angles are passed in degrees directly to Math.cos.",
    answer: "Convert degrees to radians: (angle * Math.PI) / 180",
    options: shuffleArray(
      [
        "Convert degrees to radians: (angle * Math.PI) / 180",
        "Joint angles are passed in degrees directly to Math.cos.",
        "Replace Math.cos with Math.sin for both joint angles",
        "Divide link lengths L1 and L2 by 1000 to convert to meters",
      ],
      rng
    ),
    hint: `JavaScript trigonometric routines require radian arguments. Multiply angle in degrees by (Math.PI / 180).`,
  };

  // Mission 6: Hydraulic Piston Output Force
  const g6_pBar = [140, 180, 210, 250][rng(0, 3)];
  const g6_diam = [40, 50, 63, 80][rng(0, 3)];
  const g6_radius = g6_diam / 2.0;
  const g6_fn = `hydraulic_press_force_${suffix}`;
  const m6: Question = {
    id: 106,
    title: "Hydraulic Piston Output Force",
    discipline: "Fluid Power & Hydraulics",
    difficulty: "Medium",
    language: "Python",
    prompt: `A hydraulic actuator operates at pressure P=${g6_pBar} bar on a piston diameter D=${g6_diam} mm. Fix the circular area calculation in the force equation.`,
    formula: `Force = Pressure * Area = (${g6_pBar} * 0.1 MPa) * (π * (${g6_diam}/2)²)`,
    code: [
      `# PRAGATI UNIVERSITY · ENGINEERING OLYMPICS 2026`,
      `# Contestant: ${cleanRoll} · Hydraulic Power Rig`,
      `import math`,
      ``,
      `def ${g6_fn}(pressure_bar=${g6_pBar}, diameter_mm=${g6_diam}):`,
      `    p_mpa = pressure_bar * 0.1  # 1 bar = 0.1 N/mm^2`,
      `    # Bug: area calculation uses diameter directly in pi * d^2`,
      `    area_mm2 = math.pi * (diameter_mm ** 2)`,
      `    force_kN = (p_mpa * area_mm2) / 1000.0`,
      `    return force_kN`,
    ],
    bug: "Area formula uses π * D² instead of π * (D/2)² or (π * D²)/4.",
    answer: "Change area_mm2 = math.pi * ((diameter_mm / 2.0) ** 2)",
    options: shuffleArray(
      [
        "Change area_mm2 = math.pi * ((diameter_mm / 2.0) ** 2)",
        "Area formula uses π * D² instead of π * (D/2)² or (π * D²)/4.",
        "Change p_mpa conversion factor to pressure_bar * 100",
        "Multiply force_kN by cylinder stroke length in meters",
      ],
      rng
    ),
    hint: `Area of a cylinder cross-section is π * r² = π * (d/2)², which is 4 times smaller than π * d².`,
  };

  // Mission 7: Von Mises Yield Criterion
  const g7_s1 = [180, 220, 260][rng(0, 2)];
  const g7_s2 = [100, 140, 180][rng(0, 2)];
  const g7_yield = 250;
  const g7_fn = `check_von_mises_yield_${suffix}`;
  const m7: Question = {
    id: 107,
    title: "Von Mises Yield Stress Evaluator",
    discipline: "Solid Mechanics",
    difficulty: "Medium",
    language: "Python",
    prompt: `For biaxial plane stress (σ1=${g7_s1} MPa, σ2=${g7_s2} MPa), determine if the alloy yields against yield strength Sy=${g7_yield} MPa. Fix the sign of the cross-term in the distortion energy equation.`,
    formula: `σ_vm = sqrt(σ1² - σ1*σ2 + σ2²)`,
    code: [
      `# PRAGATI UNIVERSITY · ENGINEERING OLYMPICS 2026`,
      `# Contestant: ${cleanRoll} · Failure Theories Lab`,
      `import math`,
      ``,
      `def ${g7_fn}(s1=${g7_s1}, s2=${g7_s2}, yield_strength=${g7_yield}):`,
      `    # Plane stress Von Mises distortion energy equation:`,
      `    vm_stress = math.sqrt(s1**2 + s1 * s2 + s2**2)`,
      `    return vm_stress > yield_strength`,
      ``,
      `# Test: For tension-tension state, cross-term must reduce distortion energy`,
    ],
    bug: "The cross-term is + s1 * s2 instead of - s1 * s2.",
    answer: "Change to math.sqrt(s1**2 - s1 * s2 + s2**2)",
    options: shuffleArray(
      [
        "Change to math.sqrt(s1**2 - s1 * s2 + s2**2)",
        "The cross-term is + s1 * s2 instead of - s1 * s2.",
        "Change the return condition to vm_stress == yield_strength",
        "Take the cube root of the stress sum instead of square root",
      ],
      rng
    ),
    hint: `Under distortion energy theory for plane stress, equal biaxial tension (s1=s2) subtracts the cross-product (- s1*s2).`,
  };

  // Mission 8: PID Throttle Controller
  const g8_maxI = [30, 50, 75, 100][rng(0, 3)];
  const g8_className = `ThrottlePID_${suffix}`;
  const m8: Question = {
    id: 108,
    title: "PID Throttle Anti-Windup Clamping",
    discipline: "Control Systems",
    difficulty: "Hard",
    language: "TypeScript",
    prompt: `An autonomous electric kart speed controller accumulates integral error. Prevent actuator saturation caused by unbounded integral windup when error persists.`,
    formula: `integral = clamp(integral + error * dt, -${g8_maxI}, ${g8_maxI})`,
    code: [
      `// PRAGATI UNIVERSITY · ENGINEERING OLYMPICS 2026`,
      `// Contestant: ${cleanRoll} · Mechatronics & Controls Lab`,
      `class ${g8_className} {`,
      `  private integral: number = 0;`,
      `  compute(error: number, dt: number, maxIntegral: number = ${g8_maxI}): number {`,
      `    // Unbounded accumulator causes actuator windup saturation`,
      `    this.integral += error * dt;`,
      `    return this.integral;`,
      `  }`,
      `}`,
    ],
    bug: "this.integral accumulates without clamp limits.",
    answer: "Clamp this.integral between -maxIntegral and maxIntegral",
    options: shuffleArray(
      [
        "Clamp this.integral between -maxIntegral and maxIntegral",
        "this.integral accumulates without clamp limits.",
        "Reset this.integral to 0 on every single compute cycle",
        "Multiply error by dt squared instead of dt",
      ],
      rng
    ),
    hint: `Anti-windup clamping constrains the integral state within [-maxIntegral, maxIntegral] to prevent throttle saturation.`,
  };

  // Mission 9: Thermal Shrink-Fit Sleeve Expansion
  const g9_d0 = [40, 50, 60, 80][rng(0, 3)];
  const g9_tInit = [18, 20, 25][rng(0, 2)];
  const g9_tFinal = [160, 180, 220, 250][rng(0, 3)];
  const g9_fn = `bearing_shrink_fit_${suffix}`;
  const m9: Question = {
    id: 109,
    title: "Thermal Shrink-Fit Clearance",
    discipline: "Manufacturing & CNC",
    difficulty: "Hard",
    language: "Python",
    prompt: `A steel sleeve (d0=${g9_d0} mm, α=12×10⁻⁶ /°C) is heated from ${g9_tInit}°C to ${g9_tFinal}°C for shaft interference fit. Fix the temperature differential in the thermal expansion equation.`,
    formula: `ΔD = D0 * α * (T_final - T_initial) = ${g9_d0} * 12e-6 * (${g9_tFinal} - ${g9_tInit})`,
    code: [
      `# PRAGATI UNIVERSITY · ENGINEERING OLYMPICS 2026`,
      `# Contestant: ${cleanRoll} · Precision Fits Workshop`,
      `def ${g9_fn}(d0_mm=${g9_d0}, alpha=12e-6, t_initial=${g9_tInit}, t_final=${g9_tFinal}):`,
      `    # Bug: using absolute final temperature instead of temperature rise`,
      `    delta_d = d0_mm * alpha * t_final`,
      `    expanded_diameter = d0_mm + delta_d`,
      `    return expanded_diameter`,
      ``,
      `# Test: Initial temp ${g9_tInit}°C, Final temp ${g9_tFinal}°C`,
    ],
    bug: "delta_d multiplies by t_final instead of (t_final - t_initial).",
    answer: "Change delta_d = d0_mm * alpha * (t_final - t_initial)",
    options: shuffleArray(
      [
        "Change delta_d = d0_mm * alpha * (t_final - t_initial)",
        "delta_d multiplies by t_final instead of (t_final - t_initial).",
        "Divide delta_d by Young's modulus E to get expansion",
        "Subtract expanded_diameter from initial d0_mm",
      ],
      rng
    ),
    hint: `Thermal expansion is driven strictly by temperature change ΔT = (T_final - T_initial).`,
  };

  // Mission 10: Flywheel Rotational Kinetic Energy
  const g10_I = [8, 12, 16, 20][rng(0, 3)];
  const g10_rpm = [480, 600, 720, 900][rng(0, 3)];
  const g10_fn = `flywheelEnergyJoules_${suffix}`;
  const m10: Question = {
    id: 110,
    title: "Flywheel Rotational Kinetic Energy",
    discipline: "Thermodynamics",
    difficulty: "Hard",
    language: "JavaScript",
    prompt: `A heavy punch press flywheel (I=${g10_I} kg·m²) rotates at ${g10_rpm} RPM. Fix the kinetic energy formula to convert shaft RPM into angular velocity (ω in rad/s).`,
    formula: `E_k = 0.5 * I * ω², where ω = (2 * π * ${g10_rpm}) / 60 rad/s`,
    code: [
      `// PRAGATI UNIVERSITY · ENGINEERING OLYMPICS 2026`,
      `// Contestant: ${cleanRoll} · Dynamics & Energy Storage`,
      `function ${g10_fn}(inertia_kgm2 = ${g10_I}, rpm = ${g10_rpm}) {`,
      `  // Kinetic energy E = 0.5 * I * omega^2`,
      `  // Bug: passing RPM directly instead of angular velocity omega in rad/s`,
      `  const energy = 0.5 * inertia_kgm2 * Math.pow(rpm, 2);`,
      `  return energy;`,
      `}`,
      ``,
      `// Test: ${g10_I} kg·m² flywheel at ${g10_rpm} RPM`,
    ],
    bug: "RPM is used directly in place of angular velocity omega (rad/s).",
    answer: "Calculate omega = (2 * Math.PI * rpm) / 60, then use 0.5 * inertia * omega^2",
    options: shuffleArray(
      [
        "Calculate omega = (2 * Math.PI * rpm) / 60, then use 0.5 * inertia * omega^2",
        "RPM is used directly in place of angular velocity omega (rad/s).",
        "Multiply kinetic energy by gravitational acceleration 9.81 m/s²",
        "Change Math.pow(rpm, 2) to Math.sqrt(rpm)",
      ],
      rng
    ),
    hint: `Rotational kinetic energy requires angular velocity in radians per second: ω = (2πN) / 60.`,
  };

  const allMissions = [m1, m2, m3, m4, m5, m6, m7, m8, m9, m10];
  // Permute order of questions uniquely for this roll number
  return shuffleArray(allMissions, rng);
}
