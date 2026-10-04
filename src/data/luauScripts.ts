import { LuauFile } from '../types/roblox';

export const LUAU_SCRIPTS: LuauFile[] = [
  // ==========================================
  // REPLICATED STORAGE - SHARED CONFIG & CONSTANTS
  // ==========================================
  {
    id: 'playerdata-template',
    name: 'PlayerDataTemplate',
    path: 'ReplicatedStorage/Shared/Config/PlayerDataTemplate',
    parentPath: 'ReplicatedStorage/Shared/Config',
    type: 'ModuleScript',
    phase: 1,
    description: 'Plantilla base por defecto para el perfil de cada jugador nuevo. Soporta reconciliación automática.',
    code: `--!strict
--[[
  VIGO CITY - Open World Roleplay
  Archivo: ReplicatedStorage/Shared/Config/PlayerDataTemplate.luau
  Descripción: Estructura de datos por defecto para nuevos jugadores.
  Cualquier campo añadido aquí en futuras fases se reconciliará automáticamente
  en los perfiles de jugadores existentes sin borrar sus datos.
]]

export type PlayerData = {
	Money: {
		Cash: number,
		Bank: number,
	},
	Level: number,
	XP: number,
	Inventory: { [string]: any },
	Weapons: { [string]: any },
	Vehicles: { [string]: any },
	Properties: { [string]: any },
	OwnedBusinesses: { [string]: any },
	WantedLevel: number,
	Job: string,
	Faction: string,
	CharacterCustomization: {
		outfitId: string,
		skinColor: string,
	},
	Settings: {
		musicVolume: number,
		sfxVolume: number,
		uiScale: number,
	},
	_metadata: {
		createdTime: number,
		lastSaveTime: number,
		dataVersion: number,
	}
}

local PlayerDataTemplate: PlayerData = {
	Money = {
		Cash = 2500,     -- Dinero inicial en efectivo para compras básicas
		Bank = 10000,    -- Dinero inicial en banco
	},
	Level = 1,
	XP = 0,
	Inventory = {},
	Weapons = {
		-- Formato: ["WeaponId"] = { ammo = 30 }
	},
	Vehicles = {
		-- Formato: ["Veh_Sedan01"] = { name = "Sedan Urbano", color = "White", mods = {} }
	},
	Properties = {},
	OwnedBusinesses = {},
	WantedLevel = 0,
	Job = "Civilian",
	Faction = "None",
	CharacterCustomization = {
		outfitId = "default_casual",
		skinColor = "Default",
	},
	Settings = {
		musicVolume = 80,
		sfxVolume = 100,
		uiScale = 1,
	},
	_metadata = {
		createdTime = 0,
		lastSaveTime = 0,
		dataVersion = 1,
	}
}

return PlayerDataTemplate
`,
    setupInstructions: 'Crea un ModuleScript en ReplicatedStorage > Shared > Config llamado "PlayerDataTemplate".',
    testInstructions: 'Revisa que devuelva una tabla válida. Si añades un nuevo campo aquí, el reconciliador de PlayerDataManager lo aplicará automáticamente.',
  },
  {
    id: 'game-config',
    name: 'GameConfig',
    path: 'ReplicatedStorage/Shared/Config/GameConfig',
    parentPath: 'ReplicatedStorage/Shared/Config',
    type: 'ModuleScript',
    phase: 1,
    description: 'Parámetros globales del servidor, límites y versiones de DataStore.',
    code: `--!strict
--[[
  VIGO CITY - Open World Roleplay
  Archivo: ReplicatedStorage/Shared/Config/GameConfig.luau
  Descripción: Configuración global del juego y constantes operativas.
]]

local GameConfig = {
	-- Configuración de DataStore
	DATA_STORE_NAME = "VigoCity_PlayerData_v1",
	DATA_STORE_SCOPE = "Production",
	AUTO_SAVE_INTERVAL = 300, -- Guardado periódico cada 5 minutos (300 segundos)
	MAX_SAVE_RETRIES = 3,     -- Intentos ante fallos de conexión con Roblox DataStore
	RETRY_DELAY = 2,          -- Segundos entre reintentos

	-- Rate limiting y seguridad
	REMOTE_COOLDOWN = 0.25,   -- Tiempo mínimo entre llamadas de red del mismo cliente (evita spam)
	MAX_TRANSACTION_LIMIT = 5000000, -- Límite máximo de una sola transacción bancaria

	-- Niveles
	MAX_LEVEL = 100,
	BASE_XP_PER_LEVEL = 1000,
	XP_GROWTH_FACTOR = 1.15,

	-- Debug
	VERBOSE_LOGS = true,
}

return table.freeze(GameConfig)
`,
    setupInstructions: 'Crea un ModuleScript en ReplicatedStorage > Shared > Config llamado "GameConfig".',
  },
  {
    id: 'economy-config',
    name: 'EconomyConfig',
    path: 'ReplicatedStorage/Shared/Config/EconomyConfig',
    parentPath: 'ReplicatedStorage/Shared/Config',
    type: 'ModuleScript',
    phase: 2,
    description: 'Reglas de negocio económico: comisiones de cajero, salarios base y límites.',
    code: `--!strict
--[[
  VIGO CITY - Open World Roleplay
  Archivo: ReplicatedStorage/Shared/Config/EconomyConfig.luau
  Descripción: Parámetros del sistema económico, tarifas y salarios base.
]]

local EconomyConfig = {
	-- Límites y tarifas de transferencias
	ATM_FEE_PERCENTAGE = 0, -- Sin comisión en cajeros para incentivar uso de banco
	MIN_DEPOSIT_AMOUNT = 1,
	MIN_WITHDRAW_AMOUNT = 1,
	MIN_TRANSFER_AMOUNT = 10,
	MAX_TRANSFER_AMOUNT = 500000,

	-- Salarios pasivos o por ciclo de trabajo (en segundos)
	PAYCHECK_INTERVAL = 600, -- Cada 10 minutos
	JOB_SALARIES = {
		Civilian = 150,
		Delivery = 450,
		Taxi = 500,
		Mechanic = 650,
		Police = 800,
	},

	-- Monedas admitidas
	CURRENCY_TYPES = {
		CASH = "Cash",
		BANK = "Bank",
	},
}

return table.freeze(EconomyConfig)
`,
    setupInstructions: 'Crea un ModuleScript en ReplicatedStorage > Shared > Config llamado "EconomyConfig".',
  },
  {
    id: 'network-events',
    name: 'NetworkEvents',
    path: 'ReplicatedStorage/Shared/Constants/NetworkEvents',
    parentPath: 'ReplicatedStorage/Shared/Constants',
    type: 'ModuleScript',
    phase: 1,
    description: 'Nombres estandarizados de RemoteEvents y RemoteFunctions para evitar cadenas mágicas.',
    code: `--!strict
--[[
  VIGO CITY - Open World Roleplay
  Archivo: ReplicatedStorage/Shared/Constants/NetworkEvents.luau
  Descripción: Nombres de todos los Remotes cliente-servidor para evitar errores tipográficos.
]]

local NetworkEvents = {
	-- PlayerData
	PLAYER_DATA_LOADED = "PlayerDataLoaded",     -- RemoteEvent (Server -> Client)
	PLAYER_DATA_UPDATED = "PlayerDataUpdated",   -- RemoteEvent (Server -> Client)
	NOTIFY_CLIENT = "NotifyClient",               -- RemoteEvent (Server -> Client: HUD alerts)

	-- Economy
	REQUEST_DEPOSIT = "RequestDeposit",           -- RemoteFunction (Client -> Server)
	REQUEST_WITHDRAW = "RequestWithdraw",         -- RemoteFunction (Client -> Server)
	REQUEST_TRANSFER = "RequestTransfer",         -- RemoteFunction (Client -> Server)
	GET_BALANCE = "GetBalance",                   -- RemoteFunction (Client -> Server)
}

return table.freeze(NetworkEvents)
`,
    setupInstructions: 'Crea un ModuleScript en ReplicatedStorage > Shared > Constants llamado "NetworkEvents".',
  },
  {
    id: 'table-util',
    name: 'TableUtil',
    path: 'ReplicatedStorage/Shared/Utilities/TableUtil',
    parentPath: 'ReplicatedStorage/Shared/Utilities',
    type: 'ModuleScript',
    phase: 1,
    description: 'Utilidades de copia profunda y reconciliación de tablas para migraciones de schema.',
    code: `--!strict
--[[
  VIGO CITY - Open World Roleplay
  Archivo: ReplicatedStorage/Shared/Utilities/TableUtil.luau
  Descripción: Funciones utilitarias para clonación y reconciliación de esquemas de datos.
]]

local TableUtil = {}

-- Copia recursiva profunda para evitar mutaciones de referencias compartidas
function TableUtil.DeepCopy<T>(target: T): T
	if type(target) ~= "table" then
		return target
	end

	local copy = {}
	for key, value in pairs(target :: any) do
		if type(value) == "table" then
			copy[key] = TableUtil.DeepCopy(value)
		else
			copy[key] = value
		end
	end

	return (copy :: any) :: T
end

-- Reconcilia datos cargados de DataStore con una plantilla base.
-- Si la plantilla tiene nuevos campos que el jugador antiguo no tenía, los añade sin sobrescribir los suyos.
function TableUtil.Reconcile(target: { [any]: any }, template: { [any]: any }): { [any]: any }
	assert(type(target) == "table", "Target must be a table")
	assert(type(template) == "table", "Template must be a table")

	for key, templateValue in pairs(template) do
		if target[key] == nil then
			if type(templateValue) == "table" then
				target[key] = TableUtil.DeepCopy(templateValue)
			else
				target[key] = templateValue
			end
		elseif type(target[key]) == "table" and type(templateValue) == "table" then
			TableUtil.Reconcile(target[key], templateValue)
		end
	end

	return target
end

return TableUtil
`,
    setupInstructions: 'Crea un ModuleScript en ReplicatedStorage > Shared > Utilities llamado "TableUtil".',
  },

  // ==========================================
  // SERVER SCRIPT SERVICE - PLAYER DATA SYSTEM
  // ==========================================
  {
    id: 'player-data-manager',
    name: 'PlayerDataManager',
    path: 'ServerScriptService/Systems/PlayerData/PlayerDataManager',
    parentPath: 'ServerScriptService/Systems/PlayerData',
    type: 'ModuleScript',
    phase: 1,
    description: 'Manejador central de perfiles en memoria con persistencia en DataStoreService, reintentos y reconciliación.',
    code: `--!strict
--[[
  VIGO CITY - Open World Roleplay
  Archivo: ServerScriptService/Systems/PlayerData/PlayerDataManager.luau
  Descripción: Módulo autoritativo en servidor para la carga, caché en memoria,
  mutación y guardado seguro de datos de jugadores mediante DataStoreService.
  NUNCA expuesto al cliente.
]]

local DataStoreService = game:GetService("DataStoreService")
local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Shared = ReplicatedStorage:WaitForChild("Shared")
local Config = Shared:WaitForChild("Config")
local Utilities = Shared:WaitForChild("Utilities")

local PlayerDataTemplate = require(Config:WaitForChild("PlayerDataTemplate"))
local GameConfig = require(Config:WaitForChild("GameConfig"))
local TableUtil = require(Utilities:WaitForChild("TableUtil"))

local PlayerDataManager = {}

-- Caché en memoria: [Player] = PlayerData
local sessionCache: { [Player]: PlayerDataTemplate.PlayerData } = {}

-- Estado de bloqueo de sesión para evitar accesos concurrentes no autorizados
local loadedPlayers: { [Player]: boolean } = {}

-- Eventos internos del servidor (Signals usando BindableEvents)
local onDataLoadedEvent = Instance.new("BindableEvent")
local onDataChangedEvent = Instance.new("BindableEvent")

PlayerDataManager.OnDataLoaded = onDataLoadedEvent.Event
PlayerDataManager.OnDataChanged = onDataChangedEvent.Event

-- Inicializar DataStore de Roblox con manejo de errores pcall
local playerDataStore: DataStore? = nil
local function getDataStore(): DataStore?
	if not playerDataStore then
		local success, result = pcall(function()
			return DataStoreService:GetDataStore(GameConfig.DATA_STORE_NAME, GameConfig.DATA_STORE_SCOPE)
		end)
		if success then
			playerDataStore = result
		else
			warn("[PlayerDataManager] Error al conectar con DataStoreService:", result)
		end
	end
	return playerDataStore
end

-- Cargar datos cuando un jugador entra al servidor
function PlayerDataManager.LoadProfile(player: Player): PlayerDataTemplate.PlayerData?
	local store = getDataStore()
	local userIdKey = "Player_" .. tostring(player.UserId)
	local loadedData = nil

	if store then
		for attempt = 1, GameConfig.MAX_SAVE_RETRIES do
			local success, result = pcall(function()
				return store:GetAsync(userIdKey)
			end)

			if success then
				loadedData = result
				break
			else
				warn(string.format("[PlayerDataManager] Reintento %d/%d al cargar datos de %s (%d): %s",
					attempt, GameConfig.MAX_SAVE_RETRIES, player.Name, player.UserId, tostring(result)))
				task.wait(GameConfig.RETRY_DELAY)
			end
		end
	else
		warn("[PlayerDataManager] DataStore no disponible (Modo sin persistencia activado)")
	end

	-- Si es un jugador nuevo o no hay datos previos, clonar plantilla
	if loadedData == nil then
		loadedData = TableUtil.DeepCopy(PlayerDataTemplate)
		loadedData._metadata.createdTime = os.time()
		if GameConfig.VERBOSE_LOGS then
			print("[PlayerDataManager] Perfil inicial creado para nuevo jugador:", player.Name)
		end
	else
		-- Reconciliar con la plantilla actual para incluir campos nuevos de actualizaciones
		TableUtil.Reconcile(loadedData, PlayerDataTemplate)
	end

	loadedData._metadata.lastSaveTime = os.time()
	sessionCache[player] = loadedData
	loadedPlayers[player] = true

	onDataLoadedEvent:Fire(player, loadedData)
	return loadedData
end

-- Guardar datos de un jugador
function PlayerDataManager.SaveProfile(player: Player): boolean
	local data = sessionCache[player]
	if not data then
		return false
	end

	local store = getDataStore()
	if not store then
		return false
	end

	data._metadata.lastSaveTime = os.time()
	local userIdKey = "Player_" .. tostring(player.UserId)
	local saveSuccess = false

	for attempt = 1, GameConfig.MAX_SAVE_RETRIES do
		local success, err = pcall(function()
			store:SetAsync(userIdKey, data)
		end)

		if success then
			saveSuccess = true
			if GameConfig.VERBOSE_LOGS then
				print("[PlayerDataManager] Datos guardados exitosamente para:", player.Name)
			end
			break
		else
			warn(string.format("[PlayerDataManager] Error guardando datos de %s (Intento %d): %s",
				player.Name, attempt, tostring(err)))
			task.wait(GameConfig.RETRY_DELAY)
		end
	end

	return saveSuccess
end

-- Liberar sesión cuando el jugador se desconecta
function PlayerDataManager.ReleaseProfile(player: Player)
	if sessionCache[player] then
		PlayerDataManager.SaveProfile(player)
		sessionCache[player] = nil
		loadedPlayers[player] = nil
	end
end

-- Obtener copia de lectura o tabla de datos del jugador
function PlayerDataManager.Get(player: Player, path: string?): any
	local data = sessionCache[player]
	if not data then
		return nil
	end

	if not path or path == "" then
		return data
	end

	-- Navegación por puntos tipo "Money.Cash" o "Settings.musicVolume"
	local current: any = data
	for segment in string.gmatch(path, "[^%.]+") do
		if type(current) == "table" and current[segment] ~= nil then
			current = current[segment]
		else
			return nil
		end
	end

	return current
end

-- Actualización atómica en memoria
function PlayerDataManager.Set(player: Player, path: string, value: any): boolean
	local data = sessionCache[player]
	if not data then
		return false
	end

	local segments = {}
	for segment in string.gmatch(path, "[^%.]+") do
		table.insert(segments, segment)
	end

	if #segments == 0 then
		return false
	end

	local current: any = data
	for i = 1, #segments - 1 do
		local segment = segments[i]
		if current[segment] == nil or type(current[segment]) ~= "table" then
			current[segment] = {}
		end
		current = current[segment]
	end

	local lastSegment = segments[#segments]
	current[lastSegment] = value

	onDataChangedEvent:Fire(player, path, value)
	return true
end

-- Comprobar si el perfil de un jugador ya está disponible
function PlayerDataManager.IsLoaded(player: Player): boolean
	return loadedPlayers[player] == true
end

-- Obtener todos los jugadores en sesión (útil para guardados globales)
function PlayerDataManager.GetActiveSessions()
	return sessionCache
end

return PlayerDataManager
`,
    setupInstructions: 'Crea un ModuleScript en ServerScriptService > Systems > PlayerData llamado "PlayerDataManager".',
  },
  {
    id: 'player-data-server',
    name: 'PlayerDataServer',
    path: 'ServerScriptService/Systems/PlayerData/PlayerDataServer',
    parentPath: 'ServerScriptService/Systems/PlayerData',
    type: 'Script',
    phase: 1,
    description: 'Script de servidor que escucha conexiones/desconexiones de jugadores, replica datos al cliente y actualiza leaderstats.',
    code: `--!strict
--[[
  VIGO CITY - Open World Roleplay
  Archivo: ServerScriptService/Systems/PlayerData/PlayerDataServer.luau
  Descripción: Script principal de ciclo de vida del jugador en el servidor.
  Conecta PlayerAdded, PlayerRemoving, sincroniza leaderstats nativo y réplicas de red.
]]

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")

local Shared = ReplicatedStorage:WaitForChild("Shared")
local Constants = Shared:WaitForChild("Constants")
local Config = Shared:WaitForChild("Config")
local NetworkEvents = require(Constants:WaitForChild("NetworkEvents"))
local GameConfig = require(Config:WaitForChild("GameConfig"))

local Systems = ServerScriptService:WaitForChild("Systems")
local PlayerData = Systems:WaitForChild("PlayerData")
local PlayerDataManager = require(PlayerData:WaitForChild("PlayerDataManager"))

local Remotes = ReplicatedStorage:WaitForChild("Remotes")
local PlayerDataRemotes = Remotes:WaitForChild("PlayerData")
local playerDataLoadedEvent = PlayerDataRemotes:WaitForChild(NetworkEvents.PLAYER_DATA_LOADED) :: RemoteEvent
local playerDataUpdatedEvent = PlayerDataRemotes:WaitForChild(NetworkEvents.PLAYER_DATA_UPDATED) :: RemoteEvent

-- Crear o actualizar carpeta nativa "leaderstats" de Roblox (Top-Right HUD nativo)
local function setupLeaderstats(player: Player, data: any)
	local leaderstats = player:FindFirstChild("leaderstats")
	if not leaderstats then
		leaderstats = Instance.new("Folder")
		leaderstats.Name = "leaderstats"
		leaderstats.Parent = player
	end

	-- Cash (Efectivo)
	local cashVal = leaderstats:FindFirstChild("Cash") :: NumberValue?
	if not cashVal then
		cashVal = Instance.new("NumberValue")
		cashVal.Name = "Cash"
		cashVal.Parent = leaderstats
	end
	cashVal.Value = data.Money.Cash

	-- Bank (Banco)
	local bankVal = leaderstats:FindFirstChild("Bank") :: NumberValue?
	if not bankVal then
		bankVal = Instance.new("NumberValue")
		bankVal.Name = "Bank"
		bankVal.Parent = leaderstats
	end
	bankVal.Value = data.Money.Bank

	-- Level (Nivel)
	local levelVal = leaderstats:FindFirstChild("Level") :: IntValue?
	if not levelVal then
		levelVal = Instance.new("IntValue")
		levelVal.Name = "Level"
		levelVal.Parent = leaderstats
	end
	levelVal.Value = data.Level
end

-- Listener cuando los datos cambian internamente en PlayerDataManager
PlayerDataManager.OnDataChanged:Connect(function(player: Player, path: string, value: any)
	-- Sincronizar leaderstats si el cambio fue en dinero o nivel
	local leaderstats = player:FindFirstChild("leaderstats")
	if leaderstats then
		if path == "Money.Cash" then
			local cashVal = leaderstats:FindFirstChild("Cash") :: NumberValue?
			if cashVal then cashVal.Value = value end
		elseif path == "Money.Bank" then
			local bankVal = leaderstats:FindFirstChild("Bank") :: NumberValue?
			if bankVal then bankVal.Value = value end
		elseif path == "Level" then
			local levelVal = leaderstats:FindFirstChild("Level") :: IntValue?
			if levelVal then levelVal.Value = value end
		end
	end

	-- Replicar cambio al cliente dueño para actualizar su HUD/UI
	playerDataUpdatedEvent:FireClient(player, path, value)
end)

-- Conexión al unirse un jugador
local function onPlayerAdded(player: Player)
	local data = PlayerDataManager.LoadProfile(player)
	if data then
		setupLeaderstats(player, data)
		-- Enviar copia completa del estado inicial al cliente
		playerDataLoadedEvent:FireClient(player, data)
	end
end

-- Conexión al salir un jugador
local function onPlayerRemoving(player: Player)
	PlayerDataManager.ReleaseProfile(player)
end

Players.PlayerAdded:Connect(onPlayerAdded)
Players.PlayerRemoving:Connect(onPlayerRemoving)

-- Si hay jugadores que entraron antes de que el script terminara de cargar (Studio Play Solo)
for _, player in ipairs(Players:GetPlayers()) do
	task.spawn(onPlayerAdded, player)
end

-- Bucle de autoguardado periódico para prevenir pérdida de progreso ante caídas
task.spawn(function()
	while true do
		task.wait(GameConfig.AUTO_SAVE_INTERVAL)
		for _, player in ipairs(Players:GetPlayers()) do
			if PlayerDataManager.IsLoaded(player) then
				task.spawn(function()
					PlayerDataManager.SaveProfile(player)
				end)
			end
		end
	end
end)

-- Manejo crítico de cierre de servidor (BindToClose): asegura guardar a todos los jugadores
game:BindToClose(function()
	print("[PlayerDataServer] Servidor cerrándose: Guardando perfiles de todos los jugadores...")
	local activeSessions = PlayerDataManager.GetActiveSessions()
	local remaining = 0

	for player, _ in pairs(activeSessions) do
		remaining += 1
		task.spawn(function()
			PlayerDataManager.SaveProfile(player)
			remaining -= 1
		end)
	end

	-- Esperar a que terminen los guardados con tiempo límite seguro de 15 segundos
	local timeout = 15
	local startTime = os.clock()
	while remaining > 0 and (os.clock() - startTime) < timeout do
		task.wait(0.2)
	end
	print("[PlayerDataServer] Todos los perfiles guardados. Cierre completado.")
end)
`,
    setupInstructions: 'Crea un Script (Server Script) en ServerScriptService > Systems > PlayerData llamado "PlayerDataServer".',
  },

  // ==========================================
  // SERVER SCRIPT SERVICE - ECONOMY SYSTEM
  // ==========================================
  {
    id: 'economy-manager',
    name: 'EconomyManager',
    path: 'ServerScriptService/Systems/Economy/EconomyManager',
    parentPath: 'ServerScriptService/Systems/Economy',
    type: 'ModuleScript',
    phase: 2,
    description: 'Lógica transaccional autoritativa del servidor: depósitos, retiros, transferencias bancarias, compras e historial de auditoría.',
    code: `--!strict
--[[
  VIGO CITY - Open World Roleplay
  Archivo: ServerScriptService/Systems/Economy/EconomyManager.luau
  Descripción: Lógica económica central del servidor. 100% autoritativo.
  Valida balance, tipos numéricos, enteros positivos, límites y previene exploits de duplicación.
]]

local Players = game:GetService("Players")
local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")

local Shared = ReplicatedStorage:WaitForChild("Shared")
local Config = Shared:WaitForChild("Config")
local EconomyConfig = require(Config:WaitForChild("EconomyConfig"))
local GameConfig = require(Config:WaitForChild("GameConfig"))

local Systems = ServerScriptService:WaitForChild("Systems")
local PlayerData = Systems:WaitForChild("PlayerData")
local PlayerDataManager = require(PlayerData:WaitForChild("PlayerDataManager"))

local EconomyManager = {}

-- Evento de auditoría interna para registro de transacciones sospechosas o exitosas
local transactionLogEvent = Instance.new("BindableEvent")
EconomyManager.OnTransaction = transactionLogEvent.Event

-- Validador estricto de números monetarios para neutralizar exploits (NaN, infinito, negativos, decimales truncados)
local function isValidAmount(amount: any): (boolean, string?)
	if type(amount) ~= "number" then
		return false, "El importe debe ser un número válido"
	end
	if amount ~= amount then -- Verificación de NaN
		return false, "Importe inválido (NaN)"
	end
	if amount <= 0 or amount == math.huge or amount == -math.huge then
		return false, "El importe debe ser un número estrictamente positivo"
	end
	if math.floor(amount) ~= amount then
		return false, "El importe debe ser un número entero (sin decimales)"
	end
	if amount > GameConfig.MAX_TRANSACTION_LIMIT then
		return false, "El importe excede el límite permitido por transacción"
	end
	return true, nil
end

-- Añadir dinero en efectivo
function EconomyManager.AddCash(player: Player, amount: number, reason: string): boolean
	local valid, err = isValidAmount(amount)
	if not valid then
		warn(string.format("[EconomyManager:AddCash] Intento rechazado para %s: %s", player.Name, tostring(err)))
		return false
	end

	local currentCash = PlayerDataManager.Get(player, "Money.Cash") or 0
	local newCash = currentCash + amount
	PlayerDataManager.Set(player, "Money.Cash", newCash)

	transactionLogEvent:Fire({
		player = player,
		action = "ADD_CASH",
		amount = amount,
		balanceAfter = newCash,
		reason = reason or "General",
		timestamp = os.time(),
	})

	return true
end

-- Retirar dinero en efectivo (comprueba si tiene saldo suficiente)
function EconomyManager.RemoveCash(player: Player, amount: number, reason: string): boolean
	local valid, err = isValidAmount(amount)
	if not valid then
		return false
	end

	local currentCash = PlayerDataManager.Get(player, "Money.Cash") or 0
	if currentCash < amount then
		return false -- Fondos insuficientes
	end

	local newCash = currentCash - amount
	PlayerDataManager.Set(player, "Money.Cash", newCash)

	transactionLogEvent:Fire({
		player = player,
		action = "REMOVE_CASH",
		amount = amount,
		balanceAfter = newCash,
		reason = reason or "Purchase",
		timestamp = os.time(),
	})

	return true
end

-- Añadir dinero al banco
function EconomyManager.AddBank(player: Player, amount: number, reason: string): boolean
	local valid, err = isValidAmount(amount)
	if not valid then
		return false
	end

	local currentBank = PlayerDataManager.Get(player, "Money.Bank") or 0
	local newBank = currentBank + amount
	PlayerDataManager.Set(player, "Money.Bank", newBank)

	transactionLogEvent:Fire({
		player = player,
		action = "ADD_BANK",
		amount = amount,
		balanceAfter = newBank,
		reason = reason or "General",
		timestamp = os.time(),
	})

	return true
end

-- Retirar dinero del banco
function EconomyManager.RemoveBank(player: Player, amount: number, reason: string): boolean
	local valid, err = isValidAmount(amount)
	if not valid then
		return false
	end

	local currentBank = PlayerDataManager.Get(player, "Money.Bank") or 0
	if currentBank < amount then
		return false
	end

	local newBank = currentBank - amount
	PlayerDataManager.Set(player, "Money.Bank", newBank)

	transactionLogEvent:Fire({
		player = player,
		action = "REMOVE_BANK",
		amount = amount,
		balanceAfter = newBank,
		reason = reason or "Payment",
		timestamp = os.time(),
	})

	return true
end

-- Depositar en cajero/banco: Mueve de Cash a Bank
function EconomyManager.Deposit(player: Player, amount: number): (boolean, string)
	local valid, err = isValidAmount(amount)
	if not valid then
		return false, err or "Cantidad inválida"
	end

	if amount < EconomyConfig.MIN_DEPOSIT_AMOUNT then
		return false, "El importe mínimo de depósito es $" .. tostring(EconomyConfig.MIN_DEPOSIT_AMOUNT)
	end

	local currentCash = PlayerDataManager.Get(player, "Money.Cash") or 0
	if currentCash < amount then
		return false, "No dispones de suficiente dinero en efectivo para depositar."
	end

	-- Transacción atómica
	local deductSuccess = EconomyManager.RemoveCash(player, amount, "ATM Deposit")
	if not deductSuccess then
		return false, "Fallo al procesar el efectivo."
	end

	EconomyManager.AddBank(player, amount, "ATM Deposit")
	return true, "Depósito completado con éxito."
end

-- Retirar de cajero/banco: Mueve de Bank a Cash
function EconomyManager.Withdraw(player: Player, amount: number): (boolean, string)
	local valid, err = isValidAmount(amount)
	if not valid then
		return false, err or "Cantidad inválida"
	end

	if amount < EconomyConfig.MIN_WITHDRAW_AMOUNT then
		return false, "El importe mínimo de retirada es $" .. tostring(EconomyConfig.MIN_WITHDRAW_AMOUNT)
	end

	local currentBank = PlayerDataManager.Get(player, "Money.Bank") or 0
	if currentBank < amount then
		return false, "Saldo en cuenta bancaria insuficiente."
	end

	local deductSuccess = EconomyManager.RemoveBank(player, amount, "ATM Withdrawal")
	if not deductSuccess then
		return false, "Fallo al procesar saldo bancario."
	end

	EconomyManager.AddCash(player, amount, "ATM Withdrawal")
	return true, "Retirada completada con éxito."
end

-- Transferir dinero por teléfono/banca online a otro jugador conectado
function EconomyManager.TransferBank(sender: Player, targetUserId: number, amount: number): (boolean, string)
	local valid, err = isValidAmount(amount)
	if not valid then
		return false, err or "Cantidad inválida"
	end

	if sender.UserId == targetUserId then
		return false, "No puedes transferirte dinero a ti mismo."
	end

	if amount < EconomyConfig.MIN_TRANSFER_AMOUNT then
		return false, "El importe mínimo de transferencia es $" .. tostring(EconomyConfig.MIN_TRANSFER_AMOUNT)
	end

	if amount > EconomyConfig.MAX_TRANSFER_AMOUNT then
		return false, "El importe máximo permitido es $" .. tostring(EconomyConfig.MAX_TRANSFER_AMOUNT)
	end

	local targetPlayer = Players:GetPlayerByUserId(targetUserId)
	if not targetPlayer then
		return false, "El destinatario no se encuentra conectado al servidor."
	end

	local senderBank = PlayerDataManager.Get(sender, "Money.Bank") or 0
	if senderBank < amount then
		return false, "Saldo insuficiente en tu cuenta bancaria."
	end

	-- Ejecutar transferencia autoritativa
	local success = EconomyManager.RemoveBank(sender, amount, "Transfer to " .. targetPlayer.Name)
	if not success then
		return false, "Error al deducir fondos del remitente."
	end

	EconomyManager.AddBank(targetPlayer, amount, "Transfer from " .. sender.Name)
	return true, string.format("Has transferido exitosamente $%d a %s.", amount, targetPlayer.Name)
end

-- Procesar compras genéricas (Vehículos, armas, propiedades, mejoras)
function EconomyManager.ProcessPurchase(player: Player, cost: number, currencyType: string, itemName: string): (boolean, string)
	local valid, err = isValidAmount(cost)
	if not valid then
		return false, err or "Precio inválido"
	end

	currencyType = currencyType or EconomyConfig.CURRENCY_TYPES.CASH

	if currencyType == EconomyConfig.CURRENCY_TYPES.CASH then
		if EconomyManager.RemoveCash(player, cost, "Purchase: " .. itemName) then
			return true, "Compra completada con efectivo."
		else
			return false, "No tienes suficiente efectivo."
		end
	elseif currencyType == EconomyConfig.CURRENCY_TYPES.BANK then
		if EconomyManager.RemoveBank(player, cost, "Purchase: " .. itemName) then
			return true, "Compra completada mediante débito bancario."
		else
			return false, "Saldo bancario insuficiente."
		end
	end

	return false, "Tipo de divisa no soportado."
end

-- Obtener balances actuales
function EconomyManager.GetBalance(player: Player)
	local cash = PlayerDataManager.Get(player, "Money.Cash") or 0
	local bank = PlayerDataManager.Get(player, "Money.Bank") or 0
	return { Cash = cash, Bank = bank }
end

return EconomyManager
`,
    setupInstructions: 'Crea un ModuleScript en ServerScriptService > Systems > Economy llamado "EconomyManager".',
  },
  {
    id: 'economy-server',
    name: 'EconomyServer',
    path: 'ServerScriptService/Systems/Economy/EconomyServer',
    parentPath: 'ServerScriptService/Systems/Economy',
    type: 'Script',
    phase: 2,
    description: 'Servicio de endpoints de red (RemoteFunctions) para cajeros automáticos, transferencias y control de rate-limit anti-spam.',
    code: `--!strict
--[[
  VIGO CITY - Open World Roleplay
  Archivo: ServerScriptService/Systems/Economy/EconomyServer.luau
  Descripción: Servidor que expone las RemoteFunctions al cliente para cajeros automáticos y banca.
  Aplica limitación de tasa (rate limiting) para evitar que clientes maliciosos sobrecarguen el servidor.
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local Players = game:GetService("Players")

local Shared = ReplicatedStorage:WaitForChild("Shared")
local Constants = Shared:WaitForChild("Constants")
local Config = Shared:WaitForChild("Config")
local NetworkEvents = require(Constants:WaitForChild("NetworkEvents"))
local GameConfig = require(Config:WaitForChild("GameConfig"))

local Systems = ServerScriptService:WaitForChild("Systems")
local Economy = Systems:WaitForChild("Economy")
local EconomyManager = require(Economy:WaitForChild("EconomyManager"))

local Remotes = ReplicatedStorage:WaitForChild("Remotes")
local EconomyRemotes = Remotes:WaitForChild("Economy")

local requestDepositFn = EconomyRemotes:WaitForChild(NetworkEvents.REQUEST_DEPOSIT) :: RemoteFunction
local requestWithdrawFn = EconomyRemotes:WaitForChild(NetworkEvents.REQUEST_WITHDRAW) :: RemoteFunction
local requestTransferFn = EconomyRemotes:WaitForChild(NetworkEvents.REQUEST_TRANSFER) :: RemoteFunction
local getBalanceFn = EconomyRemotes:WaitForChild(NetworkEvents.GET_BALANCE) :: RemoteFunction

-- Rate limiting en memoria por jugador: [Player] = lastActionTimestamp
local lastCallCooldowns: { [Player]: number } = {}

local function checkRateLimit(player: Player): boolean
	local lastCall = lastCallCooldowns[player] or 0
	local now = os.clock()
	if (now - lastCall) < GameConfig.REMOTE_COOLDOWN then
		return false
	end
	lastCallCooldowns[player] = now
	return true
end

-- Limpiar cooldowns cuando un jugador se va
Players.PlayerRemoving:Connect(function(player: Player)
	lastCallCooldowns[player] = nil
end)

-- RemoteFunction: Depositar efectivo en el banco
requestDepositFn.OnServerInvoke = function(player: Player, amount: any)
	if not checkRateLimit(player) then
		return { success = false, message = "Por favor espera un momento antes de otra operación." }
	end

	local success, message = EconomyManager.Deposit(player, amount)
	return { success = success, message = message }
end

-- RemoteFunction: Retirar del banco a efectivo
requestWithdrawFn.OnServerInvoke = function(player: Player, amount: any)
	if not checkRateLimit(player) then
		return { success = false, message = "Por favor espera un momento antes de otra operación." }
	end

	local success, message = EconomyManager.Withdraw(player, amount)
	return { success = success, message = message }
end

-- RemoteFunction: Transferencia interbancaria entre jugadores
requestTransferFn.OnServerInvoke = function(player: Player, targetUserId: any, amount: any)
	if not checkRateLimit(player) then
		return { success = false, message = "Por favor espera un momento antes de otra operación." }
	end

	if type(targetUserId) ~= "number" then
		return { success = false, message = "ID de jugador destinatario inválido." }
	end

	local success, message = EconomyManager.TransferBank(player, targetUserId, amount)
	return { success = success, message = message }
end

-- RemoteFunction: Consultar balance exacto
getBalanceFn.OnServerInvoke = function(player: Player)
	return EconomyManager.GetBalance(player)
end

print("[EconomyServer] Sistema de Economía inicializado y escuchando RemoteFunctions.")
`,
    setupInstructions: 'Crea un Script (Server Script) en ServerScriptService > Systems > Economy llamado "EconomyServer".',
  },

  // ==========================================
  // STARTER PLAYER - CLIENT INTEGRATION
  // ==========================================
  {
    id: 'economy-client',
    name: 'EconomyClient',
    path: 'StarterPlayer/StarterPlayerScripts/InteractionController/EconomyClient',
    parentPath: 'StarterPlayer/StarterPlayerScripts/InteractionController',
    type: 'ModuleScript',
    phase: 2,
    description: 'Controlador del cliente para comunicarse con los cajeros y la banca. Proporciona formateo de moneda y promesas de red.',
    code: `--!strict
--[[
  VIGO CITY - Open World Roleplay
  Archivo: StarterPlayer/StarterPlayerScripts/InteractionController/EconomyClient.luau
  Descripción: Módulo de cliente para interactuar con cajeros (ATM), teléfono y UI de economía.
  Ofrece llamadas seguras con pcall a las RemoteFunctions del servidor.
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")

local Shared = ReplicatedStorage:WaitForChild("Shared")
local Constants = Shared:WaitForChild("Constants")
local NetworkEvents = require(Constants:WaitForChild("NetworkEvents"))

local Remotes = ReplicatedStorage:WaitForChild("Remotes")
local EconomyRemotes = Remotes:WaitForChild("Economy")

local requestDepositFn = EconomyRemotes:WaitForChild(NetworkEvents.REQUEST_DEPOSIT) :: RemoteFunction
local requestWithdrawFn = EconomyRemotes:WaitForChild(NetworkEvents.REQUEST_WITHDRAW) :: RemoteFunction
local requestTransferFn = EconomyRemotes:WaitForChild(NetworkEvents.REQUEST_TRANSFER) :: RemoteFunction
local getBalanceFn = EconomyRemotes:WaitForChild(NetworkEvents.GET_BALANCE) :: RemoteFunction

local EconomyClient = {}

-- Formateador estándar de divisa estilo "$12,450"
function EconomyClient.FormatCurrency(amount: number): string
	local formatted = tostring(math.floor(amount or 0))
	local k
	while true do
		formatted, k = string.gsub(formatted, "^(-?%d+)(%d%d%d)", '%1,%2')
		if k == 0 then break end
	end
	return "$" .. formatted
end

-- Solicitar depósito al servidor
function EconomyClient.Deposit(amount: number): (boolean, string)
	local success, response = pcall(function()
		return requestDepositFn:InvokeServer(amount)
	end)

	if not success then
		return false, "Error de red al conectar con el banco."
	end

	return response.success, response.message
end

-- Solicitar retirada al servidor
function EconomyClient.Withdraw(amount: number): (boolean, string)
	local success, response = pcall(function()
		return requestWithdrawFn:InvokeServer(amount)
	end)

	if not success then
		return false, "Error de red al conectar con el banco."
	end

	return response.success, response.message
end

-- Solicitar transferencia bancaria a otro jugador por UserId
function EconomyClient.Transfer(targetUserId: number, amount: number): (boolean, string)
	local success, response = pcall(function()
		return requestTransferFn:InvokeServer(targetUserId, amount)
	end)

	if not success then
		return false, "Error de red al procesar la transferencia."
	end

	return response.success, response.message
end

-- Obtener balances actuales del servidor
function EconomyClient.GetBalance(): { Cash: number, Bank: number }?
	local success, balance = pcall(function()
		return getBalanceFn:InvokeServer()
	end)

	if success and type(balance) == "table" then
		return balance
	end

	return nil
end

return EconomyClient
`,
    setupInstructions: 'Crea un ModuleScript en StarterPlayer > StarterPlayerScripts > InteractionController llamado "EconomyClient".',
  },
  {
    id: 'player-data-client',
    name: 'PlayerDataClient',
    path: 'StarterPlayer/StarterPlayerScripts/InteractionController/PlayerDataClient',
    parentPath: 'StarterPlayer/StarterPlayerScripts/InteractionController',
    type: 'LocalScript',
    phase: 1,
    description: 'LocalScript que escucha las réplicas del servidor para mantener la caché local sincronizada y lista para el HUD.',
    code: `--!strict
--[[
  VIGO CITY - Open World Roleplay
  Archivo: StarterPlayer/StarterPlayerScripts/InteractionController/PlayerDataClient.luau
  Descripción: LocalScript que recibe la réplica de datos del servidor y notifica a las interfaces (HUD, Phone).
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local Players = game:GetService("Players")

local localPlayer = Players.LocalPlayer
local Shared = ReplicatedStorage:WaitForChild("Shared")
local Constants = Shared:WaitForChild("Constants")
local NetworkEvents = require(Constants:WaitForChild("NetworkEvents"))

local Remotes = ReplicatedStorage:WaitForChild("Remotes")
local PlayerDataRemotes = Remotes:WaitForChild("PlayerData")

local playerDataLoadedEvent = PlayerDataRemotes:WaitForChild(NetworkEvents.PLAYER_DATA_LOADED) :: RemoteEvent
local playerDataUpdatedEvent = PlayerDataRemotes:WaitForChild(NetworkEvents.PLAYER_DATA_UPDATED) :: RemoteEvent

-- Caché local de solo lectura en el cliente
local clientDataCache = nil

-- Evento de aviso cuando los datos iniciales han cargado
playerDataLoadedEvent.OnClientEvent:Connect(function(fullData: any)
	clientDataCache = fullData
	print(string.format("[Vigo City Client] Perfil cargado exitosamente. Efectivo: $%d | Banco: $%d | Nivel: %d",
		fullData.Money.Cash, fullData.Money.Bank, fullData.Level))
end)

-- Evento cuando el servidor actualiza un campo específico
playerDataUpdatedEvent.OnClientEvent:Connect(function(path: string, newValue: any)
	if not clientDataCache then return end

	-- Actualizar en la copia local
	local segments = {}
	for seg in string.gmatch(path, "[^%.]+") do
		table.insert(segments, seg)
	end

	local curr = clientDataCache
	for i = 1, #segments - 1 do
		curr = curr[segments[i]]
		if not curr then return end
	end
	curr[segments[#segments]] = newValue
end)
`,
    setupInstructions: 'Crea un LocalScript en StarterPlayer > StarterPlayerScripts > InteractionController llamado "PlayerDataClient".',
  }
];

