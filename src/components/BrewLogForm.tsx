import React, { useState } from 'react';
import { X, Check, Star, Plus } from 'lucide-react';
import { BrewLog, BrewMethod, ExtractionVerdict, GrinderId, RoastLevel } from '../types/coffee';
import { GRINDER_PROFILES } from '../data/grinderProfiles';

interface BrewLogFormProps {
  initialGrinderId: GrinderId;
  initialClicks: number;
  initialBrewTimeSeconds?: number;
  editingLog?: BrewLog | null;
  onSave: (log: Omit<BrewLog, 'id' | 'createdAt'>, existingId?: string) => void;
  onClose: () => void;
}

const COMMON_FLAVOR_TAGS = [
  'Floral (ดอกไม้)',
  'Jasmine (มะลิ)',
  'Peach (พีช)',
  'Citrus (ส้ม/เลมอน)',
  'Berries (เบอร์รี่)',
  'Tropical (ผลไม้เมืองร้อน)',
  'Honey (น้ำผึ้ง)',
  'Caramel (คาราเมล)',
  'Milk Chocolate (ช็อกโกแลตนม)',
  'Dark Cocoa (โกโก้เข้ม)',
  'Almond/Nutty (ถั่วอัลมอนด์)',
  'Clean Tea (ชาใสสะอาด)',
];

