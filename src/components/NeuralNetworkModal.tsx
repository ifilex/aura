import React, { useState, useEffect } from 'react';
import {
    Dialog as MuiDialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    Grid as MuiGrid,
    LinearProgress,
    Chip,
    Paper,
    Divider,
    IconButton,
    Tooltip,
    Tab,
    Tabs
} from '@mui/material';

const Dialog = MuiDialog as any;
const Grid = MuiGrid as any;
import {
    Psychology,
    Spa,
    AutoAwesome,
    Close,
    Refresh,
    TrendingUp,
    Memory,
    Timeline,
    Lightbulb,
    FitnessCenter,
    School
} from '@mui/icons-material';
import { auraNeuralEngine, NeuralNode, UserMemoryProfile } from '../AuraNeuralEngine.ts';

interface NeuralNetworkModalProps {
    open: boolean;
    onClose: () => void;
    lang?: string;
}

export const NeuralNetworkModal: React.FC<NeuralNetworkModalProps> = ({ open, onClose, lang = 'es' }) => {
    const [nodes, setNodes] = useState<NeuralNode[]>([]);
    const [profile, setProfile] = useState<UserMemoryProfile | null>(null);
    const [tabIndex, setTabIndex] = useState<number>(0);

    const refreshData = () => {
        setNodes(auraNeuralEngine.getNodes());
        setProfile({ ...auraNeuralEngine.getMemoryProfile() });
    };

    useEffect(() => {
        if (open) {
            refreshData();
        }
    }, [open]);

    const handleResetMemory = () => {
        if (window.confirm(lang === 'es' ? '¿Deseas reiniciar el aprendizaje y la memoria neuronal de Aura?' : 'Reset Aura\'s neural memory and learned weights?')) {
            auraNeuralEngine.resetMemory();
            refreshData();
        }
    };

    const getDomainColor = (domain: string) => {
        switch (domain) {
            case 'neuro': return '#a78bfa'; // Purple
            case 'behavior': return '#60a5fa'; // Blue
            case 'zen': return '#34d399'; // Green
            case 'cognition': return '#f59e0b'; // Amber
            default: return '#90caf9';
        }
    };

    const getDomainTitle = (domain: string) => {
        switch (domain) {
            case 'neuro': return lang === 'es' ? '🧠 Neuropsicología & Cerebro' : '🧠 Neuropsychology & Brain';
            case 'behavior': return lang === 'es' ? '⚡ Psicología de Conducta' : '⚡ Behavioral Psychology';
            case 'zen': return lang === 'es' ? '🧘 Zen & Atención Plena' : '🧘 Zen & Mindfulness';
            case 'cognition': return lang === 'es' ? '💡 Cognición & Metacognición' : '💡 Cognition & Metacognition';
            default: return domain;
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    bgcolor: '#121226',
                    color: '#fff',
                    borderRadius: 3,
                    border: '1px solid rgba(167, 139, 250, 0.25)',
                    backgroundImage: 'radial-gradient(circle at top right, rgba(167, 139, 250, 0.08), transparent 40%)'
                }
            }}
        >
            <DialogTitle sx={{ m: 0, p: 2.5, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Psychology sx={{ fontSize: 32, color: '#a78bfa' }} />
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700, background: 'linear-gradient(90deg, #a78bfa, #34d399)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                            {lang === 'es' ? 'Red Neuronal de Aprendizaje Aura' : 'Aura Neural Associative Network'}
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                            {lang === 'es' ? 'Algoritmo de Asociación Cognitiva, Neuropsicología y Memoria Adaptativa' : 'Cognitive Association, Neuropsychology & Adaptive Memory Algorithm'}
                        </Typography>
                    </Box>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.6)', '&:hover': { color: '#fff' } }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <Box sx={{ borderBottom: 1, borderColor: 'rgba(255, 255, 255, 0.08)', px: 2 }}>
                <Tabs value={tabIndex} onChange={(_, v) => setTabIndex(v)} textColor="inherit" indicatorColor="secondary">
                    <Tab icon={<Memory sx={{ fontSize: 18 }} />} iconPosition="start" label={lang === 'es' ? "Nodos y Sinapsis" : "Nodes & Synapses"} sx={{ textTransform: 'none', fontWeight: 600 }} />
                    <Tab icon={<Timeline sx={{ fontSize: 18 }} />} iconPosition="start" label={lang === 'es' ? "Memoria Aprendida" : "Learned Memory"} sx={{ textTransform: 'none', fontWeight: 600 }} />
                </Tabs>
            </Box>

            <DialogContent sx={{ p: 3 }}>
                {tabIndex === 0 && (
                    <Box>
                        <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                            {lang === 'es'
                                ? 'Esta red neuronal asocia lo que conversas con 4 dominios del conocimiento. Con cada turno, las sinapsis se refuerzan (aprendizaje asociativo) para adaptar el diálogo a tus necesidades.'
                                : 'This associative neural network links your dialogue with 4 knowledge domains. With every interaction, synapses reinforce to tailor responses to your mindset.'}
                        </Typography>

                        <Grid container spacing={2.5}>
                            {['neuro', 'behavior', 'zen', 'cognition'].map((dom) => {
                                const domainNodes = nodes.filter(n => n.domain === dom);
                                const domColor = getDomainColor(dom);

                                return (
                                    <Grid item xs={12} md={6} key={dom}>
                                        <Paper
                                            elevation={0}
                                            sx={{
                                                p: 2,
                                                bgcolor: 'rgba(255,255,255,0.03)',
                                                borderRadius: 2,
                                                border: `1px solid ${domColor}33`,
                                                height: '100%'
                                            }}
                                        >
                                            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: domColor, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                {getDomainTitle(dom)}
                                            </Typography>

                                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                                {domainNodes.map(node => {
                                                    const actPct = Math.round(node.activation * 100);
                                                    return (
                                                        <Box key={node.id}>
                                                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                                                <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600 }}>
                                                                    {node.label[lang] || node.label['es']}
                                                                </Typography>                                                                <Typography variant="caption" sx={{ color: domColor, fontWeight: 700 }}>
                                                                    {actPct}% | Peso: {node.synapseWeight.toFixed(2)}x
                                                                </Typography>
                                                            </Box>
                                                            <LinearProgress
                                                                variant="determinate"
                                                                value={actPct}
                                                                sx={{
                                                                    height: 6,
                                                                    borderRadius: 3,
                                                                    bgcolor: 'rgba(255,255,255,0.08)',
                                                                    '& .MuiLinearProgress-bar': {
                                                                        borderRadius: 3,
                                                                        bgcolor: domColor
                                                                    }
                                                                }}
                                                            />
                                                        </Box>
                                                    );
                                                })}
                                            </Box>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </Box>
                )}

                {tabIndex === 1 && profile && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
                        {/* Profile Summary Card */}
                        <Paper sx={{ p: 2.5, bgcolor: 'rgba(167, 139, 250, 0.08)', border: '1px solid rgba(167, 139, 250, 0.2)', borderRadius: 2 }}>
                            <Grid container spacing={2} alignItems="center">
                                <Grid item xs={12} sm={4}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                                        {lang === 'es' ? 'Usuario Identificado' : 'Identified User'}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: '#34d399', fontWeight: 700 }}>
                                        {profile.userName || (lang === 'es' ? 'Amigo en Silencio' : 'Anonymous Traveler')}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                                        {lang === 'es' ? 'Turnos de Diálogo' : 'Total Dialogue Turns'}
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: '#60a5fa', fontWeight: 700 }}>
                                        {profile.totalTurns} {lang === 'es' ? 'interacciones' : 'interactions'}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6} sm={4}>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>
                                        {lang === 'es' ? 'Dominio Predominante' : 'Dominant Domain'}
                                    </Typography>
                                    <Chip
                                        label={getDomainTitle(profile.dominantDomain)}
                                        size="small"
                                        sx={{
                                            bgcolor: `${getDomainColor(profile.dominantDomain)}22`,
                                            color: getDomainColor(profile.dominantDomain),
                                            fontWeight: 700,
                                            mt: 0.5
                                        }}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>

                        {/* Themes and Facts */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" sx={{ color: '#f59e0b', fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <Lightbulb sx={{ fontSize: 18 }} />
                                        {lang === 'es' ? 'Temas y Patrones Recurrentes' : 'Recurring Themes & Patterns'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {Object.keys(profile.recurringThemes).length > 0 ? (
                                            Object.entries(profile.recurringThemes).map(([theme, count]) => (
                                                <Chip
                                                    key={theme}
                                                    label={`${theme} (${count})`}
                                                    size="small"
                                                    sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', border: '1px solid rgba(245, 158, 11, 0.3)' }}
                                                />
                                            ))
                                        ) : (
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                {lang === 'es' ? 'Conforme converses, Aura irá registrando los temas centrales.' : 'As you chat, key themes will be identified here.'}
                                            </Typography>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
                                    <Typography variant="subtitle2" sx={{ color: '#34d399', fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                        <AutoAwesome sx={{ fontSize: 18 }} />
                                        {lang === 'es' ? 'Conceptos Clave Aprendidos' : 'Learned Key Concepts'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                        {profile.learnedFacts.length > 0 ? (
                                            profile.learnedFacts.map((fact, idx) => (
                                                <Chip
                                                    key={idx}
                                                    label={fact}
                                                    size="small"
                                                    sx={{ bgcolor: 'rgba(52, 211, 153, 0.15)', color: '#34d399', border: '1px solid rgba(52, 211, 153, 0.3)' }}
                                                />
                                            ))
                                        ) : (
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                {lang === 'es' ? 'No hay conceptos específicos guardados aún.' : 'No specific concepts saved yet.'}
                                            </Typography>
                                        )}
                                    </Box>
                                </Paper>
                            </Grid>
                        </Grid>

                        {/* Emotional Trajectory */}
                        <Paper sx={{ p: 2, bgcolor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#a78bfa', fontWeight: 700, mb: 1.5, display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Timeline sx={{ fontSize: 18 }} />
                                {lang === 'es' ? 'Trayectoria de Estado Emocional' : 'Emotional Trajectory'}
                            </Typography>
                            {profile.emotionalTrajectory.length > 0 ? (
                                <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, height: 80, pt: 2, pb: 1, px: 1 }}>
                                    {profile.emotionalTrajectory.map((item, index) => {
                                        const heightPct = Math.min(100, Math.max(15, item.stressLevel * 10));
                                        return (
                                            <Tooltip key={index} title={`${item.emotion} (Nivel: ${item.stressLevel}/10)`} arrow>
                                                <Box
                                                    sx={{
                                                        flex: 1,
                                                        height: `${heightPct}%`,
                                                        bgcolor: item.stressLevel > 6 ? '#f87171' : item.stressLevel > 4 ? '#fbbf24' : '#34d399',
                                                        borderRadius: '4px 4px 0 0',
                                                        transition: 'height 0.3s ease'
                                                    }}
                                                />
                                            </Tooltip>
                                        );
                                    })}
                                </Box>
                            ) : (
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                    {lang === 'es' ? 'La gráfica emocional se dibujará con tus mensajes.' : 'Your emotional timeline will be displayed here.'}
                                </Typography>
                            )}
                        </Paper>
                    </Box>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2.5, justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <Button
                    onClick={handleResetMemory}
                    color="error"
                    size="small"
                    startIcon={<Refresh />}
                    sx={{ textTransform: 'none' }}
                >
                    {lang === 'es' ? 'Reiniciar Memoria Neuronal' : 'Reset Neural Memory'}
                </Button>
                <Button
                    onClick={onClose}
                    variant="contained"
                    sx={{
                        bgcolor: '#a78bfa',
                        color: '#121226',
                        fontWeight: 700,
                        textTransform: 'none',
                        '&:hover': { bgcolor: '#c4b5fd' }
                    }}
                >
                    {lang === 'es' ? 'Entendido' : 'Close'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
