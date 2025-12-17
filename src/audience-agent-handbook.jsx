import React, { useState, useEffect } from 'react';
import { Globe, CheckCircle, XCircle, AlertCircle, Send, TrendingUp, Sparkles, ChevronDown, Copy, Check, ArrowUp } from 'lucide-react';

const AudienceAgentHandbook = () => {
  const [language, setLanguage] = useState('en');
  const [quizPrompt, setQuizPrompt] = useState('');
  const [quizResult, setQuizResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedSections, setExpandedSections] = useState({});
  const [copiedPrompts, setCopiedPrompts] = useState({});
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeSection, setActiveSection] = useState('intro');

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      // Detect active section
      const sections = ['intro', 'section1', 'section2', 'section3', 'section4', 'section5', 'quickref', 'quiz'];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const element = document.getElementById(sectionId);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    handleScroll(); // Initial check
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const analyzePrompt = (prompt) => {
    setIsAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      let score = 50;
      let feedback = [];
      let positives = [];
      
      const lowerPrompt = prompt.toLowerCase();
      
      // Positive indicators
      if (lowerPrompt.includes('create') || lowerPrompt.includes('segment') || lowerPrompt.includes('analyze')) {
        score += 10;
        positives.push(language === 'en' ? 'Clear objective stated' : 'Objetivo claro establecido');
      }
      
      if (lowerPrompt.match(/\d+\s*(days?|weeks?|months?|años?|días?|meses?|semanas?)/)) {
        score += 10;
        positives.push(language === 'en' ? 'Specific timeframe included' : 'Marco temporal específico incluido');
      }
      
      if (lowerPrompt.match(/\$\d+|>\s*\d+|<\s*\d+|between\s+\d+/)) {
        score += 10;
        positives.push(language === 'en' ? 'Quantitative criteria specified' : 'Criterios cuantitativos especificados');
      }
      
      if ((lowerPrompt.match(/and|y/g) || []).length >= 2) {
        score += 10;
        positives.push(language === 'en' ? 'Multiple conditions defined' : 'Múltiples condiciones definidas');
      }
      
      if (lowerPrompt.match(/auto insurance|home insurance|motorcycle|boat|rv|pet insurance|renters|condo|seguro de auto|seguro de hogar|motocicleta|自動車保険|住宅保険|バイク保険/) || lowerPrompt.match(/quote|coverage|policy|bundle|oem parts|comprehensive|collision|liability|cotización|cobertura|póliza|見積もり|補償|ポリシー/)) {
        score += 5;
        positives.push(language === 'en' ? 'Specific insurance products mentioned' : language === 'es' ? 'Productos de seguro específicos mencionados' : '具体的な保険商品が記載されている');
      }
      
      if (lowerPrompt.includes('email') || lowerPrompt.includes('correo') || lowerPrompt.includes('gmail') || lowerPrompt.includes('city') || lowerPrompt.includes('ciudad')) {
        score += 5;
        positives.push(language === 'en' ? 'Relevant data fields identified' : 'Campos de datos relevantes identificados');
      }
      
      // Negative indicators
      if (lowerPrompt.match(/maybe|perhaps|might|tal vez|quizás|posiblemente/)) {
        score -= 10;
        feedback.push(language === 'en' ? 'Remove uncertain language (maybe, perhaps)' : 'Eliminar lenguaje incierto (tal vez, quizás)');
      }
      
      if (lowerPrompt.match(/good|better|best|mejores?|buenos?/)) {
        score -= 10;
        feedback.push(language === 'en' ? 'Avoid vague qualifiers - be specific' : 'Evitar calificadores vagos - ser específico');
      }
      
      if (!lowerPrompt.match(/create|analyze|show|find|crea|analiza|muestra|encuentra/)) {
        score -= 15;
        feedback.push(language === 'en' ? 'Start with a clear action verb' : 'Comenzar con un verbo de acción claro');
      }
      
      if (prompt.length < 20) {
        score -= 15;
        feedback.push(language === 'en' ? 'Prompt is too short - add more detail' : 'Prompt muy corto - agregar más detalle');
      }
      
      if (prompt.split(' ').length > 100) {
        score -= 10;
        feedback.push(language === 'en' ? 'Prompt is too long - break into steps' : 'Prompt muy largo - dividir en pasos');
      }
      
      // Cap score between 0 and 100
      score = Math.max(0, Math.min(100, score));
      
      let rating = 'Poor';
      let color = 'red';
      
      if (score >= 80) {
        rating = language === 'en' ? 'Excellent' : 'Excelente';
        color = 'green';
      } else if (score >= 60) {
        rating = language === 'en' ? 'Good' : 'Bueno';
        color = 'blue';
      } else if (score >= 40) {
        rating = language === 'en' ? 'Fair' : 'Regular';
        color = 'yellow';
      } else {
        rating = language === 'en' ? 'Needs Improvement' : 'Necesita Mejora';
        color = 'red';
      }
      
      setQuizResult({
        score,
        rating,
        color,
        feedback,
        positives
      });
      setIsAnalyzing(false);
    }, 1000);
  };

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const copyPrompt = (promptId, text) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompts(prev => ({ ...prev, [promptId]: true }));
    setTimeout(() => {
      setCopiedPrompts(prev => ({ ...prev, [promptId]: false }));
    }, 2000);
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offsetTop = element.offsetTop - 100;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    }
  };

  const content = {
    en: {
      title: "Audience Agent Prompting Guide",
      subtitle: "Best Practices for Segment Creation & Analysis",
      company: "American Honda Insurance Solutions",
      toggle: "Español",
      toc: {
        title: "Table of Contents",
        items: [
          { id: 'intro', label: 'Introduction' },
          { id: 'section1', label: '1. Start Small' },
          { id: 'section2', label: '2. Add Rules' },
          { id: 'section3', label: '3. Complex Rules' },
          { id: 'section4', label: '4. Text Matching' },
          { id: 'section5', label: '5. Insights' },
          { id: 'quickref', label: 'Quick Reference' },
          { id: 'quiz', label: 'Test Your Skills' }
        ]
      },
      sections: {
        intro: {
          title: "Introduction",
          text: "The Audience Agent is a powerful tool for analyzing user data segments and creating new targeted segments. This guide will help you craft effective prompts to maximize its capabilities."
        },
        startSmall: {
          title: "1. Start with Simple Segment Rules",
          description: "Begin with basic, single-condition segments before adding complexity.",
          why: "Why this matters:",
          reasons: [
            "Easier to validate results and understand segment behavior",
            "Faster processing and clearer insights",
            "Provides a solid foundation for iterative refinement"
          ],
          goodExample: {
            title: "Good Prompt Example",
            prompt: "Create a segment of users who requested an auto insurance quote in the last 30 days.",
            explanation: "Clear, specific timeframe, single insurance product, one condition."
          },
          badExample: {
            title: "Avoid This Approach",
            prompt: "Show me everyone who might be interested in insurance or looked at something recently or visited the website.",
            explanation: "Too vague, multiple unclear conditions, no specific criteria."
          }
        },
        addRules: {
          title: "2. Incrementally Add More Rules",
          description: "Once your basic segment works, layer on additional conditions strategically.",
          approach: "Recommended Approach:",
          steps: [
            "Start with your core defining criteria",
            "Test and verify the initial segment",
            "Add one additional rule at a time",
            "Validate after each addition to track impact"
          ],
          goodExample: {
            title: "Good Progressive Prompt",
            prompt: "Refine the auto insurance quote segment to include only users who: (1) requested a quote in the last 30 days, AND (2) own a Honda or Acura vehicle, AND (3) are located in California.",
            explanation: "Clear progression, numbered conditions, logical AND relationship."
          },
          badExample: {
            title: "Avoid This Approach",
            prompt: "Add more filters to find better customers who need more coverage and are valuable.",
            explanation: "No specific criteria, vague qualifiers, unclear what 'better' means."
          }
        },
        complexRules: {
          title: "3. Handling Multiple Conditions (AND/OR Logic)",
          description: "When your segment requires complex logic, structure your prompt clearly.",
          bestPractices: "Best Practices:",
          tips: [
            "Explicitly state AND/OR relationships",
            "Use numbered lists for multiple conditions",
            "Group related conditions with parentheses",
            "Be specific about precedence when mixing AND/OR"
          ],
          goodExample: {
            title: "Good Complex Prompt",
            prompt: "Create a segment where users meet ALL of these criteria:\n1. Requested a quote for (Auto OR Motorcycle OR RV) insurance in last 60 days\n2. Interested in multi-policy bundle OR OEM parts coverage\n3. Located in (California OR Texas OR Florida)\n4. Age between 25-45 years",
            explanation: "Clear structure, explicit AND/OR operators, organized conditions, specific values."
          },
          badExample: {
            title: "Avoid This Approach",
            prompt: "Get users who looked at auto or maybe home insurance and want bundling and live in major states or are the right age.",
            explanation: "Ambiguous logic, unclear AND/OR relationships, vague quantities."
          }
        },
        stringMatching: {
          title: "4. Using Text Matching for Filters",
          description: "When filtering by text fields like email, location, or product names, be clear about what you're looking for.",
          guidelines: "Guidelines:",
          rules: [
            "Specify when you want exact matches vs. partial matches",
            "For email filtering, mention the domain or provider you want",
            "For locations, specify if you want cities, states, or regions",
            "When referencing product names, be as specific as possible"
          ],
          goodExample: {
            title: "Good Text Matching Prompt",
            prompt: "Create a segment of users with Gmail or Hotmail email addresses who requested comprehensive auto coverage with OEM parts option and live in or around Los Angeles.",
            explanation: "Clear intent about email domains, specific coverage type with option, flexible location matching ('in or around'). The agent can interpret 'Gmail' as matching '@gmail.com' and 'around Los Angeles' as the metro area."
          },
          badExample: {
            title: "Avoid This Approach",
            prompt: "Find people with emails and who looked at some insurance products in big cities.",
            explanation: "No specific email criteria, vague product reference ('some insurance products'), undefined cities."
          }
        },
        insights: {
          title: "5. Requesting Segment Insights",
          description: "When analyzing existing segments, be specific about what insights you need.",
          tips: "Effective Insight Requests:",
          points: [
            "Specify the metrics you want to analyze",
            "Define comparison groups if needed",
            "Set clear timeframes for analysis",
            "Ask for actionable recommendations"
          ],
          goodExample: {
            title: "Good Insight Prompt",
            prompt: "Analyze the 'Multi-Policy Bundle Prospects' segment and provide:\n1. Average quote request frequency in the last 90 days\n2. Most popular insurance products within this segment\n3. Geographic distribution across the United States\n4. Comparison with single-policy customers\n5. Recommendations for targeted campaigns",
            explanation: "Specific metrics requested, clear timeframe, structured format, asks for actionable insights."
          },
          badExample: {
            title: "Avoid This Approach",
            prompt: "Tell me about the insurance segment and what we should know.",
            explanation: "No specific metrics, no timeframe, too vague, unclear what information is needed."
          }
        },
        quickReference: {
          title: "Quick Reference: Prompt Structure Template",
          template: [
            "State your objective clearly (create segment / analyze segment)",
            "Define core criteria with explicit operators (AND/OR/CONTAINS/EQUALS)",
            "Use numbered lists for multiple conditions",
            "Specify quantitative thresholds precisely",
            "Include timeframes where relevant",
            "For insights: list specific metrics needed"
          ]
        },
        quiz: {
          title: "Test Your Prompt Skills",
          subtitle: "Enter a prompt below and get instant feedback on its quality",
          placeholder: "Example: Create a segment of users who requested an auto insurance quote in the last 30 days...",
          buttonText: "Analyze Prompt",
          analyzing: "Analyzing...",
          scoreLabel: "Prompt Quality Score",
          strengthsLabel: "Strengths",
          improvementsLabel: "Areas for Improvement",
          noStrengths: "No specific strengths detected. Try including clear objectives, timeframes, and specific criteria.",
          noImprovements: "Great prompt! No major improvements needed.",
          tryAnother: "Try another prompt to practice!"
        }
      },
      footer: "For any support contact Tushar - Forward Deployed Engineering"
    },
    ja: {
      title: "オーディエンスエージェントプロンプトガイド",
      subtitle: "セグメント作成と分析のベストプラクティス",
      company: "American Honda Insurance Solutions",
      toggle: "言語",
      toc: {
        title: "目次",
        items: [
          { id: 'intro', label: 'はじめに' },
          { id: 'section1', label: '1. シンプルに始める' },
          { id: 'section2', label: '2. ルールを追加' },
          { id: 'section3', label: '3. 複雑なルール' },
          { id: 'section4', label: '4. テキストマッチング' },
          { id: 'section5', label: '5. インサイト' },
          { id: 'quickref', label: 'クイックリファレンス' },
          { id: 'quiz', label: 'スキルをテスト' }
        ]
      },
      sections: {
        intro: {
          title: "はじめに",
          text: "オーディエンスエージェントは、ユーザーデータセグメントを分析し、新しいターゲットセグメントを作成するための強力なツールです。このガイドは、その機能を最大限に活用するための効果的なプロンプトの作成方法を説明します。"
        },
        startSmall: {
          title: "1. シンプルなセグメントルールから始める",
          description: "複雑さを追加する前に、基本的な単一条件のセグメントから始めましょう。",
          why: "重要な理由：",
          reasons: [
            "結果の検証とセグメントの動作理解が容易",
            "処理が高速で、より明確なインサイトが得られる",
            "反復的な改善のための強固な基盤を提供"
          ],
          goodExample: {
            title: "良いプロンプトの例",
            prompt: "過去30日間に自動車保険の見積もりを依頼したユーザーのセグメントを作成してください。",
            explanation: "明確で、具体的な期間、単一の保険商品、1つの条件。"
          },
          badExample: {
            title: "避けるべきアプローチ",
            prompt: "保険に興味があるかもしれない人、最近何かを見た人、またはウェブサイトを訪問した人を表示してください。",
            explanation: "曖昧すぎる、複数の不明確な条件、具体的な基準がない。"
          }
        },
        addRules: {
          title: "2. 段階的にルールを追加",
          description: "基本的なセグメントが機能したら、戦略的に追加条件をレイヤー化します。",
          approach: "推奨されるアプローチ：",
          steps: [
            "コアとなる定義基準から始める",
            "初期セグメントをテストして検証",
            "一度に1つの追加ルールを追加",
            "各追加後に検証して影響を追跡"
          ],
          goodExample: {
            title: "良い段階的プロンプト",
            prompt: "自動車保険見積もりセグメントを改良して、次の条件をすべて満たすユーザーのみを含めます：(1) 過去30日間に見積もりを依頼、かつ (2) ホンダまたはアキュラ車両を所有、かつ (3) カリフォルニア州に所在。",
            explanation: "明確な進行、番号付き条件、論理的なAND関係。"
          },
          badExample: {
            title: "避けるべきアプローチ",
            prompt: "より多くの補償が必要で、価値のある優良顧客を見つけるために、さらにフィルターを追加してください。",
            explanation: "具体的な基準がない、曖昧な修飾語、「優良」の意味が不明確。"
          }
        },
        complexRules: {
          title: "3. 複数条件の処理（AND/ORロジック）",
          description: "セグメントに複雑なロジックが必要な場合は、プロンプトを明確に構造化します。",
          bestPractices: "ベストプラクティス：",
          tips: [
            "AND/OR関係を明示的に記述",
            "複数の条件には番号付きリストを使用",
            "関連する条件は括弧でグループ化",
            "AND/ORを混在させる際は優先順位を明確に"
          ],
          goodExample: {
            title: "良い複雑なプロンプト",
            prompt: "次のすべての基準を満たすユーザーのセグメントを作成：\n1. 過去60日間に（自動車 または バイク または RV）保険の見積もりを依頼\n2. マルチポリシーバンドル または OEM部品補償に興味あり\n3. （カリフォルニア または テキサス または フロリダ）に所在\n4. 年齢25〜45歳",
            explanation: "明確な構造、明示的なAND/OR演算子、整理された条件、具体的な値。"
          },
          badExample: {
            title: "避けるべきアプローチ",
            prompt: "自動車または多分住宅保険を見て、バンドルが欲しくて、大きな州に住んでいるか適切な年齢のユーザーを取得してください。",
            explanation: "曖昧なロジック、不明確なAND/OR関係、曖昧な数量。"
          }
        },
        stringMatching: {
          title: "4. フィルターのテキストマッチング使用",
          description: "メール、場所、製品名などのテキストフィールドでフィルタリングする場合は、探しているものを明確にします。",
          guidelines: "ガイドライン：",
          rules: [
            "完全一致と部分一致のどちらが必要かを指定",
            "メールフィルタリングの場合、ドメインまたはプロバイダーを記載",
            "場所の場合、都市、州、地域のどれが必要かを指定",
            "製品名を参照する場合は、できるだけ具体的に"
          ],
          goodExample: {
            title: "良いテキストマッチングプロンプト",
            prompt: "GmailまたはHotmailのメールアドレスを持ち、OEM部品オプション付きの総合自動車補償を依頼し、ロサンゼルスまたはその周辺に住むユーザーのセグメントを作成してください。",
            explanation: "メールドメインについての明確な意図、オプション付きの具体的な補償タイプ、柔軟な場所マッチング（「周辺」）。エージェントは「Gmail」を「@gmail.com」と、「ロサンゼルス周辺」を都市圏として解釈できます。"
          },
          badExample: {
            title: "避けるべきアプローチ",
            prompt: "メールアドレスを持ち、いくつかの大都市で何かの保険商品を見た人を見つけてください。",
            explanation: "具体的なメール基準がない、曖昧な商品参照（「何かの保険商品」）、未定義の都市。"
          }
        },
        insights: {
          title: "5. セグメントインサイトのリクエスト",
          description: "既存のセグメントを分析する際は、必要なインサイトについて具体的に記述します。",
          tips: "効果的なインサイトリクエスト：",
          points: [
            "分析したいメトリクスを指定",
            "必要に応じて比較グループを定義",
            "分析の明確な期間を設定",
            "実行可能な推奨事項を依頼"
          ],
          goodExample: {
            title: "良いインサイトプロンプト",
            prompt: "「マルチポリシーバンドル見込み客」セグメントを分析し、次を提供してください：\n1. 過去90日間の平均見積もり依頼頻度\n2. このセグメント内の最も人気のある保険商品\n3. アメリカ全体での地理的分布\n4. 単一ポリシー顧客との比較\n5. ターゲットキャンペーンのための推奨事項",
            explanation: "具体的なメトリクスが要求され、明確な期間、構造化された形式、実行可能なインサイトを求める。"
          },
          badExample: {
            title: "避けるべきアプローチ",
            prompt: "保険セグメントについて教えてください、そして私たちが知るべきことは何ですか。",
            explanation: "具体的なメトリクスがない、期間がない、曖昧すぎる、必要な情報が不明確。"
          }
        },
        quickReference: {
          title: "クイックリファレンス：プロンプト構造テンプレート",
          template: [
            "目的を明確に述べる（セグメント作成/セグメント分析）",
            "明示的な演算子でコア基準を定義（AND/OR/CONTAINS/EQUALS）",
            "複数条件には番号付きリストを使用",
            "定量的閾値を正確に指定",
            "関連する場合は期間を含める",
            "インサイトの場合：必要な具体的メトリクスをリスト"
          ]
        },
        quiz: {
          title: "プロンプトスキルをテスト",
          subtitle: "以下にプロンプトを入力して、品質に関する即座のフィードバックを取得",
          placeholder: "例：過去30日間に自動車保険の見積もりを依頼したユーザーのセグメントを作成...",
          buttonText: "プロンプトを分析",
          analyzing: "分析中...",
          scoreLabel: "プロンプト品質スコア",
          strengthsLabel: "強み",
          improvementsLabel: "改善領域",
          noStrengths: "具体的な強みが検出されませんでした。明確な目的、期間、具体的な基準を含めてみてください。",
          noImprovements: "素晴らしいプロンプトです！大きな改善は不要です。",
          tryAnother: "練習のために別のプロンプトを試してみてください！"
        }
      },
      footer: "サポートが必要な場合は Tushar - Forward Deployed Engineering までご連絡ください"
    }
  };

  const t = content[language];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Top Header Bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src="/td-logo.png"
              alt="Treasure Data"
              className="h-12"
            />
            <div className="h-8 w-px bg-slate-300"></div>
            <h1 className="text-xl font-semibold text-slate-900">
              {t.title}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Globe size={18} className="text-slate-600" />
              <div className="flex gap-1 bg-slate-100 rounded-lg p-1">
                <button
                  onClick={() => setLanguage('en')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    language === 'en'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLanguage('ja')}
                  className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    language === 'ja'
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  日本語
                </button>
              </div>
            </div>
            <div className="h-8 w-px bg-slate-300"></div>
            <img
              src="/honda_logo.png"
              alt="Honda"
              className="h-10"
            />
          </div>
        </div>
      </div>

      {/* Subtitle Header */}
      <header className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <h2 className="text-2xl font-semibold mb-2">
            {t.subtitle}
          </h2>
          <p className="text-blue-100">{t.company}</p>
        </div>
      </header>

      {/* Main Content with Sidebar */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex gap-8">
        {/* Table of Contents Sidebar */}
        <aside className="hidden lg:block w-64 flex-shrink-0">
          <div className="sticky top-24 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-semibold text-slate-900 mb-4 uppercase tracking-wide">
              {t.toc.title}
            </h3>
            <nav className="space-y-2">
              {t.toc.items.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all ${
                    activeSection === item.id
                      ? 'bg-emerald-600 text-white font-medium shadow-sm'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 space-y-8">

        {/* Introduction */}
        <section id="intro" className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover-lift animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <Sparkles className="text-blue-600" size={28} />
            <h2 className="text-2xl font-semibold text-slate-900">
              {t.sections.intro.title}
            </h2>
          </div>
          <p className="text-slate-700 leading-relaxed">
            {t.sections.intro.text}
          </p>
        </section>

        {/* Section 1: Start Small */}
        <section id="section1" className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover-lift animate-fadeIn">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            {t.sections.startSmall.title}
          </h2>
          <p className="text-slate-700 mb-4">{t.sections.startSmall.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800 mb-2 flex items-center gap-2">
              <AlertCircle size={20} className="text-blue-600" />
              {t.sections.startSmall.why}
            </h3>
            <ul className="space-y-2 ml-7">
              {t.sections.startSmall.reasons.map((reason, idx) => (
                <li key={idx} className="text-slate-700">{reason}</li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={20} className="text-green-600" />
                <h4 className="font-semibold text-green-900">
                  {t.sections.startSmall.goodExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-green-200 relative group">
                <p className="text-sm text-slate-800 font-mono pr-8">
                  "{t.sections.startSmall.goodExample.prompt}"
                </p>
                <button
                  onClick={() => copyPrompt('start-good', t.sections.startSmall.goodExample.prompt)}
                  className="absolute top-2 right-2 p-1.5 rounded hover:bg-green-100 transition-colors opacity-0 group-hover:opacity-100"
                  title="Copy prompt"
                >
                  {copiedPrompts['start-good'] ? (
                    <Check size={16} className="text-green-600" />
                  ) : (
                    <Copy size={16} className="text-slate-600" />
                  )}
                </button>
              </div>
              <p className="text-sm text-green-800">
                {t.sections.startSmall.goodExample.explanation}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={20} className="text-red-600" />
                <h4 className="font-semibold text-red-900">
                  {t.sections.startSmall.badExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-red-200">
                <p className="text-sm text-slate-800 font-mono">
                  "{t.sections.startSmall.badExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-red-800">
                {t.sections.startSmall.badExample.explanation}
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: Add Rules */}
        <section id="section2" className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover-lift animate-fadeIn">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            {t.sections.addRules.title}
          </h2>
          <p className="text-slate-700 mb-4">{t.sections.addRules.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800 mb-3">
              {t.sections.addRules.approach}
            </h3>
            <div className="bg-slate-50 rounded-lg p-4 space-y-2">
              {t.sections.addRules.steps.map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <span className="flex-shrink-0 w-6 h-6 bg-slate-900 text-white rounded-full flex items-center justify-center text-sm font-semibold">
                    {idx + 1}
                  </span>
                  <p className="text-slate-700">{step}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={20} className="text-green-600" />
                <h4 className="font-semibold text-green-900">
                  {t.sections.addRules.goodExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-green-200">
                <p className="text-sm text-slate-800 font-mono whitespace-pre-line">
                  "{t.sections.addRules.goodExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-green-800">
                {t.sections.addRules.goodExample.explanation}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={20} className="text-red-600" />
                <h4 className="font-semibold text-red-900">
                  {t.sections.addRules.badExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-red-200">
                <p className="text-sm text-slate-800 font-mono">
                  "{t.sections.addRules.badExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-red-800">
                {t.sections.addRules.badExample.explanation}
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Complex Rules */}
        <section id="section3" className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover-lift animate-fadeIn">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            {t.sections.complexRules.title}
          </h2>
          <p className="text-slate-700 mb-4">{t.sections.complexRules.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800 mb-3">
              {t.sections.complexRules.bestPractices}
            </h3>
            <ul className="space-y-2 bg-slate-50 rounded-lg p-4">
              {t.sections.complexRules.tips.map((tip, idx) => (
                <li key={idx} className="text-slate-700 flex gap-2">
                  <span className="text-slate-900">•</span>
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={20} className="text-green-600" />
                <h4 className="font-semibold text-green-900">
                  {t.sections.complexRules.goodExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-green-200">
                <p className="text-sm text-slate-800 font-mono whitespace-pre-line">
                  "{t.sections.complexRules.goodExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-green-800">
                {t.sections.complexRules.goodExample.explanation}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={20} className="text-red-600" />
                <h4 className="font-semibold text-red-900">
                  {t.sections.complexRules.badExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-red-200">
                <p className="text-sm text-slate-800 font-mono">
                  "{t.sections.complexRules.badExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-red-800">
                {t.sections.complexRules.badExample.explanation}
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: String Matching */}
        <section id="section4" className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover-lift animate-fadeIn">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            {t.sections.stringMatching.title}
          </h2>
          <p className="text-slate-700 mb-4">{t.sections.stringMatching.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800 mb-3">
              {t.sections.stringMatching.guidelines}
            </h3>
            <ul className="space-y-2 bg-slate-50 rounded-lg p-4">
              {t.sections.stringMatching.rules.map((rule, idx) => (
                <li key={idx} className="text-slate-700 flex gap-2">
                  <span className="text-slate-900">•</span>
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={20} className="text-green-600" />
                <h4 className="font-semibold text-green-900">
                  {t.sections.stringMatching.goodExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-green-200">
                <p className="text-sm text-slate-800 font-mono whitespace-pre-line">
                  "{t.sections.stringMatching.goodExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-green-800">
                {t.sections.stringMatching.goodExample.explanation}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={20} className="text-red-600" />
                <h4 className="font-semibold text-red-900">
                  {t.sections.stringMatching.badExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-red-200">
                <p className="text-sm text-slate-800 font-mono">
                  "{t.sections.stringMatching.badExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-red-800">
                {t.sections.stringMatching.badExample.explanation}
              </p>
            </div>
          </div>
        </section>

        {/* Section 5: Insights */}
        <section id="section5" className="bg-white rounded-xl shadow-sm p-8 border border-slate-200 hover-lift animate-fadeIn">
          <h2 className="text-2xl font-semibold text-slate-900 mb-3">
            {t.sections.insights.title}
          </h2>
          <p className="text-slate-700 mb-4">{t.sections.insights.description}</p>
          
          <div className="mb-6">
            <h3 className="text-lg font-medium text-slate-800 mb-3">
              {t.sections.insights.tips}
            </h3>
            <ul className="space-y-2 bg-slate-50 rounded-lg p-4">
              {t.sections.insights.points.map((point, idx) => (
                <li key={idx} className="text-slate-700 flex gap-2">
                  <span className="text-slate-900">•</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={20} className="text-green-600" />
                <h4 className="font-semibold text-green-900">
                  {t.sections.insights.goodExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-green-200">
                <p className="text-sm text-slate-800 font-mono whitespace-pre-line">
                  "{t.sections.insights.goodExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-green-800">
                {t.sections.insights.goodExample.explanation}
              </p>
            </div>

            <div className="bg-red-50 border border-red-200 rounded-lg p-5 hover-lift transition-all">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={20} className="text-red-600" />
                <h4 className="font-semibold text-red-900">
                  {t.sections.insights.badExample.title}
                </h4>
              </div>
              <div className="bg-white rounded p-3 mb-3 border border-red-200">
                <p className="text-sm text-slate-800 font-mono">
                  "{t.sections.insights.badExample.prompt}"
                </p>
              </div>
              <p className="text-sm text-red-800">
                {t.sections.insights.badExample.explanation}
              </p>
            </div>
          </div>
        </section>

        {/* Quick Reference */}
        <section id="quickref" className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-8 text-white hover-lift animate-fadeIn">
          <h2 className="text-2xl font-semibold mb-4">
            {t.sections.quickReference.title}
          </h2>
          <div className="space-y-3">
            {t.sections.quickReference.template.map((item, idx) => (
              <div key={idx} className="flex gap-3 items-start animate-slideIn" style={{animationDelay: `${idx * 0.1}s`}}>
                <span className="flex-shrink-0 w-7 h-7 bg-white text-slate-900 rounded-full flex items-center justify-center text-sm font-bold hover:scale-110 transition-transform">
                  {idx + 1}
                </span>
                <p className="text-slate-100 pt-1">{item}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Interactive Quiz Section */}
        <section id="quiz" className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl shadow-lg p-8 text-white hover-lift animate-fadeIn">
          <div className="flex items-center gap-3 mb-4">
            <TrendingUp size={28} className="animate-bounce-subtle" />
            <h2 className="text-2xl font-semibold">
              {t.sections.quiz.title}
            </h2>
          </div>
          <p className="text-emerald-100 mb-6">
            {t.sections.quiz.subtitle}
          </p>

          <div className="bg-white rounded-lg p-6 shadow-xl">
            <textarea
              value={quizPrompt}
              onChange={(e) => setQuizPrompt(e.target.value)}
              placeholder={t.sections.quiz.placeholder}
              className="w-full h-32 p-4 border-2 border-slate-200 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-none transition-all"
            />

            <button
              onClick={() => analyzePrompt(quizPrompt)}
              disabled={!quizPrompt.trim() || isAnalyzing}
              className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 hover:shadow-lg disabled:bg-slate-300 disabled:cursor-not-allowed transition-all font-medium transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {isAnalyzing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t.sections.quiz.analyzing}
                </>
              ) : (
                <>
                  <Send size={20} />
                  {t.sections.quiz.buttonText}
                </>
              )}
            </button>

            {quizResult && (
              <div className="mt-6 space-y-4 animate-fadeIn">
                {/* Score Display */}
                <div className="bg-slate-50 rounded-lg p-6 border-2 border-slate-200">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-slate-700 font-medium">{t.sections.quiz.scoreLabel}</span>
                    <span className={`text-3xl font-bold ${
                      quizResult.color === 'green' ? 'text-green-600' : 
                      quizResult.color === 'blue' ? 'text-blue-600' : 
                      quizResult.color === 'yellow' ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {quizResult.score}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                    <div 
                      className={`h-3 rounded-full transition-all duration-1000 ${
                        quizResult.color === 'green' ? 'bg-green-600' : 
                        quizResult.color === 'blue' ? 'bg-blue-600' : 
                        quizResult.color === 'yellow' ? 'bg-yellow-600' : 
                        'bg-red-600'
                      }`}
                      style={{ width: `${quizResult.score}%` }}
                    ></div>
                  </div>
                  <p className={`text-center font-semibold ${
                    quizResult.color === 'green' ? 'text-green-700' : 
                    quizResult.color === 'blue' ? 'text-blue-700' : 
                    quizResult.color === 'yellow' ? 'text-yellow-700' : 
                    'text-red-700'
                  }`}>
                    {quizResult.rating}
                  </p>
                </div>

                {/* Strengths */}
                {quizResult.positives.length > 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <CheckCircle size={20} />
                      {t.sections.quiz.strengthsLabel}
                    </h4>
                    <ul className="space-y-2">
                      {quizResult.positives.map((positive, idx) => (
                        <li key={idx} className="text-green-800 flex gap-2">
                          <span>✓</span>
                          <span>{positive}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {quizResult.positives.length === 0 && (
                  <div className="bg-slate-100 border border-slate-300 rounded-lg p-5">
                    <p className="text-slate-700">{t.sections.quiz.noStrengths}</p>
                  </div>
                )}

                {/* Improvements */}
                {quizResult.feedback.length > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                    <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                      <AlertCircle size={20} />
                      {t.sections.quiz.improvementsLabel}
                    </h4>
                    <ul className="space-y-2">
                      {quizResult.feedback.map((item, idx) => (
                        <li key={idx} className="text-amber-800 flex gap-2">
                          <span>•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {quizResult.feedback.length === 0 && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-5 hover-lift transition-all">
                    <p className="text-green-800 font-medium">{t.sections.quiz.noImprovements}</p>
                  </div>
                )}

                <p className="text-center text-slate-600 text-sm pt-2">
                  {t.sections.quiz.tryAnother}
                </p>
              </div>
            )}
          </div>
        </section>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12">
        <div className="max-w-5xl mx-auto px-6 py-6">
          <div className="flex items-center justify-center gap-3">
            <p className="text-center text-slate-600 text-sm">
              For any support contact{' '}
              <a
                href="mailto:tushar.badhwar@treasure-data.com"
                className="text-emerald-600 hover:text-emerald-700 font-medium underline"
              >
                Tushar
              </a>
              {' '}- Forward Deployed Engineering
            </p>
            <img
              src="/td-logo.png"
              alt="Treasure Data"
              className="h-8"
            />
          </div>
        </div>
      </footer>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 p-3 bg-emerald-600 text-white rounded-full shadow-lg hover:bg-emerald-700 hover:shadow-xl transition-all transform hover:scale-110 active:scale-95 animate-fadeIn z-50"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </button>
      )}
    </div>
  );
};

export default AudienceAgentHandbook;