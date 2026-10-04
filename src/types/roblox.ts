export type ScriptType = 'Script' | 'LocalScript' | 'ModuleScript' | 'Folder' | 'RemoteEvent' | 'RemoteFunction';

export interface LuauFile {
  id: string;
  name: string;
  path: string;
  parentPath: string;
  type: ScriptType;
  phase: number;
  description: string;
  code: string;
  setupInstructions?: string;
  testInstructions?: string;
}

export interface PlayerDataSchema {
  Money: {
    Cash: number;
    Bank: number;
  };
  Level: number;
  XP: number;
  Inventory: Array<{ id: string; name: string; quantity: number }>;
  Weapons: Array<{ id: string; ammo: number }>;
  Vehicles: Array<{ id: string; name: string; color: string; mods: Record<string, number> }>;
  Properties: string[];
  OwnedBusinesses: string[];
  WantedLevel: number;
  Job: string;
  Faction: string;
  CharacterCustomization: {
    outfitId: string;
    skinColor: string;
  };
  Settings: {
    musicVolume: number;
    sfxVolume: number;
    uiScale: number;
  };
  _metadata?: {
    lastSaveTime: number;
    dataVersion: number;
  };
}

export interface AuditLog {
  id: string;
  timestamp: string;
  action: string;
  status: 'SUCCESS' | 'REJECTED_EXPLOIT' | 'WARNING';
  details: string;
  player: string;
}
