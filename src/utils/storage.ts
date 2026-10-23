import { BrewLog, GrinderId } from '../types/coffee';
import { INITIAL_LOGS } from '../data/initialLogs';

const STORAGE_KEY_LOGS = 'coffee_grinder_logs_v1';
const STORAGE_KEY_ACTIVE_GRINDER = 'coffee_active_grinder_v1';
const STORAGE_KEY_SOUND = 'coffee_dial_sound_enabled';

export function loadStoredLogs(): BrewLog[] {
  if (typeof window === 'undefined') return INITIAL_LOGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(INITIAL_LOGS));
      return INITIAL_LOGS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_LOGS;
  } catch {
    return INITIAL_LOGS;
  }
}

export function saveStoredLogs(logs: BrewLog[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(logs));
  } catch (err) {
    console.error('Failed to save logs to localStorage', err);
  }
}

export function loadStoredActiveGrinder(): GrinderId {
  if (typeof window === 'undefined') return 'mischief-m40';
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ACTIVE_GRINDER);
    if (raw === 'mischief-m40' || raw === 'lenodi') return raw;
  } catch {
    // fallback
  }
  return 'mischief-m40';
}

export function saveStoredActiveGrinder(id: GrinderId): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_GRINDER, id);
  } catch {
    // ignore
  }
}

export function loadStoredClicks(): Record<GrinderId, number> {
  const defaults: Record<GrinderId, number> = {
    'mischief-m40': 24,
    'lenodi': 40,
  };
  if (typeof window === 'undefined') return defaults;
  try {
    const raw = localStorage.getItem('coffee_grinder_clicks_v2');
    if (!raw) return defaults;
    const parsed = JSON.parse(raw);
    return {
      'mischief-m40': typeof parsed['mischief-m40'] === 'number' ? parsed['mischief-m40'] : 24,
      'lenodi': typeof parsed['lenodi'] === 'number' ? parsed['lenodi'] : 40,
    };
  } catch {
    return defaults;
  }
}

export function saveStoredClicks(clicks: Record<GrinderId, number>): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem('coffee_grinder_clicks_v2', JSON.stringify(clicks));
  } catch {
    // ignore
  }
}

export function loadSoundSetting(): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const val = localStorage.getItem(STORAGE_KEY_SOUND);
    return val !== 'false';
  } catch {
    return true;
  }
}

export function saveSoundSetting(enabled: boolean): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY_SOUND, enabled ? 'true' : 'false');
  } catch {
    // ignore
  }
}

export interface FullBackupPayload {
  version: 2;
  exportedAt: string;
  clicks: Record<GrinderId, number>;
  activeGrinderId: GrinderId;
  logs: BrewLog[];
}

export function exportFullBackup(logs: BrewLog[], clicks: Record<GrinderId, number>, activeGrinderId: GrinderId): void {
  const payload: FullBackupPayload = {
    version: 2,
    exportedAt: new Date().toISOString(),
    clicks,
    activeGrinderId,
    logs,
  };
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(payload, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().slice(0, 10);
  downloadAnchor.setAttribute('href', dataStr);
  downloadAnchor.setAttribute('download', `clik-backup-${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function exportLogsToJson(logs: BrewLog[]): void {
  const clicks = loadStoredClicks();
  const activeGrinder = loadStoredActiveGrinder();
  exportFullBackup(logs, clicks, activeGrinder);
}

