import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config';
import { BrewLog, GrinderId } from '../types/coffee';

const SETTINGS_DOC_PATH = 'settings/current';
const BREW_LOGS_COLLECTION = 'brew_logs';

/**
 * Subscribe to real-time grinder clicks and active grinder across devices
 */
export function subscribeToCloudSettings(
  onUpdate: (clicks: Record<GrinderId, number>, activeGrinderId: GrinderId) => void
) {
  const docRef = doc(db, 'settings', 'current');
  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        const clicks: Record<GrinderId, number> = {
          'mischief-m40': typeof data.mischiefClicks === 'number' ? data.mischiefClicks : 24,
          'lenodi': typeof data.lenodiClicks === 'number' ? data.lenodiClicks : 40,
        };
        const active = (data.activeGrinderId === 'lenodi' ? 'lenodi' : 'mischief-m40') as GrinderId;
        onUpdate(clicks, active);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, SETTINGS_DOC_PATH);
    }
  );
}

/**
 * Push click changes to the cloud
 */
export async function pushCloudSettings(
  clicks: Record<GrinderId, number>,
  activeGrinderId: GrinderId
): Promise<void> {
  const docRef = doc(db, 'settings', 'current');
  try {
    await setDoc(docRef, {
      mischiefClicks: clicks['mischief-m40'] ?? 24,
      lenodiClicks: clicks['lenodi'] ?? 40,
      activeGrinderId,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, SETTINGS_DOC_PATH);
  }
}

/**
 * Subscribe to real-time brew logs from cloud
 */
export function subscribeToCloudLogs(onUpdate: (logs: BrewLog[]) => void) {
  const colRef = collection(db, BREW_LOGS_COLLECTION);
  return onSnapshot(
    colRef,
    (snapshot) => {
      const logs: BrewLog[] = [];
      snapshot.forEach((d) => {
        const data = d.data() as BrewLog;
        logs.push({ ...data, id: d.id });
      });
      // Sort newest first
      logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      if (logs.length > 0) {
        onUpdate(logs);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, BREW_LOGS_COLLECTION);
    }
  );
}

/**
 * Save or update single brew log to cloud
 */
export async function saveCloudBrewLog(log: BrewLog): Promise<void> {
  const path = `${BREW_LOGS_COLLECTION}/${log.id}`;
  try {
    await setDoc(doc(db, BREW_LOGS_COLLECTION, log.id), {
      ...log,
      updatedAt: new Date().toISOString(),
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Delete a brew log from cloud
 */
export async function deleteCloudBrewLog(logId: string): Promise<void> {
  const path = `${BREW_LOGS_COLLECTION}/${logId}`;
  try {
    await deleteDoc(doc(db, BREW_LOGS_COLLECTION, logId));
  } catch (err) {
    handleFirestoreError(err, OperationType.DELETE, path);
  }
}
