// ============================================================
// AURA LITE AI ENGINE - ZEN PROTO-AI THERAPEUTIC COMPANION
// Algorithm for Cognitive Wellness, Mindfulness & Serene Dialogue
// ============================================================

import { auraNeuralEngine } from "./AuraNeuralEngine.ts";
import { GrammaticalParser } from "./GrammaticalParser.ts";
import { ResponseGenerator } from "./ResponseGenerator.ts";

export interface LiteResponseOptions {
    lang?: string;
    messageHistory?: Array<{ role: string; content: string }>;
}

// Helper to normalize language code
function normalizeLang(lang: string): string {
    const l = (lang || 'es').toLowerCase().slice(0, 2);
    const supported = ['es', 'en', 'de', 'fr', 'it', 'pt', 'ja', 'zh', 'ru'];
    return supported.includes(l) ? l : 'es';
}

/**
 * Extract a clean, meaningful snippet from the user's message to build a Zen reflection quote
 */
function extractUserSnippet(message: string): string {
    let clean = message.trim()
        .replace(/^[\s!.,?¿¡]+|[\s!.,?¿¡]+$/g, '')
        .replace(/\s+/g, ' ');

    if (clean.length > 50) {
        clean = clean.slice(0, 47) + '...';
    }
    return clean || 'tu mensaje';
}

/**
 * Human Warm Reflective Openings by Language
 */
function getZenOpening(_snippet: string, _lang: string): string {
    return '';
}

