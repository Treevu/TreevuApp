import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChartBarIcon, UsersIcon, ArrowTrendingDownIcon, HandThumbUpIcon, BanknotesIcon } from '../Icons';

const insights = [
    {
        icon: ChartBarIcon,
        stat: '49%',
        description: 'de los colaboradores admiten que el estrés financiero los distrae en el trabajo.',
        source: 'Fuente: PwC, 2023'
    },
    {
        icon: UsersIcon,
        stat: '2x',
        description: 'más probable es que un colaborador con estrés financiero busque activamente un nuevo empleo.',
        source: 'Fuente: John Hancock Report'
    },
    {
        icon: ArrowTrendingDownIcon,
        stat: '28%',
        description: 'es la reducción potencial en la rotación de personal al implementar programas de bienestar financiero.',
        source: 'Fuente: Deloitte'
    },
    {
        icon: HandThumbUpIcon,
        stat: '78%',
        description: 'de los talentos se sienten más atraídos por empresas que demuestran cuidar su bienestar financiero.',
        source: 'Fuente: MetLife'
    },
    {
        icon: BanknotesIcon,
        stat: 'S/ 15,000',
        description: 'es el costo anual promedio en pérdida de productividad por cada colaborador con estrés financiero.',
        source: 'Fuente: Morgan Stanley'
    },
];

const StrategicInsightsCarousel: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isPaused, setIsPaused] = useState(false);
    const timeoutRef = useRef<number | null>(null);

    const resetTimeout = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    }, []);

    const setNextSlide = useCallback(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % insights.length);
    }, []);
    
    useEffect(() => {
        resetTimeout();
        if (!isPaused) {
            timeoutRef.current = window.setTimeout(setNextSlide, 7000);
        }
        return () => {
            resetTimeout();
        };
    }, [currentIndex, isPaused, setNextSlide, resetTimeout]);

    const handleContainerClick = () => {
        setIsPaused(prev => !prev);
    };

    const currentInsight = insights[currentIndex];
    const Icon = currentInsight.icon;

    return (
        <div
            className="bg-surface/80 backdrop-blur-md rounded-2xl p-6 relative overflow-hidden shadow-card dark:shadow-none dark:ring-1 dark:ring-white/10 cursor-pointer"
            onClick={handleContainerClick}
            title={isPaused ? "Reanudar carrusel" : "Pausar carrusel"}
        >
            <div key={currentIndex} className="flex items-center gap-6 animate-fade-in" style={{ animationDuration: '0.5s' }}>
                <div className="w-16 h-16 bg-primary/10 rounded-xl flex-shrink-0 flex items-center justify-center">
                    <Icon className="w-9 h-9 text-primary" />
                </div>
                <div className="flex-1">
                    <p className="text-5xl font-black text-primary tracking-tighter">{currentInsight.stat}</p>
                    <p className="text-lg font-semibold text-on-surface mt-1">{currentInsight.description}</p>
                    <p className="text-xs text-on-surface-secondary mt-2 opacity-80">{currentInsight.source}</p>
                </div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-primary/20" role="timer">
                <div
                    key={currentIndex} // This is crucial to restart the animation on slide change
                    className="h-full bg-primary"
                    style={{
                        animation: 'progress-fill 7s linear forwards',
                        animationPlayState: isPaused ? 'paused' : 'running'
                    }}
                ></div>
            </div>
        </div>
    );
};

export default StrategicInsightsCarousel;