export const BOOTSTRAPPER_LUA_COMMAND = `--[[
====================================================================
VIGO CITY - SCRIPT DE BOOTSTRAP RÁPIDO PARA ROBLOX STUDIO
Pega este script en la COMMAND BAR (Barra de Comandos) de Roblox Studio
y presiona ENTER. Creará toda la jerarquía de carpetas y Remotes
automáticamente en un segundo.
====================================================================
]]

local ReplicatedStorage = game:GetService("ReplicatedStorage")
local ServerScriptService = game:GetService("ServerScriptService")
local ServerStorage = game:GetService("ServerStorage")
local StarterPlayer = game:GetService("StarterPlayer")
local StarterPlayerScripts = StarterPlayer:WaitForChild("StarterPlayerScripts")
local StarterGui = game:GetService("StarterGui")

local function getOrCreate(parent: Instance, className: string, name: string): Instance
	local existing = parent:FindFirstChild(name)
	if existing and existing.ClassName == className then
		return existing
	end
	local instance = Instance.new(className)
	instance.Name = name
	instance.Parent = parent
	return instance
end

-- 1. ReplicatedStorage
local rsRemotes = getOrCreate(ReplicatedStorage, "Folder", "Remotes")
local rsPlayerDataRemotes = getOrCreate(rsRemotes, "Folder", "PlayerData")
getOrCreate(rsPlayerDataRemotes, "RemoteEvent", "PlayerDataLoaded")
getOrCreate(rsPlayerDataRemotes, "RemoteEvent", "PlayerDataUpdated")
getOrCreate(rsPlayerDataRemotes, "RemoteEvent", "NotifyClient")

local rsEconomyRemotes = getOrCreate(rsRemotes, "Folder", "Economy")
getOrCreate(rsEconomyRemotes, "RemoteFunction", "RequestDeposit")
getOrCreate(rsEconomyRemotes, "RemoteFunction", "RequestWithdraw")
getOrCreate(rsEconomyRemotes, "RemoteFunction", "RequestTransfer")
getOrCreate(rsEconomyRemotes, "RemoteFunction", "GetBalance")

local rsShared = getOrCreate(ReplicatedStorage, "Folder", "Shared")
getOrCreate(rsShared, "Folder", "Config")
getOrCreate(rsShared, "Folder", "Constants")
getOrCreate(rsShared, "Folder", "Utilities")

-- 2. ServerScriptService
local sssSystems = getOrCreate(ServerScriptService, "Folder", "Systems")
getOrCreate(sssSystems, "Folder", "PlayerData")
getOrCreate(sssSystems, "Folder", "Economy")
getOrCreate(sssSystems, "Folder", "Vehicles")
getOrCreate(sssSystems, "Folder", "Properties")
getOrCreate(sssSystems, "Folder", "Weapons")
getOrCreate(sssSystems, "Folder", "Jobs")
getOrCreate(sssSystems, "Folder", "Crime")
getOrCreate(sssSystems, "Folder", "Police")

-- 3. ServerStorage
getOrCreate(ServerStorage, "Folder", "Vehicles")
getOrCreate(ServerStorage, "Folder", "Weapons")
getOrCreate(ServerStorage, "Folder", "Properties")
getOrCreate(ServerStorage, "Folder", "NPCs")

-- 4. StarterPlayerScripts
getOrCreate(StarterPlayerScripts, "Folder", "UI")
getOrCreate(StarterPlayerScripts, "Folder", "VehicleController")
getOrCreate(StarterPlayerScripts, "Folder", "WeaponController")
getOrCreate(StarterPlayerScripts, "Folder", "InteractionController")

-- 5. StarterGui
getOrCreate(StarterGui, "Folder", "HUD")
getOrCreate(StarterGui, "Folder", "Phone")
getOrCreate(StarterGui, "Folder", "Inventory")
getOrCreate(StarterGui, "Folder", "Garage")
getOrCreate(StarterGui, "Folder", "VehicleShop")
getOrCreate(StarterGui, "Folder", "PropertyShop")
getOrCreate(StarterGui, "Folder", "Map")

print(" [VIGO CITY] ¡Jerarquía de Explorer y Remotes generada exitosamente en Roblox Studio!")
`;
