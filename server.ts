import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initializing the Google GenAI SDK as prescribed server-side
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", apiConfigured: !!apiKey });
});

// Primary generation route
app.post("/api/generate-script", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({
        error: "مفتاح API الخاص بـ Gemini غير مهيأ. يرجى تهيئته في قائمة Secrets.",
      });
    }

    const { title, contentType, channelName, duration } = req.body;

    if (!title || !contentType || !channelName || !duration) {
      return res.status(400).json({
        error: "يرجى تعبئة جميع الحقول المطلوبة (العنوان، نوع المحتوى، اسم القناة، مدة الحلقة).",
      });
    }

    const wordCountEstimate = Math.min(1800, Math.max(300, Math.round(130 * Number(duration))));

    const prompt = `
أنت خبير محترف في صناعة المحتوى وكتابة السكربتات لقنوات اليوتيوب والبودكاست الكبرى بصوت سردي مميز.
المطلوب هو إنشاء سكربت متكامل بناءً على المدخلات التالية:
- عنوان الحلقة/القصة: "${title}"
- نوع المحتوى: "${contentType}"
- اسم القناة: "${channelName}"
- مدة الحلقة المطلوبة: ${duration} دقائق (العدد التقديري للكلمات المطلوبة: حوالي ${wordCountEstimate} كلمة).

قم بالمرور بالخطوات والتحليلات الآتية لبناء السكربت وصياغته بصيغة JSON تماماً كما هو مبين في الهيكل أدناه.

يجب أن يحتوي كائن الـ JSON على المفاتيح التالية باللغة العربية كقيم:

1. "analysis" (تحليل الطلب):
   - "era" (الحقبة الزمنية): تحديد الزمن بدقة.
   - "characters" (الشخصيات الرئيسية): مصفوفة من أسماء الشخصيات الأساسية.
   - "style" (نوع السرد): أسلوب السرد الأنسب (مثل: درامي غامض، وثائقي رصين، حماسي مشوق).
   - "estimatedSize" (حجم المحتوى): حجم المحتوى والعدد المتوقع من الكلمات.
   - "details" (تفاصيل الفهم): شرح موجز لفكرة القصة وتوجهها العام.

2. "research" (البحث وعبر المقارنة):
   - "sources" (المصادر الموثوقة): مصفوفة من مصادر معتمدة مقترحة (مثل: ابن الأثير، الطبري، وثائق تاريخية، إلخ).
   - "timeline" (التسلسل الزمني): مصفوفة من الأحداث الهامة مرتبة تسلسلياً.
   - "verification" (فحص الحقائق): مصفوفة من جمل تؤكد فحص وتفضيل الروايات القوية وحذف الضعيفة أو المتناقضة.

3. "structure" (بناء هيكل الحلقة):
   - "hook" (الهوك): جملة افتتاحية غامضة أو مثيرة جداً لجذب انتباه المشاهد في أول 10 ثوانٍ.
   - "intro" (المقدمة): تمهيد يربط الهوك ببداية القصة وتاريخها.
   - "mainBody" (الأحداث الرئيسية): تفاصيل الحبكة وتدرج وتطور الصراع.
   - "climax" (الذروة): اللحظة الأكثر إثارة وتأثيراً في مسار الحكاية.
   - "conclusion" (الخاتمة): العبرة أو الدروس المستفادة ونهاية أحداث القصة.
   - "cta" (دعوة التفاعل): طلب ذكي لمشاركة المشاهد والضغط على زر الإعجاب وكتابة تعليق.
   - "signature": إضافة خاتمة صوتية مميزة تحمل اسم القناة "${channelName}".

4. "script" (السكربت الكامل الملون والمحسن للأداء الصوتي):
   مصفوفة من الكائنات يمثل كل منها فقرة أو جملة قابلة للتعليق الصوتي.
   يجب أن يتراوح المجموع العام لكلمات السكربت حول ${wordCountEstimate} كلمة تقريباً ليلائم مدة ${duration} دقائق بشكل كامل وبدون تكرار.
   كل كائن يحتوي على:
   - "text" (النص): النص الصوتي الفعلي باللغة العربية الفصحى الفخمة والأسلوب القصصي الجذاب.
   - "type" (نوع النبرة): يجب أن تكون إحدى القيم النصية التالية حصراً ومباشرة:
     * "mysterious" (للجمل الغامضة والمثيرة للفضول والترقب) (استخدمها بكثرة في مواضع الغموض).
     * "enthusiastic" (للجمل الحماسية والصاخبة التي ترفع الأدرينالين والتوتر).
     * "important" (للمعلومات والتواريخ والأسماء الهامة التي تحتاج تركيزاً ونبرة واضحة).
     * "quote" (لاقتباس مباشر أو مقولة منقولة عن الشخصيات).
     * "pause" (لوقفات الصمت المخطط لها ومؤثرات الصوت التعبيرية، وفي هذه الحالة يكون النص قصيراً مثل "[توقف صامت لمدة ثانيتين]" أو "[مؤثر صوتي مهيب]").
     * "normal" (للسرد الاعتيادي المتدفق).
   - "note" (توجيه صوتي): جملة توجيهية قصيرة للمعلق الصوتي توضح إحساس وتعبير الصوت الملائم للفقرة (مثال: "بنبرة هادئة ومتوجسة"، "بصوت واثق ومرتفع"، "بصوت مفعم بالذهول والاندهاش").

5. "review" (المراجعة الذكية):
   - "grammar": فحص النحو والإملاء والتأكيد المباشر على سلامة العبارات العربية.
   - "timelineFlow": تقييم ترابط تدفق أحداث القصة زمنياً.
   - "repetitions": مراجعة وضمان خلو النص من التكرار والكلمات الزائدة.
   - "hookStrength": تعليق حول مدى قوة وجاذبية الهوك الافتتاحي.
   - "outroStrength": مرئيات حول تموضع الخاتمة ودعوة المشاهدين للتفاعل.
   - "durationMatch": تأكيد ملاءمة طول السكربت للمدة المطلوبة ${duration} دقائق.

6. "stats":
   - "wordsCount": إجمالي عدد كلمات السكربت (الرقم الصحيح).
   - "readingTime": مدة القراءة المتوقعة بالدقائق (عدد عشري أو صحيح متطابق مع المدة المطلوبة).
   - "paragraphsCount": إجمالي عدد الفقرات في السكربت (عدد صحيح).

يرجى إعادة كائن JSON صالح وخالٍ تماماً من أي تفسيرات خارجية، ولا تقم بلف الكود بألعاب لغوية أو علامات ماركداون غير صالحة. لا تكتب سوى كود الـ JSON النقي.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.85,
      },
    });

    const resultText = response.text || "{}";
    const cleanedText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanedText);

    res.json(data);
  } catch (error: any) {
    console.error("Error generating script:", error);
    res.status(500).json({
      error: "حدث خطأ أثناء الاتصال بالذكاء الاصطناعي لإنشاء السكربت: " + error.message,
    });
  }
});

// Endpoint to edit or regenerate draft changes (lengthen, shorten, rewrite, edit-item)
app.post("/api/modify-script", async (req, res) => {
  try {
    if (!ai) {
      return res.status(500).json({ error: "مفتاح API الخاص بـ Gemini غير مهيأ." });
    }

    const { script, action, itemId, userInstructions, title, contentType, channelName, duration } = req.body;

    if (!script) {
      return res.status(400).json({ error: "السكربت الحالي مفقود." });
    }

    let modificationPrompt = "";

    if (action === "lengthen") {
      modificationPrompt = `
