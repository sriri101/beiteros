import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import {
  QrCode, Keyboard, ChevronLeft, CheckCircle, ChevronDown,
  Zap, Calendar, MapPin, ShieldCheck, Plus
} from 'lucide-react';
import { useAppStore, MOCK_SCAN_TOOL, Tool } from '../store/useAppStore';
import { useTranslation } from '../i18n';

const DISTRIBUTORS = [
  'Werkhaus Berlin', 'Norbau München', 'Steinbach Köln',
  'Krafft Werkzeuge', 'Vogt Werkzeuge', 'Festool Store',
  'Milwaukee Tool DE', 'Bosch DIY Center', 'Toom Baumarkt', 'Other',
];

function ScannerOverlay() {
  return (
    <div className="relative w-64 h-64 mx-auto">
      <div className="absolute inset-0 border border-white/20 rounded-3xl" />
      <div className="absolute top-0 left-0 w-10 h-10 border-t-4 border-l-4 border-[#E31E24] rounded-tl-2xl" />
      <div className="absolute top-0 right-0 w-10 h-10 border-t-4 border-r-4 border-[#E31E24] rounded-tr-2xl" />
      <div className="absolute bottom-0 left-0 w-10 h-10 border-b-4 border-l-4 border-[#E31E24] rounded-bl-2xl" />
      <div className="absolute bottom-0 right-0 w-10 h-10 border-b-4 border-r-4 border-[#E31E24] rounded-br-2xl" />
      <motion.div
        animate={{ top: ['10%', '85%', '10%'] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute left-4 right-4 h-0.5 bg-[#E31E24] shadow-[0_0_12px_#E31E24]"
        style={{ top: '10%' }}
      />
      <div className="absolute inset-0 flex items-center justify-center">
        <QrCode size={48} className="text-white/15" />
      </div>
    </div>
  );
}

export default function Scan() {
  const navigate = useNavigate();
  const { scanStep, setScanStep, setScanResult, scanResult, addTool } = useAppStore();
  const t = useTranslation();
  const [mode, setMode] = useState<'qr' | 'manual'>('qr');
  const [serial, setSerial] = useState('');
  const [scanning, setScanning] = useState(false);
  const [purchaseDate, setPurchaseDate] = useState('');
  const [distributor, setDistributor] = useState('');
  const [extendWarranty, setExtendWarranty] = useState(false);
  const [pointsEarned] = useState(500);

  useEffect(() => {
    setScanStep('choose');
    setScanResult(null);
  }, []);

  const handleScan = () => {
    setScanning(true);
    setTimeout(() => {
      setScanning(false);
      setScanResult(MOCK_SCAN_TOOL);
      setScanStep('identify');
    }, 2500);
  };

  const handleManualLookup = () => {
    if (!serial.trim()) return;
    setScanResult({ ...MOCK_SCAN_TOOL, serial_number: serial });
    setScanStep('identify');
  };

  const handleActivateWarranty = () => {
    if (!purchaseDate || !distributor) return;
    const today = new Date();
    const purchase = new Date(purchaseDate);
    const warrantyEnd = new Date(purchase);
    warrantyEnd.setFullYear(warrantyEnd.getFullYear() + (extendWarranty ? 2 : 1));

    const newTool: Tool = {
      ...scanResult!,
      id: 't_' + Date.now(),
      purchase_date: purchaseDate,
      distributor,
      warranty_start: purchaseDate,
      warranty_end: warrantyEnd.toISOString().split('T')[0],
      extension_applied: extendWarranty,
      warranty_status: 'active',
      maintenance_status: 'ok',
      next_maintenance: new Date(today.setMonth(today.getMonth() + 6)).toISOString().split('T')[0],
    };
    addTool(newTool);
    setScanStep('success');
  };

  return (
    <div className="min-h-screen">
      <AnimatePresence mode="wait">
        {/* CHOOSE MODE */}
        {scanStep === 'choose' && (
          <motion.div
            key="choose"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#F0F0F0] dark:bg-[#111111]"
          >
            {/* Nav Bar */}
            <div className="bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#E0E0E0] dark:border-[#2A2A2A] fixed top-[92px] left-0 right-0 z-30 max-w-md mx-auto">
              <div className="flex items-center justify-center px-4 pt-3 pb-3">
                <h1 className="text-[#111111] dark:text-white text-[17px] font-semibold">Register Tool</h1>
              </div>
            </div>

            <div className="px-4 pt-[44px] pb-6 space-y-4">
              <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[14px]">Scan or enter serial number</p>

              {/* Options */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
                <button
                  onClick={() => { setMode('qr'); setScanStep('scan'); }}
                  className="w-full flex items-center gap-4 px-4 py-4 border-b border-[#F0F0F0] dark:border-[#2A2A2A] text-left active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#FFF0F0] dark:bg-[#E31E24]/15 flex items-center justify-center flex-shrink-0">
                    <QrCode size={22} className="text-[#E31E24]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#111111] dark:text-white text-[16px] font-semibold">Scan QR Code</p>
                    <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px] mt-0.5">Point camera at the QR code on your tool</p>
                  </div>
                  <ChevronDown size={16} className="text-[#CCCCCC] rotate-[-90deg]" />
                </button>

                <button
                  onClick={() => { setMode('manual'); setScanStep('scan'); }}
                  className="w-full flex items-center gap-4 px-4 py-4 text-left active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-[#F0F0F0] dark:bg-[#2A2A2A] flex items-center justify-center flex-shrink-0">
                    <Keyboard size={22} className="text-[#111111] dark:text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#111111] dark:text-white text-[16px] font-semibold">Enter Serial Number</p>
                    <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px] mt-0.5">Manually type the serial number</p>
                  </div>
                  <ChevronDown size={16} className="text-[#CCCCCC] rotate-[-90deg]" />
                </button>
              </div>

              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 transition-colors duration-300">
                <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px]">
                  💡 <span className="text-[#111111] dark:text-white font-medium">Where to find the serial?</span> Check the label on the bottom or back of your tool, or on the inner lid of the original packaging.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* SCAN / MANUAL */}
        {scanStep === 'scan' && (
          <motion.div
            key="scan"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            className={`min-h-screen flex flex-col ${mode === 'qr' ? 'bg-[#111111]' : 'bg-[#F0F0F0] dark:bg-[#111111]'}`}
          >
            {mode === 'qr' ? (
              <>
                <div className="flex items-center gap-3 px-4 pt-14 pb-4">
                  <button onClick={() => setScanStep('choose')} className="flex items-center gap-0.5 text-white active:opacity-60">
                    <ChevronLeft size={20} strokeWidth={2.5} />
                    <span className="text-[15px]">Back</span>
                  </button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-6 gap-10">
                  <p className="text-white/60 text-[15px] text-center">Center the QR code within the frame</p>
                  <ScannerOverlay />
                  <p className="text-white/30 text-[13px] text-center">Make sure the QR code is well-lit and in focus</p>
                  <button
                    onClick={handleScan}
                    disabled={scanning}
                    className="bg-[#E31E24] text-white text-[16px] font-semibold px-8 py-4 rounded-2xl flex items-center gap-3 disabled:opacity-60 transition-opacity"
                  >
                    {scanning ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Scanning...
                      </>
                    ) : (
                      <><QrCode size={20} /> Simulate Scan</>
                    )}
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Nav bar */}
                <div className="bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#E0E0E0] dark:border-[#2A2A2A] fixed top-[92px] left-0 right-0 z-30 max-w-md mx-auto">
                  <div className="flex items-center justify-between px-4 pt-3 pb-3">
                    <button onClick={() => setScanStep('choose')} className="flex items-center gap-0.5 text-[#E31E24] active:opacity-60">
                      <ChevronLeft size={20} strokeWidth={2.5} />
                      <span className="text-[15px]">Back</span>
                    </button>
                    <h1 className="text-[#111111] dark:text-white text-[17px] font-semibold">Enter Serial</h1>
                    <div className="w-16" />
                  </div>
                </div>
                {/* pt = sub-header title row: 44px */}
                <div className="px-4 pt-[44px] space-y-4">
                  <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-5 transition-colors duration-300">
                    <label className="block text-[#6C6C70] dark:text-[#AAAAAA] text-[13px] font-medium mb-2">Serial Number</label>
                    <input
                      type="text"
                      placeholder="e.g. BOS-D18-2024-001"
                      value={serial}
                      onChange={(e) => setSerial(e.target.value.toUpperCase())}
                      className="w-full bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] font-mono text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E31E24] uppercase placeholder-[#8E8E93] transition-colors"
                    />
                    <p className="text-[#8E8E93] text-[12px] mt-2">Format: BOS-XXXX-YEAR-NUM</p>
                    <button
                      onClick={handleManualLookup}
                      disabled={!serial.trim()}
                      className="w-full mt-5 bg-[#E31E24] disabled:bg-[#CCCCCC] text-white text-[16px] font-semibold py-4 rounded-2xl transition-colors"
                    >
                      Look Up Tool
                    </button>
                  </div>
                  <div className="bg-[#FFF0F0] dark:bg-[#E31E24]/15 rounded-2xl p-4">
                    <p className="text-[#111111] dark:text-white text-[14px] font-semibold">Try: BOS-ID18-2025-099</p>
                    <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px]">Demo serial for BEITER Laser Level</p>
                  </div>
                </div>
              </>
            )}
          </motion.div>
        )}

        {/* IDENTIFY */}
        {scanStep === 'identify' && scanResult && (
          <motion.div
            key="identify"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="min-h-screen bg-[#F0F0F0] dark:bg-[#111111] transition-colors duration-300"
          >
            {/* Nav */}
            <div className="bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#E0E0E0] dark:border-[#2A2A2A] fixed top-[92px] left-0 right-0 z-30 max-w-md mx-auto">
              <div className="flex items-center justify-between px-4 pt-3 pb-3">
                <button onClick={() => setScanStep('scan')} className="flex items-center gap-0.5 text-[#E31E24] active:opacity-60">
                  <ChevronLeft size={20} strokeWidth={2.5} />
                  <span className="text-[15px]">Back</span>
                </button>
                <h1 className="text-[#111111] dark:text-white text-[17px] font-semibold">Tool Found</h1>
                <div className="w-16" />
              </div>
            </div>

            {/* pt = sub-header title row: 44px */}
            <div className="px-4 pt-[44px] pb-6 space-y-4">
              {/* Tool Card */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 flex gap-4 transition-colors duration-300">
                <img src={scanResult.image_url} alt={scanResult.model} className="w-24 h-24 rounded-2xl object-cover flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[#E31E24] text-[11px] font-bold uppercase tracking-wide">{scanResult.category}</p>
                  <h2 className="text-[#111111] dark:text-white text-[17px] font-bold mt-0.5">{scanResult.model}</h2>
                  <p className="text-[#8E8E93] text-[12px] font-mono mt-1">{scanResult.serial_number}</p>
                  <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[12px] mt-0.5">{scanResult.battery_platform}</p>
                </div>
              </div>

              {/* Key Specs */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
                <div className="px-4 py-3 border-b border-[#F0F0F0] dark:border-[#2A2A2A]">
                  <p className="text-[#111111] dark:text-white text-[15px] font-semibold">Key Specs</p>
                </div>
                <div className="grid grid-cols-2">
                  {Object.entries(scanResult.specs).slice(0, 4).map(([k, v], i) => (
                    <div key={k} className={`p-3.5 ${i % 2 === 0 ? 'border-r border-[#F0F0F0] dark:border-[#2A2A2A]' : ''} ${i < 2 ? 'border-b border-[#F0F0F0] dark:border-[#2A2A2A]' : ''}`}>
                      <p className="text-[#8E8E93] text-[11px]">{k}</p>
                      <p className="text-[#111111] dark:text-white text-[13px] font-semibold mt-0.5">{v}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Warranty Form */}
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 transition-colors duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <ShieldCheck size={16} className="text-[#E31E24]" />
                  <p className="text-[#111111] dark:text-white text-[15px] font-semibold">Warranty Activation</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-[#6C6C70] dark:text-[#AAAAAA] text-[13px] font-medium mb-1.5">
                      <Calendar size={12} className="inline mr-1" /> Purchase Date
                    </label>
                    <input
                      type="date"
                      value={purchaseDate}
                      onChange={(e) => setPurchaseDate(e.target.value)}
                      max={new Date().toISOString().split('T')[0]}
                      className="w-full bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E31E24] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#6C6C70] dark:text-[#AAAAAA] text-[13px] font-medium mb-1.5">
                      <MapPin size={12} className="inline mr-1" /> Distributor / Shop
                    </label>
                    <div className="relative">
                      <select
                        value={distributor}
                        onChange={(e) => setDistributor(e.target.value)}
                        className="w-full bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E31E24] appearance-none transition-colors"
                      >
                        <option value="">Select distributor...</option>
                        {DISTRIBUTORS.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8E8E93] pointer-events-none" />
                    </div>
                  </div>

                  {/* Base warranty */}
                  <div className="bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded-xl p-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#111111] dark:text-white text-[14px] font-medium">Base Warranty</p>
                        <p className="text-[#8E8E93] text-[12px]">1 year from purchase date</p>
                      </div>
                      <ShieldCheck size={16} className="text-[#34C759]" />
                    </div>
                  </div>

                  {/* Extension */}
                  <button
                    className={`w-full rounded-xl p-3 border-2 transition-all text-left ${
                      extendWarranty ? 'border-[#E31E24] bg-[#FFF0F0] dark:bg-[#E31E24]/15' : 'border-[#E0E0E0] dark:border-[#2A2A2A] bg-[#F0F0F0] dark:bg-[#2A2A2A]'
                    }`}
                    onClick={() => setExtendWarranty(!extendWarranty)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[#111111] dark:text-white text-[14px] font-medium">+ 1 Year Extension</p>
                        <p className="text-[#8E8E93] text-[12px]">Total: 2 years coverage</p>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${extendWarranty ? 'border-[#E31E24] bg-[#E31E24]' : 'border-[#CCCCCC] dark:border-[#3A3A3A]'}`}>
                        {extendWarranty && <CheckCircle size={12} className="text-white" />}
                      </div>
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handleActivateWarranty}
                disabled={!purchaseDate || !distributor}
                className="w-full bg-[#E31E24] disabled:bg-[#CCCCCC] text-white text-[16px] font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
              >
                <ShieldCheck size={18} /> Activate Warranty
              </button>
            </div>
          </motion.div>
        )}

        {/* SUCCESS */}
        {scanStep === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="min-h-screen bg-[#111111] flex flex-col items-center justify-center px-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-[#E31E24] flex items-center justify-center mb-8"
            >
              <CheckCircle size={48} className="text-white" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <h1 className="text-white text-[28px] font-bold mb-2">Tool Registered!</h1>
              <p className="text-white/60 text-[15px] mb-8">Your warranty has been successfully activated.</p>

              <div className="bg-white/10 rounded-2xl p-5 mb-5 text-left w-full">
                {scanResult && (
                  <>
                    <p className="text-[#E31E24] text-[11px] font-bold uppercase tracking-wide mb-1">{scanResult.category}</p>
                    <p className="text-white text-[16px] font-bold">{scanResult.model}</p>
                    <p className="text-white/50 text-[12px] font-mono mt-0.5">{scanResult.serial_number}</p>
                  </>
                )}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center gap-2">
                  <ShieldCheck size={14} className="text-[#E31E24]" />
                  <span className="text-white/70 text-[13px]">Warranty {extendWarranty ? '2-year' : '1-year'} activated</span>
                </div>
              </div>

              <div className="bg-[#E31E24] rounded-2xl p-4 mb-8 flex items-center gap-4 w-full">
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Zap size={22} className="text-white" fill="white" />
                </div>
                <div className="text-left">
                  <p className="text-white text-[16px] font-bold">+{pointsEarned} Points Earned!</p>
                  <p className="text-white/70 text-[13px]">Keep registering tools to level up</p>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => { setScanStep('choose'); navigate('/app/tools'); }}
                  className="flex-1 bg-white text-[#111111] text-[15px] font-bold py-4 rounded-2xl"
                >
                  View My Tools
                </button>
                <button
                  onClick={() => setScanStep('choose')}
                  className="flex-1 border border-white/30 text-white text-[15px] font-bold py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  <Plus size={16} /> Add Another
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}