

import React, { useState, useEffect } from 'react';
import { ChevronDownIcon } from '@/components/ui/Icons';

interface ScrollIndicatorProps {
    scrollContainerRef: React.RefObject<HTMLDivElement>;
    viewName: string;
}

const ScrollIndicator: React.FC<ScrollIndicatorProps> = ({ scrollContainerRef, viewName }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const updateVisibility = () => {
            const hasScrolled = container.scrollTop > 20;
            const isScrollable = container.scrollHeight > container.clientHeight;
            setIsVisible(isScrollable && !hasScrolled);
        };

        // Use a ResizeObserver to detect content changes that affect scroll height
        const observer = new ResizeObserver(updateVisibility);
        observer.observe(container);
        
        // Initial check after a short delay for content rendering
        const timer = setTimeout(updateVisibility, 200);

        container.addEventListener('scroll', updateVisibility, { passive: true });
        
        return () => {
            clearTimeout(timer);
            observer.disconnect();
            container.removeEventListener('scroll', updateVisibility);
        };
    }, [scrollContainerRef, viewName]); // Re-run if the container ref or view changes

    if (!isVisible) {
        return null;
    }

    return (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 w-full max-w-xs pointer-events-none z-10 animate-fade-in">
            <div className="flex flex-col items-center justify-center p-2 rounded-full bg-surface/90 backdrop-blur-sm shadow-lg ring-1 ring-white/5">
                <p className="text-xs font-semibold text-on-surface-secondary">
                    Desliza para ver más {viewName}
                </p>
                <ChevronDownIcon className="w-5 h-5 text-on-surface-secondary animate-bounce mt-1" />
            </div>
        </div>
    );
};

export default ScrollIndicator;