لديك السكربت العربي التالي المقسم لفقرات:
${JSON.stringify(script, null, 2)}

المطلوب هو إطالة (توسيع) هذا السكربت وزيادة تفاصيل الأحداث وصياغتها بإسهاب تشويقي، مع الحفاظ على نفس البنية والتلوينات الصوتية (normal, mysterious, enthusiastic, important, quote, pause). أضف فقرات جديدة في مسار القصة لجعلها أطول وأكثر غنى بالمعلومات التاريخية أو الحبكة الدرامية، مع ملاءمتها لاسم القناة "${channelName}" وعنوان "${title}".
يجب أن تعود النتيجة بهيكل JSON يحتوي فقط على:
{
  "script": [ ... نفس هيكل مصفوفة السكربت السابقة مع الزيادة والتطوير ... ],
  "stats": {
    "wordsCount": الرقم الجديد للكلمات,
    "readingTime": المدة الجديدة المقدرة بالدقائق,
    "paragraphsCount": عدد الفقرات الجديد
  }
}
      `;
    } else if (action === "shorten") {
      modificationPrompt = `
لديك السكربت العربي التالي المقسم لفقرات:
${JSON.stringify(script, null, 2)}

المطلوب هو اختصار وتكثيف هذا السكربت ليصبح موجزاً ومباشراً وسريع الإيقاع، مع حذف الحشو الزائد والحفاظ على الأحداث العظمى والتلوينات الصوتية المؤثرة (normal, mysterious, enthusiastic, important, quote, pause).
يجب أن تعود النتيجة بهيكل JSON يحتوي فقط على:
{
  "script": [ ... نفس هيكل مصفوفة السكربت السابقة بعد الاختصار ... ],
  "stats": {
    "wordsCount": الرقم الجديد للكلمات,
    "readingTime": المدة الجديدة المقدرة بالدقائق,
    "paragraphsCount": عدد الفقرات الجديد
  }
}
      `;
    } else if (action === "rewrite-item" && itemId) {
      const targetItem = script.find((i: any) => i.id === itemId);
      modificationPrompt = `
