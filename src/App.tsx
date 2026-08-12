import { sendPrompt, stopGeneration, clearChatHistory } from "./LLM.ts";
import { useEffect, useState, useRef, useMemo } from "react";
import { useTypedDispatch, useTypedSelector } from "./redux/store.ts";
import {
    AppBar,
    Box,
    Button,
    Container,
    CssBaseline,
    IconButton,
    Paper,
    ThemeProvider,
    Toolbar,
    Typography,
    createTheme,
    Chip,
    Fade,
    Zoom,
    Fab,
    Tooltip,
    List,
    ListItem,
    DialogTitle,
    DialogContent,
    DialogActions,
    DialogContentText,
    Badge,
    Divider,
    MenuItem,
    Dialog as MuiDialog,
    Menu as MuiMenu,
    Drawer as MuiDrawer,
    TextField as MuiTextField
} from "@mui/material";

const Dialog = MuiDialog as any;
const Menu = MuiMenu as any;
const Drawer = MuiDrawer as any;
const TextField = MuiTextField as any;
import {
    Send,
    Psychology,
    EmojiEmotions,
    Lightbulb,
    Favorite,
    Spa,
    SelfImprovement,
    CheckCircle,
    WbSunny,
    FitnessCenter,
    MenuBook,
    AutoAwesome,
    Chat,
    Add,
    History,
    Delete,
    Close,
    Visibility,
    CloudUpload,
    WhatsApp,
    Group,
    Diamond,
    Stars,
    Forest,
    AutoStories,
    Translate,
    Warning,
    Stop,
    ContentCopy,
    Check,
    OpenInNew,
    Launch
} from "@mui/icons-material";
import Markdown from "react-markdown";
import { setCriticalError, setIsLiteMode } from "./redux/llmSlice.ts";
import { isWebGPUok } from "./CheckWebGPU.ts";
import { NeuralNetworkModal } from "./components/NeuralNetworkModal.tsx";

