

import React, { useState, useRef } from 'react';

const SWIPE_THRESHOLD = 75;

export const useSwipeNavigation = <T extends string>(
    activeTab: T,
    onTabChange: (newTab: T) => void,
    tabs: T[]
) => {
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const touchStartRef = useRef<number | null>(null);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartRef.current = e.touches[0].clientX;
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartRef.current === null) return;
        const currentX = e.touches[0].clientX;
        const diff = currentX - touchStartRef.current;
        setSwipeOffset(diff);
    };

    const handleTouchEnd = () => {
        const currentIndex = tabs.indexOf(activeTab);

        if (Math.abs(swipeOffset) > SWIPE_THRESHOLD) {
            if (swipeOffset > 0 && currentIndex > 0) { // Swipe right
                onTabChange(tabs[currentIndex - 1]);
            } else if (swipeOffset < 0 && currentIndex < tabs.length - 1) { // Swipe left
                onTabChange(tabs[currentIndex + 1]);
            }
        }
        
        setSwipeOffset(0);
        touchStartRef.current = null;
        setIsSwiping(false);
    };

    return {
        swipeHandlers: {
            onTouchStart: handleTouchStart,
            onTouchMove: handleTouchMove,
            onTouchEnd: handleTouchEnd,
        },
        swipeOffset,
        isSwiping,
    };
};