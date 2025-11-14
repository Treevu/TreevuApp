import React, { useEffect, useRef } from 'react';

interface OnboardingTourProps {
    step: {
        targetRef: React.RefObject<HTMLElement> | null;
        text: string;
        position: 'top' | 'bottom';
        isInteractive?: boolean;
    };
    currentStepIndex: number;
    totalSteps: number;
    onNext: () => void;
    onPrev: () => void;
    onSkip: () => void;
}

const OnboardingTour: React.FC<OnboardingTourProps> = ({ step, currentStepIndex, totalSteps, onNext, onPrev, onSkip }) => {
    const spotlightRef = useRef<HTMLDivElement>(null);
    const textboxRef = useRef<HTMLDivElement>(null);
    const animationFrameRef = useRef<number | null>(null);
    const isFinalStep = !step.targetRef;

    useEffect(() => {
        const spotlightEl = spotlightRef.current;
        const textboxEl = textboxRef.current;

        if (!spotlightEl || !textboxEl) return;

        if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
        }
        
        // Handle final, non-targeted step
        if (isFinalStep) {
            spotlightEl.style.opacity = '1';
            spotlightEl.style.top = '0';
            spotlightEl.style.left = '0';
            spotlightEl.style.width = '0px';
            spotlightEl.style.height = '0px';
            spotlightEl.style.borderRadius = '0';
            spotlightEl.style.boxShadow = '0 0 0 9999px rgba(0, 0, 0, 0.6)'; // Keep backdrop

            // Reset textbox styles for centering
            textboxEl.style.width = '';
            textboxEl.style.maxWidth = '320px';
            textboxEl.style.opacity = '1';
            textboxEl.style.top = '50%';
            textboxEl.style.left = '50%';
            textboxEl.style.transform = 'translate(-50%, -50%)';
            textboxEl.style.bottom = 'auto';
            textboxEl.classList.remove('tour-textbox-top', 'tour-textbox-bottom'); // Remove arrows
            return;
        }

        const targetEl = step.targetRef.current;
        if (!targetEl) {
            spotlightEl.style.opacity = '0';
            textboxEl.style.opacity = '0';
            return;
        }


        if (step.isInteractive) {
            targetEl.style.zIndex = '9999';
        }

        // Defer scroll slightly to ensure element is in view after any parent transitions
        setTimeout(() => {
            targetEl.scrollIntoView({ block: 'center', inline: 'center', behavior: 'smooth' });
        }, 100);

        const updatePosition = () => {
            if (!spotlightEl || !textboxEl || !targetEl || !document.body.contains(targetEl)) {
                 if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
                 // Hide tour elements if target disappears
                 if(spotlightEl) spotlightEl.style.opacity = '0';
                 if(textboxEl) textboxEl.style.opacity = '0';
                 return;
            }
            const rect = targetEl.getBoundingClientRect();
            
            if (rect.width === 0 && rect.height === 0) {
                spotlightEl.style.opacity = '0';
                textboxEl.style.opacity = '0';
                animationFrameRef.current = requestAnimationFrame(updatePosition);
                return;
            }
            
            spotlightEl.style.opacity = '1';
            textboxEl.style.opacity = '1';

            // Spotlight logic (unchanged)
            const spotlightPadding = 8;
            const targetStyle = window.getComputedStyle(targetEl);
            spotlightEl.style.top = `${rect.top - spotlightPadding}px`;
            spotlightEl.style.left = `${rect.left - spotlightPadding}px`;
            spotlightEl.style.width = `${rect.width + spotlightPadding * 2}px`;
            spotlightEl.style.height = `${rect.height + spotlightPadding * 2}px`;
            spotlightEl.style.borderRadius = `calc(${targetStyle.borderRadius || '0px'} + ${spotlightPadding}px)`;

            // --- NEW TEXTBOX LOGIC ---
            const navBarHeight = 72;
            const bottomMargin = 10;
            textboxEl.style.top = 'auto';
            textboxEl.style.bottom = `${navBarHeight + bottomMargin}px`;
            
            textboxEl.style.left = '50%';
            textboxEl.style.transform = 'translateX(-50%)';
            textboxEl.style.width = 'calc(100% - 32px)';
            textboxEl.style.maxWidth = '420px';
            
            textboxEl.classList.remove('tour-textbox-top');
            textboxEl.classList.add('tour-textbox-bottom');

            const textboxWidth = textboxEl.offsetWidth;
            const viewportWidth = window.innerWidth;
            const textboxLeftPosition = (viewportWidth - textboxWidth) / 2;
            const targetCenterX = rect.left + rect.width / 2;

            const arrowLeft = targetCenterX - textboxLeftPosition;
            const clampedArrowLeft = Math.max(20, Math.min(textboxWidth - 20, arrowLeft));
            textboxEl.style.setProperty('--arrow-left', `${clampedArrowLeft}px`);
            
            animationFrameRef.current = requestAnimationFrame(updatePosition);
        };
        
        spotlightEl.style.opacity = '0';
        textboxEl.style.opacity = '0';
        
        animationFrameRef.current = requestAnimationFrame(updatePosition);

        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (step.isInteractive && targetEl) {
                targetEl.style.zIndex = '';
            }
        };
    }, [step, isFinalStep]);

    return (
        <>
            <div 
                ref={spotlightRef}
                className={`tour-spotlight transition-opacity duration-300 ${step.isInteractive ? 'tour-spotlight-interactive' : ''}`} 
            />
            <div 
                ref={textboxRef} 
                className={`tour-textbox transition-opacity duration-300`}
                role="dialog"
                aria-live="polite"
                aria-label="Guía interactiva"
            >
                <p className="text-sm text-on-surface-secondary">{step.text}</p>
                
                <div className="flex justify-between items-center mt-4">
                    <button onClick={(e) => { e.stopPropagation(); onSkip(); }} className="text-xs font-semibold text-on-surface-secondary hover:text-on-surface">Omitir</button>
                    
                    <div className="flex items-center gap-2">
                            <button 
                            onClick={(e) => { e.stopPropagation(); onPrev(); }} 
                            disabled={currentStepIndex === 0}
                            className="px-3 py-1.5 text-sm font-bold text-on-surface bg-active-surface rounded-full disabled:opacity-50"
                            aria-label="Paso anterior"
                        >
                            Anterior
                        </button>
                        <span className="text-xs font-semibold text-on-surface-secondary whitespace-nowrap">
                            {currentStepIndex + 1} / {totalSteps}
                        </span>
                        <button 
                            onClick={(e) => { e.stopPropagation(); onNext(); }} 
                            className="px-3 py-1.5 text-sm font-bold text-primary-dark bg-primary rounded-full"
                            aria-label="Siguiente paso"
                        >
                            {currentStepIndex === totalSteps - 1 ? 'Finalizar' : 'Siguiente'}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default OnboardingTour;