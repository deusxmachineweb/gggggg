import React from 'react';
import { CheckCircle2, Clock, PlayCircle, Terminal, HelpCircle, AlertCircle, Sparkles } from 'lucide-react';

export const PhaseGuide: React.FC = () => {
  const phases = [
    {
      number: 1,
      name: 'Arquitectura & PlayerData',
      status: 'COMPLETED',
      description: 'Estructura modular, perfiles persistentes en DataStoreService, reconciliación automática y líderstats.',
      deliverables: ['PlayerDataTemplate', 'GameConfig', 'TableUtil', 'PlayerDataManager', 'PlayerDataServer', 'PlayerDataClient'],
    },
    {
      number: 2,
      name: 'Sistema de Economía Autoritativo',
      status: 'COMPLETED',
      description: 'Cajeros automáticos (ATM), banco, transacciones interbancarias, anti-exploits de números negativos/NaN y auditoría.',
      deliverables: ['EconomyConfig', 'EconomyManager', 'EconomyServer', 'EconomyClient', 'NetworkEvents'],
    },
    {
      number: 3,
      name: 'Sistema de Vehículos Modular',
      status: 'NEXT',
      description: 'Concesionario, spawner físico, garaje personal, física de conducción en Roblox, personalización y tuning.',
      deliverables: ['VehicleConfig', 'VehicleSpawner', 'VehicleOwnership', 'VehicleController', 'GarageUI'],
    },
    {
      number: 4,
      name: 'Propiedades & Apartamentos',
      status: 'PLANNED',
      description: 'Casas, garajes privados, penthouses y negocios con teleportación a interiores instanciados.',
      deliverables: ['PropertyConfig', 'PropertyManager', 'InteriorStreamer', 'PropertyShop'],
    },
    {
      number: 5,
      name: 'Armas & Combate Seguro',
      status: 'PLANNED',
      description: 'Balística server-validated, line-of-sight raycasting, cadencia, recarga y daño controlado en servidor.',
      deliverables: ['WeaponConfig', 'WeaponManager', 'HitscanValidator', 'WeaponClient'],
    },
    {
      number: 6,
      name: 'Trabajos Legales',
      status: 'PLANNED',
      description: 'Taxista, repartidor de mensajería, mecánico de taller y policía con rutas procedurales y nóminas.',
      deliverables: ['JobConfig', 'JobManager', 'JobMarkerService', 'JobClient'],
    },
    {
      number: 7,
      name: 'Policía & Wanted Level',
      status: 'PLANNED',
      description: '0 a 5 estrellas, IA de patrullas/jugadores policías, arresto, esposas, fianza y sistema de cárcel con cronómetro.',
      deliverables: ['WantedConfig', 'WantedManager', 'ArrestSystem', 'JailManager'],
    },
    {
      number: 8,
      name: 'Robos & Golpes (Heists)',
      status: 'PLANNED',
      description: 'Tiendas de conveniencia, banco central y furgón blindado con alarmas a la policía y fase de huida.',
      deliverables: ['RobberyConfig', 'RobberyServer', 'AlarmDispatcher', 'SafeMinigame'],
    },
    {
      number: 9,
      name: 'Bandas & Territorios (Gangs)',
      status: 'PLANNED',
      description: 'Creación de bandas, captura de distritos de Vigo City, reputación, colores de banda y garaje compartido.',
      deliverables: ['GangConfig', 'GangManager', 'TerritoryService'],
    },
    {
      number: 10,
      name: 'UI Moderna Completa',
      status: 'PLANNED',
      description: 'HUD limpio con velocímetro digital, teléfono inteligente multifunción interactivo y minimapa con GPS.',
      deliverables: ['PhoneUI', 'HUDController', 'MinimapGPS', 'InventoryUI'],
    },
    {
      number: 11,
      name: 'Optimización de Memoria & Red',
      status: 'PLANNED',
      description: 'StreamingEnabled configurado, compresión de buffers, limpieza de instancias y render distance.',
      deliverables: ['StreamingConfig', 'NetworkThrottler', 'LODManager'],
    },
    {
      number: 12,
      name: 'Testing de Estrés & Lanzamiento',
      status: 'PLANNED',
      description: 'Simulación de 50 jugadores simultáneos, auditoría contra inyectores populares y checklist de release.',
      deliverables: ['StressTestBot', 'ExploitTester', 'ReleaseChecklist'],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Testing in Studio Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <PlayCircle className="w-5 h-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Guía de Pruebas en Roblox Studio (Fase 1 y Fase 2)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-indigo-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">1</span>
              Habilitar API de DataStore en Studio
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Para que <code className="text-indigo-300">DataStoreService</code> guarde datos en local durante las pruebas:
            </p>
            <ol className="list-decimal list-inside space-y-1 text-slate-300 pt-1">
              <li>Abre <strong>Home &gt; Game Settings</strong> (debes guardar o publicar el juego primero).</li>
              <li>Entra en la sección <strong>Security</strong>.</li>
              <li>Activa la casilla <strong>Enable Studio Access to API Services</strong>.</li>
              <li>Haz clic en <strong>Save</strong>.</li>
            </ol>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-indigo-300 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-xs">2</span>
              Verificar con Play Solo
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Haz clic en <strong>Play (F5)</strong> y abre la pestaña <strong>Output</strong>:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 pt-1">
              <li>Deberás ver: <code className="text-emerald-400">[PlayerDataManager] Perfil inicial creado para nuevo jugador</code>.</li>
              <li>Arriba a la derecha aparecerá la lista de jugadores con <strong>Cash ($2,500)</strong>, <strong>Bank ($10,000)</strong> y <strong>Level (1)</strong>.</li>
              <li>Al pulsar <strong>Stop</strong>, verás en la consola que <code className="text-cyan-400">game:BindToClose</code> guarda los datos automáticamente.</li>
            </ul>
          </div>
        </div>

        <div className="bg-indigo-950/20 border border-indigo-900/40 p-4 rounded-xl text-xs space-y-2">
          <div className="flex items-center gap-2 font-semibold text-indigo-300">
            <Terminal className="w-4 h-4 text-indigo-400" />
            <span>Comando de prueba en la Command Bar durante el Play Solo</span>
          </div>
          <p className="text-slate-400">
            Durante la ejecución en Studio, puedes ejecutar este comando en la Command Bar para simular una recompensa de misión:
          </p>
          <pre className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto">
            {`require(game.ServerScriptService.Systems.Economy.EconomyManager).AddCash(game.Players:GetPlayers()[1], 1500, "Misión completada")`}
          </pre>
          <p className="text-slate-500 text-[11px]">
            Verás cómo el valor de <strong>Cash</strong> en el leaderboard sube a $4,000 en tiempo real y replica al cliente automáticamente.
          </p>
        </div>
      </div>

      {/* 12-Phase Roadmap Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Hoja de Ruta Modular (12 Fases de Vigo City)
            </h3>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-500/40 px-2.5 py-0.5 rounded-full">
            Fase 1 y 2 Listas
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {phases.map((p) => (
            <div
              key={p.number}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-all ${
                p.status === 'COMPLETED'
                  ? 'bg-slate-950 border-emerald-500/40 shadow-sm'
                  : p.status === 'NEXT'
                  ? 'bg-indigo-950/20 border-indigo-500/40 shadow-sm'
                  : 'bg-slate-950/60 border-slate-800/80 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    FASE {p.number}
                  </span>
                  {p.status === 'COMPLETED' && (
                    <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> LISTO
                    </span>
                  )}
                  {p.status === 'NEXT' && (
                    <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-bold flex items-center gap-1">
                      <Clock className="w-3 h-3" /> PRÓXIMA FASE
                    </span>
                  )}
                  {p.status === 'PLANNED' && (
                    <span className="text-[10px] bg-slate-800 text-slate-500 px-2 py-0.5 rounded">
                      Planificado
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-white mb-1.5">{p.name}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mb-3">
                  {p.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-slate-800/60">
                <span className="text-[10px] text-slate-500 font-mono block mb-1 uppercase tracking-wider">
                  Módulos clave:
                </span>
                <div className="flex flex-wrap gap-1">
                  {p.deliverables.map((d, i) => (
                    <span
                      key={i}
                      className="text-[10px] bg-slate-900 border border-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