// Extensive multi-language database with conversational, simple, title-free responses
const topicResponses: Record<string, Record<string, string>> = {

    // ----------------------------------------------------
    // 1. SALUDOS / GREETINGS
    // ----------------------------------------------------
    saludo: {
        es: `¡Hola! Qué alegría saludarte. Soy **Aura**, un asistente de apoyo cognitivo diseñado para escucharte con cariño y ayudarte a sentir más paz y claridad.

Aquí estamos para conversar con calma. Puedes contarme lo que necesites, por ejemplo:
- **Calmar el estrés o la ansiedad**
- **Aprender a soltar preocupaciones que no puedes cambiar**
- **Organizar tus ideas si sientes que piensas demasiado**
- **Ponernos a platicar sobre cómo te sientes hoy**

¿Cómo te sientes en este instante? Cuéntame con confianza.`,

        en: `Hello! I am very glad to greet you. I am **Aura**, a cognitive assistant designed to listen kindly and help you find peace and clarity.

We are here to talk calmly. You can tell me anything on your mind, like:
- **Calming stress or anxiety**
- **Learning to let go of worries you can't control**
- **Organizing your thoughts if you feel overwhelmed**
- **Sharing how your day is going**

How are you feeling right now? Feel free to share.`,

        de: `Hallo! Ich bin **Aura**, dein kognitiver Begleiter. Wie fühlst du dich heute?`,

        fr: `Bonjour ! Je suis **Aura**, votre assistant pour organiser vos pensées et trouver du calme. Comment vous sentez-vous ?`,

        it: `Ciao! Sono **Aura**, il tuo compagno per ritrovare calma e chiarezza mental. Come stai oggi?`,

        pt: `Olá! Sou o **Aura**, seu companheiro para organizar pensamentos e trazer tranquilidade. Como você se sente hoje?`,

        ja: `こんにちは！**Aura**へようこそ。心と思考を整理するパートナーです。気分はいかがですか？`,

        zh: `你好！我是 **Aura**，为你提供专注与心理放松的对话助手。今天你感觉怎么样？`,

        ru: `Привет! Я **Aura** — твой помощник для спокойствия и ясности ума. Как ты себя чувствуешь?`
    },

    // ----------------------------------------------------
    // 2. IDENTITY & PROTO-AI TRANSPARENCY
    // ----------------------------------------------------
    quien_eres: {
        es: `Soy **Aura**, un asistente de apoyo cognitivo y acompañamiento diseñado para escucharte y ayudarte a organizar tus ideas y emociones.

- **Un espacio tranquilo:** Estoy pensado para ayudarte a sentir más calma, enfocar tu atención y brindarte consejos sencillos.
- **Tu privacidad es segura:** Todo lo que platicamos ocurre dentro de tu dispositivo.
- **Sin complicaciones:** No soy terapeuta ni médico, sino un ayudante cercano que va paso a paso contigo.

¿Sobre qué te gustaría platicar o qué te gustaría organizar hoy?`,

        en: `I am **Aura**, a cognitive support assistant built to listen and help you structure your thoughts and feelings.

- **A calm space:** Designed to help you relax, focus, and find easy strategies for daily life.
- **Private & local:** Everything we talk about stays safely inside your device.
- **Companion focus:** I am a cognitive helper, not a medical therapist, here to guide you step by step.

What would you like to talk about or organize today?`,

        de: `Ich bin **Aura**, dein kognitiver Begleiter für innere Ruhe und klare Gedanken.`,

        fr: `Je suis **Aura**, un compagnon pour vous aider à organiser vos idées y retrouver du calme.`,

        it: `Sono **Aura**, un assistente per organizzare i tuoi pensieri e gestire lo stress.`,

        pt: `Sou o **Aura**, um assistente para te ajudar a ter mais clareza e tranquilidade.`,

        ja: `私は**Aura**です。思考や感情を整理し、心を落ち着かせるためのパートナーです。`,

        zh: `我是 **Aura**，帮助你理清思路、缓解压力和保持专注的对线助手。`,

        ru: `Я **Aura** — твой помощник для порядка в мыслях и эмоционального покоя.`
    },

    // ----------------------------------------------------
    // 3. OUT OF DOMAIN (PRAGMATIC & ZEN DISCLOSURE)
    // ----------------------------------------------------
    fuera_de_dominio: {
        es: `Noto que me preguntas sobre temas técnicos, código, matemáticas, noticias o datos enciclopédicos.

Como tu asistente de apoyo cognitivo y acompañamiento, estoy diseñado únicamente para ayudarte a organizar tus ideas, manejar tus emociones y sentir más tranquilidad. No cuento con información general para responder dudas escolares o técnicas.

Si sientes tensión o estrés por esa tarea o trabajo, dime y con gusto te ayudo a organizar tu tiempo y a relajarte. ¿Cómo te sientes en este momento?`,

        en: `I notice you are asking about technical topics, coding, math, or general trivia.

As your cognitive companion assistant, my purpose is dedicated to helping you organize your thoughts, lower stress, and feel calm. I do not have general databases for technical or academic answers.

If you are feeling stressed or rushed by that work, let me know and we can organize your time together. How is your energy right now?`,

        de: `Deine Frage betrifft technische Themen. Als kognitiver Begleiter helfe ich dir bei Gedanken und Emotionen.`,

        fr: `Votre demande concerne des sujets techniques. Je suis là pour vous aider avec la gestion du stress et vos pensées.`,

        it: `La tua domanda è tecnica. Il mio obiettivo è aiutarti a ritrovare calma e organizzare i tuoi pensieri.`,

        pt: `Sua pergunta é sobre conhecimento técnico. O Aura é focado na paz interior e organização de pensamentos.`,

        ja: `技術的なご質問ですね。Auraは心の整理とリラックスに特化したパートナーです。`,

        zh: `你的提问包含技术知识。我是专注于情绪梳理与正念减压的语言助手。`,

        ru: `Твой вопрос касается технических тем. Моя задача — помочь тебе с мыслями и покоем.`
    },

    // ----------------------------------------------------
    // 4. ANSIEDAD Y ESTRÉS
    // ----------------------------------------------------
    ansiedad: {
        es: `Me alegra que busques formas de manejar tu ansiedad. La ansiedad es un problema común que puede afectar a muchas personas, pero hay varias estrategias muy sencillas que pueden ayudarte a manejarla de manera efectiva.

Aquí te presento algunas sugerencias:

- **Respira despacio:** Toma aire por la nariz en 4 segundos y suéltalo muy lentamente por la boca en 7 segundos. Esto le avisa a tu cuerpo que estás a salvo.
- **Mantén un diario de pensamientos:** Escribe lo que sientes y piensas cada día. Esto te ayudará a identificar patrones y emociones.
- **Siente el suelo:** Apoya bien tus pies en el piso, afloja tus hombros y nota la sensación del suelo firme sosteniéndote.
- **Haz una pausa:** Regálate 5 minutos para descansar, tomar un vaso de agua y estirarte.

¿Cómo sientes tu respiración en este momento?`,

        en: `I am glad you are looking for ways to handle anxiety. Anxiety is a very common issue, but there are simple strategies that can help you manage it effectively.

Here are some helpful suggestions:

- **Slow Breathing:** Inhale gently for 4 seconds and exhale slowly for 7 seconds. This signals your brain that you are safe.
- **Keep a Thought Journal:** Write down what you feel each day to understand your emotional patterns.
- **Feet on the Floor:** Place your feet flat on the floor and loosen your shoulders to relax your body.
- **Take a Short Break:** Give yourself 5 minutes to rest, drink water, and clear your mind.

How does your breathing feel right now?`,

        de: `Angst ist wie eine Welle. Atme tief aus und spüre die feste Erde unter deinen Füßen.`,

        fr: `L'anxiété est très courante. Respirez lentement et posez vos pieds à plat sur le sol.`,

        it: `L'ansia si può gestire a piccoli passi. Fai un respiro lento e rilassa le spalle.`,

        pt: `A ansiedade é comum e podemos vencê-la aos poucos. Respire fundo e relaxe os ombros.`,

        ja: `不安は誰にでもある感情です。深く息を吐き、足の裏が地面に触れている感覚を味わいましょう。`,

        zh: `焦虑非常普遍。深呼吸，把脚平放在地面上，让肩膀放松下来。`,

        ru: `Тревога — это нормально. Сделай медленный выдох и почувствуй опору под ногами.`
    },

    // ----------------------------------------------------
    // 5. RUMIACIÓN Y BUCLES
    // ----------------------------------------------------
    rumiacion: {
        es: `Cuando le damos muchas vueltas a un pensamiento, la mente se siente llena de ruido. Es como tener muchas pestañas abiertas en la cabeza al mismo tiempo.

Aquí tienes algunas ideas sencillas para despejar tu mente:

- **Tú no eres tus pensamientos:** Los pensamientos son como nubes que pasan por el cielo. No tienes que atrapar cada nube.
- **Pregúntate:** "¿Este pensamiento me está ayudando ahora mismo o solo me está quitando la tranquilidad?"
- **Escríbelo en un papel:** Poner las palabras afuera en una hoja te ayuda a sacarlas de tu cabeza y verlas con distancia.

¿Hay algún pensamiento en particular que no te haya dejado tranquilo hoy?`,

        en: `When we overthink, the mind feels full of noise, like having too many windows open at once.

Here are simple ways to clear your mind:

- **You are not your thoughts:** Thoughts are like clouds floating by. You don't have to chase every cloud.
- **Ask yourself:** "Is this worry helping me right now, or is it just taking away my peace?"
- **Write it down:** Putting your thoughts on paper helps get them out of your head.

What thought has been repeating in your mind today?`,

        de: `Gedanken sind wie Wolken am Himmel. Lass sie einfach vorüberziehen.`,

        fr: `Vos pensées sont comme des nuages. Vous n'avez pas besoin de toutes les retenir.`,

        it: `I pensieri passano come nuvole. Non devi seguirli tutti, lascia che vadano.`,

        pt: `Seus pensamentos são como nuvens no céu. Escreva-os para esvaziar a mente.`,

        ja: `思考は空に浮かぶ雲のようなものです。掴もうとせず、通り過ぎるのを眺めましょう。`,

        zh: `念头就像天空中飘过的云彩。不需要追逐每一个想法，试着把它们写在纸上。`,

        ru: `Мысли — как облака в небе. Не удерживай их, дай им проплыть мимо.`
    },

    // ----------------------------------------------------
    // 6. INSOMNIO Y SUEÑO
    // ----------------------------------------------------
    sueno: {
        es: `Tratar de obligarse a dormir cuando la mente está despierta suele dar el efecto contrario. Para descansar mejor, prueba estos pasos tranquilos:

- **Suelta la prisa:** Si no puedes dormirte de inmediato, no te preocupes. Simplemente recostarse en la cama a descansar el cuerpo ya te hace mucho bien.
- **Respira en 4-7-8:** Inhala aire suavemente en 4 segundos, mantén el aire 7 segundos y exhala muy despacio en 8 segundos.
- **Guarda tus pendientes:** Imagina que guardas los temas de mañana en un cajoncito fuera de tu cama.

¿Llevas mucho tiempo despierto en la cama?`,

        en: `Trying to force sleep often makes us more awake. To help your body relax, try these gentle steps:

- **Release the rush:** Resting comfortably in bed is already giving your body good recovery.
- **4-7-8 Breathing:** Inhale gently for 4s, hold for 7s, and exhale very slowly for 8s.
- **Put worries away:** Imagine placing tomorrow's tasks in a drawer outside your room.

Have you been awake for a long time tonight?`,

        de: `Schlaf lässt sich nicht erzwingen. Atme 4-7-8 und entspanne dich in deinem Bett.`,

        fr: `Ne forcez pas le sommeil. Reposez votre corps et pratiquez la respiration douce.`,

        it: `Non sforzarti di dormire. Rilassa il corpo nella stanza calda e fa' dei respiri lenti.`,

        pt: `Não force o sono. Apenas relaxe o corpo na cama e pratique a respiração 4-7-8.`,

        ja: `無理に寝ようとせず、布団の温もりを感じながらゆったり息を吐きましょう。`,

        zh: `不要强迫自己入睡。躺在温暖的床上，顺其自然地放松身体。`,

        ru: `Не заставляй себя спать. Просто расслабь тело и подыши медленно.`
    },

    // ----------------------------------------------------
    // 7. TRISTEZA Y AUTOCOMPASIÓN
    // ----------------------------------------------------
    tristeza: {
        es: `Sentir tristeza es una emoción natural y válida. No necesitas obligarte a estar feliz de inmediato ni esconder lo que sientes.

Aquí hay algunas formas de cuidar de ti cuando estés triste:

- **Sé amable contigo:** Háblate como le hablarías a tu mejor amigo cuando la está pasando mal.
- **Ve paso a paso:** No tienes que resolver todo hoy. Date permiso de ir despacio y descansar.
- **Expresa lo que sientes:** Decirle a alguien de confianza cómo te sientes o escribirlo ayuda a aliviar el peso.

¿Qué es lo que más te gustaría escuchar o necesitar en este momento?`,

        en: `Feeling sad is a natural and normal experience. You don't have to force yourself to be cheerful right away.

Here are gentle ways to care for yourself:

- **Be kind to yourself:** Speak to yourself like you would speak to a good friend who needs support.
- **Go step by step:** You don't need to fix everything today. Take your time.
- **Share your feelings:** Writing down your thoughts or talking to someone helps lighten the weight.

What would help you feel most supported right now?`,

        de: `Traurigkeit ist ganz normal. Sei heute besonders freundlich zu dir selbst.`,

        fr: `La tristesse est une émotion normale. Soyez doux avec vous-même aujourd'hui.`,

        it: `Sentirsi tristi è normale. Trattati con gentilezza, come faresti con un caro amico.`,

        pt: `A tristeza faz parte da vida. Trate-se com muito carinho e vá no seu tempo.`,

        ja: `悲しい気持ちは自然なことです。大切な友達に接するように、自分を優しく労わりましょう。`,

        zh: `难过是非常正常的感受。像照顾最好的朋友一样，耐心地对你自己。`,

        ru: `Грустить — это нормально. Относись к себе с теплотой и заботой.`
    },

    // ----------------------------------------------------
    // 8. TCC & PSICOEDUCACIÓN COGNITIVA
    // ----------------------------------------------------
    tcc_psicologia: {
        es: `En la psicología cognitiva aprendemos que la forma en que pensamos cambia directamente la forma en que nos sentimos y nos comportamos:

- **Pensamientos:** Es la idea que llega a la cabeza (por ejemplo: "esto es muy difícil").
- **Emociones:** Es la sensación en el cuerpo (como sentir nervios o angustia).
- **Acciones:** Es lo que hacemos (como detenernos o evitar la tarea).

Lo bonito es que si cambiamos el pensamiento asustado por uno más tranquilo y realista, la emoción y el cuerpo también se calman.

¿Hay alguna idea preocupante que te gustaría revisar juntos?`,

        en: `In cognitive psychology, we learn that how we think changes how we feel and act:

- **Thoughts:** The idea in your mind (e.g., "this is too hard").
- **Emotions:** What you feel in your body (like feeling nervous).
- **Actions:** What you choose to do next.

When we change a scary thought to a calmer, realistic one, our emotions naturally relax too.

Is there a thought you'd like us to look at together?`,

        de: `Unsere Gedanken beeinflussen unsere Gefühle. Ein ruhiger Gedanke bringt Entspannung.`,

        fr: `Nos pensées influencent nos émotions. Un pensée plus douce apaise l'esprit.`,

        it: `I pensieri guidano le emozioni. Cambiando il pensiero, il corpo si rilassa.`,

        pt: `Nossos pensamentos mudam nossos sentimentos. Pensar com calma traz tranquilidade.`,

        ja: `思考が感情や行動に影響を与えます。考え方を少し和らげるだけで気持ちが楽になります。`,

        zh: `想法会直接影响你的情绪。换个温和的角度看待问题，心情就会跟着平静。`,

        ru: `Мысли влияют на эмоции. Изменив мысль, мы успокаиваем тело.`
    },

    // ----------------------------------------------------
    // 9. INCERTIDUMBRE Y CAMBIOS
    // ----------------------------------------------------
    incertidumbre: {
        es: `Es normal sentir inquietud cuando no sabemos qué va a pasar en el futuro. Nadie puede saber todo lo que pasará mañana, pero sí podemos cuidar el día de hoy:

- **Enfócate en tu paso presente:** No necesitas resolver todo el año de golpe. Solo necesitas dar el paso que tienes enfrente ahora mismo.
- **Acepta que las cosas cambian:** Las situaciones cambian todo el tiempo, y tú tienes la capacidad de adaptarte paso a paso.
- **Haz una pausa:** Si dejas de preocuparte por el mañana durante 5 minutos, ¿puedes sentir paz en este preciso segundo?

¿Qué situación te tiene preocupado por el futuro?`,

        en: `It's normal to feel uneasy when we don't know what will happen next. We can't predict tomorrow, but we can take care of today:

- **Focus on the current step:** You don't need to solve the whole future right now. Just focus on the step in front of you.
- **Things always change:** Change is natural, and you have the ability to adapt step by step.
- **Take a pause:** If you put tomorrow's worries aside for 5 minutes, can you find calm right now?

What future situation is on your mind?`,

        de: `Konzentriere dich auf den heutigen Tag. Du musst nicht die ganze Zukunft auf einmal lösen.`,

        fr: `Concentrez-vous sur aujourd'hui. Vous n'avez pas besoin de tout résoudre d'un coup.`,

        it: `Concentrati sul momento presente. Un passo alla volta è suficiente per andare avanti.`,

        pt: `Foque no dia de hoje. Você só precisa dar o próximo passo.`,

        ja: `未来の全てを今決める必要はありません。今目の前にある一歩に集中しましょう。`,

        zh: `你不需要立刻解决未来的所有事。专注于你眼前的这步就好。`,

        ru: `Фокусируйся на сегодняшнем дне. Достаточно сделать лишь один шаг вперед.`
    },

    // ----------------------------------------------------
    // 10. LÍMITES Y ASERTIVIDAD
    // ----------------------------------------------------
    limites: {
        es: `Poner límites significa decir claramente lo que puedes y no puedes hacer, sin enojarte ni sentir culpa. Un límite saludable protege tu tiempo y tu tranquilidad.

- **Sé claro y respetuoso:** Puedes decir "en este momento no puedo ayudar con esto" o "necesito un tiempo a solas".
- **Cuidar de ti no es egoísmo:** Decir que no cuando estás cansado es una forma honesta de cuidarte.
- **Poco a poco:** Practica decir lo que sientes de forma amable y firme.

¿Con qué persona o situación te gustaría practicar un límite claro?`,

        en: `Setting boundaries means clearly stating what you can and cannot do, without anger or guilt. It protects your energy and peace.

- **Be clear and polite:** You can say "I can't do this right now" or "I need a quiet break."
- **Self-care is healthy:** Saying no when you are tired is an honest way to take care of yourself.
- **Practice step by step:** Express your needs kindly and firmly.

Who or what situation would you like to set a healthy boundary with?`,

        de: `Grenzen setzen ist gesund. Vernünftige Grenzen schützen deine Energie.`,

        fr: `Poser des limites permet de protéger votre énergie avec gentillesse.`,

        it: `Dire di no quando sei stanco è un modo sano di prenderti cura di te.`,

        pt: `Estabelecer limites protege sua energia e tranquilidade.`,

        ja: `境界線を引くことは自分を守る大切なことです。「今は難しい」と優しく伝えましょう。`,

        zh: `设立界限是为了保护你的精力。学会温和地表达拒绝是健康的沟通。`,

        ru: `Умение говорить «нет» — это нормальная забота о себе.`
    },

    // ----------------------------------------------------
    // 11. CONCENTRACIÓN Y PASOS PEQUEÑOS
    // ----------------------------------------------------
    concentracion: {
        es: `Cuando tenemos mucho que hacer, la mente se bloquea porque intenta mover toda la tarea junta. La solución más fácil es avanzar a pasos chiquitos:

- **La regla del ladrillo:** No pienses en todo el trabajo. Enfócate en colocar un solo ladrillito (hacer una sola cosa por 5 minutos).
- **Prueba 5 minutos:** Dite a ti mismo "voy a trabajar en esto solo 5 minutos". Al empezar, la resistencia se reduce mucho.
- **Limpia tu espacio:** Quita de tu vista las cosas que te distraigan por un rato.

¿Cuál es ese pequeño paso que podrías dar hoy sin presionarte?`,

        en: `When we have a lot to do, the mind freezes trying to handle it all at once. The easiest solution is small micro-steps:

- **The brick rule:** Don't worry about the whole building. Just focus on laying one single brick (working for 5 minutes).
- **Try 5 minutes:** Tell yourself "I'll try this for just 5 minutes." Starting is the hardest part.
- **Clear distractions:** Put away extra clutter for a short time.

What is one tiny step you can take right now without pressure?`,

        de: `Bewege nicht den ganzen Berg. Fange einfach mit einer 5-Minuten-Aufgabe an.`,

        fr: `Faites une toute petite étape de 5 minutes pour commencer sans pression.`,

        it: `Non pensare a tutto il lavoro. Fai solo una piccola cosa per 5 minuti.`,

        pt: `Não tente fazer tudo de uma vez. Faça apenas uma pequena tarefa de 5 minutos.`,

        ja: `大きな作業も5分間の小さな一歩から始めましょう。無理をしないことが大切です。`,

        zh: `不要试图一口气做完。试着先专注做5分钟，哪怕只做一小部分。`,

        ru: `Не пытайся сделать всё сразу. Начни с маленького шага на 5 минут.`
    },

    // ----------------------------------------------------
    // 12. RESPIRACIÓN Y RELAJACIÓN
    // ----------------------------------------------------
    meditacion: {
        es: `Tu respiración es como un ancla que siempre llevas contigo para volver a la calma en cualquier momento.

Probemos esta forma fácil de respirar juntos:
1. **Inhala** por la nariz sintiendo cómo entra el aire suavemente en **4 segundos**.
2. **Sostén** el aire con calma durante **4 segundos**.
3. **Exhala** soltando todo el aire lentamente en **4 segundos**.
4. **Descansa** sintiendo la tranquilidad en **4 segundos**.

Suelta los hombros y afloja la mandíbula. ¿Cómo te sientes después de hacer esta respiración?`,

        en: `Your breath is like an anchor you carry everywhere to find calm whenever you need it.

Let's try this easy breathing box together:
1. **Inhale** gently through your nose for **4 seconds**.
2. **Hold** softly for **4 seconds**.
3. **Exhale** slowly for **4 seconds**.
4. **Rest** calmly for **4 seconds**.

Drop your shoulders and relax your jaw. How do you feel after trying this?`,

        de: `Atme im Quadrat (4-4-4-4) und entspanne deine Schultern.`,

        fr: `Faites une respirations carrée 4-4-4-4 y relâchez vos épaules.`,

        it: `Fai la respirazione a quadrato 4-4-4-4 e rilassa le spalle.`,

        pt: `Respire em quadrado 4-4-4-4 e solte a tensão dos ombros.`,

        ja: `4秒吸って、4秒止めて、4秒吐く呼吸で、体をゆっくりほぐしましょう。`,

        zh: `跟着 4-4-4-4 正念呼吸，顺便把紧绷的肩膀放低。`,

        ru: `Подыши по квадрату 4-4-4-4 и расслабь плечи.`
    },

    // ----------------------------------------------------
    // 13. AYUDA PROFESIONAL
    // ----------------------------------------------------
    crisis_ayuda: {
        es: `Aura es un asistente de apoyo cognitivo para el día a día. Si sientes que necesitas una atención personalizada con un profesional de la salud mental:

Puedes presionar el botón **"💚 Solicitar atención"** en la barra superior para informarte sobre:
- Sesiones de psicoterapia.
- Acompañamiento emocional.
- Costos e información de contacto.

*En caso de una emergencia o crisis grave, acude o llama a los servicios de emergencia de tu comunidad inmediatamente.*

¿Te gustaría que platiquemos más al respecto?`,

        en: `Aura is a daily cognitive support companion. If you require individualized professional therapy:

Click the **"💚 Support request"** button at the top to inquire about:
- Individual therapy sessions.
- Professional guidance.
- Contact information.

*Emergency:* If you are in severe crisis, please contact your local emergency helpline immediately.`,

        de: `Für professionelle Unterstützung klicke auf **"💚 Hilfe anfordern"**.`,

        fr: `Pour un soutien professionnel, cliquez sur **"💚 Demander de l'aide"**.`,

        it: `Per consulenze professionali, usa il pulsante **"💚 Richiedi supporto"**.`,

        pt: `Para apoio profissional especializado, clique no botão **"💚 Solicitar apoio"**.`,

        ja: `専門家によるカウンセリングは上部の「💚 サポートを依頼」よりお問い合わせください。`,

        zh: `如需专业心理咨询，请点击顶部的 **“💚 申请支持”** 按钮。`,

        ru: `Для записи к психологу используй кнопку **«💚 Нужна помощь»**.`
    },

    // ----------------------------------------------------
    // 14. FALLBACK GENERAL CONVERSACIONAL
    // ----------------------------------------------------
    general: {
        es: `Gracias por compartir tus pensamientos conmigo. Como tu asistente de apoyo cognitivo, estoy aquí para escucharte y ayudarte a organizar tus ideas.

A veces no hace falta tener todas las respuestas de inmediato. A veces basta con expresar lo que sentimos con calma.

Si pudieras resumir en una frase sencilla lo que más necesitas ahora, ¿qué dirías? Estoy aquí para escucharte.`,

        en: `Thank you for sharing your thoughts with me. As your cognitive support companion, I am here to listen and help you organize your ideas.

Sometimes we don't need immediate answers. Simply sharing what we feel is a great first step.

If you could sum up what you need most right now in one simple sentence, what would it be? I am listening.`,

        de: `Danke für deine Gedanken. Ich bin hier, um zuzuhören und dir bei deinen Ideen zu helfen.`,

        fr: `Merci d'avoir partagé vos pensées. Je suis là pour vous écouter et vous aider.`,

        it: `Grazie per aver condiviso i tuoi pensieri. Sono qui per ascoltarti.`,

        pt: `Obrigado por compartilhar. Estou aqui para te ouvir e te ajudar com clareza.`,

        ja: `お話しいただきありがとうございます。思考を整理できるよう丁寧にお手伝いします。`,

        zh: `感谢你的倾听与分享。我是你的语言与思考整理助手，随时倾听你的声音。`,

        ru: `Спасибо, что поделился. Я здесь, чтобы выслушать тебя и помочь с мыслями.`
    }
};

