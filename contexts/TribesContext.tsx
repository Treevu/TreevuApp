import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { Tribe, Mission, MissionMetric, TribeMember } from '../types/tribe';


const MOCK_MISSIONS: Mission[] = [
    {
        id: 'mission-formal-1',
        title: 'Expedición de Formalidad',
        description: 'Registren 50 gastos formales como equipo esta semana para fortalecer sus hábitos y su ahorro fiscal.',
        metric: 'formalExpenseCount',
        target: 50,
        reward: 1000,
        icon: '🧾',
        valueForEmployee: "Ganas más Treevüs y potencias tu devolución de impuestos.",
        valueForCompany: "Tu aporte mejora la predictibilidad de gastos del equipo y fortalece nuestra cultura de cumplimiento."
    },
    {
        id: 'mission-kudos-1',
        title: 'Expedición de Camaradería',
        description: 'Envíen 100 kudos entre todos los miembros del escuadrón para fortalecer los lazos de equipo.',
        metric: 'kudosSentCount',
        target: 100,
        reward: 500,
        icon: '💖',
        valueForEmployee: "Fomentas un ambiente positivo y te conectas con tus compañeros.",
        valueForCompany: "Tu reconocimiento aumenta la moral del equipo, fortalece el engagement y contribuye a la retención del talento."
    },
    {
        id: 'mission-learning-1',
        title: 'Expedición del Conocimiento',
        description: 'Lean colectivamente 15 pergaminos de la Biblioteca para expandir la sabiduría financiera del escuadrón.',
        metric: 'lessonsCompletedCount',
        target: 15,
        reward: 750,
        icon: '📚',
        valueForEmployee: "Ganas Treevüs por cada lección y te vuelves un experto en finanzas personales.",
        valueForCompany: "Tu crecimiento individual eleva el conocimiento colectivo del equipo, impulsando mejores decisiones."
    }
];


// Mock data generation function (moved from DataContext)
const generateMockTribes = (): Tribe[] => {
    return [
        {
            id: 'centauri-1',
            name: 'Squad Centauri',
            icon: '💫',
            members: [
                { id: 'user-mock-id', name: 'Tú', avatarInitial: 'AC', kudosReceived: 42, treevus: 2800, streak: 3 },
                { id: 'member-2', name: 'Ana Morales', avatarInitial: 'AM', kudosReceived: 210, treevus: 12500, streak: 15 },
                { id: 'member-3', name: 'Carlos Diaz', avatarInitial: 'CD', kudosReceived: 180, treevus: 11800, streak: 8 },
                { id: 'member-4', name: 'Laura Fernández', avatarInitial: 'LF', kudosReceived: 150, treevus: 9500, streak: 12 },
                { id: 'member-12', name: 'Roberto Gómez', avatarInitial: 'RG', kudosReceived: 95, treevus: 7300, streak: 2 },
                { id: 'member-13', name: 'Patricia Soto', avatarInitial: 'PS', kudosReceived: 110, treevus: 8100, streak: 0 },
            ],
            collectiveKudos: 1250,
            activeMissionId: 'mission-formal-1', // Active mission for demo
            missionProgress: 35, // Some progress for demo
            goal: {
                title: "Meta Trimestral de Bienestar",
                target: 5000,
                reward: "Presupuesto para Almuerzo de Equipo 🍕"
            }
        },
        {
            id: 'orion-2',
            name: 'Flota de Orión',
            icon: '🚀',
            members: [
                { id: 'member-5', name: 'Pedro Castillo', avatarInitial: 'PC', kudosReceived: 195, treevus: 12100, streak: 18 },
                { id: 'member-6', name: 'Sofía Torres', avatarInitial: 'ST', kudosReceived: 230, treevus: 13500, streak: 25 },
                { id: 'member-7', name: 'Mateo Flores', avatarInitial: 'MF', kudosReceived: 160, treevus: 10200, streak: 5 },
                { id: 'member-14', name: 'Gabriela Reyes', avatarInitial: 'GR', kudosReceived: 135, treevus: 9800, streak: 9 },
            ],
            collectiveKudos: 850,
            goal: {
                title: "Fondo para After Office",
                target: 3000,
                reward: "Noche de Bowling para el equipo 🎳"
            }
        },
        {
            id: 'andromeda-3',
            name: 'Alianza Andrómeda',
            icon: '🌌',
            members: [
                { id: 'member-8', name: 'Valeria Mendoza', avatarInitial: 'VM', kudosReceived: 140, treevus: 9200, streak: 11 },
                { id: 'member-9', name: 'Diego Quispe', avatarInitial: 'DQ', kudosReceived: 175, treevus: 11000, streak: 7 },
                { id: 'member-10', name: 'Isabella Rojas', avatarInitial: 'IR', kudosReceived: 200, treevus: 12800, streak: 14 },
                { id: 'member-11', name: 'Javier Vargas', avatarInitial: 'JV', kudosReceived: 130, treevus: 8900, streak: 4 },
                { id: 'member-15', name: 'Camila Paredes', avatarInitial: 'CP', kudosReceived: 155, treevus: 10500, streak: 10 },
                { id: 'member-16', name: 'Andrés Cruz', avatarInitial: 'AC', kudosReceived: 115, treevus: 8300, streak: 1 },
            ],
            collectiveKudos: 980,
            goal: {
                title: "Inversión en Desarrollo",
                target: 4000,
                reward: "Suscripción a Platzi Expert+ para todos 🎓"
            }
        },
    ];
};

