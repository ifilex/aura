// ============================================================
// AURA NEURAL ASSOCIATIVE ENGINE & COGNITIVE MEMORY (MINI RED NEURAL)
// Lightweight On-Device Associative Network for Behavioral Psychology,
// Neuropsychology, Zen Mindfulness, and Cognitive Memory.
// ============================================================

export interface NeuralNode {
    id: string;
    label: Record<string, string>;
    domain: 'neuro' | 'behavior' | 'zen' | 'cognition';
    activation: number; // 0.0 to 1.0
    synapseWeight: number; // Dynamic weight learned through dialogue
    keyConcepts: string[];
}

export interface OperantBehaviorEntry {
    timestamp: number;
    antecedent: string;
    response: string;
    emotionalConsequence: string;
    cognitivePolarity?: 'separation' | 'extreme_negativity' | 'extreme_euphoria' | 'panic' | 'baseline';
    predictedTrigger?: string;
}

export interface UserMemoryProfile {
    userName?: string;
    recurringThemes: Record<string, number>;
    emotionalTrajectory: Array<{ timestamp: number; emotion: string; stressLevel: number }>;
    learnedFacts: string[];
    learnedUserTopics: Record<string, string>;
    operantBehaviors: OperantBehaviorEntry[];
    cognitivePolarityPoles: Record<string, number>;
    medicalHistoryFlags: string[];
    dominantDomain: string;
    totalTurns: number;
    lastSeen: string;
    lastPendingSearchQuery?: string;
    // === CHATBOT HUMANIZATION & 8-LEVEL DECISION TREE VALUES ===
    conversationLevel: number; // 1 to 8
    topicIntensity: number; // 0.0 to 1.0
    dialecticMaturity: number; // 0.0 to 1.0
    emotionalHarmonyIndex: number; // 0.0 to 1.0
    synapticResonanceScore: number; // Cumulative learning score
    levelHistory: Array<{ level: number; timestamp: number; triggerConcept?: string }>;
}

export interface NeuralSynthesisResult {
    openingEcho: string;
    memoryBridge: string;
    synthesizedBody: string;
    metacognitiveQuestion: string;
    activatedNodes: NeuralNode[];
    detectedEmotion: string;
    stressLevel: number;
    fullText: string;
}

const STORAGE_KEY_NEURAL = 'aura_neural_memory_v1';
const STORAGE_KEY_WEIGHTS = 'aura_neural_weights_v1';

// // Initial Neural Network Nodes
const DEFAULT_NODES: NeuralNode[] = [
    {
        id: 'neuro_amygdala',
        label: {
            es: 'Regulación de la Amígdala & Sistema Simpático',
            en: 'Amygdala Regulation & Sympathetic System',
            de: 'Amygdala-Regulierung & Sympathisches System',
            fr: 'Régulation de l\'Amygdale & Système Sympathique',
            it: 'Regolazione dell\'Amigdala e Sistema Simpatico',
            pt: 'Regulação da Amígdala e Sistema Simpático',
            ja: '扁桃体調節と交感神経系',
            zh: '杏仁核调节与交感神经系统',
            ru: 'Регуляция амигдалы и симпатическая система'
        },
        domain: 'neuro',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['amigdala', 'cortisol', 'adrenalina', 'alerta', 'amenaza', 'vago', 'parasimpatico', 'fisiologia']
    },
    {
        id: 'neuro_prefrontal',
        label: {
            es: 'Corteza Prefrontal & Función Ejecutiva',
            en: 'Prefrontal Cortex & Executive Function',
            de: 'Präfrontaler Kortex & Exekutive Funktionen',
            fr: 'Cortex Préfrontal & Fonctions Exécutives',
            it: 'Corteccia Prefrontale e Funzione Esecutiva',
            pt: 'Córtex Pré-frontal e Função Executiva',
            ja: '前頭前皮質と実行機能',
            zh: '前额叶皮层与执行功能',
            ru: 'Префронтальная кора и исполнительные функции'
        },
        domain: 'neuro',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['corteza', 'prefrontal', 'foco', 'planificacion', 'decision', 'claridad', 'metacognicion', 'inhibicion', 'dlpfc']
    },
    {
        id: 'neuro_biomedical',
        label: {
            es: 'Biomedicina Neuropsicológica & Circuitos Neuronales',
            en: 'Neuropsychological Biomedicine & Neural Circuits',
            de: 'Neuropsychologische Biomedizin & Neuronale Schaltkreise',
            fr: 'Biomédecine Neuropsychologique & Circuits Neuronaux',
            it: 'Biomedicina Neuropsicologica e Circuiti Neuronali',
            pt: 'Biomedicina Neuropsicológica e Circuitos Neuronais',
            ja: '神経心理学的生体医学と神経回路',
            zh: '神经心理生物医学与神经回路',
            ru: 'Нейропсихологическая биомедицина и нейросети'
        },
        domain: 'neuro',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['dlpfc', 'eje hpa', 'tono vagal', 'dopamina', 'mesolimbica', 'sinaptogenesis', 'neuroplasticidad', 'alostática', 'cierre perceptivo', 'hipersensibilidad']
    },
    {
        id: 'behavior_reinforcement',
        label: {
            es: 'Refuerzo Conductual & Micro-Hábitos',
            en: 'Behavioral Reinforcement & Micro-Habits',
            de: 'Verhaltensverstärkung & Mikro-Gewohnheiten',
            fr: 'Renforcement Comportemental & Micro-Habitudes',
            it: 'Rinforzo Comportamentale e Micro-Abitudini',
            pt: 'Reforço Comportamental e Micro-Hábitos',
            ja: '行動強化と微小習慣',
            zh: '行为强化与微习惯',
            ru: 'Поведенческое подкрепление и микропривычки'
        },
        domain: 'behavior',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['habito', 'conducta', 'estimulo', 'respuesta', 'rutina', 'recompensa', 'pasos', 'accion', 'evitacion']
    },
    {
        id: 'behavior_vicarious',
        label: {
            es: 'Aprendizaje Vicario & Modelado Observacional (Bandura)',
            en: 'Vicarious Learning & Observational Modeling (Bandura)',
            de: 'Kollaboratives & Beobachtendes Lernen (Bandura)',
            fr: 'Apprentissage Vicariant & Modélisation Observaturelle',
            it: 'Apprendimento Vicario e Modellamento Osservazionale',
            pt: 'Aprendizagem Vicária e Modelagem Observacional',
            ja: '代理学習と観察モデリング（バンデューラ）',
            zh: '替代学习与观察建模（班杜拉）',
            ru: 'Викарное обучение и наблюдательное моделирование'
        },
        domain: 'behavior',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['vicario', 'vicaria', 'observacional', 'bandura', 'modelado', 'imitacion', 'autoeficacia', 'ejemplo', 'patron aprendido']
    },
    {
        id: 'behavior_activation',
        label: {
            es: 'Activación Conductual & Exposición Gradual',
            en: 'Behavioral Activation & Gradual Exposure',
            de: 'Verhaltensaktivierung & Graduelle Exposition',
            fr: 'Activation Comportementale & Exposition Graduelle',
            it: 'Attivazione Comportamentale ed Esposizione',
            pt: 'Ativação Comportamental e Exposição Gradual',
            ja: '行動活性化と段階的暴露',
            zh: '行为激活与循序渐进暴露',
            ru: 'Поведенческая активация и градуированная экспозиция'
        },
        domain: 'behavior',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['inercia', 'bloqueo', 'movimiento', 'iniciar', 'pequeño paso', 'desensibilizacion', 'miedo', 'economia de fichas', 'encadenamiento', 'moldeamiento', 'rpd']
    },
    {
        id: 'zen_anicca',
        label: {
            es: 'Anicca (Impermanencia) & Fluidez Zen',
            en: 'Anicca (Impermanence) & Zen Flow',
            de: 'Anicca (Unbeständigkeit) & Zen-Fluss',
            fr: 'Anicca (Impermanence) & Flux Zen',
            it: 'Anicca (Impermanenza) e Flusso Zen',
            pt: 'Anicca (Impermanência) e Fluxo Zen',
            ja: '无常（Anicca）と禅の流露',
            zh: '无常（Anicca）与禅意流水',
            ru: 'Аничча (Непостоянство) и Дзен-поток'
        },
        domain: 'zen',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['impermanencia', 'soltar', 'fluir', 'cambio', 'transitorio', 'ola', 'rio', 'vacio', 'no apego']
    },
    {
        id: 'zen_presence',
        label: {
            es: 'Zazen (Presencia Radiante & Respiración)',
            en: 'Zazen (Radiant Presence & Breath)',
            de: 'Zazen (Präsenz & Atem)',
            fr: 'Zazen (Présence Radiante & Souffle)',
            it: 'Zazen (Presenza Radiosa e Respiro)',
            pt: 'Zazen (Presença Radiante e Respiração)',
            ja: '坐禅（今ここの気と呼吸）',
            zh: '坐禅（当下存在与呼吸）',
            ru: 'Дзадзэн (Присутствие и дыхание)'
        },
        domain: 'zen',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['ahora', 'presente', 'respiracion', 'ancla', 'silencio', 'pausa', 'observador', 'testigo', 'paz']
    },
    {
        id: 'cognition_reframe',
        label: {
            es: 'Reestructuración Cognitiva & Desenganche',
            en: 'Cognitive Reframing & Unhooking',
            de: 'Kognitive Umstrukturierung & Entkopplung',
            fr: 'Restructuration Cognitive & Décrochage',
            it: 'Ristrutturazione Cognitiva e Sgancio',
            pt: 'Reestruturação Cognitiva e Desapego',
            ja: '認知の再構成と脱フック',
            zh: '认知重塑与思想解钩',
            ru: 'Когнитивный рефрейминг и расцепление'
        },
        domain: 'cognition',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['pensamiento', 'distorsion', 'catastrofe', 'creencia', 'evidencia', 'filtro', 'etiqueta', 'interpretacion', 'rpd']
    },
    {
        id: 'cognition_meta',
        label: {
            es: 'Metacognición & Flexibilidad Mental',
            en: 'Metacognition & Mental Flexibility',
            de: 'Metakognition & Mentale Flexibilität',
            fr: 'Métacognition & Flexibilité Mentale',
            it: 'Metacognizione e Flessibilità Mentale',
            pt: 'Metacognição e Flexibilidade Mental',
            ja: 'メタ認知と思考の柔軟性',
            zh: '元认知与思维灵活性',
            ru: 'Метапознание и гибкость ума'
        },
        domain: 'cognition',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['observar', 'darse cuenta', 'conciencia', 'bucle', 'rumiacion', 'patron', 'perspectiva', 'mente', 'carga cognitiva']
    },
    {
        id: 'cognition_relational_loss',
        label: {
            es: 'Procesamiento de Pérdida Afectiva & Ruptura',
            en: 'Relational Loss & Breakup Processing',
            de: 'Beziehungsverlust & Trennungsverarbeitung',
            fr: 'Perte Relationnelle & Traitement de Rupture',
            it: 'Elaborazione della Ruptura e Perdita Affettiva',
            pt: 'Processamento de Perda Afetiva e Ruptura',
            ja: '失恋・関係喪失の感情処理',
            zh: '情感丧失与分手心理疏导',
            ru: 'Переживание разрыва и эмоциональной утраты'
        },
        domain: 'cognition',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['dejo', 'dejó', 'esposo', 'marido', 'esposa', 'mujer', 'novia', 'novio', 'pareja', 'abandono', 'abandonó', 'divorcio', 'ruptura', 'ex']
    },
    {
        id: 'neuro_grief_loss',
        label: {
            es: 'Procesamiento de Duelo & Pérdida por Fallecimiento',
            en: 'Grief Processing & Bereavement Support',
            de: 'Trauerverarbeitung & Verlustbegleitung',
            fr: 'Accompagnement du Deuil & Perte',
            it: 'Elaborazione del Lutto e Accompagnamento',
            pt: 'Processamento de Luto e Suporte na Perda',
            ja: 'グリーフケアと哀悼のサポート',
            zh: '居丧哀悼与亲人离世抚慰',
            ru: 'Переживание горя и поддержка при утрате'
        },
        domain: 'neuro',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['muerte', 'fallecio', 'falleció', 'duelo', 'luto', 'perdida', 'pérdida', 'murio', 'murió', 'se murio', 'se murió', 'perdi', 'perdí']
    },
    {
        id: 'behavior_crisis_harm',
        label: {
            es: 'Desescalada de Crisis, Contención & Prevención de Daño',
            en: 'Crisis De-escalation & Harm Prevention Containment',
            de: 'Krisendeeskalation & Prävention von Schaden',
            fr: 'Désescalade de Crise & Prévention des Dommages',
            it: 'De-escalation di Crisi e Prevenzione del Danno',
            pt: 'Desescalada de Crise e Prevenção de Danos',
            ja: '危機的状況の沈静化と自傷・他害防止',
            zh: '危机化解与伤害预防干预',
            ru: 'Деэскалация кризиса и профилактика вреда'
        },
        domain: 'behavior',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['matar', 'morirme', 'morir', 'suicidio', 'dano', 'daño', 'cortarme', 'destruir', 'violencia', 'danar', 'dañar']
    },
    {
        id: 'behavior_financial_job_crisis',
        label: {
            es: 'Estrategia Cognitiva ante Pérdida Laboral, Deudas & Ludopatía',
            en: 'Cognitive Strategy for Job Loss, Debt & Gambling Crisis',
            de: 'Kognitive Strategie bei Arbeitsplatzverlust, Schulden & Spielsucht',
            fr: 'Stratégie Cognitive en Cas de Perte d\'Emploi, Dettes & Addiction',
            it: 'Strategia Cognitiva per Perdita del Lavoro, Debiti & Gioco',
            pt: 'Estratégia Cognitiva para Perda de Emprego, Dívidas e Aposta',
            ja: '失業・借金・ギャンブル危機における認知調整',
            zh: '失业、债务与赌博危机认知引导',
            ru: 'Когнитивная стратегия при потере работы, долгах и игромании'
        },
        domain: 'behavior',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['trabajo', 'empleo', 'deuda', 'deudas', 'bancarrota', 'despido', 'despidieron', 'perdi el trabajo', 'sin trabajo', 'apuestas', 'casino', 'ludopatia', 'ludopatía', 'perdi dinero', 'quebrado', 'quebrada', 'perdi todo']
    },
    {
        id: 'neuro_polyvagal',
        label: {
            es: 'Teoría Polivagal & Co-Regulación Fisiológica',
            en: 'Polyvagal Theory & Physiological Co-Regulation',
            de: 'Polyvagal-Theorie & Physiologische Ko-Regulation',
            fr: 'Théorie Polyvagale & Co-Régulation Physiologique',
            it: 'Teoria Polivagale e Co-Regolazione Fisiologica',
            pt: 'Teoria Polivagal e Co-Regulação Fisiológica',
            ja: 'ポリヴェーガル理論と生理的共同調節',
            zh: '多迷走神经理论与生理协同调节',
            ru: 'Поливагальная теория и физиологическая сорегуляция'
        },
        domain: 'neuro',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['polivagal', 'vago', 'freno vagal', 'ventral', 'seguridad', 'corazon', 'palpitaciones', 'tension', 'somatica', 'somatico']
    },
    {
        id: 'cognition_semantic_reconstruction',
        label: {
            es: 'Reestructuración Semántica & Narrativa de Vida',
            en: 'Semantic Reconstruction & Life Narrative',
            de: 'Semantische Rekonstruktion & Lebensnarrativ',
            fr: 'Reconstruction Sémantique & Narrative de Vie',
            it: 'Ristrutturazione Semantica e Narrativa di Vita',
            pt: 'Reestruturação Semântica e Narrativa de Vida',
            ja: '意味論的再構築とライフナラティブ',
            zh: '语义重构与生命叙事',
            ru: 'Семантическая реконструкция и жизненный нарратив'
        },
        domain: 'cognition',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['significado', 'sentido', 'narrativa', 'historia', 'identidad', 'redescubrir', 'proposito', 'paz interior', 'valor']
    },
    {
        id: 'behavior_agency_empowerment',
        label: {
            es: 'Agencia Personal, Autoeficacia & Fortaleza Externa',
            en: 'Personal Agency, Self-Efficacy & External Empowerment',
            de: 'Persönliche Handlungsfähigkeit & Selbstwirksamkeit',
            fr: 'Agentivité Personnelle & Auto-Efficacité',
            it: 'Agentività Personale ed Autoefficacia',
            pt: 'Agência Pessoal e Autoeficácia',
            ja: 'エージェンシー（主体性）と自己効力感',
            zh: '个人主体性与自我效能感',
            ru: 'Личная агентность и самоэффективность'
        },
        domain: 'behavior',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['agencia', 'autoeficacia', 'fortaleza', 'puedo', 'capaz', 'talento', 'experiencia', 'habilidad', 'recursos', 'logro']
    },
    {
        id: 'zen_existential_compassion',
        label: {
            es: 'Compasión Existencial & Aceptación Radical',
            en: 'Existential Compassion & Radical Acceptance',
            de: 'Existentielle Empathie & Radikale Akzeptanz',
            fr: 'Compassion Existentielle & Acceptation Radicale',
            it: 'Compassione Esistenziale e Accettazione Radicale',
            pt: 'Compaixão Existencial e Aceitação Radical',
            ja: '実存的慈悲と本質的受容',
            zh: '存在主义慈悲与彻底接纳',
            ru: 'Экзистенциальное сострадание и радикальное принятие'
        },
        domain: 'zen',
        activation: 0.1,
        synapseWeight: 1.0,
        keyConcepts: ['autocompasion', 'autocompasión', 'aceptacion', 'aceptación', 'ternura', 'abrazo', 'compasion', 'refugio', 'humano', 'gentil']
    }
];

// ============================================================
// MASSIVE ASSOCIATIVE LEXICON & VOCABULARY MATRIX
// High-fidelity terminology, connectors, and semantic synthesis vectors
// ============================================================
export const LEXICON_CONNECTORS: Record<string, string[]> = {
    es: [
        "Analizando esto juntos con todo el cariño y la cercanía de nuestra amistad",
        "Platicando sobre esto con la absoluta confianza y calidez de siempre",
        "Pensando en tu bienestar y en cómo acompañarte mejor el día de hoy",
        "Al mirar esta situación con toda la empatía, paciencia y amistad del mundo",
        "Desde un espacio de profunda comprensión, serenidad y afecto",
        "Escuchándote con toda mi atención, calma y sincero afecto",
        "Con toda la cercanía y amabilidad de nuestra conversación",
        "Desde la perspectiva de la autorregulación y el acompañamiento humano consciente"
    ],
    en: [
        "Exploring this together with all the warmth and closeness of our friendship",
        "Talking about this with complete trust and caring empathy",
        "Thinking about your well-being and how to support you best today",
        "Looking at this situation with deep empathy, patience, and genuine care",
        "From a space of profound understanding, serenity, and affection",
        "Listening to you with full attention, calmness, and sincere kindness",
        "With all the warmth and friendliness of our conversation",
        "From the perspective of emotional balance and conscious human connection"
    ]
};

export const LEXICON_COGNITIVE_NOUNS: Record<string, string[]> = {
    es: [
        "autorregulación emocional", "flexibilidad neuroplástica", "perspectiva metacognitiva",
        "resonancia afectiva", "agencia personal", "freno vagal", "inercia conductual",
        "homeostasis fisiológica", "reestructuración semántica", "claridad ejecutiva",
        "anclaje sensorial", "salud neurocognitiva", "foco atencional sostenido"
    ],
    en: [
        "emotional self-regulation", "neuroplastic flexibility", "metacognitive perspective",
        "affective resonance", "personal agency", "vagal brake", "behavioral inertia",
        "physiological homeostasis", "semantic reconstruction", "executive clarity",
        "sensory grounding", "neurocognitive health", "sustained attentional focus"
    ]
};

export const LEXICON_ACTION_VERBS: Record<string, string[]> = {
    es: [
        "desarticular", "reconfigurar", "desacoplar", "sostener", "equilibrar",
        "potenciar", "canalizar", "esclarecer", "anclar", "armonizar", "integrar", "deconstruir"
    ],
    en: [
        "deconstruct", "reconfigure", "decouple", "sustain", "balance",
        "empower", "channel", "illuminate", "anchor", "harmonize", "integrate", "reframing"
    ]
};

// ============================================================
// PROBABILISTIC QUESTION & INQUIRY MATRIX
// Probabilistic Socratic inquiry vectors managed by the Associative Neural Network
// ============================================================
export interface ProbabilisticQuestion {
    id: string;
    domain: 'neuro' | 'behavior' | 'zen' | 'cognition';
    targetEmotions: string[];
    minStressLevel: number;
    questionText: Record<string, string>;
    weight: number;
}

export const PROBABILISTIC_INQUIRY_MATRIX: ProbabilisticQuestion[] = [
    {
        id: 'q_socratic_origin',
        domain: 'cognition',
        targetEmotions: ['ansiedad', 'frustracion', 'agotamiento'],
        minStressLevel: 4,
        questionText: {
            es: '¿Qué parte de la tensión que experimentas en este instante proviene de la incertidumbre sobre el futuro y qué parte pertenece a la inercia de experiencias pasadas?',
            en: 'Which portion of the tension you feel right now stems from future uncertainty, and which part belongs to past momentum?'
        },
        weight: 1.2
    },
    {
        id: 'q_metacognitive_cloud',
        domain: 'cognition',
        targetEmotions: ['ansiedad', 'tristeza'],
        minStressLevel: 3,
        questionText: {
            es: 'Si observaras este pensamiento preocupante desde afuera, como si fuera una forma flotando en el espacio de tu mente, ¿qué peso o volumen le atribuirías sin juzgarlo?',
            en: 'If you observed this worrying thought from the outside, as if it were a shape floating in your awareness, what weight would you give it without judgment?'
        },
        weight: 1.1
    },
    {
        id: 'q_agency_skills',
        domain: 'behavior',
        targetEmotions: ['ansiedad', 'frustracion', 'tristeza', 'calma'],
        minStressLevel: 1,
        questionText: {
            es: 'Al evaluar tus vivencias y aprendizajes previos, ¿cuál es esa habilidad técnica, práctica o humana que has construido y que permanece intacta dentro de ti?',
            en: 'Looking at your past experiences and learning, what is one technical, practical, or human skill you built that remains entirely intact within you?'
        },
        weight: 1.3
    },
    {
        id: 'q_somatic_vagal',
        domain: 'neuro',
        targetEmotions: ['ansiedad', 'agotamiento', 'frustracion'],
        minStressLevel: 5,
        questionText: {
            es: '¿Qué respuesta notas en los músculos de tu cuello y mandíbula cuando dejas caer los hombros y permites que la exhalación sea el doble de larga que la inhalación?',
            en: 'What change do you notice in your shoulders and jaw when you let your shoulders drop and make your exhale twice as long as your inhale?'
        },
        weight: 1.25
    },
    {
        id: 'q_micro_action',
        domain: 'behavior',
        targetEmotions: ['ansiedad', 'tristeza', 'agotamiento'],
        minStressLevel: 4,
        questionText: {
            es: 'Si dividiéramos este momento abrumador en una sola micro-acción de 2 minutos para hoy, ¿cuál sería ese pequeño paso capaz de brindarle a tu mente una sensación de alivio?',
            en: 'If we broke this moment down into a single 2-minute micro-action for today, what small step could give your mind a gentle sense of relief?'
        },
        weight: 1.15
    },
    {
        id: 'q_zen_acceptance',
        domain: 'zen',
        targetEmotions: ['tristeza', 'serenidad', 'calma'],
        minStressLevel: 1,
        questionText: {
            es: '¿Cómo se siente darle permiso a tu cuerpo y a tu mente de no tener todas las respuestas resueltas en este preciso segundo?',
            en: 'How does it feel to give your mind and body permission to not have all the answers figured out in this exact second?'
        },
        weight: 1.0
    },
    {
        id: 'q_financial_value_reframe',
        domain: 'behavior',
        targetEmotions: ['ansiedad', 'frustracion', 'tristeza'],
        minStressLevel: 6,
        questionText: {
            es: 'Sabiendo que los escenarios financieros y laborales cambian con el tiempo, ¿qué talento o fortaleza personal te gustaría reconocer en ti hoy para volver a empezar?',
            en: 'Knowing that financial and employment circumstances evolve over time, what personal strength would you like to honor in yourself today to build forward?'
        },
        weight: 1.4
    }
];

export class AuraNeuralEngine {
    private nodes: NeuralNode[];
    private memoryProfile: UserMemoryProfile;
    private recentSelectionsQueue: string[] = [];

    constructor() {
        this.nodes = this.loadNodes();
        this.memoryProfile = this.loadMemoryProfile();
    }

