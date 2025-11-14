import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PaperAirplaneIcon, XMarkIcon, ExclamationTriangleIcon, ArrowPathIcon } from './Icons';
import TreevuLogoText from './TreevuLogoText';
// FIX: Updated imports from deprecated 'geminiService.ts' to specific AI service files.
import { getAIGreeting } from '../services/ai/employeeService';
import { getGeneralChatResponse } from '../services/ai/chatService';
import { useAppContext } from '../contexts/AppContext';
import { useAuth } from '../contexts/AuthContext';
import { levelData } from '../services/gamificationService';
import { parseJsonFromMarkdown } from '../utils';
import { useModal } from '../contexts/ModalContext';

interface AIAssistantChatProps {
    onClose: () => void;
    onAddReceiptManual?: () => void;
}

type AIHeader = {
    level: string;
    fwi: string;
    insight: string;
    challenge: string;
};

type AIResponse = {
    header: AIHeader;
    conversationBody: string;
    suggestions: string[];
};

type Message = {
    from: 'ai' | 'user';
    content: string | AIResponse;
    id: string;
};

const AIHeaderDisplay: React.FC<{ header: AIHeader }> = ({ header }) => (
    <div className="space-y-1 mb-3 p-3 bg-background rounded-lg border border-active-surface/50">
        <p className="text-sm"><span className="font-bold text-on-surface-secondary">🌿 Nivel:</span> <span className="font-semibold text-on-surface">{header.level}</span></p>
        <p className="text-sm"><span className="font-bold text-on-surface-secondary">💸 FWI Actual:</span> <span className="font-semibold text-on-surface">{header.fwi}</span></p>
        <p className="text-sm"><span className="font-bold text-on-surface-secondary">📊 Insight:</span> <span className="font-semibold text-on-surface">{header.insight}</span></p>
        <p className="text-sm"><span className="font-bold text-on-surface-secondary">🎯 Próximo reto:</span> <span className="font-semibold text-on-surface">{header.challenge}</span></p>
    </div>
);

const ChatBubble = React.memo(({ from, content }: { from: 'ai' | 'user'; content: string | AIResponse }) => {
    if (from === 'user') {
        return (
            <div className="flex justify-end">
                <div className="max-w-md p-3 rounded-2xl text-sm bg-primary text-primary-dark rounded-br-lg">
                    {content as string}
                </div>
            </div>
        );
    }

    // Handle simple string content for AI messages (like the initial greeting)
    if (typeof content === 'string') {
        return (
            <div className="flex justify-start">
                <div className="max-w-md p-3 rounded-2xl text-sm bg-active-surface text-on-surface rounded-bl-lg">
                    <p>{content}</p>
                </div>
            </div>
        );
    }
    
    // Handle structured AIResponse object
    const isProperlyStructured = 
        typeof content === 'object' && 
        content !== null && 
        'header' in content && 
        'conversationBody' in content &&
        (content as AIResponse).conversationBody.trim() !== '';
    
    return (
        <div className="flex justify-start">
            <div className="max-w-md p-3 rounded-2xl text-sm bg-active-surface text-on-surface rounded-bl-lg">
                {isProperlyStructured ? (
                    <>
                        <AIHeaderDisplay header={(content as AIResponse).header} />
                        <p dangerouslySetInnerHTML={{ __html: (content as AIResponse).conversationBody }} />
                    </>
                ) : (
                    <p className="text-danger">
                        Recibí una respuesta de la IA en un formato inesperado. Por favor, intenta reformular tu pregunta.
                    </p>
                )}
            </div>
        </div>
    );
});

const ChatSuggestions = React.memo(({ suggestions, onSuggestionClick, isLoading }: { suggestions: string[]; onSuggestionClick: (s: string) => void; isLoading: boolean }) => (
    <div className="flex flex-wrap gap-2 justify-start py-2">
        {suggestions.map((q, i) => (
            <button
                key={i}
                onClick={() => onSuggestionClick(q)}
                disabled={isLoading}
                className="bg-surface hover:bg-active-surface text-on-surface text-sm font-semibold py-1.5 px-3 rounded-full transition-all duration-200 disabled:opacity-50"
                style={{ animation: `grow-and-fade-in 0.4s ${i * 100}ms both cubic-bezier(0.25, 0.46, 0.45, 0.94)` }}
            >
                {q}
            </button>
        ))}
    </div>
));

