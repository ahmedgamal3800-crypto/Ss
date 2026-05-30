import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { CheckCircle, Loader2, Sparkles, AlertCircle } from 'lucide-react';

interface StepProgressBarProps {
  currentStage: number; // 1 to 7
  isGenerating: boolean;
  error?: string | null;
}

export const GENERATION_STEPS = [
  { id: 1, label: 'تحليل الفكرة والموضوع', percent: 10, desc: 'فهم موضوع القصة، تحديد الحقبة الزمنية ونبرة السرد.' },
  { id: 2, label: 'البحث وجمع المعلومات', percent: 25, desc: 'البحث والاطلاع على المصادر الموثوقة والمراجع المعتمدة.' },
  { id: 3, label: 'التحقق من الروايات وتدقيق التفاصيل', percent: 40, desc: 'مقارنة الأحداث، إزالة الروايات الضعيفة أو المتناقضة.' },
  { id: 4, label: 'بناء الهيكل الدرامي للحلقة', percent: 55, desc: 'إنشاء الهوك، المقدمة، عقدة الأحداث، الذروة والخاتمة.' },
  { id: 5, label: 'صياغة وكتابة السكربت الصوتي', percent: 75, desc: 'كتابة النص بأسلوب الحكواتي الفاخر مع مراعاة طول الوقت.' },
  { id: 6, label: 'تحسين الأداء الصوتي والمراجعة الذكية', percent: 90, desc: 'إضافة تلوينات الأداء للتعليق الصوتي وفحص الأخطاء اللغوية.' },
  { id: 7, label: 'تجهيز ملفات التصدير والحفظ', percent: 100, desc: 'إنشاء تنسيقات الـ PDF الفاخرة وخيارات النسخ والتحميل.' },
];

const FUN_MESSAGES_BY_STEP: Record<number, string[]> = {
  1: [
    'جاري استيعاب الفكرة وفهم غايتها الدرامية...',
    'تحديد الإطار الزمني والرموز الثقافية للقصة...',
    'اختيار نبرة التعليق الصوتي الأنسب لاسم القناة...',
  ],
  2: [
    'جاري تفتيش أمهات الكتب والمراجع التاريخية الموثوقة...',
    'استخراج تفاصيل البيئة، التواريخ والأسماء الحقيقية...',
    'تنظيم بطاقات المعلومات لتأمين مادة علمية فخمة...',
  ],
  3: [
    'جاري إخضاع الروايات لمقارنة تاريخية صارمة...',
    'استبعاد الحشو والمعلومات الواهية لتجنب تكرار المضمون...',
    'ربط الأحداث في قالب تسلسلي منطقي مثير...',
  ],
  4: [
    'تطريز جملة "افتتاحية الهوك" القصيرة لجذب المشاهد في الثواني الأولى...',
    'تنظيم تسلسل الحبكة وتحديد وضع نقطة الارتكاز والذروة...',
    'تأصيل الخاتمة الفاخرة ورسالة الاشتراك ودعوة التفاعل مع اسم القناة...',
  ],
  5: [
    'جاري نسج العبارات وبداية تسطير فصول الرواية الممتعة...',
    'ضبط صياغة العبارات بدقة لتتناسب مع مدة القراءة المحددة...',
    'تجنب التكرار وبناء تشويق ينتقل بسلاسة عبر الفقرات...',
  ],
  6: [
    'تلوين الكلمات (🔴 حماسي، 🟠 غامض، 🔵 مهم، 🟢 مقتبس، 🟣 وقفة صامتة)...',
    'وضع ملاحظات صوتية ذكية لتسهيل عمل المعلق الصوتي وتحسين الأداء الإلقائي...',
    'إجراء تدقيق إملائي لغوي صارم وإزالة أي شوائب ركاكة...',
  ],
  7: [
    'تأكيد جاهزية الإحصائيات (عدد الكلمات، الفقرات ومدة القراءة التقديرية)...',
    'تجهيز ملفات التصدير والحفظ في قاعدة البيانات الخاصة بك لسهولة الرجوع لها...',
    'السكربت جاهز الآن للعرض والتنزيل!',
  ],
};