interface TribesContextType {
    tribes: Tribe[];
    missions: Mission[];
    sendKudos: (recipientId: string, amount: number, type: 'user' | 'tribe') => void;
    acceptMission: (tribeId: string, missionId: string) => void;
    updateMissionProgress: (tribeId: string, metric: MissionMetric, value: number) => void;
}

const TribesContext = createContext<TribesContextType | undefined>(undefined);

export const TribesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { user, updateUser } = useAuth();
    const [tribes, setTribes] = useState<Tribe[]>([]);
    const [missions, setMissions] = useState<Mission[]>(MOCK_MISSIONS);
    const [isInitialLoad, setIsInitialLoad] = useState(true);

    useEffect(() => {
        const loadData = () => {
            let loadedTribes: Tribe[];
            let loadedMissions: Mission[];
            try {
                const savedTribes = localStorage.getItem('treevu-tribes');
                const savedMissions = localStorage.getItem('treevu-company-challenges');
                
                loadedTribes = savedTribes ? JSON.parse(savedTribes) : generateMockTribes();
                // Company challenges override the default mock missions if they exist
                loadedMissions = savedMissions ? JSON.parse(savedMissions) : MOCK_MISSIONS;

            } catch (e) { 
                console.error("Failed to load data from localStorage", e); 
                loadedTribes = generateMockTribes();
                loadedMissions = MOCK_MISSIONS;
            }

            // Dynamically inject the current user into their tribe for data consistency
            if (user && user.tribeId) {
                loadedTribes = loadedTribes.map(tribe => {
                    tribe.members = tribe.members.filter(m => m.id !== user.id && m.name !== 'Tú');
                    if (tribe.id === user.tribeId) {
                        const newMember: TribeMember = {
                            id: user.id,
                            name: 'Tú',
                            avatarInitial: user.name.split(' ').map(n => n[0]).join(''),
                            kudosReceived: user.kudosReceived,
                            treevus: user.treevus,
                            streak: user.streak?.count || 0,
                        };
                        tribe.members.unshift(newMember);
                    }
                    return tribe;
                });
            }

            setTribes(loadedTribes);
            setMissions(loadedMissions);
            setIsInitialLoad(false);
        };
        
        loadData();

        // Listen for storage events to sync across tabs/components
        window.addEventListener('storage', loadData);
        return () => window.removeEventListener('storage', loadData);

    }, [user]);
    
    useEffect(() => {
        if (isInitialLoad) return;
        try {
            localStorage.setItem('treevu-tribes', JSON.stringify(tribes));
        } catch(e) { console.error("Failed to save tribes to localStorage", e); }
    }, [tribes, isInitialLoad]);
    
    const updateMissionProgress = useCallback((tribeId: string, metric: MissionMetric, value: number) => {
        setTribes(prevTribes => 
            prevTribes.map(tribe => {
                if (tribe.id === tribeId && tribe.activeMissionId) {
                    const mission = missions.find(m => m.id === tribe.activeMissionId);
                    if (mission && mission.metric === metric) {
                        const newProgress = (tribe.missionProgress || 0) + value;
                        // Handle mission completion
                        if (newProgress >= mission.target) {
                            // TODO: Add team notification and distribute rewards
                            return { ...tribe, missionProgress: newProgress };
                        }
                        return { ...tribe, missionProgress: newProgress };
                    }
                }
                return tribe;
            })
        );
    }, [missions]);


    const sendKudos = useCallback((recipientId: string, amount: number, type: 'user' | 'tribe') => {
        if (!user) return;
        
        // Sending kudos always increments the "sent" counter.
        updateUser({ kudosSent: (user.kudosSent || 0) + 1 });
        if(user.tribeId) {
            updateMissionProgress(user.tribeId, 'kudosSentCount', 1);
        }

        setTribes(prevTribes => {
            return prevTribes.map(tribe => {
                if (type === 'user') {
                    // When giving to a user, 'amount' is always 1 (one recognition)
                    return {
                        ...tribe,
                        members: tribe.members.map(member => 
                            member.id === recipientId 
                                ? { ...member, kudosReceived: member.kudosReceived + 1 }
                                : member
                        )
                    };
                }
                if (type === 'tribe' && tribe.id === recipientId) {
                    // When contributing to the forest, 'amount' is the number of Treevüs
                    return { ...tribe, collectiveKudos: tribe.collectiveKudos + amount };
                }
                return tribe;
            });
        });
    }, [user, updateUser, updateMissionProgress]);
    
    const acceptMission = useCallback((tribeId: string, missionId: string) => {
        setTribes(prevTribes =>
            prevTribes.map(tribe =>
                tribe.id === tribeId
                    ? { ...tribe, activeMissionId: missionId, missionProgress: 0 }
                    : tribe
            )
        );
    }, []);

    const value = useMemo(() => ({ tribes, missions, sendKudos, acceptMission, updateMissionProgress }), [tribes, missions, sendKudos, acceptMission, updateMissionProgress]);
    
    return (
        <TribesContext.Provider value={value}>
            {children}
        </TribesContext.Provider>
    );
};

export const useTribes = () => {
    const context = useContext(TribesContext);
    if (context === undefined) {
        throw new Error('useTribes must be used within a TribesProvider');
    }
    return context;
};