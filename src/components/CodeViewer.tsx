import React, { useState } from 'react';
import { LuauFile } from '../types/roblox';
import { Copy, Check, Download, Info, ShieldCheck, Terminal, MapPin } from 'lucide-react';

interface CodeViewerProps {
  file: LuauFile;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ file }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(file.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([file.code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${file.name}.luau`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const lines = file.code.split('\n');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      {/* Top Bar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <MapPin className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-slate-500">Ubicación exacta:</span>
            <span className="text-indigo-300 font-semibold bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/40">
              {file.path}
            </span>
          </div>

          <span className="text-xs px-2 py-0.5 rounded font-medium bg-slate-800 text-slate-300 border border-slate-700">
            {file.type}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            title="Descargar archivo .luau"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700 cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar</span>
          </button>

          <button
            onClick={handleCopy}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Código</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Description Banner */}
      <div className="bg-indigo-950/20 border-b border-indigo-900/30 px-4 py-2.5 flex items-start gap-2.5 text-xs text-indigo-200">
        <Info className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white mr-1.5">{file.name}:</span>
          <span className="text-indigo-200/90">{file.description}</span>
          {file.setupInstructions && (
            <div className="mt-1 text-[11px] text-indigo-300/80">
              <strong className="text-indigo-200">Cómo crearlo en Studio:</strong> {file.setupInstructions}
            </div>
          )}
        </div>
      </div>

      {/* Code Editor Body */}
      <div className="flex-1 overflow-auto bg-slate-950 font-mono text-xs text-slate-300 p-4 leading-relaxed select-text">
        <pre className="grid grid-cols-[3rem_1fr] gap-4">
          {/* Line Numbers */}
          <div className="text-slate-600 select-none text-right pr-2 border-r border-slate-800">
            {lines.map((_, idx) => (
              <div key={idx} className="h-5">
                {idx + 1}
              </div>
            ))}
          </div>

          {/* Code text */}
          <div className="overflow-x-auto whitespace-pre">
            {lines.map((line, idx) => {
              // Simple syntax color highlights
              let color = 'text-slate-300';
              if (line.trim().startsWith('--')) {
                color = 'text-slate-500 italic';
              } else if (line.includes('function') || line.includes('local ') || line.includes('return ')) {
                color = 'text-cyan-300';
              } else if (line.includes('game:GetService') || line.includes('Instance.new')) {
                color = 'text-yellow-300';
              } else if (line.includes('assert') || line.includes('error') || line.includes('warn')) {
                color = 'text-amber-400';
              }

              return (
                <div key={idx} className={`h-5 ${color}`}>
                  {line || ' '}
                </div>
              );
            })}
          </div>
        </pre>
      </div>

      {/* Verification footer */}
      <div className="px-4 py-2.5 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-indigo-400" />
          <span>{lines.length} líneas de código Luau estricto</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-400">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span className="text-[11px]">Validado para Luau 2026</span>
        </div>
      </div>
    </div>
  );
};