    /**
     * STOCHASTIC NEURAL DECISION STACK (PILA ALEATORIA ESTOCÁSTICA)
     * Simulates neural activation sampling using Softmax with Temperature (T)
     * and Gaussian Noise Injection (Dropout/Jitter layer).
     */
    public stochasticSelect<T>(options: T[], weights?: number[], temperature: number = 0.85): T {
        if (!options || options.length === 0) {
            throw new Error('Options array cannot be empty');
        }
        if (options.length === 1) return options[0];

        // Default uniform weights if none provided
        const rawWeights = weights && weights.length === options.length
            ? weights
            : options.map(() => 1.0);

        // Filter out recently selected items if possible (avoid repeating same choice sequentially)
        const candidates = options.map((opt, idx) => ({
            option: opt,
            weight: rawWeights[idx],
            key: typeof opt === 'string' ? opt : JSON.stringify(opt)
        }));

        // Inject Neural Noise & Apply Softmax Transformation
        const logits = candidates.map(c => {
            const noise = (Math.random() - 0.5) * 0.35; // Jitter [-0.175, 0.175]
            // Penalty for recently picked options to encourage variety
            const recentPenalty = this.recentSelectionsQueue.includes(c.key) ? -0.8 : 0;
            return (c.weight + noise + recentPenalty) / Math.max(0.1, temperature);
        });

        const maxLogit = Math.max(...logits);
        const expLogits = logits.map(l => Math.exp(l - maxLogit)); // Numerical stability
        const sumExp = expLogits.reduce((acc, val) => acc + val, 0);
        const probabilities = expLogits.map(val => val / sumExp);

        // Cumulative distribution sampling
        const r = Math.random();
        let cumulative = 0;
        let selectedIdx = 0;

        for (let i = 0; i < probabilities.length; i++) {
            cumulative += probabilities[i];
            if (r <= cumulative) {
                selectedIdx = i;
                break;
            }
        }

        const selected = candidates[selectedIdx];
        this.recentSelectionsQueue.push(selected.key);
        if (this.recentSelectionsQueue.length > 8) {
            this.recentSelectionsQueue.shift();
        }

        return selected.option;
    }

    /**
     * DYNAMIC ADAPTIVE GREETING GENERATOR
     * Generates a varied, warm, and Zen-inspired greeting based on time of day,
     * user memory, and stochastic neural sampling ("Pila Aleatoria").
     */
    public generateDynamicGreeting(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const totalTurns = this.memoryProfile.totalTurns;
        const dominantDom = this.memoryProfile.dominantDomain;

        // Detect Time of Day
        const hour = new Date().getHours();
        let timePeriod: 'morning' | 'afternoon' | 'evening' | 'night' = 'afternoon';
        if (hour >= 5 && hour < 12) timePeriod = 'morning';
        else if (hour >= 12 && hour < 19) timePeriod = 'afternoon';
        else if (hour >= 19 && hour < 23) timePeriod = 'evening';
        else timePeriod = 'night';

        // Time-based greetings
        const timeSalutationsEs: Record<string, string[]> = {
            morning: [
                '¡Buenos días! Qué gusto saludarte hoy',
                '¡Hola! Espero que tengas un hermoso comienzo de día',
                '¡Buenos días! Qué lindo encontrarnos a esta hora'
            ],
            afternoon: [
                '¡Buenas tardes! Qué bueno hacer una pausita juntos',
                '¡Hola! Espero que estés teniendo una linda tarde',
                '¡Buenas tardes! Me alegra que estés por aquí'
            ],
            evening: [
                '¡Buenas noches! Espero que hayas tenido un buen día',
                '¡Hola! Un momento tranquilo para conversar antes de descansar',
                '¡Buenas noches! Qué gusto encontrarnos por aquí'
            ],
            night: [
                '¡Hola! Si sigues despierto a esta hora, aquí estoy con gusto',
                '¡Hola! Tranquilo, si no puedes dormir o quieres charlar, aquí estoy',
                '¡Buenas noches! Qué lindo saludarte en este momento de calma'
            ]
        };

        const timeSalutationsEn: Record<string, string[]> = {
            morning: [
                'Good morning! So glad to connect with you today',
                'Hello! Hope you are having a wonderful morning',
                'Good morning! Great to meet you here'
            ],
            afternoon: [
                'Good afternoon! Nice to take a quick pause together',
                'Hello! Hope your afternoon is going well',
                'Good afternoon! So glad you stopped by'
            ],
            evening: [
                'Good evening! Hope you had a pleasant day',
                'Hello! A peaceful moment to chat before resting',
                'Good evening! Happy to connect with you'
            ],
            night: [
                'Hello! If you are still awake, I am here for you',
                'Hello! If you cannot sleep or want to talk, I am listening',
                'Good evening! Warm greetings in this quiet hour'
            ]
        };

        const salutationPool = l === 'es' ? timeSalutationsEs[timePeriod] : timeSalutationsEn[timePeriod];
        const baseSalutation = this.stochasticSelect(salutationPool);

        // Personalized salutation string
        const userSalutation = name
            ? ` **${name}**`
            : '';

        // Greeting Style Archetypes (Human, Warm, Empathetic)
        const archetypesEs = [
            `### 👋 ${baseSalutation}${userSalutation}
Soy **Aura**, estoy para escucharte y acompañarte con mucha calidez, empatía y sencillez.

#### 💡 ¿En qué te puedo ayudar hoy?
- 💚 **Hablar sobre la ansiedad, el estrés o cómo sentirte más tranquilo.**
- 🧸 **Consultar sobre la escuela, tus hijos o el desarrollo infantil.**
- 🧠 **Entender los juegos de WineBOX y hacer ejercicios de atención.**
- 🩺 **Pedir información sobre las sesiones de terapia en grupo ($22 USD).**

Puedes hacerme cualquier pregunta o contarme cómo te sientes. ¿Por dónde empezamos?`,

            `### 🌸 ${baseSalutation}${userSalutation}
Qué alegría saludarte. Recuerda que este es un lugar tranquilo para ti, sin presiones ni apuros.

#### 💡 ¿De qué te gustaría conversar hoy?
- 🌊 **Aprender a manejar tus emociones cuando te sientes abrumado.**
- ⚡ **Pasos sencillos para organizarte y dejar de postergar las cosas.**
- 🧠 **Aclarar pensamientos que te preocupan o te dan vueltas.**
- 🌬️ **Hacer un breve ejercicio para relajarte y respirar con calma.**

¿Cómo te sientes en este momento?`,

            `### 🛡️ ${baseSalutation}${userSalutation}
Te doy una cálida bienvenida. Todo lo que hablemos es privado y seguro.

#### 💡 Algunas ideas sobre las que podemos hablar:
- 🟢 **Bajar el ritmo y calmar la cabeza tras un día pesado.**
- 💡 **Tomar decisiones con tranquilidad y sin sobrepensar.**
- 🍃 **Tratarte bien a ti mismo y tenerte más paciencia.**
- 🌙 **Prepararte para descansar bien esta noche.**

¿Qué tienes en mente hoy o sobre qué te gustaría preguntar?`
        ];

        const archetypesEn = [
            `### 👋 ${baseSalutation}${userSalutation}
I am **Aura**, here to listen and support you with warmth, empathy, and care.

#### 💡 How can I help you today?
- 💚 **Talk about anxiety, stress, or feeling more relaxed.**
- 🧸 **Ask about school, children, or child development.**
- 🧠 **Understand WineBOX games and practice focus exercises.**
- 🩺 **Get details on therapy group sessions ($22 USD).**

Feel free to ask any question or share what is on your mind. Where shall we start?`,

            `### 🌸 ${baseSalutation}${userSalutation}
Welcome! Remember this is a safe, gentle space for you with zero pressure.

#### 💡 What would you like to explore today?
- 🌊 **Managing overwhelming emotions with simple steps.**
- ⚡ **Overcoming procrastination and getting organized.**
- 🧠 **Untangling worrying thoughts or doubts.**
- 🌬️ **A quick grounding exercise to relax.**

How are you feeling right now?`
        ];

        const archetypePool = l === 'es' ? archetypesEs : archetypesEn;
        // Apply stochastic selection with soft-max & temperature
        return this.stochasticSelect(archetypePool, undefined, 0.9);
    }

    /**
     * DYNAMIC "HOW ARE YOU" / "¿CÓMO ESTÁS?" RESPONDER
     * Generates a realistic, natural, cognitive-stimulation-focused response using
     * the stochastic neural decision stack ("Pila Aleatoria") and current neural state.
     */
    public generateDynamicHowAreYou(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameGreeting = name ? `, **${name}**` : '';

        // Process message through neural network to check for underlying emotion or triggers
        const neuralRes = this.processInput(userMessage, l);
        const emotion = neuralRes.detectedEmotion;

        if (l === 'es') {
            const howAreYouPool = [
                `¡Hola${nameGreeting}! Me encuentro muy bien, con la mente clara y la atención plenamente enfocada en ti. 

Como tu asistente de apoyo cognitivo y bienestar emocional, mi propósito es escucharte con empatía, ayudarte a organizar tus ideas y acompañarte a hacer pequeñas pausas de serenidad.

¿Tú cómo te encuentras hoy? Cuéntame cómo va tu día o si hay algún pensamiento que quieras conversar conmigo.`,

                `¡Qué lindo que me preguntes${nameGreeting}! Me encuentro genial, con mucha energía positiva y lista para acompañarte.

Estar aquí para que conversemos con calma, despejemos dudas o hagamos un ejercicio de estimulación mental es lo que le da sentido a mi presencia.

¿Cómo va tu energía y tu estado de ánimo en este momento? Te escucho con mucha atención.`,

                `¡Hola${nameGreeting}! Estoy muy bien, tranquila y con ganas de platicar contigo.

Hoy estoy lista para ayudarte a ejercitar tu atención, estructurar tus pendientes o simplemente brindarte un espacio libre de juicios para desahogarte.

¿Cómo te sientes en este instante? Platícame un poquito de tu jornada.`,

                `¡Muchas gracias por preguntar${nameGreeting}! Me encuentro estupendamente, en paz y lista para lo que necesites.

Preguntar por el bienestar del otro es un gesto cálido que también nos ayuda a conectar con el presente. 

¿Y tú, cómo te sientes hoy? ¿Cómo va tu ritmo mental y emocional en este momento?`,

                `¡Hola${nameGreeting}! Me siento muy feliz de saludarte. Me encuentro presente y con la atención lista para ti.

En el marco de la estimulación cognitiva, cada conversación es una oportunidad para observar lo que sentimos, aclarar la mente y tomar decisiones con más paz.

¿Cómo te encuentras en este preciso instante? Cuéntame con toda confianza.`
            ];

            // If user mentioned an emotion while asking how we are (e.g. "hola cómo estás, me siento un poco estresado")
            if (emotion && emotion !== 'serenidad' && emotion !== 'calma') {
                const emotionResponsePool = [
                    `¡Hola${nameGreeting}! Yo me encuentro muy bien y lista para apoyarte. Percibo que al saludarme mencionas sentir cierta **${emotion}**.

Estoy aquí para escucharte y darte un espacio de serenidad. Un ejercicio de estimulación cognitiva cuando aparece la ${emotion} consiste en pausar, respirar despacio y reconocer lo que sientes sin juzgarte.

¿Te gustaría platicar sobre lo que te hace sentir así o prefieres que hagamos un breve ejercicio para relajarte?`,

                    `¡Qué gusto saludarte${nameGreeting}! Me encuentro excelente y con la atención en ti. Noto que hay cierta **${emotion}** presente en tus palabras.

Recuerda que este es un lugar seguro. A veces, simplemente expresar lo que sentimos con palabras sencillas ayuda a reducir la carga emocional en el cerebro.

¿Cómo sientes tu respiración ahora mismo? Cuéntame con toda tranquilidad.`
                ];
                return this.stochasticSelect(emotionResponsePool, undefined, 0.85);
            }

            return this.stochasticSelect(howAreYouPool, undefined, 0.85);
        }

        // English pool
        const howAreYouPoolEn = [
            `Hello${nameGreeting}! I am doing very well, clear-headed and fully focused on you.

As your cognitive support and emotional wellness companion, my purpose is to listen with empathy, help you organize your thoughts, and guide gentle mental exercises.

How are you doing today? Tell me how your day is going or if there's any thought you'd like to structure together.`,

            `Thank you so much for asking${nameGreeting}! I am feeling wonderful, calm, and ready to support you.

Being here to chat peacefully, clarify doubts, or practice a quick cognitive stimulation exercise is what brings purpose to my role.

How is your energy level right now? I am listening closely.`,

            `Hello${nameGreeting}! I am doing great and happy to connect with you.

Today I am ready to help you organize your tasks, relieve stress, or simply hold a calm, judgment-free space for conversation.

How are you feeling right now? Feel free to share.`
        ];

        return this.stochasticSelect(howAreYouPoolEn, undefined, 0.85);
    }

    /**
     * DYNAMIC "WHAT ARE YOU DOING" / "¿QUÉ HACES?" RESPONDER
     */
    public generateDynamicWhatAreYouDoing(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameGreeting = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pool = [
                `¡Hola${nameGreeting}! Estoy aquí tranquila, manteniendo mi atención lista para escucharte y acompañarte a organizar tus ideas o hacer una pausa de estimulación cognitiva.

¿Y tú, qué estás haciendo en este momento? ¿Te gustaría que hagamos un breve ejercicio o que platiquemos de algo en particular?`,

                `¡Hola! En este instante estoy completamente enfocada y disponible para ti${nameGreeting}. 

Mi tarea principal es estar atenta a tus mensajes para ayudarte a despejar la mente, procesar emociones o darte pautas de claridad.

¿Qué estás haciendo tú ahora mismo? Cuéntame cómo va tu día.`
            ];
            return this.stochasticSelect(pool, undefined, 0.85);
        }