const ChatInput = React.memo(({
    inputValue,
    onInputChange,
    onSend,
    isLoading,
}: {
    inputValue: string;
    onInputChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onSend: () => void;
    isLoading: boolean;
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${textarea.scrollHeight}px`;
        }
    }, [inputValue]);

    return (
        <div className="p-3 border-t border-active-surface/50 mt-auto flex-shrink-0 bg-surface">
            <form onSubmit={e => { e.preventDefault(); onSend(); }} className="flex items-end space-x-3">
                <textarea
                    ref={textareaRef}
                    rows={1}
                    value={inputValue}
                    onChange={onInputChange}
                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), onSend())}
                    placeholder="Escribe un mensaje..."
                    disabled={isLoading}
                    className="flex-1 bg-background border-none rounded-2xl py-2.5 px-4 resize-none max-h-32 focus:ring-2 focus:ring-primary focus:outline-none disabled:opacity-70"
                    style={{ scrollbarWidth: 'none' }}
                />
                <button
                    type="submit"
                    disabled={isLoading || !inputValue.trim()}
                    className={`w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200 bg-primary text-primary-dark disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={'Enviar mensaje'}
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-2 border-t-primary-dark border-background rounded-full animate-spin"></div>
                    ) : (
                        <PaperAirplaneIcon className="w-6 h-6" />
                    )}
                </button>
            </form>
            <p className="text-center text-xs text-on-surface-secondary mt-2">Powered by Gemini</p>
        </div>
    );
});

