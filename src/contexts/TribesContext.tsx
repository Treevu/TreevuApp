import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { Tribe, Mission, MissionMetric, TribeMember } from '@/types/tribe';


const MOCK_MISSIONS: Mission[] = [
    {
        id: 'mission-formal-1',
        title: 'Expedición de Formalidad',
        description: 'Registren 50 gastos formales como equipo esta semana para fortalecer sus hábitos y su ahorro fiscal.',
        metric: 'formalExpenseCount',
        target: 50,
        reward: 1000,
        icon: '🧾',
    },
    {
        id: 'mission-kudos-1',
        title: 'Expedición de Camaradería',
        description: 'Envíen 100 kudos entre todos los miembros del escuadrón para fortalecer los lazos de equipo.',
        metric: 'kudosSentCount',
        target: 100,
        reward: 500,
        icon: '💖',
    },
];


// Mock data generation function (moved from DataContext)
const generateMockTribes = (): Tribe[] => {
    return [
        {
            id: 'centauri-1',
            name: 'Escuadrón Centauri',
            icon: '💫',
            members: [
                { id: 'user-mock-id', name: 'Tú', avatarInitial: 'AC', kudosReceived: 42 },
                { id: 'member-2', name: 'Ana Morales', avatarInitial: 'AM', kudosReceived: 210 },
                { id: 'member-3', name: 'Carlos Diaz', avatarInitial: 'CD', kudosReceived: 180 },
                { id: 'member-4', name: 'Laura Fernández', avatarInitial: 'LF', kudosReceived: 150 },
                { id: 'member-12', name: 'Roberto Gómez', avatarInitial: 'RG', kudosReceived: 95 },
                { id: 'member-13', name: 'Patricia Soto', avatarInitial: 'PS', kudosReceived: 110 },
            ],
            collectiveKudos: 1250,
            activeMissionId: 'mission-formal-1', // Active mission for demo
            missionProgress: 35, // Some progress for demo
        },
        {
            id: 'orion-2',
            name: 'Flota de Orión',
            icon: '🚀',
            members: [
                { id: 'member-5', name: 'Pedro Castillo', avatarInitial: 'PC', kudosReceived: 195 },
                { id: 'member-6', name: 'Sofía Torres', avatarInitial: 'ST', kudosReceived: 230 },
                { id: 'member-7', name: 'Mateo Flores', avatarInitial: 'MF', kudosReceived: 160 },
                { id: 'member-14', name: 'Gabriela Reyes', avatarInitial: 'GR', kudosReceived: 135 },
            ],
            collectiveKudos: 850,
        },
        {
            id: 'andromeda-3',
            name: 'Alianza Andrómeda',
            icon: '🌌',
            members: [
                { id: 'member-8', name: 'Valeria Mendoza', avatarInitial: 'VM', kudosReceived: 140 },
                { id: 'member-9', name: 'Diego Quispe', avatarInitial: 'DQ', kudosReceived: 175 },
                { id: 'member-10', name: 'Isabella Rojas', avatarInitial: 'IR', kudosReceived: 200 },
                { id: 'member-11', name: 'Javier Vargas', avatarInitial: 'JV', kudosReceived: 130 },
                { id: 'member-15', name: 'Camila Paredes', avatarInitial: 'CP', kudosReceived: 155 },
                { id: 'member-16', name: 'Andrés Cruz', avatarInitial: 'AC', kudosReceived: 115 },
            ],
            collectiveKudos: 980,
        },
    ];
};

interface TribesContextType {
    tribes: Tribe[];
    missions: Mission[];
    sendKudos: (recipientId: string, amount: number, type: 'user' | 'tribe', onUserUpdate?: (kudosSent: number) => void) => void;
    acceptMission: (tribeId: string, missionId: string) => void;
    updateMissionProgress: (tribeId: string, metric: MissionMetric, value: number) => void;
    syncUserData: (userId: string, userData: { name: string; tribeId?: string; kudosReceived: number }) => void;
}

const TribesContext = createContext<TribesContextType | undefined>(undefined);

export const TribesProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tribes, setTribes] = useState<Tribe[]>([]);
    const [missions] = useState<Mission[]>(MOCK_MISSIONS);
    const [isInitialLoad, setIsInitialLoad] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);

    useEffect(() => {
        let loadedTribes: Tribe[];
        try {
            const savedTribes = localStorage.getItem('treevu-tribes');
            if (savedTribes) {
                loadedTribes = JSON.parse(savedTribes);
            } else {
                loadedTribes = generateMockTribes();
            }
        } catch (e) { 
            console.error("Failed to load tribes from localStorage", e); 
            loadedTribes = generateMockTribes();
        }

        setTribes(loadedTribes);
        setIsInitialLoad(false);
    }, []);

    useEffect(() => {
        if (isInitialLoad) return;
        try {
            localStorage.setItem('treevu-tribes', JSON.stringify(tribes));
        } catch(e) { 
            console.error("Failed to save tribes to localStorage", e); 
        }
    }, [tribes, isInitialLoad]);

    // Función para sincronizar datos del usuario desde AuthProvider
    const syncUserData = useCallback((userId: string, userData: { name: string; tribeId?: string; kudosReceived: number }) => {
        setCurrentUser({ id: userId, ...userData });
        
        // Actualizar las tribus con los datos del usuario
        setTribes(prevTribes => {
            return prevTribes.map(tribe => {
                // Remover usuario de todas las tribus
                tribe.members = tribe.members.filter(m => m.id !== userId && m.name !== 'Tú');
                
                // Agregar usuario a su tribu correcta
                if (tribe.id === userData.tribeId) {
                    const newMember: TribeMember = {
                        id: userId,
                        name: 'Tú',
                        avatarInitial: userData.name.split(' ').map(n => n[0]).join(''),
                        kudosReceived: userData.kudosReceived,
                    };
                    tribe.members.unshift(newMember);
                }
                return tribe;
            });
        });
    }, []);
    
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


    const sendKudos = useCallback((recipientId: string, amount: number, type: 'user' | 'tribe', onUserUpdate?: (kudosSent: number) => void) => {
        if (!currentUser) return;
        
        // Notificar al AuthProvider sobre el cambio usando callback
        if (onUserUpdate) {
            const newKudosSent = (currentUser.kudosSent || 0) + 1;
            onUserUpdate(newKudosSent);
        }
        
        if (currentUser.tribeId) {
            updateMissionProgress(currentUser.tribeId, 'kudosSentCount', 1);
        }

        setTribes(prevTribes => {
            return prevTribes.map(tribe => {
                if (type === 'user') {
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
                    return { ...tribe, collectiveKudos: tribe.collectiveKudos + amount };
                }
                return tribe;
            });
        });
    }, [currentUser, updateMissionProgress]);
    
    const acceptMission = useCallback((tribeId: string, missionId: string) => {
        setTribes(prevTribes =>
            prevTribes.map(tribe =>
                tribe.id === tribeId
                    ? { ...tribe, activeMissionId: missionId, missionProgress: 0 }
                    : tribe
            )
        );
    }, []);

    const value = useMemo(() => ({ 
        tribes, 
        missions, 
        sendKudos, 
        acceptMission, 
        updateMissionProgress, 
        syncUserData 
    }), [tribes, missions, sendKudos, acceptMission, updateMissionProgress, syncUserData]);
    
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