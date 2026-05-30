import React, { useState } from 'react';
import { ScriptItem, ScriptSectionType } from '../types';
import { 
  Flame, Eye, Award, Quote, VolumeX, AlignRight, 
  Sparkles, Save, Edit2, Check, RefreshCw, Plus, Trash2, ArrowUp, ArrowDown 
} from 'lucide-react';

interface ScriptEditorProps {
  script: ScriptItem[];
  onUpdateScript: (updated: ScriptItem[]) => void;
  onAiRewriteItem: (itemId: string, instructions: string) => Promise<void>;
  isModifying: boolean;
  channelName: string;
}

export const TONE_DEFS = {
  mysterious: {
    bg: 'bg-amber-50/80 border-amber-200 text-amber-950 hover:bg-amber-50',
    iconBg: 'bg-amber-100 text-amber-700',
    label: '🟠 غامض وترقب',
    color: '#f97316', // Orange
    icon: Eye
  },
  enthusiastic: {
    bg: 'bg-red-50/80 border-red-200 text-red-950 hover:bg-red-50',
    iconBg: 'bg-red-100 text-red-700',
    label: '🔴 حماسي وإثارة',
    color: '#ef4444', // Red
    icon: Flame
  },
  important: {
    bg: 'bg-blue-50/80 border-blue-200 text-blue-950 hover:bg-blue-50',
    iconBg: 'bg-blue-100 text-blue-700',
    label: '🔵 معلومة وأرقام تاريخية',
    color: '#3b82f6', // Blue
    icon: Award
  },
  quote: {
    bg: 'bg-emerald-50/80 border-emerald-200 text-emerald-950 hover:bg-emerald-50',
    iconBg: 'bg-emerald-100 text-emerald-700',
    label: '🟢 اقتباس مقتطف',
    color: '#10b981', // Green
    icon: Quote
  },
  pause: {
    bg: 'bg-purple-50/80 border-purple-200 text-purple-950 hover:bg-purple-50',
    iconBg: 'bg-purple-100 text-purple-700',
    label: '🟣 وقفة أو مؤثر تفاعلي',
    color: '#a855f7', // Purple
    icon: VolumeX
  },
  normal: {
    bg: 'bg-white border-slate-200 text-slate-800 hover:bg-slate-50/20',
    iconBg: 'bg-slate-100 text-slate-600',
    label: '⚪ سرد اعتيادي',
    color: '#64748b', // Slate
    icon: AlignRight
  }
};

