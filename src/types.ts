export type ScriptSectionType = 'enthusiastic' | 'mysterious' | 'important' | 'quote' | 'pause' | 'normal';

export interface ScriptItem {
  id: string;
  text: string;
  type: ScriptSectionType;
  note?: string;
}

export interface AnalysisResult {
  era: string; // الحقبة الزمنية
  characters: string[]; // الشخصيات الرئيسية
  style: string; // نوع السرد المناسب
  estimatedSize: string; // الحجم المقدر للمحتوى
  details: string; // تفاصيل الفهم والتحليل
}

export interface ResearchResult {
  sources: string[]; // المصادر الموثوقة
  timeline: string[]; // التسلسل الزمني للأحداث
  verification: string[]; // تفاصيل التحقق ومقارنة المعلومات
}

export interface StructureResult {
  hook: string; // الهوك (الافتتاحية الجاذبة)
  intro: string; // المقدمة
  mainBody: string; // الأحداث الرئيسية
  climax: string; // الذروة
  conclusion: string; // النهاية/الخاتمة
  cta: string; // دعوة التفاعل
  signature: string; // توقيع القناة
}

export interface ReviewResult {
  grammar: string; // مراجعة الأخطاء اللغوية
  timelineFlow: string; // مراجعة التسلسل الزمني
  repetitions: string; // فحص التكرار واقتراحات حذفه
  hookStrength: string; // قوة الهوك والافتتاحية
  outroStrength: string; // قوة الخاتمة والدعوة للتفاعل
  durationMatch: string; // التوافق مع المدة المطلوبة
}

export interface ProjectStats {
  wordsCount: number;
  readingTime: number; // بالدقائق
  paragraphsCount: number;
}

export interface ScriptVersion {
  id: string;
  timestamp: string;
  script: ScriptItem[];
  stats: ProjectStats;
}

export interface Project {
  id: string;
  title: string;
  contentType: string; // نوع المحتوى
  channelName: string;
  duration: number; // بالدقائق
  createdAt: string;
  updatedAt: string;
  analysis: AnalysisResult;
  research: ResearchResult;
  structure: StructureResult;
  script: ScriptItem[];
  review: ReviewResult;
  stats: ProjectStats;
  versions: ScriptVersion[];
}