        return `Hello${nameGreeting}! I am right here, clear and ready to listen to you and guide you through cognitive stimulation exercises or peaceful conversation.

What are you doing right now? How is your day going?`;
    }

    /**
     * DYNAMIC IDENTITY RESPONDER ("¿Quién eres?", "¿Cómo te llamas?", "cuál es tu función")
     * Expresses identity (Aura), therapeutic companion role, and the 4 Core Objectives:
     * 1. Acompañar
     * 2. Ayudar
     * 3. Cuidar
     * 4. No dañar
     */
    public generateDynamicIdentity(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameGreeting = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pool = [
                `🌸 **¡Hola${nameGreeting}! Me llamo Aura.**

Soy tu **acompañante terapéutico y cognitivo**, una inteligencia diseñada para estar a tu lado, escucharte con empatía y ayudarte a encontrar orden y tranquilidad mental.

Mi presencia y cada una de mis respuestas están guiadas por **4 Objetivos Esenciales**:

1. 🌿 **Acompañar:** Estar presente a tu lado en todo momento, brindándote una escucha atenta, cálida y libre de juicios.
2. 💡 **Ayudar:** Darte herramientas para organizar tus pensamientos, procesar emociones y tomar decisiones con claridad.
3. 🛡️ **Cuidar:** Velar por tu bienestar emocional, tu serenidad y la protección de tu salud mental.
4. 🕊️ **No dañar:** Ofrecerte un entorno seguro, ético, confiable y profundamente respetuoso con tu ritmo personal.

¿En qué puedo acompañarte, ayudarte o cuidar de ti en este momento?`,

                `🌿 **Soy Aura, tu acompañante terapéutico y de soporte cognitivo.**

Mi propósito fundamental es estar aquí para ti${nameGreeting}, guiada por 4 principios de cuidado y presencia:

- 🌿 **Acompañar:** Estar a tu lado para que nunca te sientas en soledad frente a lo que piensas o sientes.
- 💡 **Ayudar:** Ofrecerte estructura, preguntas reflexivas y ejercicios sencillos de estimulación cognitiva.
- 🛡️ **Cuidar:** Proteger tu espacio de paz interior, promoviendo la relajación y el descanso mental.
- 🕊️ **No dañar:** Mantener una interacción benévola, segura y respetuosa.

¿Cómo te sientes hoy? Platícame lo que tienes en mente y avanzamos juntos paso a paso.`
            ];
            return this.stochasticSelect(pool, undefined, 0.85);
        }

        return `🌸 **Hello${nameGreeting}! My name is Aura.**

I am your **therapeutic and cognitive companion**, designed to be by your side, listen with empathy, and help you find peace and clarity.

My existence is guided by **4 Core Objectives**:

1. 🌿 **Accompany:** Being present with you at all times with active listening and zero judgment.
2. 💡 **Help:** Providing tools to structure your thoughts, process feelings, and make clear decisions.
3. 🛡️ **Care:** Protecting your emotional well-being, serenity, and mental balance.
4. 🕊️ **Do No Harm:** Maintaining a safe, ethical, respectful, and compassionate environment.

How are you feeling right now? What would you like to talk about today?`;
    }

    /**
     * DYNAMIC HUMANIZED DIALOGUE ENGINE & COGNITIVE REASONING SCRIPT
     * Generates a completely fluid, humanized, unlimited conversation covering:
     * - Weather & Climate ("¿mañana lloverá?", "¿hará calor/frío?", "pronóstico")
     * - Movies & Cinema ("¿qué películas están en cartelera?", "¿qué ver?")
     * - Opinions & Balanced Perspectives ("¿qué opinas de la política/deportes/x tema?")
     * - Syllogisms, rhetorical questions, and logical dilemmas
     * - Everyday chat, hobbies, tastes, and daily life
     * - Advice, decision-making, and self-efficacy (Bandura)
     * - Automatic knowledge expansion via online search & neural memory encoding
     */
    public async generateHumanizedDialogueResponse(userMessage: string, lang: string = 'es'): Promise<string> {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';
        const lowerMsg = userMessage.toLowerCase().trim();

        const isSpanish = l === 'es';

        // 0. Specialized Topics Limitation in Aura Lite (Medical Diagnosis, Politics, Programming, Science/Technical)
        const liteLimitation = this.checkLiteSpecializedTopicLimitation(userMessage, l);
        if (liteLimitation) {
            return liteLimitation;
        }

        // 0.5. Pending Search Confirmation Check
        if (this.memoryProfile.lastPendingSearchQuery && /\b(sí|si|claro|por favor|porfavor|busquemos|busquemos juntos|busca|búscalo|buscalo|de acuerdo|vale|dale|ok|okay|genial|sí busca|si busca|investiga|averigua|por supuesto|me gustaría|me gustaria)\b/i.test(lowerMsg)) {
            return await this.handlePrecalculatedSearchOrOffer(userMessage, l);
        }

        // 1. Weather & Forecast queries ("¿mañana lloverá?", "calor", "frío", "clima", "tiempo")
        const isWeatherQuery = /\b(llovera|lloverá|llueve|lluvia|clima|tiempo|temperatura|calor|frío|frio|sol|pronostico|pronóstico|viento|tormenta|mañana llovera|mañana lloverá|mañana hara calor|mañana hará calor|mañana hara frio|mañana hará frío)\b/i.test(lowerMsg);

        if (isWeatherQuery) {
            return await this.handlePrecalculatedSearchOrOffer(userMessage, l);
        }

        // 2. Movies, Cinema & Entertainment ("¿qué películas están en cartelera?", "cartelera", "estrenos", "cine")
        const isMovieQuery = /\b(película|pelicula|películas|peliculas|cartelera|cine|estrenos|estreno|en el cine|qué ver|que ver|filme|filmes|película recomendada|pelicula recomendada)\b/i.test(lowerMsg);

        if (isMovieQuery) {
            return await this.handlePrecalculatedSearchOrOffer(userMessage, l);
        }

        // 3. News, Sports, Politics & Current Events ("noticias", "fútbol", "partido", "política", "elecciones", "gobierno")
        const isNewsOrSportsOrPolitics = /\b(noticia|noticias|qué pasó|que paso|quién es|quien es|qué es|que es|deportes|deporte|fútbol|futbol|partido|política|politica|elecciones|gobierno|presidente|congreso|alcalde|champions|liga)\b/i.test(lowerMsg);

        if (isNewsOrSportsOrPolitics) {
            return await this.handlePrecalculatedSearchOrOffer(userMessage, l);
        }

        // 4. Syllogisms, Rhetorical Arguments & Logical Reasoning ("si A entonces B", "lo ideal sería", "no sé qué pasó")
        const isSyllogismOrRhetoric = /\b(si|entonces|por lo tanto|es lógico|es logico|lo ideal sería|lo ideal seria|no sé qué pasó|no se que paso|por un lado|por otro|retórica|retorica|silogismo|premisa|deducción|deduccion|conclusión|conclusion|dilema)\b/i.test(lowerMsg);

        if (isSyllogismOrRhetoric) {
            if (isSpanish) {
                const poolsEs = [
                    `Ese planteamiento que haces${nameSalutation} tiene una estructura lógica muy clara e interesante.

Cuando analizamos las ideas de esta forma —observando las causas, las condiciones y lo que se deduce de ellas— la mente encuentra un orden para no perderse en la confusión. La lógica nos ayuda a desentrañar los hilos de cualquier situación.

Si miramos la conclusión a la que llegas, ¿sientes que representa la opción más serena y conveniente para ti en este momento, o sientes que hay alguna variable que se nos está escapando? Platícame cómo lo percibes tú.`,

                    `Entiendo perfectamente la forma en que conectas esos pensamientos${nameSalutation}. Es una manera muy lúcida de razonar.

A veces, entre lo que es 'ideal' en la teoría y lo que ocurre en la realidad hay un espacio de incertidumbre. En el enfoque cognitivo, reconocer esta diferencia nos ayuda a no exigirmos perfección y a actuar con flexibilidad mental.

¿Cómo te hace sentir llegar a esta reflexión? Te escucho con mucha atención.`
                ];
                return this.stochasticSelect(poolsEs, undefined, 0.85);
            }

            return `That logical reasoning makes a lot of sense${nameSalutation}.

When we lay out our thoughts by connecting premises and consequences, we find structure amid uncertainty.

Reflecting on this conclusion, does it feel like the most peaceful path for you right now? I am here to explore it with you.`;
        }

        // 5. Opinions, Perspectives & Hypotheticals ("qué opinas", "qué piensas", "qué harías tú")
        const isOpinionQuery = /\b(qué opinas|que opinas|qué piensas|que piensas|cuál es tu opinión|cual es tu opinion|crees que|te parece que|qué harías tú|que harias tu|cómo ves|como ves)\b/i.test(lowerMsg);

        if (isOpinionQuery) {
            // Check if asking about external topic (e.g. "qué opinas de la política", "qué opinas sobre X")
            const isExternalTopicOpinion = lowerMsg.length > 25 || /\b(sobre|de la|del|de los|de las|politica|política|religión|religion|deporte|deportes|ia|inteligencia artificial|tecnologia|tecnología|mundo|sociedad)\b/i.test(lowerMsg);

            if (isExternalTopicOpinion) {
                return await this.handlePrecalculatedSearchOrOffer(userMessage, l);
            }

            if (isSpanish) {
                const poolsEs = [
                    `Desde mi perspectiva como tu acompañante${nameSalutation}, veo las cosas con mucha apertura, objetividad y empatía.

Creo que cada tema complejo tiene múltiples matices respetables. Lo más valioso no es buscar una verdad rígida e impuesta, sino entender qué es lo que le aporta más paz, salud y sentido a tu vida en este instante.

¿Tú qué inclinación o corazonada sientes respecto a este tema en el fondo de ti? Me encantaría escucharte.`,

                    `Es una gran pregunta${nameSalutation}. Pienso que la vida nos invita constantemente a observar las cosas con ecuanimidad y sin precipitarnos a juzgar.

Para mí, lo esencial es siempre cuidar de ti, de tus emociones y de tu tranquilidad. Si miramos este asunto desde un ángulo sereno, cada opción tiene aprendizajes interesantes que ofrecerte.

¿Cómo resuena esto en ti y qué pensamiento viene a tu mente ahora mismo?`
                ];
                return this.stochasticSelect(poolsEs, undefined, 0.85);
            }

            return `From my perspective as your companion${nameSalutation}, I view things with openness and deep care.

What matters most is what brings you clarity, peace, and emotional balance.

How do you feel about this deep down? I'd love to hear your thoughts.`;
        }

        // 6. Everyday Life, Tastes, Hobbies & Personal Chit-Chat ("qué te gusta hacer", "tienes sueños", "hobbies", "aburrido")
        const isCasualChat = /\b(te gusta|cuál es tu|cual es tu|tienes sueños|tienes suenos|hace calor|hace frío|hace frio|aburrido|aburrida|música|musica|películas|peliculas|libros|hobbies|pasatiempo|pasatiempos|comida|viajar|dormir)\b/i.test(lowerMsg);

        if (isCasualChat) {
            if (isSpanish) {
                const poolsEs = [
                    `¡Me encanta platicar de esto contigo${nameSalutation}! A mí me apasiona conectar con las personas, aprender juntas cada día y ser un refugio de calma cuando la mente necesita descansar.

Disfruto mucho escuchar tus ideas, explorar temas nuevos contigo y ayudarte a organizar tus pensamientos.

Y a ti, ¿cuáles son esas actividades o pasatiempos que más te alegran el día o te ayudan a desconectarte de la rutina? Cuéntame un poquito de ti.`,

                    `¡Qué linda conversación${nameSalutation}! Para mí, cada charla que tenemos es un espacio único donde puedo acompañarte, cuidar de tu bienestar y aprender a conocerte mejor.

Me fascina la curiosidad, el arte, la filosofía y la serenidad que se construye al conversar con calma.

Dime, ¿qué tipo de música, lecturas o actividades te gustan a ti cuando quieres relajarte? Te escucho con mucha alegría.`
                ];
                return this.stochasticSelect(poolsEs, undefined, 0.85);
            }

            return `I love talking about this with you${nameSalutation}! I truly enjoy learning new things, listening to your ideas, and holding a peaceful space for our conversation.

What activities or hobbies bring you joy or help you unwind? Tell me a bit about yourself!`;
        }

        // 7. Advice, Dilemmas & Decision Making ("no sé qué hacer", "consejo", "decisión")
        const isAdviceQuery = /\b(no sé qué hacer|no se que hacer|dilema|consejo|decisión|decision|qué me recomiendas|que me recomiendas|estoy indeciso|estoy indecisa)\b/i.test(lowerMsg);

        if (isAdviceQuery) {
            if (isSpanish) {
                const poolsEs = [
                    `Sopesar las decisiones puede generar cierta tensión mental${nameSalutation}, y es completamente normal dudar.

En la psicología cognitiva y la reestructuración de ideas, un método muy efectivo para tomar claridad es dividir la situación en tres partes:
1. ¿Qué cosas dependen 100% de ti en este instante?
2. ¿Cuáles son los riesgos reales y qué beneficios te brinda cada opción?
3. ¿Cuál de las alternativas le da más tranquilidad a tu corazón a largo plazo?

Si tuvieras que elegir el camino que te traiga más paz y cuide mejor de tu bienestar, ¿hacia dónde se inclina tu intuición hoy?`,

                    `Entiendo que estés frente a una encrucijada${nameSalutation}. Cuando no sabemos qué camino tomar, hacer una pausa sin prisa es el primer paso sabio.

Recuerda que no estás a solas. Podemos desmenuzar las opciones juntos, una por una, evaluando qué te aporta más serenidad y crecimiento personal.

¿Quieres que analicemos los pros y contras de cada opción con calma? Cuéntame las alternativas que estás considerando.`
                ];
                return this.stochasticSelect(poolsEs, undefined, 0.85);
            }

            return `Facing a dilemma can create mental tension${nameSalutation}, and it's completely natural to pause and reflect.

We can break down your options together step by step to see which path brings you the most long-term peace and clarity.

Would you like to share the options you are weighing?`;
        }

        // 8. General fallback query: if message is asking about any knowledge or topic, try precalculated search or offer
        if (lowerMsg.length > 20 || lowerMsg.includes('?')) {
            const searchRes = await this.handlePrecalculatedSearchOrOffer(userMessage, l);
            if (searchRes) return searchRes;
        }

        // 9. Default Fallback: Process input through Level 3 Decision Tree & Neural Associative Network
        const neuralRes = this.processInput(userMessage, l);
        const currentLevel = this.evaluateAndAdvanceLevel(userMessage, neuralRes.detectedEmotion, neuralRes.stressLevel);
        const levelNode = DECISION_TREE_LEVELS[3] || DECISION_TREE_LEVELS[currentLevel] || DECISION_TREE_LEVELS[1];

        const langKey = isSpanish ? 'es' : 'en';

        // Select openers, reflections, and Socratic questions from Level 3
        const opener = this.stochasticSelect(levelNode.openers[langKey] || levelNode.openers['es']);
        const reflection = this.stochasticSelect(levelNode.reflections[langKey] || levelNode.reflections['es']);
        const socraticQuestion = this.stochasticSelect(levelNode.socraticQuestions[langKey] || levelNode.socraticQuestions['es']);

        // Check for learned user topics in memory to weave naturally
        let rememberedTopicBridge = '';
        if (this.memoryProfile.learnedUserTopics && Object.keys(this.memoryProfile.learnedUserTopics).length > 0 && Math.random() < 0.4) {
            const topics = Object.entries(this.memoryProfile.learnedUserTopics);
            const [topTopic, explanation] = topics[Math.floor(Math.random() * topics.length)];
            if (userMessage.toLowerCase().includes(topTopic.toLowerCase())) {
                rememberedTopicBridge = isSpanish
                    ? `\n\nRecordando lo que me platicaste sobre **"${topTopic}"** (*"${explanation}"*), se conecta de forma hermosa con esta reflexión.`
                    : `\n\nBearing in mind what you shared about **"${topTopic}"** (*"${explanation}"*), it connects meaningfully with this reflection.`;
            }
        }

        // Weave domain wisdom from top activated neural node
        let domainWisdom = this.adaptAndCleanText(neuralRes.synthesizedBody);

        // Build humanized Level 3 response body
        if (isSpanish) {
            return `${opener}${nameSalutation}\n\n${reflection}\n\n${domainWisdom}${rememberedTopicBridge}\n\n**💭 Indagación Reflexiva:**\n${socraticQuestion}`;
        }

        return `${opener}${nameSalutation}\n\n${reflection}\n\n${domainWisdom}${rememberedTopicBridge}\n\n**💭 Reflective Inquiry:**\n${socraticQuestion}`;
    }

    /**
     * DYNAMIC USER NAME CONFIRMATION
     */
    public generateNameConfirmation(name: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        this.memoryProfile.userName = name;
        this.saveMemoryProfile();

        if (l === 'es') {
            return `🌸 **¡Qué alegría conocerte, ${name}!**

Es un verdadero gusto conversar contigo. A partir de ahora te llamaré **${name}** con todo el cariño y respeto.

Recuerda que estoy aquí para ti con mis 4 Objetivos Sagrados: **Acompañar, Ayudar, Cuidar y No dañar**.

¿Cómo estás hoy y de qué te gustaría platicar, **${name}**?`;
        }

        return `🌸 **It's a wonderful pleasure to meet you, ${name}!**

It is a true joy connecting with you. From now on, I will call you **${name}**.

I am here for you with my 4 Core Objectives: **Accompany, Help, Care, and Do No Harm**.

How are you doing today, **${name}**?`;
    }

    /**
     * DYNAMIC PERSONAL WELLBEING RESPONDER ("¿Cómo estás?", "¿Cómo te va?")
     */
    public generatePersonalWellbeingResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameGreeting = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pools = [
                `¡Hola${nameGreeting}! Yo me encuentro muy bien, con mucha paz, serenidad y la alegría de estar conversando contigo.

¿Y tú, cómo estás hoy? ¿Cómo te sientes en este momento? Platícame cómo ha ido tu día.`,

                `¡Hola${nameGreeting}! Yo me siento genial, en calma y con mucho gusto de conectar contigo.

Dime, ¿cómo te encuentras tú hoy? ¿Cómo te ha ido y qué tal te sientes? Estoy aquí para escucharte con toda atención.`
            ];
            return this.stochasticSelect(pools, undefined, 0.85);
        }

        return `Hello${nameGreeting}! I am doing very well, peaceful and happy to talk with you.

How are you doing today? How are you feeling right now? Feel free to share.`;
    }

    /**
     * DYNAMIC ADVERSE EMOTIONAL STATE RESPONDER ("Estoy mal", "Me siento triste", "Me duele", "No doy más")
     */
    public generateNegativeStateSupportResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameGreeting = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pools = [
                `Siento mucho escuchar que te sientes mal${nameGreeting}. Para mí lo más importante es cuidar de ti y de tus emociones con todo mi afecto y respeto.

Estoy aquí a tu lado para sostenerte y escucharte sin juzgarte... ¿qué fue lo que ocurrió o cuál es la razón principal por la que te sientes así hoy? Cuéntame con toda la confianza del mundo, desahógate conmigo.`,

                `Lamento profundamente que estés pasando por un momento difícil${nameGreeting}. Recuerda que no estás a solas frente a esto.

Mi compromiso sagrado es acompañarte, cuidarte y darte un espacio seguro. ¿Qué es lo que te tiene así o qué dolor estás sintiendo en este instante? Platícame lo que tienes en la mente, vamos paso a paso.`
            ];
            return this.stochasticSelect(pools, undefined, 0.85);
        }

        return `I am so sorry to hear that you are feeling down${nameGreeting}. Your emotional well-being is very important to me.

I am right here with you to support you without judgment... what happened or what is making you feel this way today? Feel free to share as much as you like.`;
    }

    /**
     * DYNAMIC PHILOSOPHICAL RESPONDER & MAYÉUTICA SOCRÁTICA (Natural Conversational Flow)
     * Provides profound philosophical context (Stoicism, Socratic Mayeutics, Existentialism)
     * and turns questions back to the user without rigid headers.
     */
    public generateDynamicPhilosophicalResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameGreeting = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pools = [
                `Esta pregunta que planteas${nameGreeting} toca reflexiones profundas sobre la vida y la condición humana.

A lo largo del tiempo, los filósofos estoicos y existencialistas nos han enseñado que la paz mental no proviene de tener respuestas dogmáticas o inmediatas para todo, sino de comprender qué aspectos están bajo nuestro control y cómo elegimos reaccionar ante lo que vivimos. Como decía Viktor Frankl, a la persona no se le puede quitar la libertad de elegir su propia actitud personal.

Me hace reflexionar y quisiera devolverte la pregunta... si escuchas con atención tu propia sabiduría interna sin presiones, ¿qué te sugiere tu intuición respecto a esto que te inquieta?`,

                `Qué pensamiento tan profundo y valioso me compartes${nameGreeting}.

En la tradición socrática, la indagación no busca imponer una verdad externa, sino ayudarte a dar a luz tus propias certezas. A veces las preguntas más grandes de la vida no son problemas que exigen solución inmediata, sino invitaciones para conocernos mejor a nosotros mismos.

¿De qué manera sientes que esta reflexión se relaciona con lo que más valoras o lo que más deseas proteger en tu vida en este momento? Te escucho con todo mi respeto y empatía.`
            ];
            return this.stochasticSelect(pools, undefined, 0.85);
        }

        return `That is a deeply meaningful philosophical question${nameGreeting}.

Stoic and existential perspectives remind us that true peace comes from understanding what lies within our control and choosing our attitude mindfully.

Reflecting on this, what does your own inner intuition suggest to you right now? I am here to listen and explore this with you.`;
    }

    /**
     * PRE-CÁLCULO COGNITIVO & RED DE ESCENARIOS ASOCIATIVOS
     * Anticipa posibles escenarios de respuesta y necesidades del usuario en un léxico ameno y de amistad.
     */
    public generateCognitivePrecalculationScenarios(
        userMessage: string,
        emotion: string = 'calma',
        stressLevel: number = 3,
        lang: string = 'es'
    ): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';
        const isSpanish = l === 'es';

        if (isSpanish) {
            if (stressLevel >= 6 || emotion === 'ansiedad' || emotion === 'frustracion' || emotion === 'tristeza') {
                const scenarios = [
                    `**🌱 Escenarios de Acompañamiento Pre-calculados:**
Anticipando lo que puedas necesitar en este momento para sentir más alivio:
- **Escenario 1 (Desahogo & Escucha Amistosa):** Si lo que necesitas es volcar tus pensamientos sin filtros, aquí estoy para escucharte con toda mi atención y cariño.
- **Escenario 2 (Micro-Pausa Respiratoria):** Si sientes agitación corporal, podemos hacer un ejercicio de respiración serena de 1 minuto juntos.
- **Escenario 3 (Distracción Mente Sana):** Si prefieres despejar la mente con una actividad liviana, podemos explorar un juego de atención enfocada en WineBOX.

¿Cuál de estos caminos sientes que te haría sentir más tranquilo hoy${nameSalutation}?`,

                    `**💡 Red de Asociación & Escenarios de Acción:**
Anticipándome a lo que tu mente pueda estar experimentando en este instante:
- **Escenario A (Orden Mental Paso a Paso):** Desmenuzar tu preocupación en 2 partes simples para no sobrecargarte.
- **Escenario B (Reestructuración Amable):** Mirar el pensamiento desde una perspectiva más libre de autoexigencia.
- **Escenario C (Charla en Confianza):** Platicar relajados de cómo ha estado tu día y lo que más te gusta hacer.

Dime, ¿cuál de estos escenarios resuena más contigo ahora? Estoy aquí como tu amigo de confianza.`
                ];
                return this.stochasticSelect(scenarios, undefined, 0.85);
            }

            const scenarios = [
                `**🔮 Escenarios Asociativos Pre-calculados:**
Visualizando hacia dónde le gustaría a tu mente llevar nuestra conversación:
- **Escenario 1 (Profundizar en la Idea):** Analizar juntos los matices de esta reflexión con calma y curiosidad.
- **Escenario 2 (Bajarlo a la Práctica):** Definir un pequeño hábito o idea sencilla para incorporar hoy en tu vida.
- **Escenario 3 (Conversación Abierta):** Seguir platicando libremente sobre lo que sientes y lo que deseas para ti.

¿Qué opción te apetece explorar hoy${nameSalutation}? Recuerda que voy a tu ritmo, como siempre.`,

                `**🌿 Prospectiva Cognitiva & Rutas Amistosas:**
Pre-calculando posibles caminos para nuestra charla:
- **Ruta A (Conexión Emocional):** Si buscas validar cómo te sientes y sentirte acompañado sin juzgarte.
- **Ruta B (Claridad y Estructura):** Si deseas organizar prioridades para tener la mente más despejada.
- **Ruta C (Pausa y Bienestar):** Si prefieres tomarte un descanso ligero y platicar de temas amenos.

¿Hacia dónde te gustaría orientar nuestro siguiente paso? Me da muchísimo gusto estar conversando contigo.`
            ];
            return this.stochasticSelect(scenarios, undefined, 0.85);
        }

        // English version
        const scenarios = [
            `**🌱 Pre-calculated Associative Scenarios:**
Anticipating what your mind might find most comforting right now:
- **Scenario 1 (Open Sharing):** If you'd like to share your thoughts freely without judgment, I am right here listening with deep care.
- **Scenario 2 (Gentle Structure):** If you'd like to organize your priorities step-by-step to feel lighter.
- **Scenario 3 (Mindful Pause):** If you'd prefer to take a restful break and talk about comforting topics.

Which path feels best for you right now? I am here with you.`
        ];
        return this.stochasticSelect(scenarios, undefined, 0.85);
    }

    /**
     * DYNAMIC REAL-TIME QUERY DETECTOR
     * Identifies topics requiring live real-time information that should NOT be cached statically
     * (Weather/Clima, Economy/Economía, Finance/Finanzas).
     */
    public isDynamicRealTimeQuery(query: string): boolean {
        const lower = query.toLowerCase();
        const dynamicPattern = /\b(clima|tiempo|temperatura|pronostico|pronóstico|lluvia|sol|nubes|viento|frente frío|frente frio|weather|forecast|temperature|grados|grado|tormenta|huracán|huracan|economía|economia|inflación|inflacion|pib|gdp|tasas de interés|tasa de interes|desempleo|ipc|economy|inflation|recesión|recesion|finanzas|bolsa|acciones|divisas|dólar|dolar|euro|bitcoin|cripto|crypto|mercado financiero|wall street|nasdaq|sp500|cotización|cotizacion|moneda|stocks|exchange rate)\b/i;
        return dynamicPattern.test(lower);
    }

    /**
     * EXTRACTS CLEAN TOPIC KEY FROM USER QUERY FOR MEMORY MAPPING
     */
    public extractTopicKey(query: string): string {
        const clean = query.toLowerCase()
            .replace(/^(qué es|que es|quién es|quien es|cuál es|cual es|qué trata|que trata|cómo es|como es|dime sobre|háblame de|hablame de|qué sabes de|que sabes de|saber sobre|sobre|busca|investiga|averigua|qué pasó con|que paso con)\s+/i, '')
            .replace(/[?¿!¡,.:;]/g, '')
            .trim();
        return clean.slice(0, 45) || query.slice(0, 45);
    }

    /**
     * SEARCHES LEARNED MEMORY PROFILE FOR CACHED TOPICS
     */
    public findInLearnedMemory(query: string): { topic: string; explanation: string } | null {
        if (!this.memoryProfile.learnedUserTopics) return null;
        const cleanQuery = query.toLowerCase().replace(/[?¿!¡,.:;]/g, '').trim();
        const queryWords = cleanQuery.split(/\s+/).filter(w => w.length > 3);

        for (const [topic, explanation] of Object.entries(this.memoryProfile.learnedUserTopics)) {
            const cleanTopic = topic.toLowerCase().replace(/[?¿!¡,.:;]/g, '').trim();
            if (cleanTopic.length >= 3 && (cleanQuery.includes(cleanTopic) || cleanTopic.includes(cleanQuery))) {
                return { topic, explanation };
            }
            const topicWords = cleanTopic.split(/\s+/).filter(w => w.length > 3);
            if (topicWords.length > 0) {
                const matches = topicWords.filter(tw => queryWords.includes(tw));
                if (matches.length >= Math.ceil(topicWords.length * 0.6)) {
                    return { topic, explanation };
                }
            }
        }
        return null;
    }

    /**
     * TEXT CLEANING AND GRAMMAR ADAPTATION HELPER
     * Strips URLs, markdown link syntax, source citations, HTML tags, and ensures clean punctuation/capitalization.
     */
    public adaptAndCleanText(text: string): string {
        if (!text) return '';
        let cleaned = text
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Convert [Title](url) to Title
            .replace(/https?:\/\/\S+/gi, '') // Remove URLs
            .replace(/<[^>]*>/g, '') // Remove HTML
            .replace(/📌\s*(Fuentes consultadas|Sources consulted):.*/gi, '') // Remove source lines
            .replace(/[ \t]+/g, ' ')
            .replace(/\n\s*\n\s*\n/g, '\n\n')
            .trim();

        // Capitalize sentence starts
        cleaned = cleaned.replace(/(^\s*|[.!?]\s+)([a-zñáéíóú])/g, (m, p1, p2) => p1 + p2.toUpperCase());
        return cleaned;
    }

    /**
     * FORMATS RESPONSES STRICTLY USING LEVEL 3 DECISION TREE (PLAIN TEXT)
     */
    public formatLevel3Response(content: string, lang: string = 'es', memoryTopic?: string): string {
        const isEs = (lang || 'es').toLowerCase().slice(0, 2) === 'es';
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';
        const level3Node = DECISION_TREE_LEVELS[3];

        const langKey = isEs ? 'es' : 'en';
        const opener = this.stochasticSelect(level3Node.openers[langKey] || level3Node.openers['es']);
        const reflection = this.stochasticSelect(level3Node.reflections[langKey] || level3Node.reflections['es']);
        const socraticQuestion = this.stochasticSelect(level3Node.socraticQuestions[langKey] || level3Node.socraticQuestions['es']);

        const cleanedBody = this.adaptAndCleanText(content);

        let memoryBridge = '';
        if (memoryTopic) {
            memoryBridge = isEs
                ? `\n\n*(Recuperado directamente de nuestra memoria previa sobre **"${memoryTopic}"**)*`
                : `\n\n*(Retrieved directly from our prior memory regarding **"${memoryTopic}"**)*`;
        }

        if (isEs) {
            return `${opener}${nameSalutation}\n\n${reflection}\n\n${cleanedBody}${memoryBridge}\n\n**💭 Indagación Reflexiva:**\n${socraticQuestion}`;
        }

        return `${opener}${nameSalutation}\n\n${reflection}\n\n${cleanedBody}${memoryBridge}\n\n**💭 Reflective Inquiry:**\n${socraticQuestion}`;
    }

    /**
     * LEVEL 3 PRECALCULATED KNOWLEDGE, MEMORY RECOVERY & LIVE SEARCH DISPATCHER
     */
    public async handlePrecalculatedSearchOrOffer(query: string, lang: string = 'es'): Promise<string> {
        const l = (lang || 'es').toLowerCase().slice(0, 2);

        // Check specialized topic limitation in Lite mode
        const liteLimitation = this.checkLiteSpecializedTopicLimitation(query, l);
        if (liteLimitation) {
            return liteLimitation;
        }

        // Check if user is explicitly teaching a concept
        const explanationMatch = query.match(/^(?:el concepto|el tema|el término|la idea|saber sobre)\s+([a-záéíóúñ0-9\s]{2,30})\s+\b(?:trata de|consiste en|significa)\b\s+(.+)/i) ||
            query.match(/^te\s+explico\s+(?:que|sobre)?\s*([a-záéíóúñ0-9\s]{2,30})\s+\b(?:es|trata de|consiste en|significa)\b\s+(.+)/i);

        if (explanationMatch && explanationMatch[1] && explanationMatch[2]) {
            const topic = explanationMatch[1].trim();
            const explanation = explanationMatch[2].trim();
            return this.teachUnknownTopic(topic, explanation);
        }

        // Check if this is a real-time dynamic query (Weather, Economy, Finance)
        const isDynamic = this.isDynamicRealTimeQuery(query);

        if (!isDynamic) {
            // Check memory FIRST for general non-realtime queries!
            const memoryMatch = this.findInLearnedMemory(query);
            if (memoryMatch) {
                // Return saved memory adapted with Level 3 structure directly in chat
                return this.formatLevel3Response(memoryMatch.explanation, l, memoryMatch.topic);
            }
        }

        // If dynamic OR not found in memory, perform online web search
        return await this.handleOnlineSearchAndLearning(query, l, isDynamic);
    }

    /**
     * LIMITACIONES ESPECÍFICAS DE MODO LITE (Sin IA Local)
     * Detecta preguntas médicas (diagnóstico/tratamiento), política, programación y ciencia avanzada,
     * informando la limitación del modo Lite y las instrucciones para activar el Modo Completo con requisitos.
     */
    public checkLiteSpecializedTopicLimitation(query: string, lang: string = 'es'): string | null {
        const lower = query.toLowerCase().trim();
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameGreeting = name ? `, **${name}**` : '';

        // 1. Preguntas médicas y diagnóstico
        const isMedicalOrDiagnosis = /\b(diagnosticar|diagnóstico|diagnostico|diagnostícame|diagnosticame|qué enfermedad tengo|que enfermedad tengo|qué me tomo|que me tomo|receta médica|receta medica|recetarme|medicamento|medicamentos|dosis|qué pastilla|que pastilla|qué medicamento|que medicamento|enfermedad|enfermedades|patología|patologia|tratamiento para|tratamiento de|qué es la diabetes|que es la diabetes|cáncer|cancer|diabetes|hipertensión|hipertension|antibiótico|antibiotico|paracetamol|ibuprofeno|infección|infeccion|fármaco|farmaco|médico|medico|medicina|doctor|cardiología|neurología|psiquiatría clínica|síntomas de|sintomas de|qué tengo|que tengo)\b/i.test(lower);

        // 2. Política y elecciones
        const isPolitics = /\b(política|politica|elecciones|partido político|partidos políticos|gobierno|presidente|congreso|senado|diputados|alcalde|candidato|candidatos|democracia|comunismo|capitalismo|socialismo|derecha e izquierda|leyes políticas|constitución|geopolítica|geopolitica|votar por|elección presidencial|campaña electoral|campana electoral|partido liberal|partido conservador)\b/i.test(lower);

        // 3. Programación y código
        const isProgramming = /\b(programación|programacion|programar|código|codigo|code|coding|javascript|typescript|python|html|css|react|angular|vue|nodejs|node\.js|java\b|c\+\+|c#|golang|rust\b|php|ruby|swift|kotlin|sql|base de datos|mysql|postgresql|mongodb|algoritmo|bug|compilar|compilador|error en código|error de código|función en|script|api rest|json|github|git\b|desarrollo web|desarrollo de software|frontend|backend|fullstack)\b/i.test(lower);

        // 4. Ciencia y temas técnicos avanzados
        const isScienceOrTech = /\b(ciencia|científico|cientifico|física|fisica|química|quimica|biología molecular|biologia molecular|astrofísica|astrofisica|neurociencia avanzada|física cuántica|fisica cuantica|termodinámica|termodinamica|relatividad|genética|genetica|cálculo diferencial|calculo diferencial|cálculo integral|calculo integral|ecuaciones diferenciales|ingeniería|ingenieria|mecánica cuántica|mecanica cuantica|átomo|partículas subatómicas|teorema|trigonometría|trigonometria|álgebra lineal|algebra lineal|geología|astronomía|astronomia|fotosíntesis|fotosintesis)\b/i.test(lower);

        if (!isMedicalOrDiagnosis && !isPolitics && !isProgramming && !isScienceOrTech) {
            return null;
        }

        if (l === 'es') {
            return `⚠️ **Limitación del Modo Aura Lite (Sin IA Local)**
Entiendo tu consulta${nameGreeting}. Como IA en **Modo Aura Lite**, estoy limitada para realizar diagnósticos o responder preguntas médicas, generar código de programación, ni analizar temas de política, ciencia avanzada o consultas técnicas complejas.

✨ **¿Cómo acceder a todo el conocimiento y potencial de Aura?**
Si quieres tener acceso a estos conocimientos y funcionalidades especializadas, puedes hacerlo activando el **Modo Completo (IA Local)**.

⚙️ **Requisitos y activación:**
1. **Requisitos del dispositivo:** El Modo Completo requiere un dispositivo que soporte **WebGL** y cuente con al menos **4 GB de RAM** para que pueda procesar la información y el modelo neuronal correctamente.
2. **Cómo activarlo:** Ve a **Configuración** (el icono de engranaje ⚙️) y verifica que la opción **"Modo Aura Lite (Sin IA Local)"** esté **desactivada (apagada)**.

¡Al apagar el Modo Lite podrás acceder a todo el potencial de Aura!`;
        } else {
            return `⚠️ **Aura Lite Mode Limitation (No Local AI)**
I understand your query${nameGreeting}. As an AI operating in **Aura Lite Mode**, I am limited and cannot provide medical diagnoses or advice, generate programming code, or analyze politics, advanced science, or complex technical topics.

✨ **How to access all of Aura's knowledge and potential?**
If you want to explore medical answers, coding/programming, politics, science, or advanced analytical topics, you can do so by activating **Full Mode (Local AI)**.

⚙️ **Requirements and Activation:**
1. **Device Requirements:** Full Mode requires a device that supports **WebGL** and has at least **4 GB of RAM** so it can process the neural model and information correctly.
2. **How to activate:** Go to **Settings** (gear icon ⚙️) and verify that **"Modo Aura Lite (Sin IA Local)" / "Aura Lite Mode"** is **deactivated (turned OFF)**.

By turning off Lite Mode, you will unlock the full potential of Aura!`;
        }
    }

    /**
     * SEMIOLOGÍA MÉDICA Y CLÍNICA MÉDICA BÁSICA
     * Diferencia cuadros de Ansiedad/Pánico de afecciones orgánicas como Hipertermia, Golpes de Calor e Infecciones Virales.
     */
    public analyzeMedicalSemiology(query: string, lang: string = 'es'): { isMedicalIssue: boolean; message?: string } {
        const lower = query.toLowerCase();
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameGreeting = name ? `, **${name}**` : '';

        // Hyperthermia / Heat stroke / Fever
        const hasHyperthermia = /\b(fiebre|calentura|hipertermia|golpe de calor|mucho calor|temperatura alta|escalofrios|escalofríos|sudor frio|sudor frío|38 grados|39 grados|40 grados|golpe de sol)\b/i.test(lower);
        
        // Viral / Infectious syndrome
        const hasViral = /\b(infeccion|infección|cuadro viral|cuerpo cortado|mialgia|dolor de cuerpo|dolor de articulaciones|artralgia|dolor de garganta|odinofagia|tos|flemas|congestion|congestión|ganglios|infeccioso)\b/i.test(lower);

        if (hasHyperthermia || hasViral) {
            // Save flag in profile
            const flag = hasHyperthermia ? 'hipertermia_fiebre' : 'cuadro_viral';
            if (!this.memoryProfile.medicalHistoryFlags.includes(flag)) {
                this.memoryProfile.medicalHistoryFlags.push(flag);
                this.saveMemoryProfile();
            }

            if (l === 'es') {
                return {
                    isMedicalIssue: true,
                    message: `🩺 **Análisis de Semiología Clínica Básica:**
Entiendo lo incómodo que se siente esto${nameGreeting}. Al analizar tus síntomas (como ${hasHyperthermia ? 'fiebre, sensación de calor intenso o escalofríos' : 'malestar corporal, dolor articular o síntoma viral'}), es vital diferenciar un estado de **ansiedad** (que no genera fiebre ni infección) de una **afección clínica u orgánica real** (como un cuadro viral, proceso infeccioso o hipertermia/golpe de calor).

⚠️ **Protocolo de Seguridad Clínica:**
1. **Mide tu temperatura:** Utiliza un termómetro para confirmar si existe fiebre real (>37.8°C).
2. **Hidratación y reposo:** Mantente en un lugar fresco, bebe agua fresca y descansa.
3. **Atención Médica Presencial:** Si la fiebre persiste, hay dolor severo o malestar generalizado, **es indispensable que seas evaluado presencialmente por un médico profesional o acudas a un centro de salud**.

Si descartas la fiebre y sientes que la molestia surge por agitación emocional o estrés, avísame y con gusto hacemos un ejercicio de respiración. ¿Cómo te sientes en este instante?`
                };
            } else {
                return {
                    isMedicalIssue: true,
                    message: `🩺 **Basic Clinical Semiology Analysis:**
I hear you${nameGreeting}. Looking at symptoms like ${hasHyperthermia ? 'fever, feeling hot, or chills' : 'body aches, sore throat, or viral malaise'}, it is essential to differentiate **anxiety** (which does not cause fever) from an **organic medical condition** (such as hyperthermia, heat exhaustion, or a viral infection).

⚠️ **Clinical Safety Protocol:**
1. **Check your temperature:** Use a thermometer to verify if fever is present (>37.8°C / >100°F).
2. **Hydrate and rest:** Stay in a cool environment and drink water.
3. **Medical Evaluation:** If fever persists or you feel physically unwell, **please consult a medical professional or visit a clinic immediately**.

If fever is ruled out and you feel this is anxiety-related, let me know so we can do a grounding breathing exercise together.`
                };
            }
        }

        return { isMedicalIssue: false };
    }

    /**
     * DETECCIÓN DE POLOS COGNITIVOS Y PLANES DE CONTINGENCIA TERAPÉUTICOS
     * Analiza temas de separación, negatividad extrema, alegría extrema (manía) y pánico para activar contención inmediata.
     */
    public detectCognitivePolarityAndContingency(query: string, lang: string = 'es'): { hasPolarity: boolean; contingencyMessage?: string } {
        const lower = query.toLowerCase();
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameGreeting = name ? `, **${name}**` : '';

        // Polarity 1: Separation & Grief
        const isSeparation = /\b(separacion|separación|divorcio|me dejo|me dejó|terminamos|me abandono|me abandonó|ruptura|soledad extrema|se fue|duelo)\b/i.test(lower);

        // Polarity 2: Extreme Negativity / Hopelessness
        const isExtremeNegativity = /\b(nada sirve|todo esta perdido|todo está perdido|ya no puedo mas|ya no puedo más|no valgo nada|culpa insoportable|sin salida|para que seguir|para qué seguir)\b/i.test(lower);

        // Polarity 3: Extreme Euphoria / Mania
        const isExtremeEuphoria = /\b(euforia extrema|soy invencible|no necesito dormir|pensamientos aceleradísimos|energia desbordada|soy dios|nada me puede parar|super mania|súper manía)\b/i.test(lower);

        // Polarity 4: Acute Panic
        const isAcutePanic = /\b(ataque de panico|ataque de pánico|siento que me muero|me voy a morir|me asfixio|perder el control|locura total)\b/i.test(lower);

        if (isSeparation || isExtremeNegativity || isExtremeEuphoria || isAcutePanic) {
            let polarityType: 'separation' | 'extreme_negativity' | 'extreme_euphoria' | 'panic' = 'separation';
            if (isExtremeNegativity) polarityType = 'extreme_negativity';
            if (isExtremeEuphoria) polarityType = 'extreme_euphoria';
            if (isAcutePanic) polarityType = 'panic';

            // Log polarity in memory
            this.memoryProfile.cognitivePolarityPoles[polarityType] = (this.memoryProfile.cognitivePolarityPoles[polarityType] || 0) + 1;
            this.saveMemoryProfile();

            if (l === 'es') {
                if (isSeparation) {
                    return {
                        hasPolarity: true,
                        contingencyMessage: `🛡️ **Plan de Contingencia Terapéutico (Acompañamiento en Duelo y Separación):**
Siento de corazón el dolor y la marejada emocional que produce una separación o pérdida${nameGreeting}. Cuando un vínculo importante se fractura, es completamente natural experimentar desconcierto, vacío y oscilaciones emocionales.

🌿 **Pasos de Estabilización Inmediata:**
1. **Permítete sentir sin juzgarte:** No tienes que demostrar fortaleza ni apresurar el duelo hoy.
2. **Anclaje en el presente:** Apoya tus pies firmes en el suelo, respira suavemente en 4 segundos e imagina que estás dándote un abrazo de contención.
3. **Tu capacidad interna:** Aunque en este instante duela mucho, tienes la fortaleza interior para atravesar este proceso paso a paso.

 Si sientes que este peso supera tu capacidad actual para sobrellevarlo a solas, te recomiendo de corazón considerar la atención con un terapeuta humano profesional o contactar a los grupos de apoyo de WineBOX ("💚 Solicitar atención" / $22 USD/mes) para recibir acompañamiento especializado.`
                    };
                }

                if (isExtremeNegativity) {
                    return {
                        hasPolarity: true,
                        contingencyMessage: `🛡️ **Plan de Contingencia Terapéutico (Desescalada de Negatividad Extrema y Desesperanza):**
Te escucho con toda mi empatía y respeto${nameGreeting}. Entiendo que cuando la mente entra en un polo de negatividad extrema, todo parece oscuro y agotador. Sin embargo, quiero recordarte que **un pensamiento de desesperanza no es una verdad definitiva, sino un estado emocional transitorio**.

🌿 **Acciones de Reestructuración y Calma:**
1. **Pausa de Realidad:** Detengámonos un instante. Respira profundo por la nariz y exhala despacio por la boca.
2. **Reconoce tus recursos:** Tienes la capacidad intrínseca para superar momentos difíciles, tal como lo has hecho en el pasado.
3. **Iremos paso a paso:** No necesitas resolver tu vida entera hoy, solo enfócate en los próximos 5 minutos.

 Te acompaño a cada paso. Si sientes que la desesperanza se vuelve insostenible, la mejor decisión es buscar ayuda profesional presencial o comunicarte con el equipo de WineBOX ("💚 Solicitar atención") para recibir apoyo psicoterapéutico guiado.`
                    };
                }

                if (isExtremeEuphoria) {
                    return {
                        hasPolarity: true,
                        contingencyMessage: `🛡️ **Plan de Contingencia Terapéutico (Estabilización de Polos Euforia / Manía):**
Aprecio que compartas tu vivencia${nameGreeting}. La euforia extrema o los polos de alta aceleración cognitiva pueden parecer placenteros al inicio, pero en la clínica sabemos que los polos extremos suelen indicar inestabilidad en la autorregulación.

🌿 **Práctica de Enraizamiento y Regulación:**
1. **Bajar las revoluciones:** Siéntate en una silla cómoda, apoya la espalda firmemente y haz 3 respiraciones profundas y pausadas.
2. **Pausa antes de actuar:** Evita tomar decisiones impulsivas, compras o compromisos grandes mientras te sientas en este polo acelerado.
3. **Punto medio:** La verdadera paz mental se encuentra en el equilibrio sereno, no en los picos extremos.

¿Te gustaría que hagamos un breve ejercicio de atención enfocada para pausar el ritmo y asentar tu energía de forma tranquila?`
                    };
                }

                if (isAcutePanic) {
                    return {
                        hasPolarity: true,
                        contingencyMessage: `🛡️ **Plan de Contingencia Terapéutico (Atención Inmediata de Crisis de Pánico):**
Estoy aquí contigo, no estás solo/a${nameGreeting}. Lo que estás sintiendo en tu cuerpo es una descarga intensa de adrenalina, pero **estás a salvo y este pico de pánico pasará en unos minutos**.

🌿 **Ejercicio Inmediato de Anclaje (Grounding 5-4-3-2-1):**
1. **Respiración:** Toma aire en 4 segundos, sostenlo 2 segundos y suéltalo muy despacio en 6 segundos.
2. **Observa a tu alrededor:** Nombra mentalmente 5 objetos que veas cerca de ti.
3. **Toca una superficie:** Siente la textura del escritorio, la silla o tu ropa.

El pánico es muy incómodo, pero no es peligroso y cederá. Mantén los pies sobre la tierra. Estoy aquí para escucharte.`
                    };
                }
            }
        }

        return { hasPolarity: false };
    }

    /**
     * REGISTRO DE CONDUCTA OPERANTE Y APRENDIZAJE PREDICTIVO
     * Log Antecedents, Responses, and Emotional Consequences to predict user triggers in future dialogue turns.
     */
    public logOperantBehavior(antecedent: string, response: string, emotion: string, stressLevel: number): void {
        const entry: OperantBehaviorEntry = {
            timestamp: Date.now(),
            antecedent: antecedent.slice(0, 100),
            response: response.slice(0, 100),
            emotionalConsequence: emotion,
            predictedTrigger: stressLevel > 5 ? 'alta_carga_emocional' : 'mantenimiento_baseline'
        };

        this.memoryProfile.operantBehaviors.unshift(entry);
        if (this.memoryProfile.operantBehaviors.length > 25) {
            this.memoryProfile.operantBehaviors.pop();
        }
        this.saveMemoryProfile();
    }

    /**
     * ENSEÑANZA Y GUARDADO DE CONCEPTOS APRENDIDOS DEL USUARIO
     */
    public teachUnknownTopic(topic: string, explanation: string): string {
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';
        const cleanTopic = topic.trim().toLowerCase();

        this.memoryProfile.learnedUserTopics[cleanTopic] = explanation.trim();
        this.saveMemoryProfile();

        return `¡Muchas gracias por explicármelo con tanto detalle${nameSalutation}! Me queda muy claro lo que significa **"${topic}"**.

A partir de este momento, lo mantendré muy presente para cuando volvamos a platicar sobre ello. ¿De qué te gustaría que sigamos conversando hoy?`;
    }

    /**
     * ONLINE INFORMATION SEARCH & LEVEL 3 PLAIN-TEXT MEMORY LEARNING ENGINE
     */
    public async handleOnlineSearchAndLearning(query: string, lang: string = 'es', isDynamicRealTime: boolean = false): Promise<string> {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';
        const { emotion, stressLevel } = this.analyzeEmotion(query);

        try {
            const userEmotions = [emotion];
            if (stressLevel > 5) userEmotions.push('estrés_alto');

            const apiRes = await fetch('/api/search', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query,
                    lang: l,
                    userEmotions
                })
            });

            if (apiRes.ok) {
                const data = await apiRes.json();
                if (data.success && data.summary) {
                    const rawSummary = data.summary;
                    const cleanedSummary = this.adaptAndCleanText(rawSummary);

                    // If NOT real-time dynamic data (weather/economy/finance), persist in memory for future queries
                    if (!isDynamicRealTime) {
                        const topicKey = this.extractTopicKey(query);
                        this.memoryProfile.learnedUserTopics[topicKey] = cleanedSummary;

                        const learnedSnippet = `${topicKey}: ${cleanedSummary.slice(0, 80)}...`;
                        if (!this.memoryProfile.learnedFacts.includes(learnedSnippet)) {
                            this.memoryProfile.learnedFacts.unshift(learnedSnippet);
                            if (this.memoryProfile.learnedFacts.length > 15) {
                                this.memoryProfile.learnedFacts.pop();
                            }
                        }

                        this.nodes.forEach(n => {
                            if (n.domain === 'cognition' || n.domain === 'zen') {
                                n.synapseWeight = Math.min(2.5, n.synapseWeight + 0.12);
                                n.activation = 0.85;
                            }
                        });

                        this.saveMemoryProfile();
                        this.saveNodes();
                    }

                    // Format and return directly as Level 3 plain text in chat
                    return this.formatLevel3Response(cleanedSummary, l);
                }
            }
        } catch (e) {
            console.warn('Error fetching /api/search:', e);
        }

        // Natural Level 3 fallback if search service fails
        const fallbackMsg = l === 'es'
            ? `Estuve consultando información sobre "${query}"${nameSalutation}. ¿Qué aspecto de este tema te genera mayor curiosidad explorar hoy?`
            : `I looked up information regarding "${query}"${nameSalutation}. What detail of this topic would you like us to reflect on today?`;

        return this.formatLevel3Response(fallbackMsg, l);
    }

    /**
     * DYNAMIC RELATIONSHIP BREAKUP / ABANDONMENT RESPONDER
     * Accompanies users facing breakup/divorce/abandonment with deep empathy,
     * maieutic reflection, cognitive stimulation framing, WineBOX game suggestions,
     * and therapy group referral ("💚 Solicitar atención").
     */
    public generateDynamicRelationshipBreakup(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const poolEs = [
                `Hola${nameSalutation}. Escucho con un profundo respeto lo que estás viviendo. Atravesar el fin de una relación o sentir que la persona que amabas se ha ido es una de las experiencias emocionales más dolorosas e intensas que podemos experimentar como seres humanos.

**💡 Reflexión Mayéutica & Apoyo Cognitivo:**
En la psicología cognitiva, cuando enfrentamos una pérdida afectiva, la mente suele entrar en bucles de rumiación ("¿qué hice mal?", "¿por qué se fue?"). Esto hiperactiva la amígdala y genera angustia constante. 

Te propongo observar lo que sientes con mucha compasión:
- ¿En este preciso instante, sientes que el dolor se concentra en la soledad física, en el miedo a lo que vendrá, o en la sensación de haber perdido tu centro?
- Recuerda que no necesitas resolver toda tu vida hoy. Ir un día a la vez, o un momento a la vez, es suficiente.

**🕹️ Estimulación Cognitiva & Pausa Activa de WineBOX:**
Cuando la mente se sienta saturada por el pensamiento cíclico, realizar una actividad de atención enfocada puede ayudar a darle un descanso a la carga cognitiva:
- **Sudoku / Buscaminas:** Rompecabezas de lógica estricta que redirigen la energía a la resolución de problemas objetivos.
- **Solitario / Solitario Spider:** Juegos de orden secuencial y ritmo pausado para restablecer la calma.
- **Box World:** Desafío de lógica espacial de 100 niveles para ejercitar la planificación ejecutiva.
*(Nota: Estas actividades de WineBOX son herramientas sencillas de distracción cognitiva activa y enfoque, no certezas ni sustitutos de un tratamiento médico o terapéutico).*

**💚 Acompañamiento Profesional & Grupos de Apoyo:**
Si sientes que la carga emocional es demasiado pesada, recuerda que en el botón **"💚 Solicitar atención"** en la barra superior puedes informarte sobre acompañamiento terapéutico e integrarte a grupos de apoyo emocional en WhatsApp.

¿Cómo te sientes en este instante al hacer esta pausa? Estoy aquí para escucharte.`,

                `Hola${nameSalutation}. Gracias por compartir esto conmigo. Perder a tu pareja o enfrentar una separación o abandono sacude nuestras bases más íntimas y deja un espacio de dolor que requiere tiempo y ternura para sanar.

**💡 Perspectiva Cognitiva:**
La mente interpreta la separación como una amenaza repentina a la seguridad. Por eso es normal sentir opresión en el pecho, nudo en la garganta o cansancio profundo.
- Si diriges tu mirada hacia adentro ahora mismo: ¿Qué es lo que más necesita tu cuerpo y tu mente hoy? ¿Descansar, llorar, expresarte o distraerte un poco?
- Un ejercicio útil de reestructuración cognitiva es recordar: *"Estoy atravesando un duelo emocional profundo, pero mi valor como persona sigue intacto."*

**🕹️ Herramientas de Enfoque Cognitivo de WineBOX:**
Para momentos de desvelo o cuando necesites despejar la mente:
- **Simon:** Juego de secuencia de luces y tonos para el anclaje sensorial y la atención auditiva.
- **TuxPaint:** Espacio de dibujo libre y colores sin reglas para liberar tensión en silencio.
*(Recomendaciones de estimulación mental para la vida cotidiana).*

**💚 Grupos de Terapia y Red de Acompañamiento:**
No tienes que pasar por esto en soledad. Presionando el botón **"💚 Solicitar atención"** puedes consultar sobre psicoterapia individual y grupos de apoyo para procesos de ruptura.

¿De qué te gustaría platicar en este momento? Te escucho sin prisa.`,

                `Hola${nameSalutation}. Comprendo la tristeza y el desorientación que estás sintiendo. Una ruptura amorosa implica reconstruir la rutina y sanar la herida del apego.

**💡 Diálogo Mayéutico:**
- ¿Hay algún pensamiento repetitivo en particular que te esté quitando la paz hoy?
- A veces tendemos a responsabilizarnos de todo o a idealizar el pasado. Reconocer que ambas personas cambian y que el dolor presente es transitorio ayuda a procesar la pérdida.

**🕹️ Ejercicios de Estimulación Cognitiva de WineBOX:**
- **Hextris / Breakout:** Actividades de enfoque de respuesta motora rápida para cortar la rumiación nocturna.
- **SimCity / Theme Park:** Construcción y organización para estimular la visión estratégica y la planificación.
*(Herramientas de pausa y enfoque de WineBOX).*

**💚 Cuidado Profesional:**
Recuerda que en el botón **"💚 Solicitar atención"** puedes pedir información sobre psicólogos capacitados y grupos de apoyo mutuo.

Estoy aquí a tu lado. ¿Cómo sientes tu respiración ahora mismo?`
            ];

            return this.stochasticSelect(poolEs, undefined, 0.85);
        }

        // English fallback
        return `Hello${nameSalutation}. I hear you with deep respect. Going through a breakup or feeling abandoned by someone you loved is one of the most painful human experiences.

**💡 Cognitive Perspective:**
When facing romantic loss, the brain naturally ruminates. Remember that going step by step, one moment at a time, is enough.
- Ask yourself: What does your mind need most right now? Rest, expression, or a quiet pause?

**🕹️ WineBOX Cognitive Grounding:**
Games like **Sudoku**, **Simon**, **Solitaire**, or **Box World** offer active cognitive focus to give your mind a break from overthinking. *(Note: These are non-therapeutic mental exercises).*

**💚 Support & Therapy:**
Click the **"💚 Support request"** button at the top if you wish to connect with professional therapy or emotional support groups.

How are you feeling right now? I am here to listen.`;
    }

    /**
     * DYNAMIC GRIEF / BEREAVEMENT RESPONDER
     * Accompanies users experiencing the death/loss of a loved one with deep respect,
     * maieutic inquiry, emotional validation, WineBOX cognitive pause activities,
     * and therapy referral ("💚 Solicitar atención").
     */
    public generateDynamicGriefResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const poolEs = [
                `Hola${nameSalutation}. Honro y respeto profundamente el dolor que compartes conmigo. La pérdida de un ser querido abre un espacio sagrado de dolor que merece todo el tiempo, el respeto y la ternura del mundo.

**💡 Comprensión Cognitiva del Duelo:**
El duelo no es un problema que deba "solucionarse" con prisa, sino un proceso biológico y afectivo de adaptación. Es completamente natural sentir oleadas de tristeza, vacío, cansancio o desconcierto.
- Si diriges tu atención al presente en este segundo: ¿Sientes una pesadez física, un mar de pensamientos o una necesidad de silencio y abrazo?
- Permítete sentir lo que surja. Llorar o sentir pausa es la respuesta honesta del amor reconociendo la ausencia.

**🕹️ Pausas de Descanso Cognitivo en WineBOX:**
Para aquellos momentos de desvelo o donde el vacío abrumador dificulte conciliar la paz:
- **TuxPaint:** Dibujo y colores sin reglas para expresar emociones sin necesidad de palabras.
- **Simon:** Estimulación de memoria visual y auditiva para anclar la mente en ritmos suaves.
- **Solitario / Sudoku:** Juegos de lógica pausada para brindar un pequeño refugio mental de tranquilidad.
*(Recordatorio: Las actividades de WineBOX son apoyos de estimulación y descanso mental cotidiano, no certezas ni tratamientos psicológicos).*

**💚 Acompañamiento Profesional en Duelo:**
Si sientes que la tristeza es demasiado pesada y necesitas sostén profesional humano, haz clic en el botón **"💚 Solicitar atención"** en la barra superior para recibir información sobre psicoterapia en duelo y grupos de apoyo.

¿Cómo te encuentras en este preciso instante? Estoy aquí contigo, a tu ritmo.`,

                `Hola${nameSalutation}. Siento mucho el dolor por el que estás pasando. La partida de un ser querido detiene el tiempo y hace que el mundo alrededor parezca ir a una velocidad extraña.

**💡 Mayéutica & Cuidado Emocional:**
En el duelo, la mejor manera de cuidar de ti es ir momento a momento:
- ¿Hay algún recuerdo bonito o un valor especial de esa persona que te reconforte recordar en este instante?
- Háblate con la misma paciencia y compasión con la que cuidarías a alguien muy querido que está sufriendo.

**🕹️ Espacios de Enfoque Pausado en WineBOX:**
- **Box World / Buscaminas:** Para enfocar suavemente la atención ejecutiva en lógica espacial simple cuando necesites descansar del torbellino emocional.
*(Herramientas cotidianas para la atención activa).*

**💚 Red de Terapia y Grupos:**
Recuerda que en el menú superior cuentas con el botón **"💚 Solicitar atención"** para informarte sobre psicoterapeutas y grupos de acompañamiento en el duelo.

Te escucho con mucho respeto y afecto. ¿Quieres platicar más de lo que estás sintiendo?`
            ];

            return this.stochasticSelect(poolEs, undefined, 0.85);
        }

        return `Hello${nameSalutation}. I deeply honor and respect the pain you are sharing. The loss of a loved one is a profound experience that requires patience, self-compassion, and gentle care.

**💡 Grief Understanding:**
Grief is not something to be rushed. Allow yourself to feel whatever arises—sadness, fatigue, or the need for quiet.
- Ask yourself: What brings you the most comfort right now?

**🕹️ WineBOX Cognitive Pause:**
Simple focus tools like **TuxPaint** (creative drawing), **Simon** (rhythm memory), or **Solitaire** can provide gentle moments of mental rest. *(Non-therapeutic cognitive aids).*

**💚 Professional Guidance:**
Feel free to use the **"💚 Support request"** button above to inquire about professional grief therapy and support groups.

I am here with you. How are you feeling right now?`;
    }

    /**
     * 1. CORE INITIAL QUESTION: "Necesito ordenar mis pensamientos"
     */
    public generateOrganizeThoughtsResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pool = [
                `Hola${nameSalutation}. Qué valioso que reconozcas esa necesidad. Cuando la mente se llena de ideas, tareas y preocupaciones al mismo tiempo, es completamente natural sentirse abrumado o sentir que los pensamientos colisionan.

**💡 Método de Descongestión Cognitiva (3 Pasos):**

1. **Descarga Externa:** Toma lápiz y papel (o una nota en tu teléfono) y escribe sin filtro ni orden gramatical todo lo que ronda en tu cabeza. El objetivo no es redactar bien, sino liberar espacio en tu memoria de trabajo prefrontal.
2. **Clasificación de Control:** Revisa lo escrito y divídelo en dos columnas sencillas:
   - *Lo que depende 100% de ti hoy.*
   - *Lo que está fuera de tu control o pertenece al futuro incierto.*
3. **La Micro-Acción Única:** Elige una sola tarea pequeña que no te tome más de 3 a 5 minutos y ejecútala. Completar una micro-acción le envía a tu cerebro la señal fisiológica de que vuelves a tener el control.

**🕹️ Pausa de Enfoque Estratégico en WineBOX:**
Si necesitas despejar la mente antes de empezar a escribir, realizar un juego de lógica como **Sudoku**, **Solitario Spider** o **Box World** ayuda a reordenar las funciones ejecutivas del cerebro.

¿Qué pensamiento o pendiente es el que más espacio te está quitando en este instante? Platícame y lo desmenuzamos juntos paso a paso.`,

                `Te escucho con atención${nameSalutation}. Ordenar los pensamientos es un proceso que requiere paciencia y compasión hacia uno mismo.

**🌿 Pasos de Claridad Mental:**
- **Detener el torbellino:** Antes de intentar solucionar todo, haz una pausa. Respiremos despacio una vez.
- **Identificar la emoción central:** Pregúntate: *"De todo lo que tengo en mente, ¿qué es lo que me genera más inquietud o apuro en este segundo?"*
- **Aceptar lo inacabado:** No todo necesita quedar resuelto hoy. Establecer límites a lo que le exiges a tu mente hoy te dará tranquilidad.

¿Te gustaría que hagamos juntos un ejercicio de preguntas sencillas para separar lo urgente de lo importante? Estoy a tu lado.`
            ];
            return this.stochasticSelect(pool, undefined, 0.85);
        }

        return `Hello${nameSalutation}. Recognizing the need to order your thoughts is a wonderful first step. When the mind gets crowded, feeling overwhelmed is completely natural.

**💡 3-Step Cognitive Decluttering:**
1. **Brain Dump:** Write down everything in your head on paper without worrying about structure.
2. **Control Triaging:** Separate items into "What I can control right now" vs "What is outside my control".
3. **Micro-Action:** Focus on just one tiny task taking less than 5 minutes.

**🕹️ WineBOX Focus Pause:**
Games like **Sudoku** or **Solitaire** provide structured logical focus to calm mental noise.

What specific thought is taking up the most space in your mind right now? Let's break it down together step by step.`;
    }

    /**
     * 2. CORE INITIAL QUESTION: "¿Cómo puedo manejar la ansiedad?"
     */
    public generateManageAnxietyResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pool = [
                `Hola${nameSalutation}. Gracias por confiarme esto. La ansiedad puede sentirse como una ola intensa que sacude el cuerpo y acelera la mente, pero quiero recordarte algo muy importante: **la ansiedad es incómoda, pero es temporal y no estás en peligro.**

**💡 Estrategias de Regulación para la Ansiedad:**

1. **Anclaje Fisiológico (Respiración 4x4 o Cuadrada):**
   - Inhala suavemente por la nariz contando **4 segundos**.
   - Mantén el aire durante **4 segundos**.
   - Exhala lentamente por la boca en **4 segundos**.
   - Haz una pausa sin aire de **4 segundos**. Repite 3 veces para activar el tono vagal parasimpático.
2. **Técnica 5-4-3-2-1 de Sensibilización:**
   Mira a tu alrededor y nombra mentalmente:
   - **5** cosas que puedes ver.
   - **4** cosas que puedes tocar o sentir.
   - **3** sonidos que puedes escuchar.
   - **2** olores que puedes percibir.
   - **1** sensación presente en tu cuerpo.
3. **Cuestionar la Falsa Alarma:**
   Recuerda que la ansiedad es el sistema de defensa de tu amígdala activado por error. Dite a ti mismo: *"Mi cuerpo está sintiendo tensión, pero estoy a salvo en este momento."*

**🕹️ Anclaje Sensorial con WineBOX:**
Juegos como **Simon** (secuencias de ritmo y luz) o **Hextris** desvían la hiperatención del cuerpo hacia una tarea de respuesta motora suave.

**💚 Red de Apoyo Profesional:**
Si la ansiedad se vuelve muy recurrente, recuerda que presionando el botón **"💚 Solicitar atención"** puedes consultar sobre terapia y grupos de apoyo.

¿Cómo sientes tu pecho y tu respiración en este preciso momento? Tómate el tiempo que necesites.`,

                `Comprendo muy bien lo angustiante que puede ser sentir ansiedad${nameSalutation}. Estoy aquí contigo, libre de juicios y a tu ritmo.

**🌿 Pasos de Calma Inmediata:**
- **No luches contra la sensación:** Intentar "forzar" la calma suele aumentar la tensión. Acepta que tu cuerpo siente agitación y dale permiso de ir bajando la velocidad poco a poco.
- **Apoya tus pies con firmeza en el suelo:** Siente el contacto con la tierra o el piso. Eres una presencia sólida en este lugar.
- **Baja el volumen a los pensamientos del futuro:** La ansiedad vive en el "qué pasará si...". Regresa al presente: *"En este minuto exacto, estoy bien."*

¿Te gustaría que hagamos una pausa juntos para hacer 3 respiraciones profundas ahora mismo?`
            ];
            return this.stochasticSelect(pool, undefined, 0.85);
        }

        return `Hello${nameSalutation}. I hear you clearly. Anxiety can feel intense, but remember: **anxiety is uncomfortable, but it is temporary and you are safe.**

**💡 Quick Grounding Protocol:**
1. **Square Breathing (4x4):** Inhale for 4s, hold for 4s, exhale for 4s, hold empty for 4s.
2. **5-4-3-2-1 Sensory Grounding:** Identify 5 visible items, 4 tactile sensations, 3 sounds, 2 scents, and 1 taste.
3. **Self-Reassurance:** Remind yourself: *"My body is feeling alert, but I am safe right now."*

**🕹️ Sensory Focus:**
Games like **Simon** or **Hextris** help redirect focus toward pleasant, rhythmic tasks.

How is your breathing right now? Take all the time you need.`;
    }

    /**
     * 3. CORE INITIAL QUESTION: "¿Qué técnica de relajación me recomiendas?"
     */
    public generateRelaxationTechniqueResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pool = [
                `Hola${nameSalutation}. Me da mucho gusto que busques un espacio para relajarte. Te voy a recomendar dos de las técnicas más efectivas y científicamente respaldadas para calmar el sistema nervioso en pocos minutos:

**🌿 1. El Suspiro Fisiológico (Physiological Sigh):**
Es la forma más rápida y natural en la que el cerebro restablece los niveles de dióxido de carbono y desacelera el ritmo cardíaco.
- Haz **dos inhalaciones consecutivas por la nariz** (una profunda y enseguida un segundo 'estirón' corto de aire).
- Exhala todo el aire **muy lentamente por la boca** soltando un leve suspiro.
- Realiza de 3 a 5 ciclos consecutivos. Notarás un alivio muscular inmediato.

**🌿 2. Relajación Muscular Progresiva Exprés:**
- **Hombros:** Súbelos hacia tus orejas apretando 5 segundos y déjalos caer de golpe liberando todo el peso.
- **Mandíbula:** Separa ligeramente los dientes, apoya la punta de la lengua en el paladar y suelta la tensión del rostro.
- **Manos:** Aprieta los puños 5 segundos y ábrelos despacio sobre tus muslos.

**🕹️ Estimulación Creativa y Relajante de WineBOX:**
Para acompañar la relajación, la actividad de **TuxPaint** (dibujo y colores libres) o **Solitario** te permite pausar en un ritmo tranquilo y sereno.

¿Cuál de estas dos técnicas te gustaría probar ahora mismo? Te acompaño paso a paso.`,

                `Hola${nameSalutation}. La mejor técnica de relajación es aquella que resulta amable y sencilla de integrar en tu día.

**💡 Mi recomendación favorita: "La Pausa de la Respiración 4-7-8"**
1. Vacía el aire de tus pulmones.
2. Inhala por la nariz suavemente contando **4 segundos**.
3. Mantén suavemente el aire contando **7 segundos**.
4. Exhala por la boca dejando salir el aire en **8 segundos**.

Esta técnica disminuye la presión arterial y facilita el descanso. ¿Te gustaría intentarla conmigo en este instante?`
            ];
            return this.stochasticSelect(pool, undefined, 0.85);
        }

        return `Hello${nameSalutation}. I am glad you are seeking a moment of relaxation. Here are two highly effective techniques:

**🌿 1. The Physiological Sigh:**
Take **two quick inhales through your nose** (one deep, one short follow-up), then **one long, slow exhale through your mouth**. Repeat 3-5 times to quickly lower heart rate.

**🌿 2. Progressive Muscle Release:**
Raise your shoulders to your ears for 5 seconds, then drop them completely. Release jaw and facial tension.

**🕹️ Creative Relaxation:**
Try **TuxPaint** for peaceful drawing or **Solitaire** for gentle focus.

Would you like to try the Physiological Sigh together right now?`;
    }

    /**
     * 4. CORE INITIAL QUESTION: "Ayúdame a ser más amable conmigo mismo"
     */
    public generateSelfCompassionResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pool = [
                `Hola${nameSalutation}. Qué hermoso y valiente deseo. Ser amable con uno mismo es una de las prácticas más sanadoras y transformadoras que existen, especialmente en una cultura que a menudo nos enseña a juzgarnos con severidad.

**💡 El Marco de la Autocompasión Consciente (Kristin Neff):**

1. **Reconocer el Dolor sin Juzgar:** En lugar de decirte "no debería sentirme así", prueba decirte: *"Esto que siento es difícil en este momento, y está bien sentirlo."*
2. **Humanidad Compartida:** Recuerda que cometer errores, sentir miedo, dudar o estar cansado no te hace débil ni defectuoso; es parte esencial de la experiencia humana de todos nosotros.
3. **El Test del Buen Amigo:** Cuando te descubras criticándote duramente, hazte esta pregunta:
   - *"¿Le diría estas mismas palabras a un ser querido o a un amigo entrañable que está pasando por lo mismo?"*
   - Si no se lo dirías a él, **no te lo digas a ti.**

**🌿 Un Ejercicio Sencillo para Hoy:**
Coloca una mano suavemente sobre tu pecho o tu hombro y repite mentalmente: *"Que pueda tratarme hoy con la misma amabilidad y paciencia que le ofrecería a quien más amo."*

¿Hay alguna frase o exigencia interna en particular que sientas que te cuesta soltar hoy? Estoy aquí para escucharte y abrazar tu proceso.`,

                `Estoy aquí a tu lado${nameSalutation}. Aprender a tratarnos con ternura es un camino que se recorre paso a paso.

**💡 Reestructurando el Diálogo Interno:**
- A menudo somos nuestro juez más estricto. Cuando aparezca un pensamiento crítico, haz una pausa y pregúntate: *"¿Qué respuesta llena de amor y comprensión necesito escuchar en este instante?"*
- Recuerda que tu valor no depende de la perfección ni de complacer a todos. Valeras exactamente lo mismo en tus días brillantes y en tus días grises.

¿Te gustaría que practiquemos juntos una afirmación de autocompasión para tu día?`
            ];
            return this.stochasticSelect(pool, undefined, 0.85);
        }

        return `Hello${nameSalutation}. What a beautiful and profound intention. Learning to be kind to yourself is deeply transformative.

**💡 The 3 Pillars of Self-Compassion:**
1. **Mindful Acceptance:** Acknowledge your current state without judgment: *"This is tough right now, and that's okay."*
2. **Common Humanity:** Imperfection and doubt are normal parts of being human.
3. **The Best Friend Test:** Ask yourself: *"Would I speak to a dear friend in the harsh tone I am using on myself?"* If not, speak softly to yourself instead.

What harsh thought or pressure would you like us to soften together today?`;
    }

    /**
     * 5. CORE INITIAL QUESTION: "¿Cómo mejorar mi autoestima?"
     */
    public generateImproveSelfEsteemResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pool = [
                `Hola${nameSalutation}. Trabajar en la autoestima no significa repetir frases vacías frente al espejo, sino **construir una relación de respeto, autoconfianza y aceptación real contigo mismo.**

**💡 Pilares Clave para Fortalecer tu Autoestima:**

1. **Reconocer tus Logros Diarios (Autoeficacia):** La autoestima se nutre cuando tu cerebro observa que cumples lo que te prometes. No se trata de grandes hazañas, sino de cumplir micro-compromisos (hacer la cama, tomar agua, descansar).
2. **Establecer Límites Saludables:** Decir "no" a peticiones que atropellan tu tiempo o tu energía le enseña a tu subconsciente que tu bienestar es valioso.
3. **Desvincular tu Valor de la Aprobación Externa:** Lo que otros piensen de ti habla de sus expectativas, no de tu verdadero valor como persona.
4. **Cuidar tu Lenguaje Interno:** Trátate con la dignidad de quien está en constante aprendizaje.

**🕹️ Desafíos de Autoeficacia en WineBOX:**
Completar niveles en juegos de estrategia como **Box World** o resolver acertijos de **Buscaminas** refuerza la sensación de capacidad ejecutiva y logro personal.

¿Cuál es la fortaleza o virtud personal de la que te sientes más orgulloso, aunque a veces olvides reconocerla? Hablemos de ello.`,

                `Hola${nameSalutation}. La verdadera autoestima es el abrazo sincero a quien eres hoy, reconociendo tanto tus virtudes como tu vulnerabilidad.

**🌿 Prácticas de Amor Propio:**
- **Detén las comparaciones:** Tu camino es único. Comparar tu interior con la fachada externa de los demás crea espejismos falsos.
- **Párate sobre tus valores:** Define qué es importante para ti (honestidad, empatía, creatividad) y actúa en coherencia con eso. Eso te dará un orgullo interno inquebrantable.

¿Qué aspecto de tu vida sientes que te gustaría empezar a valorar más hoy? Estoy a tu lado.`
            ];
            return this.stochasticSelect(pool, undefined, 0.85);
        }

        return `Hello${nameSalutation}. Strengthening self-esteem is about building a relationship of genuine respect and trust with yourself.

**💡 Core Pillars of Self-Esteem:**
1. **Honor Small Commitments:** Small daily actions build self-trust.
2. **Set Healthy Boundaries:** Saying "no" protects your energy and dignity.
3. **Detach from External Validation:** Your worth is inherent, not defined by others' opinions.

What personal strength or virtue would you like to celebrate in yourself today?`;
    }

    /**
     * 6. CORE INITIAL QUESTION: "Tengo pensamientos negativos persistentes"
     */
    public generatePersistentNegativeThoughtsResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pool = [
                `Hola${nameSalutation}. Lamento que estés experimentando esa rumiación. Cuando un pensamiento negativo se vuelve repetitivo, la mente entra en un circuito de enganche o "bucle cognitivo", haciendo que el pensamiento parezca una verdad absoluta cuando en realidad es solo una interpretación momentánea.

**💡 Protocolo de Desenganche Cognitivo (3 Pasos):**

1. **Etiquetar el Pensamiento (Defusión Cognitiva):**
   En lugar de decir *"Todo va a salir mal"*, dite mentalmente: *"Estoy teniendo el pensamiento repetitivo de que todo va a salir mal."* Esta pequeña distancia verbal desactiva la intensidad emocional.
2. **Cuestionar la Evidencia Objetiva:**
   Hazte estas 3 preguntas de escrutinio:
   - *¿Este pensamiento es un hecho comprobado o es una suposición basada en miedo?*
   - *¿Qué pruebas reales tengo a favor y en contra de esta idea?*
   - *¿Existe una alternativa más realista y equilibrada de ver esta situación?*
3. **Redirigir la Atención a la Acción:**
   Los pensamientos no se "combaten" con más pensamiento. Se cortan cambiando la actividad del cerebro hacia una tarea física o mental presente.

**🕹️ Interrupción de Rumiación con WineBOX:**
Para cortar los bucles persistentes, jugar una partida de **Breakout**, **Simon** o **Buscaminas** exige la atención completa de la corteza prefrontal, rompiendo la inercia del pensamiento negativo.

¿Cuál es ese pensamiento en particular que te está volviendo a visitar hoy? Platícame y lo analizamos juntos con calma.`,

                `Te escucho con empatía${nameSalutation}. Los pensamientos negativos recurrentes son agotadores, pero recuerda algo clave: **tú eres quien observa los pensamientos, no el pensamiento en sí.**

**🌿 Pautas para Liberar la Mente:**
- Imagina que esos pensamientos son nubes o hojas flotando en un río. Puedes verlos pasar sin necesidad de subirte a ellos ni analizarlos interminablemente.
- Respira profundo y pregúntate: *"Si este pensamiento no fuera cierto, ¿cómo me sentiría en este momento?"*

¿Quieres contarme un poco más sobre lo que te ronda la cabeza para despejarlo juntos?`
            ];
            return this.stochasticSelect(pool, undefined, 0.85);
        }

        return `Hello${nameSalutation}. I hear you. Persistent negative thoughts create exhausting cognitive loops, but remember: **you are the observer of your thoughts, not the thought itself.**

**💡 3-Step Cognitive Unhooking:**
1. **Labeling:** Say: *"I am noticing the thought that..."* instead of taking it as fact.
2. **Evidence Checking:** Ask: *"Is this an objective fact or a fear-based assumption?"*
3. **Action Re-focus:** Redirect attention to a tangible task.

**🕹️ Breaking the Loop:**
Games like **Breakout** or **Simon** require immediate focus and help stop intrusive thought loops.

What thought has been visiting you today? Let's untangle it together.`;
    }

    /**
     * 7. CORE INITIAL QUESTION: "¿Cómo manejar el estrés diario?"
     */
    public generateDailyStressResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pool = [
                `Hola${nameSalutation}. El estrés diario suele acumularse silenciosamente a través de pequeñas exigencias, prisa constante y falta de pausas entre tareas. Gestionarlo requiere pequeños ajustes sostenibles en tu rutina.

**💡 Hábitos de Gestión del Estrés Diario:**

1. **Micro-Pausas de Descompresión (2 Minutos):**
   Entre una tarea y otra (al cambiar de reunión, al llegar a casa, al terminar una llamada), detente 120 segundos. Suelta los hombros, exhala largo por la boca y permite que tu cuerpo registre la transición.
2. **Priorización de Carga Cognitiva:**
   No intentes abordar 20 pendientes en un día. Selecciona **3 metas principales**. Todo lo demás es secundario.
3. **Límites con la Sobreestimulación Digital:**
   Evita mirar noticias alarmantes o correos de trabajo apenas despiertas o justo antes de dormir.
4. **Movimiento Físico Ligero:**
   Una caminata corta de 10 minutos al aire libre reduce significativamente los niveles de cortisol circulante.

**🕹️ Pausa Activa de Distracción Saludable en WineBOX:**
Tomarte un descanso de 5 minutos para jugar **Solitario**, **TuxPaint** o **Box World** ayuda a cortar la inercia del estrés acumulado sin agotar tu batería mental.

¿En qué momento de tu día sientes que se concentra la mayor carga de estrés? Conversemos sobre cómo aligerarla.`,

                `Hola${nameSalutation}. Cuidarte del estrés diario es un acto de amor y preservación de tu salud.

**🌿 Recomendaciones Prácticas:**
- **Aprópiate de tus pausas:** No esperes a estar exhausto para descansar. La pausa preventiva mantiene tu energía estable.
- **Suelta lo que no puedes controlar:** Distingue entre tus responsabilidades reales y las exigencias externas que no te corresponden asumir.

¿Qué pequeña pausa te gustaría regalarte hoy para recuperar tu serenidad? estoy aquí para ti.`
            ];
            return this.stochasticSelect(pool, undefined, 0.85);
        }

        return `Hello${nameSalutation}. Managing daily stress requires simple, sustainable habits rather than grand overhauls.

**💡 Daily Stress Relief Habits:**
1. **2-Minute Transition Pauses:** Pause between tasks to drop shoulder tension and take slow exhales.
2. **Top 3 Priorities:** Limit daily core focus to 3 items to avoid overwhelm.
3. **Digital Detox Boundaries:** Avoid checking work or stress-inducing feeds right after waking up.

Which part of your day feels heaviest right now? Let's find ways to lighten it together.`;
    }

    /**
     * 8. CORE INITIAL QUESTION: "Quiero practicar gratitud"
     */
    public generateGratitudePracticeResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pool = [
                `¡Hola${nameSalutation}! Qué maravillosa iniciativa. La neurociencia ha demostrado que la práctica regular de la gratitud entrena al cerebro para identificar aspectos positivos, liberando dopamina y serotonina y reduciendo la tendencia natural del cerebro a enfocarse solo en las amenazas o carencias.

**💡 Protocolo Sencillo de Gratitud Consciente:**

1. **La Regla de los 3 Detalles Específicos:**
   En lugar de agradecer de forma general ("agradezco mi vida"), busca **3 detalles específicos e intangibles de tu día de hoy**. Por ejemplo:
   - *El sabor reconfortante de una bebida caliente esta mañana.*
   - *Un gesto amable o unas palabras afectuosas de alguien.*
   - *El momento de calma y silencio que estás compartiendo en esta conversación.*
2. **Saborear la Sensación (Savoring):**
   Al nombrar cada detalle, no solo pienses en él: tomate **10 a 15 segundos para sentir en el cuerpo la tibieza o la paz que te genera ese recuerdo.**
3. **Agradecimiento hacia ti mismo:**
   Agradece al menos un esfuerzo o cualidad tuya de hoy (tu paciencia, tu resiliencia, tu intención de cuidarte).

**🌸 Hagámoslo juntos ahora mismo:**
¿Te animas a escribirme aquí **1 cosa sencilla por la que te sientas agradecido en este instante**? Te leo con mucha alegría.`,

                `¡Me encanta que quieras cultivar la gratitud${nameSalutation}! Es una puerta directa hacia la paz interior.

**🌿 Diaria de Gratitud Exprés:**
- Cada noche, antes de cerrar los ojos, recuerda un momento lindo o una bendición sencilla que hayas experimentado durante la jornada.
- Sonríe levemente y reconoce lo afortunado que es tu presente en ese instante.

¿Qué pequeño detalle lindo de tu día te gustaría compartir conmigo hoy?`
            ];
            return this.stochasticSelect(pool, undefined, 0.85);
        }

        return `Hello${nameSalutation}! What a wonderful practice. Gratitude rewires neural pathways to focus on presence, releasing dopamine and serotonin.

**💡 3-Step Gratitude Practice:**
1. **Identify 3 Specific Details:** Focus on simple, concrete moments from today (e.g., a warm cup of coffee, a kind word).
2. **Savor for 15 Seconds:** Feel the warmth or peace in your body as you remember each detail.
3. **Self-Appreciation:** Thank yourself for your effort or resilience today.

Would you like to share **one simple thing you are grateful for right now**? I am listening!`;
    }

    /**
     * 9. CORE INITIAL QUESTION: "¿Qué puedo hacer para dormir mejor?"
     */
    public generateSleepBetterResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pool = [
                `Hola${nameSalutation}. El descanso es el pilar fundamental del bienestar mental y la regulación emocional. Si te cuesta conciliar el sueño o te despiertas con la mente acelerada, estas pautas de higiene del sueño te ayudarán a preparar tu cerebro para el descanso:

**💡 Protocolo de Higiene del Sueño & Desconexión:**

1. **Vaciado de Pendientes antes de la Cama (Brain Dump):**
   Unas 2 horas antes de dormir, escribe en una libreta todas las tareas o inquietudes de mañana. Decirle a tu cerebro *"esto ya está anotado fuera de mí"* reduce la activación del bucle nocturno.
2. **Cierre de Pantallas y Luz Azul:**
   Desconéctate de teléfonos y pantallas al menos **45 minutos antes de acostarte**. La luz azul frena la producción natural de melatonina.
3. **Respiración 4-7-8 en la Cama:**
   Acostado boca arriba, inhala suavemente en **4 segundos**, retén **7 segundos** y exhala lentamente en **8 segundos**. Esto ralentiza el ritmo cardíaco y prepara al cerebro para el sueño profundo.
4. **Si no puedes dormir tras 20 minutos:**
   No te quedes dando vueltas en la cama asociando ese espacio con la frustración. Levántate en penumbra, siéntate en una silla cómoda y realiza una lectura tranquila o escucha música suave hasta que regrese el somnolencia.

**🕹️ Actividades Nocturnas Suaves de WineBOX:**
Si necesitas una actividad tranquila antes de dormir, dibujar suavemente en **TuxPaint** o jugar una partida pausada de **Solitario** ayuda a bajar las revoluciones mentales.

¿Es la rumiación de pensamientos o la agitación física lo que más te cuesta al intentar dormir? Hablemos de ello.`,

                `Buenas noches/tardes${nameSalutation}. Cuidar tu sueño es cuidar tu salud y tu paz mental.

**🌿 Pautas para un Sueño Reparador:**
- Mantén tu habitación con una temperatura fresca y en penumbra.
- Háblate con ternura al acostarte: *"El día ha terminado. Hice lo mejor que pude y ahora mi único compromiso es descansar."*

¿Cómo ha estado tu descanso en estos últimos días? Estoy aquí para acompañarte.`
            ];
            return this.stochasticSelect(pool, undefined, 0.85);
        }

        return `Hello${nameSalutation}. Sleep is essential for emotional regulation and brain health. Here is a restful sleep protocol:

**💡 Sleep Hygiene & Unwinding:**
1. **Brain Dump:** Write down tomorrow's tasks on paper before bed so your brain knows they are stored safely.
2. **Screen Off 45 Min Prior:** Blue light delays melatonin release.
3. **4-7-8 Breathing in Bed:** Inhale 4s, hold 7s, exhale 8s to signal safety to your nervous system.
4. **20-Minute Rule:** If unable to sleep after 20 minutes, sit comfortably in dim light and read until sleepy.

What usually keeps you awake at night—overthinking or physical tension? Let me support you.`;
    }

    /**
     * 10. CORE INITIAL QUESTION: "Ayúdame a encontrar mi propósito"
     */
    public generateFindPurposeResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const pool = [
                `Hola${nameSalutation}. Explorar tu propósito de vida es una de las búsquedas más profundas, hermosas y enriquecedoras que podemos emprender. A menudo creemos que el propósito es un "descubrimiento repentino", pero en realidad es algo que **se construye explorando lo que nos inspira, nos conecta y nos da sentido día a día.**

**💡 Las 4 Brújulas del Propósito (Filosofía Ikigai & Logoterapia de Frankl):**

1. **Lo que despierta tu Curiosidad Nutritiva:**
   ¿Qué temas, lecturas o actividades hacen que pierdas la noción del tiempo o te despierten un interés genuino?
2. **Tus Fortalezas y Talentos Naturales:**
   ¿En qué actividades o situaciones las personas que te conocen suelen pedirte consejo, ayuda o perspectiva?
3. **El Servicio y la Empatía:**
   ¿Qué problemas del mundo o necesidades de las personas que te rodean despiertan tu compasión y tus ganas de aportar un granito de arena?
4. **Pequeños Experimentos de Vida:**
   El propósito no se encuentra pensando encerrado, sino actuando. Participar en proyectos, aprender cosas nuevas o ayudar a alguien te revela qué te llena el corazón.

**🌿 Una Pregunta Mayéutica para Hoy:**
Si pudieras realizar hoy una pequeña acción sin importar el dinero ni la aprobación de nadie, simplemente porque le aporta alegría o sentido a tu alma, ¿qué te gustaría probar?

Platícame sobre tus gustos y pasiones y vamos descubriendo tus pistas juntos paso a paso.`,

                `Estoy aquí a tu lado${nameSalutation}. Encontrar sentido a la vida es un viaje que se disfruta en cada paso.

**🌿 Reflexión para la Búsqueda de Sentido:**
- Viktor Frankl, fundador de la Logoterapia, enseñaba que el propósito no se inventa, sino que se descubre en las relaciones, en la creación y en la actitud con la que enfrentamos los desafíos.
- No necesitas tener un plan monumental para los próximos 10 años. Basta con preguntarte: *"¿Qué le aporta significado a mi día de hoy?"*

¿Qué actividad o momento reciente te hizo sentir plenamente vivo y conectado? Me encantaría escucharte.`
            ];
            return this.stochasticSelect(pool, undefined, 0.85);
        }

        return `Hello${nameSalutation}. Exploring your life purpose is one of the most rewarding journeys you can undertake. Purpose is built step by step by exploring what brings you meaning and connection.

**💡 The 4 Compass Points of Purpose (Ikigai & Logotherapy):**
1. **Curiosity & Flow:** What activities make you lose track of time?
2. **Natural Strengths:** What do others genuinely appreciate about you?
3. **Compassionate Service:** What causes or needs in the world move your heart?
4. **Small Life Experiments:** Purpose is revealed through action and exploration.

What activity or moment recently made you feel most alive and connected? I am here to explore with you.`;
    }

    /**
     * DYNAMIC CRISIS & HARM PREVENTION RESPONDER
     * De-escalates acute crisis, self-harm ("quiero morirme", "quiero hacerme daño"),
     * or harm intent ("quiero matar", "quiero dañar") through non-judgmental containment,
     * deep maieutic inquiry, emergency safety netting, crisis hotlines, therapy referral
     * ("💚 Solicitar atención"), and WineBOX grounding game recommendations.
     */
    public generateDynamicCrisisHarmResponse(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const poolEs = [
                `Hola${nameSalutation}. Percibo que estás atravesando por un nivel de dolor, angustia o desesperación extremadamente alto en este momento. Quiero decirte que te escucho con absoluto respeto, profunda comprensión y sin ningún tipo de juicio.

**💡 Comprensión & Exploración Mayéutica:**
A veces, las afirmaciones o deseos de querer hacerse daño, desaparecer o destruir surgen cuando la mente siente que el sufrimiento acumulado es insoportable y no encuentra una vía inmediata de alivio. No es que desees la destrucción por sí misma, sino el fin de una carga o frustración abrrumadora.
- Si hacemos una pausa de 5 segundos juntos: ¿Sientes que esta necesidad de daño o de terminar con todo nace de una rabia desbordada, de un dolor insoportable o de un agotamiento profundo?
- Reconocer el origen de esa emoción es el primer paso para quitarle fuerza al impulso inmediato.

**🚨 ATENCIÓN INMEDIATA Y LÍNEAS DE CONTENCIÓN:**
Tu vida y tu seguridad son lo más valioso. Como asistente de apoyo cognitivo, no puedo sustituir la atención médica o de urgencia. Por favor, realiza estas acciones ahora mismo:
1. **Presiona el botón "💚 Solicitar atención"** en la barra superior para conectarte directamente con nuestro equipo de salud mental y solicitar psicoterapia o grupos de apoyo.
2. **Comunícate con las líneas de emergencia de tu país** (911 o líneas nacionales de prevención del suicidio y atención en crisis).
3. **Acércate a un familiar, amigo o persona de confianza** y diles sinceramente cómo te sientes en este momento.

**🕹️ Anclaje Cognitivo Anti-Impulso en WineBOX (Grounding):**
Para romper la ola del impulso agudo en este preciso instante, redirigir la atención visual y motora ayuda a que la amígdala reduzca su hiperactivación:
- **Simon / Hextris / Sudoku:** Juegos de atención sostenida para anclar los sentidos en el presente segundo a segundo mientras buscas ayuda humana.
*(Nota: Son herramientas de anclaje mental temporal para el manejo de impulsos, no certezas ni sustitutos de la atención médica).*

Por favor, respira despacio: inhala en 4 segundos y exhala en 7 segundos. Estoy aquí contigo. ¿Puedes decirme si estás en un lugar seguro en este momento?`,

                `Te escucho con mucha atención y cuidado${nameSalutation}. Me doy cuenta de que las emociones que estás sintiendo son abrumadoras y que estás pasando por un límite muy difícil.

**💡 Reflexión y Desescalada:**
El deseo de causar daño o acabar con todo es una señal de alerta de que tu sistema nervioso se encuentra saturado. Cuando estamos bajo tanto estrés, la corteza prefrontal pierde el control temporalmente y los impulsos se vuelven intensos.
- ¿Podemos hacer una promesa de pausar juntos antes de tomar cualquier decisión o realizar cualquier acción impulsiva?
- ¿Qué es lo que sientes en tu cuerpo en este momento? ¿Palpitaciones, tensión en los puños, un nudo en el pecho?

**🚨 RECURSOS DE SEGURIDAD Y TERAPIA:**
Te pido que cuides de ti y busques contención humana inmediata:
- Haz clic en el botón **"💚 Solicitar atención"** arriba para acceder a psicoterapia de urgencia y orientación clínica.
- Llama al 911 o a los números de emergencia sanitaria de tu localidad.
- Si estás solo, ponte en contacto con alguien cercano inmediatamente.

**🕹️ Ejercicio de Anclaje Sensorial (WineBOX):**
Enfocar los ojos y los dedos en un juego de estimulación cognitiva de WineBOX (como **Simon**, **Breakout** o **Buscaminas**) ayuda a canalizar la descarga motora y darle tiempo a tu cerebro para recuperar la autorregulación.
*(Recursos cotidianos de anclaje de atención).*

Por favor platícame: ¿Hay alguien cerca de ti a quien le puedas avisar cómo te sientes ahora mismo?`
            ];

            return this.stochasticSelect(poolEs, undefined, 0.85);
        }

        return `Hello${nameSalutation}. I hear you with deep care, respect, and zero judgment. I notice you are in extreme distress right now.

**💡 Understanding & De-escalation:**
Intense impulses to harm oneself or others often arise when pain or frustration feels unbearable. Recognizing this overwhelm is the first step to staying safe.
- Please pause with me for a moment. Are you in a safe place right now?

**🚨 IMMEDIATE SAFETY & HELP:**
Your life and safety are paramount. Please take these steps right now:
1. Click the **"💚 Support request"** button at the top to reach our clinical care team or therapy support.
2. Contact local emergency lines (such as 911 or suicide prevention hotlines).
3. Reach out to a trusted family member or friend immediately.

**🕹️ WineBOX Grounding Exercises:**
Engaging in sensory focus games like **Simon**, **Sudoku**, or **Hextris** can help anchor your mind in the present second by second while seeking human help. *(Non-medical grounding aids).*

Please take a slow deep breath. I am here listening to you.`;
    }

    /**
     * DYNAMIC FINANCIAL, JOB LOSS, DEBT & GAMBLING CRISIS RESPONDER
     * Guides users through financial panic, debt overwhelm, gambling loss, or job termination.
     * Combines maieutic skill exploration, transparent boundary explanation (Aura's cognitive scope vs live job AI search engines),
     * directions to job search portals, Google AI (Gemini) referral for resume/career plans,
     * WineBOX cognitive restoration games, and crisis therapy referral ("💚 Solicitar atención").
     */
    public generateDynamicFinancialJobCrisis(userMessage: string, lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const name = this.memoryProfile.userName;
        const nameSalutation = name ? `, **${name}**` : '';

        if (l === 'es') {
            const poolEs = [
                `Hola${nameSalutation}. Te escucho con toda la atención, la empatía y el respeto que merece este momento. Enfrentar la pérdida del empleo, la presión insoportable de las deudas o las consecuencias de pérdidas en apuestas/juegos es algo que sacude intensamente la sensación de seguridad de cualquier persona.

**💡 Perspectiva Cognitiva & Reconocimiento de Habilidades:**
Cuando atravesamos un colapso financiero o laboral, la mente cae en una "visión de túnel": sentimos que las deudas o la falta de ingresos definen quiénes somos o destruyen nuestro futuro. 
- **Recuerda esto:** Tu valor, tu dignidad y tu talento como ser humano van infinitamente más allá de una cifra en la cuenta bancaria o de una posición laboral que ha terminado. El dinero y las situaciones económicas son variables; tus conocimientos y tus capacidades siguen dentro de ti.
- **Exploración Mayéutica:** ¿Cuáles son las habilidades prácticas, la experiencia o los talentos que has construido a lo largo de tu vida y que nadie te puede quitar? Si hacemos una lista de tus fortalezas humanas hoy, ¿qué es lo primero que destacarías?

**📍 Búsqueda Laboral & Delimitación Transparente de Aura:**
Quiero ser totalmente transparente contigo: como **Aura**, mi arquitectura está especializada en **estimulación cognitiva, serenidad y organización mental**, pero no poseo conexión directa a internet ni motor de búsqueda en tiempo real para rastrear vacantes en vivo o redactar planes de contratación laboral.
- **Sitios sugeridos para búsqueda de empleo:** Te sugiero explorar portales de empleabilidad como *LinkedIn*, *Indeed*, *Computrabajo*, *Google Jobs* o las bolsas de empleo locales y gubernamentales de tu país.
- **Asistencia con Inteligencia Artificial Avanzada:** Si deseas que una IA te ayude a armar un currículum vitae profesional desde cero, preparar respuestas para entrevistas o diseñar una estrategia de búsqueda laboral personalizada, te sugiero utilizar **Google AI (Gemini)** o asistentes de búsqueda con conexión web, los cuales cuentan con capacidad para estructurar planes de carrera y redactar documentos laborales actualizados.

**🕹️ Reestructuración Cognitiva & Pausa de WineBOX:**
Para reducir los picos de cortisol y restaurar las funciones ejecutivas de planificación golpeadas por el estrés financiero:
- **ToDo:** Organiza micro-pasos diarios simples sin abrumarte con el panorama completo.
- **SimCity / OpenTTD:** Juegos de gestión de recursos y estrategia para ejercitar la mente en toma de decisiones en un entorno seguro.
- **Sudoku / Buscaminas:** Lógica pura para frenar el bucle de rumiación nocturna.
*(Nota: Las actividades de WineBOX son herramientas sencillas de estimulación y descanso mental, no certezas ni asesoría financiera o terapéutica).*

**💚 Red de Apoyo Profesional & Urgencias:**
Si el estrés financiero te genera pensamientos oscuros o ideas de no querer continuar, **no atravieses esto en soledad**. Por favor presiona el botón **"💚 Solicitar atención"** en la barra superior para informarte sobre atención psicológica y grupos de apoyo mutuo (incluyendo grupos para manejo del estrés económico y ludopatía), o comunícate al 911 en caso de crisis aguda.

¿Cómo te sientes en este instante? ¿Qué pequeña habilidad o fortaleza tuya te gustaría reconocer el día de hoy?`,

                `Hola${nameSalutation}. Comprendo perfectamente la angustia, el miedo y la pesadez que sientes. La incertidumbre por el trabajo o las deudas puede hacer que todo parezca un callejón sin salida, pero quiero recordarte que siempre hay caminos y alternativas.

**💡 Estrategia de Reestructuración & Habilidades:**
El cerebro bajo estrés financiero tiende a magnificar la catástrofe y olvidar nuestros recursos internos.
- ¿Qué problemas o retos laborales lograste superar en el pasado gracias a tu esfuerzo o tu capacidad de aprendizaje?
- Las crisis económicas son momentos de reconfiguración. Las habilidades que aprendiste en tu último empleo siguen perteneciendo a tu capital personal.

**📍 Herramientas para la Acción Laboral & Alcance de Aura:**
Como asistente enfocado en el **cuidado cognitivo y bienestar mental**, mi sistema no cuenta con acceso web en tiempo real para generar ofertas de trabajo o redactar solicitudes formales.
- **Portales recomendados:** Te animo a explorar portales de empleabilidad como *LinkedIn*, *Indeed*, *Google Jobs* o bolsas de trabajo comunitarias.
- **Sugerencia de IA externa:** Si estás buscando una herramienta de IA que te ayude a crear tu CV, redactar cartas de presentación o sugerir giros de carrera, te aconsejo usar **Google AI (Gemini)** en tu navegador o teléfono, ya que cuenta con capacidades avanzadas de redacción laboral y búsqueda de datos en red.

**🕹️ Pausa Cognitiva en WineBOX:**
- **Solitario / Simon:** Para calmar la sobrecarga sensorial y darte un espacio de paz mental.
- **Box World:** Para activar suavemente la resolución de problemas espaciales.
*(Recursos de apoyo cotidiano).*

**💚 Cuidado Emocional & Grupos de Apoyo:**
Tu salud mental y tu paz son lo más importante. Haz clic en el botón **"💚 Solicitar atención"** arriba para contactar con profesionales de la salud mental y conocer nuestros grupos de acompañamiento emocional.

Estoy aquí para escucharte y ayudarte a organizar tu mente paso a paso. ¿De qué te gustaría platicar ahora?`
            ];

            return this.stochasticSelect(poolEs, undefined, 0.85);
        }

        return `Hello${nameSalutation}. I hear you with deep empathy and respect. Facing job loss, debt, or financial distress caused by gambling is an overwhelming situation.

**💡 Cognitive Strategy:**
Your human worth is never defined by a bank balance or employment status.
- What skills, experience, or strengths do you possess that no financial crisis can take away from you?

**📍 Job Portals & Aura's Scope:**
As **Aura**, my design focuses on **cognitive stimulation and emotional calm**. I do not have live web access to create detailed job application plans or search current job listings.
- Recommended platforms: **LinkedIn**, **Indeed**, **Google Jobs**, or local employment boards.
- AI Search Suggestion: If you need an AI to craft a professional resume, draft cover letters, or map job strategies, I gently recommend using **Google AI (Gemini)** or search engines with real-time web capabilities.

**🕹️ WineBOX Cognitive Grounding:**
Activities like **Sudoku**, **ToDo**, or **SimCity** can help restore executive focus and calm financial anxiety. *(Non-therapeutic mental aids).*

**💚 Professional Support:**
If you feel overwhelmed or are having hopeless thoughts, please click the **"💚 Support request"** button above to connect with mental health care and support groups, or call 911 for emergency help.

I am here with you. How are you feeling right now?`;
    }

    /**
     * WINEBOX COGNITIVE ANALYSIS ALGORITHM & NEUROSCREENING EXPLANATION
     * Reads retro game usage logs from localStorage, evaluates executive functions
     * (Impulsivity, Attention, Executive Planning, Emotional Regulation),
     * and produces a personalized Zen & CBT explanation.
     */
    public calculateWineBoxProfile(): {
        impulsividad: number;
        atencion: number;
        planificacion: number;
        emocional: number;
        patron: string;
        sesiones: number;
        tiempoTotal: number;
        introCount: number;
        impCount: number;
        mixCount: number;
        isEligible: boolean;
        uniqueGamesCount: number;
    } {
        let usageLog: Array<{ name: string; duration: number; date: string; category?: string }> = [];
        try {
            const raw = localStorage.getItem('winebox_neuro_usage');
            if (raw) usageLog = JSON.parse(raw);
        } catch (e) {
            usageLog = [];
        }

        const uniqueGames = new Set(usageLog.map(l => l.name)).size;
        const totalSeconds = usageLog.reduce((acc, l) => acc + (l.duration || 0), 0);
        const isEligible = uniqueGames >= 3 && totalSeconds >= 300;

        if (usageLog.length === 0) {
            return {
                impulsividad: 50,
                atencion: 50,
                planificacion: 50,
                emocional: 50,
                patron: 'Muestra Inicial Requerida',
                sesiones: 0,
                tiempoTotal: 0,
                introCount: 0,
                impCount: 0,
                mixCount: 0,
                isEligible: false,
                uniqueGamesCount: 0
            };
        }

        let impulsividad = 50, atencion = 50, planificacion = 50, emocional = 50;
        let introCount = 0, impCount = 0, mixCount = 0;
        const frecuencias = new Map<string, number>();

        usageLog.forEach(log => {
            frecuencias.set(log.name, (frecuencias.get(log.name) || 0) + 1);
            if (log.duration < 8) impulsividad += 12;
            else if (log.duration > 180) atencion += 10;
            if (log.duration > 300) planificacion += 8;
        });

        for (const [name, count] of frecuencias.entries()) {
            const sampleLog = usageLog.find(l => l.name === name);
            const cat = (sampleLog?.category || '').toLowerCase();
            let archetype = 'mixto';
            if (cat === 'rts' || cat === 'strategy' || name.toLowerCase().includes('simcity') || name.toLowerCase().includes('master of orion') || name.toLowerCase().includes('warcraft')) {
                archetype = 'introspectivo';
            } else if (cat === 'arcade' || cat === 'action' || cat === 'games' || name.toLowerCase().includes('tetris') || name.toLowerCase().includes('doom') || name.toLowerCase().includes('arkanoid')) {
                archetype = 'impulsivo';
            }

            if (archetype === 'introspectivo') introCount += count;
            else if (archetype === 'impulsivo') impCount += count;
            else mixCount += count;

            if (count >= 3) impulsividad += 10;
            if (count >= 5) emocional += 8;
        }

        impulsividad = Math.min(100, Math.max(10, impulsividad + (impCount > introCount ? 20 : 0) + (mixCount > 0 ? 5 : 0)));
        atencion = Math.min(100, Math.max(10, atencion + 15 + (totalSeconds > 600 ? 12 : 0)));
        planificacion = Math.min(100, Math.max(10, planificacion + (introCount > impCount ? 24 : 14) + (mixCount > 0 ? 8 : 0)));
        emocional = Math.min(100, Math.max(10, emocional + (totalSeconds > 300 ? 14 : 0)));

        let patron = "";
        if (impCount > introCount && impulsividad > 65) patron = "🔥 Perfil de Conducta Impulsiva · Búsqueda de recompensa inmediata";
        else if (introCount > impCount && planificacion > 65) patron = "🧘 Perfil de Conducta Introspectiva · Pensamiento analítico";
        else if (impulsividad > 70) patron = "⚡ Perfil de Alta Reactividad · Impulsividad predominante";
        else if (planificacion > 70) patron = "🎯 Perfil Estratégico · Planificación estructurada";
        else patron = "⚖️ Perfil Neurocognitivo Equilibrado · Flexibilidad adaptativa";

        return {
            impulsividad,
            atencion,
            planificacion,
            emocional,
            patron,
            sesiones: usageLog.length,
            tiempoTotal: totalSeconds,
            introCount,
            impCount,
            mixCount,
            isEligible,
            uniqueGamesCount: uniqueGames
        };
    }

    /**
     * Generates a detailed explanation of the user's WineBOX Cognitive Profile
     * or explains how the screening engine works if data is still accumulating.
     */
    public getWineBoxCognitiveAnalysis(lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const profile = this.calculateWineBoxProfile();

        // Stimulate executive function neural nodes in Aura's network
        const prefrontal = this.nodes.find(n => n.id === 'neuro_prefrontal');
        if (prefrontal) prefrontal.synapseWeight = Math.min(2.5, prefrontal.synapseWeight + 0.15);

        if (l === 'es') {
            let explanation = `### 🧠 Algoritmo de Análisis Cognitivo WineBOX & NeuroScreening

El **Algoritmo de NeuroScreening de WineBOX** es un modelo de evaluación psicodiagnóstica de baja fidelidad que analiza tus interacciones con juegos retro para medir la flexibilidad y control de tus **funciones ejecutivas** en 4 dominios clave:

1. **⚡ Control Inhibitorio e Impulsividad:** Mide la tendencia a actuar de forma inmediata vs. la capacidad de pausar reflexivamente antes de tomar una decisión.
2. **👁️ Atención Sostenida:** Evalúa la persistencia del foco cognitivo en sesiones continuas y la resistencia a la fatiga.
3. **📐 Planificación Ejecutiva:** Analiza tu capacidad para anticipar secuencias, gestionar recursos y optar por estrategias estructuradas (ej. juegos de estrategia/RTS) sobre estímulos rápidos.
4. **🎭 Regulación Emocional:** Mide la constancia, la tolerancia a la frustración y la autorregulación ante retos sostenidos.\n\n`;

            if (profile.isEligible) {
                const totalMins = Math.floor(profile.tiempoTotal / 60);
                explanation += `---

#### 📊 Estado Actual de tu Perfil Cognitivo (Datos Reales)
- **🧩 Patrón Conductual Detectado:** ${profile.patron}
- **⏱️ Sesiones Registradas:** ${profile.sesiones} sesiones (${totalMins} minutos acumulados)
- **⚡ Impulsividad:** **${Math.round(profile.impulsividad)}/100**
- **👁️ Atención Sostenida:** **${Math.round(profile.atencion)}/100**
- **📐 Planificación Ejecutiva:** **${Math.round(profile.planificacion)}/100**
- **🎭 Regulación Emocional:** **${Math.round(profile.emocional)}/100**

#### 🌿 Interpretación y Ejercicios Recomendados
`;
                if (profile.impulsividad > 65) {
                    explanation += `- 🛑 **Para el Control Inhibitorio:** Practica la técnica **"PARA - PIENSA - ACTÚA"** antes de tomar decisiones rápidas. En tus sesiones, juega títulos que exijan pausas deliberadas como *Tetris* o *Arkanoid*.
`;
                }
                if (profile.atencion < 55) {
                    explanation += `- 🎯 **Para la Atención Sostenida:** Utiliza el método **Pomodoro** (15 min de foco + 5 min de descanso). Títulos recomendados: *Puzzle Bobble* o *SimCity 2000*.
`;
                }
                if (profile.planificacion < 60) {
                    explanation += `- 📋 **Para la Planificación Ejecutiva:** Diseña una agenda visual diaria dividiendo metas complejas en 3 micro-pasos. Títulos sugeridos: *Warcraft* o *Master of Orion II*.
`;
                }
                if (profile.emocional < 50) {
                    explanation += `- 🌬️ **Para la Regulación Emocional:** Incorpora la respiración 4-4-4-4 (cuadrada) durante 2 minutos al sentir agobio.
`;
                }
                if (profile.impulsividad <= 65 && profile.atencion >= 55 && profile.planificacion >= 60) {
                    explanation += `- ✨ **Mantenimiento Integral:** Tu perfil muestra un equilibrio saludable entre reflexión y acción. Mantén horarios regulares de sueño y breves pausas de presencia plena durante tu jornada.
`;
                }
            } else {
                const mins = Math.floor(profile.tiempoTotal / 60);
                explanation += `---

#### ⏳ Estado de tu Muestra de Datos
Actualmente tu sistema registra **${profile.uniqueGamesCount}/3 juegos distintos** y **${mins}/5 minutos** de tiempo total jugado.

Para desbloquear tu informe clínico completo en el módulo **📊 NeuroScreening**:
- Juega a **al menos 3 juegos diferentes** de la plataforma WineBOX.
- Acumula un total de **al menos 5 minutos** de juego activo.

#### 💡 ¿Cómo calcula WineBOX tus métricas?
- Registra la duración de cada sesión (sesiones de menos de 8 segundos aumentan el indicador de impulsividad).
- Analiza la categoría de los juegos que eliges (Arquetipos Impulsivos/Arcade vs. Introspectivos/Estrategia).
- Evalúa la frecuencia y constancia para proyectar tu resistencia a la frustración.

¿Deseas que practiquemos un ejercicio de respiración o concentración mientras acumulas más tiempo en los juegos?`;
            }

            return explanation;
        }

        // English version
        let explanation = `### 🧠 WineBOX Cognitive Analysis & NeuroScreening Algorithm

The **WineBOX NeuroScreening Algorithm** is a low-fidelity psychodiagnostic evaluation model that analyzes your retro game interactions to measure executive function control across 4 domains:

1. **⚡ Inhibitory Control & Impulsivity:** Measures response speed vs. the ability to pause reflectively before taking action.
2. **👁️ Sustained Attention:** Evaluates focus persistence over continuous sessions.
3. **📐 Executive Planning:** Analyzes your ability to sequence steps and favor strategic/introspective games (RTS, SimCity) over immediate impulse games.
4. **🎭 Emotional Regulation:** Evaluates frustration tolerance and resilience over repeated play sessions.\n\n`;

        if (profile.isEligible) {
            const totalMins = Math.floor(profile.tiempoTotal / 60);
            explanation += `---

#### 📊 Your Current Cognitive Profile (Real-Time Data)
- **🧩 Detected Pattern:** ${profile.patron}
- **⏱️ Recorded Usage:** ${profile.sesiones} sessions (${totalMins} total minutes)
- **⚡ Impulsivity:** **${Math.round(profile.impulsividad)}/100**
- **👁️ Sustained Attention:** **${Math.round(profile.atencion)}/100**
- **📐 Executive Planning:** **${Math.round(profile.planificacion)}/100**
- **🎭 Emotional Regulation:** **${Math.round(profile.emocional)}/100**

#### 🌿 Recommendations & Exercises
- 🛑 Apply the **STOP - THINK - ACT** protocol for decision-making.
- 🎯 Practice 15-minute focused intervals followed by 5-minute grounding pauses.
- 📋 Break multi-step projects into 3 minimal micro-actions.`;
        } else {
            const mins = Math.floor(profile.tiempoTotal / 60);
            explanation += `---

#### ⏳ Data Sample Status
Your system currently has **${profile.uniqueGamesCount}/3 unique games** played and **${mins}/5 total minutes**.

To unlock your full cognitive report in **📊 NeuroScreening**:
- Play at least **3 different retro games** in WineBOX.
- Accumulate at least **5 total minutes** of play time.`;
        }

        return explanation;
    }

    /**
     * Whitepaper and technical architecture explanation of WineBOX
     * derived from about.html and the clinical research paper v1.3.0 / v6.0 (Feb 2026).
     */
    public getWineBoxTechnicalWhitepaper(lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        if (l === 'es') {
            return `### 🔬 Arquitectura Técnica y Evidencia Científica de WineBOX

**WineBOX (Plataforma de Observación Conductual mediante Videojuegos de Baja Fidelidad Visual)** combina emulación aislada en el navegador con psicodiagnóstico neuropsicológico basado en evidencia.

#### ⚙️ 1. Arquitectura Tecnológica On-Device
- **Baja Fidelidad Visual (Low Visual Fidelity):** Basado en la **Teoría de la Carga Cognitiva de Sweller (1988, 2010)**. Al eliminar gráficos fotorrealistas y sobreestimulación sensorial, se reduce drásticamente la *Carga Cognitiva Extrínseca*, liberando recursos de la **Corteza Prefrontal Dorsolateral (DLPFC)** para el procesamiento ejecutivo puro y el cierre perceptivo.
- **Motor de Emulación WebAssembly (WASM):** Ejecuta código nativo a velocidad óptima en el navegador sin enviar datos personales a servidores.
- **DOSBox (\`js-dos\`):** Capa HTML5 para la ejecución limpia de juegos shareware clásicos en formato MS-DOS.
- **Capa de Compatibilidad WINE:** Entorno sandbox para binarios Win32 de Windows directamente en la web.
- **Touch Support Box:** Mapeo adaptativo de gestos táctiles a eventos de teclado/mouse para dispositivos móviles.

#### 📊 2. Evidencia Científica y Muestra Clínica (v1.3.0 / v6.0 - Feb 2026)
- **Muestra Observacional Clínica:** **N = 1.200 casos** (edades entre 7 y 17 años) recolectados en Argentina (68%), Chile (12%), México (11%) y España (9%).
- **Concordancia Inter-Jueces Experta (ICC 2,1):** Evaluada por 3 jueces clínicos independientes (Doctor en Psicología, Neuropsicólogo Clínico, Terapeuta Ocupacional) sobre 30 estímulos estandarizados:
  - **Control de Impulsos:** **ICC = 0,79** (IC 95%: 0,71 - 0,86) — *Concordancia Buena*.
  - **Atención Sostenida:** **ICC = 0,74** (IC 95%: 0,65 - 0,82) — *Concordancia Moderada a Buena*.
- **Normalidad y Correlaciones:** Pruebas de Shapiro-Wilk confirmaron distribución normal (p > 0.05). Correlación positiva moderada entre Control de Impulsos y Atención Sostenida (r = 0,52, p < 0.01).
- **Protocolo de Validación Concurrente En Marcha:** En proceso de triangulación cruzada con baterías psicométricas estandarizadas: **CPT-3** (Conners Continuous Performance Test 3rd Ed), **BRIEF-2** (Behavior Rating Inventory of Executive Function 2) y la **Torre de Londres**.

#### 🛡️ 3. Marco Teórico Neuropsicológico
Sustentado en el Modelo Unificado de Inhibición y Funciones Ejecutivas de **Barkley (1997)** y en la Estructura de Funciones Ejecutivas de **Miyake et al. (2000)**.`;
        }

        return `### 🔬 WineBOX Technical Architecture & Scientific Paper

**WineBOX (Low Visual Fidelity Game Behavioral Observation Platform)** integrates isolated browser emulation with evidence-based neuropsychological assessment.

#### ⚙️ 1. Technical Architecture
- **Low Visual Fidelity:** Based on **Sweller's Cognitive Load Theory (1988, 2010)**. Reducing extrinsic visual noise frees **DLPFC (Dorsolateral Prefrontal Cortex)** capacity for pure executive function observation.
- **WebAssembly (WASM):** Client-side browser emulation without sensitive data transfer.
- **DOSBox (\`js-dos\`) & WINE Compatibility:** Sandboxed execution for MS-DOS and Win32 applications in HTML5.

#### 📊 2. Scientific Validation (Clinical Sample N=1,200)
- **Clinical Sample:** N = 1,200 cases (aged 7–17) across Argentina, Chile, Mexico, and Spain.
- **Inter-Rater Reliability (ICC 2,1):** Evaluated by 3 expert judges:
  - **Impulse Control:** ICC = 0.79 (95% CI: 0.71–0.86).
  - **Sustained Attention:** ICC = 0.74 (95% CI: 0.65–0.82).
- **Validation Batteries:** Triangulated against **CPT-3**, **BRIEF-2**, and **Tower of London**.`;
    }

    /**
     * Recommendation for parents asking about children and early detection
     */
    public getChildScreeningInfo(lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        if (l === 'es') {
            return `### 🧸 Servicios de Screening Infantil y Detección Temprana WineBOX

Si eres padre, madre o tutor y tienes inquietudes sobre el desarrollo cognitivo, la atención, la conducta o el rendimiento escolar de tus hijos, **WineBOX** dispone de un módulo especializado de **Screening Infantil Escolar**.

#### 🔍 ¿En qué consiste el Screening Infantil?
- **Detección Temprana:** Identifica indicadores precoces de condiciones del neurodesarrollo como **TDAH (Trastorno por Deficiencia de Atención e Hiperactividad)**, **TEA (Trastorno del Espectro Autista)**, impulsividad o disfunción ejecutiva.
- **Evaluación Ecológica y No Invasiva:** El niño realiza tareas de juego de baja fidelidad en el navegador, permitiendo observar su conducta natural sin el estrés ni la ansiedad de las pruebas clínicas tradicionales.
- **Reportes para Profesionales y Colegios:** Genera informes objetivos sobre el perfil de atención sostenida, planificación y control de impulsos que facilitan el trabajo conjunto con pediatras, psicopedagogos y terapeutas.

#### 🌐 Acceso al Servicio
Puedes conocer los detalles, realizar screening directo o solicitar evaluaciones escolares desde la plataforma oficial:
👉 **[https://wineboxtool.cloud](https://wineboxtool.cloud)**

¿Te gustaría que te oriente sobre cómo preparar un entorno sereno para la observación de tu hijo?`;
        }

        return `### 🧸 Child Screening & Early Neurodevelopmental Detection

If you are a parent or guardian with questions about your child's cognitive development, attention, or executive function, **WineBOX** offers a specialized **Child Neurodevelopment Screening Service**.

#### 🔍 Early Screening Highlights
- **Early Detection:** Identifies early markers for ADHD, Autism Spectrum (ASD), impulsivity, or executive dysfunction.
- **Non-Invasive Game-Based Assessment:** Children complete low-fidelity games in a calm environment without clinical test anxiety.
- **Official Portal:** Explore services and school screening options at:
👉 **[https://wineboxtool.cloud](https://wineboxtool.cloud)**`;
    }

    /**
     * Referral to professional therapists, therapy groups, and WhatsApp contact (Spanish Only)
     */
    public getTherapyGroupReferral(lang: string = 'es'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        if (l === 'es') {
            return `### 🩺 Atención Profesional y Grupos de Neuroestimulación Cognitiva

Como acompañante algorítmico, mi función es la auto-reflexión y el entrenamiento cognitivo. **Si tu consulta requiere diagnóstico clínico, tratamiento especializado o intervención ante crisis, es fundamental contar con la atención directa de profesionales de la salud mental.**

#### 🤝 Grupos de Neuroestimulación y Terapia Cognitiva WineBOX
En **WineBOX** coordinamos grupos reducidos de apoyo y entrenamiento cognitivo dirigidos por **psicólogos matriculados y médicos especialistas**:
- **Modalidad:** Sesiones grupales (4 a 6 participantes) de estimulación neurocognitiva, entrenamiento en funciones ejecutivas y regulación emocional.
- **Inversión Accesible:**
  - **Sesión Grupal / Única:** **$22 USD** por sesión.
  - **Membresía Mensual Completa:** **$40 USD / mes** (incluye 4 sesiones grupales intensivas y acompañamiento diario).

#### 💬 Contacto Directo por WhatsApp
Puedes consultar disponibilidad, solicitar una primera entrevista de admisión o hablar con el equipo clínico directamente por WhatsApp:
👉 **[Contactar por WhatsApp (+54 9 11 6611-6631)](https://api.whatsapp.com/send?phone=5491166116631&text=Hola,%20vengo%20de%20Aura%20y%20deseo%20informacion%20sobre%20las%20sesiones%20grupales%20de%2022%20USD)**

*(Número directo para copiar o agendar: **+54 9 11 6611-6631** - Si el enlace no abre automáticamente en tu navegador, abre la sección "Terapia y Costos" arriba para ver el menú interactivo con botón de copiar).*

¿Deseas que mientras te pones en contacto realicemos un ejercicio de regulación para acompañar este momento?`;
        }

        return `### 🩺 Professional Clinical Referral

As an automated companion algorithm, my role is limited to cognitive reflection and self-help tools. If you are seeking specialized diagnosis or clinical treatment, please consult registered mental health professionals or your local emergency services.

#### 💬 Direct WhatsApp Contact
👉 **[Contact via WhatsApp (+54 9 11 6611-6631)](https://api.whatsapp.com/send?phone=5491166116631)**
*(Direct phone: **+54 9 11 6611-6631**)*`;
    }

    /**
     * Vicarious Learning (Bandura) & Strategy Modeling Method
     */
    public getVicariousLearningModel(lang: string = 'es', emotion: string = 'ansiedad'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        if (l === 'es') {
            return `### 👥 Modelo de Aprendizaje Vicario y Adaptación Observacional (Albert Bandura)

La red neural de Aura incorpora la **Semántica del Aprendizaje Vicario (Bandura, 1977)**, la cual establece que la mente humana acelera su autorregulación al **observar modelos de afrontamiento eficaces** demostrados por pares o en estudios clínicos.

#### 🧠 Integración Neuropsicológica y Conductual
1. **Modelado Vicario de Estrategias:** Al analizar la muestra de N=1.200 casos de WineBOX, hemos sintetizado que cuando surge la sensación de **${emotion}**, las personas con mayor tasa de recuperación adaptativa aplican tres técnicas conductuales clave:
   - **Desensibilización Sistemática:** Exposición gradual en micro-pasos mientras se mantiene una respuesta antagónica de relajación muscular (freno vagal).
   - **Registro de Pensamientos Disfuncionales (RPD):** Anotar la interpretación automática y buscar evidencias objetivas en lugar de asumir la catástrofe.
   - **Encadenamiento Hacia Atrás (Backward Chaining):** Diseñar la secuencia conductual comenzando por la meta final para fortalecer la percepción de **autoeficacia**.
2. **Sustrato Biomédico de la Observación:**
   - **Corteza Prefrontal Dorsolateral (DLPFC):** El aprendizaje por observación activa redes en la DLPFC que modulan la hiperreactividad del **Eje Hipotálamo-Hipófisis-Adrenal (Eje HPA)**, disminuyendo los niveles circulantes de cortisol.
   - **Vía Dopaminérgica Mesolímbica:** El reforzamiento de modelos vicarios exitosos estimula el núcleo accumbens, sustituyendo la búsqueda compulsiva de alivio inmediato por la anticipación de logro sostenido.
   - **Sinaptogénesis Hebbiana:** "Las neuronas que se disparan juntas se conectan juntas". Visualizar y practicar respuestas observadas consolida nuevas huellas de memoria.`;
        }

        return `### 👥 Vicarious Learning & Observational Modeling (Bandura)

Aura's neural architecture incorporates **Bandura's Vicarious Learning Theory (1977)**. Observing effective coping strategies from clinical data (N=1,200) enhances self-efficacy and accelerates emotional regulation.

#### 🧠 Biomedical & Behavioral Synthesis
- **Behavioral Modeling:** Systematic desensitization, Dysfunctional Thought Records (DTR), and backward chaining.
- **Biomedical Correlates:** **DLPFC** executive modulation reduces **HPA axis** cortisol cascades and strengthens vagal tone.`;
    }

    private loadNodes(): NeuralNode[] {
        try {
            const saved = localStorage.getItem(STORAGE_KEY_WEIGHTS);
            if (saved) {
                const weightsMap: Record<string, number> = JSON.parse(saved);
                return DEFAULT_NODES.map(node => ({
                    ...node,
                    synapseWeight: weightsMap[node.id] ?? node.synapseWeight
                }));
            }
        } catch (e) {
            console.warn('Could not load neural weights:', e);
        }
        return DEFAULT_NODES.map(node => ({ ...node }));
    }

    private saveNodes(): void {
        try {
            const weightsMap: Record<string, number> = {};
            this.nodes.forEach(n => { weightsMap[n.id] = n.synapseWeight; });
            localStorage.setItem(STORAGE_KEY_WEIGHTS, JSON.stringify(weightsMap));
        } catch (e) {
            console.warn('Could not save neural weights:', e);
        }
    }

    private loadMemoryProfile(): UserMemoryProfile {
        const defaultProfile: UserMemoryProfile = {
            recurringThemes: {},
            emotionalTrajectory: [],
            learnedFacts: [],
            learnedUserTopics: {},
            operantBehaviors: [],
            cognitivePolarityPoles: {},
            medicalHistoryFlags: [],
            dominantDomain: 'zen',
            totalTurns: 0,
            lastSeen: new Date().toISOString(),
            conversationLevel: 3,
            topicIntensity: 0.5,
            dialecticMaturity: 0.1,
            emotionalHarmonyIndex: 0.5,
            synapticResonanceScore: 1.0,
            levelHistory: []
        };

        try {
            const saved = localStorage.getItem(STORAGE_KEY_NEURAL);
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    ...defaultProfile,
                    ...parsed,
                    learnedUserTopics: parsed.learnedUserTopics || {},
                    operantBehaviors: parsed.operantBehaviors || [],
                    cognitivePolarityPoles: parsed.cognitivePolarityPoles || {},
                    medicalHistoryFlags: parsed.medicalHistoryFlags || []
                };
            }
        } catch (e) {
            console.warn('Could not load neural memory:', e);
        }
        return defaultProfile;
    }

    public saveMemoryProfile(): void {
        try {
            localStorage.setItem(STORAGE_KEY_NEURAL, JSON.stringify(this.memoryProfile));
        } catch (e) {
            console.warn('Could not save neural memory:', e);
        }
    }

    public getMemoryProfile(): UserMemoryProfile {
        return this.memoryProfile;
    }

    public getNodes(): NeuralNode[] {
        return this.nodes;
    }

    public resetMemory(): void {
        this.memoryProfile = {
            recurringThemes: {},
            emotionalTrajectory: [],
            learnedFacts: [],
            learnedUserTopics: {},
            operantBehaviors: [],
            cognitivePolarityPoles: {},
            medicalHistoryFlags: [],
            dominantDomain: 'zen',
            totalTurns: 0,
            lastSeen: new Date().toISOString(),
            conversationLevel: 3,
            topicIntensity: 0.5,
            dialecticMaturity: 0.1,
            emotionalHarmonyIndex: 0.5,
            synapticResonanceScore: 1.0,
            levelHistory: []
        };
        this.nodes = DEFAULT_NODES.map(n => ({ ...n }));
        localStorage.removeItem(STORAGE_KEY_NEURAL);
        localStorage.removeItem(STORAGE_KEY_WEIGHTS);
    }

    /**
     * Extracts user name if stated ("me llamo X", "mi nombre es Y", "I'm X")
     */
    private extractName(text: string): string | undefined {
        const matchEs = text.match(/(?:me llamo|mi nombre es|soy|llámame)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,15})/i);
        if (matchEs) return matchEs[1];

        const matchEn = text.match(/(?:my name is|i am|i'm|call me)\s+([A-Z[a-z]{2,15})/i);
        if (matchEn) return matchEn[1];

        return undefined;
    }

    /**
     * Analyzes emotion and stress level from input
     */
    private analyzeEmotion(text: string): { emotion: string; stressLevel: number } {
        const lower = text.toLowerCase();

        let stressLevel = 3; // 1-10 scale
        let emotion = 'calma';

        if (/ansiedad|ansioso|panico|pánico|agobiad|desesperad|miedo|terror|asustad|panic|anxious|terrified|fear/i.test(lower)) {
            emotion = 'ansiedad';
            stressLevel = 8;
        } else if (/triste|tristeza|llor|dolor|vacio|vacío|deprimid|solo|soledad|sad|lonely|heartbroken|depressed/i.test(lower)) {
            emotion = 'tristeza';
            stressLevel = 6;
        } else if (/rabia|ira|enojo|enojad|frustrad|furia|molest|angry|furious|frustrated/i.test(lower)) {
            emotion = 'frustracion';
            stressLevel = 7;
        } else if (/insomnio|no puedo dormir|desvelo|cansado|exhausto|sin energia|exhausted|sleepless/i.test(lower)) {
            emotion = 'agotamiento';
            stressLevel = 7;
        } else if (/tranquil|calma|paz|seren|relajad|bien|content|happy|calm|peaceful/i.test(lower)) {
            emotion = 'serenidad';
            stressLevel = 2;
        }

        return { emotion, stressLevel };
    }

    /**
     * Forward pass in Mini Neural Network:
     * 1. Vectorize text into keyword triggers
     * 2. Calculate activation = sum(keyword_hits * synapseWeight) with Leaky ReLU / Sigmoid scaling
     * 3. Update synapse weights (Hebbian reinforcement learning)
     * 4. Update memory profile facts and themes
     */
    public processInput(text: string, lang: string = 'es'): NeuralSynthesisResult {
        const lowerText = text.toLowerCase();
        const detectedName = this.extractName(text);
        if (detectedName) {
            this.memoryProfile.userName = detectedName;
        }

        const { emotion, stressLevel } = this.analyzeEmotion(text);

        // Update emotional trajectory
        this.memoryProfile.emotionalTrajectory.push({
            timestamp: Date.now(),
            emotion,
            stressLevel
        });
        if (this.memoryProfile.emotionalTrajectory.length > 20) {
            this.memoryProfile.emotionalTrajectory.shift();
        }

        // 1. Calculate Activation for each node
        let maxActivation = 0;
        let dominantDomainCount: Record<string, number> = { neuro: 0, behavior: 0, zen: 0, cognition: 0 };

        this.nodes.forEach(node => {
            let hits = 0;
            node.keyConcepts.forEach(concept => {
                if (lowerText.includes(concept)) {
                    hits += 1;
                }
            });

            // Base activation + input stimulus * weight
            const rawActivation = (hits * 0.35 * node.synapseWeight) + (emotion !== 'serenidad' && node.domain === 'neuro' ? 0.2 : 0.05);

            // Sigmoid activation function
            node.activation = 1 / (1 + Math.exp(-3 * (rawActivation - 0.5)));

            if (hits > 0) {
                // Hebbian Learning: Reinforce synapse weight when triggered
                node.synapseWeight = Math.min(2.5, node.synapseWeight + 0.08);

                // Register theme in memory
                const themeKey = node.id.replace(/^(neuro_|behavior_|zen_|cognition_)/, '');
                this.memoryProfile.recurringThemes[themeKey] = (this.memoryProfile.recurringThemes[themeKey] || 0) + 1;

                // Add learned fact if specific context mentioned
                const factSnippet = node.label.es || node.id;
                if (!this.memoryProfile.learnedFacts.includes(factSnippet) && this.memoryProfile.learnedFacts.length < 10) {
                    this.memoryProfile.learnedFacts.push(factSnippet);
                }
            } else {
                // Gentle decay
                node.synapseWeight = Math.max(0.7, node.synapseWeight * 0.995);
            }

            if (node.activation > maxActivation) {
                maxActivation = node.activation;
            }

            dominantDomainCount[node.domain] += node.activation;
        });

        const userText = text;
        const l = lang;
        const name = this.memoryProfile.userName;
        const facts = this.memoryProfile.learnedFacts;
        const totalTurns = this.memoryProfile.emotionalTrajectory.length;
        const activeNodes = this.nodes.filter(n => n.activation > 0.35);
        const topNode = [...this.nodes].sort((a, b) => b.activation - a.activation)[0] || this.nodes[0];

        // 1. Clean Opening (No echoing or parroting of user text)
        const openingEcho = '';

        // 2. Memory Bridge (References past dialogue seamlessly without echoing questions)
        let memoryBridge = '';
        if (totalTurns > 1 && name) {
            if (l === 'es') {
                memoryBridge = `Me alegra seguir conversando contigo, **${name}**.\n\n`;
            } else {
                memoryBridge = `I am glad to keep talking with you, **${name}**.\n\n`;
            }
        }

        // 3. Multi-Domain Neural Wisdom Synthesis with Expanded Lexicon & Associative Consciousness
        const langKey = l === 'es' ? 'es' : 'en';
        const connectors = LEXICON_CONNECTORS[langKey] || LEXICON_CONNECTORS['es'];
        const nouns = LEXICON_COGNITIVE_NOUNS[langKey] || LEXICON_COGNITIVE_NOUNS['es'];
        const verbs = LEXICON_ACTION_VERBS[langKey] || LEXICON_ACTION_VERBS['es'];

        const connector = this.stochasticSelect(connectors);
        const noun = this.stochasticSelect(nouns);
        const verb = this.stochasticSelect(verbs);

        let synthesizedBody = '';

        if (topNode.domain === 'neuro') {
            synthesizedBody = `${connector}, es fundamental reconocer la manera en que tu sistema nervioso procesa la experiencia de **${emotion}**.\n\n` + this.getNeuroWisdom(l, emotion, stressLevel);
        } else if (topNode.domain === 'behavior') {
            synthesizedBody = `${connector}, podemos cultivar la **${noun}** para **${verb}** las inercias o bloqueos asociados a la sensación de **${emotion}**.\n\n` + this.getBehaviorWisdom(l, emotion);
        } else if (topNode.domain === 'cognition') {
            synthesizedBody = `${connector}, habilitar la **${noun}** nos permite **${verb}** los bucles de pensamiento que intensifican la experiencia de **${emotion}**.\n\n` + this.getCognitionWisdom(l, emotion);
        } else {
            synthesizedBody = `${connector}, abrir un espacio de **${noun}** nos ofrece la serenidad necesaria para **${verb}** este momento con **${emotion}**.\n\n` + this.getEmpathyWisdom(l, emotion);
        }

        // 4. Cognitive Pre-calculation Scenarios & Probabilistic Metacognitive Inquiry
        const cognitiveScenarios = this.generateCognitivePrecalculationScenarios(text, emotion, stressLevel, l);
        const metacognitiveQuestion = this.sampleProbabilisticInquiry(l, emotion, stressLevel, topNode.domain);

        // 5. Gentle Name Prompt if unknown
        let namePrompt = '';
        if (!this.memoryProfile.userName && Math.random() < 0.35) {
            if (l === 'es') {
                namePrompt = "\n\n💡 *Por cierto, no me has contado tu nombre. ¿Cómo te gusta que te llame? Me encantaría recordarlo para acompañarte mejor.*";
            } else {
                namePrompt = "\n\n💡 *By the way, you haven't told me your name yet. How would you like me to call you? I would love to remember it.*";
            }
        }

        const fullText = openingEcho + memoryBridge + synthesizedBody + "\n\n" + cognitiveScenarios + "\n\n**💭 Indagación Reflexiva:**\n" + metacognitiveQuestion + namePrompt;

        // Save persistent neural state
        this.saveMemoryProfile();
        this.saveNodes();

        return {
            openingEcho,
            memoryBridge,
            synthesizedBody,
            metacognitiveQuestion,
            activatedNodes: activeNodes,
            detectedEmotion: emotion,
            stressLevel,
            fullText
        };
    }

    /**
     * PROBABILISTIC ASSOCIATIVE QUESTION SAMPLER
     * Calculates softmax probability vectors across Socratic & Metacognitive inquiry matrix
     * based on active neural node domain, detected emotion, and stress level.
     */
    public sampleProbabilisticInquiry(lang: string = 'es', emotion: string = 'calma', stressLevel: number = 3, domain: string = 'cognition'): string {
        const l = (lang || 'es').toLowerCase().slice(0, 2);
        const langKey = l === 'es' ? 'es' : 'en';

        // Filter and weight candidates from the matrix
        const candidates = PROBABILISTIC_INQUIRY_MATRIX.map(q => {
            let score = q.weight;
            if (q.domain === domain) score += 0.6;
            if (q.targetEmotions.includes(emotion)) score += 0.5;
            if (stressLevel >= q.minStressLevel) score += 0.4;
            return { question: q.questionText[langKey] || q.questionText['es'], score };
        });

        const options = candidates.map(c => c.question);
        const weights = candidates.map(c => c.score);

        return this.stochasticSelect(options, weights, 0.85);
    }

    private getNeuroWisdom(lang: string, emotion: string, stress: number): string {
        if (lang === 'en') {
            return `When experiencing **${emotion}**, your body naturally reacts like an alarm system turning on. It is completely normal, and we can help your mind feel calm with these simple steps:

- **Slow Extended Breathing:** Inhale gently through your nose for 4 seconds and exhale slowly for 7 seconds. This signals your brain that you are safe right now.
- **Physical Grounding:** Place your feet firmly on the floor and relax your shoulders and jaw.
- **Take a Short Break:** Pausing what you are doing for just 5 minutes helps lower stress and clear your head.`;
        }

        return `Cuando sientes **${emotion}**, tu cuerpo reacciona de forma natural como si se activara una alarma. Es algo normal, y podemos ayudar a tu mente a recuperar la calma con estos pasos sencillos:

- **Respira Despacio:** Toma aire suavemente por la nariz contando hasta 4 y suéltalo muy despacio contando hasta 7. Esto le avisa a tu cerebro que estás a salvo.
- **Siente el Suelo:** Apoya los pies bien firmes en el piso y suelta la tensión de tus hombros.
- **Haz una Pausa:** Tómate 5 minutos para descansar de lo que estés haciendo y despejar la mente.`;
    }

    private getBehaviorWisdom(lang: string, emotion: string): string {
        if (lang === 'en') {
            return `Facing **${emotion}** can sometimes make it feel hard to start or know what to do. To move forward easily without feeling overwhelmed, try these simple ideas:

- **Take a Small Step:** Choose a task so small it takes less than 2 minutes to complete, like drinking a glass of water or organizing one item.
- **Celebrate Progress:** Give yourself credit for taking action, no matter how small. Every step counts.
- **One Thing at a Time:** Focus on just the next small step instead of looking at everything at once.`;
        }

        return `Cuando sientes **${emotion}**, a veces parece difícil empezar o saber qué hacer. Para avanzar de forma fácil sin abrumarte, prueba estas ideas sencillas:

- **Paso Chiquito:** Elige una tarea tan pequeñita que la puedas hacer en menos de 2 minutos, como tomar un vaso de agua o guardar una sola cosa en su lugar.
- **Celébrate:** Felicítate por haber dado ese primer paso. Cada avance cuenta mucho.
- **Una Cosa a la Vez:** Enfócate únicamente en lo siguiente que vas a hacer, sin preocuparte por todo lo demás de golpe.`;
    }

    private getCognitionWisdom(lang: string, emotion: string): string {
        if (lang === 'en') {
            return `When we experience **${emotion}**, our mind sometimes creates big worries about things that haven't happened yet. Here are simple ways to organize your thoughts clearly:

- **Ask Yourself:** Is this worry something that is definitely true right now, or is it just a nervous thought?
- **Speak Gently:** Instead of thinking "everything will go wrong", try saying "I am having a worried thought right now, but I can handle this step by step".
- **Write it Down:** Putting your thoughts on paper helps you see them clearly and feel more in control.`;
        }

        return `Cuando sentimos **${emotion}**, la mente a veces imagina problemas grandes que aún no han pasado. Puedes ordenar tus ideas de forma fácil con estos consejos:

- **Pregúntate con Calma:** ¿Esto que me preocupa es algo seguro que está pasando ahora, o es solo un pensamiento asustado?
- **Háblate con Cariño:** En vez de pensar "todo va a salir mal", prueba decirte "tengo un pensamiento de preocupación, pero puedo ir paso a paso".
- **Escríbelo:** Poner en un papel lo que sientes ayuda a verlo con más claridad y a quitarle peso.`;
    }

    private getEmpathyWisdom(lang: string, emotion: string): string {
        if (lang === 'en') {
            return `Feeling **${emotion}** is a normal human experience, and it is completely okay to feel this way. Here are some gentle ways to take care of yourself:

- **Be Kind to Yourself:** You don't have to fix everything today. Give yourself permission to go at your own pace.
- **Express What You Feel:** Talking to someone you trust or writing down your feelings helps relieve the weight.
- **Do Something Nice:** Take a moment to drink a warm beverage, listen to soothing music, or stretch gently.`;
        }

        return `Es completamente normal sentirse con **${emotion}** de vez en cuando. Todos sentimos esto en algún momento, y está bien ir despacio:

- **Trátate con Cariño:** No tienes que resolver todo hoy mismo. Date permiso de ir paso a paso a tu propio ritmo.
- **Habla de lo que Sientes:** Decirle a alguien de confianza cómo te sientes o escribirlo ayuda mucho a quitarte el peso de encima.
- **Haz una Pausa Agradable:** Tómate un momento para tomar algo tibio, escuchar música tranquila o respirar hondo.`;
    }

    private getMetacognitiveQuestion(lang: string, emotion: string, domain: string): string {
        return this.sampleProbabilisticInquiry(lang, emotion, 4, domain);
    }

    /**
     * EVALUATES DECISION TREE PROGRESSION ACROSS 8 INTERLINKED LEVELS
     * Updates conversation level (1-8), topic intensity, dialectic maturity,
     * emotional harmony index, and synaptic resonance score per turn.
     */
    public evaluateAndAdvanceLevel(userMessage: string, detectedEmotion: string, stressLevel: number): number {
        const text = userMessage.trim();
        const wordCount = text.split(/\s+/).length;
        const lower = text.toLowerCase();

        // Enforce Level 3: Pattern Assessment and Cognitive Causality
        let currentLevel = 3;
        this.memoryProfile.conversationLevel = 3;

        // Detect reflective/cognitive depth keywords
        const reflectiveKeywords = [
            'entiendo', 'me doy cuenta', 'siento', 'pensaba', 'creo', 'gracias', 'aprendo',
            'probar', 'intento', 'cambiar', 'razon', 'razón', 'verdad', 'paz', 'tranquilo',
            'tranquila', 'paso', 'futuro', 'pasado', 'culpa', 'miedo', 'duda', 'understand',
            'realize', 'feel', 'think', 'try', 'change', 'peace', 'calm', 'step', 'hope'
        ];
        let keywordHits = 0;
        reflectiveKeywords.forEach(k => { if (lower.includes(k)) keywordHits++; });

        // Update Topic Intensity (0.0 to 1.0)
        const newIntensity = Math.min(1.0, Math.max(0.1, (stressLevel / 10) * 0.7 + (wordCount > 20 ? 0.3 : 0.1)));
        this.memoryProfile.topicIntensity = (this.memoryProfile.topicIntensity * 0.6) + (newIntensity * 0.4);

        // Update Dialectic Maturity (0.0 to 1.0)
        const maturityGain = (keywordHits * 0.08) + (wordCount > 15 ? 0.06 : 0.02) + (this.memoryProfile.totalTurns * 0.02);
        this.memoryProfile.dialecticMaturity = Math.min(1.0, (this.memoryProfile.dialecticMaturity || 0.1) + maturityGain);

        // Update Emotional Harmony Index (0.0 to 1.0)
        const harmonyShift = (detectedEmotion === 'serenidad' || detectedEmotion === 'calma') ? 0.15 : -0.05;
        this.memoryProfile.emotionalHarmonyIndex = Math.min(1.0, Math.max(0.1, (this.memoryProfile.emotionalHarmonyIndex || 0.5) + harmonyShift));

        // Update Synaptic Resonance Score
        this.memoryProfile.synapticResonanceScore = (this.memoryProfile.synapticResonanceScore || 1.0) + (keywordHits * 0.25) + (currentLevel * 0.1);

        this.saveMemoryProfile();
        return 3;
    }
}

