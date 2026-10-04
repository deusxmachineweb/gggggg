import React, { useState, useEffect } from 'react';
import { PlayerDataSchema, AuditLog } from '../types/roblox';
import {
  Wallet,
  Building2,
  ShieldAlert,
  ArrowRightLeft,
  ArrowDownToLine,
  ArrowUpFromLine,
  Car,
  Briefcase,
  AlertTriangle,
  CheckCircle2,
  Save,
  RefreshCw,
  Award,
  Zap,
} from 'lucide-react';

const INITIAL_PLAYER_DATA: PlayerDataSchema = {
  Money: {
    Cash: 2500,
    Bank: 10000,
  },
  Level: 1,
  XP: 250,
  Inventory: [
    { id: 'item_id_card', name: 'DNI Ciudadano', quantity: 1 },
    { id: 'item_phone', name: 'Smartphone Vigo 5G', quantity: 1 },
  ],
  Weapons: [],
  Vehicles: [
    { id: 'veh_compact_01', name: 'Compacto Clásico', color: 'White', mods: {} },
  ],
  Properties: [],
  OwnedBusinesses: [],
  WantedLevel: 0,
  Job: 'Civilian',
  Faction: 'None',
  CharacterCustomization: {
    outfitId: 'default_casual',
    skinColor: 'Default',
  },
  Settings: {
    musicVolume: 80,
    sfxVolume: 100,
    uiScale: 1,
  },
  _metadata: {
    lastSaveTime: Date.now(),
    dataVersion: 1,
  },
};

