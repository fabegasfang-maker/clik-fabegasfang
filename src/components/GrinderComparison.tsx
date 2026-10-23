import React, { useState } from 'react';
import { ArrowLeftRight, Check, Sparkles } from 'lucide-react';
import { GRINDER_PROFILES, convertClicks } from '../data/grinderProfiles';
import { GrinderId } from '../types/coffee';

interface GrinderComparisonProps {
  onApplyClickToDial: (grinderId: GrinderId, clicks: number) => void;
}

export const GrinderComparison: React.FC<GrinderComparisonProps> = ({ onApplyClickToDial }) => {
  const [sourceGrinder, setSourceGrinder] = useState<GrinderId>('mischief-m40');
  const [sourceClicks, setSourceClicks] = useState<number>(24);

  const targetGrinder: GrinderId = sourceGrinder === 'mischief-m40' ? 'lenodi' : 'mischief-m40';
  const sourceProfile = GRINDER_PROFILES[sourceGrinder];
  const targetProfile = GRINDER_PROFILES[targetGrinder];

  const convertedClicks = convertClicks(sourceGrinder, sourceClicks);
  const estimatedMicrons = Math.round(sourceClicks * sourceProfile.clickPitchMicrons);

  const swapSource = () => {
    setSourceGrinder(targetGrinder);
    setSourceClicks(convertedClicks);
  };

  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-amber-800 tracking-wider uppercase mb-1">
            Dial Conversion & Scale Comparison
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            เครื่องคิดเลขเทียบเบอร์บด M40 ⇄ LEnodi
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            Mischief M40 มีระยะเกลียวปรับละเอียดระดับ Red Clix ประมาณ ~15.2 µm ต่อคลิก (สเกลคลิกละเอียด 2 เท่าของ C40 มาตรฐาน) ขณะที่ LEnodi มีสเต็ปอยู่ที่ประมาณ ~22 µm ต่อคลิก
            เครื่องมือนี้ช่วยคำนวณเบอร์บดเทียบเคียง เพื่อให้คุณย้ายสูตรกาแฟระหว่าง 2 เครื่องได้อย่างแม่นยำ ไม่ต้องเสียเวลานับคลิกเดาสุ่ม
          </p>
        </div>

        {/* Interactive Converter Card */}
        <div className="mt-8 bg-stone-50 border border-stone-200 rounded-2xl p-6">
          <div className="grid grid-cols-1 md:grid-cols-11 gap-4 items-center">
            {/* Source Box */}
            <div className="md:col-span-5 bg-white border border-stone-200 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
                <span className="font-semibold text-stone-900">{sourceProfile.name}</span>
                <span className="font-mono">ระยะ ~{sourceProfile.clickPitchMicrons} µm/คลิก</span>
              </div>
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-4xl font-bold font-mono text-stone-900 tabular-nums">
                  {sourceClicks}
                </span>
                <span className="text-xs font-mono text-stone-500">คลิก (Clicks)</span>
              </div>
              <input
                type="range"
                min={0}
                max={sourceProfile.maxClicks}
                value={sourceClicks}
                onChange={(e) => setSourceClicks(parseInt(e.target.value, 10))}
                className="w-full h-2 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-amber-800"
              />
              <div className="flex justify-between text-[11px] text-stone-400 font-mono mt-1">
                <span>0 คลิก</span>
                <span>{sourceProfile.maxClicks} คลิก</span>
              </div>
            </div>

            {/* Swap Button */}
            <div className="md:col-span-1 flex justify-center">
              <button
                onClick={swapSource}
                className="p-3 rounded-full bg-white border border-stone-300 hover:bg-amber-50 hover:border-amber-400 text-stone-700 hover:text-amber-800 transition-all shadow-xs"
                title="สลับเครื่องต้นทาง ⇄ ปลายทาง"
              >
                <ArrowLeftRight className="w-4 h-4" />
              </button>
            </div>

            {/* Target Box */}
            <div className="md:col-span-5 bg-amber-50/60 border border-amber-200 rounded-xl p-5 shadow-2xs">
              <div className="flex items-center justify-between text-xs text-amber-900 mb-2">
                <span className="font-semibold">{targetProfile.name} (ค่าเทียบเคียง)</span>
                <span className="font-mono">ระยะ ~{targetProfile.clickPitchMicrons} µm/คลิก</span>
              </div>
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-4xl font-bold font-mono text-amber-950 tabular-nums">
                  ≈ {convertedClicks}
                </span>
                <span className="text-xs font-mono text-amber-800">คลิก (Clicks)</span>
              </div>
              <div className="text-xs text-stone-600 mb-3 font-mono">
                ขนาดอนุภาคผงกาแฟโดยประมาณ: <span className="font-semibold text-stone-900">~{estimatedMicrons} µm</span>
              </div>
              <button
                onClick={() => onApplyClickToDial(targetGrinder, convertedClicks)}
                className="w-full py-2 px-3 bg-amber-900 hover:bg-amber-800 text-white text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                <span>นำค่า {convertedClicks} คลิกนี้ไปตั้งที่หน้าหมุนบด</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Comparison Matrix */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-lg font-bold text-stone-900">
              ตารางเปรียบเทียบช่วงคลิกตามวิธีชง (Brew Method Matrix)
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              ค่ามาตรฐานที่ผ่านการทดสอบจริง สำหรับเมล็ดกาแฟ Specialty คั่วอ่อนถึงคั่วกลาง
            </p>
          </div>
          <div className="text-xs text-stone-500 flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-800" />
            <span>ตัวเลขหนาคือ Sweet Spot แนะนำ</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-semibold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">วิธีชง (Brew Method)</th>
                <th className="py-3.5 px-4 text-stone-900">Mischief M40</th>
                <th className="py-3.5 px-4 text-stone-900">LEnodi</th>
                <th className="py-3.5 px-4">ขนาดไมครอน (Microns)</th>
                <th className="py-3.5 px-4">สัดส่วน / อุณหภูมิน้ำ</th>
                <th className="py-3.5 px-4">การปรับจูน (Dial-in Tip)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-mono text-stone-700">
              {GRINDER_PROFILES['mischief-m40'].ranges.map((m40Range) => {
                const lenodiRange = GRINDER_PROFILES['lenodi'].ranges.find(
                  (r) => r.method === m40Range.method
                );
                return (
                  <tr key={m40Range.method} className="hover:bg-stone-50/70 transition-colors font-sans">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900">{m40Range.nameTh}</div>
                      <div className="text-[11px] text-stone-400 font-mono">{m40Range.nameEn}</div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-sm font-bold text-amber-900">
                        {m40Range.recommended} คลิก
                      </div>
                      <div className="text-[11px] text-stone-500">
                        ช่วง {m40Range.minClicks}–{m40Range.maxClicks}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono">
                      <div className="text-sm font-bold text-amber-900">
                        {lenodiRange ? `${lenodiRange.recommended} คลิก` : '-'}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {lenodiRange ? `ช่วง ${lenodiRange.minClicks}–${lenodiRange.maxClicks}` : '-'}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-600">
                      {m40Range.microns}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-stone-800">{m40Range.ratio}</div>
                      <div className="text-[11px] text-stone-500 font-mono">{m40Range.tempC}°C</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600 max-w-xs font-sans text-[11px] leading-relaxed">
                      {m40Range.descriptionTh}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hardware & Calibration Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-800" />
            <h4 className="text-base font-bold text-stone-900">เทคนิคการหา Zero Point บน Mischief M40</h4>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            หมุนวงล้อปรับด้านล่างตามเข็มนาฬิกาจนกระทั่งด้ามจับเริ่มมีความฝืด หรือใบมีดสัมผัสกันเบาๆ (ห้ามฝืนขันแน่นเกินไปเพราะอาจทำให้คมใบมีดบิ่น)
            จุดนั้นให้นับเป็น <strong>0 คลิก</strong> จากนั้นจึงค่อยหมุนทวนเข็มนาฬิกาออกมาตามจำนวนคลิกที่ต้องการ
          </p>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>ระยะการก้าวต่อคลิก</span>
            <span className="font-mono font-semibold text-stone-900">~15.2 µm (2x C40 / Red Clix)</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-800" />
            <h4 className="text-base font-bold text-stone-900">เทคนิคการหา Zero Point บน LEnodi</h4>
          </div>
          <p className="text-xs text-stone-600 leading-relaxed">
            หมุนปรับ dial จนลูกปืนและใบมีดแตะกันสนิท และเข็มบอกสเกลตรงกับตำแหน่งขีด 0 ด้ามจับหยุดหมุนอิสระ
            LEnodi มีจำนวนคลิกต่อรอบสูงกว่า จึงสามารถชดเชยการไหลของกาแฟดริปได้ละเอียดมากแบบระดับ 1 คลิก ละเอียดขึ้นเล็กน้อย
          </p>
          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
            <span>ระยะการก้าวต่อคลิก</span>
            <span className="font-mono font-semibold text-stone-900">~22 µm (ไมครอน)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