export const ScriptEditor: React.FC<ScriptEditorProps> = ({
  script,
  onUpdateScript,
  onAiRewriteItem,
  isModifying,
  channelName
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [editNote, setEditNote] = useState('');
  
  // Specific item prompt rewrite modal
  const [rewritingId, setRewritingId] = useState<string | null>(null);
  const [rewritePrompt, setRewritePrompt] = useState('');

  // Start in-place editing
  const startEdit = (item: ScriptItem) => {
    setEditingId(item.id);
    setEditText(item.text);
    setEditNote(item.note || '');
  };

  // Save text & note changes locally
  const saveEdit = (id: string) => {
    const updated = script.map(item => {
      if (item.id === id) {
        return { ...item, text: editText, note: editNote };
      }
      return item;
    });
    onUpdateScript(updated);
    setEditingId(null);
  };

  // Quick tone shift
  const handleToneChange = (id: string, type: ScriptSectionType) => {
    const updated = script.map(item => {
      if (item.id === id) {
        return { ...item, type };
      }
      return item;
    });
    onUpdateScript(updated);
  };

  // Remove a block
  const deleteItem = (id: string) => {
    const updated = script.filter(item => item.id !== id);
    onUpdateScript(updated);
  };

  // Move block up or down
  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === script.length - 1) return;
    
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...script];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    onUpdateScript(updated);
  };

  // Add empty block
  const addNewBlock = () => {
    const newBlock: ScriptItem = {
      id: 'custom-' + Date.now() + '-' + Math.random().toString(36).substring(2, 9),
      text: 'اكتب النص الخاص بفقرتك الجديدة هنا بصوت سردي مميز...',
      type: 'normal',
      note: 'توجيه المعلق الصوتي'
    };
    onUpdateScript([...script, newBlock]);
  };

  // Trigger AI Specific Section rewrite
  const handleAiItemRewrite = async (id: string) => {
    if (!rewritePrompt.trim()) return;
    await onAiRewriteItem(id, rewritePrompt);
    setRewritingId(null);
    setRewritePrompt('');
  };

  return (
    <div className="space-y-6">
      {/* Visual Guideline Keys */}
      <div className="bg-slate-50 border border-slate-100 rounded-2xl p-4 md:p-5">
        <h4 className="font-bold text-slate-800 text-xs md:text-sm mb-3">
          مفتاح تحسين الأداء الصوتي (تلوين القراءة والتعبير):
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {Object.entries(TONE_DEFS).map(([key, value]) => {
            const IconComponent = value.icon;
            return (
              <div 
                key={key} 
                className="bg-white border border-slate-150 rounded-xl p-2.5 flex items-center gap-2 shadow-sm text-[11px] md:text-xs font-semibold text-slate-700"
              >
                <span className={`w-6 h-6 rounded-lg ${value.iconBg} flex items-center justify-center shrink-0`}>
                  <IconComponent className="w-3.5 h-3.5" />
                </span>
                <span>{value.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editor Blocks Canvas */}
      <div className="space-y-4">
        {script.map((item, index) => {
          const tone = TONE_DEFS[item.type] || TONE_DEFS.normal;
          const ToneIcon = tone.icon;
          const isEditing = editingId === item.id;
          const isRewriting = rewritingId === item.id;

          return (
            <div
              key={item.id || `item-fallback-${index}`}
              className={`rounded-2xl border-2 transition-all p-4 md:p-5 relative group ${
                isEditing || isRewriting 
                  ? 'bg-slate-50/50 border-amber-400 shadow-md scale-[1.01]' 
                  : tone.bg
              }`}
            >
              {/* Top Meta info, Action Rail */}
              <div className="flex flex-wrap justify-between items-center gap-3 mb-3 pb-3 border-b border-slate-100/60 no-print">
                <div className="flex items-center gap-2">
                  <span className={`w-8 h-8 rounded-xl ${tone.iconBg} flex items-center justify-center shrink-0`}>
                    <ToneIcon className="w-4 h-4" />
                  </span>
                  
                  {/* Select Tone */}
                  <select
                    value={item.type}
                    onChange={(e) => handleToneChange(item.id, e.target.value as ScriptSectionType)}
                    className="bg-white border border-slate-200/80 rounded-lg text-[11px] font-bold text-slate-700 px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-amber-500 cursor-pointer"
                  >
                    {Object.entries(TONE_DEFS).map(([key, val]) => (
                      <option key={key} value={key}>
                        {val.label}
                      </option>
                    ))}
                  </select>

                  <span className="text-[10px] bg-slate-100 text-slate-500 font-bold px-2 py-1 rounded-md font-mono">
                    #{index + 1}
                  </span>
                </div>

                {/* Block Controls */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItem(index, 'up')}
                    disabled={index === 0}
                    title="تحريك لأشير"
                    className="p-1 px-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-40 rounded-lg transition-colors text-xs"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => moveItem(index, 'down')}
                    disabled={index === script.length - 1}
                    title="تحريك لأسفل"
                    className="p-1 px-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-500 disabled:opacity-40 rounded-lg transition-colors text-xs"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  
                  {/* Edit Text */}
                  {!isEditing && (
                    <button
                      onClick={() => startEdit(item)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-bold transition-all"
                    >
                      <Edit2 className="w-3 h-3 text-slate-400" />
                      تعديل النص
                    </button>
                  )}

                  {/* AI rewrite item */}
                  <button
                    onClick={() => setRewritingId(isRewriting ? null : item.id)}
                    className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-bold shadow-sm transition-all"
                  >
                    <Sparkles className="w-3 h-3" />
                    إعادة صياغة ذكية
                  </button>

                  <button
                    onClick={() => deleteItem(item.id)}
                    title="حذف هذه الفقرة"
                    className="p-1.5 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Editing view */}
              {isEditing ? (
                <div className="space-y-4 no-print">
                  <div>
                    <label className="block text-right text-xs font-bold text-slate-500 mb-1.5">
                      نص السكربت أو التعليق:
                    </label>
                    <textarea
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                      rows={4}
                      dir="rtl"
                      className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm md:text-base leading-relaxed text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-y"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-right text-xs font-bold text-slate-500 mb-1.5">
                      توجيه الأداء للمعلق الصوتي (الحالة النفسية وتغير الصوت):
                    </label>
                    <input
                      type="text"
                      value={editNote}
                      onChange={(e) => setEditNote(e.target.value)}
                      placeholder="امثلة: بصوت منخفض جداً، بحماسة ونظرات دهشة..."
                      className="w-full bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold"
                    >
                      إلغاء
                    </button>
                    <button
                      onClick={() => saveEdit(item.id)}
                      className="inline-flex items-center gap-1 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold shadow"
                    >
                      <Save className="w-3.5 h-3.5" />
                      حفظ التغييرات
                    </button>
                  </div>
                </div>
              ) : isRewriting ? (
                <div className="space-y-3 bg-amber-50/50 p-4 rounded-xl border border-amber-200 no-print">
                  <h5 className="font-bold text-amber-900 text-xs flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    تعليمات إعادة الصياغة عبر الذكاء الاصطناعي لهذه الفقرة فقط:
                  </h5>
                  <p className="text-xs text-slate-500">
                    يمكنك إدخال تعديل محدد مثل: "اجعلها أكثر حماساً"، "أضف بضع تفاصيل مشوقة"، "اكتبها بلغة شعرية فصحى..."
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={rewritePrompt}
                      onChange={(e) => setRewritePrompt(e.target.value)}
                      placeholder="امثلة: طوّل الفقرة بمزيد من الإثارة... "
                      className="flex-1 bg-white border border-slate-200 rounded-xl p-2.5 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={() => handleAiItemRewrite(item.id)}
                      disabled={isModifying || !rewritePrompt.trim()}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm disabled:opacity-50"
                    >
                      {isModifying ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                      تعديل
                    </button>
                  </div>
                </div>
              ) : (
                /* Standard Display View with Tooltip guideline */
                <div className="space-y-3">
                  {/* Note block if configured */}
                  {item.note && (
                    <div className="inline-flex items-center gap-1.5 bg-slate-900/5 text-slate-700 px-3 py-1 rounded-lg text-[11px] font-bold border border-slate-950/5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-800 animate-pulse" />
                      توجيه صوتي: {item.note}
                    </div>
                  )}
                  
                  {/* Main speakable speech text */}
                  <p className="text-base md:text-lg leading-relaxed text-slate-900 font-medium whitespace-pre-line text-right">
                    {item.text}
                  </p>
                </div>
              )}

              {/* Channel watermark footer inside blocks */}
              <div className="pt-2.5 mt-3 border-t border-slate-100/40 text-[10px] text-slate-400 font-mono flex justify-between items-center">
                <span>توقيع القناة المدمج: {channelName}</span>
                <span className="text-[9px] print-only inline bg-slate-50 p-1 border">عنصر أداء: {tone.label}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Button to append blank blocks */}
      <button
        onClick={addNewBlock}
        className="w-full py-4 border-2 border-dashed border-slate-200 hover:border-amber-400 hover:bg-amber-50/20 text-slate-500 hover:text-amber-700 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all duration-200 no-print"
      >
        <Plus className="w-4 h-4" />
        إضافة فقرة جديدة يدوياً
      </button>
    </div>
  );
};