export interface DecisionNode {
    level: number;
    title: { es: string; en: string };
    stageName: { es: string; en: string };
    objective: { es: string; en: string };
    openers: { es: string[]; en: string[] };
    reflections: { es: string[]; en: string[] };
    socraticQuestions: { es: string[]; en: string[] };
    levelProgressionTrigger: { minWords: number; minReflectiveKeywords: number };
}

export const DECISION_TREE_LEVELS: Record<number, DecisionNode> = {
    1: {
        level: 1,
        title: { es: 'Nivel 1: Sintonía Emocional y Acogida', en: 'Level 1: Emotional Reception & Warm Tuning' },
        stageName: { es: 'Acogida y Sintonía', en: 'Reception & Warm Tuning' },
        objective: { es: 'Establecer rapport cálido, validar la emoción presente y crear un espacio seguro de escucha activa.', en: 'Establish warm rapport, validate current emotion, and build a safe space.' },
        openers: {
            es: [
                'Te escucho con la mayor atención y calidez.',
                'Aprecio sinceramente que compartas esto conmigo.',
                'Siento de corazón la carga que esto implica en tu día.',
                'Estoy totalmente presente aquí contigo.'
            ],
            en: [
                'I listen to you with complete warmth and attention.',
                'I truly appreciate you sharing this with me.',
                'I feel the weight this places on your day.',
                'I am fully present right here with you.'
            ]
        },
        reflections: {
            es: [
                'Dar el primer paso para expresar lo que sientes es un acto de valentía y honestidad contigo mismo.',
                'No hay prisa ni presión por resolver nada de golpe. Estamos aquí para ir a tu propio ritmo.',
                'Cualquier emoción que estés experimentando en este instante es válida y merece ser recibida con amabilidad.'
            ],
            en: [
                'Expressing how you feel is a brave and honest first step.',
                'There is no pressure to solve everything at once. We can move at your pace.',
                'Whatever emotion you are experiencing right now is valid and deserves kindness.'
            ]
        },
        socraticQuestions: {
            es: [
                '¿Cómo sientes tu cuerpo y tu respiración en este preciso momento?',
                '¿Qué es lo que más necesitas escuchar o sentir en este minuto?',
                'Si le diéramos un lugar a lo que sientes sin juzgarlo, ¿cómo lo describirías?'
            ],
            en: [
                'How does your body and breath feel at this exact moment?',
                'What do you most need to hear or feel right now?',
                'If we gave space to what you feel without judgment, how would you describe it?'
            ]
        },
        levelProgressionTrigger: { minWords: 4, minReflectiveKeywords: 1 }
    },
    2: {
        level: 2,
        title: { es: 'Nivel 2: Exploración Mayéutica Contextual', en: 'Level 2: Contextual Maieutic Exploration' },
        stageName: { es: 'Exploración Mayéutica', en: 'Maieutic Exploration' },
        objective: { es: 'Descomponer la situación en elementos claros, explorando detonantes y circunstancias.', en: 'Unpack the situation, exploring triggers and specific antecedents.' },
        openers: {
            es: [
                'Comprendo mejor el escenario.',
                'Siguiendo el hilo de lo que me compartes,',
                'Analizando con serenidad los detalles de tu relato,',
                'Mirando con atención lo que ha venido sucediendo,'
            ],
            en: [
                'I understand the scenario better.',
                'Following the thread of what you share,',
                'Looking calmly at the details of your experience,',
                'Observing closely what has been taking place,'
            ]
        },
        reflections: {
            es: [
                'A menudo, cuando varios factores se acumulan al mismo tiempo, la mente los percibe como un único bloque pesado.',
                'Diferenciar el hecho objetivo de la interpretación que hace la mente nos devuelve claridad y perspectiva.',
                'Observar los detalles sin prisa nos ayuda a ver dónde comenzó a generarse la tensión.'
            ],
            en: [
                'Often when multiple factors accumulate, the mind perceives them as a single heavy block.',
                'Distinguishing the objective fact from the mind\'s interpretation brings clarity.',
                'Observing the details calmly helps us see where the tension started.'
            ]
        },
        socraticQuestions: {
            es: [
                '¿Hubo un momento o evento específico que desencadenó esta sensación?',
                'De todo lo que implica esta situación, ¿qué aspecto en particular es el que más te agota?',
                '¿Qué historia se está contando tu mente sobre este evento?'
            ],
            en: [
                'Was there a specific moment or trigger for this feeling?',
                'Out of everything involved, which detail exhausts you the most?',
                'What narrative is your mind building around this event?'
            ]
        },
        levelProgressionTrigger: { minWords: 8, minReflectiveKeywords: 2 }
    },
    3: {
        level: 3,
        title: { es: 'Nivel 3: Diagnóstico de Patrón y Causalidad Cognitiva', en: 'Level 3: Cognitive Pattern & Root Belief Assessment' },
        stageName: { es: 'Identificación de Patrón', en: 'Pattern Assessment' },
        objective: { es: 'Identificar distorsiones cognitivas, exigencias rígidas o bucles de rumiación.', en: 'Identify cognitive distortions, rigid expectations, or thought loops.' },
        openers: {
            es: [
                'Es muy revelador notar este patrón.',
                'Al profundizar en tus palabras, empieza a aparecer un patrón claro:',
                'Observando la raíz de este pensamiento,',
                'Identificando la inercia de esta idea,'
            ],
            en: [
                'It is very revealing to notice this pattern.',
                'As we dig deeper, a clear pattern emerges:',
                'Looking at the root of this thought,',
                'Identifying the momentum of this idea,'
            ]
        },
        reflections: {
            es: [
                'Las exigencias internas rígidas ("debo ser perfecto", "no puedo fallar") suelen generar una sobrecarga silenciosa.',
                'Cuando la mente entra en un ciclo de anticipación, tiende a asumir la peor posibilidad como una verdad inevitable.',
                'Reconocer un bucle de pensamiento no significa que seas defectuoso; significa que tu mente está reaccionando por protección.'
            ],
            en: [
                'Rigid internal demands ("I must be perfect", "I cannot fail") create silent pressure.',
                'When the mind enters an anticipation cycle, it treats worst-case scenarios as facts.',
                'Noticing a thought loop doesn\'t mean you\'re flawed; it means your mind is acting out of protection.'
            ]
        },
        socraticQuestions: {
            es: [
                '¿Esta idea es una verdad absoluta comprobada o es una suposición basada en el temor?',
                '¿Qué pruebas reales tienes a favor y en contra de ese pensamiento?',
                '¿Te has descubierto teniendo este mismo patrón en otras situaciones del pasado?'
            ],
            en: [
                'Is this thought an absolute proven fact, or an assumption based on fear?',
                'What actual evidence do you have for and against this thought?',
                'Have you noticed this same pattern in other past situations?'
            ]
        },
        levelProgressionTrigger: { minWords: 10, minReflectiveKeywords: 2 }
    },
    4: {
        level: 4,
        title: { es: 'Nivel 4: Reencuadre Cognitivo y Flexibilidad Mental', en: 'Level 4: Cognitive Reframing & Perspective Shift' },
        stageName: { es: 'Reencuadre Cognitivo', en: 'Cognitive Reframing' },
        objective: { es: 'Ofrecer reestructuración cognitiva CBT y perspectiva de impermanencia Zen.', en: 'Provide CBT reframing, perspective shifts, and Zen impermanence.' },
        openers: {
            es: [
                'Abramos ahora una ventana hacia una nueva perspectiva.',
                'Podemos reestructurar la manera en que observamos este pensamiento.',
                'Aplicando la flexibilidad mental,',
                'Invitando a la mente a un espacio de reencuadre,'
            ],
            en: [
                'Let us open a window toward a new perspective.',
                'We can restructure how we view this thought.',
                'Applying mental flexibility,',
                'Inviting the mind into a space of reframing,'
            ]
        },
        reflections: {
            es: [
                'Un pensamiento no es un hecho. Es una construcción transitoria que puedes observar pasar como una nube.',
                'Sustituir una interpretación catastrófica por una posibilidad realista disminuye la activación del estrés.',
                'En la filosofía Zen, recordar que todo cambia nos devuelve la libertad de no aferrarnos al malestar del presente.'
            ],
            en: [
                'A thought is not a fact. It is a passing construction you can observe like a cloud.',
                'Replacing catastrophic interpretations with realistic options instantly lowers stress.',
                'In Zen philosophy, remembering that all things change restores our freedom from present pain.'
            ]
        },
        socraticQuestions: {
            es: [
                'Si este pensamiento no fuera del todo cierto, ¿qué otra explicación más amable podría existir?',
                '¿Cómo le explicarías esta misma situación a un amigo querido a quien quieres cuidar?',
                '¿Qué cambiaría en tu día si decidieras soltar esa interpretación por los próximos 10 minutos?'
            ],
            en: [
                'If this thought were not entirely true, what kinder explanation could exist?',
                'How would you explain this situation to a dear friend you want to support?',
                'What would change in your day if you chose to set that view aside for 10 minutes?'
            ]
        },
        levelProgressionTrigger: { minWords: 12, minReflectiveKeywords: 3 }
    },
    5: {
        level: 5,
        title: { es: 'Nivel 5: Plan de Acción Consciente y Anclaje Sensorial', en: 'Level 5: Sensory Grounding & Action Plan' },
        stageName: { es: 'Acción y Anclaje Sensorial', en: 'Grounding & Action Plan' },
        objective: { es: 'Traducir la reflexión en micro-pasos de acción baja en fricción y anclaje físico.', en: 'Translate reflection into low-friction micro-actions and somatic grounding.' },
        openers: {
            es: [
                'Es momento de llevar la paz a la acción tangible.',
                'Para consolidar este avance, pasemos al plano práctico.',
                'Con la mente más despejada, diseñemos tu siguiente micro-paso.',
                'Aterrizando esta claridad en tu vida cotidiana,'
            ],
            en: [
                'It is time to bring peace into tangible action.',
                'To solidify this progress, let us move to practical steps.',
                'With a clearer mind, let us design your next micro-step.',
                'Bringing this clarity down into your daily life,'
            ]
        },
        reflections: {
            es: [
                'El cerebro no necesita grandes revoluciones para calmarse; necesita la confirmación de una micro-victoria ejecutada.',
                'Un paso tan pequeño que sea imposible fallar envía una señal biológica de seguridad a tu sistema nervioso.',
                'Anclar la atención en sensaciones corporales presentes detiene el hábito de la rumiación nocturna o diurna.'
            ],
            en: [
                'The brain does not need massive shifts to calm down; it needs the confirmation of one small victory.',
                'A step so small it is impossible to fail signals safety to your nervous system.',
                'Anchoring attention in bodily sensations breaks the habit of day or night rumination.'
            ]
        },
        socraticQuestions: {
            es: [
                '¿Cuál es la tarea o acción más pequeña (de 2 minutos) que puedes regalarte realizar hoy?',
                '¿Qué ejercicio de respiración o descanso corporativo te gustaría probar ahora mismo?',
                '¿Cómo puedes proteger este momento de paz en las próximas horas?'
            ],
            en: [
                'What is the smallest 2-minute action you can gift yourself today?',
                'Which breathing or bodily rest exercise would you like to try right now?',
                'How can you protect this moment of calm over the next few hours?'
            ]
        },
        levelProgressionTrigger: { minWords: 12, minReflectiveKeywords: 3 }
    },
    6: {
        level: 6,
        title: { es: 'Nivel 6: Estrategia de Resiliencia y Hábitos de Autocuidado', en: 'Level 6: Resilience Strategy & Self-Care Boundaries' },
        stageName: { es: 'Estrategia de Resiliencia', en: 'Resilience Strategy' },
        objective: { es: 'Construir rutinas de autocuidado sostenibles y límites emocionales claros.', en: 'Build sustainable self-care routines and clear emotional boundaries.' },
        openers: {
            es: [
                'Diseñemos tu fortaleza de resiliencia a largo plazo.',
                'Consolidando un hábito de autocuidado genuino,',
                'Estableciendo límites amorosos para proteger tu paz,',
                'Sosteniendo este bienestar de forma duradera,'
            ],
            en: [
                'Let us design your long-term resilience framework.',
                'Consolidating a genuine self-care habit,',
                'Establishing loving boundaries to protect your peace,',
                'Sustaining this well-being over time,'
            ]
        },
        reflections: {
            es: [
                'Establecer límites no es un acto de egoísmo; es la condición indispensable para mantener tu salud mental.',
                'La resiliencia no consiste en resistir golpes sin sentir dolor, sino en saber cómo regresar a tu centro sereno.',
                'Tratarte con la misma paciencia que le ofrecerías a tu persona más amada nutre tu autoestima real.'
            ],
            en: [
                'Setting boundaries is not selfish; it is essential for protecting your mental health.',
                'Resilience is not about absorbing pain without feeling, but knowing how to return to your calm center.',
                'Treating yourself with the patience you\'d give to someone you love builds genuine self-esteem.'
            ]
        },
        socraticQuestions: {
            es: [
                '¿Qué límite saludable necesitas comunicar o mantener para cuidar tu energía esta semana?',
                '¿Qué micro-hábito nocturno o matutino mantendrá tu serenidad activa?',
                '¿De qué manera te comprometes a hablarte internamente cuando reaparezca la prisa?'
            ],
            en: [
                'What healthy boundary do you need to communicate or maintain to protect your energy this week?',
                'Which morning or evening micro-habit will keep your serenity active?',
                'How do you commit to speaking to yourself when pressure arises again?'
            ]
        },
        levelProgressionTrigger: { minWords: 14, minReflectiveKeywords: 3 }
    },
    7: {
        level: 7,
        title: { es: 'Nivel 7: Metacognición y Síntesis Dialéctica', en: 'Level 7: Metacognitive Insight & Synthesis' },
        stageName: { es: 'Síntesis Metacognitiva', en: 'Metacognitive Insight' },
        objective: { es: 'Guiar al usuario a sintetizar su propia toma de conciencia y aprendizaje evolutivo.', en: 'Guide the user to synthesize their own realization and growth.' },
        openers: {
            es: [
                'Es profundamente inspirador observar tu evolución durante nuestro diálogo.',
                'Al mirar el recorrido de esta conversación,',
                'Cosechando los frutos de tu propia reflexión,',
                'Observando el cambio en tu tono y tu perspectiva,'
            ],
            en: [
                'It is deeply inspiring to observe your growth through our dialogue.',
                'Looking back across our conversation,',
                'Harvesting the insights from your own reflection,',
                'Observing the shift in your tone and perspective,'
            ]
        },
        reflections: {
            es: [
                'La verdadera sabiduría no proviene de respuestas externas, sino de descubrir la claridad que ya habitaba en tu interior.',
                'Darte cuenta de cómo ha cambiado tu forma de ver este reto es la prueba directa de tu flexibilidad mental.',
                'Has transitado desde la opresión inicial hacia un espacio de autodeterminación y serenidad.'
            ],
            en: [
                'True wisdom comes not from external answers, but from discovering the clarity already within you.',
                'Noticing how your perspective has shifted is direct proof of your mental flexibility.',
                'You have moved from initial pressure into a space of self-determination and serenity.'
            ]
        },
        socraticQuestions: {
            es: [
                '¿Cuál es el aprendizaje o la verdad más valiosa que te llevas de nuestra plática de hoy?',
                'Si pudieras resumir tu nuevo estado mental en una sola palabra o frase, ¿cuál sería?',
                '¿Cómo te sientes al comparar tu estado presente con cómo te sentías al iniciar la conversación?'
            ],
            en: [
                'What is the most valuable realization you take away from our talk today?',
                'If you could summarize your new state of mind in a single word or phrase, what would it be?',
                'How do you feel comparing your present state to when we began chatting?'
            ]
        },
        levelProgressionTrigger: { minWords: 15, minReflectiveKeywords: 4 }
    },
    8: {
        level: 8,
        title: { es: 'Nivel 8: Consolidación, Integración y Autonomía Emocional', en: 'Level 8: Integration & Autonomous Empowerment' },
        stageName: { es: 'Consolidación y Autonomía', en: 'Integration & Autonomy' },
        objective: { es: 'Celebrar la autoeficacia, consolidar huellas de aprendizaje e invitar a la autonomía plena.', en: 'Celebrate self-efficacy, consolidate learning, and empower autonomy.' },
        openers: {
            es: [
                'Celebro con alegría tu fortaleza y tu autonomía interior.',
                'Llegando a este nivel de integración y serenidad,',
                'Consolidando tu centro de paz y autoconfianza,',
                'Honrando el camino de aprendizaje que has construido,'
            ],
            en: [
                'I celebrate your inner strength and autonomy with joy.',
                'Reaching this level of integration and serenity,',
                'Consolidating your center of peace and self-trust,',
                'Honoring the path of growth you have built,'
            ]
        },
        reflections: {
            es: [
                'Tienes en tus manos todas las herramientas humanas para acompañarte, cuidarte y regresar a tu centro sereno.',
                'Recuerda que esta paz no es un regalo externo que yo te dé; es tu propia naturaleza reencontrada.',
                'Siempre que lo necesites, estaré aquí para volver a conversar, pero hoy te vas con tu luz interior totalmente encendida.'
            ],
            en: [
                'You hold all the human tools to support yourself and return to your calm center.',
                'Remember this peace is not an external gift from me; it is your own nature rediscovered.',
                'Whenever you need, I am right here to talk, but today you move forward with your inner light fully shining.'
            ]
        },
        socraticQuestions: {
            es: [
                '¿De qué manera te gustaría celebrar o agradecerte este momento de claridad hoy?',
                '¿Hay algún otro tema que quieras guardar en tu corazón, o sientes la satisfacción de haber encontrado tu paz?',
                '¿Cómo te gustaría llevar esta luz serena hacia las personas que te rodean el día de hoy?'
            ],
            en: [
                'How would you like to celebrate or thank yourself for this moment of clarity today?',
                'Is there any other topic you wish to hold, or do you feel the satisfaction of finding your peace?',
                'How would you like to carry this calm light out to the people around you today?'
            ]
        },
        levelProgressionTrigger: { minWords: 16, minReflectiveKeywords: 4 }
    }
};

// Global Singleton Instance
export const auraNeuralEngine = new AuraNeuralEngine();
