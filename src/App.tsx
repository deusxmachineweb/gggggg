/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LUAU_SCRIPTS } from './data/luauScripts';
import { RobloxExplorer } from './components/RobloxExplorer';
import { CodeViewer } from './components/CodeViewer';
import { EconomySimulator } from './components/EconomySimulator';
import { ArchitectureDiagram } from './components/ArchitectureDiagram';
import { PhaseGuide } from './components/PhaseGuide';
import { BootstrapperModal } from './components/BootstrapperModal';
import {
  Code,
  Layers,
  Terminal,
  Activity,
  Map,
  ShieldCheck,
  ChevronRight,
  Sparkles,
  Download,
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'code' | 'simulator' | 'architecture' | 'phases'>('code');
  const [activeFileId, setActiveFileId] = useState<string>(LUAU_SCRIPTS[0].id);
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const [isBootstrapperOpen, setIsBootstrapperOpen] = useState(false);

  const activeFile = LUAU_SCRIPTS.find((f) => f.id === activeFileId) || LUAU_SCRIPTS[0];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-500/20">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-tr from-indigo-400 to-cyan-300 text-base">
                VC
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-extrabold text-base tracking-tight text-white">
                  VIGO CITY
                </h1>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 font-mono font-medium border border-indigo-500/20">
                  Roblox Open-World Architecture
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Fase 1: PlayerData &bull; Fase 2: Economía autoritativa &bull; Luau Moderno
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Code className="w-3.5 h-3.5" />
              <span>Scripts Luau ({LUAU_SCRIPTS.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Simulador & Anti-Exploit</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'architecture'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Arquitectura</span>
            </button>

            <button
              onClick={() => setActiveTab('phases')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all cursor-pointer ${
                activeTab === 'phases'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>12 Fases & Testing</span>
            </button>
          </div>

          {/* Action: Studio Command Bar Bootstrapper */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsBootstrapperOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white shadow-md shadow-indigo-600/20 transition-all cursor-pointer"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Generar Jerarquía en Studio</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 w-full">
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-8.5rem)] min-h-[640px]">
            {/* Explorer (Left sidebar) */}
            <div className="lg:col-span-4 h-full">
              <RobloxExplorer
                files={LUAU_SCRIPTS}
                activeFileId={activeFileId}
                onSelectFile={setActiveFileId}
                selectedPhase={selectedPhase}
                onSelectPhase={setSelectedPhase}
              />
            </div>

            {/* Code Viewer (Right panel) */}
            <div className="lg:col-span-8 h-full">
              <CodeViewer file={activeFile} />
            </div>
          </div>
        )}

        {activeTab === 'simulator' && <EconomySimulator />}

        {activeTab === 'architecture' && <ArchitectureDiagram />}

        {activeTab === 'phases' && <PhaseGuide />}
      </main>

      {/* Bootstrapper Script Modal */}
      <BootstrapperModal
        isOpen={isBootstrapperOpen}
        onClose={() => setIsBootstrapperOpen(false)}
      />
    </div>
  );
}