// ============================================================
// SYSTEM OF TRANSLATIONS (ALL 9 LANGUAGES SUPPORTED)
// ============================================================
const translations: Record<string, any> = {
    es: {
        app_name: "Aura 🌿",
        online: "En línea",
        loading: "Cargando...",
        ready: "Listo",
        new_chat: "Nuevo chat",
        chat_history: "Conversaciones guardadas",
        no_history: "No hay conversaciones guardadas",
        auto_save: "Las conversaciones se guardan automáticamente",
        delete_all: "Eliminar todo el historial",
        delete_all_confirm: "¿Eliminar todas las conversaciones guardadas?",
        delete_all_title: "Eliminar todo el historial",
        delete_all_message: "Esta acción eliminará permanentemente todas las conversaciones guardadas. ¿Estás seguro?",
        no_messages: "Sin mensajes",
        view_conversation: "Ver conversación completa",
        delete_conversation: "Eliminar conversación",
        delete_confirm_single: "¿Estás seguro de que quieres eliminar esta conversación?",
        delete_single_title: "Eliminar conversación",
        delete_single_message: "Esta acción no se puede deshacer. ¿Quieres continuar?",
        cancel: "Cancelar",
        delete: "Eliminar",
        close: "Cerrar",
        send: "Enviar",
        welcome_title: "👋 ¡Hola! Soy **Aura**.",
        welcome_text: "Estoy aquí para escucharte y ayudarte con mucha calidez y empatía. Puedes hacerme cualquier pregunta, contarme cómo te sientes o consultar sobre tus hijos, la escuela, el manejo del estrés o la tecnología WineBOX.\n\n**Escribe tu pregunta o mensaje en la barra inferior para comenzar:** 💬",
        quick_questions_title: "🌱 O ELIGE UNA PREGUNTA FRECUENTE:",
        input_placeholder_empty: "Escribe tu mensaje o pregunta aquí...",
        input_placeholder: "Escribe tu mensaje...",
        footer: "🌿 Espacio seguro · Todo queda entre tú y Aura",
        q1: "¿Cómo puedo manejar la ansiedad?",
        q2: "Necesito ordenar mis pensamientos",
        q3: "¿Qué técnica de relajación me recomiendas?",
        q4: "Ayúdame a ser más amable conmigo mismo",
        q5: "¿Cómo mejorar mi autoestima?",
        q6: "Tengo pensamientos negativos persistentes",
        q7: "¿Cómo manejar el estrés diario?",
        q8: "Quiero practicar la gratitud",
        q9: "¿Qué puedo hacer para dormir mejor?",
        q10: "Ayúdame a encontrar mi propósito",
        warning_title: "⚠️ Aviso Importante",
        warning_subtitle: "Acompañamiento Cognitivo",
        warning_text: "Esta inteligencia artificial, **Aura**, es una herramienta interactiva diseñada exclusivamente para el acompañamiento, orientación inicial y apoyo psicoeducativo.",
        warning_no_diagnosis: "No emite diagnósticos médicos, recetas ni tratamientos.",
        warning_no_replace: "No reemplaza la consulta, evaluación o terapia con su profesional de la salud o neuropediatra.",
        warning_emergency: "Si experimentas una crisis o emergencia médica, **acude inmediatamente** al centro de salud más cercano o comunícate con las líneas de urgencia de tu país.",
        warning_accept: "Al utilizar esta herramienta, aceptas que su uso es bajo tu propia responsabilidad.",
        warning_btn: "Acepto y entiendo",
        commercial_title: "🌱 Comienza tu viaje de crecimiento cognitivo",
        commercial_subtitle: "Acompañamiento profesional para tu desarrollo",
        commercial_benefit1_title: "🌟 Acompañamiento profesional personalizado",
        commercial_benefit1_desc: "Sesiones coordinadas por neuropsicólogo con enfoque en tu desarrollo único.",
        commercial_benefit2_title: "🤝 Grupos de apoyo y crecimiento",
        commercial_benefit2_desc: "Conecta con otras personas en un espacio de confianza y aprendizaje compartido.",
        commercial_benefit3_title: "🧠 Herramientas de neuroestimulación",
        commercial_benefit3_desc: "Juegos, actividades y ejercicios diseñados para potenciar tu desarrollo cognitivo.",
        commercial_benefit4_title: "🌿 Sesiones grupales e individuales",
        commercial_benefit4_desc: "4 encuentros mensuales por video llamada + soporte en grupo de WhatsApp.",
        commercial_benefit5_title: "💎 Inversión accesible",
        commercial_benefit5_desc: "$40 USD/mes o $11 USD por sesión individual.",
        commercial_btn: "🚀 Empezar mi viaje ahora",
        commercial_footer: "🌱 Tu viaje de autoconocimiento comienza aquí",
        commercial_close: "Volver a la experiencia Aura",
        gpu_title: "⚙️ Actualización Técnica Requerida",
        gpu_text: "Tu dispositivo requiere una actualización técnica para activar el asistente virtual.\n\nPara proteger la privacidad y velocidad de tus datos, esta IA se procesa directamente en tu dispositivo, lo cual requiere tecnología gráfica reciente **(WebGPU)**.\n\n¡No te preocupes! Tu atención es lo más importante.",
        gpu_contact: "Si estás buscando acompañamiento profesional para ti o tu familia, podemos ayudarte.",
        gpu_btn_contact: "📅 Solicitar atención profesional",
        gpu_btn_retry: "Reintentar",
        lite_title: "⚡ Iniciar Aura Lite (Acompañante)",
        lite_badge: "Modo Lite 🌿",
        gpu_lite_desc: "💡 ¿Tu dispositivo no posee WebGL/WebGPU o recursos gráficos suficientes para la IA local? No te preocupes. Hemos preparado Aura Lite para que puedas chatear y recibir acompañamiento cognitivo y consejos prácticos de forma instantánea sin requerir aceleración por hardware.",
        btn_attention: "💚 Solicitar atención",
        sessions_count: "conversaciones guardadas",
        btn_stop: "Detener AI 🛑",
        btn_home: "Inicio 🏠",
        tooltip_stop: "Frenar la generación de la IA",
        tooltip_home: "Ir al inicio sin reiniciar la IA",
        loading_phrases: [
            '🧠 Despertando neuronas...',
            '🌿 Creando tu espacio de bienestar...',
            '💭 Preparando la conexión...',
            '✨ Un momento de calma...',
            '🌸 Cargando sabiduría interior...',
            '🌙 Sintonizando contigo...',
            '💫 A punto de empezar...',
            '🌟 Todo listo para ti...'
        ]
    },
    en: {
        app_name: "Aura 🌿",
        online: "Online",
        loading: "Loading...",
        ready: "Ready",
        new_chat: "New chat",
        chat_history: "Saved conversations",
        no_history: "No saved conversations",
        auto_save: "Conversations are saved automatically",
        delete_all: "Delete all history",
        delete_all_confirm: "Delete all saved conversations?",
        delete_all_title: "Delete all history",
        delete_all_message: "This will permanently delete all saved conversations. Are you sure?",
        no_messages: "No messages",
        view_conversation: "View full conversation",
        delete_conversation: "Delete conversation",
        delete_confirm_single: "Are you sure you want to delete this conversation?",
        delete_single_title: "Delete conversation",
        delete_single_message: "This action cannot be undone. Do you want to continue?",
        cancel: "Cancel",
        delete: "Delete",
        close: "Close",
        send: "Send",
        welcome_title: "👋 Hello! I'm **Aura**, your cognitive wellness companion.",
        welcome_text: "I'm here to listen and help you explore your thoughts, emotions, and mental patterns. I'm not a psychologist, but a travel companion on your self-discovery journey.\n\nEverything you share stays between you and me. You can write to me about what you feel, think, or simply what you need to express.\n\n**Where would you like to start?** 🌿",
        quick_questions_title: "🌱 CHOOSE A QUESTION TO START",
        input_placeholder_empty: "Write your message or choose a question...",
        input_placeholder: "Write your message...",
        footer: "🌿 Safe space · Everything stays between you and Aura",
        q1: "How can I manage anxiety?",
        q2: "I need to organize my thoughts",
        q3: "What relaxation technique do you recommend?",
        q4: "Help me be kinder to myself",
        q5: "How can I improve my self-esteem?",
        q6: "I have persistent negative thoughts",
        q7: "How to manage daily stress?",
        q8: "I want to practice gratitude",
        q9: "What can I do to sleep better?",
        q10: "Help me find my purpose",
        warning_title: "⚠️ Important Notice",
        warning_subtitle: "Cognitive Companion",
        warning_text: "This artificial intelligence, **Aura**, is an interactive tool designed exclusively for accompaniment, initial orientation and psychoeducational support.",
        warning_no_diagnosis: "Does not issue medical diagnoses, prescriptions or treatments.",
        warning_no_replace: "Does not replace consultation, evaluation or therapy with your health professional or neuropediatrician.",
        warning_emergency: "If you are experiencing a crisis or medical emergency, **seek immediate care** at the nearest health center or contact your country's emergency lines.",
        warning_accept: "By using this tool, you accept that its use is at your own risk.",
        warning_btn: "I accept and understand",
        commercial_title: "🌱 Begin your journey of cognitive growth",
        commercial_subtitle: "Professional accompaniment for your development",
        commercial_benefit1_title: "🌟 Personalized professional support",
        commercial_benefit1_desc: "Sessions coordinated by neuropsychologist with focus on your unique development.",
        commercial_benefit2_title: "🤝 Support and growth groups",
        commercial_benefit2_desc: "Connect with others in a safe space of trust and shared learning.",
        commercial_benefit3_title: "🧠 Neurostimulation tools",
        commercial_benefit3_desc: "Games, activities and exercises designed to enhance your cognitive development.",
        commercial_benefit4_title: "🌿 Group and individual sessions",
        commercial_benefit4_desc: "4 monthly meetings via video call + WhatsApp support group.",
        commercial_benefit5_title: "💎 Accessible investment",
        commercial_benefit5_desc: "$40 USD/month or $11 USD per individual session.",
        commercial_btn: "🚀 Start my journey now",
        commercial_footer: "🌱 Your self-discovery journey begins here",
        commercial_close: "Go back to Aura experience",
        gpu_title: "⚙️ Technical Update Required",
        gpu_text: "Your device requires a technical update to activate the virtual assistant.\n\nTo protect the privacy and speed of your data, this AI is processed directly on your device, which requires recent graphics technology **(WebGPU)**.\n\nDon't worry! Your wellness is the most important thing.",
        gpu_contact: "If you are looking for professional accompaniment for yourself or your family, we can help.",
        gpu_btn_contact: "📅 Request professional support",
        gpu_btn_retry: "Retry",
        lite_title: "⚡ Launch Aura Lite (Companion)",
        lite_badge: "Lite Mode 🌿",
        gpu_lite_desc: "💡 Lacking WebGL/WebGPU hardware acceleration or graphic resources? No problem! Aura Lite allows you to chat and receive instant cognitive companion support and practical advice without heavy system requirements.",
        btn_attention: "💚 Support request",
        sessions_count: "saved conversations",
        btn_stop: "Stop AI 🛑",
        btn_home: "Home 🏠",
        tooltip_stop: "Frenar la generación de la IA",
        tooltip_home: "Go to welcome screen without resetting AI",
        loading_phrases: [
            '🧠 Waking up neurons...',
            '🌿 Creating your wellness space...',
            '💭 Preparing the connection...',
            '✨ A moment of calm...',
            '🌸 Loading inner wisdom...',
            '🌙 Tuning in with you...',
            '💫 About to start...',
            '🌟 All ready for you...'
        ]
    },
    de: {
        app_name: "Aura 🌿",
        online: "Online",
        loading: "Laden...",
        ready: "Bereit",
        new_chat: "Neuer Chat",
        chat_history: "Gespeicherte Unterhaltungen",
        no_history: "Keine gespeicherten Unterhaltungen",
        auto_save: "Unterhaltungen werden automatisch gespeichert",
        delete_all: "Gesamten Verlauf löschen",
        delete_all_confirm: "Alle gespeicherten Unterhaltungen löschen?",
        delete_all_title: "Gesamten Verlauf löschen",
        delete_all_message: "Dies löscht dauerhaft alle gespeicherten Unterhaltungen. Bist du sicher?",
        no_messages: "Keine Nachrichten",
        view_conversation: "Vollständige Unterhaltung anzeigen",
        delete_conversation: "Unterhaltung löschen",
        delete_confirm_single: "Möchten Sie diese Unterhaltung wirklich löschen?",
        delete_single_title: "Unterhaltung löschen",
        delete_single_message: "Diese Aktion kann nicht rückgängig gemacht werden. Möchten Sie fortfahren?",
        cancel: "Abbrechen",
        delete: "Löschen",
        close: "Schließen",
        send: "Senden",
        welcome_title: "👋 Hallo! Ich bin **Aura**, deine Begleiterin für kognitives Wohlbefinden.",
        welcome_text: "Ich bin hier, um dir zuzuhören und dir zu helfen, deine Gedanken, Emotionen und mentalen Muster zu erforschen. Ich bin kein Psychologe, sondern ein Reisebegleiter auf deiner Reise der Selbstentdeckung.\n\nAlles, was du teilst, bleibt zwischen dir und mir. Du kannst mir schreiben, was du fühlst, denkst oder einfach ausdrücken möchtest.\n\n**Wo möchtest du anfangen?** 🌿",
        quick_questions_title: "🌱 WÄHLE EINE FRAGE ZUM START",
        input_placeholder_empty: "Schreibe deine Nachricht oder wähle eine Frage...",
        input_placeholder: "Schreibe deine Nachricht...",
        footer: "🌿 Sicherer Raum · Alles bleibt zwischen dir und Aura",
        q1: "Wie kann ich Angst bewältigen?",
        q2: "Ich muss meine Gedanken ordnen",
        q3: "Welche Entspannungstechnik empfiehlst du?",
        q4: "Hilf mir, freundlicher zu mir selbst zu sein",
        q5: "Wie kann ich mein Selbstwertgefühl verbessern?",
        q6: "Ich habe anhaltende negative Gedanken",
        q7: "Wie kann ich täglichen Stress bewältigen?",
        q8: "Ich möchte Dankbarkeit praktizieren",
        q9: "Was kann ich tun, um besser zu schlafen?",
        q10: "Hilf mir, meinen Lebenszweף zu finden",
        warning_title: "⚠️ Wichtiger Hinweis",
        warning_subtitle: "Kognitive Begleitung",
        warning_text: "Diese künstliche Intelligenz, **Aura**, ist ein interaktives Werkzeug, das ausschließlich für Begleitung, Erstorientierung und psychoedukative Unterstützung entwickelt wurde.",
        warning_no_diagnosis: "Stellt keine medizinischen Diagnosen, Rezepte oder Behandlungen aus.",
        warning_no_replace: "Ersetzt nicht die Konsultation, Bewertung oder Therapie mit Ihrem Arzt oder Neuropädiater.",
        warning_emergency: "Wenn Sie eine Krise oder einen medizinischen Notfall erleben, **suchen Sie sofort** das nächste Gesundheitszentrum auf oder kontaktieren Sie die Notrufnummern Ihres Landes.",
        warning_accept: "Durch die Nutzung dieses Tools akzeptieren Sie, dass die Nutzung auf Ihr eigenes Risiko erfolgt.",
        warning_btn: "Ich akzeptiere und verstehe",
        commercial_title: "🌱 Beginnen Sie Ihre kognitive Wachstumsreise",
        commercial_subtitle: "Professionelle Begleitung für Ihre Entwicklung",
        commercial_benefit1_title: "🌟 Personalisierte professionelle Unterstützung",
        commercial_benefit1_desc: "Von Neuropsychologen koordinierte Sitzungen mit Fokus auf Ihre Entwicklung.",
        commercial_benefit2_title: "🤝 Unterstützungs- und Wachstumsgruppen",
        commercial_benefit2_desc: "Verbinden Sie sich in einem geschützten Raum des Vertrauens mit anderen.",
        commercial_btn: "🚀 Jetzt Reise beginnen",
        commercial_close: "Zurück zur Aura-Erfahrung",
        gpu_title: "⚙️ Technische Aktualisierung Erforderlich",
        gpu_text: "Ihr Gerät erfordert eine Aktualisierung, um den virtuellen Assistenten zu aktivieren.\n\nUm die Privatsphäre zu schützen, läuft diese KI lokal auf Ihrem Gerät (WebGPU).",
        gpu_btn_retry: "Wiederholen",
        lite_title: "⚡ Aura Lite starten (Begleiter)",
        lite_badge: "Lite-Modus 🌿",
        gpu_lite_desc: "💡 Fehlt Ihrem Gerät die WebGL/WebGPU-Hardwarebeschleunigung? Kein Problem! Mit Aura Lite erhalten Sie sofort kognitive Begleitung und praktische Ratschläge ohne hohe Hardwareanforderungen.",
        btn_attention: "💚 Hilfe anfordern",
        sessions_count: "gespeicherte Chats",
        btn_stop: "AI stoppen 🛑",
        btn_home: "Home 🏠",
        tooltip_stop: "AI-Generierung stoppen",
        tooltip_home: "Zum Startbildschirm wechseln, ohne AI zurückzusetzen",
        loading_phrases: [
            '🧠 Neuronen werden geweckt...',
            '🌿 Wohlfühlraum wird erstellt...',
            '💭 Verbindung wird vorbereitet...',
            '✨ Moment der Ruhe...'
        ]
    },
    fr: {
        app_name: "Aura 🌿",
        online: "En ligne",
        loading: "Chargement...",
        ready: "Prêt",
        new_chat: "Nouveau chat",
        chat_history: "Conversations sauvegardées",
        no_history: "Aucune conversation sauvegardée",
        auto_save: "Les conversations sont sauvegardées automatiquement",
        delete_all: "Supprimer tout l'historique",
        delete_all_confirm: "Supprimer toutes les conversations sauvegardées ?",
        delete_all_title: "Supprimer tout l'historique",
        delete_all_message: "Cela supprimera définitivement toutes les conversations sauvegardées. Êtes-vous sûr ?",
        no_messages: "Aucun message",
        view_conversation: "Voir la conversation complète",
        delete_conversation: "Supprimer la conversation",
        delete_confirm_single: "Êtes-vous sûr de vouloir supprimer cette conversation ?",
        delete_single_title: "Supprimer la conversation",
        delete_single_message: "Cette action ne peut pas être annulée. Voulez-vous continuer ?",
        cancel: "Annuler",
        delete: "Supprimer",
        close: "Fermer",
        send: "Envoyer",
        welcome_title: "👋 Bonjour ! Je suis **Aura**, ton accompagnatrice en bien-être cognitif.",
        welcome_text: "Je suis là pour t'écouter et t'aider à explorer tes pensées, émotions et schémas mentaux. Je ne suis pas psychologue, mais une compagne de voyage dans ton processus de connaissance de soi.\n\nTout ce que tu partages reste entre toi et moi. Tu peux m'écrire sur ce que tu ressens, penses ou simplement ce que tu as besoin d'exprimer.\n\n**Par où veux-tu commencer ?** 🌿",
        quick_questions_title: "🌱 CHOISIS UNE QUESTION POUR COMMENCER",
        input_placeholder_empty: "Écris ton message ou choisis une question...",
        input_placeholder: "Écris ton message...",
        footer: "🌿 Espace sécurisé · Tout reste entre toi et Aura",
        q1: "Comment puis-je gérer l'anxiété ?",
        q2: "J'ai besoin d'organiser mes pensées",
        q3: "Quelle technique de relaxation me recommandes-tu ?",
        q4: "Aide-moi à être plus gentil avec moi-même",
        q5: "Comment puis-je améliorer mon estime de soi ?",
        q6: "J'ai des pensées négatives persistantes",
        q7: "Comment gérer le stress quotidien ?",
        q8: "Je veux pratiquer la gratitude",
        q9: "Que puis-je faire pour mieux dormir ?",
        q10: "Aide-moi à trouver mon but",
        warning_title: "⚠️ Avis Important",
        warning_subtitle: "Accompagnement Cognitif",
        warning_text: "Cette intelligence artificielle, **Aura**, est un outil interactif conçu exclusivement pour l'accompagnement, l'orientation initiale et le soutien psychoéducatif.",
        warning_no_diagnosis: "N'émet pas de diagnostics médicaux, d'ordonnances ou de traitements.",
        warning_no_replace: "Ne remplace pas la consultation, l'évaluation ou la thérapie avec votre professionnel de santé ou neuropédiatre.",
        warning_emergency: "Si vous vivez une crisis ou une urgence médicale, **rendez-vous immédiatement** dans un centre de santé ou contactez les lignes d'urgence de votre pays.",
        warning_accept: "En utilisant cet outil, vous acceptez que son utilisation se fasse à vos propres risques.",
        warning_btn: "J'accepte et je comprends",
        commercial_title: "🌱 Commencez votre voyage de croissance cognitive",
        commercial_subtitle: "Accompagnement professionnel pour votre développement",
        commercial_btn: "🚀 Commencer mon voyage maintenant",
        commercial_close: "Retourner à l'expérience Aura",
        gpu_title: "⚙️ Mise à Jour Technique Requise",
        gpu_text: "Votre appareil nécessite une mise à jour pour activer l'assistant virtuel (WebGPU).",
        gpu_btn_retry: "Réessayer",
        lite_title: "⚡ Lancer Aura Lite (Compagnon)",
        lite_badge: "Mode Lite 🌿",
        gpu_lite_desc: "💡 Votre appareil manque d'accélération matérielle WebGL/WebGPU ? Pas de problème ! Aura Lite vous offre un accompagnement cognitif instantané et des conseils pratiques sans prérequis matériel élevé.",
        btn_attention: "💚 Demander de l'aide",
        sessions_count: "conversations enregistrées",
        btn_stop: "Arrêter AI 🛑",
        btn_home: "Accueil 🏠",
        tooltip_stop: "Arrêter le traitement de l'AI",
        tooltip_home: "Retourner à l'accueil sans réinitialiser l'AI",
        loading_phrases: [
            '🧠 Réveil des neurones...',
            '🌿 Création de ton espace...',
            '💭 Préparation de la connexion...'
        ]
    },
    it: {
        app_name: "Aura 🌿",
        online: "Online",
        loading: "Caricamento...",
        ready: "Pronto",
        new_chat: "Nuova chat",
        chat_history: "Conversazioni salvate",
        no_history: "Nessuna conversazione salvata",
        auto_save: "Le conversazioni vengono salvate automaticamente",
        delete_all: "Elimina tutta la cronologia",
        delete_all_confirm: "Eliminare tutte le conversazioni salvate?",
        delete_all_title: "Elimina tutta la cronologia",
        delete_all_message: "Questa azione eliminerà permanentemente tutte le conversazioni salvate. Sei sicuro?",
        no_messages: "Nessun messaggio",
        view_conversation: "Visualizza conversazione completa",
        delete_conversation: "Elimina conversazione",
        delete_confirm_single: "Sei sicuro di voler eliminare questa conversazione?",
        delete_single_title: "Elimina conversazione",
        delete_single_message: "Questa azione non può essere annullata. Vuoi continuare?",
        cancel: "Annulla",
        delete: "Elimina",
        close: "Chiudi",
        send: "Invia",
        welcome_title: "👋 Ciao! Sono **Aura**, la tua compagna di benessere cognitivo.",
        welcome_text: "Sono qui per ascoltarti e aiutarti a esplorare i tuoi pensieri, emozioni e schemi mentali. Non sono uno psicologo, ma un compagno di viaggio nel tuo processo di conoscenza di sé.\n\nTutto ciò che condividi rimane tra te e me. Puoi scrivermi quello che provi, pensi o semplicemente quello che hai bisogno di esprimere.\n\n**Da dove vuoi iniziare?** 🌿",
        quick_questions_title: "🌱 SCEGLI UNA DOMANDA PER INIZIARE",
        input_placeholder_empty: "Scrivi il tuo messaggio o scegli una domanda...",
        input_placeholder: "Scrivi il tuo messaggio...",
        footer: "🌿 Spazio sicuro · Tutto rimane tra te e Aura",
        q1: "Come posso gestire l'ansia?",
        q2: "Ho bisogno di ordinare i miei pensieri",
        q3: "Quale tecnica di rilassamento mi consigli?",
        q4: "Aiutami a essere più gentile con me stesso",
        q5: "Come posso migliorare la mia autostima?",
        q6: "Ho pensieri negativi persistenti",
        q7: "Come gestire lo stress quotidiano?",
        q8: "Voglio praticare la gratitudine",
        q9: "Cosa posso fare per dormire meglio?",
        q10: "Aiutami a trovare il mio scopo",
        warning_title: "⚠️ Avviso Importante",
        warning_subtitle: "Accompagnamento Cognitivo",
        warning_text: "Questa intelligenza artificiale, **Aura**, è uno strumento interattivo progettato esclusivamente per l'accompagnamento, l'orientamento iniziale e il supporto psicoeducativo.",
        warning_no_diagnosis: "Non emette diagnosi mediche, prescrizioni o trattamenti.",
        warning_no_replace: "Non sostituisce la consultazione, la valutazione o la terapia con il proprio medico o neuropediatra.",
        warning_emergency: "Se stai vivendo una crisi o un'emergenza medica, **recati immediatamente** al centro sanitario più vicino o contatta i numeri di emergenza del tuo paese.",
        warning_accept: "Utilizzando questo strumento, accetti che il suo utilizzo sia a tuo rischio e pericolo.",
        warning_btn: "Accetto e capisco",
        commercial_title: "🌱 Inizia il tuo viaggio di crescita cognitiva",
        commercial_subtitle: "Accompagnamento professionale per il tuo sviluppo",
        commercial_btn: "🚀 Inizia il mio viaggio ora",
        commercial_close: "Torna all'esperienza Aura",
        gpu_title: "⚙️ Aggiornamento Tecnico Richiesto",
        gpu_text: "Il tuo dispositivo richiede un aggiornamento per attivare l'assistente virtuale (WebGPU).",
        gpu_btn_retry: "Riprova",
        lite_title: "⚡ Avvia Aura Lite (Compagno)",
        lite_badge: "Modalità Lite 🌿",
        gpu_lite_desc: "💡 Il tuo dispositivo non supporta l'accelerazione WebGL/WebGPU? Nessun problema! Con Aura Lite ottieni supporto cognitivo istantaneo e consigli pratici senza requisiti hardware elevati.",
        btn_attention: "💚 Richiedi supporto",
        sessions_count: "conversazioni salvate",
        btn_stop: "Ferma AI 🛑",
        btn_home: "Home 🏠",
        tooltip_stop: "Fermare la generazione della risposta",
        tooltip_home: "Torna alla schermata iniziale senza riavviare l'IA",
        loading_phrases: [
            '🧠 Risvegliando i neuroni...',
            '🌿 Creando il tuo spazio...',
            '💭 Preparando la connessione...'
        ]
    },
    pt: {
        app_name: "Aura 🌿",
        online: "Online",
        loading: "Carregando...",
        ready: "Pronto",
        new_chat: "Novo chat",
        chat_history: "Conversas salvas",
        no_history: "Nenhuma conversa salva",
        auto_save: "As conversas são salvas automaticamente",
        delete_all: "Excluir todo o histórico",
        delete_all_confirm: "Excluir todas as conversas salvas?",
        delete_all_title: "Excluir todo o histórico",
        delete_all_message: "Isso excluirá permanentemente todas as conversas salvas. Tem certeza?",
        no_messages: "Sem mensagens",
        view_conversation: "Ver conversa completa",
        delete_conversation: "Excluir conversa",
        delete_confirm_single: "Tem certeza de que deseja excluir esta conversa?",
        delete_single_title: "Excluir conversa",
        delete_single_message: "Esta ação não pode ser desfeita. Deseja continuar?",
        cancel: "Cancelar",
        delete: "Excluir",
        close: "Fechar",
        send: "Enviar",
        welcome_title: "👋 Olá! Sou **Aura**, sua acompanhante de bem-estar cognitivo.",
        welcome_text: "Estou aqui para ouvir e ajudar você a explorar seus pensamentos, emoções e padrões mentais. Não sou psicóloga, mas uma companheira de viagem em seu processo de autoconhecimento.\n\nTudo o que você compartilhar fica entre você e eu. Pode me escrever sobre o que sente, pensa ou simplesmente o que precisa expressar.\n\n**Por onde você quer começar?** 🌿",
        quick_questions_title: "🌱 ESCOLHA UMA PERGUNTA PARA COMEÇAR",
        input_placeholder_empty: "Escreva sua mensagem ou escolha uma pergunta...",
        input_placeholder: "Escreva sua mensagem...",
        footer: "🌿 Espaço seguro · Tudo fica entre você e Aura",
        q1: "Como posso lidar com a ansiedade?",
        q2: "Preciso organizar meus pensamentos",
        q3: "Que técnica de relaxamento você recomenda?",
        q4: "Me ajude a ser mais gentil comigo mesmo",
        q5: "Como posso melhorar minha autoestima?",
        q6: "Tenho pensamentos negativos persistentes",
        q7: "Como lidar com o estresse diário?",
        q8: "Quero praticar a gratidão",
        q9: "O que posso fazer para dormir melhor?",
        q10: "Me ajude a encontrar meu propósito",
        warning_title: "⚠️ Aviso Importante",
        warning_subtitle: "Acompanhamento Cognitivo",
        warning_text: "Esta inteligência artificial, **Aura**, é uma ferramenta interativa projetada exclusivamente para acompanhamento, orientação inicial e apoio psicoeducativo.",
        warning_no_diagnosis: "Não emite diagnósticos médicos, receitas ou tratamentos.",
        warning_no_replace: "Não substitui a consulta, avaliação ou terapia com seu profissional de saúde ou neuropediatra.",
        warning_emergency: "Se você estiver passando por uma crise ou emergência médica, **procure imediatamente** o centro de saúde mais próximo ou entre em contato com as linhas de emergência do seu país.",
        warning_accept: "Ao utilizar esta ferramenta, você aceita que seu uso é por sua própria conta e risco.",
        warning_btn: "Aceito e entendo",
        commercial_title: "🌱 Comece sua jornada de crescimento cognitivo",
        commercial_subtitle: "Acompañamiento profesional para tu desarrollo",
        commercial_btn: "🚀 Começar jornada agora",
        commercial_close: "Voltar para a experiência Aura",
        gpu_title: "⚙️ Atualização Técnica Necessária",
        gpu_text: "Seu dispositivo requer atualização técnica para ativar o assistente virtual (WebGPU).",
        gpu_btn_retry: "Tentar novamente",
        lite_title: "⚡ Iniciar Aura Lite (Acompanhante)",
        lite_badge: "Modo Lite 🌿",
        gpu_lite_desc: "💡 Seu dispositivo não possui aceleração WebGL/WebGPU? Sem problemas! Com Aura Lite você tem conversas e acompanhamento cognitivo instantâneo sem altos requisitos de hardware.",
        btn_attention: "💚 Solicitar apoio",
        sessions_count: "conversas salvas",
        btn_stop: "Parar AI 🛑",
        btn_home: "Início 🏠",
        tooltip_stop: "Parar geração de resposta da AI",
        tooltip_home: "Ir para o início sem reiniciar a AI",
        loading_phrases: [
            '🧠 Despertando neurônios...',
            '🌿 Criando seu espaço de bem-estar...',
            '💭 Preparando a conexão...'
        ]
    },
    ja: {
        app_name: "Aura 🌿",
        online: "オンライン",
        loading: "読み込み中...",
        ready: "準備完了",
        new_chat: "新規チャット",
        chat_history: "履歴",
        no_history: "保存された会話はありません",
        auto_save: "会話は自動的に保存されます",
        delete_all: "すべての履歴を削除",
        delete_all_confirm: "すべての会話履歴を削除しますか？",
        delete_all_title: "履歴を全削除",
        delete_all_message: "この操作は保存されたすべての会話を永久に削除します。よろしいですか？",
        no_messages: "メッセージなし",
        view_conversation: "会話を表示",
        delete_conversation: "会話を削除",
        delete_confirm_single: "この会話を削除してもよろしいですか？",
        delete_single_title: "会話の削除",
        delete_single_message: "この操作は取り消せません。続行しますか？",
        cancel: "キャンセル",
        delete: "削除",
        close: "閉じる",
        send: "送信",
        welcome_title: "👋 こんにちは！私は**Aura（アウラ）**です。あなたの認知ウェルネスの伴走者です。",
        welcome_text: "私はあなたの話を聞き、考えや感情、精神的なパターンを探求するお手伝いをします。私は心理学者ではありませんが、あなたの自己発見の旅の仲間です。\n\nあなたが共有することはすべて、あなたと私だけの秘密です。感じていること、考えていること、あるいは単に表現したいことを何でも書いてください。\n\n**どこから始めましょうか？** 🌿",
        quick_questions_title: "🌱 質問を選んで始めましょう",
        input_placeholder_empty: "メッセージを入力するか、質問を選択してください...",
        input_placeholder: "メッセージを入力...",
        footer: "🌿 安全な空間 · すべてはあなたとAuraの間に留まります",
        q1: "不安を和らげるにはどうすればいいですか？",
        q2: "考えを整理する必要があります",
        q3: "おすすめのリラクゼーション法は何ですか？",
        q4: "自分自身にもっと優しくなれるよう手伝ってください",
        q5: "自尊心を高めるにはどうすればいいですか？",
        q6: "否定的な考えが頭から離れません",
        q7: "日々のストレスをコントロールするには？",
        q8: "感謝の気持ちを練習したいです",
        q9: "よく眠るために何ができますか？",
        q10: "人生の目的を見つけるのを手伝ってください",
        warning_title: "⚠️ 重要な注意",
        warning_subtitle: "認知伴走サービス",
        warning_text: "この人工知能**Aura**は、伴走、初期の方向付け、および心理教育的サポートのみを目的として設計されたインタラクティブなツールです。",
        warning_no_diagnosis: "医学的診断、処方、または治療は行いません。",
        warning_no_replace: "医師や専門家による診察、評価、治療に代わるものではありません。",
        warning_emergency: "危機や医療上の緊急事態が発生した場合は、**ただちに**最寄りの医療機関を受診するか、お住まいの国の緊急通報用電話番号に連絡してください。",
        warning_accept: "このツールを使用することにより、ご自身の責任において使用することに同意したものとみなされます。",
        warning_btn: "同意して理解しました",
        commercial_title: "🌱 認知成長の旅を始めましょう",
        commercial_subtitle: "あなたの発達のための専門的な伴走",
        commercial_btn: "🚀 今すぐ旅を始める",
        commercial_close: "Aura体験に戻る",
        gpu_title: "⚙️ 技術アップデートが必要",
        gpu_text: "バーチャルアシスタントを有効にするには、デバイスのアップデートが必要です（WebGPU）。",
        gpu_btn_retry: "再試行",
        lite_title: "⚡ Aura Lite（伴走モード）を起動",
        lite_badge: "Liteモード 🌿",
        gpu_lite_desc: "💡 WebGL/WebGPUグラフィック機能が非対応ですか？ご安心ください。Aura Liteなら、デバイスのハードウェアに負担をかけず、すぐに会話や認知アドバイスを利用できます。",
        btn_attention: "💚 サポートを依頼",
        sessions_count: "保存されたチャット",
        btn_stop: "AI停止 🛑",
        btn_home: "ホーム 🏠",
        tooltip_stop: "AIの回答生成を停止します",
        tooltip_home: "モデルを再ロードせずに初期画面に戻ります",
        loading_phrases: [
            '🧠 ニューロンを活性化中...',
            '🌿 空間を作成中...',
            '💭 接続を準備中...'
        ]
    },
    zh: {
        app_name: "Aura 🌿",
        online: "在线",
        loading: "加载中...",
        ready: "准备就绪",
        new_chat: "新建对话",
        chat_history: "历史记录",
        no_history: "暂无保存的对话",
        auto_save: "对话将自动保存",
        delete_all: "清除所有历史",
        delete_all_confirm: "确定要删除所有保存的的对话吗？",
        delete_all_title: "清除历史",
        delete_all_message: "此操作将永久删除所有保存的对话。确定吗？",
        no_messages: "无消息",
        view_conversation: "查看完整对话",
        delete_conversation: "删除对话",
        delete_confirm_single: "确定要删除这段对话吗？",
        delete_single_title: "删除对话",
        delete_single_message: "此操作不可撤销。要继续吗？",
        cancel: "取消",
        delete: "删除",
        close: "关闭",
        send: "发送",
        welcome_title: "👋 你好！我是 **Aura（奥拉）**，你的认知健康伴侣。",
        welcome_text: "我在这里倾听并帮助你探索你的想法、情绪和思维模式。我不是心理医生，而是你自我发现之旅中的旅伴。\n\n你分享的所有内容都将严格保密。你可以向我倾诉你的感受、想法，或仅仅是你需要表达的事情。\n\n**你想从哪里开始？** 🌿",
        quick_questions_title: "🌱 选择一个问题开始",
        input_placeholder_empty: "输入您的消息或选择一个问题...",
        input_placeholder: "输入您的消息...",
        footer: "🌿 安全空间 · 所有的秘密只属于你和Aura",
        q1: "我该如何缓解焦虑？",
        q2: "我需要整理我的思绪",
        q3: "有什么推荐的放松技巧吗？",
        q4: "帮助我对自已更温柔一些",
        q5: "如何提高我的自尊心？",
        q6: "我总是产生消极想法",
        q7: "如何管理日常压力？",
        q8: "我想练习感恩",
        q9: "我该怎么做才能睡得更好？",
        q10: "帮助我寻找我的人生目标",
        warning_title: "⚠️ 重要声明",
        warning_subtitle: "认知伴随服务",
        warning_text: "此人工智能 **Aura** 陪伴日常陪伴、初始指导和心理教育支持而设计。",
        warning_no_diagnosis: "不提供医学诊断、处方或治疗。",
        warning_no_replace: "不能替代您的医生或专业心理咨询师的咨询、评估或治疗。",
        warning_emergency: "如果您正经历危机，**请立即**前往最近的医疗中心或联系您所在国家的紧急求助电话。",
        warning_accept: "使用此工具即表示您接受并自担使用风险。",
        warning_btn: "我接受并理解",
        commercial_title: "🌱 开启您的认知成长之旅",
        commercial_subtitle: "为您的成长提供专业陪伴",
        commercial_btn: "🚀 立即开启我的旅程",
        commercial_close: "返回Aura体验",
        gpu_title: "⚙️ 需要硬件技术更新",
        gpu_text: "激活虚拟助手需要您的设备进行技术更新 (WebGPU)。",
        gpu_btn_retry: "重试",
        lite_title: "⚡ 启动 Aura Lite（陪伴模式）",
        lite_badge: "Lite 模式 🌿",
        gpu_lite_desc: "💡 设备不支持 WebGL/WebGPU 硬件加速？没关系！Aura Lite 为您提供即时认知健康陪伴与实用建议，无需高额硬件配置。",
        btn_attention: "💚 申请支持",
        sessions_count: "保存会话",
        btn_stop: "停止 AI 🛑",
        btn_home: "首页 🏠",
        tooltip_stop: "停止AI回答生成",
        tooltip_home: "在不重新加载模型的情况下返回初始界面",
        loading_phrases: [
            '🧠 唤醒神经元...',
            '🌿 正在创建健康空间...',
            '💭 正在准备连接...'
        ]
    },
    ru: {
        app_name: "Aura 🌿",
        online: "В сети",
        loading: "Загрузка...",
        ready: "Готово",
        new_chat: "Новый чат",
        chat_history: "История",
        no_history: "Нет сохраненных бесед",
        auto_save: "Беседы сохраняются автоматически",
        delete_all: "Очистить всю историю",
        delete_all_confirm: "Удалить все сохраненные беседы?",
        delete_all_title: "Очистить историю",
        delete_all_message: "Это действие навсегда удалит все сохраненные беседы. Вы уверены?",
        no_messages: "Нет сообщений",
        view_conversation: "Просмотреть всю беседу",
        delete_conversation: "Удалить беседу",
        delete_confirm_single: "Вы уверены, что хотите удалить эту беседу?",
        delete_single_title: "Удалить беседу",
        delete_single_message: "Это действие нельзя отменить. Хотите продолжить?",
        cancel: "Отмена",
        delete: "Удалить",
        close: "Закрыть",
        send: "Отправить",
        welcome_title: "👋 Привет! Я **Aura**, твой спутник в мире ментального благополучия.",
        welcome_text: "Я здесь, чтобы выслушать тебя и помочь разобраться в мыслях, эмоциях и ментальных установках. Я не профессиональный психолог, но я твой верный попутчик в путешествии к самопознанию.\n\nВсе, чем ты делишься со мной, строго конфиденциально. Ты можешь написать мне о своих чувствах, мыслях или просто о том, чем хочется поделиться.\n\n**С чего начнем?** 🌿",
        quick_questions_title: "🌱 ВЫБЕРИТЕ ВОПРОС ДЛЯ НАЧАЛА",
        input_placeholder_empty: "Введите сообщение или выберите вопрос...",
        input_placeholder: "Введите сообщение...",
        footer: "🌿 Безопасное пространство · Все остается только между тобой и Aura",
        q1: "Как мне справиться с тревогой?",
        q2: "Мне нужно навести порядок в мыслях",
        q3: "Какую технику расслабления ты порекомендуешь?",
        q4: "Помоги мне стать добрее к себе",
        q5: "Как мне повысить самооценку?",
        q6: "У меня навязчивые негативные мысли",
        q7: "Как справляться со стрессом каждый день?",
        q8: "Я хочу научиться практиковать благодарность",
        q9: "Что делать, чтобы лучше спать?",
        q10: "Помоги мне найти свое призвание",
        warning_title: "⚠️ Важное примечание",
        warning_subtitle: "Когнитивная поддержка",
        warning_text: "Этот искусственный интеллект, **Aura**, разработан исключительно для когнитивной поддержки и психообразовательного сопровождения.",
        warning_no_diagnosis: "Не ставит медицинские диагнозы, не выписывает рецепты и не назначает лечение.",
        warning_no_replace: "Не заменяет консультацию, оценку или терапию у вашего лечащего врача.",
        warning_emergency: "Если вы переживаете кризис, **немедленно обратитесь** в ближайшее медицинское учреждение.",
        warning_accept: "Используя этот инструмент, вы соглашаетесь с тем, что используете его на свой страх и риск.",
        warning_btn: "Я принимаю и понимаю",
        commercial_title: "🌱 Начните свой путь когнитивного роста",
        commercial_subtitle: "Профессиональное сопровождение для вашего развития",
        commercial_btn: "🚀 Начать путь сейчас",
        commercial_close: "Вернуться к Aura",
        gpu_title: "⚙️ Требуется техническое обновление",
        gpu_text: "Для работы ИИ требуется поддержка WebGPU на вашем устройстве.",
        gpu_btn_retry: "Повторить попытку",
        lite_title: "⚡ Запустить Aura Lite (Спутник)",
        lite_badge: "Режим Lite 🌿",
        gpu_lite_desc: "💡 На вашем устройстве нет аппаратного ускорения WebGL/WebGPU? Не проблема! Aura Lite обеспечивает мгновенную когнитивную поддержку без высоких системных требований.",
        btn_attention: "💚 Нужна помощь",
        sessions_count: "сохраненных бесед",
        btn_stop: "Стоп ИИ 🛑",
        btn_home: "Главная 🏠",
        tooltip_stop: "Остановить генерацию ответа ИИ",
        tooltip_home: "Вернуться на начальный экран без перезапуска ИИ",
        loading_phrases: [
            '🧠 Пробуждаем нейроны...',
            '🌿 Создаем ваше пространство...',
            '💭 Настраиваем безопасное подключение...'
        ]
    }
};

