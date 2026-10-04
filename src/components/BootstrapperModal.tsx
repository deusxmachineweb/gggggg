import React, { useState } from 'react';
import { BOOTSTRAPPER_LUA_COMMAND } from '../data/luauScripts';
import { Copy, Check, Terminal, X, ShieldAlert, Sparkles } from 'lucide-react';

interface BootstrapperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BootstrapperModal: React.FC<BootstrapperModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(BOOTSTRAPPER_LUA_COMMAND);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Terminal className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                Auto-Generador para Command Bar de Roblox Studio
              </h3>
              <p className="text-xs text-slate-400">
                Genera toda la jerarquía de carpetas y Remotes con 1 solo click en Studio.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Instructions */}
          <div className="bg-indigo-950/30 border border-indigo-900/40 rounded-xl p-4 text-xs space-y-2">
            <span className="font-semibold text-indigo-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              ¿Cómo usar esto en Roblox Studio?
            </span>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300">
              <li>Abre tu juego o plantilla vacía en <strong>Roblox Studio</strong>.</li>
              <li>Ve a la pestaña superior <strong>View</strong> y activa la <strong>Command Bar</strong> (Barra de comandos abajo).</li>
              <li>Copia el código que ves a continuación y pégalo directamente en la Command Bar.</li>
              <li>Presiona <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[10px]">Enter</kbd>.</li>
              <li>¡Listo! Todas las carpetas, RemoteEvents y RemoteFunctions se crearán de inmediato sin errores tipográficos.</li>
            </ol>
          </div>

          {/* Code Box */}
          <div className="relative rounded-xl border border-slate-800 bg-slate-950 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-800/80 bg-slate-900/60">
              <span className="text-xs font-mono text-slate-400">bootstrap_hierarchy.lua</span>
              <button
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? '¡Copiado!' : 'Copiar Script'}</span>
              </button>
            </div>
            <pre className="p-4 font-mono text-xs text-slate-300 overflow-x-auto max-h-72 leading-relaxed">
              {BOOTSTRAPPER_LUA_COMMAND}
            </pre>
          </div>

          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-950/60 p-3 rounded-lg border border-slate-800">
            <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              Este script es completamente seguro y solo crea instancias de tipo <code className="text-indigo-300">Folder</code>, <code className="text-indigo-300">RemoteEvent</code> y <code className="text-indigo-300">RemoteFunction</code>. Si ya existen, no las duplica.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-3.5 border-t border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};
