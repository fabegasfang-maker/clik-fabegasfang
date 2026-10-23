import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Plus, Clock, Droplets } from 'lucide-react';
import pourOverImg from '../assets/images/specialty_pourover_coffee_1792688496521.jpg';

interface BrewTimerProps {
  onLogWithTime: (seconds: number) => void;
}

interface Stage {
  name: string;
  startSec: number;
  endSec: number;
  instruction: string;
}

const V60_STAGES: Stage[] = [
  { name: 'Bloom (บลูม)', startSec: 0, endSec: 45, instruction: 'เทน้ำ 45g ให้ทั่วผงกาแฟ รอให้ก๊าซ CO2 ระเหย' },
  { name: '1st Pour (เทรอบที่ 1)', startSec: 45, endSec: 80, instruction: 'เทน้ำวนเบาๆ เป็นก้นหอยจนถึง 130g สกัดกลิ่นหอมและ acidity' },
  { name: '2nd Pour (เทรอบที่ 2)', startSec: 80, endSec: 135, instruction: 'เทน้ำรอบสุดท้ายจนถึงเป้าหมาย 225g ดึงความหวานและบอดี้' },
  { name: 'Drawdown (รอสกัดเสร็จ)', startSec: 135, endSec: 210, instruction: 'ปล่อยให้น้ำกาแฟไหลผ่านกระดาษกรองจนหมด' },
];

export const BrewTimer: React.FC<BrewTimerProps> = ({ onLogWithTime }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedMs, setElapsedMs] = useState<number>(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      const startTime = Date.now() - elapsedMs;
      intervalRef.current = window.setInterval(() => {
        setElapsedMs(Date.now() - startTime);
      }, 50);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    setElapsedMs(0);
  };

  const totalSeconds = Math.floor(elapsedMs / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  const tenths = Math.floor((elapsedMs % 1000) / 100);

  // Current stage
  const currentStage = V60_STAGES.find(
    (s) => totalSeconds >= s.startSec && totalSeconds < s.endSec
  ) || (totalSeconds >= 210 ? { name: 'สกัดเสร็จสิ้น (Finished)', startSec: 210, endSec: 999, instruction: 'นำดริปเปอร์ออก คนเสิร์ฟได้เลย' } : V60_STAGES[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
      {/* Stopwatch Column */}
      <div className="lg:col-span-7 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
        <div>
          <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
            Barista Stopwatch
          </div>
          <h2 className="text-2xl font-bold text-stone-900">
            ตัวจับเวลาสกัดกาแฟ (Brew Timer)
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            จับเวลาจริงพร้อมสเต็ปแนะนำการเทน้ำสำหรับ V60 Pour Over หรือ Espresso Shot
          </p>
        </div>

        {/* Stopwatch Display */}
        <div className="my-8 text-center">
          <div className="font-mono text-7xl sm:text-8xl font-bold tracking-tight text-stone-900 tabular-nums">
            {minutes < 10 ? `0${minutes}` : minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            <span className="text-3xl sm:text-4xl text-stone-400 font-normal">.{tenths}</span>
          </div>

          <div className="mt-4 px-4 py-2 bg-amber-50 border border-amber-200 rounded-xl inline-flex items-center gap-2 text-xs">
            <Droplets className="w-4 h-4 text-amber-800" />
            <span className="font-semibold text-amber-950">{currentStage.name}:</span>
            <span className="text-amber-900">{currentStage.instruction}</span>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="space-y-4 pt-4 border-t border-stone-100">
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleToggle}
              className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white font-bold transition-all shadow-md active:scale-95 ${
                isRunning ? 'bg-amber-700 hover:bg-amber-800' : 'bg-stone-900 hover:bg-stone-800'
              }`}
            >
              {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </button>

            <button
              onClick={handleReset}
              className="w-14 h-14 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 flex items-center justify-center transition-all active:scale-95"
              title="รีเซ็ตเวลา"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
          </div>

          {totalSeconds > 0 && (
            <button
              onClick={() => onLogWithTime(totalSeconds)}
              className="w-full py-3 px-4 bg-amber-900 hover:bg-amber-800 text-white font-semibold text-xs rounded-xl flex items-center justify-center gap-2 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>ใช้เวลานี้ ({minutes}:{seconds < 10 ? '0' : ''}{seconds}) เพื่อสร้างบันทึกการชงใหม่</span>
            </button>
          )}
        </div>
      </div>

      {/* Guide & Atmosphere Column */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="relative aspect-16/9 w-full bg-stone-100">
            <img
              src={pourOverImg}
              alt="Artisan Pour Over Coffee Dripping"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-5">
            <h4 className="text-sm font-bold text-stone-900 mb-2 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-amber-800" />
              <span>ช่วงเวลาสกัดมาตรฐานตามวิธีชง</span>
            </h4>
            <div className="space-y-2 text-xs text-stone-600">
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="font-medium text-stone-900">Espresso (9 bar)</span>
                <span className="font-mono text-stone-600">25 – 35 วินาที</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="font-medium text-stone-900">Moka Pot</span>
                <span className="font-mono text-stone-600">2:30 – 3:30 นาที</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="font-medium text-stone-900">AeroPress (Inverted)</span>
                <span className="font-mono text-stone-600">1:30 – 2:15 นาที</span>
              </div>
              <div className="flex justify-between py-1 border-b border-stone-100">
                <span className="font-medium text-stone-900">V60 Pour Over (15g:225g)</span>
                <span className="font-mono text-stone-600">2:15 – 2:45 นาที</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="font-medium text-stone-900">French Press</span>
                <span className="font-mono text-stone-600">4:00 – 5:00 นาที</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dial-in Tip Box */}
        <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 text-xs text-stone-700 leading-relaxed">
          <div className="font-bold text-stone-900 mb-1">💡 เคล็ดลับการคุมเวลาและการไหล:</div>
          <p>
            หากกาแฟดริป V60 ไหลเสร็จเร็วกว่า 2 นาที (น้ำไหลเร็วเกินไป) รสชาติมักจะเปรี้ยวแหลม บอดี้บาง ให้ลอง<strong>ลดคลิกลง 1-2 คลิก</strong> เพื่อให้บดละเอียดขึ้น
            แต่ถ้าเกิน 3:30 นาทีจนน้ำขัง รสชาติจะเริ่มขมฝาด ให้ลอง<strong>เพิ่มคลิกขึ้น 1-2 คลิก</strong> เพื่อให้บดหยาบขึ้น
          </p>
        </div>
      </div>
    </div>
  );
};
