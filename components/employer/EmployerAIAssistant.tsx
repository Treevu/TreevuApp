import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PaperAirplaneIcon, LightBulbIcon, XMarkIcon } from '../Icons';
// FIX: Updated import from deprecated 'geminiService.ts'.
import { getAIEmployerResponse } from '../../services/ai/employerService';
import Logo from '../Logo';
import { parseJsonFromMarkdown } from '../../../utils';

interface EmployerAIAssistantProps {
    onClose: () => void;
    data: any;
}

type StructuredAIResponse = {
    analysisResponse?: {
        title: string;
        keyFinding: string;
        recommendation: string;
        dataPoints: { label: string; value: string }[];
    },
    communicationDraft?: {
        platform: 'email' | 'slack';
        subject?: string;
        body: string;
        suggestedDeepLink?: 'desafios' | 'premios' | 'aprende';
    }
};

type Message = {
    from: 'ai' | 'user';
    content: string | StructuredAIResponse;
};

const SUGGESTIONS = [
    "Compara el índice de formalidad entre Ventas y Tecnología.",
    "¿Cuál es el principal impulsor del gasto informal?",
    "Predice cuál será el beneficio más canjeado el próximo trimestre.",
    "Redacta un comunicado para fomentar el registro de gastos en restaurantes."
];

const StructuredResponse: React.FC<{ data: StructuredAIResponse }> = ({ data }) => {
    if (data.analysisResponse) {
        const { title, keyFinding, recommendation, dataPoints } = data.analysisResponse;
        return (
            <div className="space-y-3">
                <h3 className="text-lg font-bold text-on-surface">{title}</h3>
                <div>
                    <p className="text-xs font-semibold text-on-surface-secondary mb-1">Hallazgo Clave:</p>
                    <p className="text-sm text-on-surface">{keyFinding}</p>
                </div>
                <div className="border-t border-active-surface/50"></div>
                <div className="p-3 bg-background/50 rounded-lg">
                    <p className="text-xs font-bold text-primary mb-1 flex items-center">
                        <LightBulbIcon className="w-4 h-4 mr-1.5"/>
                        Acción Sugerida:
                    </p>
                    <p className="text-sm text-on-surface">{recommendation}</p>
                </div>
                {dataPoints && dataPoints.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 text-center">
                        {dataPoints.map(point => (
                            <div key={point.label} className="bg-background rounded-md p-2">
                                <p className="text-xs text-on-surface-secondary">{point.label}</p>
                                <p className="font-bold text-on-surface text-lg">{point.value}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    }

    if (data.communicationDraft) {
         const { platform, subject, body } = data.communicationDraft;
         return (
             <div className="space-y-3">
                 <h3 className="text-lg font-bold text-on-surface">Borrador de Comunicado</h3>
                 <div className="p-3 bg-background/50 rounded-lg">
                    <p className="text-xs font-semibold text-on-surface-secondary mb-1">
                        Para: <span className="capitalize font-bold text-on-surface">{platform}</span>
                        {subject && <span className="block">Asunto: <span className="font-bold text-on-surface">{subject}</span></span>}
                    </p>
                    <div className="mt-2 pt-2 border-t border-active-surface/50 text-sm text-on-surface whitespace-pre-wrap">{body}</div>
                 </div>
             </div>
         )
    }

    return <p>Respuesta no reconocida.</p>;
};


const EmployerAIAssistant: React.FC<EmployerAIAssistantProps> = ({ onClose, data }) => {
    const [messages, setMessages] = useState<Message[]>([
        { from: 'ai', content: "Hola, soy el Asistente Estratégico Treevü. Estoy listo para transformar los datos de tu equipo en insights accionables. ¿Qué te gustaría analizar hoy?" }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = useCallback(async (messageText?: string) => {
        const userMessage = messageText || inputValue.trim();
        if (!userMessage || isLoading) return;

        setMessages(prev => [...prev, { from: 'user', content: userMessage }]);
        setInputValue('');
        setIsLoading(true);

        const aiResponseJson = await getAIEmployerResponse(userMessage, data);
        const aiResponseObject = aiResponseJson ? parseJsonFromMarkdown<StructuredAIResponse>(aiResponseJson) : null;

        setIsLoading(false);
        if (aiResponseObject) {
            setMessages(prev => [...prev, { from: 'ai', content: aiResponseObject }]);
        } else {
             setMessages(prev => [...prev, { from: 'ai', content: "Lo siento, no pude procesar tu solicitud. Intenta de nuevo." }]);
        }
    }, [inputValue, isLoading, data]);
    
    return (
       <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-end sm:items-center z-50 p-0 sm:p-4 animate-fade-in" onClick={onClose}>
            <div 
                className="bg-surface rounded-t-3xl sm:rounded-3xl shadow-2xl w-full max-w-lg h-[85vh] sm:h-auto sm:max-h-[80vh] flex flex-col animate-slide-in-up"
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="employer-ai-chat-title"
            >
                <header className="p-4 border-b border-active-surface/50 flex justify-between items-center flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <Logo className="w-8 h-8 text-primary" />
                        <div>
                            <h2 id="employer-ai-chat-title" className="text-lg font-bold text-on-surface">Asistente Estratégico</h2>
                            <p className="text-xs text-on-surface-secondary">Análisis y predicciones con IA</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-on-surface-secondary hover:text-on-surface">
                        <span className="sr-only">Cerrar chat</span>
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>

                <main className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.from === 'ai' ? 'justify-start' : 'justify-end'}`}>
                            <div className={`max-w-md p-3 rounded-2xl text-sm ${msg.from === 'ai' ? 'bg-active-surface text-on-surface rounded-bl-lg' : 'bg-primary text-primary-dark rounded-br-lg'}`}>
                                {typeof msg.content === 'string' ? <p>{msg.content}</p> : <StructuredResponse data={msg.content} />}
                            </div>
                        </div>
                    ))}
                    {messages.length === 1 && (
                        <div className="flex flex-wrap gap-2 justify-start pt-2">
                            {SUGGESTIONS.map((q, i) => (
                                <button key={i} onClick={() => handleSend(q)} disabled={isLoading} className="bg-active-surface hover:bg-background text-on-surface text-sm font-semibold py-1.5 px-3 rounded-full">
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}
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
                    <div ref={chatEndRef} />
                </main>

                <footer className="p-4 border-t border-active-surface/50 mt-auto flex-shrink-0">
                     <form onSubmit={e => { e.preventDefault(); handleSend(); }} className="flex items-center space-x-3">
                        <input type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Haz una pregunta sobre tus datos..." disabled={isLoading} className="flex-1 bg-background border-none rounded-xl py-2.5 px-4 focus:ring-2 focus:ring-primary focus:outline-none" />
                        <button type="submit" disabled={isLoading || !inputValue.trim()} className="w-12 h-12 rounded-full flex-shrink-0 flex items-center justify-center transition-all duration-200 bg-primary text-primary-dark disabled:opacity-50 disabled:cursor-not-allowed" aria-label="Enviar mensaje">
                             {isLoading ? <div className="w-6 h-6 border-2 border-t-primary-dark border-background rounded-full animate-spin"></div> : <PaperAirplaneIcon className="w-6 h-6" />}
                        </button>
                    </form>
                    <p className="text-center text-xs text-on-surface-secondary mt-2">Los análisis de IA pueden ser imprecisos.</p>
                </footer>
            </div>
        </div>
    );
};

export default EmployerAIAssistant;