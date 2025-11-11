import React, { useState, useRef, useEffect } from 'react';
import { ChevronDownIcon } from '@/components/ui/Icons';

// Truncate to ~2-3 lines to encourage clicking "Ver más".
const TRUNCATE_HEIGHT_PX = 55;

interface Article {
    title: string;
    icon: React.FC<{className?: string}>;
    color: string;
    content: React.ReactNode;
}

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isCollapsible, setIsCollapsible] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);
    const Icon = article.icon;

    useEffect(() => {
        if (contentRef.current && contentRef.current.scrollHeight > TRUNCATE_HEIGHT_PX) {
            setIsCollapsible(true);
        }
    }, []);

    const toggleExpansion = () => {
        if (isCollapsible) {
            setIsExpanded(!isExpanded);
        }
    };

    return (
        <div className="bg-surface rounded-2xl border border-active-surface/50 overflow-hidden">
            <button
                className={`w-full p-4 flex items-center gap-4 text-left ${isCollapsible ? '' : 'cursor-default'}`}
                onClick={toggleExpansion}
                aria-expanded={isExpanded}
                disabled={!isCollapsible}
            >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-active-surface flex-shrink-0">
                    <Icon className={`w-7 h-7 ${article.color}`} />
                </div>
                <div className="min-w-0 overflow-hidden flex-1">
                    <h3 className="font-bold text-on-surface break-words">{article.title}</h3>
                </div>
                 {isCollapsible && (
                    <ChevronDownIcon className={`w-6 h-6 text-on-surface-secondary flex-shrink-0 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                 )}
            </button>
            <div className="px-4 pt-0 pb-4">
                <div className="relative">
                    <div
                        className="transition-all duration-500 ease-in-out overflow-hidden"
                        style={{ maxHeight: isExpanded ? `${contentRef.current?.scrollHeight}px` : `${TRUNCATE_HEIGHT_PX}px` }}
                        aria-hidden={!isExpanded}
                    >
                        <div ref={contentRef}>
                            {article.content}
                        </div>
                    </div>
                    {!isExpanded && isCollapsible && (
                        <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-surface to-transparent pointer-events-none"></div>
                    )}
                </div>

                {isCollapsible && (
                    <button
                        onClick={toggleExpansion}
                        className="mt-3 text-primary font-bold text-sm hover:opacity-80 transition-opacity flex items-center"
                        aria-expanded={isExpanded}
                    >
                        <span>{isExpanded ? 'Ver menos' : 'Ver más'}</span>
                        <ChevronDownIcon className={`w-5 h-5 ml-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                    </button>
                )}
            </div>
        </div>
    );
};

export default React.memo(ArticleCard);