import React, { useState, useEffect } from 'react';
import {
  DialInteractive,
} from './components/DialInteractive';
import { GrinderComparison } from './components/GrinderComparison';
import { BrewLogCard } from './components/BrewLogCard';
import { BrewLogForm } from './components/BrewLogForm';
import { BrewTimer } from './components/BrewTimer';
import { GrindChartGuide } from './components/GrindChartGuide';
import { Header } from './components/Header';
import { BrewLog, BrewMethod, GrinderId } from './types/coffee';
import {
  loadStoredLogs,
  saveStoredLogs,
  loadStoredActiveGrinder,
  saveStoredActiveGrinder,
  loadStoredClicks,
  saveStoredClicks,
  loadSoundSetting,
  saveSoundSetting,
  exportLogsToJson,
} from './utils/storage';
import { clickAudio } from './utils/audio';
import {
  Sliders,
  ArrowLeftRight,
  BookMarked,
  Timer,
  FileText,
  Search,
  Download,
  Upload,
  Plus,
  Coffee,
  RotateCcw,
} from 'lucide-react';
import { INITIAL_LOGS } from './data/initialLogs';

import {
  testFirestoreConnection,
} from './firebase/config';
import {
  subscribeToCloudSettings,
  pushCloudSettings,
  subscribeToCloudLogs,
  saveCloudBrewLog,
  deleteCloudBrewLog,
} from './firebase/syncService';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dial' | 'compare' | 'logs' | 'timer' | 'guide'>('dial');
  const [activeGrinderId, setActiveGrinderId] = useState<GrinderId>(() => loadStoredActiveGrinder());
  // Store independent click setting for each grinder
  const [clicksByGrinder, setClicksByGrinder] = useState<Record<GrinderId, number>>(() => loadStoredClicks());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => loadSoundSetting());
  const [logs, setLogs] = useState<BrewLog[]>(() => loadStoredLogs());
  const [isCloudSynced, setIsCloudSynced] = useState<boolean>(false);

  // Filter & Search states for Logs tab
  const [logFilterGrinder, setLogFilterGrinder] = useState<'all' | GrinderId>('all');
  const [logFilterMethod, setLogFilterMethod] = useState<'all' | BrewMethod>('all');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);

  // Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [editingLog, setEditingLog] = useState<BrewLog | null>(null);
  const [prefilledTimeSeconds, setPrefilledTimeSeconds] = useState<number | undefined>(undefined);

  // Sync sound preference
  useEffect(() => {
    clickAudio.enabled = soundEnabled;
    saveSoundSetting(soundEnabled);
  }, [soundEnabled]);

  // Firebase Real-time Synchronization across mobile and desktop
  useEffect(() => {
    testFirestoreConnection();

    // Listen to real-time grinder clicks changes from other devices
    const unsubSettings = subscribeToCloudSettings((cloudClicks, cloudActive) => {
      setClicksByGrinder(cloudClicks);
      saveStoredClicks(cloudClicks);
      setActiveGrinderId(cloudActive);
      saveStoredActiveGrinder(cloudActive);
      setIsCloudSynced(true);
    });

    // Listen to real-time brew log updates from cloud
    const unsubLogs = subscribeToCloudLogs((cloudLogs) => {
      setLogs(cloudLogs);
      saveStoredLogs(cloudLogs);
      setIsCloudSynced(true);
    });

    return () => {
      unsubSettings();
      unsubLogs();
    };
  }, []);

  // Update clicks for a specific grinder independently & push to cloud
  const handleClicksChange = (grinderId: GrinderId, newClicks: number) => {
    setClicksByGrinder((prev) => {
      const updated = { ...prev, [grinderId]: newClicks };
      saveStoredClicks(updated);
      pushCloudSettings(updated, activeGrinderId).catch(() => {});
      return updated;
    });
  };

  // Sync active grinder without modifying either grinder's clicks
  const handleSelectGrinder = (id: GrinderId) => {
    setActiveGrinderId(id);
    saveStoredActiveGrinder(id);
    pushCloudSettings(clicksByGrinder, id).catch(() => {});
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => !prev);
  };

  // Open Log Modal with specific clicks
  const handleQuickLog = (grinderId: GrinderId, clicks: number) => {
    setActiveGrinderId(grinderId);
    handleClicksChange(grinderId, clicks);
    setEditingLog(null);
    setPrefilledTimeSeconds(undefined);
    setIsLogModalOpen(true);
  };

  // Open Log Modal from Timer
  const handleLogFromTimer = (seconds: number) => {
    setEditingLog(null);
    setPrefilledTimeSeconds(seconds);
    setIsLogModalOpen(true);
  };

  // Save new or updated log
  const handleSaveLog = (logData: Omit<BrewLog, 'id' | 'createdAt'>, existingId?: string) => {
    if (existingId) {
      const existing = logs.find((l) => l.id === existingId);
      const updatedItem: BrewLog = {
        ...logData,
        id: existingId,
        createdAt: existing?.createdAt || new Date().toISOString(),
      };
      const updated = logs.map((l) => (l.id === existingId ? updatedItem : l));
      setLogs(updated);
      saveStoredLogs(updated);
      saveCloudBrewLog(updatedItem).catch(() => {});
    } else {
      const newEntry: BrewLog = {
        ...logData,
        id: `log-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      const updated = [newEntry, ...logs];
      setLogs(updated);
      saveStoredLogs(updated);
      saveCloudBrewLog(newEntry).catch(() => {});
    }
    setIsLogModalOpen(false);
    setEditingLog(null);
    setPrefilledTimeSeconds(undefined);
    setActiveTab('logs');
  };

  // Delete Log
  const handleDeleteLog = (id: string) => {
    if (window.confirm('คุณต้องการลบบันทึกสูตรนี้ใช่หรือไม่?')) {
      const updated = logs.filter((l) => l.id !== id);
      setLogs(updated);
      saveStoredLogs(updated);
      deleteCloudBrewLog(id).catch(() => {});
    }
  };

  // Toggle Favorite
  const handleToggleFavorite = (id: string) => {
    const target = logs.find((l) => l.id === id);
    if (target) {
      const updatedItem = { ...target, isFavorite: !target.isFavorite };
      const updated = logs.map((l) => (l.id === id ? updatedItem : l));
      setLogs(updated);
      saveStoredLogs(updated);
      saveCloudBrewLog(updatedItem).catch(() => {});
    }
  };

  // Clone recipe to test +/- 1 click
  const handleCloneLog = (sourceLog: BrewLog) => {
    setEditingLog({
      ...sourceLog,
      id: '', // trigger new
      beanName: `${sourceLog.beanName} (ปรับคลิก)`,
      tasteNotes: `อ้างอิงจากคลิกเดิมที่ ${sourceLog.clicks} คลิก: `,
    });
    setPrefilledTimeSeconds(sourceLog.brewTimeSeconds);
    setIsLogModalOpen(true);
  };

  // Reset to initial sample data
  const handleResetSampleLogs = () => {
    if (window.confirm('ต้องการรีเซ็ตข้อมูลตัวอย่างกลับเป็นค่าเริ่มต้นหรือไม่?')) {
      setLogs(INITIAL_LOGS);
      saveStoredLogs(INITIAL_LOGS);
    }
  };

  // Import JSON backup from another device
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);
        if (parsed && typeof parsed === 'object') {
          // If full payload
          if (Array.isArray(parsed.logs)) {
            setLogs(parsed.logs);
            saveStoredLogs(parsed.logs);
            if (parsed.clicks) {
              setClicksByGrinder(parsed.clicks);
              saveStoredClicks(parsed.clicks);
            }
            if (parsed.activeGrinderId) {
              setActiveGrinderId(parsed.activeGrinderId);
              saveStoredActiveGrinder(parsed.activeGrinderId);
            }
            alert('นำเข้าข้อมูลสำเร็จแล้ว! (ซิงค์สูตรชงและค่าคลิกของเครื่องบดเรียบร้อย)');
            return;
          }
          // If legacy raw array of logs
          if (Array.isArray(parsed)) {
            setLogs(parsed);
            saveStoredLogs(parsed);
            alert('นำเข้าสมุดบันทึกสำเร็จแล้ว!');
            return;
          }
        }
        alert('รูปแบบไฟล์ไม่ถูกต้อง');
      } catch {
        alert('เกิดข้อผิดพลาดในการอ่านไฟล์ JSON');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // Filtered Logs
  const filteredLogs = logs.filter((log) => {
    if (favoritesOnly && !log.isFavorite) return false;
    if (logFilterGrinder !== 'all' && log.grinderId !== logFilterGrinder) return false;
    if (logFilterMethod !== 'all' && log.method !== logFilterMethod) return false;
    if (logSearchQuery.trim()) {
      const q = logSearchQuery.toLowerCase();
      const matchBean = log.beanName.toLowerCase().includes(q);
      const matchOrigin = log.origin.toLowerCase().includes(q);
      const matchNotes = (log.tasteNotes || '').toLowerCase().includes(q);
      const matchFlavors = log.flavorNotes.some((f) => f.toLowerCase().includes(q));
      if (!matchBean && !matchOrigin && !matchNotes && !matchFlavors) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-24 md:pb-16 flex flex-col font-sans">
      {/* 3-Zone Desktop Top Bar */}
      <Header
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenNewLog={() => {
          setEditingLog(null);
          setPrefilledTimeSeconds(undefined);
          setIsLogModalOpen(true);
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {/* Tab 1: Interactive Dial */}
        {activeTab === 'dial' && (
          <DialInteractive
            activeGrinderId={activeGrinderId}
            onSelectGrinder={handleSelectGrinder}
            clicksByGrinder={clicksByGrinder}
            onClicksChange={handleClicksChange}
            soundEnabled={soundEnabled}
            onToggleSound={handleToggleSound}
            onQuickLog={handleQuickLog}
            onNavigateToCompare={() => setActiveTab('compare')}
            isCloudSynced={isCloudSynced}
          />
        )}

        {/* Tab 2: Grinder Comparison & Conversion */}
        {activeTab === 'compare' && (
          <GrinderComparison
            onApplyClickToDial={(grinderId, clicks) => {
              handleSelectGrinder(grinderId);
              handleClicksChange(grinderId, clicks);
              setActiveTab('dial');
            }}
          />
        )}

        {/* Tab 3: Brew Logs Journal */}
        {activeTab === 'logs' && (
          <div className="space-y-6">
            {/* Header Toolbar */}
            <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                  สมุดบันทึกสูตรและระดับการบด (Brew Journal)
                </h2>
                <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                  <span>ทั้งหมด {logs.length} รายการ</span>
                  <span aria-hidden="true">·</span>
                  <span>Mischief M40: {logs.filter((l) => l.grinderId === 'mischief-m40').length}</span>
                  <span aria-hidden="true">·</span>
                  <span>LEnodi: {logs.filter((l) => l.grinderId === 'lenodi').length}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center flex-wrap gap-2">
                <button
                  onClick={() => exportLogsToJson(logs)}
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                  title="ดาวน์โหลดไฟล์สำรองข้อมูล JSON ไปยังเครื่องอื่น"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ส่งออก JSON</span>
                </button>

                <label
                  className="px-3 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                  title="นำเข้าไฟล์สำรอง JSON จากเครื่องอื่น"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>นำเข้า JSON</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJson}
                    className="hidden"
                  />
                </label>

                <button
                  onClick={handleResetSampleLogs}
                  className="px-3 py-2 border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors"
                  title="รีเซ็ตเป็นข้อมูลตัวอย่างเริ่มต้น"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>รีเซ็ตตัวอย่าง</span>
                </button>
                <button
                  onClick={() => {
                    setEditingLog(null);
                    setPrefilledTimeSeconds(undefined);
                    setIsLogModalOpen(true);
                  }}
                  className="px-4 py-2 bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  <Plus className="w-4 h-4" />
                  <span>เพิ่มบันทึกใหม่</span>
                </button>
              </div>
            </div>

            {/* Filter Controls Row */}
            <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="ค้นหาชื่อเมล็ดกาแฟ, แหล่งปลูก, โน้ตรสชาติ..."
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-amber-800 focus:bg-white transition-colors"
                />
              </div>

              {/* Segmented Filter Buttons */}
              <div className="flex items-center gap-1.5 flex-wrap">
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl">
                  <button
                    onClick={() => setLogFilterGrinder('all')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      logFilterGrinder === 'all'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    ทุกเครื่องบด
                  </button>
                  <button
                    onClick={() => setLogFilterGrinder('mischief-m40')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      logFilterGrinder === 'mischief-m40'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    M40
                  </button>
                  <button
                    onClick={() => setLogFilterGrinder('lenodi')}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                      logFilterGrinder === 'lenodi'
                        ? 'bg-white text-stone-900 shadow-2xs'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    LEnodi
                  </button>
                </div>

                {/* Method Dropdown */}
                <select
                  value={logFilterMethod}
                  onChange={(e) => setLogFilterMethod(e.target.value as 'all' | BrewMethod)}
                  className="text-xs py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl text-stone-700 font-medium focus:outline-none"
                >
                  <option value="all">ทุกวิธีชง</option>
                  <option value="v60">V60 Pour Over</option>
                  <option value="espresso">Espresso</option>
                  <option value="aeropress">AeroPress</option>
                  <option value="moka">Moka Pot</option>
                  <option value="origami">Origami / Kalita</option>
                  <option value="french-press">French Press</option>
                  <option value="cold-brew">Cold Brew</option>
                </select>

                {/* Favorites Toggle */}
                <button
                  onClick={() => setFavoritesOnly(!favoritesOnly)}
                  className={`text-xs px-3 py-2 rounded-xl border font-semibold transition-colors ${
                    favoritesOnly
                      ? 'bg-rose-50 border-rose-200 text-rose-700'
                      : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  ★ สูตรโปรด
                </button>
              </div>
            </div>

            {/* Logs List or Empty State */}
            {filteredLogs.length === 0 ? (
              <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-xs">
                <Coffee className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-stone-800">ไม่พบบันทึกการชงที่ตรงกับเงื่อนไข</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
                  ลองล้างตัวกรองการค้นหา หรือกดปุ่มบันทึกชงใหม่เพื่อเริ่มจดสถิติของ Mischief M40 และ LEnodi
                </p>
                <button
                  onClick={() => {
                    setLogFilterGrinder('all');
                    setLogFilterMethod('all');
                    setLogSearchQuery('');
                    setFavoritesOnly(false);
                  }}
                  className="mt-4 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition-colors"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredLogs.map((log) => (
                  <BrewLogCard
                    key={log.id}
                    log={log}
                    onClone={handleCloneLog}
                    onDelete={handleDeleteLog}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 4: Brew Timer & Stopwatch */}
        {activeTab === 'timer' && (
          <BrewTimer
            onLogWithTime={(seconds) => {
              handleLogFromTimer(seconds);
            }}
          />
        )}

        {/* Tab 5: Grind Chart Reference Guide */}
        {activeTab === 'guide' && <GrindChartGuide />}
      </main>

      {/* Floating Modal for Brew Log */}
      {isLogModalOpen && (
        <BrewLogForm
          initialGrinderId={activeGrinderId}
          initialClicks={clicksByGrinder[activeGrinderId] ?? 24}
          initialBrewTimeSeconds={prefilledTimeSeconds}
          editingLog={editingLog}
          onSave={handleSaveLog}
          onClose={() => {
            setIsLogModalOpen(false);
            setEditingLog(null);
            setPrefilledTimeSeconds(undefined);
          }}
        />
      )}

      {/* Mobile Fixed Bottom Navigation Bar (<15% viewport height cap) */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-stone-200 grid grid-cols-5 items-center h-16 pb-safe">
        <button
          onClick={() => setActiveTab('dial')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'dial' ? 'text-amber-800 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Sliders className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">หมุนคลิก</span>
        </button>

        <button
          onClick={() => setActiveTab('compare')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'compare' ? 'text-amber-800 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <ArrowLeftRight className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">เทียบ 2 ตัว</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'logs' ? 'text-amber-800 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <BookMarked className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">สมุดชง</span>
        </button>

        <button
          onClick={() => setActiveTab('timer')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'timer' ? 'text-amber-800 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Timer className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">จับเวลา</span>
        </button>

        <button
          onClick={() => setActiveTab('guide')}
          className={`flex flex-col items-center justify-center h-full transition-colors ${
            activeTab === 'guide' ? 'text-amber-800 font-bold' : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <FileText className="w-5 h-5" />
          <span className="text-[10px] tracking-tight mt-1">คู่มือ</span>
        </button>
      </nav>
    </div>
  );
}
