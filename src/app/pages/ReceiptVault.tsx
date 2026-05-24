import { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { motion } from 'motion/react';
import {
  ChevronLeft, Search, Upload, Receipt, Download,
  Plus, Calendar, Wrench, X, FileImage, CheckCircle, FlaskConical
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n';

function ReceiptPreviewSVG() {
  return (
    <svg viewBox="0 0 200 280" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="280" fill="#fff" rx="4" />
      <rect x="10" y="10" width="180" height="40" fill="#111111" rx="3" />
      <text x="100" y="27" textAnchor="middle" fill="white" fontSize="10" fontFamily="sans-serif" fontWeight="bold">WERKHAUS BERLIN</text>
      <text x="100" y="42" textAnchor="middle" fill="#E31E24" fontSize="7" fontFamily="sans-serif">Kantstraße 12 · 10623 Berlin</text>
      <line x1="10" y1="58" x2="190" y2="58" stroke="#E5E5EA" strokeWidth="1" strokeDasharray="4,3" />
      <text x="10" y="72" fill="#666" fontSize="7" fontFamily="sans-serif">Datum: 15.03.2024</text>
      <text x="190" y="72" textAnchor="end" fill="#666" fontSize="7" fontFamily="sans-serif">Kasse: 04</text>
      <text x="10" y="84" fill="#666" fontSize="7" fontFamily="sans-serif">Beleg-Nr: 2024-00847</text>
      <line x1="10" y1="92" x2="190" y2="92" stroke="#E5E5EA" strokeWidth="0.5" />
      <text x="10" y="105" fill="#333" fontSize="7.5" fontFamily="sans-serif" fontWeight="bold">BRH70-20V Rotary Hammer</text>
      <text x="10" y="116" fill="#666" fontSize="6.5" fontFamily="sans-serif">Art.-Nr.: BRH70-20V-2024</text>
      <text x="190" y="116" textAnchor="end" fill="#111111" fontSize="8" fontFamily="sans-serif" fontWeight="bold">€ 249,00</text>
      <text x="10" y="132" fill="#333" fontSize="7.5" fontFamily="sans-serif">BOS-20V Akku 5,0 Ah</text>
      <text x="190" y="132" textAnchor="end" fill="#111111" fontSize="8" fontFamily="sans-serif">€ 0,00</text>
      <text x="10" y="148" fill="#333" fontSize="7.5" fontFamily="sans-serif">BOS-20V Ladegerät</text>
      <text x="190" y="148" textAnchor="end" fill="#111111" fontSize="8" fontFamily="sans-serif">€ 0,00</text>
      <line x1="10" y1="156" x2="190" y2="156" stroke="#E5E5EA" strokeWidth="1" />
      <text x="10" y="168" fill="#666" fontSize="7" fontFamily="sans-serif">Nettobetrag</text>
      <text x="190" y="168" textAnchor="end" fill="#666" fontSize="7" fontFamily="sans-serif">€ 209,24</text>
      <text x="10" y="180" fill="#666" fontSize="7" fontFamily="sans-serif">MwSt. 19%</text>
      <text x="190" y="180" textAnchor="end" fill="#666" fontSize="7" fontFamily="sans-serif">€ 39,76</text>
      <rect x="10" y="186" width="180" height="22" fill="#111111" rx="2" />
      <text x="15" y="200" fill="white" fontSize="8.5" fontFamily="sans-serif" fontWeight="bold">GESAMT</text>
      <text x="185" y="200" textAnchor="end" fill="#E31E24" fontSize="9" fontFamily="sans-serif" fontWeight="bold">€ 249,00</text>
      <text x="100" y="222" textAnchor="middle" fill="#999" fontSize="6" fontFamily="sans-serif">Zahlungsart: EC-Karte</text>
      <text x="100" y="233" textAnchor="middle" fill="#999" fontSize="6" fontFamily="sans-serif">Vielen Dank für Ihren Einkauf!</text>
      {Array.from({ length: 28 }).map((_, i) => (
        <rect key={i} x={40 + i * 4} y="242" width={i % 3 === 0 ? 2 : 1} height="18" fill="#333" />
      ))}
      <text x="100" y="272" textAnchor="middle" fill="#999" fontSize="5.5" fontFamily="sans-serif">2024-BOS-D18-847</text>
    </svg>
  );
}

export default function ReceiptVault() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { receipts, tools, addReceipt } = useAppStore();
  const t = useTranslation();
  const [search, setSearch] = useState('');
  const [filterTool, setFilterTool] = useState('all');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isTestReceipt, setIsTestReceipt] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadForm, setUploadForm] = useState({
    distributor: '',
    tool_id: '',
    amount: '',
    upload_date: new Date().toISOString().split('T')[0],
  });

  // Auto-open upload sheet when navigated with ?add=true
  useEffect(() => {
    if (searchParams.get('add') === 'true') {
      setShowUpload(true);
    }
  }, [searchParams]);

  const filtered = receipts.filter((r) => {
    const matchSearch =
      (r.tool_name || '').toLowerCase().includes(search.toLowerCase()) ||
      r.distributor.toLowerCase().includes(search.toLowerCase());
    const matchTool = filterTool === 'all' || r.tool_id === filterTool || (filterTool === 'unassigned' && !r.tool_id);
    return matchSearch && matchTool;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setIsTestReceipt(false);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const loadTestReceipt = () => {
    setIsTestReceipt(true);
    setUploadedFile(null);
    setPreviewUrl(null);
    setUploadForm({ distributor: 'Werkhaus Berlin', tool_id: 't1', amount: '€ 249,00', upload_date: '2024-03-15' });
  };

  const closeModal = () => {
    setShowUpload(false);
    setUploadedFile(null);
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setIsTestReceipt(false);
    setUploadSuccess(false);
    setUploadForm({ distributor: '', tool_id: '', amount: '', upload_date: new Date().toISOString().split('T')[0] });
  };

  const handleUpload = () => {
    const tool = tools.find((tl) => tl.id === uploadForm.tool_id);
    addReceipt({
      id: 'r_' + Date.now(),
      tool_id: uploadForm.tool_id || null,
      tool_name: tool?.model || null,
      file_url: previewUrl || '#',
      upload_date: uploadForm.upload_date,
      distributor: uploadForm.distributor,
      amount: uploadForm.amount,
    });
    setUploadSuccess(true);
    setTimeout(() => closeModal(), 1400);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    return `${d}.${m}.${y}`;
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#111111] transition-colors duration-300">
      {/* Sub-header */}
      <div className="fixed top-[92px] left-0 right-0 z-30 max-w-md mx-auto bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#E0E0E0] dark:border-[#2A2A2A] transition-colors duration-300">
        <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-0.5 text-[#E31E24] active:opacity-60 transition-opacity"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
            <span className="text-[15px]">Back</span>
          </button>
          <h1 className="text-[#111111] dark:text-white text-[17px] font-semibold">{t.receipts.title}</h1>
          <button
            onClick={() => setShowUpload(true)}
            className="w-8 h-8 rounded-full bg-[#E31E24] flex items-center justify-center active:opacity-70 transition-opacity"
          >
            <Plus size={18} className="text-white" />
          </button>
        </div>
        <div className="px-4 pb-3">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E8E93]" />
            <input
              type="text"
              placeholder={t.receipts.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#E8E8E8] dark:bg-[#2A2A2A] rounded-xl py-2 pl-8 pr-4 text-[15px] text-[#111111] dark:text-white focus:outline-none placeholder-[#8E8E93] transition-colors"
            />
          </div>
        </div>
      </div>

      <div className="px-4 pt-[104px] pb-4">
        {/* Filter Pills */}
        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 scrollbar-hide">
          {[
            { value: 'all', label: t.receipts.allFilter },
            { value: 'unassigned', label: t.receipts.unassigned },
            ...tools.map((tool) => ({ value: tool.id, label: tool.model.split(' ').slice(-2).join(' ') })),
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilterTool(f.value)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-[13px] transition-all"
              style={{
                backgroundColor: filterTool === f.value ? '#E31E24' : 'white',
                color: filterTool === f.value ? 'white' : '#111111',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[12px] mb-4">{t.receipts.stored(receipts.length)}</p>

        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16">
            <Receipt size={40} className="text-[#CCCCCC] dark:text-[#3A3A3A] mb-4" />
            <p className="text-[#111111] dark:text-white text-[16px] font-semibold">{t.receipts.noReceipts}</p>
            <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[14px] mt-1">{t.receipts.addFirst}</p>
          </div>
        ) : (
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
            {filtered.map((receipt, i) => (
              <motion.div
                key={receipt.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className={`flex items-center gap-3 px-4 py-3.5 ${i < filtered.length - 1 ? 'border-b border-[#F0F0F0] dark:border-[#2A2A2A]' : ''}`}
              >
                <div className="w-11 h-11 rounded-xl bg-[#FFF0F0] dark:bg-[#E31E24]/15 flex items-center justify-center flex-shrink-0">
                  <Receipt size={18} className="text-[#E31E24]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[#111111] dark:text-white text-[15px] font-medium truncate">
                    {receipt.distributor || t.receipts.unknownShop}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                    <span className="flex items-center gap-1 text-[#8E8E93] text-[12px]">
                      <Calendar size={10} /> {formatDate(receipt.upload_date)}
                    </span>
                    <span className="text-[#E31E24] text-[12px] font-semibold">{receipt.amount}</span>
                  </div>
                  {receipt.tool_name ? (
                    <div className="flex items-center gap-1 mt-0.5">
                      <Wrench size={10} className="text-[#E31E24]" />
                      <span className="text-[#E31E24] text-[11px] font-medium truncate">{receipt.tool_name}</span>
                    </div>
                  ) : (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-[#F0F0F0] dark:bg-[#2A2A2A] text-[#8E8E93] mt-1 inline-block">
                      {t.receipts.unassigned}
                    </span>
                  )}
                </div>
                <button className="text-[#E31E24] ml-1 flex-shrink-0 active:opacity-60 transition-opacity">
                  <Download size={18} />
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Upload Sheet */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-end" onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="bg-white dark:bg-[#1A1A1A] rounded-t-3xl w-full flex flex-col transition-colors duration-300"
            style={{ maxHeight: '92vh' }}
          >
            {/* Sticky Header */}
            <div className="flex-shrink-0 pt-4 px-5 pb-3 border-b border-[#F0F0F0] dark:border-[#2A2A2A]">
              <div className="w-10 h-1 bg-[#E0E0E0] dark:bg-[#2A2A2A] rounded-full mx-auto mb-4" />
              <div className="flex items-center justify-between">
                <h3 className="text-[#111111] dark:text-white text-[17px] font-semibold flex items-center gap-2">
                  <Upload size={17} className="text-[#E31E24]" /> {t.receipts.addReceipt}
                </h3>
                <button onClick={closeModal} className="w-8 h-8 rounded-full bg-[#F0F0F0] dark:bg-[#2A2A2A] flex items-center justify-center text-[#8E8E93]">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4 space-y-4 min-h-0">
              {uploadSuccess ? (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex flex-col items-center justify-center py-10 gap-4"
                >
                  <div className="w-16 h-16 rounded-full bg-[#E8F8EE] flex items-center justify-center">
                    <CheckCircle size={32} className="text-[#34C759]" />
                  </div>
                  <p className="text-[#111111] dark:text-white text-[17px] font-semibold">{t.receipts.saved}</p>
                  <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[14px]">{t.receipts.savedDesc}</p>
                </motion.div>
              ) : (
                <>
                  <button
                    onClick={loadTestReceipt}
                    className="w-full flex items-center justify-center gap-2 bg-[#FFF0F0] dark:bg-[#E31E24]/15 text-[#E31E24] rounded-2xl py-3 text-[14px] font-medium"
                  >
                    <FlaskConical size={15} /> {t.receipts.testReceipt}
                  </button>

                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-[#E31E24]/30 rounded-2xl p-5 text-center bg-[#FFF0F0] dark:bg-[#E31E24]/10 cursor-pointer"
                  >
                    <input ref={fileInputRef} type="file" accept="image/*,.pdf" className="hidden" onChange={handleFileChange} />
                    {isTestReceipt ? (
                      <div className="flex flex-col items-center">
                        <div className="w-32 h-44 mx-auto mb-2 rounded-xl overflow-hidden shadow-lg bg-white">
                          <ReceiptPreviewSVG />
                        </div>
                        <div className="flex items-center gap-1.5 text-[#34C759]">
                          <CheckCircle size={14} />
                          <span className="text-[12px] font-medium">{t.receipts.testLoaded}</span>
                        </div>
                      </div>
                    ) : previewUrl ? (
                      <div className="flex flex-col items-center">
                        <img src={previewUrl} alt="Receipt preview" className="w-32 h-44 mx-auto mb-2 object-cover rounded-xl shadow-lg" />
                        <div className="flex items-center gap-1.5 text-[#34C759]">
                          <CheckCircle size={14} />
                          <span className="text-[12px] font-medium">{uploadedFile?.name}</span>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <FileImage size={28} className="text-[#E31E24] mx-auto mb-2" />
                        <p className="text-[#111111] dark:text-white text-[15px] font-medium">{t.receipts.uploadPhoto}</p>
                        <p className="text-[#8E8E93] text-[13px] mt-0.5">{t.receipts.uploadHint}</p>
                        <button type="button" className="mt-3 text-[#E31E24] text-[13px] font-medium border border-[#E31E24] px-5 py-1.5 rounded-xl bg-white dark:bg-transparent">
                          {t.receipts.chooseFile}
                        </button>
                      </div>
                    )}
                  </div>

                  {[
                    { label: t.receipts.shop, key: 'distributor', type: 'text', placeholder: t.receipts.shopPlaceholder },
                    { label: t.receipts.amount, key: 'amount', type: 'text', placeholder: t.receipts.amountPlaceholder },
                  ].map((field) => (
                    <div key={field.key}>
                      <label className="block text-[#6C6C70] dark:text-[#AAAAAA] text-[13px] font-medium mb-1.5">{field.label}</label>
                      <input
                        type={field.type}
                        value={(uploadForm as any)[field.key]}
                        onChange={(e) => setUploadForm({ ...uploadForm, [field.key]: e.target.value })}
                        placeholder={field.placeholder}
                        className="w-full bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E31E24] placeholder-[#8E8E93] transition-colors"
                      />
                    </div>
                  ))}

                  <div>
                    <label className="block text-[#6C6C70] dark:text-[#AAAAAA] text-[13px] font-medium mb-1.5">{t.receipts.purchaseDate}</label>
                    <input
                      type="date"
                      value={uploadForm.upload_date}
                      onChange={(e) => setUploadForm({ ...uploadForm, upload_date: e.target.value })}
                      className="w-full bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E31E24] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[#6C6C70] dark:text-[#AAAAAA] text-[13px] font-medium mb-1.5">{t.receipts.linkTool}</label>
                    <select
                      value={uploadForm.tool_id}
                      onChange={(e) => setUploadForm({ ...uploadForm, tool_id: e.target.value })}
                      className="w-full bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E31E24] transition-colors"
                    >
                      <option value="">{t.receipts.leaveUnassigned}</option>
                      {tools.map((tool) => <option key={tool.id} value={tool.id}>{tool.model}</option>)}
                    </select>
                  </div>
                </>
              )}
            </div>

            {/* Sticky Bottom Buttons */}
            {!uploadSuccess && (
              <div className="flex-shrink-0 px-5 pt-3 pb-8 border-t border-[#F0F0F0] dark:border-[#2A2A2A] bg-white dark:bg-[#1A1A1A] flex gap-3">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-[#F0F0F0] dark:bg-[#2A2A2A] text-[#111111] dark:text-white rounded-2xl py-4 text-[15px] font-semibold active:opacity-70 transition-opacity"
                >
                  {t.receipts.cancel}
                </button>
                <button
                  onClick={handleUpload}
                  disabled={!uploadForm.distributor && !isTestReceipt}
                  className="flex-1 bg-[#E31E24] disabled:bg-[#CCCCCC] text-white rounded-2xl py-4 text-[15px] font-semibold flex items-center justify-center gap-2 active:opacity-80 transition-opacity"
                >
                  <Upload size={15} /> {t.receipts.saveReceipt}
                </button>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
}