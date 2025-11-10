import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTribes } from '../contexts/TribesContext';
import { RocketLaunchIcon, CheckBadgeIcon, GiftIcon } from './Icons';

const MissionsView: React.FC = () => {
    const { user } = useAuth();
    const { tribes, missions, acceptMission } = useTribes();

    const userTribe = tribes.find(t => t.id === user?.tribeId);
    const activeMission = userTribe?.activeMissionId ? missions.find(m => m.id === userTribe.activeMissionId) : null;
    const availableMissions = missions.filter(m => m.id !== userTribe?.activeMissionId);

    if (!userTribe) {
        return (
            <div className="bg-surface rounded-2xl p-4 text-center">
                <p className="text-on-surface-secondary">Debes pertenecer a un escuadrón para participar en misiones.</p>
            </div>
        );
    }

    return (
        <div className="space-y-4 animate-grow-and-fade-in">
            <div className="bg-surface rounded-2xl p-4">
                <h2 className="text-xl font-bold text-on-surface mb-2 flex items-center">
                    <RocketLaunchIcon className="w-6 h-6 mr-2 text-primary"/>
                    Expediciones de Escuadrón
                </h2>
                <p className="text-sm text-on-surface-secondary">
                    ¡Colabora con tu equipo para completar misiones y obtener un botín para todo el escuadrón!
                </p>
            </div>

            {/* Active Mission */}
            {activeMission && (
                 <div className="bg-surface rounded-2xl p-4 border-2 border-primary shadow-lg shadow-primary/10">
                    <p className="text-sm font-bold text-primary mb-2">Misión Activa</p>
                    <div className="flex items-start gap-4">
                        <span className="text-4xl">{activeMission.icon}</span>
                        <div>
                            <h3 className="font-bold text-on-surface">{activeMission.title}</h3>
                            <p className="text-xs text-on-surface-secondary mt-1">{activeMission.description}</p>
                        </div>
                    </div>
                    
                    <div className="mt-4">
                        <div className="flex justify-between items-center text-xs text-on-surface-secondary mb-1">
                            <span>Progreso: <span className="font-bold text-on-surface">{userTribe.missionProgress || 0} / {activeMission.target}</span></span>
                            <span className="font-bold text-primary">
                                {Math.min(100, (((userTribe.missionProgress || 0) / activeMission.target) * 100)).toFixed(0)}%
                            </span>
                        </div>
                        <div className="h-2.5 w-full bg-active-surface rounded-full">
                            <div
                                className="h-2.5 rounded-full bg-primary"
                                style={{ width: `${Math.min(100, (((userTribe.missionProgress || 0) / activeMission.target) * 100))}%` }}
                            ></div>
                        </div>
                    </div>
                    {(userTribe.missionProgress || 0) >= activeMission.target && (
                        <div className="mt-3 text-center p-2 bg-primary/20 rounded-lg text-sm font-bold text-primary flex items-center justify-center gap-2">
                            <CheckBadgeIcon className="w-5 h-5"/>
                            ¡Misión Completada! El botín será distribuido.
                        </div>
                    )}
                </div>
            )}

            {/* Available Missions */}
            <div className="space-y-3">
                 <h3 className="text-sm font-bold text-on-surface-secondary uppercase tracking-wider">
                    Misiones Disponibles
                </h3>
                {availableMissions.map(mission => (
                    <div key={mission.id} className="bg-surface rounded-2xl p-4">
                        <div className="flex items-start gap-4">
                            <span className="text-4xl">{mission.icon}</span>
                            <div>
                                <h3 className="font-bold text-on-surface">{mission.title}</h3>
                                <p className="text-xs text-on-surface-secondary mt-1">{mission.description}</p>
                            </div>
                        </div>
                         <div className="mt-4 flex justify-between items-center">
                             <div className="flex items-center gap-1 font-bold text-yellow-400">
                                <GiftIcon className="w-5 h-5"/>
                                <span>{mission.reward.toLocaleString()}</span>
                                <span className="text-xs">Botín</span>
                            </div>
                            <button
                                onClick={() => acceptMission(userTribe.id, mission.id)}
                                disabled={!!activeMission}
                                className="px-4 py-1.5 text-sm font-bold rounded-full transition-colors bg-primary text-primary-dark disabled:bg-active-surface disabled:text-on-surface-secondary disabled:cursor-not-allowed"
                            >
                                Aceptar
                            </button>
                        </div>
                    </div>
                ))}
                {activeMission && availableMissions.length > 0 && (
                    <p className="text-center text-xs text-on-surface-secondary">Completa tu misión actual para aceptar una nueva.</p>
                )}
            </div>
        </div>
    );
};

export default MissionsView;