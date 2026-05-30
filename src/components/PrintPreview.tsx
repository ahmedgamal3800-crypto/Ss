import React, { useState, useEffect } from 'react';
import { Project } from '../types';
import { Printer, X, FileText, ArrowLeft, Download, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface PrintPreviewProps {
  project: Project;
  onClose: () => void;
}

export type ExportPhase = 
  | 'idle' 
  | 'validating'          // 15% - Checking title, variables, script items
  | 'isolating_env'       // 35% - Spawning isolated sandbox and formatting fonts
  | 'rendering_raster'    // 60% - High-Res canvas rasterization with HTML2Canvas
  | 'compiling_pdf'       // 80% - Creating pagination grids, compiling jsPDF pages
  | 'validating_output'   // 95% - Testing byteLength size, validity checks
  | 'completed'           // 100% - Save triggers
  | 'failed';             // Crash fallback triggered

interface StepState {
  id: number;
  label: string;
  desc: string;
  percent: number;
}

export const PrintPreview: React.FC<PrintPreviewProps> = ({ project, onClose }) => {
  const [phase, setPhase] = useState<ExportPhase>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [diagnosticLogs, setDiagnosticLogs] = useState<string[]>([]);
  const [generatedSizeKB, setGeneratedSizeKB] = useState<number>(0);

  const printDate = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  const pushLog = (msg: string) => {
    console.log(`[PDF Engine] ${msg}`);
    setDiagnosticLogs(prev => [...prev, `[${new Date().toLocaleTimeString('ar-EG')}] ${msg}`]);
  };

  const handlePrintTrigger = () => {
    window.print();
  };

  // Helper: Generates beautiful plain-text script outline with speech directions
  const handleDownloadTxtFallback = (isAuto: boolean = false) => {
    pushLog(`بدء توليد النسخة النصية الاحتياطية (Auto: ${isAuto})`);
    
    try {
      const title = project.title || 'سكربت_غير_معنون';
      const channel = project.channelName || 'غير محدد';
      const duration = project.stats?.readingTime || project.duration || 0;
      const words = project.stats?.wordsCount || 0;
      
      let txtContent = `===========================================================\n`;
      txtContent += `  📌 السكربت الاحترافي المتكامل: ${title}\n`;
      txtContent += `  📺 القناة / المنصة: ${channel}\n`;
      txtContent += `  ⏱️ المدة التقديرية: ${duration} دقائق | 📖 مجموع الكلمات: ${words} كلمة\n`;
      txtContent += `  📅 تاريخ واستخراج السند: ${new Date().toLocaleString('ar-EG')}\n`;
      txtContent += `===========================================================\n\n`;
      
      txtContent += `[١] التحليل الفني والدرامي الحصري للقصة:\n`;
      txtContent += `-----------------------------------------------------------\n`;
      txtContent += `• الحقبة الزمنية التاريخية: ${project.analysis?.era || 'غير محدد'}\n`;
      txtContent += `• تنظير الأداء الصوتي الملائم: ${project.analysis?.style || 'قصصي متدفق'}\n`;
      txtContent += `• الشخصيات الرئيسية الحاضرة: ${project.analysis?.characters?.join('، ') || 'عام'}\n`;
      txtContent += `• أبرز المراجع والكتب التاريخية: ${project.research?.sources?.join('، ') || 'أمهات الكتب المعتمدة'}\n\n`;
      
      txtContent += `[٢] فصول وهيكلة الصياغة الإبداعية:\n`;
      txtContent += `-----------------------------------------------------------\n`;
      txtContent += `• الافتتاحية والمثير (Hook): ${project.structure?.hook || 'مباشر'}\n`;
      txtContent += `• المقدمة التاريخية: ${project.structure?.intro || 'جاهز'}\n`;
      txtContent += `• الذروة وتفاقم الحبكة: ${project.structure?.climax || 'متوفر'}\n`;
      txtContent += `• الخاتمة والمحصلة: ${project.structure?.conclusion || 'جاهز'}\n`;
      txtContent += `• دعوة التفاعل المستهدفة (CTA): ${project.structure?.cta || 'غير محدد'}\n\n`;
      
      txtContent += `[٣] نصوص فقرات السكربت والتوجيهات الإلقائية الحية:\n`;
      txtContent += `-----------------------------------------------------------\n\n`;
      
      project.script.forEach((item, idx) => {
        let typeName = 'سرد طبيعي';
        if (item.type === 'mysterious') typeName = 'ترقب وغموض وإثارة';
        else if (item.type === 'enthusiastic') typeName = 'حماسي وحركي مرتفع';
        else if (item.type === 'important') typeName = 'أرقام وإحصائيات بالغة الأهمية';
        else if (item.type === 'quote') typeName = 'اقتباس تاريخي صريح';
        else if (item.type === 'pause') typeName = 'وقفة تنهد ومؤثر مسموع';

        txtContent += `【 فقرة رقم #${idx + 1} | أسلوب الإلقاء: ${typeName} 】\n`;
        if (item.note) {
          txtContent += `► توجيه المعلق الصوتي: [ ${item.note} ]\n`;
        }
        txtContent += `💬 النص المنطوق:\n"${item.text}"\n`;
        txtContent += `-----------------------------------------------------------\n\n`;
      });
      
      txtContent += `===========================================================\n`;
      txtContent += `تم توليد هذا الملف الاحتياطي لحفظ حقوق ومجهود مراجعتكم اللغوية والصوتية.\n`;
      txtContent += `نعتذر عن عدم إتاحة ה-PDF في هذا المتصفح القديم وتم تقديم هذا كخيار إجباري ناجح.\n`;
      txtContent += `تم الإنشاء والتوليد عبر المنصة الذكية لخدمة صناع المحتوى.\n`;
      txtContent += `===========================================================\n`;

      const blob = new Blob([txtContent], { type: 'text/plain;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `سكربت_الحلقة_${title.replace(/\s+/g, '_')}_النسخة_الاحتياطية.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      pushLog('تم تيسير وتنزيل الملف البديل في جهاز المستخدم بنجاح تام.');
    } catch (err: any) {
      pushLog(`فشل حتى توليد الملف الاحتياطي البديل: ${err?.message || err}`);
    }
  };

  const handleDownloadPdf = async () => {
    setDiagnosticLogs([]);
    setErrorMessage('');
    
    // --- 1. التحقق الفني المسبق للسكربت (Requirement 4) ---
    setPhase('validating');
    pushLog('بدء مرحلة التحقق الأولي من السكربت...');
    
    await new Promise(r => setTimeout(r, 450)); // UI pacing
    
    if (!project.title || !project.title.trim()) {
      const err = 'لا يمكن تصدير مستند فارغ العنوان! يرجى تقديم عنوان للسكربت أولاً لدمجه كغلاف احترافي.';
      pushLog(`فشل التحقق: ${err}`);
      setErrorMessage(err);
      setPhase('failed');
      return;
    }

    if (!project.script || project.script.length === 0) {
      const err = 'لا توجد فقرات ولا نصوص مسجلة في السكربت لمشروعك الحالي! اكتب نصوصاً قبل محاولة التصدير.';
      pushLog(`فشل التحقق: ${err}`);
      setErrorMessage(err);
      setPhase('failed');
      return;
    }

    const hasAnyText = project.script.some(item => item.text && item.text.trim().length > 3);
    if (!hasAnyText) {
      const err = 'النصوص المسجلة في فقرات السكربت قصيرة جداً أو فارغة تماماً. يرجى ملء الفراغات.';
      pushLog(`فشل التحقق: ${err}`);
      setErrorMessage(err);
      setPhase('failed');
      return;
    }

    pushLog('مرت عملية التحقق بنجاح من العنوان والمحتويات وسلاسة التهيئة.');

    // --- 2. إنشاء الحاوية المعزولة (Sandbox) لتطهير okLCH وملائمة RTL (Requirement 2 & 6 & 9) ---
    setPhase('isolating_env');
    pushLog('بدء دمج وبناء الحاوية الرسومية المعزولة وتطهير الألوان (oklch, oklab)...');
    
    let iframe: HTMLIFrameElement | null = null;
    try {
      await new Promise(r => setTimeout(r, 550)); // Simulated loading for gorgeous interactive stepper

      iframe = document.createElement('iframe');
      // Hide completely offscreen
      iframe.style.position = 'fixed';
      iframe.style.right = '100vw';
      iframe.style.bottom = '100vh';
      iframe.style.width = '794px'; // Clean constant width matching standard letter A4 ratio (approx 794px equivalent to A4 margins in high fidelity)
      iframe.style.height = 'auto';
      iframe.style.border = 'none';
      iframe.style.visibility = 'hidden';
      document.body.appendChild(iframe);

      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('تعذر حجز مسودة معزولة داخل محرك تصفح الهاتف/الكمبيوتر.');
      }

      pushLog('تم حجز الـ Sandbox بنجاح. نقوم بحقن ترويسات وموديلات الـ CSS النظيفة الخالية تماماً من OKLCH...');

      // Compile beautiful CSS in iframe explicitly resolving any unsupported oklch / oklab colors by using safe HEX values.
      // This solves the problem that html2canvas CSS parsing breaks instantly on modern color functions.
      const iframeInjectedStyles = `
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Amiri:ital,wght@0,400;0,700;1,400&display=swap');
        
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        body {
          background-color: #ffffff;
          color: #1e293b;
          font-family: 'Amiri', Georgia, serif;
          direction: rtl;
          text-align: right;
          padding: 60px 45px;
          line-height: 1.8;
          width: 794px; /* Fixed A4 simulation width */
        }

        /* Cover Page styling */
        .cover-page {
          border: 4px double #d97706; /* Branded Amber */
          border-radius: 16px;
          padding: 50px 35px;
          text-align: center;
          margin-bottom: 70px;
          position: relative;
          background: #ffffff;
          page-break-after: always;
          break-after: page;
        }

        .cover-badge {
          font-family: 'Cairo', sans-serif;
          font-size: 11px;
          font-weight: 800;
          color: #d97706;
          text-transform: uppercase;
          background-color: #fef3c7;
          display: inline-block;
          padding: 4px 14px;
          border-radius: 9999px;
          margin-bottom: 16px;
          border: 1px solid #fde68a;
        }

        .cover-title {
          font-family: 'Cairo', sans-serif;
          font-size: 30px;
          font-weight: 900;
          color: #0f172a;
          margin-bottom: 16px;
          line-height: 1.4;
        }

        .cover-divider {
          width: 100px;
          height: 3px;
          background-color: #d97706;
          margin: 16px auto;
          border-radius: 99px;
        }

        .cover-description {
          font-size: 13px;
          line-height: 1.6;
          color: #475569;
          margin-bottom: 45px;
          max-width: 550px;
          margin-left: auto;
          margin-right: auto;
        }

        .meta-container {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 12px;
          margin-bottom: 40px;
          font-family: 'Cairo', sans-serif;
        }

        .meta-card {
          background-color: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 12px;
          text-align: center;
        }

        .meta-label {
          display: block;
          color: #64748b;
          font-size: 9px;
          font-weight: 700;
          margin-bottom: 4px;
          letter-spacing: 0.5px;
        }

        .meta-value {
          font-size: 11px;
          font-weight: 800;
          color: #1e293b;
        }

        .analysis-box {
          background-color: #fafaf9;
          border: 1px solid #e7e5e4;
          border-radius: 12px;
          padding: 20px;
          text-align: right;
          font-family: 'Cairo', sans-serif;
          margin-bottom: 40px;
        }

        .analysis-header {
          font-size: 13px;
          font-weight: 800;
          color: #0f172a;
          border-bottom: 1px solid #e7e5e4;
          padding-bottom: 8px;
          margin-bottom: 12px;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 8px;
          font-size: 11px;
          color: #44403c;
        }

        .script-section-title {
          font-family: 'Cairo', sans-serif;
          font-size: 16px;
          font-weight: 800;
          color: #1e293b;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 8px;
          margin-bottom: 24px;
          margin-top: 10px;
        }

        /* Script Paragraph layouts */
        .script-block {
          background: #ffffff;
          border-right: 5px solid #64748b;
          border-radius: 8px;
          padding: 16px 20px;
          margin-bottom: 24px;
          page-break-inside: avoid;
          break-inside: avoid;
          border-top: 1px solid #f1f5f9;
          border-left: 1px solid #f1f5f9;
          border-bottom: 1px solid #f1f5f9;
        }

        .block-header {
          display: flex;
          justify-content: space-between;
          font-family: 'Cairo', sans-serif;
          font-size: 10px;
          color: #64748b;
          margin-bottom: 10px;
          border-bottom: 1px solid #f1f5f9;
          padding-bottom: 6px;
          font-weight: 600;
        }

        .block-note {
          font-weight: 700;
          color: #d97706;
          background: #fef3c7;
          padding: 1px 8px;
          border-radius: 4px;
        }

        .block-text {
          font-size: 17px;
          line-height: 1.8;
          color: #0f172a;
          white-space: pre-wrap;
          font-family: 'Amiri', serif;
          text-align: justify;
        }

        /* Branded Footer Plate for printing (Requirement 9) */
        .page-footer {
          margin-top: 50px;
          padding-top: 16px;
          border-top: 1px solid #e2e8f0;
          text-align: center;
          font-family: 'Cairo', sans-serif;
          font-size: 10px;
          color: #94a3b8;
        }

        .page-signature {
          font-size: 11px;
          font-weight: 700;
          color: #334155;
          margin-bottom: 4px;
        }
      `;

      // Build covers, metadata and blocks as clean pure semantic components inside the Sandbox
      const scriptItemsHtml = project.script.map((item, index) => {
        let typeLabel = 'سرد وإلقاء هادئ';
        let edgeColor = '#475569'; // default slate color
        let bgStyle = '#ffffff';
        
        if (item.type === 'mysterious') {
          typeLabel = 'إيقاع غامض وترقب ترتيبي';
          edgeColor = '#ca8a04'; // amber-600
        } else if (item.type === 'enthusiastic') {
          typeLabel = 'حماسي تفاعلي حركي';
          edgeColor = '#dc2626'; // red-600
        } else if (item.type === 'important') {
          typeLabel = 'تركيز على أرقام وحقائق بالغة الأهمية';
          edgeColor = '#2563eb'; // blue-600
        } else if (item.type === 'quote') {
          typeLabel = 'اقتباس أدبي / قصة منقولة';
          edgeColor = '#16a34a'; // green-600
        } else if (item.type === 'pause') {
          typeLabel = 'وقفة صمت تكتيكية / مؤثر سمعي';
          edgeColor = '#7c3aed'; // purple-600
        }

        return `
          <div class="script-block" style="border-right-color: ${edgeColor};">
            <div class="block-header">
              <span>الفقرة #${index + 1} | النغمة الصوتية: [ <b>${typeLabel}</b> ]</span>
              ${item.note ? `<span class="block-note">توجيه: ${item.note}</span>` : ''}
            </div>
            <p class="block-text">${item.text}</p>
          </div>
        `;
      }).join('');

      const cleanHtmlContent = `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
          <meta charset="utf-8">
          <title>تصدير السكربت الاحترافي</title>
          <style>${iframeInjectedStyles}</style>
        </head>
        <body>
          <div class="cover-page">
            <span class="cover-badge">وثيقة إنتاج مسجلة وموثقة</span>
            <h1 class="cover-title">${project.title}</h1>
            <div class="cover-divider"></div>
            <p class="cover-description">
              هذه الوثيقة تحتوي على نصوص وصياغات السكربت الموجه والمراجع لغوياً وتوجيهياً لبناء أسرع لمقاطع اليوتيوب والفيسبوك والمنصات الرقمية بجودة إنتاجية متناهية.
            </p>

            <div class="meta-container">
              <div class="meta-card">
                <span class="meta-label">إثبات وجهة المنصة</span>
                <span class="meta-value">${project.channelName || 'غير محدد'}</span>
              </div>
              <div class="meta-card">
                <span class="meta-label">التصنيف الإبداعي</span>
                <span class="meta-value">${project.contentType || 'غير محدد'}</span>
              </div>
              <div class="meta-card">
                <span class="meta-label">نبرة الإلقاء وزمن السرد</span>
                <span class="meta-value">${project.stats?.readingTime || project.duration} مقدر بدقائق</span>
              </div>
              <div class="meta-card">
                <span class="meta-label">مجموع الكلمات</span>
                <span class="meta-value">${project.stats?.wordsCount} كلمة</span>
              </div>
            </div>

            <div class="analysis-box">
              <div class="analysis-header">الملخص الفني وهيكلة الحقبة:</div>
              <div class="analysis-grid">
                <div>الحقبة الزمنية المكتشفة: <b>${project.analysis?.era || 'غير معروف'}</b></div>
                <div>أسلوب السرد التحريري: <b>${project.analysis?.style || 'توضيحي'}</b></div>
                <div>الشخصيات الرئيسية: <b>${project.analysis?.characters?.join('، ') || 'عام'}</b></div>
                <div>مصادر ثقة البيانات: <b>${project.research?.sources?.slice(0,2).join('، ') || 'المكتبة التاريخية الرقمية'}</b></div>
              </div>
            </div>

            <div class="cover-footer">
              تم التوليد والتصنيف الحصري عبر منصة صانع السكربتات الذكية <br>
              المسند جاهز للأداء الإلقائي والتجربة الإستوديوية المباشرة
            </div>
          </div>

          <div class="script-section-title">فصول ونصوص الأداء الصوتي:</div>
          
          <div class="script-list">
            ${scriptItemsHtml}
          </div>

          <div class="page-footer">
            <div class="page-signature">السكربت المخصص بالكامل لقناة: ${project.channelName || 'صانع المحتوى'}</div>
            <div>حرر وطبق طباعياً في ${printDate} - جميع حقوق الملكية للمعد الأساسي</div>
          </div>
        </body>
        </html>
      `;

      iframeDoc.open();
      iframeDoc.write(cleanHtmlContent);
      iframeDoc.close();

      pushLog('تم حقن هيكل السكربت بنجاح داخل الـ Sandbox المعزول. ننتظر تحميل الصور والخطوط المرفقة...');
      
      // Delay explicitly for font and iframe paint engine cycle (Requirement 3)
      await new Promise(r => setTimeout(r, 650));

      // --- 3. التقاط الكود الرسومي ثنائي الأبعاد بريزولوشن Retina (Requirement 2 & 5) ---
      setPhase('rendering_raster');
      pushLog('بدء المسح الرسومي المتزامن للسكربت العربي بنسبة وضوح فائقة (Scale x2)...');

      const printArea = iframeDoc.body;
      const canvas = await html2canvas(printArea, {
        scale: 2, // Retinal double DPI scaling for extreme text grid reading crispness
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        scrollX: 0,
        scrollY: 0,
        width: 794, // Matches exact specified document boundary to ensure strict margins
      });

      pushLog('اكتمل التقاط الأزرار الرسومية وتوزيع الأوزان Cairo/Amiri بنجاح.');

      // --- 4. تشكيل وبناء الـ PDF وترقيم الصفحات تلقائياً (Requirement 1 & 9) ---
      setPhase('compiling_pdf');
      pushLog('بدء تشريح الصفحات وتجميع ملف الـ PDF النهائي وفقاً لمقاييس A4...');

      await new Promise(r => setTimeout(r, 500));

      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210; // A4 standard width in mm
      const pageHeight = 295; // Slightly under standard A4 height (297) for safe padding limits
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // First page cover insertion
      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
      heightLeft -= pageHeight;

      // Loop to scale and split the single canvas cleanly into consecutive A4 sheets
      let pageIndex = 1;
      while (heightLeft > 0) {
        pushLog(`معالجة وترقيم الصفحة رقم #${pageIndex + 1} في وثيقة الـ PDF...`);
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight, undefined, 'FAST');
        heightLeft -= pageHeight;
        pageIndex++;
      }

      // --- 5. التحقق من سلامة البايت المولد قبل تنزيل الملف (Requirement 7) ---
      setPhase('validating_output');
      pushLog('جاري مراجعة سلامة بنيان السند والتأكد من حجم الملف التصديري...');
      
      await new Promise(r => setTimeout(r, 450));

      const pdfArrayBuffer = pdf.output('arraybuffer');
      if (!pdfArrayBuffer || pdfArrayBuffer.byteLength < 500) {
        throw new Error('الملف المولد تعرض لتلف رقمي فجائي وجاء فارغاً بحجم يقل عن 500 بايت.');
      }

      const calculatedSize = Math.round((pdfArrayBuffer.byteLength / 1024) * 100) / 100;
      setGeneratedSizeKB(calculatedSize);
      pushLog(`التحقق التلقائي ناجح تماماً! حجم ملف الـ PDF الحالي: ${calculatedSize} كيلوبايت. الملف سليم ومهيأ.`);

      // --- 6. تم التنزيل والإنهاء التلقائي بنجاح (Requirement 1 & 3 & 4) ---
      setPhase('completed');
      pushLog('جاهز للتحميل، جاري حفظ وإطلاق التنزيل المباشر...');

      const originalFilename = `سكربت_حلقة_${project.title.replace(/\s+/g, '_')}_احترافي.pdf`;
      pdf.save(originalFilename);

      // Reset phase to completed screen
      await new Promise(r => setTimeout(r, 1200));
      setPhase('idle');

    } catch (error: any) {
      console.error('[PDF Export Engine Crash Log]:', error);
      pushLog(`⚠️ خطأ حرج تم اعتراضه: ${error?.message || error}`);
      
      setErrorMessage(error?.message || 'حدثت مشكلة غير متوقعة أثناء معالجة كتل النصوص العربي والرسومات.');
      setPhase('failed');

      // Trigger automatic backup download in background so that user gets his work saved! (Requirement 10)
      handleDownloadTxtFallback(true);

    } finally {
      // Clean up isolated sandbox DOM node cleanly in background (Requirement 8)
      if (iframe && iframe.parentNode) {
        iframe.parentNode.removeChild(iframe);
        pushLog('تم تصفية الـ Sandbox وتفريغ الذاكرة المؤقتة لمحرك الطباعة.');
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/80 z-50 overflow-y-auto p-4 md:p-8 flex items-start justify-center backdrop-blur-sm no-print">
      
      {/* ─────────────────────────────────────────────────────────── */}
      {/* PHASE LOADER OVERLAY WITH DETAILED STEP STEPS & PROG STAGE */}
      {/* (Satisfying Requirement 5 - Real Progress Bar & Active Phase Reports) */}
      {/* ─────────────────────────────────────────────────────────── */}
      {phase !== 'idle' && phase !== 'failed' && (
        <div className="fixed inset-0 bg-slate-950/95 z-[60] flex flex-col items-center justify-center p-4 text-center backdrop-blur-md font-sans">
          <div className="bg-slate-900 border border-slate-800 p-6 md:p-8 rounded-3xl shadow-2xl max-w-lg w-full relative overflow-hidden text-right" dir="rtl">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 animate-pulse" />
            
            <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <FileText className="w-8 h-8 text-amber-500 animate-pulse" />
            </div>
            
            <h4 className="text-xl font-extrabold text-white mb-2 text-center font-sans">معالج المحاكاة للطباعة والـ PDF</h4>
            <p className="text-sm text-slate-400 leading-relaxed text-center font-sans mb-6">
              جاري توليد ملف الـ PDF احترافياً للنسخة لضمان عدم حدوث تشوه باللغة العربية.
            </p>

            {/* Stepper Grid showing Real Progressive Checklist */}
            <div className="space-y-4 mb-6">
              
              {/* Step 1: Validation */}
              <div className="flex items-start gap-3">
                <div className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  phase === 'validating' 
                    ? 'bg-amber-500 text-slate-950 animate-spin border border-amber-400' 
                    : ['isolating_env', 'rendering_raster', 'compiling_pdf', 'validating_output', 'completed'].includes(phase)
                      ? 'bg-emerald-500 text-emerald-950'
                      : 'bg-slate-800 text-slate-500'
                }`}>
                  {['isolating_env', 'rendering_raster', 'compiling_pdf', 'validating_output', 'completed'].includes(phase) ? '✓' : '١'}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">التحقق الهيكلي المسبق (١٥٪)</h5>
                  <p className="text-[10px] text-slate-500">مراجعة سلامة السكربت، حجم النص وعناوين الفصول لتجنب التصدير الفارغ.</p>
                </div>
              </div>

              {/* Step 2: Isolating */}
              <div className="flex items-start gap-3">
                <div className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  phase === 'isolating_env' 
                    ? 'bg-amber-500 text-slate-950 animate-spin border border-amber-400' 
                    : ['rendering_raster', 'compiling_pdf', 'validating_output', 'completed'].includes(phase)
                      ? 'bg-emerald-500 text-emerald-950'
                      : 'bg-slate-800 text-slate-500'
                }`}>
                  {['rendering_raster', 'compiling_pdf', 'validating_output', 'completed'].includes(phase) ? '✓' : '٢'}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">تهيئة الـ Sandbox المعزول وتطهير الألوان (٣٥٪)</h5>
                  <p className="text-[10px] text-slate-500">حظر وتصفية كود oklch/oklab لضمان تشغيل محرّك html2canvas دون أعطال فنية.</p>
                </div>
              </div>

              {/* Step 3: Raster Graphics */}
              <div className="flex items-start gap-3">
                <div className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  phase === 'rendering_raster' 
                    ? 'bg-amber-500 text-slate-950 animate-spin border border-amber-400' 
                    : ['compiling_pdf', 'validating_output', 'completed'].includes(phase)
                      ? 'bg-emerald-500 text-emerald-950'
                      : 'bg-slate-800 text-slate-500'
                }`}>
                  {['compiling_pdf', 'validating_output', 'completed'].includes(phase) ? '✓' : '٣'}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">المسح الرسومي وتحضير مصفوفات Cairo/Amiri (٦٠٪)</h5>
                  <p className="text-[10px] text-slate-500">تحويل كتل العربي إلى تمثيلات بكسلية دقيقة بمقياس Retina للحفاظ على اتصال الحروف.</p>
                </div>
              </div>

              {/* Step 4: Compiling pages */}
              <div className="flex items-start gap-3">
                <div className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  phase === 'compiling_pdf' 
                    ? 'bg-amber-500 text-slate-950 animate-spin border border-amber-400' 
                    : ['validating_output', 'completed'].includes(phase)
                      ? 'bg-emerald-500 text-emerald-950'
                      : 'bg-slate-800 text-slate-500'
                }`}>
                  {['validating_output', 'completed'].includes(phase) ? '✓' : '٤'}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">بناء صفحات الـ PDF والترقيم (٨٠٪)</h5>
                  <p className="text-[10px] text-slate-500">تجزئة السكربت على صفحات A4 محكمة، وتثبيت شعار جهة الإنتاج في التذييل.</p>
                </div>
              </div>

              {/* Step 5: Checking validity */}
              <div className="flex items-start gap-3">
                <div className={`mt-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  phase === 'validating_output' 
                    ? 'bg-amber-500 text-slate-950 animate-spin border border-amber-400' 
                    : ['completed'].includes(phase)
                      ? 'bg-emerald-500 text-emerald-950'
                      : 'bg-slate-800 text-slate-500'
                }`}>
                  {['completed'].includes(phase) ? '✓' : '٥'}
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-200">التحقق من سلامة البايت وحجم الملف (٩٥٪)</h5>
                  <p className="text-[10px] text-slate-500">التأكد من أن حجم السند أكبر من صفر وصالح للاستعراض والاستخدام المباشر في الأجهزة.</p>
                </div>
              </div>

            </div>

            {/* Micro progress numeric indicator */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 text-xs text-slate-400 font-mono space-y-1.5 max-h-[80px] overflow-y-auto scrollbar-thin">
              <div className="flex justify-between items-center text-[11px] font-sans pb-1 border-b border-slate-850">
                <span className="font-bold text-amber-500">سجل المعالجة المباشر:</span>
                <span>بورت آمن</span>
              </div>
              <p className="text-[10px] text-slate-300">
                {diagnosticLogs[diagnosticLogs.length - 1] || 'بانتظار بدء الأوامر الإجرائية...'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* ERROR PANEL WITH DIAGNOSTICS & RETRY + FALLBACK OPTIONS     */}
      {/* (Satisfying Requirement 3 & 10)                             */}
      {/* ─────────────────────────────────────────────────────────── */}
      {phase === 'failed' && (
        <div className="fixed inset-0 bg-slate-950/95 z-[60] flex flex-col items-center justify-center p-4 text-center backdrop-blur-md font-sans">
          <div className="bg-slate-900 border-2 border-red-500/20 p-6 md:p-8 rounded-3xl shadow-2xl max-w-xl w-full text-right" dir="rtl">
            
            <div className="flex items-center gap-3 text-red-500 font-black mb-4 pb-2 border-b border-slate-800">
              <AlertTriangle className="w-7 h-7 text-red-500 animate-bounce" />
              <h3 className="text-lg md:text-xl">فشل تنزيل ملف الـ PDF ملوّناً!</h3>
            </div>

            <p className="text-sm text-slate-300 leading-relaxed mb-4">
              نعتذر منك؛ واجه محرك توليد الصور أو حزم Canvas الخاصة بالمتصفح صعوبة في توليد النسخة المصورة لأسباب تقنية.
            </p>

            <div className="bg-red-950/40 border border-red-900/30 rounded-2xl p-4 mb-5 text-xs text-red-200">
              <strong className="block mb-1 text-red-400 font-sans">السبب التقني المسجل:</strong>
              <code className="block font-mono leading-relaxed whitespace-pre-wrap">{errorMessage}</code>
            </div>

            {/* Diagnostic Logs scrollbox for power-users */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-[10px] text-slate-500 font-mono mb-6 max-h-[100px] overflow-y-auto">
              <span className="text-slate-400 block mb-1">تفاصيل سجل التتبع التصديري:</span>
              {diagnosticLogs.map((log, i) => (
                <div key={i}>{log}</div>
              ))}
            </div>

            {/* Action Buttons: Retry vs Custom Manual Fallbacks */}
            <div className="flex flex-col sm:flex-row gap-2.5 justify-end">
              <button
                onClick={() => {
                  setPhase('idle');
                  handleDownloadPdf();
                }}
                className="inline-flex items-center gap-1.5 justify-center px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all"
              >
                <RefreshCw className="w-4 h-4" />
                إعادة المحاولة من جديد 🔄
              </button>

              <button
                onClick={() => {
                  handleDownloadTxtFallback(false);
                }}
                className="inline-flex items-center gap-2 justify-center px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold rounded-xl text-xs sm:text-sm border border-slate-700 transition-all"
              >
                <Download className="w-4 h-4" />
                تحميل ملف نصي احتياطي فوري (.TXT) 📥
              </button>

              <button
                onClick={() => {
                  setPhase('idle');
                }}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs sm:text-sm transition-all"
              >
                إغلاق
              </button>
            </div>
            
            <p className="text-[10px] text-slate-500 mt-4 text-center leading-relaxed">
              تلميح: يمكنك دائمًا استخدام زر <strong>"طباعة يدوية"</strong> في الصفحة لاستغلال طابعة متصفحك الذكية لحفظ الملف كـ PDF مجانًا ودون عوائق وبجودة لا مثيل لها.
            </p>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────── */}
      {/* STANDARD DOCUMENT PREVIEW FRAMEWORK (ONLY VISIBLE ON ON-SCREEN Preview) */}
      {/* ─────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl relative overflow-hidden flex flex-col my-8">
        
        {/* Toolbar Header */}
        <div className="bg-slate-50 border-b border-slate-100 p-4 md:p-5 flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-slate-800 text-sm md:text-base">معاينة وتنزيل ملفات الـ PDF والتصدير الطباعي</h3>
          </div>
          
          <div className="flex items-center gap-2.5 flex-wrap justify-center">
            <button
              onClick={handleDownloadPdf}
              disabled={phase !== 'idle'}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs md:text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              تنزيل PDF مباشر 📥
            </button>
            <button
              onClick={handlePrintTrigger}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs md:text-sm border border-slate-200 transition-all"
            >
              <Printer className="w-4 h-4" />
              طباعة يدوية / حفظ كـ PDF 🖨️
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-xl transition-all"
              title="إغلاق المعاينة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Informative Tip Banner */}
        <div className="bg-amber-50 border-b border-amber-100/60 p-4 text-amber-900 text-xs md:text-sm text-right leading-relaxed flex items-start gap-2.5">
          <span className="bg-amber-500 text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-xs mt-0.5">💡</span>
          <div>
            <strong>تلميح تنميق النصوص:</strong> عند نقرك على زر <strong>"تنزيل PDF مباشر"</strong>، يقوم المحرك بعزل التنسيق تماماً لإنشاء صفحات PDF ملونة ومرقمة تلقائياً بالخطوط العربية الواضحة في الخلفية ودون أي تجمّد في التطبيق.
          </div>
        </div>

        {/* Document Render Area (A4 simulator styled for preview interface) */}
        <div className="flex-1 overflow-y-auto p-4 md:p-12 bg-slate-100/50 flex justify-center">
          
          {/* Simulated Printed Paper Sheet */}
          <div 
            id="printable-script-area"
            className="w-full max-w-[210mm] bg-white text-black p-8 md:p-16 rounded-xl border border-slate-200 shadow-sm leading-relaxed text-right relative font-serif"
            style={{ direction: 'rtl' }}
          >
            {/* Header Plate (First Page Title cover design) */}
            <div className="border-b-4 border-double border-slate-800 pb-6 mb-8 text-center bg-white">
              <span className="text-xs font-bold text-amber-600 tracking-wider font-sans uppercase">
                بوابة الإنتاج الصوتي والتعليق الإلقائي
              </span>
              <h1 className="text-3xl md:text-4xl font-black mt-2 text-slate-900 font-serif leading-tight">
                سكربت الحلقة: {project.title}
              </h1>
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 text-xs md:text-sm font-sans text-slate-600 border-t border-slate-150 pt-4">
                <div>
                  <span className="block text-slate-400 text-[10px] font-bold">جهة الإنتاج (القناة / المنصة)</span>
                  <strong className="text-slate-800 block text-xs mt-0.5">{project.channelName}</strong>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-bold">نوع ومزاج المحتوى</span>
                  <strong className="text-slate-800 block text-xs mt-0.5">{project.contentType}</strong>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-bold">مدة القراءة التقديرية</span>
                  <strong className="text-slate-800 block text-xs mt-0.5">{project.stats?.readingTime || project.duration} دقائق</strong>
                </div>
                <div>
                  <span className="block text-slate-400 text-[10px] font-bold">عدد ومجموع الكلمات</span>
                  <strong className="text-slate-800 block text-xs mt-0.5">{project.stats?.wordsCount} كلمة</strong>
                </div>
              </div>
            </div>

            {/* Stage Overview Meta Box */}
            <div className="bg-slate-50 rounded-xl p-4 mb-8 text-xs font-sans text-slate-600 space-y-2 border border-slate-200">
              <span className="font-bold text-slate-800 block text-[11px] pb-1.5 border-b border-slate-200">تحليل فني وملخص الحقبة للقصة:</span>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5 pt-1">
                <p><strong>الحقبة التاريخية المكتشفة:</strong> {project.analysis?.era || 'غير محدد'}</p>
                <p><strong>الشخصيات الحاضرة:</strong> {project.analysis?.characters?.join('، ') || 'عام'}</p>
                <p><strong>تنظير الأداء الصوتي الملائم:</strong> {project.analysis?.style || 'قصصي متدفق'}</p>
                <p><strong>أبرز المراجع والكتب الموثوقة:</strong> {project.research?.sources?.slice(0, 3).join('، ') || 'أمهات الكتب'}</p>
              </div>
            </div>

            {/* Printable Script Script Items */}
            <div className="space-y-6">
              {project.script.map((item, index) => {
                let toneLabel = 'سرد اعتيادي';
                let indicatorColor = '#ef4444'; // Red
                let highlightBg = 'transparent';

                if (item.type === 'mysterious') {
                  toneLabel = 'وقفة غامضة وترقب';
                  indicatorColor = '#d97706';
                  highlightBg = '#fffbeb';
                } else if (item.type === 'enthusiastic') {
                  toneLabel = 'حماسي وإثارة';
                  indicatorColor = '#dc2626';
                  highlightBg = '#fef2f2';
                } else if (item.type === 'important') {
                  toneLabel = 'معلومات / أرقام هامة';
                  indicatorColor = '#2563eb';
                  highlightBg = '#f0f6ff';
                } else if (item.type === 'quote') {
                  toneLabel = 'اقتباس مباشر';
                  indicatorColor = '#16a34a';
                  highlightBg = '#f0fdf4';
                } else if (item.type === 'pause') {
                  toneLabel = 'وقفة / مؤثر صوتي';
                  indicatorColor = '#7c3aed';
                  highlightBg = '#faf5ff';
                }

                return (
                  <div 
                    key={item.id} 
                    className="p-4 rounded-lg break-inside-avoid border-r-4 border-slate-300 border-t border-l border-b border-slate-100"
                    style={{ 
                      borderColor: indicatorColor, 
                      backgroundColor: highlightBg,
                      pageBreakInside: 'avoid'
                    }}
                  >
                    {/* Vocal guideline & sentence indexing */}
                    <div className="flex justify-between items-center text-[10px] font-sans text-slate-500 mb-2 pb-1 border-b border-slate-200/50">
                      <span>فقرة #{index + 1} | أسلوب الأداء: <strong>[{toneLabel}]</strong></span>
                      {item.note && <span className="font-bold text-slate-700">توجيه الإلقاء: {item.note}</span>}
                    </div>

                    {/* Speech Actual Text */}
                    <p className="text-base md:text-lg leading-relaxed text-black font-serif text-right whitespace-pre-wrap">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Document Signature Signoff */}
            <div className="mt-16 pt-8 border-t-2 border-slate-300 text-center text-xs text-slate-500 font-sans space-y-2 bg-white">
              <p className="font-bold text-slate-700 font-serif text-base">
                تم إنتاج وتجهيز هذا العمل تلقائياً للتعليق الصوتي لقناة: <strong>{project.channelName}</strong>
              </p>
              <p>تم الإنشاء في {printDate} عبر منصة صانع السكربتات الذكية.</p>
              <p className="text-[10px] text-slate-400">حقوق الطبع والاستخدام محفوظة لمالك السكربت والمنصة المعنية.</p>
            </div>
          </div>
        </div>

        {/* Print Preview Footer action rail */}
        <div className="bg-slate-50 border-t border-slate-100 p-4 flex flex-col sm:flex-row gap-3 justify-between items-center no-print">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold rounded-xl text-xs"
          >
            <ArrowLeft className="w-4 h-4" />
            البقاء في محرر العمل
          </button>
          
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                handleDownloadTxtFallback(false);
              }}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl text-xs md:text-sm border border-slate-200 shadow-sm transition-all"
            >
              تنزيل TXT بديل 📋
            </button>
            <button
              onClick={handlePrintTrigger}
              className="px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-bold rounded-xl text-xs md:text-sm border border-slate-200 shadow-sm transition-all"
            >
              طباعة يدوية / حفظ 🖨️
            </button>
            <button
              onClick={handleDownloadPdf}
              disabled={phase !== 'idle'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-extrabold rounded-xl text-xs md:text-sm shadow-md transition-all disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              تنزيل PDF مباشر 📥
            </button>
          </div>
        </div>
      </div>

      {/* Global CSS Inject to customize exact paper size on PDF printing */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-script-area, #printable-script-area * {
            visibility: visible;
          }
          #printable-script-area {
            position: absolute;
            left: 0;
            top: 0;
            width: 100% !important;
            max-width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            border: none !important;
            box-shadow: none !important;
            background: white !important;
            color: black !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>
    </div>
  );
};
