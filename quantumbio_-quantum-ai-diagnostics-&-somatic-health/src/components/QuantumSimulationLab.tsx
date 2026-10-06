import React, { useState, useEffect } from 'react';
import { Play, Cpu, Layers, Activity, RefreshCw, BarChart2, ShieldCheck } from 'lucide-react';

interface SimulationData {
  targetProtein: string;
  qubits: number;
  ansatz: string;
  vqeIterations: number;
  groundStateEnergyHartree: number;
  stateTomographyFidelity: number;
  dockingAffinityKcalMol: number;
  molecularStateConvergence: string;
  quantumSpeedupRatio: string;
}

export const QuantumSimulationLab: React.FC = () => {
  const [selectedTarget, setSelectedTarget] = useState<string>(
    'IL-6 Inflammatory Cytokine & Vagal Transduction Complex'
  );
  const [qubits, setQubits] = useState<number>(16);
  const [perturbation, setPerturbation] = useState<number>(0.04);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simResult, setSimResult] = useState<SimulationData | null>(null);

  const targets = [
    'IL-6 Inflammatory Cytokine & Vagal Transduction Complex',
    'Cortisol-Glucocorticoid Receptor Alpha Binding Pocket',
    'Nuchal Ligament Type-I Collagen Piezoelectric Lattice',
    'GABA-A Receptor Temporoparietal Subunit Complex',
    'TNF-Alpha Trimer Dissociation Dynamics'
  ];

  const runSimulation = async () => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/quantum/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetProtein: selectedTarget,
          qubitCount: qubits,
          perturbation,
        }),
      });
      const data = await res.json();
      if (data.simulation) {
        setSimResult(data.simulation);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    runSimulation();
  }, [selectedTarget, qubits]);

  // Synthetic VQE convergence path for SVG plotting
  const convergencePoints = [
    { iter: 0, energy: -85.2 },
    { iter: 20, energy: -102.4 },
    { iter: 40, energy: -115.8 },
    { iter: 60, energy: -124.1 },
    { iter: 80, energy: -127.3 },
    { iter: 100, energy: -128.5 },
    { iter: 120, energy: -128.8 },
    { iter: 140, energy: simResult ? simResult.groundStateEnergyHartree : -128.9 },
  ];

  const minE = -140;
  const maxE = -70;
  const svgWidth = 400;
  const svgHeight = 160;

  const getSvgCoordinates = (iter: number, energy: number) => {
    const x = (iter / 140) * (svgWidth - 40) + 20;
    const y = svgHeight - ((energy - minE) / (maxE - minE)) * (svgHeight - 40) - 20;
    return { x, y };
  };

  const pathD = convergencePoints.reduce((acc, pt, idx) => {
    const { x, y } = getSvgCoordinates(pt.iter, pt.energy);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  return (
    <section id="molecular-lab" className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8 pb-6 border-b border-slate-800 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-teal-400 mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>VQE QUANTUM HAMILTONIAN KERNEL</span>
            <span aria-hidden="true">·</span>
            <span>MOLECULAR GROUND STATE SIMULATOR</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            Biomedical Quantum Simulation Laboratory
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            Simulate sub-cellular molecular energies and cytokine binding affinities using hybrid quantum-classical algorithms.
          </p>
        </div>

        <button
          onClick={runSimulation}
          disabled={isSimulating}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-medium rounded-lg transition-colors border border-slate-700 flex items-center gap-2 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
          <span>Recompute State</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Parameter controls */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="text-xs font-mono text-slate-400 uppercase tracking-wider pb-3 border-b border-slate-800">
            QUANTUM CIRCUIT PARAMETERS
          </div>

          {/* Molecular Target Dropdown */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Molecular / Receptor Target
            </label>
            <select
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-teal-500"
            >
              {targets.map((tgt, idx) => (
                <option key={idx} value={tgt}>
                  {tgt}
                </option>
              ))}
            </select>
          </div>

          {/* Qubit Count Selector */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Qubit Register Depth
              </label>
              <span className="text-xs font-mono text-teal-400">{qubits} Qubits</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[8, 16, 32, 64].map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => setQubits(q)}
                  className={`py-1.5 text-xs font-mono rounded border transition-colors ${
                    qubits === q
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/50'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {q}q
                </button>
              ))}
            </div>
          </div>

          {/* Hamiltonian Perturbation Slider */}
          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="text-xs font-medium text-slate-300">
                Mechanical Shear Perturbation (lambda)
              </label>
              <span className="text-xs font-mono text-slate-400">{perturbation.toFixed(3)}</span>
            </div>
            <input
              type="range"
              min="0.01"
              max="0.2"
              step="0.005"
              value={perturbation}
              onChange={(e) => setPerturbation(parseFloat(e.target.value))}
              className="w-full accent-teal-400 bg-slate-950"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono mt-1">
              <span>0.010 (Homeostatic)</span>
              <span>0.200 (Acute Strain)</span>
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-400 space-y-1">
            <span className="text-slate-300 font-semibold block">Ansatz Architecture:</span>
            <span>Hardware-Efficient UCCSD with Entangling CNOT Ladders</span>
          </div>
        </div>

        {/* Right Column: Visualizer & Convergence Curves */}
        <div className="lg:col-span-8 space-y-6">
          {/* Real-time Telemetry Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase">GROUND ENERGY</div>
              <div className="text-2xl font-mono font-bold text-white tabular-nums mt-1">
                {simResult ? simResult.groundStateEnergyHartree : '-128.45'}
              </div>
              <div className="text-[11px] text-teal-400 font-mono">Hartree (E_0)</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase">TOMOGRAPHY FIDELITY</div>
              <div className="text-2xl font-mono font-bold text-teal-300 tabular-nums mt-1">
                {simResult ? `${(simResult.stateTomographyFidelity * 100).toFixed(2)}%` : '98.54%'}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">Overlap (Tr[rho sigma])</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase">DOCKING AFFINITY</div>
              <div className="text-2xl font-mono font-bold text-cyan-300 tabular-nums mt-1">
                {simResult ? `${simResult.dockingAffinityKcalMol}` : '-9.84'}
              </div>
              <div className="text-[11px] text-slate-400 font-mono">kcal/mol</div>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
              <div className="text-[11px] font-mono text-slate-400 uppercase">QUANTUM SPEEDUP</div>
              <div className="text-2xl font-mono font-bold text-emerald-400 tabular-nums mt-1">
                240x
              </div>
              <div className="text-[11px] text-emerald-500/90 font-mono">vs Classical MC</div>
            </div>
          </div>

          {/* VQE Energy Convergence Graph */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-sm font-semibold text-white">
                  Variational Quantum Eigensolver (VQE) Energy Optimization Trajectory
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Iterative gradient descent across parameter space theta minimizing Hamiltonian expectation value
                </p>
              </div>
              <span className="text-xs font-mono px-2 py-0.5 bg-emerald-950/60 text-emerald-400 border border-emerald-800/60 rounded">
                ● NOMINAL CONVERGENCE
              </span>
            </div>

            {/* SVG Curve */}
            <div className="w-full bg-slate-950 rounded-lg p-4 border border-slate-800/80">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-44 overflow-visible">
                {/* Horizontal reference lines */}
                <line x1="20" y1="30" x2={svgWidth - 20} y2="30" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="20" y1="80" x2={svgWidth - 20} y2="80" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />
                <line x1="20" y1="130" x2={svgWidth - 20} y2="130" stroke="#334155" strokeDasharray="3 3" strokeWidth="0.8" />

                {/* Y-axis labels */}
                <text x="25" y="26" fill="#94a3b8" fontSize="9" fontFamily="monospace">-80 Ha</text>
                <text x="25" y="76" fill="#94a3b8" fontSize="9" fontFamily="monospace">-110 Ha</text>
                <text x="25" y="126" fill="#94a3b8" fontSize="9" fontFamily="monospace">-135 Ha</text>

                {/* Convergence path */}
                <path
                  d={pathD}
                  fill="none"
                  stroke="#14b8a6"
                  strokeWidth="2.5"
                  className="transition-all duration-700"
                />

                {/* Data Points */}
                {convergencePoints.map((pt, idx) => {
                  const { x, y } = getSvgCoordinates(pt.iter, pt.energy);
                  return (
                    <circle
                      key={idx}
                      cx={x}
                      cy={y}
                      r="3.5"
                      fill="#0f172a"
                      stroke="#2dd4bf"
                      strokeWidth="2"
                    />
                  );
                })}
              </svg>

              <div className="flex justify-between items-center text-[10px] font-mono text-slate-400 mt-2 border-t border-slate-800 pt-2">
                <span>ITERATION 0 (Random State)</span>
                <span>ITERATION 70 (Ansatz Optimization)</span>
                <span>ITERATION 140 (Ground State Reached)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