export const EconomySimulator: React.FC = () => {
  const [playerData, setPlayerData] = useState<PlayerDataSchema>(INITIAL_PLAYER_DATA);
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: 'log-1',
      timestamp: new Date().toLocaleTimeString(),
      action: 'DATASTORE_LOAD',
      status: 'SUCCESS',
      details: 'Perfil de jugador cargado de DataStore (VigoCity_PlayerData_v1)',
      player: 'Alex_Vigo',
    },
  ]);

  const [depositAmount, setDepositAmount] = useState<number>(500);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(250);
  const [transferAmount, setTransferAmount] = useState<number>(1000);
  const [lastNotice, setLastNotice] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  // Auto-save timer simulation
  const [secondsUntilSave, setSecondsUntilSave] = useState(30);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsUntilSave((prev) => {
        if (prev <= 1) {
          addLog('DATASTORE_AUTOSAVE', 'SUCCESS', 'Auto-guardado periódico completado (300s cycle)');
          return 30;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const addLog = (action: string, status: 'SUCCESS' | 'REJECTED_EXPLOIT' | 'WARNING', details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date().toLocaleTimeString(),
      action,
      status,
      details,
      player: 'Alex_Vigo',
    };
    setLogs((prev) => [newLog, ...prev.slice(0, 19)]);
  };

  const showNotice = (message: string, type: 'success' | 'error' | 'warning') => {
    setLastNotice({ message, type });
    setTimeout(() => setLastNotice(null), 4000);
  };

  // 1. Authoritative Deposit
  const handleDeposit = (amount: number) => {
    if (amount <= 0 || isNaN(amount)) {
      addLog('EXPLOIT_ATTEMPT', 'REJECTED_EXPLOIT', `Servidor rechazó depósito con cantidad inválida: ${amount}`);
      showNotice(`[Servidor]: Rechazado. El monto debe ser estrictamente positivo.`, 'error');
      return;
    }

    if (playerData.Money.Cash < amount) {
      addLog('TRANSACTION_FAILED', 'WARNING', `Efectivo insuficiente ($${playerData.Money.Cash}) para depositar $${amount}`);
      showNotice(`[Servidor]: No tienes suficiente dinero en efectivo.`, 'warning');
      return;
    }

    setPlayerData((prev) => ({
      ...prev,
      Money: {
        Cash: prev.Money.Cash - amount,
        Bank: prev.Money.Bank + amount,
      },
    }));

    addLog('ATM_DEPOSIT', 'SUCCESS', `Depósito de $${amount.toLocaleString()} a la cuenta bancaria`);
    showNotice(`[Cajero ATM]: Has depositado $${amount.toLocaleString()} en tu cuenta bancaria.`, 'success');
  };

  // 2. Authoritative Withdraw
  const handleWithdraw = (amount: number) => {
    if (amount <= 0 || isNaN(amount)) {
      addLog('EXPLOIT_ATTEMPT', 'REJECTED_EXPLOIT', `Servidor rechazó retirada inválida: ${amount}`);
      showNotice(`[Servidor]: Rechazado. Cantidad inválida.`, 'error');
      return;
    }

    if (playerData.Money.Bank < amount) {
      addLog('TRANSACTION_FAILED', 'WARNING', `Saldo bancario insuficiente ($${playerData.Money.Bank}) para retirar $${amount}`);
      showNotice(`[Servidor]: Saldo bancario insuficiente.`, 'warning');
      return;
    }

    setPlayerData((prev) => ({
      ...prev,
      Money: {
        Cash: prev.Money.Cash + amount,
        Bank: prev.Money.Bank - amount,
      },
    }));

    addLog('ATM_WITHDRAW', 'SUCCESS', `Retirada de $${amount.toLocaleString()} en efectivo`);
    showNotice(`[Cajero ATM]: Has retirado $${amount.toLocaleString()} en efectivo.`, 'success');
  };

  // 3. Authoritative Transfer
  const handleTransfer = (amount: number) => {
    if (playerData.Money.Bank < amount) {
      addLog('TRANSACTION_FAILED', 'WARNING', `Fondos insuficientes para transferir $${amount}`);
      showNotice(`[Banca Móvil]: Saldo bancario insuficiente para realizar la transferencia.`, 'warning');
      return;
    }

    setPlayerData((prev) => ({
      ...prev,
      Money: {
        ...prev.Money,
        Bank: prev.Money.Bank - amount,
      },
    }));

    addLog('BANK_TRANSFER', 'SUCCESS', `Transferencia de $${amount.toLocaleString()} al jugador 'Mateo_Vigo'`);
    showNotice(`[Banca Móvil]: Has transferido $${amount.toLocaleString()} a Mateo_Vigo.`, 'success');
  };

  // 4. Job reward (Delivery mission)
  const handleJobDelivery = () => {
    const reward = 450;
    const xpGain = 120;

    setPlayerData((prev) => {
      const newXP = prev.XP + xpGain;
      const leveledUp = newXP >= 1000;
      return {
        ...prev,
        Money: {
          ...prev.Money,
          Cash: prev.Money.Cash + reward,
        },
        XP: leveledUp ? newXP - 1000 : newXP,
        Level: leveledUp ? prev.Level + 1 : prev.Level,
      };
    });

    addLog('JOB_REWARD', 'SUCCESS', `Misión de reparto completada. +$${reward} en efectivo, +${xpGain} XP`);
    showNotice(`[Trabajo]: ¡Entrega completada! Recibes $${reward} en efectivo y ${xpGain} XP.`, 'success');
  };

  // 5. Buy Vehicle (authoritative purchase)
  const handleBuyCar = () => {
    const carPrice = 8500;
    const carId = 'veh_sedan_gt';

    if (playerData.Vehicles.some((v) => v.id === carId)) {
      showNotice(`[Concesionario]: Ya posees este vehículo en tu garaje.`, 'warning');
      return;
    }

    if (playerData.Money.Bank < carPrice) {
      addLog('PURCHASE_FAILED', 'WARNING', `Intento de compra fallido por fondos insuficientes (Precio: $${carPrice})`);
      showNotice(`[Concesionario]: Saldo bancario insuficiente para comprar el Sedán Vigo GT ($8,500).`, 'warning');
      return;
    }

    setPlayerData((prev) => ({
      ...prev,
      Money: {
        ...prev.Money,
        Bank: prev.Money.Bank - carPrice,
      },
      Vehicles: [
        ...prev.Vehicles,
        { id: carId, name: 'Sedán Vigo GT', color: 'Midnight Blue', mods: { Turbo: 1 } },
      ],
    }));

    addLog('PURCHASE_SUCCESS', 'SUCCESS', `Vehículo 'Sedán Vigo GT' comprado por $${carPrice.toLocaleString()}`);
    showNotice(`[Concesionario]: ¡Felicidades! Has comprado el Sedán Vigo GT. Guardado en tu garaje.`, 'success');
  };

  // 6. Exploit Simulation 1: Client injects Money directly
  const simulateClientMoneyHack = () => {
    addLog(
      'EXPLOIT_TAMPER_DETECTED',
      'REJECTED_EXPLOIT',
      'El cliente intentó sobreescribir PlayerData.Money.Cash = 999,999,999. El servidor rechazó la mutación porque el cliente carece de autoridad.'
    );
    showNotice(`[Seguridad Servidor]: Intento de inyección local bloqueado. El servidor es la única autoridad de datos.`, 'error');
  };

  // 7. Exploit Simulation 2: Negative amount exploit
  const simulateNegativeDeposit = () => {
    addLog(
      'EXPLOIT_NEGATIVE_NUMBER',
      'REJECTED_EXPLOIT',
      'Invocación rechazada: RemoteFunction(RequestDeposit, -50000). Error: "El importe debe ser un número estrictamente positivo".'
    );
    showNotice(`[Seguridad Servidor]: Depósito negativo rechazado. Bloqueo de duplicación infinito activo.`, 'error');
  };

  // 8. Exploit Simulation 3: Remote spamming
  const simulateRemoteSpam = () => {
    addLog(
      'RATE_LIMIT_TRIGGERED',
      'REJECTED_EXPLOIT',
      'Spam de Remotes: 15 llamadas en 0.05s detectadas. Cooldown activado (GameConfig.REMOTE_COOLDOWN).'
    );
    showNotice(`[Seguridad Servidor]: Rate-limit activo. Exceso de llamadas por segundo bloqueado.`, 'error');
  };

  // 9. Simulate Server BindToClose Shutdown
  const simulateServerShutdown = () => {
    addLog(
      'BIND_TO_CLOSE',
      'SUCCESS',
      `game:BindToClose ejecutado. Guardado forzoso de ${playerData.Money.Cash + playerData.Money.Bank} monedas en DataStore antes de apagado.`
    );
    showNotice(`[Roblox Server]: game:BindToClose ejecutado. Todos los perfiles guardados de forma segura en DataStore.`, 'success');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      {lastNotice && (
        <div
          className={`p-3.5 rounded-xl border flex items-center justify-between text-xs font-medium transition-all shadow-md ${
            lastNotice.type === 'success'
              ? 'bg-emerald-950/80 border-emerald-500/50 text-emerald-200'
              : lastNotice.type === 'error'
              ? 'bg-red-950/80 border-red-500/50 text-red-200'
              : 'bg-amber-950/80 border-amber-500/50 text-amber-200'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {lastNotice.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {lastNotice.type === 'error' && <ShieldAlert className="w-4 h-4 text-red-400" />}
            {lastNotice.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400" />}
            <span>{lastNotice.message}</span>
          </div>
        </div>
      )}

      {/* Grid: Player Stats + Roblox Leaderboard Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Authoritative State Card */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <h3 className="text-sm font-bold text-white tracking-wide">
                  ESTADO AUTORITATIVO DEL JUGADOR (Servidor)
                </h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Jugador: <span className="text-indigo-400 font-mono font-medium">Alex_Vigo</span> (UserId: 78294102) • Trabajo: {playerData.Job}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-xs text-slate-400">
              <Save className="w-3.5 h-3.5 text-indigo-400" />
              <span>Auto-guardado en: <strong className="text-white font-mono">{secondsUntilSave}s</strong></span>
            </div>
          </div>

          {/* Money cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                <Wallet className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Efectivo (Cash)</span>
                <div className="text-lg font-bold text-emerald-400 font-mono">
                  ${playerData.Money.Cash.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Banco (Bank)</span>
                <div className="text-lg font-bold text-blue-400 font-mono">
                  ${playerData.Money.Bank.toLocaleString()}
                </div>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3.5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Nivel & Progreso</span>
                <div className="text-lg font-bold text-amber-400 font-mono">
                  Nvl {playerData.Level} <span className="text-xs text-slate-400 font-normal">({playerData.XP}/1000 XP)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventory & Garaje */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              <span className="font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-indigo-400" />
                Vehículos en Garaje ({playerData.Vehicles.length})
              </span>
              <div className="space-y-1">
                {playerData.Vehicles.map((v, i) => (
                  <div key={i} className="flex items-center justify-between py-1 px-2 rounded bg-slate-900 text-slate-300">
                    <span className="font-medium">{v.name}</span>
                    <span className="text-slate-500 text-[11px]">{v.color}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3">
              <span className="font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                Inventario Personal
              </span>
              <div className="space-y-1">
                {playerData.Inventory.map((item, i) => (
                  <div key={i} className="flex items-center justify-between py-1 px-2 rounded bg-slate-900 text-slate-300">
                    <span>{item.name}</span>
                    <span className="text-indigo-400 font-mono">x{item.quantity}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Roblox In-Game HUD Simulation (Leaderstats) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">
                Roblox Leaderstats (Top-Right HUD)
              </span>
              <span className="text-[10px] bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded font-mono">
                Instance: leaderstats
              </span>
            </div>

            <div className="mt-4 bg-black/60 border border-slate-700/60 rounded-lg p-3 font-mono text-xs space-y-2">
              <div className="flex justify-between items-center text-slate-400 border-b border-slate-800/80 pb-1.5">
                <span>Jugador</span>
                <div className="flex gap-4">
                  <span className="w-16 text-right">Cash</span>
                  <span className="w-16 text-right">Bank</span>
                  <span className="w-10 text-right">Level</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-slate-200 py-1">
                <span className="font-semibold text-white">Alex_Vigo</span>
                <div className="flex gap-4 font-mono">
                  <span className="w-16 text-right text-emerald-400 font-bold">${playerData.Money.Cash}</span>
                  <span className="w-16 text-right text-blue-400 font-bold">${playerData.Money.Bank}</span>
                  <span className="w-10 text-right text-amber-400">{playerData.Level}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-slate-400 py-1">
                <span>Mateo_Vigo</span>
                <div className="flex gap-4 font-mono">
                  <span className="w-16 text-right">$850</span>
                  <span className="w-16 text-right">$14,200</span>
                  <span className="w-10 text-right">3</span>
                </div>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-3 leading-relaxed">
              Creado automáticamente por <code className="text-indigo-300">PlayerDataServer</code> mediante objetos <code className="text-indigo-300">NumberValue</code> e <code className="text-indigo-300">IntValue</code> dentro de <code className="text-indigo-300">player.leaderstats</code>.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={simulateServerShutdown}
              className="w-full py-2 px-3 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors flex items-center justify-center gap-2 border border-slate-700 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
              <span>Simular Parada de Servidor (game:BindToClose)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Action Panels: ATM & Jobs & Purchase */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* ATM / Bank Operations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ArrowRightLeft className="w-4 h-4 text-indigo-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Cajero Automático (ATM / Banco)
            </h4>
          </div>

          {/* Deposit */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 flex justify-between">
              <span>Depositar efectivo en banco</span>
              <span className="text-slate-500">Mín: $1</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={depositAmount}
                onChange={(e) => setDepositAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
              />
              <button
                onClick={() => handleDeposit(depositAmount)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-600 hover:bg-emerald-500 text-white flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
              >
                <ArrowDownToLine className="w-3.5 h-3.5" />
                <span>Depositar</span>
              </button>
            </div>
          </div>

          {/* Withdraw */}
          <div className="space-y-2">
            <label className="text-xs text-slate-400 flex justify-between">
              <span>Retirar de banco a efectivo</span>
              <span className="text-slate-500">Mín: $1</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
              />
              <button
                onClick={() => handleWithdraw(withdrawAmount)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
              >
                <ArrowUpFromLine className="w-3.5 h-3.5" />
                <span>Retirar</span>
              </button>
            </div>
          </div>

          {/* Transfer */}
          <div className="space-y-2 pt-1 border-t border-slate-800/60">
            <label className="text-xs text-slate-400 flex justify-between">
              <span>Transferir a Mateo_Vigo (Online)</span>
              <span className="text-slate-500">Mín: $10</span>
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono"
              />
              <button
                onClick={() => handleTransfer(transferAmount)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1 shrink-0 cursor-pointer shadow-sm"
              >
                <ArrowRightLeft className="w-3.5 h-3.5" />
                <span>Enviar</span>
              </button>
            </div>
          </div>
        </div>

        {/* Legal Jobs & Dealership Operations */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Briefcase className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Economía Legal & Concesionario
            </h4>
          </div>

          <div className="space-y-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">Trabajo de Reparto (Delivery)</span>
                <span className="text-xs font-mono font-bold text-emerald-400">+$450 / entrega</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Gana dinero legal completando rutas de mensajería sin generar estrellas de wanted.
              </p>
              <button
                onClick={handleJobDelivery}
                className="w-full py-2 rounded-lg text-xs font-medium bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Completar Ruta de Entrega (Simular)</span>
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">Sedán Vigo GT (Concesionario)</span>
                <span className="text-xs font-mono font-bold text-blue-400">$8,500</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Comprobación en servidor: verifica fondos bancarios, registra propiedad en DataStore.
              </p>
              <button
                onClick={handleBuyCar}
                className="w-full py-2 rounded-lg text-xs font-medium bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Car className="w-3.5 h-3.5" />
                <span>Comprar Vehículo ($8,500)</span>
              </button>
            </div>
          </div>
        </div>

        {/* Security & Exploit Testbed */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <ShieldAlert className="w-4 h-4 text-red-400" />
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Testbed de Seguridad Anti-Exploits
            </h4>
          </div>

          <p className="text-[11px] text-slate-400">
            Prueba ataques comunes de inyectores de script para comprobar cómo los rechaza el servidor de Vigo City:
          </p>

          <div className="space-y-2">
            <button
              onClick={simulateClientMoneyHack}
              className="w-full text-left p-2.5 rounded-lg bg-red-950/30 hover:bg-red-950/50 border border-red-800/40 text-xs transition-colors flex items-start gap-2 group cursor-pointer"
            >
              <ShieldAlert className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-red-300 block">1. Inyección Local: Cash = 999M</span>
                <span className="text-[10px] text-slate-400">Demuestra que el cliente no tiene autoridad de memoria.</span>
              </div>
            </button>

            <button
              onClick={simulateNegativeDeposit}
              className="w-full text-left p-2.5 rounded-lg bg-red-950/30 hover:bg-red-950/50 border border-red-800/40 text-xs transition-colors flex items-start gap-2 group cursor-pointer"
            >
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-amber-300 block">2. Invocación Negativa: Deposit(-50,000)</span>
                <span className="text-[10px] text-slate-400">Neutraliza la duplicación infinita de fondos en Roblox.</span>
              </div>
            </button>

            <button
              onClick={simulateRemoteSpam}
              className="w-full text-left p-2.5 rounded-lg bg-purple-950/30 hover:bg-purple-950/50 border border-purple-800/40 text-xs transition-colors flex items-start gap-2 group cursor-pointer"
            >
              <Zap className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-purple-300 block">3. Spam de RemoteFunction (15 req/s)</span>
                <span className="text-[10px] text-slate-400">Comprueba la limitación de tasa por jugador.</span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Transaction & Security Audit Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Registro de Auditoría del Servidor (Audit Log en tiempo real)
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded font-mono">
              {logs.length} eventos registrados
            </span>
          </div>
          <button
            onClick={() => setLogs([])}
            className="text-[11px] text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
          >
            Limpiar registro
          </button>
        </div>

        <div className="max-h-60 overflow-y-auto space-y-1.5 font-mono text-xs pr-1">
          {logs.map((log) => (
            <div
              key={log.id}
              className={`p-2.5 rounded-lg border flex items-center justify-between gap-3 ${
                log.status === 'SUCCESS'
                  ? 'bg-slate-950/80 border-slate-800/80 text-slate-300'
                  : log.status === 'REJECTED_EXPLOIT'
                  ? 'bg-red-950/30 border-red-900/40 text-red-300'
                  : 'bg-amber-950/30 border-amber-900/40 text-amber-300'
              }`}
            >
              <div className="flex items-center gap-2.5 truncate">
                <span className="text-slate-500 text-[10px] shrink-0">{log.timestamp}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                    log.status === 'SUCCESS'
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : log.status === 'REJECTED_EXPLOIT'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-amber-500/20 text-amber-400'
                  }`}
                >
                  {log.action}
                </span>
                <span className="truncate">{log.details}</span>
              </div>
              <span className="text-slate-500 text-[11px] shrink-0 font-sans">{log.player}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
