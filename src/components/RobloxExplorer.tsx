import React, { useState } from 'react';
import { LuauFile, ScriptType } from '../types/roblox';
import { Folder, FileCode, Radio, Zap, Shield, Search, ChevronRight, ChevronDown } from 'lucide-react';

interface RobloxExplorerProps {
  files: LuauFile[];
  activeFileId: string;
  onSelectFile: (fileId: string) => void;
  selectedPhase: number | null;
  onSelectPhase: (phase: number | null) => void;
}

export const RobloxExplorer: React.FC<RobloxExplorerProps> = ({
  files,
  activeFileId,
  onSelectFile,
  selectedPhase,
  onSelectPhase,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [collapsedPaths, setCollapsedPaths] = useState<Record<string, boolean>>({});

  const toggleCollapse = (path: string) => {
    setCollapsedPaths(prev => ({ ...prev, [path]: !prev[path] }));
  };

  const getIconForType = (type: ScriptType) => {
    switch (type) {
      case 'Script':
        return <span className="w-3.5 h-3.5 rounded-sm bg-blue-500 flex items-center justify-center text-[9px] font-bold text-white">S</span>;
      case 'LocalScript':
        return <span className="w-3.5 h-3.5 rounded-sm bg-amber-500 flex items-center justify-center text-[9px] font-bold text-white">L</span>;
      case 'ModuleScript':
        return <span className="w-3.5 h-3.5 rounded-sm bg-emerald-500 flex items-center justify-center text-[9px] font-bold text-white">M</span>;
      case 'RemoteEvent':
        return <Zap className="w-3.5 h-3.5 text-yellow-400" />;
      case 'RemoteFunction':
        return <Radio className="w-3.5 h-3.5 text-purple-400" />;
      default:
        return <Folder className="w-3.5 h-3.5 text-amber-300" />;
    }
  };

  // Filter files
  const filteredFiles = files.filter(f => {
    const matchesSearch = f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.path.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPhase = selectedPhase === null || f.phase === selectedPhase;
    return matchesSearch && matchesPhase;
  });

  // Group by root service
  const services = [
    { name: 'ReplicatedStorage', pathPrefix: 'ReplicatedStorage' },
    { name: 'ServerScriptService', pathPrefix: 'ServerScriptService' },
    { name: 'ServerStorage', pathPrefix: 'ServerStorage' },
    { name: 'StarterPlayer', pathPrefix: 'StarterPlayer' },
    { name: 'StarterGui', pathPrefix: 'StarterGui' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-full shadow-lg">
      {/* Header */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          <span className="ml-2 text-xs font-semibold text-slate-300 tracking-wide uppercase">
            Roblox Explorer
          </span>
        </div>
        <span className="text-[11px] px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-mono">
          Vigo City v0.2
        </span>
      </div>

      {/* Filter / Search Bar */}
      <div className="p-3 border-b border-slate-800/80 bg-slate-900/60 space-y-2">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-2.5 top-2.5" />
          <input
            type="text"
            placeholder="Buscar scripts, módulos o paths..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>

        {/* Phase selector buttons */}
        <div className="flex items-center gap-1.5 pt-1 overflow-x-auto text-[11px]">
          <button
            onClick={() => onSelectPhase(null)}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              selectedPhase === null
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Todos ({files.length})
          </button>
          <button
            onClick={() => onSelectPhase(1)}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              selectedPhase === 1
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Fase 1: PlayerData
          </button>
          <button
            onClick={() => onSelectPhase(2)}
            className={`px-2.5 py-1 rounded-md font-medium whitespace-nowrap transition-colors ${
              selectedPhase === 2
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            Fase 2: Economía
          </button>
        </div>
      </div>

      {/* Tree Content */}
      <div className="flex-1 overflow-y-auto p-2 space-y-3 font-mono text-xs select-none">
        {services.map((service) => {
          const serviceFiles = filteredFiles.filter((f) => f.path.startsWith(service.pathPrefix));
          const isCollapsed = collapsedPaths[service.name];

          if (serviceFiles.length === 0 && searchQuery) {
            return null;
          }

          return (
            <div key={service.name} className="space-y-1">
              <div
                onClick={() => toggleCollapse(service.name)}
                className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-slate-800/60 cursor-pointer text-slate-300 font-semibold group"
              >
                {isCollapsed ? (
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
                )}
                <Folder className="w-4 h-4 text-amber-400" />
                <span>{service.name}</span>
                <span className="text-[10px] text-slate-500 ml-auto font-normal">
                  {serviceFiles.length} {serviceFiles.length === 1 ? 'ítem' : 'ítems'}
                </span>
              </div>

              {!isCollapsed && (
                <div className="pl-4 space-y-0.5 border-l border-slate-800/80 ml-3.5 my-0.5">
                  {serviceFiles.length === 0 ? (
                    <div className="text-[11px] text-slate-600 py-1 pl-2 italic">
                      Estructura preparada en ServerStorage
                    </div>
                  ) : (
                    serviceFiles.map((file) => {
                      const isSelected = activeFileId === file.id;
                      return (
                        <div
                          key={file.id}
                          onClick={() => onSelectFile(file.id)}
                          className={`flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-indigo-600/30 text-white border border-indigo-500/50 shadow-sm'
                              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                          }`}
                        >
                          {getIconForType(file.type)}
                          <span className="truncate font-medium">{file.name}</span>
                          <span
                            className={`ml-auto text-[9px] px-1.5 py-0.2 rounded font-sans uppercase ${
                              file.phase === 1
                                ? 'bg-blue-500/20 text-blue-400'
                                : 'bg-emerald-500/20 text-emerald-400'
                            }`}
                          >
                            F{file.phase}
                          </span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Info */}
      <div className="p-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>Server-Authoritative Safe</span>
        </div>
        <span className="text-slate-500 font-mono">Luau --!strict</span>
      </div>
    </div>
  );
};