// ============================================================
// TRANSLATION HELPER FUNCTION
// ============================================================
function t(key: string): string {
    const lang = localStorage.getItem('aura_language') || 'es';
    const translation = translations[lang] || translations.es;
    return translation[key] || key;
}

// ============================================================
// SAFE STRING CONVERTER HELPER
// ============================================================
function getSafeText(content: any): string {
    if (typeof content === 'string') return content;
    if (Array.isArray(content)) {
        return content.map(item => {
            if (typeof item === 'string') return item;
            if (item && typeof item === 'object' && 'text' in item) return item.text || '';
            return '';
        }).filter(Boolean).join(' ');
    }
    return String(content || '');
}

// ============================================================
// CHAT STORAGE MANAGER
// ============================================================
const STORAGE_KEY = 'aura_chat_history';
const MAX_HISTORY = 9999;

interface ChatHistory {
    id: string;
    title: string;
    date: string;
    messages: { role: string; content: string }[];
    lastMessage?: string;
}

const ChatHistoryStorage = {
    save: (chat: ChatHistory) => {
        try {
            const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const filtered = existing.filter((c: ChatHistory) => c.id !== chat.id);
            const updated = [chat, ...filtered].slice(0, MAX_HISTORY);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
            return true;
        } catch (e) {
            console.error('Error saving chat history:', e);
            return false;
        }
    },
    loadAll: (): ChatHistory[] => {
        try {
            return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        } catch (e) {
            console.error('Error loading chat history:', e);
            return [];
        }
    },
    delete: (id: string) => {
        try {
            const existing = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
            const filtered = existing.filter((c: ChatHistory) => c.id !== id);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
            return true;
        } catch (e) {
            console.error('Error deleting chat history:', e);
            return false;
        }
    },
    clear: () => {
        localStorage.removeItem(STORAGE_KEY);
    }
};

