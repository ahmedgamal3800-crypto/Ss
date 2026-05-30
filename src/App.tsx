import React, { useState, useEffect } from 'react';
import { Project, ScriptItem, ScriptSectionType } from './types';
import { StepProgressBar } from './components/StepProgressBar';
import { ProjectList } from './components/ProjectList';
import { ScriptEditor } from './components/ScriptEditor';
import { PrintPreview } from './components/PrintPreview';
import {
  Sparkles,
  Film,
  PlusCircle,
  Copy,
  Download,
  Printer,
  History,
  Info,
  Clock,
  ArrowRightLeft,
  ChevronLeft,
  FileText,
  BookmarkCheck,
  RotateCcw,
  Settings,
  HelpCircle,
  CheckCircle,
  TrendingUp,
  Sliders,
  Play
} from 'lucide-react';

// Pre-populated demo Nabataeans project
const DEMO_PROJECT: Project = {
  id: "demo-nabataeans",
  title: "سر زوال حضارة الأنباط المفقودة",
  contentType: "تاريخي",
  channelName: "رحالة التاريخ",
  duration: 5,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  analysis: {
    era: "القرن الأول قبل الميلاد إلى القرن الثاني الميلادي",
    characters: ["الحارث الرابع", "الإمبراطور ترايانوس", "الملك مالك الثاني"],
    style: "وثائقي غامض وتراجيدي",
    estimatedSize: "حوالي 650 كلمة",
    details: "البحث في لغز اختفاء الأنباط العظيم من عاصمتهم البتراء الوردية بعد قرون من الازدهار والتحكم التام بطرق التجارة القديمة واللبان والتوابل."
  },
  research: {
    sources: ["كتابات المؤرخ الإغريقي سترابو", "النقوش الأثرية النبطية في مدائن صالح", "سجلات سلالة هيرودس الرومانية"],
    timeline: [
      "تأسيس مملكة الأنباط كقوة بدوية مسيطرة على طرق السفر والتجارة الجنوبية.",
      "عهد الملك الحارث الرابع وبناء الخزنة العظيمة والمقابر الشاهقة.",
      "تحول طرق التجارة البحرية وبداية الكساد والقرصنة لسلع دول الجوار.",
      "ضم المملكة رسمياً للإمبراطورية الرومانية عام 106 م وصهرها في الولاية العربية."
    ],
    verification: [
      "تم دحض دواعٍ بحدوث غزو همجي مسألة إبادة جماعية؛ حيث أثبتت النقوش واللقى الأثرية استمرار التجارة والاندماج التدريجي بالرومان.",
      "تقاطع السجلات الطينية بمقابر الحجر أتاح تركيب تسلسل تاريخي دقيق لنقل سلطة الأنباط بسلاسة للرومان."
    ]
  },
  structure: {
    hook: "هل يمكن لمدينة شامخة منحوتة بالكامل في صخر وردي صلب، كانت تحكم ثروات العالم القديم، أن تختفي فجأة دون أن تترك كتاباً واحداً يكشف سرها؟",
    intro: "البتراء، جوهرة الصحراء الخالدة، ملتقى القوافل الأسطورية ومأوى النحاتين العباقرة الذين تحدوا الجاذبية وهزموا قهر القحط.",
    mainBody: "رحلة الأنباط المذهلة من رعاة إبل بسطاء في بادية الشام إلى ملوك الذهب والمياه المحكمة، وكيف طوعوا الصخر لتأمين ينابيع سرية في أشد البقاع قسوة.",
    climax: "عام 106 للميلاد.. عندما أحاطت الفيالق الرومانية بأسوار البتراء الطبيعية، ليس عبر السلاح والبارود، وإنما بخنق مسارب المياه التي تتدفق من وادي موسى.",
    conclusion: "لم يسقط الأنباط بالدماء، وإنما ذابوا تدريجياً داخل التاريخ كحبر على ورق، مخلفين صخوراً صامتة تبوح بكل شيء عدا سر رحيلهم.",
    cta: "هل تعتقد أن الجفاف الفجائي أم المكر الاقتصادي هو السبب الحقيقي لزوالهم؟ شاركنا رأيك في التعليقات واشترك بالقناة للمزيد من فك شفرات التاريخ المجهولة.",
    signature: "كنتم مع رحالة التاريخ، نلقاكم في لغز قادم ومغامرة جديدة."
  },
  script: [
    {
      id: "item-1",
      text: "يقفون اليوم مذهولين أمام صخورها الوردية العملاقة متسائلين.. كيف لمدينة حُفرت تفاصيلها الخالدة في قلب الجبل الصامت أن تتبخر بأكملها من سجلات التاريخ الحي دون أن تترك كتاباً واحداً يروي ما جرى؟",
      type: "mysterious",
      note: "بنبرة هادئة وعميقة تلامس مشاعر المستمع وتجذبه منذ المقطع الأول"
    },
    {
      id: "item-2",
      text: "البتراء، عاصمة الأنباط الأسطورية العظيمة، لم تكن مجرد حضارة عادية. في القرن الأول قبل الميلاد، وتحت حكم الملك العبقري 'الحارث الرابع'، بلغت هذه المملكة ثراءً خيالياً عبر السيطرة المطلقة على دروب اللبان، البخور، الحرير والذهب البرية.",
      type: "important",
      note: "صوت سردي واثق وفخم يتناسب مع قراءة مقطعات الحقائق والتواريخ التاريخية"
    },
    {
      id: "item-3",
      text: "ولكن، كيف لصحراء قاحلة قاسية لا زرع فيها ولا ماء أن تضمن عيش أكثر من ثلاثين ألف نسمة بترف وأمان؟ الجواب يمر عبر أعجوبة لا يصدقها عقل؛ لقد طوع الأنباط الطبيعة، وصنعوا سدوداً وقنوات سرية هائلة مخبأة تحت الصخر، بحيث إذا هطلت زخة مطر وحيدة، حفظوها بعيداً عن أعين الغزاة.",
      type: "normal",
      note: "بصوت تشويقي يشرح الفكر والمناورة الهندسية الرائعة التي ميزت شعب الأنباط"
    },
    {
      id: "item-4",
      text: "كما يخبرنا الجغرافي الإغريقي الشهير 'سترابو' في سجلاته: 'الأنباط قوم مسالمون، ينبذون الهدر ويفرضون الغرامات على من يضيع ثروته، في حين يفخرون بمن يزيد كسبه بالذهب والفضة'.",
      type: "quote",
      note: "بإلقاء رصين مقارب لنبرة قراءة القصص والمقولات التاريخية العتيقة"
    },
    {
      id: "item-5",
      text: "[توقف مهيب لمدة ثلاث ثوانٍ.. ومؤثر نبض غامض أو هبوب رياح الصحراء الصامتة]",
      type: "pause",
      note: "وقفة كاملة لتأصيل الترقب وإتاحة مساحة للمتلقي لاستيعاب الألغاز السابقة"
    },
    {
      id: "item-6",
      text: "لكن الازدهار النبطي جابه منعطفاً مرعباً. ففي عام مائة وستة للميلاد، قرر الرومان تدمير هذه السيادة. لم يستعينوا بفيالق مسلحة، وإنما بخداع تجاري خبيث؛ حولوا مجاري السفن والبضائع لموانئ البحر الأحمر، فتركوا البتراء وحيدة تصارع الكساد والنسيان البطيء.",
      type: "enthusiastic",
      note: "بنبرة حماسية مرتفعة تعبر عن الصراع والمكيدة والتوتر الجيوسياسي المهيب"
    },
    {
      id: "item-7",
      text: "ومع تقدم السنين، ذاب الأنباط في صهير الحضارات الجديدة، وهجر الأهالي بيوتهم العاقرة، لتتحول البتراء من واحة صاخبة تتدفق بالثروة والماء، إلى مدينة وردية صامتة تسكنها فقط رياح الصحراء الحزينة ونقوش الماضي الحاضرة.",
      type: "mysterious",
      note: "بصوت تراجيدي غامض يعيد صدى مشاعر الزوال والغموض للنهاية"
    },
    {
      id: "item-8",
      text: "شكراً لرفقتنا في هذه الرحلة التاريخية عبر دروب الزمن المجهولة. هل تظن أن الجفاف أم تبدل طرق التجارة هو القاتل الفعلي لشعب الأنباط؟ شاركونا آراءكم الغنية في التعليقات، ولا تنسوا الإعجاب والاشترك لمتابعة ألغازنا المقبلة.",
      type: "normal",
      note: "بنبرة دافئة وقريبة تشجع المشاهدين على التعاطي والتفاعل بكتابة الآراء"
    },
    {
      id: "item-9",
      text: "كان معكم 'رحالة التاريخ'.. نراكم في حلقة قادمة ومغامرة مشوقة بإذن الله.",
      "type": "normal",
      "note": "توقيع المذيع الواثق والنهاية الدافئة"
    }
  ],
  "review": {
    "grammar": "تم التدقيق لغوياً ووجدت الصياغة خالية بنسبة 100% من الأخطاء الإملائية أو الركاكة التعبيرية والتركيب صحيح.",
    "timelineFlow": "الترابط الزمني ممتاز يبدأ ببروز قوة التحكم التجاري والمائي إلى السقوط على يد الرومان وصولاً إلى الإخلاء والهروب.",
    "repetitions": "تم تنقيح النص وإفراغه من التكرارات وصقله بمصطلحات وتعبيرات متباينة رائعة.",
    "hookStrength": "الهوك يعتمد على تساؤل تشويقي عميق يضمن استبقاء الزائر وتدفق الإقصاء في الثواني الأولى.",
    "outroStrength": "الخاتمة مصاغة مع دعابات ذكية ومدمج بها اسم القناة Signature بتوقيع طبيعي غير مفتعل.",
    "durationMatch": "السكربت يحتوي 620 كلمة، يطابق قراءة عادية مسترسلة مدتها 4.8 دقيقة تماماً."
  },
  "stats": {
    "wordsCount": 620,
    "readingTime": 4.8,
    "paragraphsCount": 9
  },
  "versions": []
};

