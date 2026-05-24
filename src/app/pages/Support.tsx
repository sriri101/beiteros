import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import {
  Send, Bot, ChevronDown, Star,
  ThumbsUp, MapPin, ChevronRight, Lightbulb
} from 'lucide-react';
import { useAppStore, ChatMessage } from '../store/useAppStore';
import { useTranslation } from '../i18n';

const TOOL_RESPONSES: Record<string, string> = {
  default: "I'm your BeiterOS assistant! Ask me anything about your tool — maintenance tips, specs, troubleshooting, or warranty questions. How can I help?",
  battery: "For best battery life: charge in moderate temperatures (10–40°C), avoid storing fully discharged, and use the original BeiterOS charger. Your 18V Li-Ion battery has approximately 500 charge cycles at full capacity.",
  noise: "Unusual noises can indicate: worn motor brushes (grinding sound), loose chuck (rattling), or insufficient lubrication (squealing). Stop using the tool immediately and bring it to an authorized service center.",
  warranty: "Your tool is covered under BeiterOS warranty for manufacturing defects. Keep your purchase receipt and contact us at warranty@beiter-os.com. Service must be performed at an authorized center.",
  maintenance: "Regular maintenance schedule: clean after each use, inspect chuck/blade monthly, lubricate moving parts every 3 months, and get a professional service annually or every 50 hours of use.",
  drill: "Drill troubleshooting: if the drill isn't turning, check battery charge and contact points. For reduced power, clean battery terminals. For overheating, allow 15-min cooling between heavy tasks.",
  saw: "Circular saw safety: always use the blade guard, ensure blade is properly tightened before use, and wait for blade to stop before setting down. Replace blade when it shows signs of wear.",
  grinder: "Angle grinder safety is critical: always wear eye protection and gloves, never remove the guard, use correct disc for the material, and inspect discs for cracks before use.",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes('battery') || lower.includes('charge') || lower.includes('akku')) return TOOL_RESPONSES.battery;
  if (lower.includes('noise') || lower.includes('sound') || lower.includes('vibrat') || lower.includes('geräusch')) return TOOL_RESPONSES.noise;
  if (lower.includes('warranty') || lower.includes('repair') || lower.includes('garantie')) return TOOL_RESPONSES.warranty;
  if (lower.includes('maintenance') || lower.includes('service') || lower.includes('clean') || lower.includes('wartung')) return TOOL_RESPONSES.maintenance;
  if (lower.includes('drill') || lower.includes('chuck') || lower.includes('bohrer')) return TOOL_RESPONSES.drill;
  if (lower.includes('saw') || lower.includes('blade') || lower.includes('säge')) return TOOL_RESPONSES.saw;
  if (lower.includes('grinder') || lower.includes('disc') || lower.includes('spark') || lower.includes('schleifer')) return TOOL_RESPONSES.grinder;
  return TOOL_RESPONSES.default;
}

type SupportTab = 'chat' | 'feedback' | 'suggestions';

