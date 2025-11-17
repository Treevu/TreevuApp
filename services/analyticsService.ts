import { type User } from '../types/user';

export type EventName = 'stimulus_shown' | 'stimulus_responded' | 'session_start' | 'expense_created' | 'expense_deleted' | 'goal_created' | 'goal_contribution_added' | 'view_rendered';

export interface EventProperties {
    [key: string]: any;
}

/**
 * Registra un evento de telemetría.
 * En un MVP, esto puede ser un console.log estructurado. En producción, enviaría
 * datos a un backend de analítica (Mixpanel, GA4, etc.).
 * @param eventName El nombre del evento.
 * @param properties Datos adicionales sobre el evento.
 * @param user El usuario que realiza la acción.
 */
export const trackEvent = (eventName: EventName, properties: EventProperties, user: User | null) => {
    const eventData = {
        eventName,
        timestamp: new Date().toISOString(),
        userContext: user ? {
            userId: user.id,
            level: user.level,
            fwi: user.progress.formalityIndex,
            // Extraemos el arquetipo del email para la demo.
            archetype: user.email.split('@')[0].split('.')[0] 
        } : null,
        properties,
    };

    // Usamos console.log para el MVP, simulando un envío a un backend.
    console.log(`[ANALYTICS]`, JSON.stringify(eventData));

    // Enviar el evento al backend sin esperar una respuesta para no impactar la UX
    fetch('/api/events', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
    }).catch(error => {
        console.error('[ANALYTICS] Failed to send event to backend:', error);
    });
};