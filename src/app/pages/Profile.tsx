import { useState } from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  ChevronRight, Zap,
  Award, Gift, LogOut, MapPin, Star, Wrench, BookOpen, Shield,
  Copy, Check, Share2, Sun, Moon, Edit3, User
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useAppStore, getLevelName, getNextLevelThreshold } from '../store/useAppStore';
import { useTranslation } from '../i18n';
import { LanguageSelector } from '../components/LanguageSelector';

const COUNTRIES = ['Deutschland', 'Österreich', 'Schweiz', 'Frankreich', 'Niederlande', 'Belgien', 'Polen', 'Italien', 'Spanien', 'Tschechien', 'Other'];
const DISTRIBUTORS = ['Werkhaus Berlin', 'Norbau München', 'Steinbach Köln', 'Krafft Werkzeuge', 'Vogt Werkzeuge', 'Festool Store', 'Milwaukee Tool DE', 'Other'];

const LEVEL_BADGES = [
  { level: 1,  name: 'Newcomer',   icon: '🌱', color: '#94A3B8' },
  { level: 2,  name: 'Hobbyist',   icon: '🔨', color: '#AAAAAA' },
  { level: 3,  name: 'Apprentice', icon: '⚙️', color: '#E31E24' },
  { level: 4,  name: 'Builder',    icon: '🏗️', color: '#C0392B' },
  { level: 5,  name: 'Craftsman',  icon: '🛠️', color: '#B01018' },
  { level: 6,  name: 'Expert',     icon: '⚡', color: '#8B5CF6' },
  { level: 7,  name: 'Master',     icon: '🔥', color: '#F59E0B' },
  { level: 8,  name: 'Pro Builder',icon: '🏆', color: '#F97316' },
  { level: 9,  name: 'Legend',     icon: '💎', color: '#E31E24' },
  { level: 10, name: 'Elite',      icon: '👑', color: '#111111' },
];

function SectionHeader({ label }: { label: string }) {
  return <p className="text-[#6C6C70] dark:text-[#98989D] text-[12px] font-semibold uppercase tracking-wide px-1 mb-2">{label}</p>;
}

