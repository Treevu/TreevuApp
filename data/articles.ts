import React from 'react';
import { ShieldCheckIcon, BanknotesIcon, BuildingBlocksIcon } from '../components/Icons';

export interface ArticleData {
  id: string;
  title: string;
  icon: React.FC<{className?: string}>;
  color: string;
  content: React.ReactNode;
}

export const articles: ArticleData[] = [
  {
    id: 'article-formality',
    title: 'La Magia de la Formalidad',
    icon: ShieldCheckIcon,
    color: 'text-primary',
    content: React.createElement(
      'div',
      { className: 'text-sm text-on-surface-secondary space-y-3' },
      React.createElement(
        'p',
        null,
        'Cada vez que pides una ',
        React.createElement('strong', { className: 'text-on-surface' }, 'boleta de venta electrónica'),
        ' con tu DNI, no solo cumples con tu deber, ¡sino que activas un superpoder financiero! Este simple acto convierte un gasto ordinario en un "gasto deducible".'
      ),
      React.createElement(
        'p',
        null,
        React.createElement('strong', { className: 'text-on-surface' }, '¿Qué significa eso?'),
        ' Significa que una parte de ese gasto puede ser restada de tus ingresos al calcular tu impuesto a la renta. El resultado: ¡la SUNAT podría devolverte dinero al final del año!'
      ),
      React.createElement(
        'p',
        null,
        'Piensa en cada boleta como una semilla para tu árbol de ahorros. No cuesta nada pedirla y el potencial de cosecha es enorme. ¡Es la forma más inteligente de hacer que tu dinero trabaje para ti, incluso cuando lo gastas!'
      )
    ),
  },
  {
    id: 'article-budgeting',
    title: 'Construye tu Fortaleza Financiera',
    icon: BanknotesIcon,
    color: 'text-accent',
    content: React.createElement(
      'div',
      { className: 'text-sm text-on-surface-secondary space-y-3' },
      React.createElement(
        'p',
        null,
        'Un presupuesto no es una cárcel para tu dinero, ¡es el plano de tu fortaleza! Te da el poder de saber exactamente a dónde va cada sol, permitiéndote tomar el control y dirigir tus recursos hacia lo que más te importa.'
      ),
      React.createElement('strong', { className: 'text-on-surface' }, 'Pasos para construir tu fortaleza:'),
      React.createElement(
        'ul',
        { className: 'list-disc list-inside space-y-1 pl-2' },
        React.createElement('li', null, React.createElement('strong', { className: 'text-on-surface' }, 'Conoce tu terreno:'), ' Registra todos tus gastos por una semana. ¡Sin juzgar!'),
        React.createElement('li', null, React.createElement('strong', { className: 'text-on-surface' }, 'Distingue necesidades de deseos:'), ' Usa la función de "Intención de Gasto" en treevü.'),
        React.createElement('li', null, React.createElement('strong', { className: 'text-on-surface' }, 'Establece tus muros:'), ' Fija un límite realista en la app. Puedes ajustarlo cuando quieras.')
      ),
      React.createElement(
        'p',
        null,
        'Un presupuesto sólido es la base sobre la cual se construyen todos los grandes imperios financieros.'
      )
    ),
  },
  {
    id: 'article-goals',
    title: 'Tu Primer Mapa del Tesoro',
    icon: BuildingBlocksIcon,
    color: 'text-blue-400',
    content: React.createElement(
      'div',
      { className: 'text-sm text-on-surface-secondary space-y-3' },
      React.createElement(
        'p',
        null,
        'Ahorrar sin un objetivo es como navegar sin un mapa: es fácil perderse. Tus ',
        React.createElement('strong', { className: 'text-on-surface' }, 'Proyectos de Conquista'),
        ' (metas) son ese mapa. Transforman el acto de ahorrar de una obligación a una emocionante búsqueda del tesoro.'
      ),
      React.createElement('p', null, React.createElement('strong', { className: 'text-on-surface' }, '¿Cómo trazar un buen mapa?')),
      React.createElement(
        'ul',
        { className: 'list-disc list-inside space-y-1 pl-2' },
        React.createElement('li', null, React.createElement('strong', { className: 'text-on-surface' }, 'Sé específico:'), ' No es "ahorrar para un viaje", es "ahorrar S/ 3,000 para Máncora".'),
        React.createElement('li', null, React.createElement('strong', { className: 'text-on-surface' }, 'Ponle fecha (mentalmente):'), ' Tener un plazo te motiva a seguir el plan.'),
        React.createElement('li', null, React.createElement('strong', { className: 'text-on-surface' }, 'Visualiza el tesoro:'), ' Usa un ícono que te inspire. ¡Cada aporte te acerca a él!')
      ),
      React.createElement(
        'p',
        null,
        'Con un mapa claro, cada sol que ahorras no es un sol que "pierdes" hoy, sino un paso que das hacia el tesoro que deseas mañana.'
      )
    ),
  },
];