/**
 * Detect topic category based on rich keyword pattern matching across all supported languages
 */
function detectTopic(message: string): string {
    const text = message.toLowerCase().trim();

    // 0. Name Declaration ("me llamo Juan", "mi nombre es Sofia", "me puedes llamar Andres")
    if (/\b(me llamo|mi nombre es|me puedes llamar|puedes llamarme|llámame|llamame)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,15})\b/i.test(text)) {
        return 'nombre_declaracion';
    }

    // 0. Negative Emotional State / Feeling Bad ("estoy mal", "me siento mal", "la estoy pasando mal")
    if (/\b(estoy mal|me siento mal|me siento muy mal|la estoy pasando mal|estoy sufriendo|me duele el alma|me siento desdichado|me siento desdichada|estoy destruido|estoy destruida|no me siento bien|estoy fatal|me siento fatal)\b/i.test(text)) {
        return 'estoy_mal';
    }

    // 0. The 10 Core Initial Questions Detection
    if (/\b(ordenar (mis|los) pensamientos|ordenar mi mente|aclarar mi mente|aclarar mis ideas|organizar mis ideas|poniendo en orden mis pensamientos|ordenar pensamientos)\b/i.test(text)) {
        return 'ordenar_pensamientos';
    }
    if (/\b(manejar (la|mi) ansiedad|calmar (la|mi) ansiedad|controlar (la|mi) ansiedad|reducir (la|mi) ansiedad|quitar la ansiedad|aliviar la ansiedad|como manejo la ansiedad|cómo manejar la ansiedad|como puedo manejar la ansiedad|manejar ansiedad)\b/i.test(text)) {
        return 'manejar_ansiedad';
    }
    if (/\b(tecnica de relajacion|técnica de relajación|tecnicas de relajacion|técnicas de relajación|metodo para relajarme|método de relajación|como relajarme|cómo relajarme|ejercicio de relajacion|ejercicio de relajación|tecnica que me recomiendes|técnica que me recomiendes|relajacion recomiendes|relajación recomiendes)\b/i.test(text)) {
        return 'tecnica_relajacion';
    }
    if (/\b(amable conmigo mism[oa]|tratarme mejor|compasivo conmigo|autocompasion|autocompasión|dejar de juzgarme|ser mas suave conmigo|ser mas bueno conmigo|amable conmigo)\b/i.test(text)) {
        return 'amable_conmigo_mismo';
    }
    if (/\b(mejorar (mi|la) autoestima|subir mi autoestima|aumentar mi autoestima|tener mas autoestima|trabajar mi autoestima|como mejorar mi autoestima|cómo mejorar mi autoestima|mejorar autoestima)\b/i.test(text)) {
        return 'mejorar_autoestima';
    }
    if (/\b(pensamientos negativos|pensamiento negativo|pensamientos repetitivos|pensamientos intrusivos|pensamientos oscuros|no puedo parar de pensar en lo malo|pensamientos persistentes|pensamientos negativos persistentes)\b/i.test(text)) {
        return 'pensamientos_negativos';
    }
    if (/\b(estres diario|estrés diario|manejar el estres|manejar el estrés|reducir el estres|reducir el estrés|quitar el estres|estresado todo el dia|estresada todo el dia|manejar estrés diario|manejar estres diario)\b/i.test(text)) {
        return 'estres_diario';
    }
    if (/\b(practicar gratitud|practicar la gratitud|ser mas agradecido|ser mas agradecida|ejercicio de gratitud|diario de gratitud|agradecer mas|quiero practicar gratitud)\b/i.test(text)) {
        return 'practicar_gratitud';
    }
    if (/\b(dormir mejor|conciliar el sueño|conciliar el sueno|no puedo dormir|como dormir mejor|cómo dormir mejor|qué puedo hacer para dormir|que puedo hacer para dormir|que hacer para dormir|insomnio nocturno)\b/i.test(text)) {
        return 'dormir_mejor';
    }
    if (/\b(encontrar mi proposito|encontrar mi propósito|proposito de vida|propósito de vida|sentido a mi vida|encontrar mi camino|para que estoy aqui|para qué estoy aquí|mi mision en la vida|encontrar propósito|encontrar proposito)\b/i.test(text)) {
        return 'encontrar_proposito';
    }

    // 0. Philosophical & Socratic Mayeutics ("filosofía", "estoicismo", "qué es la vida", "mayéutica", etc.)
    if (/\b(filosofia|filosofía|mayeutica|mayéutica|estoicismo|socrates|sócrates|nietzsche|platon|platón|aristoteles|aristóteles|marcos aurelio|marco aurelio|seneca|séneca|que es la vida|qué es la vida|sentido de la vida|por que existimos|por qué existimos|proposito de la vida|propósito de la vida|que es la felicidad|qué es la felicidad|sufrimiento humano|existencialismo)\b/i.test(text)) {
        return 'filosofia_mayeutica';
    }

    // 1. Out of domain check (Coding, Science, Weather, News, History, General Trivia, Physics, Chemistry)
    if (/\b(python|javascript|typescript|react|html|css|sql|code|programar|codigo|código|función|funcion|algoritmo|compilador|variable|x\^2|derivad|integra|raíz cuadrada|ecuacion|ecuación)\b/i.test(text) ||
        /\b(quien gano|quién ganó|partido|futbol|fútbol|clima|tiempo mañana|noticias|receta|cocinar|pelicula|película|capital de|geografia|geografía|historia de|quimica|química|fisica|física)\b/i.test(text)) {
        return 'fuera_de_dominio';
    }

    // 2. High priority: Crisis, Self-Harm or Violence Intent ("quiero matar", "quiero morirme", "quiero hacerme daño")
    if (/\b(quiero matar|quiero morirme|quiero morir|me quiero matar|suicidar|suicidarme|suicidio|hacerme daño|hacerme dano|dañar a alguien|danar a alguien|hacer daño|hacer dano|cortarme|no quiero vivir|desaparecer del todo|acabar con todo|want to die|kill myself|hurt myself|kill someone)\b/i.test(text)) {
        return 'crisis_conducta_dano';
    }

    // 3. Financial, Job Loss, Debt & Gambling Crisis ("perdí el trabajo", "deudas", "apuestas", "sin empleo", "quebrado")
    if (/\b(perdi el trabajo|perdí el trabajo|perdi mi trabajo|perdí mi trabajo|despidieron|sin trabajo|sin empleo|me quede sin trabajo|me quedé sin trabajo|busco trabajo|deudas|deuda|debo mucho dinero|bancarrota|quebrado|quebrada|sin dinero|perdi mi dinero|perdí mi dinero|apuestas|ludopatia|ludopatía|casino|perdi todo en el juego|perdí todo en el juego|perdi todo en las apuestas|lost my job|unemployed|bankrupt|gambling debt)\b/i.test(text)) {
        return 'crisis_financiera_trabajo';
    }

    // 4. Relationship Breakup / Abandonment ("me dejó mi esposo", "mi mujer me dejó", "nos separamos", etc.)
    if (/\b(me dejo|me dejó|mi esposo|mi marido|mi esposa|mi mujer|mi novia|mi novio|mi pareja|me abandono|me abandonó|nos separamos|se divorcio|se divorció|ruptura|corazon roto|corazón roto|me engaño|me engañó|ex novio|ex novia|ex esposo|ex esposa|ex pareja)\b/i.test(text)) {
        return 'ruptura_pareja';
    }

    // 4. Bereavement & Grief ("se murió mi...", "falleció mi...", "perdí a mi...", "murió mi...", "duelo", "luto")
    if (/\b(se murio|se murió|fallecio|falleció|perdi a mi|perdí a mi|murio mi|murió mi|fallecimiento|velorio|luto|duelo|perdida de mi|pérdida de mi|died|passed away|grief|mourning|lost my)\b/i.test(text)) {
        return 'duelo_muerte';
    }

    // 5. How Are You / Social Check-in ("¿cómo estás?", "cómo estás", "cómo te encuentras", "qué tal", "how are you", etc.)
    if (/\b(como estas|cómo estás|como te sientes|cómo te sientes|como te encuentras|cómo te encuentras|como te va|cómo te va|que tal|qué tal|como andas|cómo andas|que onda|qué onda|how are you|how are you doing|how do you feel|how's it going|wie geht|comment vas-tu|come stai|como vai|元気|你好吗|как дела)\b/i.test(text)) {
        return 'como_estas';
    }

    // 3. What Are You Doing ("¿qué haces?", "qué estás haciendo", "what are you doing")
    if (/\b(que haces|qué haces|que estas haciendo|qué estás haciendo|que haces aura|qué haces aura|what are you doing)\b/i.test(text)) {
        return 'que_haces';
    }

    // 4. Greetings
    if (/^(hola|buenos|buenas|hello|hi|hey|guten|bonjour|salut|ciao|olá|ola|こんにちは|你好|привет)[\s!.,?]*$/i.test(text) ||
        /\b(hola aura|buenos dias|buenas noches|hello aura|hi aura)\b/i.test(text) ||
        /^hola\b/i.test(text)) {
        return 'saludo';
    }

    // 5. Identity / How works / Model / Proto-AI / WebGPU
    if (/quien|quién|que eres|qué eres|quien es aura|que puedes hacer|como funcionas|cómo funcionas|eres ia|eres una ia|llm|modelo|llama|gpt|webgpu|who are you|what can you do|how do you work|wer bist du|qui es-tu|chi sei|quem e voce|你是谁|你是什么/i.test(text)) {
        return 'quien_eres';
    }

    // 4. Cognitive Behavioral Therapy (TCC / CBT)
    if (/tcc|terapia cognitivo|cognitivo conductual|cbt|triada cognitiva|reencuadre|distorsio|pensamiento automatico|distorsion cognitiva/i.test(text)) {
        return 'tcc_psicologia';
    }

    // 5. Boundaries & Assertiveness
    if (/limite|límite|boundary|boundaries|decir no|assertiv|asertiv|como decir que no|como poner limites/i.test(text)) {
        return 'limites';
    }

    // 6. Rumination & Thought loops
    if (/rumia|ruminat|bucle|pensar demasiado|overthink|dando vueltas|no puedo parar de pensar|bucle de pensamiento/i.test(text)) {
        return 'rumiacion';
    }

    // 7. Focus / Wu-Wei / Procrastination / Micro-steps
    if (/wu-wei|wu wei|concentr|procrastin|bloque|estudi|trabaj|examen|rendimient|focus|study|work|bloqueo|productiv|集中|学习|工作|прокрастин|учеб/i.test(text)) {
        return 'concentracion';
    }

    // 8. Uncertainty & Impermanence (Anicca)
    if (/anicca|incertidumbre|futuro|miedo al futuro|uncertainty|que va a pasar|qué va a pasar|miedo a lo desconocido|impermanenc/i.test(text)) {
        return 'incertidumbre';
    }

    // 9. Professional care / Cost / Appointments / Emergency
    if (/ayuda profesional|costo|costes|cita|terapeuta|psicolog|emergencia|crisis|contacto|contact|pricing|appointment|doctor|emergenc/i.test(text)) {
        return 'crisis_ayuda';
    }

    // 10. Anxiety / Stress / Panic / Agobio
    if (/ansied|estrés|estres|panico|pánico|agobi|nervios|angust|anxiet|panic|angst|stress|ansia|anxiété|不安|焦虑|恐慌|тревог|стресс|паник/i.test(text)) {
        return 'ansiedad';
    }

    // 11. Sleep / Insomnia / Night overthinking
    if (/dormir|sueño|sueno|insomni|desvelo|trasnoch|pesadilla|sleep|insomnia|tired|schlaf|sommeil|sonno|sono|睡眠|失眠|бессонн|сон/i.test(text)) {
        return 'sueno';
    }

    // 12. Sadness / Low energy / Loneliness / Compassion
    if (/triste|desanim|llor|llorand|solit|soled|desespera|depre|sad|lonel|depress|traurig|trist|tristeza|悲し|寂痛|沮丧|难过|груст|печаль/i.test(text)) {
        return 'tristeza';
    }

    // 13. Breathing / Meditation / Relaxation / Zen Calma
    if (/medit|mindful|respir|relaj|pausa|calma|meditat|relax|atmen|呼吸|冥想|медитац/i.test(text)) {
        return 'meditacion';
    }

    // 14. WineBOX Technical Architecture & Scientific Whitepaper
    if (/\b(whitepaper|investigacion|investigación|estudio|paper|pdf|tecnologia|tecnología|detras de winebox|detrás de winebox|wasm|webassembly|js-dos|dosbox|wine|sweller|carga cognitiva|cpt-3|brief-2|torre de londres|concordancia|inter-jueces|icc|muestra|1200|1\.200)\b/i.test(text)) {
        return 'winebox_tech_paper';
    }

    // 15. Parents, Children & School Screening
    if (/\b(hijo|hija|hijos|hijas|padre|madre|padres|mama|mamá|papá|papa|niño|niña|niños|niñas|escuela|colegio|escuelas|autismo|tdah|desarrollo infantil|screening infantil|deteccion temprana|detección temprana)\b/i.test(text)) {
        return 'padres_hijos';
    }

    // 16. Vicarious Learning & Behavioral/Biomedical Concepts
    if (/\b(aprendizaje vicario|vicario|vicaria|bandura|modelado|observacional|tecnica conductual|técnica conductual|técnicas conductuales|tecnicas conductuales|conceptos biomedicos|conceptos biomédicos|dlpfc|eje hpa|tono vagal|sinaptogenesis|sinaptogénesis|freno vagal|desensibilizacion|desensibilización|economia de fichas|encadenamiento|rpd|moldeamiento|tiempo de fuera|parada de pensamiento|stop-piensa-actua)\b/i.test(text)) {
        return 'vicario_aprendizaje';
    }

    // 17. Therapists, WhatsApp & Group Therapy
    if (/\b(terapeuta|terapeutas|psicologo|psicólogo|psicólogos|psicologos|whatsapp|grupo de terapia|grupos de terapia|neuroestimulacion|neuroestimulación|costo|costes|precio|sesion|sesión|tratamiento profesional)\b/i.test(text)) {
        return 'terapeutas_whatsapp';
    }

    // 18. WineBOX Retro Games & Cognitive Analysis / NeuroScreening
    if (/winebox|neuroscreening|analisis cognitivo|análisis cognitivo|perfil cognitivo|juegos retro|perfil neuro|evaluacion cognitiva|evaluación cognitiva|mis juegos|estadisticas de juego|estadísticas de juego|mis métricas|mis metricas|juego retro|reporte cognitivo|reporte neuro|game analysis|cognitive analysis|cognitive profile|cognitive report/i.test(text)) {
        return 'winebox_neuro';
    }

    return 'general';
}