export default function Support() {
  const { tools, chatMessages, addChatMessage } = useAppStore();
  const navigate = useNavigate();
  const t = useTranslation();
  const [tab, setTab] = useState<SupportTab>('chat');
  const [selectedToolId, setSelectedToolId] = useState(tools[0]?.id || '');
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [satisfactionTool, setSatisfactionTool] = useState<number>(0);
  const [satisfactionDist, setSatisfactionDist] = useState<number>(0);
  const [toolComment, setToolComment] = useState('');
  const [distComment, setDistComment] = useState('');
  const [reviewStars, setReviewStars] = useState(0);
  const [reviewSaved, setReviewSaved] = useState(false);
  const [suggCategory, setSuggCategory] = useState(t.support.catTools);
  const [suggText, setSuggText] = useState('');
  const [suggSent, setSuggSent] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const selectedTool = tools.find((tool) => tool.id === selectedToolId);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isTyping]);

  useEffect(() => {
    if (chatMessages.length === 0) {
      addChatMessage({
        id: 'init',
        role: 'assistant',
        content: TOOL_RESPONSES.default,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }
  }, []);

  const sendMessage = (text?: string) => {
    const msg = text || input.trim();
    if (!msg) return;
    setInput('');
    addChatMessage({
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    });
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      addChatMessage({
        id: Date.now().toString() + '_r',
        role: 'assistant',
        content: getAIResponse(msg),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      });
    }, 1200);
  };

  const suggestionCategories = [t.support.catTools, t.support.catApp, t.support.catDist];

  return (
    <div className="min-h-screen bg-[#F0F0F0] dark:bg-[#111111] transition-colors duration-300">
      {/* Sub-header */}
      <div className="fixed top-[92px] left-0 right-0 z-30 max-w-md mx-auto bg-white/95 dark:bg-[#1A1A1A]/95 backdrop-blur-md border-b border-[#E0E0E0] dark:border-[#2A2A2A] transition-colors duration-300">
        <div className="flex items-center justify-between px-4 pt-3 pb-2.5">
          <div className="w-16" />
          <h1 className="text-[#111111] dark:text-white text-[17px] font-semibold">{t.support.title}</h1>
          <div className="w-16" />
        </div>

        {/* Segmented Control */}
        <div className="px-4 pb-3">
          <div className="bg-[#E8E8E8] dark:bg-[#2A2A2A] rounded-xl p-1 flex gap-0.5">
            {(['chat', 'feedback', 'suggestions'] as SupportTab[]).map((tabId) => (
              <button
                key={tabId}
                onClick={() => setTab(tabId)}
                className={`flex-1 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                  tab === tabId
                    ? 'bg-white dark:bg-[#1A1A1A] text-[#111111] dark:text-white shadow-sm'
                    : 'text-[#6C6C70] dark:text-[#AAAAAA]'
                }`}
              >
                {tabId === 'chat' ? t.support.chatTab : tabId === 'feedback' ? t.support.reviewTab : t.support.ideasTab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* CHAT — height fills viewport below global bar; spacer pushes below sub-header */}
      {tab === 'chat' && (
        <div className="flex flex-col" style={{ height: 'calc(100vh - 92px)' }}>
          {/* Spacer = sub-header: title(54) + segmented(50) = 104px */}
          <div style={{ height: 104, flexShrink: 0 }} />
          {selectedTool && (
            <div className="bg-white dark:bg-[#1C1C1E] border-b border-[#E5E5EA] dark:border-[#38383A] px-4 py-3 flex items-center gap-3 transition-colors duration-300">
              <img src={selectedTool.image_url} alt={selectedTool.model} className="w-9 h-9 rounded-xl object-cover" />
              <div className="flex-1">
                <p className="text-[#1D1D1F] dark:text-white text-[13px] font-medium">{selectedTool.model}</p>
                <p className="text-[#8E8E93] text-[11px] font-mono">{selectedTool.serial_number}</p>
              </div>
              <div className="relative">
                <select
                  value={selectedToolId}
                  onChange={(e) => setSelectedToolId(e.target.value)}
                  className="text-[#E31E24] text-[13px] font-medium bg-transparent appearance-none pr-4 focus:outline-none"
                >
                  {tools.map((tool) => (
                    <option key={tool.id} value={tool.id}>{tool.model.split(' ')[0]}</option>
                  ))}
                </select>
                <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 text-[#E31E24] pointer-events-none" />
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {chatMessages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isTyping && (
              <div className="flex items-end gap-2">
                <div className="w-7 h-7 rounded-full bg-[#E31E24] flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl rounded-bl-sm px-4 py-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        animate={{ y: [0, -4, 0] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                        className="w-1.5 h-1.5 bg-[#8E8E93] rounded-full"
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          <div className="px-4 pb-2">
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {t.support.quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => sendMessage(reply)}
                  className="flex-shrink-0 bg-white dark:bg-[#1C1C1E] text-[#1D1D1F] dark:text-white text-[12px] font-medium px-3 py-1.5 rounded-full border border-[#E5E5EA] dark:border-[#38383A] whitespace-nowrap transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="bg-white/90 dark:bg-[#1C1C1E]/90 backdrop-blur-md border-t border-[#E5E5EA] dark:border-[#38383A] px-4 py-3 flex items-center gap-3">
            <input
              type="text"
              placeholder={t.support.askTool}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className="flex-1 bg-[#F0F0F0] dark:bg-[#2A2A2A] rounded-2xl px-4 py-2.5 text-[15px] text-[#111111] dark:text-white focus:outline-none focus:ring-2 focus:ring-[#E31E24] placeholder-[#8E8E93] transition-colors"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim()}
              className="w-10 h-10 rounded-full bg-[#E31E24] flex items-center justify-center disabled:opacity-40 transition-opacity"
            >
              <Send size={15} className="text-white" />
            </button>
          </div>
        </div>
      )}

      {/* FEEDBACK */}
      {tab === 'feedback' && (
        <div className="px-4 pt-[104px] pb-5 space-y-4">
          {/* Tool Selector */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 transition-colors duration-300">
            <p className="text-[#6C6C70] dark:text-[#98989D] text-[11px] font-semibold uppercase tracking-wide mb-3">{t.support.reviewing}</p>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => setSelectedToolId(tool.id)}
                  className={`flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                    selectedToolId === tool.id ? 'border-[#E31E24] bg-[#FFF0F0] dark:bg-[#E31E24]/15' : 'border-[#E5E5EA] dark:border-[#38383A]'
                  }`}
                >
                  <img src={tool.image_url} alt={tool.model} className="w-8 h-8 rounded-lg object-cover" />
                  <span className="text-[#1D1D1F] dark:text-white text-[12px] font-medium whitespace-nowrap">{tool.model.split(' ').slice(-2).join(' ')}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-4 space-y-4 transition-colors duration-300">
            <p className="text-[#1D1D1F] dark:text-white text-[15px] font-semibold">{t.support.overallRating}</p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} onClick={() => setReviewStars(n)}>
                  <Star size={28} className={n <= reviewStars ? 'text-[#FF9500] fill-[#FF9500]' : 'text-[#C7C7CC] dark:text-[#48484A]'} />
                </button>
              ))}
            </div>

            <div>
              <p className="text-[#6C6C70] dark:text-[#98989D] text-[13px] font-medium mb-2">{t.support.toolPerformance}</p>
              <div className="flex gap-1.5 flex-wrap">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setSatisfactionTool(n)}
                    className="w-8 h-8 rounded-xl text-[12px] font-semibold transition-all"
                    style={{
                      backgroundColor: satisfactionTool === n ? '#111111' : n <= satisfactionTool ? '#E31E24' : '#F0F0F0',
                      color: n <= satisfactionTool ? 'white' : '#6C6C70',
                    }}
                  >{n}</button>
                ))}
              </div>
            </div>

            <div>
              <p className="text-[#6C6C70] dark:text-[#98989D] text-[13px] font-medium mb-2">{t.support.distributorExp}</p>
              <div className="flex gap-1.5 flex-wrap">
                {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => (
                  <button key={n} onClick={() => setSatisfactionDist(n)}
                    className="w-8 h-8 rounded-xl text-[12px] font-semibold transition-all"
                    style={{
                      backgroundColor: satisfactionDist === n ? '#111111' : n <= satisfactionDist ? '#E31E24' : '#F0F0F0',
                      color: n <= satisfactionDist ? 'white' : '#6C6C70',
                    }}
                  >{n}</button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[#6C6C70] dark:text-[#98989D] text-[13px] font-medium mb-1.5">{t.support.toolReview}</label>
              <textarea value={toolComment} onChange={(e) => setToolComment(e.target.value)} placeholder={t.support.toolReviewPlaceholder} rows={3}
                className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl px-4 py-3 text-[14px] text-[#1D1D1F] dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#00AEEF] placeholder-[#8E8E93] transition-colors"
              />
            </div>

            <div>
              <label className="block text-[#6C6C70] dark:text-[#98989D] text-[13px] font-medium mb-1.5">{t.support.distributorReview}</label>
              <textarea value={distComment} onChange={(e) => setDistComment(e.target.value)} placeholder={t.support.distReviewPlaceholder} rows={3}
                className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl px-4 py-3 text-[14px] text-[#1D1D1F] dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#00AEEF] placeholder-[#8E8E93] transition-colors"
              />
            </div>

            {reviewSaved ? (
              <div className="flex items-center gap-2 text-[#34C759] text-[14px] font-semibold">
                <ThumbsUp size={16} /> {t.support.reviewSubmitted}
              </div>
            ) : (
              <button onClick={() => setReviewSaved(true)} disabled={!reviewStars}
                className="w-full bg-[#00AEEF] disabled:bg-[#C7C7CC] text-white text-[16px] font-semibold py-4 rounded-2xl transition-colors"
              >
                {t.support.submitReview}
              </button>
            )}
          </div>
        </div>
      )}

      {/* SUGGESTIONS */}
      {tab === 'suggestions' && (
        <div className="px-4 pt-[104px] pb-5 space-y-4">
          <div className="bg-white dark:bg-[#1C1C1E] rounded-2xl p-5 transition-colors duration-300">
            <div className="flex items-center gap-2 mb-1">
              <Lightbulb size={18} className="text-[#FF9500]" />
              <h2 className="text-[#1D1D1F] dark:text-white text-[17px] font-semibold">{t.support.shareIdeas}</h2>
            </div>
            <p className="text-[#6C6C70] dark:text-[#98989D] text-[13px] mb-5">{t.support.helpUsImprove}</p>

            <div className="mb-4">
              <label className="block text-[#6C6C70] dark:text-[#98989D] text-[13px] font-medium mb-2">{t.support.category}</label>
              <div className="flex flex-wrap gap-2">
                {suggestionCategories.map((cat) => (
                  <button key={cat} onClick={() => setSuggCategory(cat)}
                    className="px-4 py-2 rounded-full text-[13px] font-medium border-2 transition-all"
                    style={{
                      borderColor: suggCategory === cat ? '#E31E24' : '#E5E5EA',
                      backgroundColor: suggCategory === cat ? '#FFF0F0' : 'transparent',
                      color: suggCategory === cat ? '#E31E24' : '#6C6C70',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-[#6C6C70] dark:text-[#98989D] text-[13px] font-medium mb-1.5">{t.support.yourSuggestion}</label>
              <textarea value={suggText} onChange={(e) => setSuggText(e.target.value)} placeholder={t.support.suggPlaceholder} rows={5}
                className="w-full bg-[#F2F2F7] dark:bg-[#2C2C2E] rounded-xl px-4 py-3 text-[14px] text-[#1D1D1F] dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-[#00AEEF] placeholder-[#8E8E93] transition-colors"
              />
              <p className="text-[#8E8E93] text-[11px] mt-1">{suggText.length}/500</p>
            </div>

            {suggSent ? (
              <div className="bg-[#E8F8EE] dark:bg-[#34C759]/15 rounded-2xl p-4 flex items-center gap-3">
                <ThumbsUp size={20} className="text-[#34C759]" />
                <div>
                  <p className="text-[#34C759] text-[15px] font-semibold">{t.support.suggSent}</p>
                  <p className="text-[#6C6C70] dark:text-[#98989D] text-[13px]">{t.support.suggSentDesc}</p>
                </div>
              </div>
            ) : (
              <button onClick={() => { if (suggText.trim()) setSuggSent(true); }} disabled={!suggText.trim()}
                className="w-full bg-[#00AEEF] disabled:bg-[#C7C7CC] text-white text-[16px] font-semibold py-4 rounded-2xl transition-colors"
              >
                {t.support.submitSuggestion}
              </button>
            )}
          </div>

          <button onClick={() => navigate('/app/service-locator')}
            className="w-full bg-white dark:bg-[#1A1A1A] rounded-2xl p-4 flex items-center gap-3 text-left active:bg-[#F0F0F0] dark:active:bg-[#2A2A2A] transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#FFF0F0] dark:bg-[#E31E24]/15 flex items-center justify-center">
              <MapPin size={18} className="text-[#E31E24]" />
            </div>
            <div className="flex-1">
              <p className="text-[#111111] dark:text-white text-[15px] font-medium">{t.support.findServiceCenter}</p>
              <p className="text-[#6C6C70] dark:text-[#AAAAAA] text-[13px]">{t.support.locateRepair}</p>
            </div>
            <ChevronRight size={15} className="text-[#CCCCCC] dark:text-[#3A3A3A]" />
          </button>
        </div>
      )}
    </div>
  );
}

function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className={`flex items-end gap-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {!isUser && (
        <div className="w-7 h-7 rounded-full bg-[#E31E24] flex items-center justify-center flex-shrink-0">
          <Bot size={14} className="text-white" />
        </div>
      )}
      <div className="max-w-[78%]">
        <div className={`px-4 py-3 rounded-2xl text-[14px] leading-relaxed ${
          isUser
            ? 'bg-[#E31E24] text-white rounded-br-sm'
            : 'bg-white dark:bg-[#1A1A1A] text-[#111111] dark:text-white rounded-bl-sm'
        }`}>
          {message.content}
        </div>
        <p className={`text-[#8E8E93] text-[10px] mt-1 ${isUser ? 'text-right' : 'text-left'}`}>{message.timestamp}</p>
      </div>
    </motion.div>
  );
}