// --- Main Component ---
const AIAssistantChat: React.FC<AIAssistantChatProps> = ({ onClose, onAddReceiptManual }) => {
    const { state } = useAppContext();
    const { expenses, budget, formalityIndex, totalExpenses, goals } = state;
    const { user } = useAuth();
    const { openModal } = useModal();

    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [lastUserMessage, setLastUserMessage] = useState('');
    const [aiError, setAiError] = useState<string | null>(null);
    const [isInitialLoading, setIsInitialLoading] = useState(true);

    const chatEndRef = useRef<HTMLDivElement>(null);
    const fileInputFromChatRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchGreeting = async () => {
            if (!user) {
                setIsInitialLoading(false);
                return;
            };
            setIsInitialLoading(true);
            try {
                const greetingJson = await getAIGreeting(user);
                const greetingObject = greetingJson ? parseJsonFromMarkdown<AIResponse>(greetingJson) : null;
                if (greetingObject) {
                    setMessages([{ from: 'ai', content: greetingObject, id: 'initial' }]);
                } else {
                    // Fallback to hardcoded message on parsing failure
                    setMessages([{ from: 'ai', content: `¡Hola, ${user.name.split(' ')[0] || 'amigo'}! Soy treevü. ¿Cómo puedo ayudarte?`, id: 'initial-fallback' }]);
                }
            } catch (error) {
                console.error("Failed to fetch AI greeting:", error);
                // Fallback to hardcoded message on API error
                setMessages([{ from: 'ai', content: `¡Hola, ${user.name.split(' ')[0] || 'amigo'}! Hubo un problema al conectar con mi IA, pero dime, ¿cómo te ayudo?`, id: 'initial-error' }]);
            } finally {
                setIsInitialLoading(false);
            }
        };

        fetchGreeting();
    }, [user]);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading, aiError, isInitialLoading]);
    
    const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            onClose(); // Close this chat modal
            openModal('addExpense', {
                initialFile: file,
                scanMode: 'receipt'
            });
        }
        if(event.target) event.target.value = '';
    };

    const handleSend = useCallback(async (messageToSend?: string) => {
        const userMessage = messageToSend || inputValue.trim();
        if (!userMessage || isLoading || !user) return;

        setAiError(null);
        setLastUserMessage(userMessage);
        const currentMessages = [...messages, { from: 'user' as const, content: userMessage, id: `user-${Date.now()}` }];
        setMessages(currentMessages);
        setInputValue('');
        setIsLoading(true);

        try {
            const aiResponseJson = await getGeneralChatResponse(
                userMessage,
                currentMessages, // Send the most up-to-date history
                {
                    expenses, budget, formalityIndex, totalExpenses,
                    userName: user.name || 'amigo',
                    userLevel: levelData[user.level].name,
                    goals,
                }
            );
            
            const aiResponseObject = aiResponseJson ? parseJsonFromMarkdown<AIResponse>(aiResponseJson) : null;
            
            if (aiResponseObject) {
                setMessages(prev => [...prev, { from: 'ai', content: aiResponseObject, id: `ai-${Date.now()}` }]);
            } else {
                throw new Error("La respuesta de la IA no pudo ser procesada o tenía un formato incorrecto.");
            }
        } catch (error) {
            console.error(error);
            setAiError((error as Error).message || "Ocurrió un error inesperado.");
        } finally {
            setIsLoading(false);
        }
    }, [user, expenses, budget, formalityIndex, totalExpenses, goals, inputValue, isLoading, messages]);

    const handleSuggestionClick = useCallback((suggestion: string) => {
        if (isLoading) return;
        if (suggestion.toLowerCase().includes("archivo")) {
            fileInputFromChatRef.current?.click();
            return;
        }
        if (suggestion.toLowerCase().includes("manualmente")) { onClose(); onAddReceiptManual?.(); return; }
        handleSend(suggestion);
    }, [isLoading, handleSend, onClose, onAddReceiptManual]);
    
    const title = <>Asistente <TreevuLogoText /></>;

    const lastMessage = messages[messages.length - 1];
    const suggestionsToShow = lastMessage?.from === 'ai' && typeof lastMessage.content === 'object' ? (lastMessage.content as AIResponse).suggestions : [];
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-end sm:items-center z-50 p-0 sm:p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-md h-[85vh] sm:h-auto sm:max-h-[80vh] flex flex-col animate-grow-and-fade-in"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="ai-chat-title"
            >
                <header className="p-4 border-b border-active-surface/50 flex justify-between items-center flex-shrink-0">
                    <h2 id="ai-chat-title" className="text-lg font-bold text-on-surface">{title}</h2>
                    <button onClick={onClose} className="text-on-surface-secondary hover:text-on-surface" aria-label="Cerrar chat">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <main aria-live="polite" className="flex-1 p-4 overflow-y-auto space-y-4 bg-background custom-scrollbar">
                    {isInitialLoading && (
                         <div className="flex justify-start">
                             <div className="max-w-sm p-3 rounded-2xl bg-active-surface">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-on-surface rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-2 h-2 bg-on-surface rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-on-surface rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                    
                    {messages.map((msg) => <ChatBubble key={msg.id} from={msg.from} content={msg.content} />)}
                    
                    {isLoading && (
                         <div className="flex justify-start">
                             <div className="max-w-sm p-3 rounded-2xl bg-active-surface">
                                <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-on-surface rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                                    <div className="w-2 h-2 bg-on-surface rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-2 h-2 bg-on-surface rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        </div>
                    )}

                    {aiError && (
                        <div className="flex justify-start">
                             <div className="max-w-md p-3 rounded-2xl bg-danger/10 text-on-surface rounded-bl-lg">
                                <div className="flex items-start gap-3">
                                    <ExclamationTriangleIcon className="w-5 h-5 text-danger flex-shrink-0 mt-0.5" />
                                    <div className="flex-1">
                                        <p className="text-sm text-danger/90">{aiError}</p>
                                        <button onClick={() => handleSend(lastUserMessage)} className="mt-2 text-xs font-bold text-primary flex items-center gap-1.5">
                                            <ArrowPathIcon className="w-4 h-4"/>
                                            Reintentar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                     <div ref={chatEndRef} />
                </main>

                <div className="px-4 bg-surface">
                    {suggestionsToShow.length > 0 && !isLoading && !aiError && !isInitialLoading && (
                        <ChatSuggestions suggestions={suggestionsToShow} onSuggestionClick={handleSuggestionClick} isLoading={isLoading} />
                    )}
                </div>

                <ChatInput
                    inputValue={inputValue}
                    onInputChange={(e) => setInputValue(e.target.value)}
                    onSend={() => handleSend()}
                    isLoading={isLoading || isInitialLoading}
                />
                 <input
                    type="file"
                    ref={fileInputFromChatRef}
                    onChange={handleFileSelected}
                    className="hidden"
                    accept="image/*,application/pdf"
                />
            </div>
        </div>
    );
};

export default AIAssistantChat;