export default function Profile() {
  const navigate = useNavigate();
  const { user, setUser, setAuthenticated, tools, tips, darkMode, toggleDarkMode } = useAppStore();
  const t = useTranslation();
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [form, setForm] = useState({ ...user });

  const nextThreshold = getNextLevelThreshold(user.level);
  const prevThreshold = getNextLevelThreshold(user.level - 1) || 0;
  const progress = ((user.points - prevThreshold) / (nextThreshold - prevThreshold)) * 100;
  const referralUrl = `https://beiter-os.com/register?ref=${user.referral_code}`;

  const copyCode = () => {
    navigator.clipboard.writeText(user.referral_code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveProfile = () => {
    setUser(form);
    setEditing(false);
  };

  return (
    <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#111111] transition-colors duration-300">
      {/* Sub-header */}
      <div className="fixed top-[92px] left-0 right-0 z-30 max-w-md mx-auto bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#E0E0E0] dark:border-[#2A2A2A] transition-colors duration-300">
        <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
          <div className="w-16" />
          <h1 className="text-[#111111] dark:text-white text-[17px] font-semibold">{t.profile.myProfile}</h1>
          <button
            onClick={() => setEditing(!editing)}
            className="text-[#E31E24] text-[15px] flex items-center gap-1 active:opacity-60 transition-opacity"
          >
            <Edit3 size={14} />
            {editing ? t.common.cancel : t.profile.editProfile}
          </button>
        </div>
      </div>

      <div className="px-4 pt-[56px] pb-5 space-y-5">
        {/* Avatar + Info Card */}
        <div
          className="relative rounded-2xl p-5 overflow-hidden"
          style={{ background: 'linear-gradient(141deg, #111111 8%, #1A1A1A 50%, #E31E24 92%)' }}
        >
          <div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 200, height: 200, top: -60, right: -40, background: '#E31E24', opacity: 0.15 }}
          />
          <div
            className="absolute rounded-full pointer-events-none"
            style={{ width: 160, height: 160, bottom: -40, left: -40, background: '#E31E24', opacity: 0.10 }}
          />

          <div className="relative flex items-center gap-4 mb-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold">
                {user.name.charAt(0)}
              </div>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#F59E0B] flex items-center justify-center text-xs">
                {LEVEL_BADGES[Math.min(user.level - 1, LEVEL_BADGES.length - 1)]?.icon}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-white text-[18px] font-bold">{user.name}</h2>
              <p className="text-white/60 text-[13px]">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{user.user_type}</span>
                <span className="text-white/50 text-[11px]">{user.country}</span>
              </div>
            </div>
          </div>

          {/* Level Progress */}
          <div className="relative bg-white/10 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Zap size={14} className="text-[#E31E24]" fill="#E31E24" />
                <span className="text-white text-[14px] font-semibold">{getLevelName(user.level)}</span>
                <span className="text-white/50 text-[12px]">· Lv.{user.level}</span>
              </div>
              <span className="text-white text-[15px] font-bold">{user.points.toLocaleString()} {t.common.points}</span>
            </div>
            <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progress, 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-[#E31E24] rounded-full"
              />
            </div>
            <p className="text-white/50 text-[11px] mt-1">
              {(nextThreshold - user.points).toLocaleString()} {t.common.points} to Level {user.level + 1}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-4 gap-2">
          {[
            { label: t.profile.tools,       value: tools.length,                                          icon: Wrench,   color: '#E31E24', bg: '#FFF0F0' },
            { label: t.common.points,        value: `${(user.points / 1000).toFixed(1)}k`,                icon: Zap,      color: '#F59E0B', bg: '#FFF3E0' },
            { label: t.profile.tipsRead,     value: tips.filter(tip => tip.read).length,                  icon: BookOpen, color: '#34C759', bg: '#E8F8EE' },
            { label: t.profile.activeTools,  value: tools.filter(tool => tool.warranty_status === 'active').length, icon: Shield, color: '#6366F1', bg: '#EEF2FF' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-3 text-center transition-colors duration-300">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center mx-auto mb-1.5" style={{ backgroundColor: stat.bg }}>
                <stat.icon size={15} style={{ color: stat.color }} />
              </div>
              <p className="text-[#111111] dark:text-white text-[16px] font-bold">{stat.value}</p>
              <p className="text-[#8E8E93] text-[9px] font-medium leading-tight mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Level Journey */}
        <div>
          <SectionHeader label={t.profile.level} />
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 transition-colors duration-300">
            <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-hide">
              {LEVEL_BADGES.map((badge) => (
                <div
                  key={badge.level}
                  className={`flex-shrink-0 flex flex-col items-center gap-1 w-14 ${badge.level <= user.level ? 'opacity-100' : 'opacity-25'}`}
                >
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-lg border-2"
                    style={{
                      borderColor: badge.level <= user.level ? badge.color : '#E0E0E0',
                      backgroundColor: badge.level === user.level ? badge.color + '20' : 'transparent',
                    }}
                  >
                    {badge.icon}
                  </div>
                  <p className="text-[10px] text-center text-[#8E8E93] leading-tight">{badge.name}</p>
                  {badge.level === user.level && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#E31E24]" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How to Earn Points */}
        <div>
          <SectionHeader label={t.profile.howToEarn} />
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
            {[
              { action: t.profile.actions.completeProfile, pts: '+100 pts', done: user.profile_completed === 100 },
              { action: t.profile.actions.registerTool,   pts: '+500 pts', done: tools.length > 0 },
              { action: t.profile.actions.writeReview,    pts: '+100 pts', done: false },
              { action: t.profile.actions.readTip,        pts: '+25 pts',  done: tips.some(tip => tip.read) },
              { action: t.profile.actions.referFriend,    pts: '+1.000 pts', done: false },
              { action: t.profile.actions.dailyLogin,     pts: '+50 pts/day', done: true },
            ].map((item, i, arr) => (
              <div key={item.action} className={`flex items-center justify-between px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-[#F0F0F0] dark:border-[#2A2A2A]' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-[#E8F8EE] dark:bg-[#34C759]/15' : 'bg-[#F0F0F0] dark:bg-[#2A2A2A]'}`}>
                    {item.done ? <Check size={11} className="text-[#34C759]" /> : <div className="w-1.5 h-1.5 rounded-full bg-[#CCCCCC] dark:bg-[#3A3A3A]" />}
                  </div>
                  <span className="text-[#111111] dark:text-white text-[14px]">{item.action}</span>
                </div>
                <span className="text-[#E31E24] text-[13px] font-semibold">{item.pts}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Referral System */}
        <div>
          <SectionHeader label={t.profile.referralProgram} />
          <div className="bg-[#111111] rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <Gift size={16} className="text-[#E31E24]" />
              <p className="text-white text-[15px] font-semibold">{t.profile.referralProgram}</p>
            </div>
            <p className="text-white/60 text-[13px] mb-4">
              {t.profile.referralDesc} <strong className="text-[#E31E24]">{t.profile.referralPoints}</strong>!
            </p>
            <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between mb-3">
              <div>
                <p className="text-white/50 text-[11px]">{t.profile.yourReferralCode}</p>
                <p className="text-white text-[18px] font-bold font-mono tracking-widest">{user.referral_code}</p>
              </div>
              <button
                onClick={copyCode}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[13px] font-bold transition-all ${copied ? 'bg-[#34C759] text-white' : 'bg-[#E31E24] text-white'}`}
              >
                {copied ? <><Check size={12} /> {t.profile.copied}</> : <><Copy size={12} /> {t.profile.copy}</>}
              </button>
            </div>
            <button
              onClick={() => setShowQR(!showQR)}
              className="w-full flex items-center justify-center gap-2 border border-white/20 rounded-xl py-2.5 text-white text-[13px] font-medium"
            >
              <Share2 size={14} /> {showQR ? t.profile.hideQR : t.profile.showQR}
            </button>
            {showQR && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-3 bg-white rounded-xl p-4 flex flex-col items-center"
              >
                <QRCodeSVG value={referralUrl} size={140} />
                <p className="text-[#6C6C70] text-[10px] mt-2 text-center">{referralUrl}</p>
              </motion.div>
            )}
          </div>
        </div>

        {/* Settings */}
        <div>
          <SectionHeader label="Settings" />
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-[#F0F0F0] dark:border-[#2A2A2A]">
              <span className="text-[#111111] dark:text-white text-[15px]">{t.profile.language}</span>
              <LanguageSelector variant="inline" />
            </div>
            <div className="flex items-center justify-between px-4 py-3.5">
              <div className="flex items-center gap-2">
                {darkMode ? <Moon size={16} className="text-[#E31E24]" /> : <Sun size={16} className="text-[#F59E0B]" />}
                <span className="text-[#111111] dark:text-white text-[15px]">Dark Mode</span>
              </div>
              <button
                onClick={toggleDarkMode}
                className={`relative w-12 h-7 rounded-full transition-colors duration-200 ${darkMode ? 'bg-[#E31E24]' : 'bg-[#E0E0E0] dark:bg-[#2A2A2A]'}`}
              >
                <div className={`absolute top-0.5 w-6 h-6 rounded-full bg-white shadow-md transition-all duration-200`} style={{ left: darkMode ? '22px' : '2px' }} />
              </button>
            </div>
          </div>
        </div>

        {/* Edit Profile Form */}
        {editing ? (
          <div>
            <SectionHeader label={t.profile.editProfile} />
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 space-y-4 transition-colors duration-300">
              {[
                { label: t.profile.name, key: 'name', type: 'text', placeholder: 'Your full name' },
                { label: t.profile.email, key: 'email', type: 'email', placeholder: 'your@email.com' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-[#6C6C70] dark:text-[#AAAAAA] text-[12px] font-medium mb-1.5">{field.label}</label>
                  <input
                    type={field.type}
                    value={(form as any)[field.key]}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E31E24] placeholder-[#8E8E93] transition-colors"
                  />
                </div>
              ))}
              <div>
                <label className="block text-[#6C6C70] dark:text-[#AAAAAA] text-[12px] font-medium mb-1.5">{t.profile.country}</label>
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E31E24] transition-colors"
                >
                  {COUNTRIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[#6C6C70] dark:text-[#AAAAAA] text-[12px] font-medium mb-1.5">{t.profile.iAmA}</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['DIYer', 'Pro'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setForm({ ...form, user_type: type })}
                      className="py-3 rounded-xl text-[14px] font-semibold border-2 transition-all"
                      style={{
                        backgroundColor: form.user_type === type ? '#111111' : 'transparent',
                        color: form.user_type === type ? 'white' : '#111111',
                        borderColor: form.user_type === type ? '#111111' : '#E0E0E0',
                      }}
                    >
                      {type === 'DIYer' ? t.profile.diyerBtn : t.profile.proBtn}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[#6C6C70] dark:text-[#AAAAAA] text-[12px] font-medium mb-1.5">{t.profile.preferredDist}</label>
                <select
                  value={form.preferred_distributor}
                  onChange={(e) => setForm({ ...form, preferred_distributor: e.target.value })}
                  className="w-full bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded-xl px-4 py-3 text-[15px] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E31E24] transition-colors"
                >
                  {DISTRIBUTORS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <button onClick={saveProfile} className="w-full bg-[#E31E24] text-white text-[16px] font-semibold py-4 rounded-2xl">
                {t.profile.saveChanges}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <SectionHeader label={t.profile.accountDetails} />
            <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
              {[
                { label: t.profile.name,          value: user.name },
                { label: t.profile.email,         value: user.email },
                { label: t.profile.country,       value: user.country },
                { label: t.profile.userType,      value: user.user_type },
                { label: t.profile.preferredDist, value: user.preferred_distributor },
              ].map(({ label, value }, i, arr) => (
                <div key={label} className={`flex justify-between items-center px-4 py-3.5 ${i < arr.length - 1 ? 'border-b border-[#F0F0F0] dark:border-[#2A2A2A]' : ''}`}>
                  <span className="text-[#6C6C70] dark:text-[#AAAAAA] text-[14px]">{label}</span>
                  <span className="text-[#111111] dark:text-white text-[14px] font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nav Links */}
        <div>
          <SectionHeader label="More" />
          <div className="bg-white dark:bg-[#1A1A1A] rounded-2xl overflow-hidden transition-colors duration-300">
            {[
              { label: t.profile.receiptVault,   icon: Wrench,   path: '/app/receipts' },
              { label: t.profile.serviceLocator, icon: MapPin,   path: '/app/service-locator' },
              { label: t.profile.dailyTips,      icon: BookOpen, path: '/app/tips' },
            ].map((item, i, arr) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] transition-colors ${i < arr.length - 1 ? 'border-b border-[#F0F0F0] dark:border-[#2A2A2A]' : ''}`}
              >
                <item.icon size={16} className="text-[#E31E24]" />
                <span className="text-[#111111] dark:text-white text-[15px] flex-1">{item.label}</span>
                <ChevronRight size={15} className="text-[#CCCCCC] dark:text-[#3A3A3A]" />
              </button>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          onClick={() => { setAuthenticated(false); navigate('/auth'); }}
          className="w-full bg-white dark:bg-[#1A1A1A] text-[#E31E24] text-[16px] font-semibold py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors"
        >
          <LogOut size={16} /> {t.profile.signOut}
        </button>

        <p className="text-center text-[#8E8E93] text-[12px] pb-2">{t.common.version}</p>
      </div>
    </div>
  );
}