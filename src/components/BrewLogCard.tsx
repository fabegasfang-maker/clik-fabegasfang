import React from 'react';
import { Star, Copy, Trash2, Heart, Clock, Scale, Thermometer } from 'lucide-react';
import { BrewLog } from '../types/coffee';
import { GRINDER_PROFILES } from '../data/grinderProfiles';

interface BrewLogCardProps {
  log: BrewLog;
  onClone: (log: BrewLog) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const BrewLogCard: React.FC<BrewLogCardProps> = ({
  log,
  onClone,
  onDelete,
  onToggleFavorite,
}) => {
  const profile = GRINDER_PROFILES[log.grinderId];
  const formattedDate = new Date(log.createdAt).toLocaleDateString('th-TH', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  const formatBrewTime = (seconds?: number) => {
    if (!seconds) return null;
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const roastLabels: Record<string, string> = {
    'light': 'คั่วอ่อน (Light)',
    'medium-light': 'คั่วอ่อน-กลาง (Med-Light)',
    'medium': 'คั่วกลาง (Medium)',
    'medium-dark': 'คั่วกลาง-เข้ม (Med-Dark)',
    'dark': 'คั่วเข้ม (Dark)',
  };

  const methodLabels: Record<string, string> = {
    'v60': 'V60 Pour Over',
    'espresso': 'Espresso',
    'moka': 'Moka Pot',
    'aeropress': 'AeroPress',
    'origami': 'Origami / Kalita',
    'kalita': 'Kalita Wave',
    'french-press': 'French Press',
    'cold-brew': 'Cold Brew',
  };

  const verdictLabels: Record<string, { label: string; textClass: string }> = {
    balanced: {
      label: 'Sweet Spot (ลงตัวมาก)',
      textClass: 'text-emerald-700',
    },
    under: {
      label: 'Under-extracted (เปรี้ยวโดด - แนะนำบดละเอียดขึ้น)',
      textClass: 'text-amber-700',
    },
    over: {
      label: 'Over-extracted (ขมฝาด - แนะนำบดหยาบขึ้น)',
      textClass: 'text-rose-700',
    },
  };

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 transition-all hover:border-stone-300 shadow-xs flex flex-col justify-between">
      <div>
        {/* Top Unboxed Metadata & Action Buttons */}
        <div className="flex items-center justify-between text-xs text-stone-500 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-amber-900">{profile.name}</span>
            <span aria-hidden="true">·</span>
            <span>{methodLabels[log.method] || log.method}</span>
            <span aria-hidden="true">·</span>
            <span>{formattedDate}</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleFavorite(log.id)}
              className={`p-1.5 rounded-lg transition-colors ${
                log.isFavorite
                  ? 'text-rose-600 hover:bg-rose-50'
                  : 'text-stone-400 hover:text-stone-600 hover:bg-stone-100'
              }`}
              title={log.isFavorite ? 'ยกเลิกติดดาว' : 'ติดดาวสูตรโปรด'}
            >
              <Heart className={`w-4 h-4 ${log.isFavorite ? 'fill-rose-500' : ''}`} />
            </button>
            <button
              onClick={() => onClone(log)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title="คัดลอกสูตรเพื่อปรับคลิกต่อ (+/- 1 Clicks)"
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(log.id)}
              className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-stone-100 transition-colors"
              title="ลบบันทึก"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Primary Click Highlight & Coffee Title */}
        <div className="flex items-start justify-between gap-4 mt-4">
          <div>
            <h3 className="text-lg font-bold text-stone-900 leading-snug">
              {log.beanName}
            </h3>
            <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
              <span>{log.origin}</span>
              {log.process && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>{log.process}</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>{roastLabels[log.roastLevel] || log.roastLevel}</span>
            </div>
          </div>

          {/* Click Dial Badge */}
          <div className="shrink-0 text-right bg-stone-50 border border-stone-200 rounded-xl px-3 py-1.5">
            <div className="text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
              ระดับการบด
            </div>
            <div className="text-xl sm:text-2xl font-bold font-mono text-stone-900 tabular-nums">
              {log.clicks} <span className="text-xs font-normal text-stone-500">คลิก</span>
            </div>
          </div>
        </div>

        {/* Extraction Recipe Metrics Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 py-3 bg-stone-50/70 border border-stone-100 rounded-xl px-3">
          <div className="flex items-center gap-2 text-xs">
            <Scale className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <div>
              <span className="text-stone-400 block text-[10px]">ปริมาณผง / น้ำ</span>
              <span className="font-mono font-semibold text-stone-800">
                {log.doseGrams}g : {log.waterGrams}g {log.ratio ? `(${log.ratio})` : ''}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <div>
              <span className="text-stone-400 block text-[10px]">เวลาสกัด</span>
              <span className="font-mono font-semibold text-stone-800">
                {formatBrewTime(log.brewTimeSeconds) || '-'} นาที
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <Thermometer className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            <div>
              <span className="text-stone-400 block text-[10px]">อุณหภูมิน้ำ</span>
              <span className="font-mono font-semibold text-stone-800">
                {log.waterTempC ? `${log.waterTempC}°C` : '-'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <div className="w-full">
              <span className="text-stone-400 block text-[10px]">คะแนนรสชาติ</span>
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-3.5 h-3.5 ${
                      star <= log.rating
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-stone-200'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sensory Notes */}
        {log.tasteNotes && (
          <p className="text-xs text-stone-700 italic leading-relaxed my-2 bg-stone-50/50 p-2.5 rounded-lg border border-stone-100">
            "{log.tasteNotes}"
          </p>
        )}

        {/* Flavor Notes Text List (No Pill badges, clean unboxed typographic separators) */}
        {log.flavorNotes && log.flavorNotes.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 text-xs text-stone-600 mt-2">
            <span className="text-[11px] text-stone-400 font-medium">โน้ตรสชาติ:</span>
            {log.flavorNotes.map((flavor, index) => (
              <React.Fragment key={flavor}>
                <span className="font-medium text-stone-800">{flavor}</span>
                {index < log.flavorNotes.length - 1 && (
                  <span className="text-stone-300" aria-hidden="true">·</span>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      {/* Extraction Verdict Footer */}
      <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
        <div className={`font-semibold flex items-center gap-1.5 ${verdictLabels[log.extractionVerdict]?.textClass || 'text-stone-600'}`}>
          <span className="w-2 h-2 rounded-full bg-current" />
          <span>{verdictLabels[log.extractionVerdict]?.label || log.extractionVerdict}</span>
        </div>
        {log.dripper && (
          <span className="text-stone-400 text-[11px] truncate max-w-[140px]">
            {log.dripper}
          </span>
        )}
      </div>
    </div>
  );
};
