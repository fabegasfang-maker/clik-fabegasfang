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
            <span className="font-bold text-stone-900 block mt-1">Turkish</span>
            <span className="text-[11px] text-stone-500 block">ผงแป้งฝุ่น</span>
            <div className="mt-2 text-[10px] text-amber-900 font-mono">M40: 4-7<br/>LEnodi: 8-12</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">Fine</span>
            <span className="font-bold text-stone-900 block mt-1">Espresso</span>
            <span className="text-[11px] text-stone-500 block">แป้งทรายละเอียด</span>
            <div className="mt-2 text-[10px] text-amber-900 font-mono">M40: 8-14<br/>LEnodi: 12-20</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">Medium-Fine</span>
            <span className="font-bold text-stone-900 block mt-1">Moka Pot</span>
            <span className="text-[11px] text-stone-500 block">เกลือแกงป่น</span>
            <div className="mt-2 text-[10px] text-amber-900 font-mono">M40: 14-18<br/>LEnodi: 20-28</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">Medium</span>
            <span className="font-bold text-stone-900 block mt-1">AeroPress</span>
            <span className="text-[11px] text-stone-500 block">ทรายละเอียด</span>
            <div className="mt-2 text-[10px] text-amber-900 font-mono">M40: 16-22<br/>LEnodi: 26-36</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3 border-amber-300 bg-amber-50/50">
            <span className="text-[10px] text-amber-800 uppercase font-mono block font-semibold">Sweet Drip</span>
            <span className="font-bold text-stone-900 block mt-1">Pour Over V60</span>
            <span className="text-[11px] text-stone-500 block">น้ำตาลทรายขาว</span>
            <div className="mt-2 text-[10px] text-amber-950 font-bold font-mono">M40: 20-28<br/>LEnodi: 34-46</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">Coarse</span>
            <span className="font-bold text-stone-900 block mt-1">French Press</span>
            <span className="text-[11px] text-stone-500 block">เกลือทะเลหยาบ</span>
            <div className="mt-2 text-[10px] text-amber-900 font-mono">M40: 28-36<br/>LEnodi: 46-56</div>
          </div>

          <div className="bg-stone-50 border border-stone-200 rounded-xl p-3">
            <span className="text-[10px] text-stone-400 uppercase font-mono block">Extra Coarse</span>
            <span className="font-bold text-stone-900 block mt-1">Cold Brew</span>
            <span className="text-[11px] text-stone-500 block">เกล็ดขนมปัง</span>
            <div className="mt-2 text-[10px] text-amber-900 font-mono">M40: 34-42<br/>LEnodi: 52-62</div>
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
