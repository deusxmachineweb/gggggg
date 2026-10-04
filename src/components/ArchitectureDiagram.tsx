import React from 'react';
import { ShieldCheck, ArrowRight, ArrowLeft, Database, Lock, Server, Monitor, FileCode } from 'lucide-react';

export const ArchitectureDiagram: React.FC = () => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-indigo-400" />
            Arquitectura de Red y Frontera de Seguridad Autoritativa
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Flujo de datos entre Cliente (StarterPlayerScripts), Servidor (ServerScriptService) y Persistencia (DataStoreService).
          </p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-950/60 border border-emerald-500/40 px-3 py-1 rounded-lg text-emerald-300 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Zero-Trust Client Boundary</span>
        </div>
      </div>

      {/* Grid of the 3 zones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
        {/* Zone 1: Client */}
        <div className="bg-slate-950/80 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-amber-500/20 text-amber-300 text-[10px] font-sans font-semibold px-2 py-0.5 rounded-bl">
            CLIENT (Untrusted)
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-sans font-bold">
              <Monitor className="w-4 h-4" />
              <span>StarterPlayerScripts</span>
            </div>
            <p className="text-slate-400 text-[11px] font-sans">
              Controladores locales, inputs del jugador, renderizado de HUD y llamadas de red.
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1 text-[11px] text-slate-300">
              <div className="text-slate-500">// Módulos del Cliente:</div>
              <div>• EconomyClient.luau</div>
              <div>• PlayerDataClient.luau</div>
              <div>• HUDController.luau</div>
            </div>
          </div>
          <div className="p-2 bg-amber-950/30 border border-amber-900/40 rounded text-[10px] font-sans text-amber-200/90">
            ⚠ Cualquier dato que venga de aquí se considera no confiable.
          </div>
        </div>

        {/* Zone 2: Remotes Bridge */}
        <div className="bg-slate-950/80 border border-indigo-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-indigo-500/20 text-indigo-300 text-[10px] font-sans font-semibold px-2 py-0.5 rounded-bl">
            NETWORK BRIDGE
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-indigo-400 font-sans font-bold">
              <Lock className="w-4 h-4" />
              <span>ReplicatedStorage</span>
            </div>
            <p className="text-slate-400 text-[11px] font-sans">
              Contratos de red inmutables, constantes y RemoteEvents/Functions.
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1.5 text-[11px] text-slate-300">
              <div className="text-indigo-300 flex items-center gap-1">
                <span>RequestDeposit()</span>
                <ArrowRight className="w-3 h-3 text-indigo-400" />
              </div>
              <div className="text-indigo-300 flex items-center gap-1">
                <span>RequestWithdraw()</span>
                <ArrowRight className="w-3 h-3 text-indigo-400" />
              </div>
              <div className="text-emerald-400 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3 text-emerald-400" />
                <span>PlayerDataUpdated</span>
              </div>
            </div>
          </div>
          <div className="p-2 bg-indigo-950/30 border border-indigo-900/40 rounded text-[10px] font-sans text-indigo-200/90">
            Validador de rate-limiting (0.25s) y tipos estrictos.
          </div>
        </div>

        {/* Zone 3: Server Authority & DataStore */}
        <div className="bg-slate-950/80 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between space-y-3 relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-emerald-500/20 text-emerald-300 text-[10px] font-sans font-semibold px-2 py-0.5 rounded-bl">
            SERVER (Source of Truth)
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-sans font-bold">
              <Database className="w-4 h-4" />
              <span>ServerScriptService</span>
            </div>
            <p className="text-slate-400 text-[11px] font-sans">
              Único lugar donde se modifican salarios, inventario, vida, autos y armas.
            </p>
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800 space-y-1 text-[11px] text-slate-300">
              <div className="text-emerald-400 font-semibold">• PlayerDataManager.luau</div>
              <div className="text-emerald-400 font-semibold">• EconomyManager.luau</div>
              <div className="text-slate-400">• DataStoreService:SetAsync()</div>
              <div className="text-slate-400">• game:BindToClose()</div>
            </div>
          </div>
          <div className="p-2 bg-emerald-950/30 border border-emerald-900/40 rounded text-[10px] font-sans text-emerald-200/90">
            ✓ Persistencia segura en la nube con retry backoff.
          </div>
        </div>
      </div>
    </div>
  );
};
