import React, { useCallback } from 'react';
import ArticleCard from './ArticleCard';
import { HomeIcon, BanknotesIcon, UsersIcon, GiftIcon, QuestionMarkCircleIcon, BookOpenIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { calculateTreevusForAction } from '../services/gamificationService';
import { articles } from '../data/articles';

const QandAView: React.FC = () => {
    const { user, addTreevus, completeLesson } = useAuth();

    const handleArticleFirstOpen = useCallback((articleId: string) => {
        if (user && !user.completedLessons?.includes(articleId)) {
            const reward = calculateTreevusForAction('complete_lesson');
            addTreevus(reward);
            completeLesson(articleId);
        }
    }, [user, addTreevus, completeLesson]);

    const guides = [
        {
            id: 'guide-inicio',
            title: 'Tu Campamento Base: Inicio',
            icon: HomeIcon,
            color: 'text-primary',
            content: (
                <div className="text-sm text-on-surface-secondary space-y-2">
                    <p>Aquí tienes tu vista de 360°. Es tu centro de mando donde puedes ver tu <strong className="text-on-surface">progreso de nivel</strong>, monitorear tu <strong className="text-on-surface">presupuesto</strong>, revisar tus <strong className="text-on-surface">proyectos de conquista</strong> (metas) y acceder a los pergaminos de <strong className="text-on-surface">aprendizaje</strong>.</p>
                </div>
            ),
        },
        {
            id: 'guide-billetera',
            title: 'Tu Diario de Expedición: Billetera',
            icon: BanknotesIcon,
            color: 'text-blue-400',
            content: (
                <div className="text-sm text-on-surface-secondary space-y-2">
                    <p>Este es el mapa de tu territorio financiero. Cada <strong className="text-on-surface">"hallazgo" (gasto)</strong> que registras aparece aquí. Usa el buscador y los filtros para analizar tus movimientos y entender tus patrones de consumo.</p>
                </div>
            ),
        },
        {
            id: 'guide-comunidad',
            title: 'Tu Escuadrón: Squad',
            icon: UsersIcon,
            color: 'text-accent',
            content: (
                <div className="text-sm text-on-surface-secondary space-y-2">
                    <p>La expedición es mejor en equipo. Colabora con tu <strong className="text-on-surface">Squad</strong>, participen en <strong className="text-on-surface">iniciativas colectivas</strong> para ganar grandes recompensas, y reconoce el esfuerzo de tus compañeros otorgando <strong className="text-on-surface">trofeos</strong>.</p>
                </div>
            ),
        },
        {
            id: 'guide-tienda',
            title: 'Tu Mercado de Tesoros: Tienda',
            icon: GiftIcon,
            color: 'text-red-400',
            content: (
                <div className="text-sm text-on-surface-secondary space-y-2">
                    <p>Aquí es donde tu esfuerzo se materializa. Canjea los <strong className="text-primary">Treevüs</strong> que has cosechado por <strong className="text-on-surface">beneficios y recompensas reales</strong>, desde días libres hasta vales de consumo, ofrecidos por tu empresa y nuestros aliados.</p>
                </div>
            ),
        },
    ];

    return (
        <div className="animate-fade-in space-y-4">
            <div className="bg-surface rounded-2xl p-4">
                <h2 className="text-xl font-bold text-on-surface mb-2 flex items-center">
                    <QuestionMarkCircleIcon className="w-6 h-6 mr-2 text-primary"/>
                   Guía del Explorador
                </h2>
                <p className="text-sm text-on-surface-secondary">
                    Descubre el propósito de cada sección de tu mapa y sácale el máximo provecho a tu aventura.
                </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {guides.map(guide => (
                    <ArticleCard
                        key={guide.id}
                        article={guide as any}
                    />
                ))}
            </div>

            <div className="mt-6">
                 <h2 className="text-xl font-bold text-on-surface mb-2 flex items-center">
                    <BookOpenIcon className="w-6 h-6 mr-2 text-primary"/>
                   Pergaminos de Sabiduría
                </h2>
                 <p className="text-sm text-on-surface-secondary mb-4">
                    La sabiduría de los exploradores más experimentados. Cada pergamino leído te recompensa con Treevüs.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {articles.map(article => (
                        <ArticleCard
                            key={article.id}
                            article={article}
                            isCompleted={user?.completedLessons?.includes(article.id)}
                            onFirstOpen={() => handleArticleFirstOpen(article.id)}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default QandAView;