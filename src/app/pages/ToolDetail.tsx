import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { motion } from 'motion/react';
import {
  ChevronLeft, Shield, Wrench, Receipt, FileText, AlertTriangle,
  CheckCircle, Clock, Download, ShoppingBag, Star, ChevronRight,
  AlertOctagon, Zap
} from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import { useTranslation } from '../i18n';

type Tab = 'overview' | 'warranty' | 'maintenance' | 'receipts' | 'documents';

export default function ToolDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tools, receipts, reportStolen, setToolSatisfaction } = useAppStore();
  const t = useTranslation();
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [showStolenConfirm, setShowStolenConfirm] = useState(false);
  const [satisfactionScore, setSatisfactionScore] = useState<number | null>(null);
  const [satisfactionSaved, setSatisfactionSaved] = useState(false);

  const tool = tools.find((tool) => tool.id === id);
  if (!tool) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F0F0F0] dark:bg-[#111111]">
        <div className="text-center px-6">
          <p className="text-[#111111] dark:text-white text-[16px] font-semibold">{t.toolDetail.toolNotFound}</p>
          <button onClick={() => navigate('/app/tools')} className="text-[#E31E24] mt-3 text-[15px]">{t.toolDetail.backToToolbox}</button>
        </div>
      </div>
    );
  }

  const toolReceipts = receipts.filter((r) => r.tool_id === tool.id);
  const score = satisfactionScore ?? tool.satisfaction_score;

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: t.toolDetail.overview, icon: Zap },
    { id: 'warranty', label: t.toolDetail.warranty, icon: Shield },
    { id: 'maintenance', label: t.toolDetail.maint, icon: Wrench },
    { id: 'receipts', label: t.toolDetail.receipts, icon: Receipt },
    { id: 'documents', label: t.toolDetail.docs, icon: FileText },
  ];

  const warrantyStatus: Record<string, string> = {
    active: t.common.warrantyActive,
    expiring: t.common.warrantyExpiring,
    expired: t.common.warrantyExpired,
  };
  const warrantyStyles: Record<string, { bg: string; text: string }> = {
    active: { bg: '#E8F8EE', text: '#1A8A4A' },
    expiring: { bg: '#FFF3E0', text: '#B97A00' },
    expired: { bg: '#FFEEEE', text: '#C0392B' },
  };
  const maintStatus: Record<string, string> = {
    ok: t.common.maintOk,
    due: t.common.maintDue,
    overdue: t.common.maintOverdue,
  };
  const maintStyles: Record<string, { bg: string; text: string }> = {
    ok: { bg: '#E8F8EE', text: '#1A8A4A' },
    due: { bg: '#FFF3E0', text: '#B97A00' },
    overdue: { bg: '#FFEEEE', text: '#C0392B' },
  };
  const ws = warrantyStyles[tool.warranty_status] || warrantyStyles.expired;
  const ms = maintStyles[tool.maintenance_status] || maintStyles.ok;

  return (
    <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#111111] transition-colors duration-300">
      {/* Hero */}
      <div className="relative">
        <img src={tool.image_url} alt={tool.model} className="w-full h-56 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

        {/* Nav overlay */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 pt-12 pb-3">
          <button
            onClick={() => navigate('/app/tools')}
            className="flex items-center gap-1 text-white active:opacity-60 transition-opacity"
          >
            <ChevronLeft size={20} strokeWidth={2.5} />
            <span className="text-[15px]">{t.tools.myToolbox}</span>
          </button>
          {tool.is_stolen && (
            <div className="bg-[#E31E24] text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
              <AlertOctagon size={11} /> {t.toolDetail.reportedStolenBadge}
            </div>
          )}
        </div>

        {/* Hero info */}
        <div className="absolute bottom-4 left-4 right-4">
          <p className="text-[#E31E24] text-[11px] font-bold uppercase tracking-widest">{tool.brand} · {tool.category}</p>
          <h1 className="text-white text-[20px] font-bold leading-tight mt-0.5">{tool.model}</h1>
          <p className="text-white/60 text-[12px] font-mono mt-0.5">{tool.serial_number}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#E0E0E0] dark:border-[#2A2A2A] sticky top-[92px] z-10 transition-colors duration-300">
        <div className="flex overflow-x-auto scrollbar-hide">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 flex flex-col items-center gap-0.5 px-5 py-3 text-[10px] font-semibold border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-[#E31E24] text-[#E31E24]'
                  : 'border-transparent text-[#8E8E93]'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-5">
        {/* OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-4">
            {/* Status badges */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-[12px] font-semibold px-3 py-1 rounded-full" style={ws}>{warrantyStatus[tool.warranty_status]}</span>
              <span className="text-[12px] font-semibold px-3 py-1 rounded-full" style={ms}>{maintStatus[tool.maintenance_status]}</span>
            </div>

            {/* Specs */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
              <div className="px-4 py-3 border-b border-[#F0F0F0] dark:border-[#2A2A2A]">
                <p className="text-[#111111] dark:text-white text-[15px] font-semibold">{t.toolDetail.specifications}</p>
              </div>
              {Object.entries(tool.specs).map(([key, val], i, arr) => (
                <div key={key} className={`flex justify-between items-center px-4 py-3 ${i < arr.length - 1 ? 'border-b border-[#F0F0F0] dark:border-[#2A2A2A]' : ''}`}>
                  <span className="text-[#6C6C70] dark:text-[#AAAAAA] text-[14px]">{key}</span>
                  <span className="text-[#111111] dark:text-white text-[14px] font-medium">{val}</span>
                </div>
              ))}
            </div>

            {/* Battery Platform */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 transition-colors duration-300">
              <p className="text-[#111111] dark:text-white text-[15px] font-semibold mb-3">{t.toolDetail.batteryPlatform}</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] dark:bg-[#E31E24]/15 flex items-center justify-center">
                  <Zap size={18} className="text-[#E31E24]" />
                </div>
                <div>
                  <p className="text-[#111111] dark:text-white text-[15px] font-semibold">{tool.battery_platform}</p>
                  <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px]">{t.toolDetail.compatibleWith}</p>
                </div>
              </div>
            </div>

            {/* Satisfaction */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 transition-colors duration-300">
              <p className="text-[#111111] dark:text-white text-[15px] font-semibold mb-1">{t.toolDetail.yourSatisfaction}</p>
              <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px] mb-3">{t.toolDetail.ratePerf}</p>
              <div className="flex gap-1.5 flex-wrap mb-3">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button
                    key={n}
                    onClick={() => setSatisfactionScore(n)}
                    className="w-8 h-8 rounded-xl text-[12px] font-semibold transition-all"
                    style={{
                      backgroundColor: score === n ? '#111111' : score !== null && n <= score ? '#E31E24' : '#F0F0F0',
                      color: (score !== null && n <= score) || score === n ? 'white' : '#6C6C70',
                    }}
                  >
                    {n}
                  </button>
                ))}
              </div>
              {satisfactionScore !== null && !satisfactionSaved && (
                <button
                  onClick={() => { setToolSatisfaction(tool.id, satisfactionScore); setSatisfactionSaved(true); }}
                  className="bg-[#E31E24] text-white text-[13px] font-semibold px-4 py-2 rounded-xl"
                >
                  {t.toolDetail.saveRating}
                </button>
              )}
              {satisfactionSaved && (
                <p className="text-[#34C759] text-[13px] font-semibold flex items-center gap-1">
                  <CheckCircle size={13} /> {t.toolDetail.ratingSaved}
                </p>
              )}
            </div>

            {/* Compatible Accessories */}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
              <div className="px-4 py-3 border-b border-[#F0F0F0] dark:border-[#2A2A2A]">
                <p className="text-[#111111] dark:text-white text-[15px] font-semibold">{t.toolDetail.compatibleAccessories}</p>
              </div>
              {tool.compatible_accessories.map((acc, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 px-4 py-3 ${i < tool.compatible_accessories.length - 1 ? 'border-b border-[#F0F0F0] dark:border-[#2A2A2A]' : ''}`}
                >
                  <ShoppingBag size={15} className="text-[#E31E24]" />
                  <span className="text-[#111111] dark:text-white text-[14px] flex-1">{acc}</span>
                  <ChevronRight size={15} className="text-[#CCCCCC] dark:text-[#3A3A3A]" />
                </div>
              ))}
            </div>

            {/* Report Stolen */}
            {!tool.is_stolen ? (
              <button
                onClick={() => setShowStolenConfirm(true)}
                className="w-full border border-[#E31E24] text-[#E31E24] rounded-2xl py-3.5 text-[15px] font-semibold flex items-center justify-center gap-2 active:opacity-60 transition-opacity"
              >
                <AlertOctagon size={16} /> {t.toolDetail.reportStolen}
              </button>
            ) : (
              <div className="bg-[#FFEEEE] dark:bg-[#E31E24]/15 rounded-2xl p-4 flex items-center gap-3">
                <AlertOctagon size={18} className="text-[#E31E24]" />
                <div>
                  <p className="text-[#E31E24] text-[15px] font-semibold">{t.toolDetail.reportedStolenLabel}</p>
                  <p className="text-[#E31E24]/70 text-[13px]">{t.toolDetail.serialFlagged}</p>
                </div>
              </div>
            )}

            {showStolenConfirm && (
              <div className="fixed inset-0 bg-black/50 z-50 flex items-end justify-center px-4 pb-8">
                <motion.div
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="bg-white dark:bg-[#1A1A1A] rounded-3xl p-6 w-full max-w-sm"
                >
                  <AlertOctagon size={32} className="text-[#E31E24] mb-3" />
                  <h3 className="text-[#111111] dark:text-white text-[17px] font-bold mb-2">{t.toolDetail.reportStolenTitle}</h3>
                  <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[14px] mb-5">
                    {t.toolDetail.reportStolenDesc} <strong className="font-mono text-[#111111] dark:text-white">{tool.serial_number}</strong> {t.toolDetail.reportStolenDesc2}
                  </p>
                  <div className="flex gap-3">
                    <button onClick={() => setShowStolenConfirm(false)} className="flex-1 bg-[#F0F0F0] dark:bg-[#2A2A2A] text-[#111111] dark:text-white rounded-2xl py-3 text-[15px] font-semibold">{t.common.cancel}</button>
                    <button onClick={() => { reportStolen(tool.id); setShowStolenConfirm(false); }} className="flex-1 bg-[#E31E24] text-white rounded-2xl py-3 text-[15px] font-semibold">{t.common.confirm}</button>
                  </div>
                </motion.div>
              </div>
            )}
          </div>
        )}

        {/* WARRANTY */}
        {activeTab === 'warranty' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
              <div className="px-4 py-4 border-b border-[#F0F0F0] dark:border-[#2A2A2A] flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ backgroundColor: ws.bg }}>
                  <Shield size={22} style={{ color: ws.text }} />
                </div>
                <div>
                  <p className="text-[#111111] dark:text-white text-[15px] font-semibold">{t.toolDetail.warrantyStatus}</p>
                  <span className="text-[12px] font-semibold px-2 py-0.5 rounded-full" style={ws}>{warrantyStatus[tool.warranty_status]}</span>
                </div>
              </div>
              {[
                { label: t.toolDetail.purchaseDate, value: tool.purchase_date },
                { label: t.toolDetail.warrantyStart, value: tool.warranty_start },
                { label: t.toolDetail.warrantyEnd, value: tool.warranty_end },
                { label: t.toolDetail.extensionApplied, value: tool.extension_applied ? t.toolDetail.extensionYes : t.toolDetail.extensionNo },
                { label: t.toolDetail.distributor, value: tool.distributor },
              ].map(({ label, value }, i, arr) => (
                <div key={label} className={`flex justify-between items-center px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-[#F0F0F0] dark:border-[#2A2A2A]' : ''}`}>
                  <span className="text-[#6C6C70] dark:text-[#AAAAAA] text-[14px]">{label}</span>
                  <span className="text-[#111111] dark:text-white text-[14px] font-medium">{value}</span>
                </div>
              ))}
            </div>
            {!tool.extension_applied && (
              <div className="bg-[#FFF0F0] dark:bg-[#E31E24]/10 rounded-2xl p-4 border border-[#E31E24]/20">
                <p className="text-[#111111] dark:text-white text-[15px] font-semibold mb-1">{t.toolDetail.extendWarranty}</p>
                <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px] mb-3">{t.toolDetail.extendDesc}</p>
                <button className="bg-[#E31E24] text-white text-[14px] font-semibold px-5 py-2.5 rounded-2xl">
                  {t.toolDetail.activateExtension}
                </button>
              </div>
            )}
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 transition-colors duration-300">
              <p className="text-[#111111] dark:text-white text-[15px] font-semibold mb-3">{t.toolDetail.warrantyTerms}</p>
              <div className="space-y-2.5 text-[13px] text-[#6C6C70] dark:text-[#AAAAAA] leading-relaxed">
                {[t.toolDetail.term1, t.toolDetail.term2, t.toolDetail.term3, t.toolDetail.term4, t.toolDetail.term5].map((term, i) => (
                  <p key={i}>{term}</p>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* MAINTENANCE */}
        {activeTab === 'maintenance' && (
          <div className="space-y-4">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
              <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F0F0F0] dark:border-[#2A2A2A]">
                <p className="text-[#111111] dark:text-white text-[15px] font-semibold">{t.toolDetail.nextMaintenance}</p>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={ms}>{tool.maintenance_status.toUpperCase()}</span>
              </div>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <Clock size={18} className="text-[#E31E24]" />
                <div>
                  <p className="text-[#111111] dark:text-white text-[15px] font-medium">{tool.next_maintenance}</p>
                  <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px]">{t.toolDetail.scheduledMaint}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
              <div className="px-4 py-3.5 border-b border-[#F0F0F0] dark:border-[#2A2A2A]">
                <p className="text-[#111111] dark:text-white text-[15px] font-semibold">{t.toolDetail.maintHistory}</p>
              </div>
              {tool.maintenance_log.length === 0 ? (
                <div className="py-10 text-center">
                  <Wrench size={28} className="text-[#CCCCCC] dark:text-[#3A3A3A] mx-auto mb-2" />
                  <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[14px]">{t.toolDetail.noMaintRecords}</p>
                </div>
              ) : (
                tool.maintenance_log.map((log, i) => (
                  <div key={i} className={`px-4 py-3.5 ${i < tool.maintenance_log.length - 1 ? 'border-b border-[#F0F0F0] dark:border-[#2A2A2A]' : ''}`}>
                    <div className="flex items-start justify-between">
                      <p className="text-[#111111] dark:text-white text-[14px] font-medium">{log.type}</p>
                      <span className="text-[#8E8E93] text-[12px]">{log.date}</span>
                    </div>
                    <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px] mt-0.5">{log.notes}</p>
                    <p className="text-[#E31E24] text-[12px] mt-0.5">{t.common.by} {log.technician}</p>
                  </div>
                ))
              )}
            </div>

            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
              <div className="px-4 py-3.5 border-b border-[#F0F0F0] dark:border-[#2A2A2A]">
                <p className="text-[#111111] dark:text-white text-[15px] font-semibold">{t.toolDetail.maintChecklist}</p>
              </div>
              {[t.toolDetail.check1, t.toolDetail.check2, t.toolDetail.check3, t.toolDetail.check4, t.toolDetail.check5, t.toolDetail.check6].map((item, i, arr) => (
                <div key={i} className={`flex items-center gap-3 px-4 py-3 ${i < arr.length - 1 ? 'border-b border-[#F0F0F0] dark:border-[#2A2A2A]' : ''}`}>
                  <div className="w-4 h-4 rounded border-2 border-[#CCCCCC] dark:border-[#3A3A3A] flex-shrink-0" />
                  <span className="text-[#111111] dark:text-white text-[14px]">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* RECEIPTS */}
        {activeTab === 'receipts' && (
          <div className="space-y-3">
            {toolReceipts.length === 0 ? (
              <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl py-12 text-center transition-colors duration-300">
                <Receipt size={32} className="text-[#CCCCCC] dark:text-[#3A3A3A] mx-auto mb-3" />
                <p className="text-[#111111] dark:text-white text-[16px] font-semibold">{t.toolDetail.noReceiptsLinked}</p>
                <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[14px] mt-1">{t.toolDetail.uploadFromVault}</p>
                <button onClick={() => navigate('/app/receipts')} className="mt-4 bg-[#E31E24] text-white text-[14px] font-semibold px-5 py-2.5 rounded-2xl">
                  {t.toolDetail.goToVault}
                </button>
              </div>
            ) : (
              toolReceipts.map((r) => (
                <div key={r.id} className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3 transition-colors duration-300">
                  <div className="w-12 h-12 rounded-xl bg-[#FFF0F0] dark:bg-[#E31E24]/15 flex items-center justify-center flex-shrink-0">
                    <Receipt size={20} className="text-[#E31E24]" />
                  </div>
                  <div className="flex-1">
                    <p className="text-[#111111] dark:text-white text-[15px] font-medium">{r.distributor}</p>
                    <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px]">{r.upload_date} · {r.amount}</p>
                  </div>
                  <button className="text-[#E31E24]"><Download size={16} /></button>
                </div>
              ))
            )}
          </div>
        )}

        {/* DOCUMENTS */}
        {activeTab === 'documents' && (
          <div className="space-y-3">
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
              {tool.documents.map((doc, i) => {
                const docColors: Record<string, { bg: string; color: string }> = {
                  manual: { bg: '#FFF0F0', color: '#E31E24' },
                  guide: { bg: '#E8F8EE', color: '#1A8A4A' },
                  certificate: { bg: '#FFF3E0', color: '#B97A00' },
                };
                const dc = docColors[doc.type] || docColors.manual;
                return (
                  <div key={i} className={`flex items-center gap-3 px-4 py-3.5 ${i < tool.documents.length - 1 ? 'border-b border-[#F0F0F0] dark:border-[#2A2A2A]' : ''}`}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: dc.bg }}>
                      <FileText size={18} style={{ color: dc.color }} />
                    </div>
                    <div className="flex-1">
                      <p className="text-[#111111] dark:text-white text-[14px] font-medium">{doc.name}</p>
                      <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[12px] capitalize">{doc.type} · PDF</p>
                    </div>
                    <button className="flex items-center gap-1 text-[#E31E24] text-[13px] font-medium">
                      <Download size={14} /> {t.common.view}
                    </button>
                  </div>
                );
              })}
            </div>
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 text-center transition-colors duration-300">
              <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px]">
                {t.toolDetail.moreDocs} <span className="text-[#E31E24]">beitertools.com/support</span>
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}