export const BrewLogForm: React.FC<BrewLogFormProps> = ({
  initialGrinderId,
  initialClicks,
  initialBrewTimeSeconds,
  editingLog,
  onSave,
  onClose,
}) => {
  const [grinderId, setGrinderId] = useState<GrinderId>(editingLog?.grinderId || initialGrinderId);
  const [clicks, setClicks] = useState<number>(editingLog?.clicks ?? initialClicks);
  const [beanName, setBeanName] = useState<string>(editingLog?.beanName || '');
  const [origin, setOrigin] = useState<string>(editingLog?.origin || '');
  const [roastLevel, setRoastLevel] = useState<RoastLevel>(editingLog?.roastLevel || 'light');
  const [process, setProcess] = useState<string>(editingLog?.process || 'Washed');
  const [roastDate, setRoastDate] = useState<string>(editingLog?.roastDate || '');
  const [method, setMethod] = useState<BrewMethod>(editingLog?.method || 'v60');
  const [dripper, setDripper] = useState<string>(editingLog?.dripper || 'Hario V60 01');
  const [doseGrams, setDoseGrams] = useState<number>(editingLog?.doseGrams || 15);
  const [waterGrams, setWaterGrams] = useState<number>(editingLog?.waterGrams || 225);
  const [waterTempC, setWaterTempC] = useState<number>(editingLog?.waterTempC || 92);
  const [brewTimeMinutes, setBrewTimeMinutes] = useState<number>(
    editingLog?.brewTimeSeconds
      ? Math.floor(editingLog.brewTimeSeconds / 60)
      : initialBrewTimeSeconds
      ? Math.floor(initialBrewTimeSeconds / 60)
      : 2
  );
  const [brewTimeSeconds, setBrewTimeSeconds] = useState<number>(
    editingLog?.brewTimeSeconds
      ? editingLog.brewTimeSeconds % 60
      : initialBrewTimeSeconds
      ? initialBrewTimeSeconds % 60
      : 30
  );
  const [rating, setRating] = useState<number>(editingLog?.rating || 5);
  const [flavorNotes, setFlavorNotes] = useState<string[]>(editingLog?.flavorNotes || ['Floral', 'Peach']);
  const [customFlavor, setCustomFlavor] = useState<string>('');
  const [extractionVerdict, setExtractionVerdict] = useState<ExtractionVerdict>(
    editingLog?.extractionVerdict || 'balanced'
  );
  const [tasteNotes, setTasteNotes] = useState<string>(editingLog?.tasteNotes || '');

  const profile = GRINDER_PROFILES[grinderId];

  // Auto calculate ratio
  const ratioStr = doseGrams > 0 ? `1:${(waterGrams / doseGrams).toFixed(1)}` : '1:15';

  const toggleFlavor = (flavor: string) => {
    if (flavorNotes.includes(flavor)) {
      setFlavorNotes(flavorNotes.filter((f) => f !== flavor));
    } else {
      setFlavorNotes([...flavorNotes, flavor]);
    }
  };

  const handleAddCustomFlavor = () => {
    const trimmed = customFlavor.trim();
    if (trimmed && !flavorNotes.includes(trimmed)) {
      setFlavorNotes([...flavorNotes, trimmed]);
      setCustomFlavor('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!beanName.trim()) {
      alert('กรุณากรอกชื่อเมล็ดกาแฟ');
      return;
    }

    const totalSeconds = brewTimeMinutes * 60 + brewTimeSeconds;

    onSave(
      {
        grinderId,
        clicks,
        beanName: beanName.trim(),
        origin: origin.trim() || 'Single Origin',
        roastLevel,
        process: process.trim(),
        roastDate,
        method,
        dripper: dripper.trim(),
        doseGrams,
        waterGrams,
        ratio: ratioStr,
        waterTempC,
        brewTimeSeconds: totalSeconds,
        rating,
        flavorNotes,
        extractionVerdict,
        tasteNotes: tasteNotes.trim(),
        isFavorite: editingLog?.isFavorite || false,
      },
      editingLog?.id
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Top Bar */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              {editingLog ? 'แก้ไขบันทึกสูตรชง' : 'จดบันทึกการชงกาแฟ (New Brew Log)'}
            </h3>
            <p className="text-xs text-stone-500">
              บันทึกเบอร์บดและผลลัพธ์รสชาติ เพื่อสร้างมาตรฐานสูตรชงที่ดีที่สุด
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Section 1: Grinder & Clicks Selection */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-4">
            <div className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
              1. เลือกเครื่องบดและจำนวนคลิก (Grinder & Clicks)
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGrinderId('mischief-m40')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  grinderId === 'mischief-m40'
                    ? 'border-amber-800 bg-white ring-2 ring-amber-800/10'
                    : 'border-stone-200 bg-stone-100 hover:bg-white'
                }`}
              >
                <div className="text-xs font-bold text-stone-900">Mischief M40</div>
                <div className="text-[11px] text-stone-500">~30 µm/คลิก (0-45 คลิก)</div>
              </button>

              <button
                type="button"
                onClick={() => setGrinderId('lenodi')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  grinderId === 'lenodi'
                    ? 'border-amber-800 bg-white ring-2 ring-amber-800/10'
                    : 'border-stone-200 bg-stone-100 hover:bg-white'
                }`}
              >
                <div className="text-xs font-bold text-stone-900">LEnodi</div>
                <div className="text-[11px] text-stone-500">~22 µm/คลิก (0-65 คลิก)</div>
              </button>
            </div>

            {/* Click Count Stepper */}
            <div className="bg-white border border-stone-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <span className="text-xs text-stone-500 block">จำนวนคลิกที่ใช้บด</span>
                <span className="text-3xl font-bold font-mono text-stone-900 tabular-nums">
                  {clicks} <span className="text-xs font-normal text-stone-500">คลิก</span>
                </span>
                <span className="text-[11px] text-stone-400 block font-mono">
                  ≈ {Math.round(clicks * profile.clickPitchMicrons)} ไมครอน
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setClicks(Math.max(0, clicks - 1))}
                  className="w-10 h-10 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold font-mono text-lg flex items-center justify-center transition-colors"
                >
                  -
                </button>
                <button
                  type="button"
                  onClick={() => setClicks(Math.min(profile.maxClicks, clicks + 1))}
                  className="w-10 h-10 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold font-mono text-lg flex items-center justify-center transition-colors"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* Section 2: Coffee Bean Information */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
              2. ข้อมูลเมล็ดกาแฟ (Coffee Beans)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  ชื่อเมล็ดกาแฟ / โรงคั่ว *
                </label>
                <input
                  type="text"
                  required
                  placeholder="เช่น แม่จันใต้ Anaerobic, Ethiopia Yirgacheffe"
                  value={beanName}
                  onChange={(e) => setBeanName(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  แหล่งปลูก / Origin
                </label>
                <input
                  type="text"
                  placeholder="เช่น เชียงราย ไทย, Sidama Ethiopia"
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  ระดับการคั่ว (Roast Level)
                </label>
                <select
                  value={roastLevel}
                  onChange={(e) => setRoastLevel(e.target.value as RoastLevel)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800 bg-white"
                >
                  <option value="light">คั่วอ่อน (Light)</option>
                  <option value="medium-light">คั่วอ่อน-กลาง (Medium-Light)</option>
                  <option value="medium">คั่วกลาง (Medium)</option>
                  <option value="medium-dark">คั่วกลาง-เข้ม (Medium-Dark)</option>
                  <option value="dark">คั่วเข้ม (Dark)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  โพรเซส (Process)
                </label>
                <input
                  type="text"
                  placeholder="Washed, Natural, Honey, Anaerobic"
                  value={process}
                  onChange={(e) => setProcess(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  วันที่คั่ว (Roast Date)
                </label>
                <input
                  type="date"
                  value={roastDate}
                  onChange={(e) => setRoastDate(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Recipe & Brew Method */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
              3. วิธีชงและสูตรสกัด (Brew Recipe)
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  วิธีชง (Method)
                </label>
                <select
                  value={method}
                  onChange={(e) => setMethod(e.target.value as BrewMethod)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800 bg-white"
                >
                  <option value="v60">ดริป V60 (Pour Over)</option>
                  <option value="origami">Origami / Kalita (Flat Bed)</option>
                  <option value="aeropress">AeroPress</option>
                  <option value="espresso">Espresso / Flair 58</option>
                  <option value="moka">Moka Pot</option>
                  <option value="french-press">French Press</option>
                  <option value="cold-brew">Cold Brew</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  อุปกรณ์ / ดริปเปอร์ (Dripper/Gear)
                </label>
                <input
                  type="text"
                  placeholder="เช่น Hario V60 Ceramic, Flair 58, Bialetti"
                  value={dripper}
                  onChange={(e) => setDripper(e.target.value)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  ผงกาแฟ (g)
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="5"
                  max="100"
                  value={doseGrams}
                  onChange={(e) => setDoseGrams(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  น้ำกาแฟ (g) <span className="text-[10px] text-amber-800 font-mono">({ratioStr})</span>
                </label>
                <input
                  type="number"
                  step="1"
                  min="10"
                  max="1000"
                  value={waterGrams}
                  onChange={(e) => setWaterGrams(parseFloat(e.target.value) || 0)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  อุณหภูมิ (°C)
                </label>
                <input
                  type="number"
                  min="60"
                  max="100"
                  value={waterTempC}
                  onChange={(e) => setWaterTempC(parseInt(e.target.value, 10) || 90)}
                  className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  เวลาชง (น:วิ)
                </label>
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={brewTimeMinutes}
                    onChange={(e) => setBrewTimeMinutes(parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs px-2 py-2 border border-stone-300 rounded-lg text-center font-mono"
                    placeholder="น."
                  />
                  <span>:</span>
                  <input
                    type="number"
                    min="0"
                    max="59"
                    value={brewTimeSeconds}
                    onChange={(e) => setBrewTimeSeconds(parseInt(e.target.value, 10) || 0)}
                    className="w-full text-xs px-2 py-2 border border-stone-300 rounded-lg text-center font-mono"
                    placeholder="วิ."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Sensory Evaluation */}
          <div className="space-y-4">
            <div className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
              4. ผลลัพธ์และคะแนนรสชาติ (Sensory & Verdict)
            </div>

            {/* Verdict Selection */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                การประเมินการสกัด (Extraction Verdict)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setExtractionVerdict('under')}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                    extractionVerdict === 'under'
                      ? 'border-amber-600 bg-amber-50 text-amber-900 ring-1 ring-amber-600'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-semibold">Under-extracted</div>
                  <div className="text-[11px] text-stone-500">เปรี้ยวโดด / บอดี้บาง (แนะนำบดละเอียดขึ้น)</div>
                </button>

                <button
                  type="button"
                  onClick={() => setExtractionVerdict('balanced')}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                    extractionVerdict === 'balanced'
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-600'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-semibold">Sweet Spot (ลงตัวมาก)</div>
                  <div className="text-[11px] text-stone-500">เปรี้ยวหวานกลมกล่อม สะอาด บอดี้กำลังดี</div>
                </button>

                <button
                  type="button"
                  onClick={() => setExtractionVerdict('over')}
                  className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${
                    extractionVerdict === 'over'
                      ? 'border-rose-600 bg-rose-50 text-rose-900 ring-1 ring-rose-600'
                      : 'border-stone-200 text-stone-600 hover:bg-stone-50'
                  }`}
                >
                  <div className="font-semibold">Over-extracted</div>
                  <div className="text-[11px] text-stone-500">ขมฝาดคอ / เฝื่อน (แนะนำบดหยาบขึ้น)</div>
                </button>
              </div>
            </div>

            {/* Star Rating */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-medium text-stone-700">คะแนนความพึงพอใจ:</span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-6 h-6 ${
                        star <= rating ? 'fill-amber-500 text-amber-500' : 'text-stone-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Flavor Tags */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1.5">
                รสชาติและกลิ่นที่สัมผัสได้ (Flavor Notes)
              </label>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {COMMON_FLAVOR_TAGS.map((flavor) => {
                  const selected = flavorNotes.includes(flavor);
                  return (
                    <button
                      key={flavor}
                      type="button"
                      onClick={() => toggleFlavor(flavor)}
                      className={`text-xs px-2.5 py-1 rounded-md border transition-all ${
                        selected
                          ? 'bg-amber-900 text-white border-amber-900'
                          : 'bg-stone-100 text-stone-700 border-stone-200 hover:bg-stone-200'
                      }`}
                    >
                      {flavor}
                    </button>
                  );
                })}
              </div>

              {/* Add custom note */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="พิมพ์โน้ตกลิ่นเพิ่มเติม เช่น ดอกส้ม, เสาวรส"
                  value={customFlavor}
                  onChange={(e) => setCustomFlavor(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCustomFlavor();
                    }
                  }}
                  className="text-xs px-3 py-1.5 border border-stone-300 rounded-lg flex-1"
                />
                <button
                  type="button"
                  onClick={handleAddCustomFlavor}
                  className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-lg text-xs font-medium flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>เพิ่ม</span>
                </button>
              </div>
            </div>

            {/* Barista Journal Freeform */}
            <div>
              <label className="block text-xs font-medium text-stone-700 mb-1">
                บันทึกบาริสต้า (Tasting Notes / บันทึกเพิ่มเติมสำหรับการชงครั้งหน้า)
              </label>
              <textarea
                rows={3}
                placeholder="เช่น บดเบอร์นี้กลิ่นดอกไม้ฟุ้งมาก acidity ฉ่ำแต่ไม่แหลม ครั้งหน้าลองเทน้ำอุณหภูมิ 91C ดู..."
                value={tasteNotes}
                onChange={(e) => setTasteNotes(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-800 focus:ring-1 focus:ring-amber-800"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 text-stone-700 hover:bg-stone-100 text-xs font-semibold rounded-xl transition-colors"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>{editingLog ? 'บันทึกการแก้ไข' : 'บันทึกสูตรชง'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