export const StepProgressBar: React.FC<StepProgressBarProps> = ({
  currentStage,
  isGenerating,
  error,
}) => {
  const [tickerMsg, setTickerMsg] = useState(FUN_MESSAGES_BY_STEP[1][0]);

  useEffect(() => {
    if (!isGenerating) return;
    const messages = FUN_MESSAGES_BY_STEP[currentStage] || FUN_MESSAGES_BY_STEP[1];
    let idx = 0;
    setTickerMsg(messages[0]);

    const interval = setInterval(() => {
      idx = (idx + 1) % messages.length;
      setTickerMsg(messages[idx]);
    }, 4500);

    return () => clearInterval(interval);
  }, [currentStage, isGenerating]);

  if (!isGenerating && !error) return null;

  const activeStepObj = GENERATION_STEPS.find((s) => s.id === currentStage) || GENERATION_STEPS[0];
  const progressPercent = activeStepObj.percent;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm max-w-3xl mx-auto my-8">
      {error ? (
        <div className="text-center py-6">
          <div className="w-12 h-12 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">عذراً، حدث خطأ غير متوقع</h3>
          <p className="text-slate-600 text-sm max-w-md mx-auto leading-relaxed mb-6">
            {error}
          </p>
        </div>
      ) : (
        <div>
          {/* Header Progress text */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-500">
                <Sparkles className="w-5 h-5 animate-pulse" />
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 block font-medium">الذكاء الاصطناعي يعمل الآن</span>
                <h3 className="text-base font-bold text-slate-800">
                  المرحلة {currentStage}: {activeStepObj.label}
                </h3>
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold text-slate-800 tracking-tight">
                {progressPercent}
              </span>
              <span className="text-sm font-bold text-slate-400">%</span>
            </div>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-8 relative">
            <motion.div
              className="h-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.5, ease: 'easeInOut' }}
            />
          </div>

          {/* Live System Log Ticker */}
          <div className="bg-slate-900 text-slate-300 rounded-xl p-4 font-mono text-xs md:text-sm shadow-inner mb-8 flex items-start gap-3 border border-slate-800">
            <Loader2 className="w-4 h-4 text-amber-500 animate-spin shrink-0 mt-0.5" />
            <div className="flex-1 text-right space-y-1">
              <span className="text-amber-500 block font-semibold text-[10px] tracking-wider uppercase">
                [سجل عمليات محرك السكربتات الذكي]
              </span>
              <p className="font-sans leading-relaxed text-slate-200">
                {tickerMsg}
              </p>
            </div>
          </div>

          {/* Vertical Checklist timeline */}
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-400 block pb-1 border-b border-slate-100">
              مخطط مراحل العمل بالترتيب المنهجي:
            </span>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {GENERATION_STEPS.map((step) => {
                const isCompleted = step.id < currentStage;
                const isActive = step.id === currentStage;

                return (
                  <div
                    key={step.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                      isActive
                        ? 'bg-amber-50/50 border-amber-200 shadow-sm'
                        : isCompleted
                        ? 'bg-emerald-50/30 border-emerald-100/60'
                        : 'bg-slate-50/40 border-slate-100'
                    }`}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0" />
                      ) : isActive ? (
                        <Loader2 className="w-5 h-5 text-amber-500 animate-spin shrink-0" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-slate-200 flex items-center justify-center text-[10px] font-bold text-slate-400 bg-white">
                          {step.id}
                        </div>
                      )}
                    </div>
                    <div className="text-right">
                      <h4
                        className={`text-xs md:text-sm font-bold ${
                          isActive
                            ? 'text-amber-800 font-extrabold'
                            : isCompleted
                            ? 'text-slate-600 line-through decoration-emerald-200'
                            : 'text-slate-400'
                        }`}
                      >
                        {step.label}
                      </h4>
                      <p className="text-[11px] text-slate-500 leading-tight mt-0.5">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