export default function App() {
  // Application projects state loaded from LocalStorage
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);

  // Creation/Edit parameters
  const [title, setTitle] = useState('');
  const [contentType, setContentType] = useState('تاريخي');
  const [channelName, setChannelName] = useState('');
  const [duration, setDuration] = useState(5);

  // Running states
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStage, setCurrentStage] = useState(1);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [isModifying, setIsModifying] = useState(false);

  // Modals & Side controls
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const [customInstructions, setCustomInstructions] = useState('');
  const [activeTab, setActiveTab] = useState<'script' | 'structure' | 'analysis' | 'review'>('script');
  const [savedSuccessAlert, setSavedSuccessAlert] = useState<string | null>(null);

  // Load projects on startup
  useEffect(() => {
    const rawData = localStorage.getItem('youtube_script_projects');
    if (rawData) {
      try {
        const parsed = JSON.parse(rawData);
        if (parsed && parsed.length > 0) {
          const sanitized = parsed.map((proj: any) => ({
            ...proj,
            script: (proj.script || []).map((item: any, idx: number) => ({
              ...item,
              id: item.id || `item-sanitized-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`
            }))
          }));
          setProjects(sanitized);
          setSelectedProjectId(sanitized[0].id);
        } else {
          // Initialize with draft Nabataeans
          setProjects([DEMO_PROJECT]);
          setSelectedProjectId(DEMO_PROJECT.id);
          localStorage.setItem('youtube_script_projects', JSON.stringify([DEMO_PROJECT]));
        }
      } catch (e) {
        setProjects([DEMO_PROJECT]);
        setSelectedProjectId(DEMO_PROJECT.id);
      }
    } else {
      setProjects([DEMO_PROJECT]);
      setSelectedProjectId(DEMO_PROJECT.id);
      localStorage.setItem('youtube_script_projects', JSON.stringify([DEMO_PROJECT]));
    }
  }, []);

  const activeProject = projects.find(p => p.id === selectedProjectId);

  // Save specific project change to LocalStorage
  const saveProjectBack = (updatedProj: Project) => {
    const nextList = projects.map(p => p.id === updatedProj.id ? updatedProj : p);
    setProjects(nextList);
    localStorage.setItem('youtube_script_projects', JSON.stringify(nextList));
    showTimedAlert("تم حفظ تحديثات السكربت والمشروع تلقائياً 💾");
  };

  const showTimedAlert = (msg: string) => {
    setSavedSuccessAlert(msg);
    setTimeout(() => {
      setSavedSuccessAlert(null);
    }, 4000);
  };

  // Switch to clean input workspace to start a fresh project
  const handleStartNewProject = () => {
    setSelectedProjectId(null);
    setTitle('');
    setChannelName('');
    setDuration(5);
    setContentType('تاريخي');
    setGenerationError(null);
  };

  // Trigger generator sequence
  const handleInitiateGeneration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !channelName.trim()) {
      alert("يرجى إدخال عنوان الحلقة واسم القناة أولاً!");
      return;
    }

    setIsGenerating(true);
    setCurrentStage(1);
    setGenerationError(null);

    // Dynamic timer indicating realistic steps for building script
    const stageTimers: NodeJS.Timeout[] = [];
    const triggerStageIncrement = (stage: number, delayMs: number) => {
      const t = setTimeout(() => {
        setCurrentStage(stage);
      }, delayMs);
      stageTimers.push(t);
    };

    triggerStageIncrement(1, 100);    // 10%
    triggerStageIncrement(2, 2800);   // 25%
    triggerStageIncrement(3, 5600);   // 40%
    triggerStageIncrement(4, 9400);   // 55%
    triggerStageIncrement(5, 13400);  // 75%
    triggerStageIncrement(6, 17800);  // 90%

    try {
      const response = await fetch('/api/generate-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          contentType,
          channelName,
          duration
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشلت عملية إنشاء السكربت بالذكاء الاصطناعي.');
      }

      const generatedData = await response.json();

      // Clear pending stage simulation timers
      stageTimers.forEach(clearTimeout);
      
      // Complete Stage 7 Animation
      setCurrentStage(7);

      const newProject: Project = {
        id: 'proj-' + Date.now(),
        title: title,
        contentType: contentType,
        channelName: channelName,
        duration: Number(duration),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analysis: generatedData.analysis,
        research: generatedData.research,
        structure: generatedData.structure,
        script: (generatedData.script || []).map((item: any, idx: number) => ({
          ...item,
          id: item.id || `item-gen-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`
        })),
        review: generatedData.review,
        stats: generatedData.stats || {
          wordsCount: (generatedData.script || []).reduce((acc: number, item: any) => acc + (item.text || '').split(' ').length, 0),
          readingTime: Number(duration),
          paragraphsCount: (generatedData.script || []).length
        },
        versions: []
      };

      const updatedProjects = [newProject, ...projects];
      setProjects(updatedProjects);
      setSelectedProjectId(newProject.id);
      localStorage.setItem('youtube_script_projects', JSON.stringify(updatedProjects));
      
      // Small pause to let user witness completed 100% progress
      setTimeout(() => {
        setIsGenerating(false);
        setActiveTab('script');
        showTimedAlert("تهانينا! تم توليد السكربت بالكامل وحفظه بالمحفوظات 🌟");
      }, 1500);

    } catch (err: any) {
      stageTimers.forEach(clearTimeout);
      setIsGenerating(false);
      setGenerationError(err.message || 'حدث خطأ تقني غير متوقع.');
    }
  };

  // Perform continuous editing tweaks (action: lengthen, shorten, general instructions)
  const handleModifyScript = async (action: 'lengthen' | 'shorten' | 'general' | 'rewrite-item', targetItemId?: string) => {
    if (!activeProject) return;

    setIsModifying(true);
    setGenerationError(null);

    const backupVersion = {
      id: 'ver-' + Date.now(),
      timestamp: new Date().toISOString(),
      script: [...activeProject.script],
      stats: { ...activeProject.stats }
    };

    try {
      const response = await fetch('/api/modify-script', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          script: activeProject.script,
          action,
          itemId: targetItemId,
          userInstructions: customInstructions,
          title: activeProject.title,
          contentType: activeProject.contentType,
          channelName: activeProject.channelName,
          duration: activeProject.duration
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'فشلت عملية تعديل وتطوير السكربت.');
      }

      const modResult = await response.json();

      const updatedProject: Project = {
        ...activeProject,
        updatedAt: new Date().toISOString(),
        script: (modResult.script || []).map((item: any, idx: number) => ({
          ...item,
          id: item.id || `item-mod-${idx}-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`
        })),
        stats: modResult.stats || {
          wordsCount: (modResult.script || []).reduce((acc: number, item: any) => acc + (item.text || '').split(' ').length, 0),
          readingTime: modResult.stats?.readingTime || activeProject.duration,
          paragraphsCount: (modResult.script || []).length
        },
        versions: [backupVersion, ...(activeProject.versions || [])]
      };

      saveProjectBack(updatedProject);
      setCustomInstructions('');
      showTimedAlert("تم تطبيق تدقيق وتعديل الذكاء الاصطناعي بنجاح مذهل! ✨");
    } catch (err: any) {
      setGenerationError("فشل التعديل الذكي: " + err.message);
    } finally {
      setIsModifying(false);
    }
  };

  // Trigger Local Item modification (without API)
  const handleLocalScriptChange = (updatedScript: ScriptItem[]) => {
    if (!activeProject) return;

    const updatedWords = updatedScript.reduce((count, item) => count + item.text.trim().split(/\s+/).length, 0);

    const updatedProject: Project = {
      ...activeProject,
      updatedAt: new Date().toISOString(),
      script: updatedScript,
      stats: {
        ...activeProject.stats,
        wordsCount: updatedWords,
        paragraphsCount: updatedScript.length,
        readingTime: parseFloat((updatedWords / 130).toFixed(1))
      }
    };
    saveProjectBack(updatedProject);
  };

  // Revert to historical version/draft
  const handleRevertVersion = (vIndex: number) => {
    if (!activeProject) return;
    const versionToLoad = activeProject.versions[vIndex];
    
    // Save current as version before loading
    const currentBackup = {
      id: 'ver-' + Date.now(),
      timestamp: new Date().toISOString(),
      script: [...activeProject.script],
      stats: { ...activeProject.stats }
    };

    // Filter out the one we are loading to avoid lists cluttering
    const updatedVersions = activeProject.versions.filter((_, idx) => idx !== vIndex);

    const updatedProject: Project = {
      ...activeProject,
      updatedAt: new Date().toISOString(),
      script: versionToLoad.script,
      stats: versionToLoad.stats,
      versions: [currentBackup, ...updatedVersions]
    };

    saveProjectBack(updatedProject);
    showTimedAlert("تم استرداد المسودة التاريخية السابقة وحفظ المشروع الحالي بنجاح 🔄");
  };

  // Export as TXT / Markdown file
  const handleExportTxtFile = () => {
    if (!activeProject) return;

    let content = `=========================================\n`;
    content += `سكربت حلقة: ${activeProject.title}\n`;
    content += `نوع المحتوى: ${activeProject.contentType}\n`;
    content += `قناة الإخراج: ${activeProject.channelName}\n`;
    content += `المدة المقدرة: ${activeProject.stats.readingTime} دقائق (${activeProject.stats.wordsCount} كلمة)\n`;
    content += `تاريخ الاستخراج: ${new Date().toLocaleDateString('ar-EG')}\n`;
    content += `=========================================\n\n`;

    activeProject.script.forEach((item, idx) => {
      let labelType = 'سرد عادي';
      if (item.type === 'mysterious') labelType = 'ترقب وغموض 🟠';
      else if (item.type === 'enthusiastic') labelType = 'إثارة وحماسة 🔴';
      else if (item.type === 'important') labelType = 'معلومة وتواريخ 🔵';
      else if (item.type === 'quote') labelType = 'اقتباس مباشر 🟢';
      else if (item.type === 'pause') labelType = 'وقفة/مؤثر صوتي 🟣';

      content += `[فقرة #${idx + 1} - أداء: ${labelType}]\n`;
      if (item.note) {
        content += `توجيه المعلق الصوتي: (${item.note})\n`;
      }
      content += `${item.text}\n`;
      content += `------------------------------- (توقيع القناة: ${activeProject.channelName})\n\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `سكربت_${activeProject.title.replace(/\s+/g, '_')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
    showTimedAlert("تم تنزيل السكربت بصيغة TXT بنجاح! 📥");
  };

  // Direct clipboard copy
  const handleCopyToClipboard = () => {
    if (!activeProject) return;
    
    const plainText = activeProject.script
      .map((item, idx) => `[فقرة ${idx + 1}] ${item.note ? `(${item.note})\n` : ''}${item.text}`)
      .join('\n\n');

    navigator.clipboard.writeText(plainText).then(() => {
      showTimedAlert("تم نسخ السكربت بالكامل إلى الحافظة بنجاح 📋");
    }).catch(() => {
      alert("فشل النسخ التلقائي للحافظة.");
    });
  };

  // Delete project entirely
  const handleDeleteProject = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const confirmed = window.confirm("هل أنت متأكد تماماً من رغبتك في حذف هذا المشروع نهائياً؟");
    if (!confirmed) return;

    const remaining = projects.filter(p => p.id !== id);
    setProjects(remaining);
    localStorage.setItem('youtube_script_projects', JSON.stringify(remaining));

    if (selectedProjectId === id) {
      if (remaining.length > 0) {
        setSelectedProjectId(remaining[0].id);
      } else {
        setSelectedProjectId(null);
      }
    }
    showTimedAlert("تم حذف السكربت من التاريخ والمحفوظات 🗑️");
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16 pt-6 px-4 md:px-8 max-w-7xl mx-auto space-y-6" style={{ direction: 'rtl' }}>
      
      {/* Dynamic Saving Notification alert */}
      {savedSuccessAlert && (
        <div className="fixed bottom-6 right-6 bg-slate-900 border border-slate-800 text-amber-400 font-bold px-5 py-3 rounded-xl shadow-2xl z-50 flex items-center gap-2.5 text-xs md:text-sm animate-bounce">
          <CheckCircle className="w-5 h-5 text-emerald-500" />
          <span>{savedSuccessAlert}</span>
        </div>
      )}

      {/* Main Header visual */}
      <header className="bg-gradient-to-r from-amber-600 via-orange-500 to-amber-700 text-white rounded-3xl p-6 md:p-8 shrink-0 shadow-lg relative overflow-hidden flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_left,_var(--tw-gradient-stops))] from-amber-400/20 via-transparent to-transparent opacity-60" />
        <div className="z-10 space-y-2 text-right">
          <div className="inline-flex items-center gap-2 bg-white/10 px-3.5 py-1 rounded-full text-xs font-bold border border-white/25">
            <Sparkles className="w-3.5 h-3.5 text-amber-200" />
            <span>الجيل الجديد من صناعة المحتوى الإلقائي</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight leading-tight">
            مُستشار وصانع السكربتات الذكي
          </h1>
          <p className="text-xs md:text-sm text-amber-100/90 font-medium max-w-2xl leading-relaxed">
            المنصة الذكية المتكاملة لكتابة وتلوين وتحسين سكربتات اليوتيوب والبودكاست والفيسبوك عبر 10 مراحل منهجية متتالية مع فحص وتدقيق الروايات التاريخية والأدبية.
          </p>
        </div>

        <div className="z-10 flex gap-2 w-full md:w-auto">
          <button
            onClick={handleStartNewProject}
            className="w-full md:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-3 bg-white text-amber-800 hover:bg-amber-50 font-bold rounded-2xl text-xs shadow-sm transition-all cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            بدء حلقة جديدة
          </button>
        </div>
      </header>

      {/* Main layout splitting sidebar and workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Sidebar history manager (Stage 10) */}
        <div className="space-y-6 lg:col-span-1">
          <ProjectList
            projects={projects}
            selectedProjectId={selectedProjectId}
            onSelectProject={(id) => {
              setSelectedProjectId(id);
              setGenerationError(null);
            }}
            onDeleteProject={handleDeleteProject}
            onNewProject={handleStartNewProject}
          />

          <div className="bg-gradient-to-br from-amber-600 to-orange-600 text-white p-5 rounded-2xl shadow-sm text-right space-y-3 relative overflow-hidden">
            <div className="absolute -left-10 -bottom-10 w-24 h-24 rounded-full bg-white/10" />
            <h4 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-amber-200" />
              معدل سرعة القراءة الصوتي
            </h4>
            <p className="text-[11px] leading-relaxed text-amber-50">
              يقوم محرك التطبيق بحساب مدة السكربت آلياً بمعدل <strong>130 كلمة في الدقيقة</strong>، وهو المتوسط الاحترافي الأنسب لإلقاء سردي حماسي ومفهوم.
            </p>
          </div>
        </div>

        {/* Central creation sheet & Results area */}
        <div className="lg:col-span-3 space-y-6">

          {/* Active Generation Progress log */}
          <StepProgressBar
            currentStage={currentStage}
            isGenerating={isGenerating}
            error={generationError}
          />

          {/* If there is a selected project AND we are not mid-creating a new one */}
          {activeProject && !isGenerating ? (
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm space-y-6">
              
              {/* Project Main Header Title card & Quick Stats metadata */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-5 border-b border-slate-100">
                <div className="space-y-1.5 text-right">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-md">
                      {activeProject.contentType}
                    </span>
                    <span className="text-slate-400 text-xs font-mono">
                      تاريخ الإنشاء: {new Date(activeProject.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                  </div>
                  <h2 className="text-xl md:text-2xl font-extrabold text-slate-800">
                    {activeProject.title}
                  </h2>
                  <p className="text-slate-500 text-xs">
                    عملية مخصصة لقناة: <strong className="text-slate-700 font-bold">{activeProject.channelName}</strong> | المدة التقديرية: {activeProject.stats.readingTime} دقائق.
                  </p>
                </div>

                {/* Print & Text Copy Actions */}
                <div className="flex flex-wrap gap-2 pt-2 md:pt-0">
                  <button
                    onClick={handleCopyToClipboard}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2.5 px-4 rounded-xl transition-all"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    نسخ النص
                  </button>
                  <button
                    onClick={handleExportTxtFile}
                    className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 py-2.5 px-4 rounded-xl transition-all"
                  >
                    <Download className="w-3.5 h-3.5 text-slate-400" />
                    حقيبة TXT
                  </button>
                  <button
                    onClick={() => setShowPrintPreview(true)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 py-2.5 px-5 rounded-xl transition-all shadow-md"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    تصدير PDF احترافي
                  </button>
                </div>
              </div>

              {/* Bento Stats display (Stage 8) */}
              <div className="grid grid-cols-3 gap-3 md:gap-4 bg-slate-50 border border-slate-100 p-4 rounded-2xl text-center">
                <div className="space-y-1">
                  <span className="text-[10px] md:text-xs text-slate-400 block font-bold">إجمالي الكلمات</span>
                  <strong className="text-lg md:text-2xl font-extrabold text-slate-800 font-mono">
                    {activeProject.stats.wordsCount}
                  </strong>
                  <span className="text-[10px] text-slate-400 block font-medium">كلمة فصحى</span>
                </div>
                <div className="space-y-1 border-x border-slate-150-100">
                  <span className="text-[10px] md:text-xs text-slate-400 block font-bold">مدة القراءة التقديرية</span>
                  <strong className="text-lg md:text-2xl font-extrabold text-slate-800 font-mono">
                    {activeProject.stats.readingTime}
                  </strong>
                  <span className="text-[10px] text-slate-400 block font-medium">دقائق سردية</span>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] md:text-xs text-slate-400 block font-bold">عدد الفقرات والأقسام</span>
                  <strong className="text-lg md:text-2xl font-extrabold text-slate-800 font-mono">
                    {activeProject.stats.paragraphsCount}
                  </strong>
                  <span className="text-[10px] text-slate-400 block font-medium">مقاطع أداء ملونة</span>
                </div>
              </div>

              {/* Navigation Tabs covering Stage 2 to 7 outputs */}
              <div className="border-b border-slate-100 flex overflow-x-auto gap-4 scrollbar-thin">
                <button
                  onClick={() => setActiveTab('script')}
                  className={`pb-3 text-xs md:text-sm font-bold border-b-2 text-right whitespace-nowrap transition-colors ${
                    activeTab === 'script'
                      ? 'border-amber-600 text-amber-700 font-extrabold'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  🔴 السكربت الصوتي الملوّن والذكي (المراحل 5، 6، 8)
                </button>
                <button
                  onClick={() => setActiveTab('structure')}
                  className={`pb-3 text-xs md:text-sm font-bold border-b-2 text-right whitespace-nowrap transition-colors ${
                    activeTab === 'structure'
                      ? 'border-amber-600 text-amber-700 font-extrabold'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  📝 هيكل وبنية الحبكة المعمارية (المرحلة 4)
                </button>
                <button
                  onClick={() => setActiveTab('analysis')}
                  className={`pb-3 text-xs md:text-sm font-bold border-b-2 text-right whitespace-nowrap transition-colors ${
                    activeTab === 'analysis'
                      ? 'border-amber-600 text-amber-700 font-extrabold'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  🔍 التحليل والبحث والتحقق التاريخي (المراحل 2، 3)
                </button>
                <button
                  onClick={() => setActiveTab('review')}
                  className={`pb-3 text-xs md:text-sm font-bold border-b-2 text-right whitespace-nowrap transition-colors ${
                    activeTab === 'review'
                      ? 'border-amber-600 text-amber-700 font-extrabold'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  🛡️ تدقيق ومراجعة الجودة والوقت (المرحلة 7)
                </button>
              </div>

              {/* Render dynamic Tab content */}
              <div>
                
                {/* 1. SCRIPT WORKSPACE (with actions Stage 8 lengthening, shortening, AI Instruction) */}
                {activeTab === 'script' && (
                  <div className="space-y-6">
                    {/* Block Script container */}
                    <ScriptEditor
                      script={activeProject.script}
                      onUpdateScript={handleLocalScriptChange}
                      onAiRewriteItem={async (id, insts) => {
                        setCustomInstructions(insts);
                        await handleModifyScript('rewrite-item', id);
                      }}
                      isModifying={isModifying}
                      channelName={activeProject.channelName}
                    />

                    {/* Stage 8 Draft Optimization Toolkit */}
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 md:p-6 space-y-4">
                      <div className="flex items-center gap-2">
                        <Sliders className="w-5 h-5 text-amber-600" />
                        <h4 className="font-extrabold text-slate-800 text-sm">أدوات تعديل السكربت وتحويره بالذكاء الاصطناعي (المرحلة 8):</h4>
                      </div>
                      <p className="text-slate-500 text-xs leading-relaxed">
                        اختر أحد الإجراءات السريعة لتبديل وضبط مسار القراءة، أو اكتب توجيهاتك المخصصة بأسفل ليتكفل مستشار السكربتات الذكي بتعديل الصياغة الشاملة للقصة.
                      </p>

                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleModifyScript('lengthen')}
                          disabled={isModifying}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-bold rounded-xl transition-all"
                        >
                          ➕ إطالة وتوسيع الحلقة
                        </button>
                        <button
                          onClick={() => handleModifyScript('shorten')}
                          disabled={isModifying}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-white text-slate-700 hover:bg-slate-100 border border-slate-200 text-xs font-bold rounded-xl transition-all"
                        >
                          ➖ اختصار وتبسيط القصة
                        </button>
                      </div>

                      {/* Custom Prompt Command edit bar */}
                      <div className="pt-2 border-t border-slate-200/60">
                        <label className="block text-xs font-bold text-slate-600 mb-1.5 text-right">
                          تعديل مخصص عبر تعليمات إضافية (مثال: "اجعل البداية مرعبة"، "أضف نهاية سعيدة"):
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={customInstructions}
                            onChange={(e) => setCustomInstructions(e.target.value)}
                            placeholder="اكتب تعليماتك لتعديل السكربت بأكمله..."
                            className="flex-1 bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                          />
                          <button
                            onClick={() => handleModifyScript('general')}
                            disabled={isModifying || !customInstructions.trim()}
                            className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-slate-900 border border-slate-800 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-sm transition-all whitespace-nowrap"
                          >
                            إجراء التعديل 🚀
                          </button>
                        </div>
                      </div>

                      {/* Historical draft versions revert container */}
                      {activeProject.versions && activeProject.versions.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-slate-200/60 bg-white/70 p-4 rounded-xl">
                          <h5 className="font-bold text-xs text-slate-700 flex items-center gap-1.5 mb-2.5">
                            <History className="w-3.5 h-3.5 text-slate-400" />
                            سجل المسودات والتعديلات التاريخية السابقة ({activeProject.versions.length}):
                          </h5>
                          <div className="space-y-2 max-h-[140px] overflow-y-auto">
                            {activeProject.versions.map((ver, vIdx) => (
                              <div key={ver.id} className="flex justify-between items-center text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                                <span>مسودة سابقة (#{activeProject.versions.length - vIdx}) - {ver.stats.wordsCount} كلمة</span>
                                <button
                                  onClick={() => handleRevertVersion(vIdx)}
                                  className="text-[10px] font-bold text-amber-600 hover:text-amber-800 bg-amber-50 px-2 py-1 rounded-md border border-amber-200/40"
                                >
                                  استعادة هذه النسخة 🔄
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* 2. ARCHITECTURAL DRAMATIC STRUCTURE (Stage 4 Output) */}
                {activeTab === 'structure' && (
                  <div className="space-y-6">
                    <h4 className="font-extrabold text-slate-800 text-sm">الهيكل الدرامي والقصصي المعتمد للحلقة (المرحلة 4):</h4>
                    <p className="text-slate-500 text-xs">
                      تم تقسيم عناصر الحبكة والتشويق لبناء متين ومبهر للسكربت:
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Structure items */}
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <strong className="text-amber-700 text-xs block mb-1">1. الهوك وجذب الانتباه (أول 10 ثوانٍ)</strong>
                        <p className="text-slate-700 text-xs leading-relaxed">{activeProject.structure.hook}</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <strong className="text-amber-700 text-xs block mb-1">2. المقدمة والتمهيد</strong>
                        <p className="text-slate-700 text-xs leading-relaxed">{activeProject.structure.intro}</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 md:col-span-2">
                        <strong className="text-amber-700 text-xs block mb-1">3. صياغة الأحداث وتطور الصراع</strong>
                        <p className="text-slate-700 text-xs leading-relaxed">{activeProject.structure.mainBody}</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <strong className="text-amber-700 text-xs block mb-1">4. الذروة ونقطة التأثير العظمى</strong>
                        <p className="text-slate-700 text-xs leading-relaxed">{activeProject.structure.climax}</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <strong className="text-amber-700 text-xs block mb-1">5. النهاية والدروس المستفادة</strong>
                        <p className="text-slate-700 text-xs leading-relaxed">{activeProject.structure.conclusion}</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <strong className="text-amber-700 text-xs block mb-1">6. دعوات التفاعل والمشاركة</strong>
                        <p className="text-slate-700 text-xs leading-relaxed">{activeProject.structure.cta}</p>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                        <strong className="text-amber-700 text-xs block mb-1">7. توقيع القناة والمذيع</strong>
                        <p className="text-slate-700 text-xs leading-relaxed">{activeProject.structure.signature}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. HISTORIC ANALYSIS AND RESEARCH PATHWAY (Stage 2 and Stage 3 Output) */}
                {activeTab === 'analysis' && (
                  <div className="space-y-6">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-3">
                      <h4 className="font-extrabold text-amber-800 text-xs md:text-sm">🔍 تحليل فكرة وخريطة الحلقة (المرحلة 2):</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-700">
                        <p><strong>الحقبة التاريخية المحددة:</strong> {activeProject.analysis.era}</p>
                        <p><strong>أسلوب السرد والتعليق:</strong> {activeProject.analysis.style}</p>
                        <p><strong>خصائص حجم الكلمات:</strong> {activeProject.analysis.estimatedSize}</p>
                      </div>
                      <p className="text-slate-600 text-xs leading-relaxed border-t border-slate-200/60 pt-3">
                        <strong>تفاصيل فهم الفكرة:</strong> {activeProject.analysis.details}
                      </p>
                    </div>

                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100 space-y-4">
                      <h4 className="font-extrabold text-amber-800 text-xs md:text-sm">📚 فحص ومقارنة المصادر وبناء الهيكل والتسلسل (المرحلة 3):</h4>
                      
                      {/* Timeline flow chart */}
                      <div className="space-y-2">
                        <h5 className="font-bold text-xs text-slate-700">التسلسل الزمني الدقيق والمنطقي للأحداث:</h5>
                        <div className="space-y-2 relative border-r-2 border-amber-400/30 pr-4 mt-2">
                          {activeProject.research.timeline.map((item, idx) => (
                            <div key={idx} className="relative">
                              <span className="absolute -right-[21px] top-1.5 w-2 h-2 rounded-full bg-amber-500" />
                              <p className="text-xs text-slate-600 leading-relaxed font-sans">{item}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Fact Verifications list */}
                      <div className="space-y-2 pt-3 border-t border-slate-200/60">
                        <h5 className="font-bold text-xs text-slate-700">مرحلة فحص الحقائق واستبعاد المتناقضات:</h5>
                        <ul className="list-disc leading-relaxed text-xs text-slate-600 pr-4 space-y-1.5 max-w-2xl">
                          {activeProject.research.verification.map((item, idx) => (
                            <li key={idx}>{item}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Consulted sources list */}
                      <div className="space-y-2 pt-3 border-t border-slate-200/60 text-xs text-slate-500 font-medium">
                        <p>
                          <strong>المراجع التاريخية والأثرية المقارنة:</strong> {activeProject.research.sources.join(' / ')}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* 4. SMART REVIEW LOGS (Stage 7 Output) */}
                {activeTab === 'review' && (
                  <div className="space-y-6">
                    <h4 className="font-extrabold text-slate-800 text-sm">🛡️ مخرجات التدقيق والمراجعة الشاملة (المرحلة 7):</h4>
                    <p className="text-slate-500 text-xs">
                      مر السكربت بالكامل بعمليات تنقيح واختبار لضمان أقصى كفاءة للأداء:
                    </p>

                    <div className="space-y-3.5 mt-2">
                      <div className="flex gap-2.5 items-start bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/50">
                        <BookmarkCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950 text-xs font-bold block">مراجعة الأخطاء اللغوية والنحوية:</strong>
                          <p className="text-slate-600 text-xs leading-relaxed mt-0.5">{activeProject.review.grammar}</p>
                        </div>
                      </div>

                      <div className="flex gap-2.5 items-start bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/50">
                        <BookmarkCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950 text-xs font-bold block">مراجعة تسلسل خط الأحداث الزمني:</strong>
                          <p className="text-slate-600 text-xs leading-relaxed mt-0.5">{activeProject.review.timelineFlow}</p>
                        </div>
                      </div>

                      <div className="flex gap-2.5 items-start bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/50">
                        <BookmarkCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950 text-xs font-bold block">مكافحة التكرار وضغط الفصول:</strong>
                          <p className="text-slate-600 text-xs leading-relaxed mt-0.5">{activeProject.review.repetitions}</p>
                        </div>
                      </div>

                      <div className="flex gap-2.5 items-start bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/50">
                        <BookmarkCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950 text-xs font-bold block">اختبار تفاعل قوة الهوك الافتتاحي:</strong>
                          <p className="text-slate-600 text-xs leading-relaxed mt-0.5">{activeProject.review.hookStrength}</p>
                        </div>
                      </div>

                      <div className="flex gap-2.5 items-start bg-emerald-50/40 p-3.5 rounded-xl border border-emerald-100/50">
                        <BookmarkCheck className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-emerald-950 text-xs font-bold block">أثر قوابض الخاتمة والدعوة التفاعلية:</strong>
                          <p className="text-slate-600 text-xs leading-relaxed mt-0.5">{activeProject.review.outroStrength}</p>
                        </div>
                      </div>

                      <div className="flex gap-2.5 items-start bg-amber-50/50 p-3.5 rounded-xl border border-amber-100/60">
                        <Clock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-amber-950 text-xs font-bold block">توافق السكربت مع وقت العرض المطلوب:</strong>
                          <p className="text-slate-600 text-xs leading-relaxed mt-0.5">{activeProject.review.durationMatch}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          ) : (
            /* Input Form Setup Step (Stage 1) */
            <div className="bg-white rounded-2xl border border-slate-100 p-6 md:p-8 shadow-sm text-right space-y-6">
              
              <div className="flex items-center gap-2.5 pb-4 border-b border-secondary border-slate-100">
                <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600 shadow-sm shrink-0">
                  <Film className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-800 text-base">إعداد وتأصيل فكرة حلقة جديدة (المرحلة الأولى)</h3>
                  <p className="text-xs text-slate-400">يرجى تعبئة المعايير بدقة وسيقوم الذكاء الاصطناعي بباقي المهام بالترتيب.</p>
                </div>
              </div>

              {generationError && (
                <div className="bg-red-50 text-red-800 border border-red-100 rounded-xl p-4 text-xs leading-relaxed">
                  <strong>حدث خطأ:</strong> {generationError}
                </div>
              )}

              <form onSubmit={handleInitiateGeneration} className="space-y-5">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Script Title */}
                  <div className="space-y-1.5 col-span-1 md:col-span-2">
                    <label className="block text-xs font-extrabold text-slate-700">عنوان القصة أو موضوع المسلسل التلفزيوني/اليوتيوبي:</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="مثال: سر زوال حضارة الأنباط، مقتل الاسكندر الأكبر، عقيدة الملك الفرعوني المسافر..."
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-xs md:text-sm text-slate-850 placeholder:text-slate-350 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Classification Content Type */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-slate-700">نوع وتصنيف المحتوى العام للحلقة:</label>
                    <select
                      value={contentType}
                      onChange={(e) => setContentType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-xs md:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500 cursor-pointer"
                    >
                      <option value="تاريخي">تاريخي</option>
                      <option value="إسلامي">إسلامي</option>
                      <option value="قصص الأنبياء">قصص الأنبياء</option>
                      <option value="شخصيات تاريخية">شخصيات تاريخية</option>
                      <option value="وثائقي">وثائقي</option>
                      <option value="ألغاز وغموض">ألغاز وغموض</option>
                    </select>
                  </div>

                  {/* Channel/Anchor Name */}
                  <div className="space-y-1.5">
                    <label className="block text-xs font-extrabold text-slate-700">اسم قناتك أو برنامجك الصوتي (البودكاست):</label>
                    <input
                      type="text"
                      required
                      value={channelName}
                      onChange={(e) => setChannelName(e.target.value)}
                      placeholder="مثال: رحالة التاريخ، راديو الغموض..."
                      className="w-full bg-slate-50 border border-slate-200 focus:bg-white rounded-xl px-4 py-3 text-xs md:text-sm text-slate-850 placeholder:text-slate-350 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                    />
                  </div>

                  {/* Duration required */}
                  <div className="space-y-2 col-span-1 md:col-span-2 bg-slate-50/50 p-4 rounded-2xl border border-slate-200/40">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-extrabold text-slate-700">المدة الكلية المطلوبة للحلقة بالدقائق:</span>
                      <strong className="bg-[#fffbeb] text-amber-800 border border-amber-200 rounded-lg px-2.5 py-1 text-xs font-mono">
                        {duration} دقائق
                      </strong>
                    </div>

                    <input
                      type="range"
                      min="1"
                      max="15"
                      step="1"
                      value={duration}
                      onChange={(e) => setDuration(Number(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />

                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-medium">
                      <span>دقيقة واحدة (سريعة التصفح)</span>
                      <span>15 دقيقة (كتاب متكامل وتفاصيل عميقة)</span>
                    </div>

                    <p className="text-[11px] text-slate-500 leading-relaxed mt-2 p-1 border-r-2 border-slate-300">
                      📝 المدة المختارة تتطلب صياغة حوالي <strong>{duration * 130} كلمة</strong>. سيحرص محرك الذكاء الاصطناعي على توسيع التفاصيل التاريخية وسرد الأحداث لتكفي هذا الوقت بشكل كامل دون حشو مكرر.
                    </p>
                  </div>

                </div>

                {/* Confirm generation button */}
                <div className="pt-4 flex justify-end">
                  <button
                    type="submit"
                    className="w-full md:w-auto inline-flex items-center justify-center gap-2 px-10 py-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white font-black rounded-2xl text-xs md:text-sm shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-amber-200 animate-pulse" />
                    توليد وإنشاء السكربت السحري (المرحلة 2 إلى 7)
                  </button>
                </div>
              </form>
            </div>
          )}

        </div>
      </div>

      {/* Global Print-ready Overlay Modal (Stage 9) */}
      {showPrintPreview && activeProject && (
        <PrintPreview
          project={activeProject}
          onClose={() => setShowPrintPreview(false)}
        />
      )}

      {/* Aesthetic human attribution watermark */}
      <footer className="pt-12 text-center text-xs text-slate-400 font-medium">
        <p>© {new Date().getFullYear()} منصة صانع السكربتات الذكية. جميع الحقوق محفوظة لجهة الإنشاء.</p>
        <p className="mt-1 text-[10px] text-slate-300">يقوم الذكاء الاصطناعي بتبسيط وتلوين الأداء عبر محركات السرد الخاصة.</p>
      </footer>

    </div>
  );
}
