import React from 'react';
import { ArrowLeftIcon, RocketLaunchIcon, BinocularsIcon, TrophyIcon } from '@/components/ui/Icons';
import { ArchetypeKey } from '@/data/archetypes.ts';
import AuthLayout from '@/components/auth/AuthLayout.tsx';
interface ArchetypeSelectionProps {
    onBack: () => void;
}

const archetypes = [
    {
        key: 'intrapreneur' as ArchetypeKey,
        icon: RocketLaunchIcon,
        title: 'Intraemprendedor Ambicioso',
        description: 'Perfil de un profesional joven y social, con un mix de gastos formales e informales. Ideal para ver cómo treevü ayuda a organizar un estilo de vida dinámico.',
    },
    {
        key: 'nomad' as ArchetypeKey,
        icon: BinocularsIcon,
        title: 'Nómada Digital',
        description: 'Un perfil tecnológico remoto con altos gastos en suscripciones, delivery y viajes. Perfecto para explorar la gestión de gastos recurrentes y no tradicionales.',
    },
    {
        key: 'visionary' as ArchetypeKey,
        icon: TrophyIcon,
        title: 'Visionaria de Metas',
        description: 'Una profesional enfocada en un gran proyecto a largo plazo. Este perfil destaca la planificación, el ahorro y el poder de las metas en treevü.',
    },
];

const ArchetypeSelection: React.FC<ArchetypeSelectionProps> = ({ onBack }) => {

    const handleSelect = (key: ArchetypeKey) => {
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
                        className="w-full p-4 bg-surface rounded-xl border border-active-surface/50 text-left flex items-start gap-4 transform hover:scale-105 hover:bg-active-surface transition-all duration-300 animate-staggered-fade-in-slide-up"
                        style={{ animationDelay: `${index * 100}ms` }}

                    >
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-1">
                            <archetype.icon className="w-6 h-6 text-primary"/>
                        </div>
                        <div>
                            <h3 className="font-bold text-on-surface">{archetype.title}</h3>
                            <p className="text-xs text-on-surface-secondary">{archetype.description}</p>
                        </div>
                    </button>
                ))}
            </div>
       </AuthLayout>
    );
};

export default ArchetypeSelection;