لديك السكربت العربي الكامل المقسم لفقرات:
${JSON.stringify(script, null, 2)}

نريد على وجه الخصوص إعادة كتابة وتحسين الفقرة المحددة صاحبة الـ ID "${itemId}" والتي نصها الحالي هو:
"${targetItem ? targetItem.text : ""}"

تعليمات المستخدم لإعادة الكتابة: "${userInstructions || "اجعل الصياغة أكثر تشويقاً ودرامية"}"

أعد صياغة وتحسين هذه الفقرة فقط بحيث تناسب السياق العام وتدفق القصة وتدعم الأسلوب الصوتي المناسب لها. يمكنك كذلك اقتراح تغيير نبرة الأداء "type" والتوجيه الصوتي "note".
يجب أن تعود النتيجة بهيكل JSON يحتوي على مصفوفة "script" كاملة ومحدثة مع البيانات الإحصائية "stats" بنفس المسميات والهيكل:
{
  "script": [ ... السكربت الكامل مع استبدال وتعديل الفقرة المستهدفة ... ],
  "stats": {
    "wordsCount": الرقم الجديد للكلمات,
    "readingTime": المدة,
    "paragraphsCount": العدد
  }
}
      `;
    } else {
      // General rewrite instructions
      modificationPrompt = `
لديك السكربت العربي التالي المقسم لفقرات لقصة "${title}":
${JSON.stringify(script, null, 2)}

نريد إجراء تعديل عام وإعادة صياغة بناءً على طلب المستخدم التالي وتوجيهاته:
"${userInstructions || "حسن الأسلوب واجعله أكثر لغة سليمة وتشويقاً"}"

قم بتطبيق تلك التعليمات على السكربت بالكامل أو الأجزاء المتأثرة به دون تغيير التنسيق الهيكلي وبالمحافظة على التلوينات الصوتية المناسبة (normal, mysterious, enthusiastic, important, quote, pause).
أعد كائن JSON بالهيكل التالي فقط:
{
  "script": [ ... السكربت المعدل بالكامل ... ],
  "stats": {
    "wordsCount": الرقم الجديد للكلمات,
    "readingTime": المدة الجديدة,
    "paragraphsCount": عدد الفقرات
  }
}
      `;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: modificationPrompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const resultText = response.text || "{}";
    const cleanedText = resultText.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanedText);

    res.json(data);
  } catch (error: any) {
    console.error("Error modifying script:", error);
    res.status(500).json({
      error: "حدث خطأ أثناء تعديل السكربت عبر الذكاء الاصطناعي: " + error.message,
    });
  }
});

// Vite + Static deployment routing
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running securely on http://localhost:${PORT}`);
  });
}

startServer();