export function App() {
    const { messageHistory, criticalError, isGenerating, isLiteMode } = useTypedSelector(state => state.llm);
    const dispatch = useTypedDispatch();
    const [inputValue, setInputValue] = useState('');
    const [loadFinished, setLoadFinished] = useState(false);
    const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    
    // Custom dialogs states
    const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
    const [confirmDialogTitle, setConfirmDialogTitle] = useState('');
    const [confirmDialogMessage, setConfirmDialogMessage] = useState('');
    const [confirmDialogAction, setConfirmDialogAction] = useState<() => void>(() => {});
    const [confirmDialogColor, setConfirmDialogColor] = useState<'primary' | 'error'>('primary');
    
    const [viewChatDialogOpen, setViewChatDialogOpen] = useState(false);
    const [viewingChat, setViewingChat] = useState<ChatHistory | null>(null);
    
    // Popups/Modals
    const [showWarning, setShowWarning] = useState(false);
    const [warningAccepted, setWarningAccepted] = useState(false);
    const [showGpuError, setShowGpuError] = useState(false);
    const [showCommercial, setShowCommercial] = useState(false);
    const [showNeuralModal, setShowNeuralModal] = useState(false);
    
    // WhatsApp contact modal states
    const [whatsAppDialogOpen, setWhatsAppDialogOpen] = useState(false);
    const [whatsAppType, setWhatsAppType] = useState<'grupo' | 'sesion_unica' | 'general'>('general');
    
    // Language selector anchor
    const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
    const [keyboardHeight, setKeyboardHeight] = useState(0);
    
    const chatEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Memorize quick questions to update automatically when language changes
    const quickQuestions = useMemo(() => [
        { text: t('q1'), icon: <EmojiEmotions />, color: "#ff6b6b" },
        { text: t('q2'), icon: <MenuBook />, color: "#4ecdc4" },
        { text: t('q3'), icon: <Spa />, color: "#45b7d1" },
        { text: t('q4'), icon: <Favorite />, color: "#ff85a2" },
        { text: t('q5'), icon: <SelfImprovement />, color: "#a29bfe" },
        { text: t('q6'), icon: <WbSunny />, color: "#fdcb6e" },
        { text: t('q7'), icon: <FitnessCenter />, color: "#00b894" },
        { text: t('q8'), icon: <CheckCircle />, color: "#6c5ce7" },
        { text: t('q9'), icon: <Psychology />, color: "#4a6fa5" },
        { text: t('q10'), icon: <Lightbulb />, color: "#f39c12" }
    ], [localStorage.getItem('aura_language')]);

    // Browser language detection
    useEffect(() => {
        const savedLang = localStorage.getItem('aura_language');
        if (!savedLang) {
            const browserLang = navigator.language?.split('-')[0] || 'es';
            const supportedLangs = ['es', 'en', 'de', 'fr', 'it', 'pt', 'ja', 'zh', 'ru'];
            const lang = supportedLangs.includes(browserLang) ? browserLang : 'es';
            localStorage.setItem('aura_language', lang);
        }
    }, []);

    // Warning confirmation verification
    useEffect(() => {
        const accepted = localStorage.getItem('aura_warning_accepted');
        if (accepted === 'true') {
            setWarningAccepted(true);
            setShowWarning(false);
            initApp();
        } else {
            setShowWarning(true);
        }
    }, []);

    // FIX: Keyboard handling - mejorado para móviles
    useEffect(() => {
        if (typeof window === 'undefined') return;

        // Función para manejar el resize del viewport
        const handleViewportChange = () => {
            // Usamos visualViewport para detectar el teclado en móviles
            if (window.visualViewport) {
                const visualHeight = window.visualViewport.height;
                const layoutHeight = window.innerHeight;
                const diff = layoutHeight - visualHeight;
                
                // Si la diferencia es significativa (> 100px), es probable que el teclado esté abierto
                if (diff > 100) {
                    setKeyboardHeight(diff);
                } else {
                    setKeyboardHeight(0);
                }
            } else {
                // Fallback: usar el resize de window
                const diff = window.innerHeight - (window as any)._lastHeight || 0;
                if (diff > 100) {
                    setKeyboardHeight(diff);
                } else {
                    setKeyboardHeight(0);
                }
                (window as any)._lastHeight = window.innerHeight;
            }

            // Scroll al final del chat cuando el teclado aparece
            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 50);
            
            // Segundo scroll después de que el teclado termine de animarse
            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 300);
        };

        // Guardar altura inicial
        (window as any)._lastHeight = window.innerHeight;

        // Usar visualViewport si está disponible (mejor para iOS/Android)
        if (window.visualViewport) {
            window.visualViewport.addEventListener('resize', handleViewportChange);
            window.visualViewport.addEventListener('scroll', handleViewportChange);
        } else {
            window.addEventListener('resize', handleViewportChange);
        }

        // También escuchar focus en inputs para scroll
        const handleFocus = () => {
            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 100);
            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            }, 300);
        };

        document.addEventListener('focusin', (e) => {
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                handleFocus();
            }
        });

        return () => {
            if (window.visualViewport) {
                window.visualViewport.removeEventListener('resize', handleViewportChange);
                window.visualViewport.removeEventListener('scroll', handleViewportChange);
            } else {
                window.removeEventListener('resize', handleViewportChange);
            }
            document.removeEventListener('focusin', handleFocus);
        };
    }, []);

    // Load Chat History list
    useEffect(() => {
        const saved = ChatHistoryStorage.loadAll();
        setChatHistory(saved);
    }, [messageHistory]);

    // Auto-scroll messages - con mayor prioridad
    useEffect(() => {
        if (chatEndRef.current) {
            // Usamos requestAnimationFrame para asegurar que el DOM esté actualizado
            requestAnimationFrame(() => {
                chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
            });
        }
    }, [messageHistory]);

    // ============================================================
    // CORE FUNCTIONAL METHODS
    // ============================================================
    const saveCurrentConversation = () => {
        if (messageHistory.length < 2) return;
        
        const visibleMessages = messageHistory.filter(m => getSafeText(m.content).trim());
        if (visibleMessages.length < 2) return;
        
        const firstUserMessage = visibleMessages.find(m => m.role === 'user');
        const title = firstUserMessage ? getSafeText(firstUserMessage.content).slice(0, 40) : 'Conversación de Aura';
        const id = `chat_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
        
        const chat: ChatHistory = {
            id,
            title: title + (title.length >= 40 ? '...' : ''),
            date: new Date().toISOString(),
            messages: visibleMessages.map(m => ({ 
                role: typeof m.role === 'string' ? m.role : 'unknown', 
                content: getSafeText(m.content) 
            })),
            lastMessage: visibleMessages.length > 0 ? getSafeText(visibleMessages[visibleMessages.length - 1].content).slice(0, 60) : ''
        };
        
        ChatHistoryStorage.save(chat);
        setChatHistory(prev => {
            const filtered = prev.filter(c => c.id !== id);
            return [chat, ...filtered].slice(0, MAX_HISTORY);
        });
    };

    const initApp = async () => {
        try {
            // Siempre modo Lite - no hay descarga de modelos
            dispatch(setIsLiteMode(true));
            setLoadFinished(true);
        } catch (error) {
            console.error('Error initializing:', error);
            dispatch(setIsLiteMode(true));
            setLoadFinished(true);
        }
    };

    const submitPrompt = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (isGenerating) return;
        if (inputValue.trim()) {
            sendPrompt(inputValue.trim());
            setInputValue('');
        }
    };

    const copyToInput = (text: string) => {
        setInputValue(text);
        // Scroll al input después de copiar
        setTimeout(() => {
            inputRef.current?.focus();
            chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }, 100);
    };

    const handleQuickQuestion = (question: string) => {
        if (isGenerating) return;
        sendPrompt(question);
        setInputValue('');
    };

    const handleNewChat = () => {
        saveCurrentConversation();
        window.location.reload();
    };

    const handleGoHome = () => {
        if (isGenerating) {
            stopGeneration();
        }
        saveCurrentConversation();
        clearChatHistory();
        setInputValue('');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleStop = () => {
        stopGeneration();
    };

    const handleViewChat = (chat: ChatHistory) => {
        setViewingChat(chat);
        setViewChatDialogOpen(true);
    };

    const showConfirmDialog = (title: string, message: string, action: () => void, color: 'primary' | 'error' = 'primary') => {
        setConfirmDialogTitle(title);
        setConfirmDialogMessage(message);
        setConfirmDialogAction(() => action);
        setConfirmDialogColor(color);
        setConfirmDialogOpen(true);
    };

    const handleConfirmAction = () => {
        confirmDialogAction();
        setConfirmDialogOpen(false);
    };

    const handleDeleteChat = (id: string) => {
        showConfirmDialog(
            t('delete_single_title'),
            t('delete_single_message'),
            () => {
                ChatHistoryStorage.delete(id);
                setChatHistory(prev => prev.filter(c => c.id !== id));
            },
            'error'
        );
    };

    const handleDeleteAllChats = () => {
        showConfirmDialog(
            t('delete_all_title'),
            t('delete_all_message'),
            () => {
                ChatHistoryStorage.clear();
                setChatHistory([]);
                setHistoryDrawerOpen(false);
            },
            'error'
        );
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        
        if (diff < 60000) return 'Ahora';
        if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
        if (diff < 86400000) return `${Math.floor(diff / 3600000)}h`;
        if (diff < 604800000) return `${Math.floor(diff / 86400000)}d`;
        
        return date.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric'
        });
    };

    const handleAcceptWarning = () => {
        setWarningAccepted(true);
        setShowWarning(false);
        localStorage.setItem('aura_warning_accepted', 'true');
        initApp();
    };

    const getWhatsAppText = (type?: 'grupo' | 'sesion_unica' | 'general') => {
        let txt = 'Hola, vengo de la app Aura 🌿 y me interesa participar en los grupos de neuroestimulación.';
        if (type === 'grupo') {
            txt = 'Hola, vengo de la app Aura 🌿 y me interesa unirme al PLAN MENSUAL de Grupos de Terapia de apoyo cognitivo ($40 USD/mes).';
        } else if (type === 'sesion_unica') {
            txt = 'Hola, vengo de la app Aura 🌿 y me interesa participar en una SESIÓN ÚNICA DE GRUPO de entrenamiento cognitivo ($22 USD/sesión).';
        }
        return txt;
    };

    const getWhatsAppUrl = (type?: 'grupo' | 'sesion_unica' | 'general', format: 'wa_me' | 'web' | 'app' = 'wa_me') => {
        const phone = '5491166116631';
        const message = encodeURIComponent(getWhatsAppText(type));
        if (format === 'web') {
            return `https://web.whatsapp.com/send?phone=${phone}&text=${message}`;
        }
        if (format === 'app') {
            return `whatsapp://send?phone=${phone}&text=${message}`;
        }
        return `https://api.whatsapp.com/send?phone=${phone}&text=${message}`;
    };

    const isMobileDevice = () => {
        if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;

        const ua = (navigator.userAgent || navigator.vendor || (window as any).opera || '').toLowerCase();
        
        const mobileKeywords = [
            'android', 'webos', 'iphone', 'ipad', 'ipod', 'blackberry', 'iemobile', 
            'opera mini', 'mobile', 'tablet', 'wv', 'webview', 'kindle', 'silk',
            'samsungbrowser', 'ucbrowser', 'fennec', 'criios', 'fxios', 'winebox'
        ];
        if (mobileKeywords.some(keyword => ua.includes(keyword))) {
            return true;
        }

        const platform = (navigator.platform || '').toLowerCase();
        if (/android|iphone|ipad|ipod/i.test(platform)) {
            return true;
        }

        if (platform === 'macintel' && navigator.maxTouchPoints > 1) {
            return true;
        }

        const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
        const isMobileViewport = Math.min(window.innerWidth, window.innerHeight) <= 1024;
        if (hasTouch && isMobileViewport) {
            return true;
        }

        if ((window as any).Android !== undefined || (window as any).webkit?.messageHandlers !== undefined) {
            return true;
        }

        return false;
    };

    const openWhatsAppDirect = (url: string) => {
        const waAppUrl = url.startsWith('whatsapp://') ? url : url.replace('https://api.whatsapp.com/send?', 'whatsapp://send?');
        const waWebUrl = url.replace('whatsapp://send?', 'https://api.whatsapp.com/send?');

        try {
            window.parent?.postMessage({ type: 'open_whatsapp', url: waAppUrl, webUrl: waWebUrl, phone: '5491166116631' }, '*');
        } catch (e) {
            console.warn('PostMessage caught:', e);
        }

        try {
            const a = document.createElement('a');
            a.href = waAppUrl;
            a.target = '_blank';
            a.rel = 'noopener noreferrer';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        } catch (e) {
            console.warn('Anchor click caught:', e);
        }

        setTimeout(() => {
            try {
                window.location.href = waAppUrl;
            } catch (e) {
                try {
                    window.open(waWebUrl, '_blank', 'noopener,noreferrer');
                } catch (err) {
                    console.warn('Fallback opening error:', err);
                }
            }
        }, 250);
    };

    const handleWhatsAppContact = (type?: 'grupo' | 'sesion_unica' | 'general') => {
        const targetType = type || 'general';
        setWhatsAppType(targetType);
        setShowCommercial(false);

        const isMobile = isMobileDevice();
        const url = getWhatsAppUrl(targetType, isMobile ? 'app' : 'wa_me');

        if (isMobile) {
            setWhatsAppDialogOpen(false);
            openWhatsAppDirect(url);
        } else {
            setWhatsAppDialogOpen(true);
        }
    };

    const markdownComponents = useMemo(() => ({
        a: ({ href, children }: any) => {
            const isWhatsApp = href && (href.includes('wa.me') || href.includes('whatsapp') || href.includes('5491166116631'));
            
            const handleClick = (e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                if (isWhatsApp) {
                    handleWhatsAppContact('general');
                } else if (href) {
                    try {
                        window.open(href, '_blank', 'noopener,noreferrer');
                    } catch (err) {
                        console.warn('Failed to open link:', err);
                    }
                }
            };

            return (
                <a 
                    href={href || '#'} 
                    onClick={handleClick}
                    target="_blank" 
                    rel="noopener noreferrer"
                    style={{ color: '#25D366', fontWeight: 'bold', textDecoration: 'underline', cursor: 'pointer' }}
                >
                    {children}
                </a>
            );
        }
    }), []);

    const handleLanguageChange = (lang: string) => {
        localStorage.setItem('aura_language', lang);
        setLangAnchorEl(null);
        window.location.reload();
    };

    // ============================================================
    // UI SUB-COMPONENTS
    // ============================================================
    const WarningPopup = () => (
        <Box sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(12px)',
            animation: 'fadeIn 0.6s ease',
            p: { xs: 1.5, sm: 2 }
        }}>
            <Box sx={{
                maxWidth: { xs: '95vw', sm: 620 },
                width: '100%',
                maxHeight: '92vh',
                overflow: 'auto',
                bgcolor: '#121226',
                borderRadius: { xs: 4, sm: 6 },
                p: { xs: 2.5, sm: 4 },
                border: '1px solid rgba(144, 202, 249, 0.15)',
                boxShadow: '0 30px 80px rgba(0,0,0,0.6)',
                position: 'relative'
            }}>
                <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3
                }}>
                    <Box sx={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, rgba(144, 202, 249, 0.15), rgba(167, 139, 250, 0.15))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '2px solid rgba(144, 202, 249, 0.2)',
                        animation: 'float 3s ease-in-out infinite',
                        position: 'relative'
                    }}>
                        <Psychology sx={{ fontSize: 40, color: '#90caf9' }} />
                        <Box sx={{
                            position: 'absolute',
                            top: -4,
                            right: -4,
                            width: 20,
                            height: 20,
                            borderRadius: '50%',
                            bgcolor: '#ffd700',
                            boxShadow: '0 0 20px rgba(255, 215, 0, 0.3)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '10px',
                            animation: 'pulse 2s ease-in-out infinite'
                        }}>
                            <span style={{ color: '#000', fontWeight: 'bold' }}>!</span>
                        </Box>
                    </Box>
                </Box>

                <Typography variant="h4" sx={{
                    color: '#90caf9',
                    textAlign: 'center',
                    fontWeight: 300,
                    mb: 1,
                    letterSpacing: 1,
                    background: 'linear-gradient(90deg, #90caf9, #a78bfa)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                }}>
                    {t('app_name')}
                </Typography>

                <Typography variant="h5" sx={{
                    color: '#ffd700',
                    textAlign: 'center',
                    fontWeight: 500,
                    mb: 3,
                    letterSpacing: 0.5
                }}>
                    {t('warning_subtitle')}
                </Typography>

                <Divider sx={{ mb: 3, borderColor: 'rgba(255,255,255,0.05)' }}>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.2)' }}>
                        {t('warning_title')}
                    </Typography>
                </Divider>

                <Typography variant="body1" sx={{
                    color: 'rgba(255,255,255,0.85)',
                    textAlign: 'center',
                    mb: 3,
                    lineHeight: 1.8,
                    fontSize: '0.95rem'
                }}>
                    {t('warning_text')}
                </Typography>

                <Box sx={{
                    bgcolor: 'rgba(255, 193, 7, 0.04)',
                    borderRadius: 3,
                    p: 3,
                    mb: 3,
                    border: '1px solid rgba(255, 193, 7, 0.08)'
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
                        <Typography sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>✕</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            <strong>{t('warning_no_diagnosis')}</strong>
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 1.5 }}>
                        <Typography sx={{ color: '#ff6b6b', fontWeight: 'bold' }}>✕</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            <strong>{t('warning_no_replace')}</strong>
                        </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                        <Typography sx={{ color: '#ffd700', fontWeight: 'bold' }}>⚠</Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                            {t('warning_emergency')}
                        </Typography>
                    </Box>
                </Box>

                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleAcceptWarning}
                    sx={{
                        bgcolor: '#075e54',
                        py: 1.8,
                        borderRadius: 4,
                        '&:hover': {
                            bgcolor: '#054740',
                            transform: 'scale(1.02)'
                        },
                        fontSize: '1rem',
                        textTransform: 'none',
                        fontWeight: 500,
                        letterSpacing: 0.5
                    }}
                >
                    <CheckCircle sx={{ mr: 1.5 }} />
                    {t('warning_btn')}
                </Button>
            </Box>
        </Box>
    );

    const ConfirmDialog = () => (
        <Dialog
            open={confirmDialogOpen}
            onClose={() => setConfirmDialogOpen(false)}
            PaperProps={{
                sx: {
                    bgcolor: '#1a1a2e',
                    borderRadius: 4,
                    border: '1px solid rgba(255,255,255,0.05)',
                    minWidth: 320,
                    maxWidth: 460,
                    p: 1
                }
            }}
        >
            <DialogTitle sx={{ 
                color: confirmDialogColor === 'error' ? '#e74c3c' : '#90caf9',
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                pb: 1
            }}>
                {confirmDialogColor === 'error' ? <Warning sx={{ color: '#e74c3c' }} /> : <Warning sx={{ color: '#ffd700' }} />}
                {confirmDialogTitle}
            </DialogTitle>
            <DialogContent>
                <DialogContentText sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.6 }}>
                    {confirmDialogMessage}
                </DialogContentText>
            </DialogContent>
            <DialogActions sx={{ p: 2, pt: 0, gap: 1 }}>
                <Button 
                    onClick={() => setConfirmDialogOpen(false)}
                    sx={{ color: 'rgba(255,255,255,0.5)' }}
                >
                    {t('cancel')}
                </Button>
                <Button 
                    variant="contained" 
                    onClick={handleConfirmAction}
                    sx={{ 
                        bgcolor: confirmDialogColor === 'error' ? '#e74c3c' : '#075e54',
                        '&:hover': {
                            bgcolor: confirmDialogColor === 'error' ? '#c0392b' : '#054740'
                        },
                        textTransform: 'none'
                    }}
                >
                    {t('delete')}
                </Button>
            </DialogActions>
        </Dialog>
    );

    const CommercialModal = () => {
        const lang = localStorage.getItem('aura_language') || 'es';
        
        return (
            <Box sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                zIndex: 9998,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0,0,0,0.92)',
                backdropFilter: 'blur(16px)',
                animation: 'fadeIn 0.5s ease',
                p: { xs: 1, sm: 2 }
            }}>
                <Box sx={{
                    maxWidth: { xs: '96vw', sm: 750 },
                    width: '100%',
                    maxHeight: '92vh',
                    overflow: 'auto',
                    bgcolor: '#0f0f26',
                    borderRadius: { xs: 4, sm: 6 },
                    p: { xs: 2, sm: 4 },
                    border: '1px solid rgba(244, 143, 177, 0.2)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.8)',
                    position: 'relative'
                }}>
                    <IconButton
                        onClick={() => setShowCommercial(false)}
                        sx={{
                            position: 'absolute',
                            top: 12,
                            right: 12,
                            color: 'rgba(255,255,255,0.4)',
                            '&:hover': {
                                color: '#fff',
                                bgcolor: 'rgba(255,255,255,0.05)'
                            }
                        }}
                    >
                        <Close />
                    </IconButton>

                    <Box sx={{ textAlign: 'center', mb: 3 }}>
                        <Typography variant="h5" sx={{
                            color: '#f48fb1',
                            fontWeight: 'bold',
                            mb: 1,
                            background: 'linear-gradient(90deg, #f48fb1, #90caf9)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                        }}>
                            {lang === 'es' ? '🌿 Grupos de Terapia y Neuroestimulación' : '🌿 Therapy & Neurostimulation Groups'}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', maxWidth: 580, mx: 'auto', fontSize: '0.85rem' }}>
                            {lang === 'es' 
                                ? 'Todas nuestras sesiones son guiadas por un neuropsicólogo profesional, diseñadas para el entrenamiento de habilidades, funciones cognitivas, desarrollo personal y acompañamiento diario.' 
                                : 'All of our sessions are guided by a professional neuropsychologist, designed for skills training, cognitive functions stimulation, personal development, and daily support.'}
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'grid',
                        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                        gap: 2.5,
                        mb: 4
                    }}>
                        <Box sx={{
                            bgcolor: 'rgba(255,255,255,0.02)',
                            borderRadius: 4,
                            p: 3,
                            border: '1px solid rgba(144, 202, 249, 0.15)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            '&:hover': {
                                borderColor: 'rgba(144, 202, 249, 0.35)',
                                bgcolor: 'rgba(144, 202, 249, 0.025)',
                            },
                            transition: 'all 0.3s'
                        }}>
                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                    <SelfImprovement sx={{ color: '#90caf9', fontSize: 24 }} />
                                    <Typography variant="subtitle1" sx={{ color: '#90caf9', fontWeight: 'bold' }}>
                                        {lang === 'es' ? 'Sesión Única de Grupo' : 'Single Group Session'}
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                                    $22 <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 'normal' }}>USD / {lang === 'es' ? 'sesión' : 'session'}</span>
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, fontSize: '0.82rem', lineHeight: 1.6 }}>
                                    {lang === 'es' 
                                        ? 'Participa en un encuentro grupal en vivo para entrenar tus funciones cognitivas y recibir contención profesional.' 
                                        : 'Participate in a live group session to train your cognitive functions and receive professional containment.'}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircle sx={{ color: '#90caf9', fontSize: 14 }} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                            {lang === 'es' ? 'Guiada por un neuropsicólogo' : 'Guided by a neuropsychologist'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircle sx={{ color: '#90caf9', fontSize: 14 }} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                            {lang === 'es' ? 'Entrenamiento de funciones cognitivas' : 'Cognitive functions training'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircle sx={{ color: '#90caf9', fontSize: 14 }} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                            {lang === 'es' ? 'Desarrollo personal y dinámicas' : 'Personal development & dynamics'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircle sx={{ color: '#90caf9', fontSize: 14 }} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                            {lang === 'es' ? 'Acompañamiento diario de prueba' : 'Trial daily accompaniment'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Button
                                fullWidth
                                variant="outlined"
                                onClick={() => handleWhatsAppContact('sesion_unica')}
                                startIcon={<WhatsApp />}
                                sx={{
                                    borderColor: 'rgba(144, 202, 249, 0.4)',
                                    color: '#90caf9',
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        borderColor: '#90caf9',
                                        bgcolor: 'rgba(144, 202, 249, 0.05)',
                                    }
                                }}
                            >
                                {lang === 'es' ? 'Probar Sesión Única' : 'Try Single Session'}
                            </Button>
                        </Box>

                        <Box sx={{
                            bgcolor: 'rgba(255,255,255,0.02)',
                            borderRadius: 4,
                            p: 3,
                            border: '1px solid rgba(244, 143, 177, 0.2)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            '&:hover': {
                                borderColor: 'rgba(244, 143, 177, 0.45)',
                                bgcolor: 'rgba(244, 143, 177, 0.025)',
                            },
                            transition: 'all 0.3s',
                            position: 'relative',
                            overflow: 'hidden'
                        }}>
                            <Box sx={{
                                position: 'absolute',
                                top: 12,
                                right: -30,
                                bgcolor: '#f48fb1',
                                color: '#000',
                                px: 4,
                                py: 0.5,
                                transform: 'rotate(45deg)',
                                fontSize: '0.65rem',
                                fontWeight: 'bold',
                                letterSpacing: 0.5,
                                boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
                            }}>
                                {lang === 'es' ? 'RECOMENDADO' : 'POPULAR'}
                            </Box>

                            <Box>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                                    <Group sx={{ color: '#f48fb1', fontSize: 24 }} />
                                    <Typography variant="subtitle1" sx={{ color: '#f48fb1', fontWeight: 'bold' }}>
                                        {lang === 'es' ? 'Plan Mensual Completo' : 'Full Monthly Plan'}
                                    </Typography>
                                </Box>
                                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 'bold', mb: 2 }}>
                                    $40 <span style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.5)', fontWeight: 'normal' }}>USD / {lang === 'es' ? 'mes' : 'month'}</span>
                                </Typography>
                                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 2, fontSize: '0.82rem', lineHeight: 1.6 }}>
                                    {lang === 'es' 
                                        ? 'Conéctate con tu grupo en un espacio de contención, entrenamiento de funciones cognitivas y desarrollo personal continuo.' 
                                        : 'Connect with your group in a safe space for cognitive training, personal development, and continuous support.'}
                                </Typography>
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.2, mb: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircle sx={{ color: '#f48fb1', fontSize: 14 }} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                            {lang === 'es' ? 'Todas las sesiones con neuropsicólogo' : 'All sessions with a neuropsychologist'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircle sx={{ color: '#f48fb1', fontSize: 14 }} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                            {lang === 'es' ? '4 encuentros de videollamada al mes' : '4 interactive video-calls per month'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircle sx={{ color: '#f48fb1', fontSize: 14 }} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                            {lang === 'es' ? 'Acompañamiento y apoyo diario de WhatsApp' : 'Daily continuous support via WhatsApp group'}
                                        </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <CheckCircle sx={{ color: '#f48fb1', fontSize: 14 }} />
                                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                            {lang === 'es' ? 'Desarrollo de habilidades y materiales' : 'Skills development & materials'}
                                        </Typography>
                                    </Box>
                                </Box>
                            </Box>
                            <Button
                                fullWidth
                                variant="contained"
                                onClick={() => handleWhatsAppContact('grupo')}
                                startIcon={<WhatsApp />}
                                sx={{
                                    bgcolor: '#f48fb1',
                                    color: '#000',
                                    borderRadius: 3,
                                    textTransform: 'none',
                                    fontWeight: 'bold',
                                    '&:hover': {
                                        bgcolor: '#f06292',
                                    }
                                }}
                            >
                                {lang === 'es' ? 'Inscribirse al Grupo' : 'Join the Group'}
                            </Button>
                        </Box>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                        <Button
                            variant="text"
                            onClick={() => setShowCommercial(false)}
                            sx={{
                                color: 'rgba(255,255,255,0.4)',
                                textTransform: 'none',
                                '&:hover': {
                                    color: '#fff'
                                }
                            }}
                        >
                            {lang === 'es' ? 'Volver a Aura' : 'Return to Aura'}
                        </Button>
                    </Box>
                </Box>
            </Box>
        );
    };

    const WhatsAppContactDialog = () => {
        const lang = localStorage.getItem('aura_language') || 'es';
        const waAppUrl = getWhatsAppUrl(whatsAppType, 'app');
        const waMeUrl = getWhatsAppUrl(whatsAppType, 'wa_me');

        return (
            <Dialog
                open={whatsAppDialogOpen}
                onClose={() => setWhatsAppDialogOpen(false)}
                maxWidth="xs"
                fullWidth
                sx={{ zIndex: 10000 }}
                PaperProps={{
                    sx: {
                        bgcolor: '#121226',
                        color: '#fff',
                        borderRadius: 4,
                        border: '1px solid rgba(37, 211, 102, 0.3)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
                    }
                }}
            >
                <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Box sx={{
                            bgcolor: '#25D366',
                            color: '#000',
                            p: 1,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <WhatsApp sx={{ fontSize: 24 }} />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                            {lang === 'es' ? 'Contacto por WhatsApp' : 'WhatsApp Contact'}
                        </Typography>
                    </Box>
                    <IconButton
                        onClick={() => setWhatsAppDialogOpen(false)}
                        sx={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>

                <DialogContent dividers sx={{ borderColor: 'rgba(255,255,255,0.08)', p: 2.5 }}>
                    <Box sx={{
                        bgcolor: 'rgba(255,255,255,0.03)',
                        p: 2,
                        borderRadius: 3,
                        border: '1px solid rgba(37, 211, 102, 0.25)',
                        mb: 2.5,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center'
                    }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)', mb: 1.5, fontWeight: 'bold' }}>
                            📱 {lang === 'es' ? 'Escanea con la cámara de tu celular:' : 'Scan with your mobile camera:'}
                        </Typography>
                        <Box sx={{ p: 1, bgcolor: '#fff', borderRadius: 2, display: 'inline-block', boxShadow: '0 4px 15px rgba(0,0,0,0.5)' }}>
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(waMeUrl)}`}
                                alt="WhatsApp QR Code"
                                style={{ width: 140, height: 140, display: 'block' }}
                            />
                        </Box>
                    </Box>

                    <Button
                        fullWidth
                        variant="contained"
                        onClick={() => {
                            if (isMobileDevice()) {
                                openWhatsAppDirect(waAppUrl);
                            } else {
                                window.open(waMeUrl, '_blank', 'noopener,noreferrer');
                            }
                        }}
                        startIcon={<WhatsApp />}
                        sx={{
                            bgcolor: '#25D366',
                            color: '#000',
                            fontWeight: 'bold',
                            textTransform: 'none',
                            borderRadius: 2.5,
                            py: 1.2,
                            fontSize: '0.9rem',
                            '&:hover': { bgcolor: '#20ba5a' }
                        }}
                    >
                        {lang === 'es' ? '📱 Abrir WhatsApp' : '📱 Open WhatsApp'}
                    </Button>

                    <Box sx={{
                        mt: 2.5,
                        p: 1.5,
                        bgcolor: 'rgba(255, 255, 255, 0.03)',
                        borderRadius: 2.5,
                        border: '1px solid rgba(255, 255, 255, 0.06)'
                    }}>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', lineHeight: 1.5, fontSize: '0.73rem', textAlign: 'center' }}>
                            {lang === 'es'
                                ? '📲 Escanea el código QR desde tu celular o presiona el botón para abrir WhatsApp directamente.'
                                : '📲 Scan the QR code from your phone or press the button to open WhatsApp directly.'}
                        </Typography>
                    </Box>
                </DialogContent>
            </Dialog>
        );
    };

    // ============================================================
    // RENDER - SPLASH SCREEN (LITE MODE - SIN DESCARGA)
    // ============================================================
    if (!loadFinished) {
        return (
            <ThemeProvider theme={darkTheme}>
                <CssBaseline />
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    bgcolor: '#0a0a1a',
                    background: 'radial-gradient(ellipse at center, #12122a 0%, #0a0a1a 100%)',
                    p: 3,
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <Box sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: '80%',
                        maxWidth: 600,
                        height: '80%',
                        maxHeight: 600,
                        borderRadius: '50%',
                        background: 'radial-gradient(circle, rgba(144, 202, 249, 0.05) 0%, transparent 70%)',
                        animation: 'pulseGlow 3s ease-in-out infinite'
                    }} />

                    <Box sx={{ position: 'relative', mb: 4 }}>
                        <Box sx={{
                            width: 120,
                            height: 120,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(144, 202, 249, 0.2), rgba(167, 139, 250, 0.2))',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            border: '2px solid rgba(144, 202, 249, 0.15)',
                            animation: 'float 3s ease-in-out infinite'
                        }}>
                            <Psychology sx={{
                                fontSize: 60,
                                color: '#90caf9',
                                animation: 'pulse 2s ease-in-out infinite'
                            }} />
                        </Box>
                        
                        <Box sx={{
                            position: 'absolute',
                            top: -10,
                            left: -10,
                            right: -10,
                            bottom: -10,
                            borderRadius: '50%',
                            border: '2px solid transparent',
                            borderTop: '2px solid rgba(144, 202, 249, 0.3)',
                            animation: 'spin 3s linear infinite'
                        }} />
                    </Box>

                    <Typography
                        variant="h5"
                        sx={{
                            fontWeight: 300,
                            color: '#90caf9',
                            mb: 1,
                            textAlign: 'center'
                        }}
                    >
                        🌿 Aura Lite
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: 'rgba(255,255,255,0.5)',
                            textAlign: 'center',
                            maxWidth: 400,
                            mb: 4
                        }}
                    >
                        {t('gpu_lite_desc')}
                    </Typography>

                    <Button
                        variant="contained"
                        onClick={() => setLoadFinished(true)}
                        sx={{
                            bgcolor: '#4ade80',
                            color: '#000',
                            fontWeight: 'bold',
                            py: 1.6,
                            px: 4,
                            borderRadius: 4,
                            fontSize: '1rem',
                            textTransform: 'none',
                            boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)',
                            '&:hover': {
                                bgcolor: '#22c55e',
                                boxShadow: '0 0 25px rgba(74, 222, 128, 0.5)'
                            }
                        }}
                        startIcon={<AutoAwesome />}
                    >
                        {t('lite_title')}
                    </Button>

                    <style>{`
                        @keyframes spin {
                            0% { transform: rotate(0deg); }
                            100% { transform: rotate(360deg); }
                        }
                        @keyframes pulse {
                            0%, 100% { opacity: 0.6; transform: scale(0.95); }
                            50% { opacity: 1; transform: scale(1.05); }
                        }
                        @keyframes float {
                            0%, 100% { transform: translateY(0px); }
                            50% { transform: translateY(-15px); }
                        }
                        @keyframes pulseGlow {
                            0%, 100% { opacity: 0.5; transform: translate(-50%, -50%) scale(1); }
                            50% { opacity: 1; transform: translate(-50%, -50%) scale(1.1); }
                        }
                    `}</style>
                </Box>
            </ThemeProvider>
        );
    }

    // ============================================================
    // MAIN APP RENDER
    // ============================================================
    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline/>
            
            {/* Warning agreement popup */}
            {!warningAccepted && showWarning && <WarningPopup />}
            
            {/* Commercial group benefits */}
            {showCommercial && <CommercialModal />}
            
            {/* WhatsApp Contact Helper Modal */}
            <WhatsAppContactDialog />
            
            {/* Custom elegant confirmation alert */}
            <ConfirmDialog />
            
            <AppBar position="static" sx={{ 
                bgcolor: '#121226',
                background: 'linear-gradient(90deg, #121226 0%, #161a36 50%, #1c1340 100%)',
                boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                zIndex: 1100
            }}>
                <Toolbar sx={{
                    maxWidth: '1200px !important',
                    width: '100%',
                    margin: '0 auto',
                    justifyContent: 'space-between',
                    px: { xs: 1, sm: 2 }
                }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
                        {loadFinished && (
                            <Tooltip title={t('chat_history')} arrow>
                                <Badge badgeContent={chatHistory.length} color="secondary" invisible={chatHistory.length === 0}>
                                    <IconButton 
                                        onClick={() => setHistoryDrawerOpen(true)}
                                        size="small"
                                        sx={{ 
                                            color: '#90caf9',
                                            '&:hover': {
                                                bgcolor: 'rgba(144, 202, 249, 0.1)'
                                            }
                                        }}
                                    >
                                        <History fontSize="small" />
                                    </IconButton>
                                </Badge>
                            </Tooltip>
                        )}
                        
                        <Box sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            position: 'relative'
                        }}>
                            <Psychology sx={{ fontSize: { xs: 24, sm: 28 }, color: '#90caf9' }} />
                            <Box sx={{
                                position: 'absolute',
                                top: -2,
                                right: -2,
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                bgcolor: '#4ade80',
                                boxShadow: '0 0 10px #4ade80',
                                animation: 'pulse 2s ease-in-out infinite'
                            }} />
                        </Box>
                        <Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <Typography variant="h6" component="div" sx={{ 
                                    fontWeight: 600,
                                    fontSize: { xs: '0.95rem', sm: '1.25rem' },
                                    background: 'linear-gradient(90deg, #90caf9, #a78bfa)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                }}>
                                    {t('app_name')}
                                </Typography>
                                <Chip 
                                    label={t('lite_badge')} 
                                    size="small" 
                                    sx={{ 
                                        bgcolor: 'rgba(74, 222, 128, 0.15)', 
                                        color: '#4ade80', 
                                        border: '1px solid rgba(74, 222, 128, 0.3)', 
                                        fontWeight: 'bold',
                                        fontSize: '0.6rem',
                                        height: 18
                                    }} 
                                />
                            </Box>
                            <Typography variant="caption" sx={{ 
                                color: '#4ade80',
                                display: { xs: 'none', sm: 'flex' },
                                alignItems: 'center',
                                gap: 0.5,
                                fontSize: '0.65rem'
                            }}>
                                {t('online')}
                            </Typography>
                        </Box>
                    </Box>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.2, sm: 0.8 } }}>
                        {/* Selector de idioma */}
                        <Tooltip title="Language / Idioma" arrow>
                            <IconButton
                                size="small"
                                onClick={(e) => setLangAnchorEl(e.currentTarget)}
                                sx={{
                                    color: 'rgba(255,255,255,0.6)',
                                    p: { xs: 0.5, sm: 1 },
                                    '&:hover': {
                                        color: '#fff',
                                        bgcolor: 'rgba(255,255,255,0.05)'
                                    }
                                }}
                            >
                                <Translate fontSize="small" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            anchorEl={langAnchorEl}
                            open={Boolean(langAnchorEl)}
                            onClose={() => setLangAnchorEl(null)}
                            PaperProps={{
                                sx: {
                                    bgcolor: '#1a1a2e',
                                    border: '1px solid rgba(255,255,255,0.05)',
                                    mt: 1
                                }
                            }}
                        >
                            <MenuItem onClick={() => handleLanguageChange('es')} sx={{ color: '#fff' }}>🇪🇸 Español</MenuItem>
                            <MenuItem onClick={() => handleLanguageChange('en')} sx={{ color: '#fff' }}>🇬🇧 English</MenuItem>
                            <MenuItem onClick={() => handleLanguageChange('de')} sx={{ color: '#fff' }}>🇩🇪 Deutsch</MenuItem>
                            <MenuItem onClick={() => handleLanguageChange('fr')} sx={{ color: '#fff' }}>🇫🇷 Français</MenuItem>
                            <MenuItem onClick={() => handleLanguageChange('it')} sx={{ color: '#fff' }}>🇮🇹 Italiano</MenuItem>
                            <MenuItem onClick={() => handleLanguageChange('pt')} sx={{ color: '#fff' }}>🇵🇹 Português</MenuItem>
                            <MenuItem onClick={() => handleLanguageChange('ja')} sx={{ color: '#fff' }}>🇯🇵 日本語</MenuItem>
                            <MenuItem onClick={() => handleLanguageChange('zh')} sx={{ color: '#fff' }}>🇨🇳 中文</MenuItem>
                            <MenuItem onClick={() => handleLanguageChange('ru')} sx={{ color: '#fff' }}>🇷🇺 Русский</MenuItem>
                        </Menu>

                        {loadFinished && (
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.3, sm: 0.8 } }}>
                                {/* NEURAL NETWORK BUTTON */}
                                <Tooltip title={localStorage.getItem('aura_language') === 'es' ? 'Red Neuronal' : 'Neural Net'} arrow>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => setShowNeuralModal(true)}
                                        startIcon={<Psychology sx={{ color: '#a78bfa' }} />}
                                        sx={{
                                            borderColor: 'rgba(167, 139, 250, 0.4)',
                                            color: '#a78bfa',
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            fontWeight: 'bold',
                                            minWidth: { xs: 34, sm: 'auto' },
                                            px: { xs: 0.8, sm: 1.5 },
                                            py: 0.5,
                                            fontSize: { xs: '0.72rem', sm: '0.8125rem' },
                                            '& .MuiButton-startIcon': {
                                                marginRight: { xs: 0, sm: 0.5 },
                                                marginLeft: { xs: 0, sm: -0.5 }
                                            },
                                            '&:hover': {
                                                borderColor: '#a78bfa',
                                                bgcolor: 'rgba(167, 139, 250, 0.1)'
                                            }
                                        }}
                                    >
                                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                            {localStorage.getItem('aura_language') === 'es' ? 'Red Neuronal' : 'Neural Net'}
                                        </Box>
                                    </Button>
                                </Tooltip>

                                {/* HOME BUTTON */}
                                <Tooltip title={t('tooltip_home')} arrow>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleGoHome}
                                        startIcon={<Spa />}
                                        sx={{
                                            borderColor: 'rgba(144, 202, 249, 0.3)',
                                            color: '#90caf9',
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            minWidth: { xs: 34, sm: 'auto' },
                                            px: { xs: 0.8, sm: 1.5 },
                                            py: 0.5,
                                            '& .MuiButton-startIcon': {
                                                marginRight: { xs: 0, sm: 0.5 },
                                                marginLeft: { xs: 0, sm: -0.5 }
                                            },
                                            '&:hover': {
                                                borderColor: '#90caf9',
                                                bgcolor: 'rgba(144, 202, 249, 0.1)'
                                            }
                                        }}
                                    >
                                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                            {t('btn_home')}
                                        </Box>
                                    </Button>
                                </Tooltip>

                                {/* NEW CHAT BUTTON */}
                                <Tooltip title={t('new_chat')} arrow>
                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={handleNewChat}
                                        startIcon={<Add />}
                                        sx={{
                                            borderColor: 'rgba(167, 139, 250, 0.3)',
                                            color: '#a78bfa',
                                            borderRadius: 2,
                                            textTransform: 'none',
                                            minWidth: { xs: 34, sm: 'auto' },
                                            px: { xs: 0.8, sm: 1.5 },
                                            py: 0.5,
                                            '& .MuiButton-startIcon': {
                                                marginRight: { xs: 0, sm: 0.5 },
                                                marginLeft: { xs: 0, sm: -0.5 }
                                            },
                                            '&:hover': {
                                                borderColor: '#a78bfa',
                                                bgcolor: 'rgba(167, 139, 250, 0.1)'
                                            }
                                        }}
                                    >
                                        <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                                            {t('new_chat')}
                                        </Box>
                                    </Button>
                                </Tooltip>
                            </Box>
                        )}
                    </Box>
                </Toolbar>
            </AppBar>

            {/* CHAT HISTORY DRAWER */}
            <Drawer
                anchor="left"
                open={historyDrawerOpen}
                onClose={() => setHistoryDrawerOpen(false)}
                PaperProps={{
                    sx: { 
                        width: { xs: '85vw', sm: 380 },
                        maxWidth: '100vw',
                        bgcolor: '#12121f',
                        borderRight: '1px solid rgba(255,255,255,0.05)'
                    }
                }}
            >
                <Box sx={{ 
                    p: 2, 
                    bgcolor: 'rgba(144, 202, 249, 0.05)',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Typography variant="h6" sx={{ color: '#90caf9', fontWeight: 600 }}>
                        <History sx={{ verticalAlign: 'middle', mr: 1, fontSize: 22 }} />
                        {t('chat_history')}
                    </Typography>
                    <IconButton 
                        onClick={() => setHistoryDrawerOpen(false)}
                        sx={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                        <Close />
                    </IconButton>
                </Box>
                
                <Box sx={{ p: 2, flex: 1, overflow: 'auto' }}>
                    {chatHistory.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 6 }}>
                            <Chat sx={{ fontSize: 48, color: 'rgba(255,255,255,0.1)', mb: 2 }} />
                            <Typography color="rgba(255,255,255,0.3)">
                                {t('no_history')}
                            </Typography>
                        </Box>
                    ) : (
                        <List>
                            {chatHistory.map((chat) => (
                                <ListItem
                                    key={chat.id}
                                    disablePadding
                                    sx={{ 
                                        mb: 1,
                                        borderRadius: 2,
                                        '&:hover': {
                                            bgcolor: 'rgba(255,255,255,0.03)'
                                        }
                                    }}
                                >
                                    <Box sx={{ 
                                        display: 'flex', 
                                        flexDirection: 'column', 
                                        width: '100%',
                                        p: 1.5
                                    }}>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                            <Typography sx={{ 
                                                color: 'rgba(255,255,255,0.85)',
                                                fontWeight: 500,
                                                fontSize: '0.9rem',
                                                flex: 1,
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis'
                                            }}>
                                                {chat.title}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.3)', ml: 1 }}>
                                                {formatDate(chat.date)}
                                            </Typography>
                                        </Box>
                                        
                                        <Typography variant="caption" sx={{ 
                                            color: 'rgba(255,255,255,0.4)', 
                                            display: 'block',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            mt: 0.5
                                        }}>
                                            {chat.lastMessage || t('no_messages')}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', gap: 1, mt: 1.5, justifyContent: 'flex-start' }}>
                                            <Button
                                                size="small"
                                                variant="outlined"
                                                onClick={() => handleViewChat(chat)}
                                                startIcon={<Visibility />}
                                                sx={{
                                                    borderColor: 'rgba(144, 202, 249, 0.2)',
                                                    color: '#90caf9',
                                                    fontSize: '0.7rem',
                                                    textTransform: 'none'
                                                }}
                                            >
                                                {t('view_conversation')}
                                            </Button>
                                            
                                            <IconButton 
                                                size="small" 
                                                onClick={() => handleDeleteChat(chat.id)}
                                                sx={{ 
                                                    color: 'rgba(255,255,255,0.2)',
                                                    '&:hover': {
                                                        color: '#e74c3c',
                                                        bgcolor: 'rgba(231, 76, 60, 0.1)'
                                                    }
                                                }}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    )}
                </Box>
                
                {chatHistory.length > 0 && (
                    <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                        <Button
                            fullWidth
                            variant="outlined"
                            size="small"
                            onClick={handleDeleteAllChats}
                            startIcon={<Delete />}
                            sx={{
                                borderColor: 'rgba(231, 76, 60, 0.3)',
                                color: '#e74c3c',
                                '&:hover': {
                                    borderColor: '#e74c3c',
                                    bgcolor: 'rgba(231, 76, 60, 0.1)'
                                }
                            }}
                        >
                            {t('delete_all')}
                        </Button>
                    </Box>
                )}
            </Drawer>

            {/* DIALOG TO VIEW COMPLETED CHAT */}
            <Dialog
                open={viewChatDialogOpen}
                onClose={() => setViewChatDialogOpen(false)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        bgcolor: '#1a1a2e',
                        borderRadius: 3,
                        border: '1px solid rgba(255,255,255,0.05)',
                        maxHeight: '80vh'
                    }
                }}
            >
                <DialogTitle sx={{ 
                    color: '#90caf9', 
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}>
                    <Box>
                        <Chat sx={{ verticalAlign: 'middle', mr: 1 }} />
                        {viewingChat?.title}
                    </Box>
                    <IconButton 
                        onClick={() => setViewChatDialogOpen(false)}
                        sx={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                        <Close />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ p: 2, overflow: 'auto' }}>
                    {viewingChat && viewingChat.messages.map((msg, idx) => (
                        <Box
                            key={idx}
                            sx={{
                                display: 'flex',
                                justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                mb: 2
                            }}
                        >
                            <Paper
                                sx={{
                                    p: 2,
                                    maxWidth: '80%',
                                    bgcolor: msg.role === 'user' ? '#162a45' : '#14142b',
                                    border: msg.role === 'user' 
                                        ? '1px solid rgba(144, 202, 249, 0.35)' 
                                        : '1px solid rgba(255,255,255,0.12)',
                                    borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                }}
                            >
                                <Typography
                                    variant="caption"
                                    sx={{ 
                                        color: msg.role === 'user' ? '#90caf9' : 'rgba(255,255,255,0.4)',
                                        display: 'block',
                                        mb: 0.5,
                                        fontSize: '0.65rem',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    {msg.role === 'user' ? t('close') : t('app_name')}
                                </Typography>
                                <Box className="markdown-body" sx={{ 
                                    '& p': { margin: 0, color: '#fff' },
                                    '& strong': { color: '#90caf9' }
                                }}>
                                    <Markdown components={markdownComponents}>{msg.content}</Markdown>
                                </Box>
                            </Paper>
                        </Box>
                    ))}
                </DialogContent>
                <DialogActions sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <Button onClick={() => setViewChatDialogOpen(false)} sx={{ color: '#90caf9' }}>
                        {t('close')}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* CORE BODY WRAPPER - CON SCROLL PARA EL TECLADO */}
            <Box
                ref={chatContainerRef}
                sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: 'calc(100vh - 64px)',
                    bgcolor: '#0a0a1a',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                {/* Contenedor de mensajes con scroll automático */}
                <Box
                    sx={{
                        flex: 1,
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        px: { xs: 1.5, sm: 3 },
                        py: 2,
                        pb: `calc(${keyboardHeight > 0 ? keyboardHeight + 130 : 160}px)`,
                        transition: 'padding-bottom 0.15s ease-out',
                        maxHeight: '100vh',
                        WebkitOverflowScrolling: 'touch',
                        scrollBehavior: 'smooth'
                    }}
                >
                    {criticalError && (
                        <Paper sx={{ p: 3, bgcolor: 'rgba(231, 76, 60, 0.1)', border: '1px solid rgba(231, 76, 60, 0.2)', mb: 3 }}>
                            <Typography color="error">{criticalError}</Typography>
                        </Paper>
                    )}

                    {loadFinished && messageHistory.length === 0 && (
                        <Fade in timeout={800}>
                            <Box>
                                <Box sx={{ 
                                    mb: 4,
                                    p: 3,
                                    bgcolor: 'rgba(144, 202, 249, 0.04)',
                                    borderRadius: 4,
                                    border: '1px solid rgba(144, 202, 249, 0.08)'
                                }}>
                                    <Typography variant="h5" sx={{ mb: 2, fontWeight: 'bold', color: '#90caf9' }}>
                                        {t('welcome_title')}
                                    </Typography>
                                    <Box sx={{ '& p': { color: 'rgba(255,255,255,0.85)', lineHeight: 1.8 } }}>
                                        <Markdown>{t('welcome_text')}</Markdown>
                                    </Box>

                                    <Box sx={{ display: 'flex', gap: 1, mt: 2, mb: 1, flexWrap: 'wrap' }}>
                                        <Button
                                            size="small"
                                            variant="outlined"
                                            startIcon={<ContentCopy />}
                                            onClick={() => handleQuickQuestion("Hola Aura 🌿, me gustaría empezar a platicar contigo sobre cómo me siento hoy.")}
                                            sx={{
                                                borderColor: 'rgba(144, 202, 249, 0.3)',
                                                color: '#90caf9',
                                                borderRadius: 2.5,
                                                textTransform: 'none',
                                                fontSize: '0.8rem',
                                                fontWeight: 'bold',
                                                px: 2,
                                                py: 0.8,
                                                '&:hover': {
                                                    borderColor: '#90caf9',
                                                    bgcolor: 'rgba(144, 202, 249, 0.12)'
                                                }
                                            }}
                                        >
                                            📋 Copiar saludo inicial al chat
                                        </Button>
                                    </Box>
                                </Box>

                                <Typography variant="body2" sx={{ 
                                    color: '#90caf9',
                                    mb: 2,
                                    fontSize: '0.8rem',
                                    fontWeight: 'bold',
                                    letterSpacing: 1,
                                    textAlign: 'center'
                                }}>
                                    {t('quick_questions_title')}
                                </Typography>

                                <Box sx={{ 
                                    display: 'flex', 
                                    flexWrap: 'wrap', 
                                    gap: 1,
                                    justifyContent: 'center'
                                }}>
                                    {quickQuestions.map((q, index) => (
                                        <Zoom in key={index} style={{ transitionDelay: `${index * 40}ms` }}>
                                            <Chip
                                                icon={q.icon}
                                                label={q.text}
                                                onClick={() => handleQuickQuestion(q.text)}
                                                sx={{
                                                    height: 'auto',
                                                    py: 1,
                                                    px: 0.5,
                                                    color: '#fff',
                                                    borderColor: `${q.color}40`,
                                                    bgcolor: 'rgba(255,255,255,0.02)',
                                                    border: `1px solid ${q.color}25`,
                                                    '& .MuiChip-label': {
                                                        whiteSpace: 'normal',
                                                        padding: '4px 12px',
                                                        fontSize: '0.82rem'
                                                    },
                                                    '& .MuiChip-icon': {
                                                        color: q.color,
                                                        fontSize: '1.1rem'
                                                    },
                                                    '&:hover': {
                                                        bgcolor: `${q.color}15`,
                                                        borderColor: `${q.color}60`,
                                                        transform: 'translateY(-2px)'
                                                    },
                                                    transition: 'all 0.2s'
                                                }}
                                            />
                                        </Zoom>
                                    ))}
                                </Box>
                            </Box>
                        </Fade>
                    )}

                    {messageHistory.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, py: 2 }}>
                            {messageHistory.map((message, i) => {
                                const safeContent = getSafeText(message.content);
                                const isUser = message.role === 'user';
                                if (!safeContent.trim() && !isGenerating) return null;
                                
                                return (
                                    <Fade in key={i} timeout={300}>
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: isUser ? 'flex-end' : 'flex-start',
                                            width: '100%'
                                        }}>
                                            <Paper
                                                sx={{
                                                    p: 2,
                                                    maxWidth: '85%',
                                                    bgcolor: isUser ? '#162a45' : '#14142b',
                                                    border: isUser 
                                                        ? '1px solid rgba(144, 202, 249, 0.35)' 
                                                        : '1px solid rgba(255,255,255,0.12)',
                                                    borderRadius: isUser ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                                                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 0.8 }}>
                                                    <Typography
                                                        variant="caption" 
                                                        sx={{ 
                                                            color: isUser ? '#90caf9' : 'rgba(255,255,255,0.4)',
                                                            fontSize: '0.65rem',
                                                            fontWeight: 'bold',
                                                            textTransform: 'uppercase',
                                                            letterSpacing: 1
                                                        }}
                                                    >
                                                        {isUser ? (localStorage.getItem('aura_language') === 'es' ? 'Tú' : 'User') : t('app_name')}
                                                    </Typography>
                                                    <Tooltip title={localStorage.getItem('aura_language') === 'es' ? 'Copiar este texto al campo de chat' : 'Copy this text to chat'} arrow>
                                                        <IconButton
                                                            size="small"
                                                            onClick={() => copyToInput(safeContent)}
                                                            sx={{
                                                                color: isUser ? 'rgba(144, 202, 249, 0.7)' : 'rgba(255,255,255,0.4)',
                                                                p: 0.3,
                                                                '&:hover': { color: '#fff', bgcolor: 'rgba(255,255,255,0.1)' }
                                                            }}
                                                        >
                                                            <ContentCopy sx={{ fontSize: '0.85rem' }} />
                                                        </IconButton>
                                                    </Tooltip>
                                                </Box>
                                                
                                                <Box className="markdown-body" sx={{ 
                                                    '& p': { margin: 0, color: 'rgba(255,255,255,0.95)', lineHeight: 1.7 },
                                                    '& strong': { color: '#90caf9' },
                                                    '& em': { color: 'rgba(255,255,255,0.6)' },
                                                    '& h1, & h2, & h3, & h4': { color: '#90caf9', mt: 1, mb: 1 },
                                                    '& ul, & ol': { color: 'rgba(255,255,255,0.9)', pl: 2 }
                                                }}>
                                                    {safeContent ? (
                                                        <Markdown components={markdownComponents}>{safeContent}</Markdown>
                                                    ) : (
                                                        <Box sx={{ display: 'flex', gap: 0.5, py: 1 }}>
                                                            <Box sx={{ width: 8, height: 8, bgcolor: '#90caf9', borderRadius: '50%', animation: 'typing 1s infinite' }} />
                                                            <Box sx={{ width: 8, height: 8, bgcolor: '#90caf9', borderRadius: '50%', animation: 'typing 1s infinite 0.2s' }} />
                                                            <Box sx={{ width: 8, height: 8, bgcolor: '#90caf9', borderRadius: '50%', animation: 'typing 1s infinite 0.4s' }} />
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Paper>
                                        </Box>
                                    </Fade>
                                );
                            })}
                            <div ref={chatEndRef} />
                        </Box>
                    )}
                </Box>

                {/* BOTTOM FIXED CHAT INPUT PANEL - CON SOPORTE PARA TECLADO */}
                {!criticalError && loadFinished && (
                    <Box sx={{
                        position: 'fixed',
                        bottom: keyboardHeight > 0 ? keyboardHeight : '0px',
                        left: 0,
                        right: 0,
                        bgcolor: '#0a0a1a',
                        borderTop: '1px solid rgba(144, 202, 249, 0.15)',
                        p: { xs: 1.5, sm: 2 },
                        pb: keyboardHeight > 0 
                            ? { xs: 'calc(8px + env(safe-area-inset-bottom))', sm: 'calc(8px + env(safe-area-inset-bottom))' } 
                            : 'calc(12px + env(safe-area-inset-bottom))',
                        zIndex: 1100,
                        transition: 'bottom 0.1s ease-out, padding-bottom 0.1s ease-out'
                    }}>
                        <Box sx={{ maxWidth: '840px', mx: 'auto', width: '100%' }}>
                            
                            {/* STOP GENERATION CONTROL BUTTON */}
                            {isGenerating && (
                                <Box sx={{ 
                                    display: 'flex', 
                                    justifyContent: 'center', 
                                    mb: 1.5,
                                    animation: 'fadeIn 0.3s ease'
                                }}>
                                    <Button
                                        variant="contained"
                                        color="error"
                                        onClick={handleStop}
                                        startIcon={<Stop />}
                                        sx={{
                                            bgcolor: '#ff4d4d',
                                            borderRadius: 4,
                                            px: 3,
                                            py: 0.8,
                                            fontSize: '0.8rem',
                                            textTransform: 'none',
                                            boxShadow: '0 4px 15px rgba(255, 77, 77, 0.3)',
                                            '&:hover': {
                                                bgcolor: '#ff3333',
                                                transform: 'translateY(-1px)'
                                            },
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        {t('btn_stop')}
                                    </Button>
                                </Box>
                            )}

                            <Paper 
                                component="form" 
                                onSubmit={submitPrompt}
                                sx={{
                                    p: '6px 12px',
                                    display: 'flex',
                                    alignItems: 'flex-end',
                                    width: '100%',
                                    bgcolor: 'rgba(255,255,255,0.06)',
                                    borderRadius: 3.5,
                                    border: '1px solid rgba(144, 202, 249, 0.25)',
                                    backdropFilter: 'blur(10px)',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)'
                                }}
                            >
                                <TextField
                                    fullWidth
                                    multiline
                                    minRows={1}
                                    maxRows={4}
                                    variant="standard"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    placeholder={messageHistory.length === 0 ? t('input_placeholder_empty') : t('input_placeholder')}
                                    disabled={isGenerating}
                                    inputRef={inputRef}
                                    sx={{
                                        ml: 1, 
                                        mr: 1,
                                        mb: 0.3,
                                        flex: 1,
                                        '& .MuiInputBase-root': {
                                            color: '#fff',
                                            fontSize: { xs: '0.95rem', sm: '1rem' },
                                            lineHeight: 1.45,
                                            py: 0.5,
                                            '&:before, &:after': {
                                                display: 'none'
                                            }
                                        }
                                    }}
                                    slotProps={{ input: { disableUnderline: true } }}
                                    onFocus={() => {
                                        // Scroll al final cuando el input recibe foco
                                        setTimeout(() => {
                                            chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                                        }, 100);
                                        setTimeout(() => {
                                            chatEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
                                        }, 300);
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            submitPrompt();
                                        }
                                    }}
                                />
                                
                                {isGenerating ? (
                                    <IconButton 
                                        onClick={handleStop}
                                        sx={{ 
                                            p: '8px',
                                            mb: 0.2,
                                            color: '#ff4d4d',
                                            bgcolor: 'rgba(255, 77, 77, 0.1)',
                                            '&:hover': {
                                                bgcolor: 'rgba(255, 77, 77, 0.2)'
                                            }
                                        }}
                                    >
                                        <Stop />
                                    </IconButton>
                                ) : (
                                    <IconButton 
                                        type="submit" 
                                        disabled={!inputValue.trim()}
                                        sx={{ 
                                            p: '8px',
                                            mb: 0.2,
                                            color: inputValue.trim() ? '#90caf9' : 'rgba(255,255,255,0.2)',
                                            '&:hover': {
                                                color: '#90caf9',
                                                bgcolor: 'rgba(144, 202, 249, 0.1)'
                                            }
                                        }} 
                                        aria-label={t('send')}
                                    >
                                        <Send/>
                                    </IconButton>
                                )}
                            </Paper>
                            
                            <Typography variant="caption" sx={{ 
                                display: 'block', 
                                textAlign: 'center', 
                                mt: 1,
                                color: 'rgba(255,255,255,0.2)',
                                fontSize: '0.65rem',
                                letterSpacing: 0.5
                            }}>
                                {t('footer')} · {chatHistory.length} {t('sessions_count')}
                            </Typography>
                        </Box>
                    </Box>
                )}
            </Box>

            {/* Back to top welcome screen floating button */}
            {loadFinished && messageHistory.length > 0 && (
                <Zoom in>
                    <Tooltip title={t('tooltip_home')} arrow placement="left">
                        <Fab
                            onClick={handleGoHome}
                            sx={{
                                position: 'fixed',
                                bottom: 110,
                                right: 30,
                                bgcolor: 'rgba(144, 202, 249, 0.12)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(144, 202, 249, 0.15)',
                                color: '#90caf9',
                                '&:hover': {
                                    bgcolor: 'rgba(144, 202, 249, 0.25)',
                                    transform: 'scale(1.1)',
                                    boxShadow: '0 0 20px rgba(144, 202, 249, 0.3)'
                                },
                                transition: 'all 0.3s',
                                zIndex: 1000
                            }}
                        >
                            <Spa />
                        </Fab>
                    </Tooltip>
                </Zoom>
            )}

            {/* Neural Network Associative Learning Modal */}
            <NeuralNetworkModal
                open={showNeuralModal}
                onClose={() => setShowNeuralModal(false)}
                lang={localStorage.getItem('aura_language') || 'es'}
            />

            <style>{`
                @keyframes typing {
                    0%, 100% { transform: translateY(0); opacity: 0.5; }
                    50% { transform: translateY(-4px); opacity: 1; }
                }
                @keyframes fadeIn {
                    0% { opacity: 0; transform: scale(0.95); }
                    100% { opacity: 1; transform: scale(1); }
                }
                /* Smooth scroll para el contenedor de mensajes */
                .message-container {
                    scroll-behavior: smooth;
                    -webkit-overflow-scrolling: touch;
                }
                /* Asegurar que el input sea visible en móviles */
                input, textarea {
                    font-size: 16px !important; /* Previene zoom automático en iOS */
                }
            `}</style>
        </ThemeProvider>
    );
}

const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#0a0a1a',
            paper: '#14142b',
        },
        primary: {
            main: '#90caf9',
        },
        secondary: {
            main: '#a78bfa',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(255,255,255,0.6)',
        },
    },
    typography: {
        fontFamily: "'Segoe UI', 'Helvetica Neue', Arial, sans-serif",
        body1: {
            fontSize: '0.95rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.85rem',
            lineHeight: 1.5,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                    boxShadow: 'none',
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                }
            }
        },
        MuiDrawer: {
            styleOverrides: {
                paper: {
                    backgroundImage: 'none',
                }
            }
        }
    }
});