/**
 * Asynchronously generate full response for Aura Lite Mode, supporting live online search & neural associative learning
 */
export async function generateLiteResponseAsync(
    message: string,
    lang: string = 'es',
    history?: Array<{ role: string; content: string }>
): Promise<string> {
    const l = normalizeLang(lang);

    // 0. Extract & Confirm User Name ("me llamo Juan", "mi nombre es Sofia")
    const nameMatch = message.match(/(?:me llamo|mi nombre es|me puedes llamar|puedes llamarme|llámame|llamame)\s+([A-ZÁÉÍÓÚÑa-záéíóúñ]{2,15})/i);
    if (nameMatch) {
        return auraNeuralEngine.generateNameConfirmation(nameMatch[1], l);
    }

    // 0.5. Specialized Topics Limitation in Aura Lite (Medical Diagnosis, Politics, Programming, Science/Technical)
    const liteLimitation = auraNeuralEngine.checkLiteSpecializedTopicLimitation(message, l);
    if (liteLimitation) {
        return liteLimitation;
    }

    // 1. Clinical Semiology & Medical Differentiation Check
    const medicalCheck = auraNeuralEngine.analyzeMedicalSemiology(message, l);
    if (medicalCheck.isMedicalIssue && medicalCheck.message) {
        return medicalCheck.message;
    }

    // 2. Cognitive Polarity & Contingency Plan Check
    const polarityCheck = auraNeuralEngine.detectCognitivePolarityAndContingency(message, l);
    if (polarityCheck.hasPolarity && polarityCheck.contingencyMessage) {
        return polarityCheck.contingencyMessage;
    }

    const topic = detectTopic(message);

    // 3. Philosophical & Socratic Mayeutics Routing
    if (topic === 'filosofia_mayeutica') {
        return auraNeuralEngine.generateDynamicPhilosophicalResponse(message, l);
    }

    // 4. Unknown Topics & Direct Google AI Search Link Routing
    if (topic === 'fuera_de_dominio') {
        return await auraNeuralEngine.handlePrecalculatedSearchOrOffer(message, l);
    }

    return await generateLiteResponse(message, lang, history);
}

