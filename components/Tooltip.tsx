import React, { useState, useRef, useEffect } from 'react';
import { QuestionMarkCircleIcon } from './Icons';

interface TooltipProps {
    text: string;
    id: string; // Required for aria-describedby
}

const Tooltip: React.FC<TooltipProps> = ({ text, id }) => {
    const [isVisible, setIsVisible] = useState(false);
    const tooltipRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isVisible && tooltipRef.current && containerRef.current) {
            const tooltip = tooltipRef.current;
            const container = containerRef.current;
            const rect = tooltip.getBoundingClientRect();
            
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';

            const newRect = tooltip.getBoundingClientRect();

            if (newRect.left < 8) {
                const containerRect = container.getBoundingClientRect();
                tooltip.style.left = `calc(-${containerRect.left}px + 8px)`;
                tooltip.style.transform = 'translateX(0)';
            } else if (newRect.right > window.innerWidth - 8) {
                const containerRect = container.getBoundingClientRect();
                tooltip.style.left = `auto`;
                tooltip.style.right = `calc(-${window.innerWidth - containerRect.right}px + 8px)`;
                tooltip.style.transform = 'translateX(0)';
            }
        }
    }, [isVisible]);

    return (
        <div 
            ref={containerRef}
            className="tooltip-container"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
            onFocus={() => setIsVisible(true)}
            onBlur={() => setIsVisible(false)}
        >
            <button
                type="button"
                aria-describedby={id}
                className="text-on-surface-secondary hover:text-on-surface focus:outline-none focus:ring-2 focus:ring-primary rounded-full"
            >
                <QuestionMarkCircleIcon className="w-5 h-5" />
                <span className="sr-only">Más información</span>
            </button>
            <div
                id={id}
                ref={tooltipRef}
                role="tooltip"
                className={`tooltip-box ${isVisible ? 'tooltip-visible' : ''}`}
            >
                {text}
            </div>
        </div>
    );
};

export default Tooltip;