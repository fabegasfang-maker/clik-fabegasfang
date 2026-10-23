import React, { useMemo } from 'react';
import { Volume2, VolumeX, RotateCcw, ArrowRight, Sparkles, Sliders, Cloud } from 'lucide-react';
import { GrinderId, GrinderProfile } from '../types/coffee';
import { GRINDER_PROFILES } from '../data/grinderProfiles';
import { clickAudio } from '../utils/audio';

interface DialInteractiveProps {
  activeGrinderId: GrinderId;
  onSelectGrinder: (id: GrinderId) => void;
  clicksByGrinder: Record<GrinderId, number>;
  onClicksChange: (grinderId: GrinderId, clicks: number) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onQuickLog: (grinderId: GrinderId, clicks: number) => void;
  onNavigateToCompare: () => void;
  isCloudSynced?: boolean;
}

export const DialInteractive: React.FC<DialInteractiveProps> = ({
  activeGrinderId,
  onSelectGrinder,
  clicksByGrinder,
  onClicksChange,
  soundEnabled,
  onToggleSound,
  onQuickLog,
  onNavigateToCompare,
  isCloudSynced = false,
}) => {
  const profile: GrinderProfile = GRINDER_PROFILES[activeGrinderId];
  const otherId: GrinderId = activeGrinderId === 'mischief-m40' ? 'lenodi' : 'mischief-m40';
  const otherProfile = GRINDER_PROFILES[otherId];

  const currentClicks = clicksByGrinder[activeGrinderId] ?? (activeGrinderId === 'mischief-m40' ? 24 : 40);
  const otherClicks = clicksByGrinder[otherId] ?? (otherId === 'mischief-m40' ? 24 : 40);

  // Calculated microns for active grinder
  const estimatedMicrons = useMemo(() => {
    return Math.round(currentClicks * profile.clickPitchMicrons);
  }, [currentClicks, profile.clickPitchMicrons]);

  // Turn calculation:
  // For M40, 40 clicks = 1 full rotation.
  // For LEnodi, ~40-48 clicks per turn depending on scale, let's show turns & decimal
  const turnsCount = useMemo(() => {
    const clicksPerTurn = activeGrinderId === 'mischief-m40' ? 40 : 40;
    const full = Math.floor(currentClicks / clicksPerTurn);
    const rem = currentClicks % clicksPerTurn;
    return { full, rem, decimal: (currentClicks / clicksPerTurn).toFixed(2) };
  }, [currentClicks, activeGrinderId]);

  // Active Method Zone
  const activeRange = useMemo(() => {
    return profile.ranges.find((r) => currentClicks >= r.minClicks && currentClicks <= r.maxClicks);
  }, [currentClicks, profile.ranges]);

  const updateClicks = (newVal: number) => {
    const clamped = Math.max(0, Math.min(profile.maxClicks, newVal));
    if (clamped !== currentClicks) {
      if (soundEnabled) {
        clickAudio.playClick(0.9 + (clamped / profile.maxClicks) * 0.3);
      }
      onClicksChange(activeGrinderId, clamped);
    }
  };

  // Dial rotation angle
  const rotationAngle = (currentClicks / profile.maxClicks) * 280 - 140;

  return (
    <div className="space-y-4">
      {/* Grinder Selector Bar (Compact with independent clicks indicator) */}
      <div className="bg-white border border-stone-200 rounded-xl px-2.5 py-1.5 shadow-2xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-1 p-0.5 bg-stone-100 rounded-lg">
          <button
            onClick={() => {
              onSelectGrinder('mischief-m40');
              if (soundEnabled) clickAudio.playClick(1.0);
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeGrinderId === 'mischief-m40'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>Mischief M40</span>
            <span className="font-mono text-[11px] px-1 rounded bg-stone-200/70 text-stone-700">
              {clicksByGrinder['mischief-m40']}
            </span>
          </button>
          <button
            onClick={() => {
              onSelectGrinder('lenodi');
              if (soundEnabled) clickAudio.playClick(1.1);
            }}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
              activeGrinderId === 'lenodi'
                ? 'bg-white text-stone-900 shadow-2xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <span>LEnodi</span>
            <span className="font-mono text-[11px] px-1 rounded bg-stone-200/70 text-stone-700">
              {clicksByGrinder['lenodi']}
            </span>
          </button>
        </div>

        {/* Audio Mute, Zero Reset & Cloud Sync Status (Compact) */}
        <div className="flex items-center gap-1.5">
          <div
            className={`px-2 py-1 rounded-md border text-[11px] font-medium flex items-center gap-1 transition-colors ${
              isCloudSynced
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-stone-50 text-stone-500 border-stone-200'
            }`}
            title="เชื่อมต่อระบบคลาวด์ Firebase เรียบร้อย ข้อมูลซิงค์อัตโนมัติข้ามมือถือและคอมพิวเตอร์"
          >
            <Cloud className={`w-3.5 h-3.5 ${isCloudSynced ? 'text-emerald-600' : 'text-stone-400'}`} />
            <span className="hidden sm:inline">คลาวด์ซิงค์</span>
          </div>
          <button
            onClick={onToggleSound}
            aria-label="Toggle click sound"
            className={`px-2 py-1 rounded-md border text-[11px] font-medium flex items-center gap-1 transition-colors ${
              soundEnabled
                ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                : 'bg-stone-50 text-stone-500 border-stone-200 hover:bg-stone-100'
            }`}
            title={soundEnabled ? 'ปิดเสียงคลิก' : 'เปิดเสียงคลิกสมจริง'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-amber-700" /> : <VolumeX className="w-3.5 h-3.5 text-stone-400" />}
            <span className="hidden sm:inline">{soundEnabled ? 'เสียงเปิด' : 'เสียงปิด'}</span>
          </button>
          <button
            onClick={() => updateClicks(0)}
            className="px-2 py-1 rounded-md border border-stone-200 text-stone-600 hover:text-stone-900 hover:bg-stone-100 text-[11px] font-medium flex items-center gap-1 transition-colors"
            title="รีเซ็ตกลับไปที่จุด 0 (Zero Point)"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="hidden sm:inline">จุด 0</span>
          </button>
        </div>
      </div>

      {/* Main 2-Column Barista Dial Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left Column: Interactive Rotary Dial & Stepper */}
        <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 flex flex-col justify-between shadow-xs">
          {/* Machine Header */}
          <div className="flex items-center justify-between gap-4 border-b border-stone-100 pb-2.5">
            <div>
              <div className="flex items-baseline gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-stone-900">{profile.name}</h2>
                <span className="text-xs text-stone-500">{profile.burrSize} · ~{profile.clickPitchMicrons} µm/คลิก</span>
              </div>
            </div>
            {/* Direct Switch/View of other grinder's independent setting */}
            <button
              type="button"
              onClick={() => onSelectGrinder(otherId)}
              className="text-right flex items-center gap-1.5 px-2 py-1 rounded-lg hover:bg-stone-100 transition-colors cursor-pointer group"
              title={`คลิกเพื่อสลับไปปรับ ${otherProfile.name}`}
            >
              <span className="text-[11px] text-stone-400 group-hover:text-stone-600">
                {otherProfile.name}:
              </span>
              <span className="text-xs font-mono font-semibold text-stone-700 bg-stone-100 group-hover:bg-amber-100 group-hover:text-amber-900 px-2 py-0.5 rounded border border-stone-200">
                {otherClicks} คลิก
              </span>
            </button>
          </div>

          {/* Central Interactive Click Gauge & Readout (Compact & Ergonomic with + / - on the Dial) */}
          <div className="my-3 flex flex-col items-center justify-center">
            {/* Visual Dial Ring with Integrated - and + Buttons */}
            <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
              {/* Outer Subtle Ring */}
              <div className="absolute inset-0 rounded-full border border-stone-200 bg-stone-50/60" />

              {/* Ticks SVG Ring */}
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#e7e5e4"
                  strokeWidth="3.5"
                />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  fill="none"
                  stroke="#92400e"
                  strokeWidth="3.5"
                  strokeDasharray="276"
                  strokeDashoffset={276 - (276 * (currentClicks / profile.maxClicks))}
                  strokeLinecap="round"
                  className="transition-all duration-150"
                />
              </svg>

              {/* Rotary Needle Indicator */}
              <div
                className="absolute w-full h-full flex items-center justify-center pointer-events-none transition-transform duration-200 ease-out"
                style={{ transform: `rotate(${rotationAngle}deg)` }}
              >
                <div className="w-1.5 h-4 bg-amber-800 rounded-full -translate-y-[86px] shadow-xs" />
              </div>

              {/* Center Content Row: Minus Button + Big Number + Plus Button */}
              <div className="relative z-10 flex items-center justify-center gap-2 sm:gap-3 w-full px-3">
                {/* Minus Button directly on the circle */}
                <button
                  type="button"
                  onClick={() => updateClicks(currentClicks - 1)}
                  disabled={currentClicks <= 0}
                  aria-label="ลด 1 คลิก"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-stone-100 hover:bg-stone-200 disabled:opacity-30 active:scale-90 text-stone-800 text-xl font-bold flex items-center justify-center transition-all shadow-2xs border border-stone-300 shrink-0 select-none cursor-pointer"
                >
                  −
                </button>

                {/* Center Number and Info */}
                <div className="flex flex-col items-center text-center min-w-[70px]">
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-stone-400">
                    Clicks
                  </span>
                  <span className="text-4xl sm:text-5xl font-bold font-mono tracking-tight text-stone-900 tabular-nums leading-none my-0.5">
                    {currentClicks}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-stone-500 font-mono">
                    <span>~{estimatedMicrons}µm</span>
                    <span>·</span>
                    <span>{turnsCount.decimal}รอบ</span>
                  </div>
                </div>

                {/* Plus Button directly on the circle */}
                <button
                  type="button"
                  onClick={() => updateClicks(currentClicks + 1)}
                  disabled={currentClicks >= profile.maxClicks}
                  aria-label="เพิ่ม 1 คลิก"
                  className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-amber-900 hover:bg-amber-800 disabled:opacity-30 active:scale-90 text-white text-xl font-bold flex items-center justify-center transition-all shadow-xs shrink-0 select-none cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            {/* Active Extraction Method Indicator (Short & Clean) */}
            <div className="mt-2.5 px-3 py-1 bg-stone-100 rounded-lg text-center flex items-center gap-1.5 text-xs">
              <span className="text-stone-500 text-[11px]">วิธีชงที่ตรงช่วง:</span>
              <span className="font-semibold text-stone-900 text-xs">
                {activeRange ? `${activeRange.nameTh} (${activeRange.nameEn})` : 'ปรับแต่งเฉพาะตัว'}
              </span>
            </div>
          </div>

          {/* Stepper Controls (Sleek and Compact) */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            {/* Linear Fine Slider */}
            <div>
              <div className="flex justify-between text-[11px] text-stone-400 mb-0.5 font-mono">
                <span>0 (ละเอียด)</span>
                <span>{profile.maxClicks} (หยาบ)</span>
              </div>
              <input
                type="range"
                min={0}
                max={profile.maxClicks}
                value={currentClicks}
                onChange={(e) => updateClicks(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-800 hover:accent-amber-900 transition-all"
              />
            </div>

            {/* Quick ±5 Step Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => updateClicks(currentClicks - 5)}
                disabled={currentClicks <= 0}
                className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 font-mono text-xs font-semibold rounded-lg transition-colors"
              >
                -5 คลิก
              </button>
              <button
                onClick={() => updateClicks(currentClicks + 5)}
                disabled={currentClicks >= profile.maxClicks}
                className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 disabled:opacity-40 text-stone-700 font-mono text-xs font-semibold rounded-lg transition-colors"
              >
                +5 คลิก
              </button>
            </div>

            {/* Quick Action to log this grind */}
            <button
              onClick={() => onQuickLog(activeGrinderId, currentClicks)}
              className="w-full py-2.5 px-4 bg-amber-900 hover:bg-amber-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <span>ใช้เบอร์บด {currentClicks} คลิกนี้ บันทึกสูตรชง</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Right Column: Machine Info, Real Photo & Quick Presets */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Photo & Grinder Specs Card */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
            <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
              <img
                src={profile.image}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-102"
              />
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent p-4 text-white">
                <span className="text-xs font-semibold tracking-wider text-amber-200 uppercase">{profile.brand}</span>
                <h3 className="text-lg font-bold">{profile.name}</h3>
                <p className="text-xs text-stone-200">{profile.burrSize} · {profile.adjustmentType}</p>
              </div>
            </div>
            <div className="p-4 space-y-2 text-xs text-stone-600">
              <p className="leading-relaxed">{profile.descriptionTh}</p>
              <ul className="space-y-1 pt-1 border-t border-stone-100">
                {profile.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-1.5 text-stone-700">
                    <span className="text-amber-700 font-bold">·</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Quick Method Sweet Spot Presets */}
          <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-xs flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-sm font-bold text-stone-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-700" />
                  <span>คลิกยอดนิยมที่แนะนำ (Sweet Spots)</span>
                </h4>
                <button
                  onClick={onNavigateToCompare}
                  className="text-xs text-amber-800 hover:underline flex items-center gap-1 font-medium"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>ดูตารางเทียบ</span>
                </button>
              </div>
              <p className="text-xs text-stone-500 mb-3">
                แตะเพื่อหมุนคลิกไปยังเบอร์บดมาตรฐานของ {profile.name}
              </p>

              <div className="space-y-2">
                {profile.ranges.map((r) => {
                  const isCurrent = currentClicks >= r.minClicks && currentClicks <= r.maxClicks;
                  return (
                    <button
                      key={r.method}
                      onClick={() => updateClicks(r.recommended)}
                      className={`w-full p-2.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isCurrent
                          ? 'border-amber-300 bg-amber-50/70 text-stone-900'
                          : 'border-stone-200 hover:border-stone-300 bg-stone-50/50 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold text-stone-900 flex items-center gap-2">
                          <span>{r.nameTh}</span>
                          <span className="text-stone-500 font-normal">({r.nameEn})</span>
                        </div>
                        <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                          ช่วง {r.minClicks}–{r.maxClicks} คลิก · {r.microns}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="inline-block text-xs font-mono font-bold px-2 py-0.5 bg-white rounded border border-stone-200 text-amber-900 shadow-2xs">
                          {r.recommended} คลิก
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
