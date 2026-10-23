import React from 'react';
import { GRINDER_PROFILES } from '../data/grinderProfiles';
import { Compass, BookOpen, Coffee, SlidersHorizontal } from 'lucide-react';

export const GrindChartGuide: React.FC = () => {
  const m40 = GRINDER_PROFILES['mischief-m40'];
  const lenodi = GRINDER_PROFILES['lenodi'];

  return (
    <div className="space-y-8">
      {/* Hero Reference Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-xs">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold text-amber-800 tracking-wider uppercase mb-1 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4" />
            <span>Comprehensive Barista Dial-in Handbook</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-900">
            คู่มือและตารางอ้างอิงเบอร์บด M40 & LEnodi
          </h2>
          <p className="text-sm text-stone-600 mt-2 leading-relaxed">
            เจาะลึกเบอร์บดของเครื่องบดมือหมุนทั้ง 2 ตัว พร้อมคำแนะนำในการชดเชยตามระดับการคั่ว (Roast Level), แหล่งปลูก, และอาการรสชาติ Under/Over Extraction
          </p>
        </div>
      </div>

      {/* Visual Texture Spectrum */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
        <h3 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-amber-800" />
          <span>ระดับสัมผัสผงกาแฟ (Visual Particle Size Spectrum)</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-xs">
          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">Extra Fine</span>
            <span className="font-bold text-stone-900 block mt-1">Cezve / Ibrik</span>
            <span className="text-[11px] text-stone-500 block">ผงแป้งฝุ่น</span>
            <div className="mt-2 text-[10px] text-amber-900 font-mono">M40: 4–21<br/>LEnodi: 8–16</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">Fine</span>
            <span className="font-bold text-stone-900 block mt-1">Espresso</span>
            <span className="text-[11px] text-stone-500 block">แป้งทรายละเอียด</span>
            <div className="mt-2 text-[10px] text-amber-900 font-mono">M40: 14–32<br/>LEnodi: 16–24</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">Medium-Fine</span>
            <span className="font-bold text-stone-900 block mt-1">Bialetti (Moka)</span>
            <span className="text-[11px] text-stone-500 block">เกลือแกงป่น</span>
            <div className="mt-2 text-[10px] text-amber-900 font-mono">M40: 26–40<br/>LEnodi: 24–32</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">Medium</span>
            <span className="font-bold text-stone-900 block mt-1">AeroPress</span>
            <span className="text-[11px] text-stone-500 block">ทรายละเอียด</span>
            <div className="mt-2 text-[10px] text-amber-900 font-mono">M40: 32–45<br/>LEnodi: 28–38</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 border-amber-300 bg-amber-50/50">
            <span className="text-[10px] text-amber-800 uppercase font-mono block font-semibold">Sweet Drip</span>
            <span className="font-bold text-stone-900 block mt-1">Filter (V60)</span>
            <span className="text-[11px] text-stone-500 block">น้ำตาลทรายขาว</span>
            <div className="mt-2 text-[10px] text-amber-950 font-bold font-mono">M40: 38–62<br/>LEnodi: 34–46</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">Coarse</span>
            <span className="font-bold text-stone-900 block mt-1">French Press</span>
            <span className="text-[11px] text-stone-500 block">เกลือทะเลหยาบ</span>
            <div className="mt-2 text-[10px] text-amber-900 font-mono">M40: 57–73<br/>LEnodi: 46–56</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">Extra Coarse</span>
            <span className="font-bold text-stone-900 block mt-1">Cold Brew</span>
            <span className="text-[11px] text-stone-500 block">เกล็ดขนมปัง</span>
            <div className="mt-2 text-[10px] text-amber-900 font-mono">M40: 69–81<br/>LEnodi: 52–62</div>
          </div>
        </div>
      </div>

      {/* Official Medtek / Mischief M40 Reference Chart Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
              Official Reference Table
            </span>
            <h3 className="text-lg font-bold text-stone-900 mt-1">
              ตารางอ้างอิงเบอร์บดมาตรฐาน Mischief M40 (Medtek)
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              ตารางแนะนำการปรับเบอร์บดสำหรับ Mischief M40 เปรียบเทียบกับ Comandante C40 (Standard Clix) 
              โดยสเกลคลิกของ M40 มีความละเอียดเป็น <strong>2 เท่า</strong> ของ C40 มาตรฐาน (เทียบเท่าระบบ Red Clix) 
              และมี<strong>ค่าเริ่มต้นจากโรงงานคือ 24 คลิก</strong>
            </p>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Cezve / Ibrik</span>
                <span className="font-mono font-bold text-stone-900">4 ~ 21 คลิก</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Espresso</span>
                <span className="font-mono font-bold text-stone-900">14 ~ 32 คลิก</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Bialetti (Moka Pot)</span>
                <span className="font-mono font-bold text-stone-900">26 ~ 40 คลิก</span>
              </div>
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
                <span className="text-amber-800 block text-[10px] font-semibold">Filter (V60 Drip)</span>
                <span className="font-mono font-bold text-amber-950">38 ~ 62 คลิก</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px]">Chemex / Origami</span>
                <span className="font-mono font-bold text-stone-900">54 ~ 70 คลิก</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200">
                <span className="text-stone-400 block text-[10px]">French Press</span>
                <span className="font-mono font-bold text-stone-900">57 ~ 73 คลิก</span>
              </div>
              <div className="p-2.5 bg-stone-50 rounded-xl border border-stone-200 col-span-2">
                <span className="text-stone-400 block text-[10px]">Cold Brew (สกัดเย็น)</span>
                <span className="font-mono font-bold text-stone-900">69 ~ 81 คลิก</span>
              </div>
            </div>
          </div>

          {/* Reference Image Container */}
          <div className="w-full lg:w-96 rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-2xs shrink-0">
            <img
              src="/assets/aistudio/image_c292c32b.png"
              alt="Mischief M40 Medtek Reference Clix Chart"
              className="w-full h-auto object-contain bg-white"
            />
            <div className="p-2.5 text-center bg-stone-50 text-[11px] text-stone-500 border-t border-stone-200">
              รูปตารางแนะนำเบอร์บด Mischief M40 จาก Medtek
            </div>
          </div>
        </div>
      </div>

      {/* Dialing-in Rules of Thumb */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-amber-800">
            <Coffee className="w-5 h-5" />
            <h4 className="font-bold text-stone-900 text-sm">การปรับตามระดับการคั่ว (Roast)</h4>
          </div>
          <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
            <li>
              <strong className="text-stone-900">คั่วอ่อน (Light Roast):</strong> เมล็ดมีความหนาแน่นสูง แข็งตัว บดสกัดยากขึ้น แนะนำให้<strong>บดละเอียดกว่าปกติ 1-2 คลิก</strong> เพื่อช่วยเพิ่มพื้นที่ผิวและอัตราการสกัด
            </li>
            <li>
              <strong className="text-stone-900">คั่วเข้ม (Dark Roast):</strong> โครงสร้างเมล็ดเปราะพรุน ละลายน้ำได้เร็วมาก แนะนำให้<strong>บดหยาบขึ้น 1-2 คลิก</strong> และลดอุณหภูมิน้ำลง (88-90°C) เพื่อไม่ให้ติดรสไหม้ขม
            </li>
          </ul>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-amber-800">
            <Compass className="w-5 h-5" />
            <h4 className="font-bold text-stone-900 text-sm">แก้ปัญหารสชาติ (Compass)</h4>
          </div>
          <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
            <li>
              <strong className="text-stone-900">เปรี้ยวแหลม บอดี้บาง (Under):</strong> เกิดจากน้ำไหลผ่านเร็วไป หรือสกัดไม่ทัน ➜ <strong>ปรับคลิกลดลง</strong> (บดละเอียดขึ้น) หรือเพิ่มอุณหภูมิน้ำ
            </li>
            <li>
              <strong className="text-stone-900">ขม ฝาด คอแห้ง (Over):</strong> เกิดจากผงกาแฟแช่อยู่นานเกินไป หรือผงละเอียดอุดตัน ➜ <strong>ปรับคลิกเพิ่มขึ้น</strong> (บดหยาบขึ้น)
            </li>
          </ul>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
          <div className="flex items-center gap-2 mb-3 text-amber-800">
            <BookOpen className="w-5 h-5" />
            <h4 className="font-bold text-stone-900 text-sm">การดูแลรักษาเครื่องบดมือหมุน</h4>
          </div>
          <ul className="space-y-2 text-xs text-stone-600 leading-relaxed">
            <li>
              <strong>ห้ามล้างใบมีดด้วยน้ำเด็ดขาด!</strong> ความชื้นจะทำให้ลูกปืนเป็นสนิมและใบมีดสึกหรอ ให้ใช้แปรงปัดขนม้าและลูกยางเป่าลมทำความสะอาดแทน
            </li>
            <li>
              หากเปลี่ยนเมล็ดกาแฟคนละชนิด ให้บดล้าง (Purge) ด้วยเมล็ดใหม่ 2-3 เมล็ด เพื่อไล่กลิ่นน้ำมันของเมล็ดเดิมออก
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
