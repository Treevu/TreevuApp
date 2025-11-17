
import React from 'react';
import { ArrowLeftIcon, RocketLaunchIcon, BinocularsIcon, LightBulbIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { ArchetypeKey } from '../data/archetypes';
import AuthLayout from './auth/AuthLayout';

interface ArchetypeSelectionProps {
    onBack: () => void;
}

const archetypes = [
    {
        key: 'intrapreneur' as ArchetypeKey,
        icon: RocketLaunchIcon,
        title: 'Intraemprendedor Ambicioso',
        description: 'Perfil corporativo dinámico, con un mix de gastos formales e informales. Ideal para ver cómo treevü se alinea a los beneficios de empresa.',
        plan: 'Explorer',
        planColor: 'bg-primary/20 text-primary',
    },
    {
        key: 'nomad' as ArchetypeKey,
        icon: BinocularsIcon,
        title: 'Nómada Digital',
        description: 'Un perfil tecnológico remoto con altos gastos en suscripciones y servicios. Perfecto para explorar la gestión de gastos recurrentes.',
        plan: 'Explorer',
        planColor: 'bg-primary/20 text-primary',
    },
    {
        key: 'freelancer' as ArchetypeKey,
        icon: LightBulbIcon,
        title: 'Visionario Independiente',
        description: 'Un perfil de profesional independiente o freelancer. Ideal para experimentar la versión gratuita y personal de treevü desde cero.',
        plan: 'Starter',
        planColor: 'bg-accent/20 text-accent',
    },
];

const ArchetypeSelection: React.FC<ArchetypeSelectionProps> = ({ onBack }) => {
    const { signInAsArchetype } = useAuth();

    const handleSelect = (key: ArchetypeKey) => {
        signInAsArchetype(key);
    };

    const title = <span>Elige tu <span className="text-primary">Expedición</span></span>;
    
    const backButton = (
         <button
            onClick={onBack}
            className="text-on-surface-secondary font-semibold text-sm flex items-center mx-auto"
        >
            <ArrowLeftIcon className="w-4 h-4 mr-2" />
            Volver atrás
        </button>
    );

    return (
       <AuthLayout footer={backButton}>
            <div className="text-center">
                <h1 className="text-3xl font-bold text-on-surface mb-2">{title}</h1>
                <p className="text-on-surface-secondary">Selecciona un perfil para iniciar tu demo personalizada.</p>
            </div>
            
            <div className="mt-8 w-full space-y-4">
                {archetypes.map((archetype, index) => (
                    <button
                        key={archetype.key}
                        onClick={() => handleSelect(archetype.key)}
                        className="w-full p-6 bg-surface/50 backdrop-blur-sm rounded-2xl border border-active-surface/50 text-left flex items-start gap-4 transition-all duration-300 hover:shadow-lg hover:border-primary/50 hover:scale-[1.02] animate-staggered-fade-in-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}

                    >
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <archetype.icon className="w-6 h-6 text-primary"/>
                        </div>
                        <div className="flex-1 min-w-0">
                            <h3 className="font-bold text-on-surface">{archetype.title}</h3>
                             <span className={`text-xs font-bold mt-1 inline-block px-2 py-0.5 rounded-full ${archetype.planColor}`}>
                                Plan: {archetype.plan}
                            </span>
                            <p className="text-xs text-on-surface-secondary mt-2">{archetype.description}</p>
                        </div>
                    </button>
                ))}
            </div>
       </AuthLayout>
    );
};

export default ArchetypeSelection;