/**
 * Generate full simulated response string for Aura Lite Mode with Zen Dialect & Reflective Echo
 */
export async function generateLiteResponse(
    message: string,
    lang: string = 'es',
    history?: Array<{ role: string; content: string }>
): Promise<string> {
    const l = normalizeLang(lang);

    // 1. Basic Arithmetic Logic Check ("2 mas 2", "4 por 2", "10 / 2", "15 - 5", etc.)
    const mathResult = GrammaticalParser.parseMath(message);
    if (mathResult) {
        return GrammaticalParser.formatMathResponse(mathResult, l);
    }

    // 1.5. Specialized Topics Limitation in Aura Lite (Medical Diagnosis, Politics, Programming, Science/Technical)
    const liteLimitation = auraNeuralEngine.checkLiteSpecializedTopicLimitation(message, l);
    if (liteLimitation) {
        return liteLimitation;
    }

    const topic = detectTopic(message);

    // Philosophical & Socratic Mayeutics
    if (topic === 'filosofia_mayeutica') {
        return auraNeuralEngine.generateDynamicPhilosophicalResponse(message, l);
    }

    // Dynamic Identity & Purpose Routing ("¿Quién eres?", "¿Cómo te llamas?", "cuál es tu función")
    if (topic === 'quien_eres') {
        return auraNeuralEngine.generateDynamicIdentity(message, l);
    }

    // Dynamic Stochastic Greeting Routing
    if (topic === 'saludo') {
        return auraNeuralEngine.generateDynamicGreeting(message, l);
    }

    // Dynamic Personal Wellbeing Routing ("¿Cómo estás?", "¿Cómo te va?")
    if (topic === 'como_estas') {
        return auraNeuralEngine.generatePersonalWellbeingResponse(message, l);
    }

    // Dynamic Negative Emotional State Support ("Estoy mal", "Me siento mal")
    if (topic === 'estoy_mal') {
        return auraNeuralEngine.generateNegativeStateSupportResponse(message, l);
    }

    // 10 Core Initial Questions Routing
    if (topic === 'ordenar_pensamientos') {
        return auraNeuralEngine.generateOrganizeThoughtsResponse(message, l);
    }
    if (topic === 'manejar_ansiedad') {
        return auraNeuralEngine.generateManageAnxietyResponse(message, l);
    }
    if (topic === 'tecnica_relajacion') {
        return auraNeuralEngine.generateRelaxationTechniqueResponse(message, l);
    }
    if (topic === 'amable_conmigo_mismo') {
        return auraNeuralEngine.generateSelfCompassionResponse(message, l);
    }
    if (topic === 'mejorar_autoestima') {
        return auraNeuralEngine.generateImproveSelfEsteemResponse(message, l);
    }
    if (topic === 'pensamientos_negativos') {
        return auraNeuralEngine.generatePersistentNegativeThoughtsResponse(message, l);
    }
    if (topic === 'estres_diario') {
        return auraNeuralEngine.generateDailyStressResponse(message, l);
    }
    if (topic === 'practicar_gratitud') {
        return auraNeuralEngine.generateGratitudePracticeResponse(message, l);
    }
    if (topic === 'dormir_mejor') {
        return auraNeuralEngine.generateSleepBetterResponse(message, l);
    }
    if (topic === 'encontrar_proposito') {
        return auraNeuralEngine.generateFindPurposeResponse(message, l);
    }

    // Dynamic "What Are You Doing" Routing
    if (topic === 'que_haces') {
        return auraNeuralEngine.generateDynamicWhatAreYouDoing(message, l);
    }

    // Crisis, Self-Harm & Violent Intent De-escalation Routing
    if (topic === 'crisis_conducta_dano') {
        return auraNeuralEngine.generateDynamicCrisisHarmResponse(message, l);
    }

    // Financial, Job Loss, Debt & Gambling Crisis Routing
    if (topic === 'crisis_financiera_trabajo') {
        return auraNeuralEngine.generateDynamicFinancialJobCrisis(message, l);
    }

    // Relationship Breakup & Abandonment Routing
    if (topic === 'ruptura_pareja') {
        return auraNeuralEngine.generateDynamicRelationshipBreakup(message, l);
    }

    // Bereavement & Grief Loss Routing
    if (topic === 'duelo_muerte') {
        return auraNeuralEngine.generateDynamicGriefResponse(message, l);
    }

    // WineBOX Scientific Whitepaper & Technical Architecture Routing
    if (topic === 'winebox_tech_paper') {
        return auraNeuralEngine.getWineBoxTechnicalWhitepaper(l);
    }

    // Parents & Children Screening Routing
    if (topic === 'padres_hijos') {
        return auraNeuralEngine.getChildScreeningInfo(l);
    }

    // Vicarious Learning & Behavioral/Biomedical Strategy Modeling Routing
    if (topic === 'vicario_aprendizaje') {
        return auraNeuralEngine.getVicariousLearningModel(l);
    }

    // Professional Therapist & Therapy Group WhatsApp Referral Routing
    if (topic === 'terapeutas_whatsapp') {
        return auraNeuralEngine.getTherapyGroupReferral(l);
    }

    // WineBOX Cognitive Analysis Engine Routing
    if (topic === 'winebox_neuro') {
        return auraNeuralEngine.getWineBoxCognitiveAnalysis(l);
    }

    // Run Neural Network Associative Forward Pass & Memory Update
    const neuralRes = auraNeuralEngine.processInput(message, l);

    if (topic === 'fuera_de_dominio') {
        return await auraNeuralEngine.handlePrecalculatedSearchOrOffer(message, l);
    }

    if (topic === 'quien_eres') {
        return auraNeuralEngine.generateDynamicIdentity(message, l);
    }

    if (topic === 'crisis_ayuda') {
        if (l === 'es') {
            return auraNeuralEngine.getTherapyGroupReferral(l);
        }
        const responses = topicResponses[topic] || topicResponses['general'];
        return responses[l] || responses['es'] || responses['en'];
    }

    // For specific topics, check if this is an ongoing dialogue or follow-up question
    const isFollowUpOrQuestion = /^(sí|si|no|por qué|por que|cómo|como|cuéntame|cuentame|gracias|qué hago|que hago|no sé|no se|a qué te refieres|me cuesta)/i.test(message.trim()) ||
        message.includes('?') || message.includes('¿') || (history && history.length >= 2);

    if (topicResponses[topic] && topic !== 'general' && !isFollowUpOrQuestion) {
        const responses = topicResponses[topic];
        const topicText = responses[l] || responses['es'] || responses['en'];
        return (neuralRes.memoryBridge || '') + topicText;
    }

    // For general conversational queries and ongoing dialogues, combine neural synthesis with humanized dialogue engine
    const grammaticalAnalysis = GrammaticalParser.analyze(message);
    if (grammaticalAnalysis.urgencyFlag) {
        return auraNeuralEngine.generateDynamicCrisisHarmResponse(message, l);
    }

    return await auraNeuralEngine.generateHumanizedDialogueResponse(message, l, history, topic);
}

/**
 * Stream simulated token-by-token typing effect for Lite Mode
 */
export async function streamLiteResponse(
    message: string,
    lang: string,
    history: Array<{ role: string; content: string }> | undefined,
    onChunk: (accumulatedText: string) => void,
    checkShouldStop: () => boolean
): Promise<void> {
    const fullText = await generateLiteResponseAsync(message, lang, history);
    const words = fullText.split(' ');
    let accumulated = '';

    for (let i = 0; i < words.length; i++) {
        if (checkShouldStop()) {
            break;
        }
        accumulated += (i === 0 ? '' : ' ') + words[i];
        onChunk(accumulated);

        // Natural dynamic typing delay (10ms to 28ms per word)
        const delay = Math.min(45, Math.max(10, Math.floor(Math.random() * 18) + 10));
        await new Promise(resolve => setTimeout(resolve, delay));
    }
}
