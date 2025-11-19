

import React, { useState, useMemo, useEffect } from 'react';
import { useTribes } from '@/contexts/TribesContext';
import { useModal } from '@/hooks/useZustandCompat';
import { UsersIcon, TrophyIcon, PlusIcon, BosqueIcon, BroteIcon, HandThumbUpIcon, MagnifyingGlassIcon } from '@/components/ui/Icons';
import Tooltip from '@/components/ui/Tooltip.tsx';
// FIX: Updated imports from deprecated 'types.ts' to 'types/tribe.ts'.
import type { Tribe, TribeMember } from '@/types/tribe';

const KUDOS_PER_TREE = 250;

const CollaborativeForest: React.FC<{ tribe: Tribe; onContribute: () => void; }> = ({ tribe, onContribute }) => {
    const totalKudos = tribe.collectiveKudos + tribe.members.reduce((sum, m) => sum + m.kudosReceived, 0);
    const treeCount = Math.floor(totalKudos / KUDOS_PER_TREE);
    const progressToNextTree = (totalKudos % KUDOS_PER_TREE) / KUDOS_PER_TREE * 100;
    
    return (
        <div className="bg-surface rounded-2xl p-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
                <h3 className="text-lg font-bold text-on-surface">El Bosque de tu Escuadrón</h3>
                <Tooltip
                    id="forest-tooltip"
                    text="El bosque de tu escuadrón crece con cada 'kudo' enviado y recibido. Cada árbol es un símbolo de vuestra cultura de reconocimiento colectivo. ¡Mientras más grande el bosque, más fuerte el equipo!"
                />
            </div>
            <div className="flex flex-wrap justify-center items-end gap-x-2 gap-y-2 min-h-[60px] text-primary">
                {treeCount > 0 ? (
                    Array.from({ length: treeCount }).map((_, i) => (
                        <BosqueIcon
                            key={i}
                            className="w-12 h-12 animate-grow-and-fade-in"
                            style={{ animationDelay: `${i * 75}ms` }}
                        />
                    ))
                ) : (
                    <div className="text-center text-on-surface-secondary animate-grow-and-fade-in">
                        <BroteIcon className="w-10 h-10 mx-auto text-primary/50" />
                        <p className="text-sm mt-2">¡Planta el primer árbol aportando Kudos!</p>
                    </div>
                )}
            </div>
            <div className="mt-4">
                <div className="flex justify-between text-xs text-on-surface-secondary mb-1">
                    <span>Próximo árbol</span>
                    <span className="font-bold text-primary">{totalKudos % KUDOS_PER_TREE} / {KUDOS_PER_TREE}</span>
                </div>
                 <div className="h-2 w-full bg-active-surface rounded-full">
                    <div
                        className="h-2 rounded-full bg-primary"
                        style={{ width: `${progressToNextTree}%` }}
                    ></div>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-active-surface/50">
                <p className="text-sm text-on-surface-secondary mb-3">
                    Aportar tus Treevüs es un gesto que beneficia a todo el escuadrón, haciendo crecer el bosque más rápido.
                </p>
                <button onClick={onContribute} className="w-full bg-primary/20 text-primary font-bold py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/30 transition-colors">
                    <PlusIcon className="w-5 h-5"/> Aportar Treevüs al Bosque
                </button>
            </div>
        </div>
    );
};

const TeamsView: React.FC = () => {
    // Usuario estático
    const user = {
        id: 'static-user-id',
        name: 'Usuario Demo',
        tribeId: 'tribe-1'
    };
    const { tribes } = useTribes();
    const { openModal } = useModal();
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState<TribeMember[]>([]);

    const allMembers = useMemo(() => 
        tribes.flatMap(tribe => tribe.members.map(member => ({ ...member, tribeName: tribe.name })))
    , [tribes]);

    useEffect(() => {
        if (searchQuery.trim().length > 1) {
            const lowercasedQuery = searchQuery.toLowerCase();
            const results = allMembers.filter(member => 
                member.name.toLowerCase().includes(lowercasedQuery) && member.name !== 'Tú'
            );
            setSearchResults(results);
        } else {
            setSearchResults([]);
        }
    }, [searchQuery, allMembers]);

    const myTribe = user?.tribeId ? tribes.find(t => t.id === user.tribeId) : null;

    if (!myTribe) {
        return (
            <div className="bg-surface rounded-2xl p-4 text-center animate-grow-and-fade-in">
                <UsersIcon className="w-12 h-12 text-on-surface-secondary/20 mx-auto mb-4"/>
                <h3 className="font-bold">Aún no eres parte de un Escuadrón</h3>
                <p className="text-sm text-on-surface-secondary mt-1">¡Pronto podrás unirte a uno y empezar a competir y colaborar!</p>
            </div>
        );
    }

    const rankedMembers = [...myTribe.members].sort((a, b) => b.kudosReceived - a.kudosReceived);

    const handleSendKudos = (recipient: TribeMember | Tribe) => {
        openModal('sendKudos', { recipient });
    };

    return (
        <div className="space-y-4 animate-grow-and-fade-in">
            <CollaborativeForest tribe={myTribe} onContribute={() => handleSendKudos(myTribe)} />
            
            <div className="bg-surface rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-on-surface flex items-center">
                            <TrophyIcon className="w-6 h-6 mr-2 text-yellow-400" />
                            Ranking de Trofeos
                        </h3>
                        <Tooltip
                            id="ranking-tooltip"
                            text="Este ranking muestra quién ha recibido más reconocimiento (trofeos) de sus compañeros. ¡Envía un trofeo para apreciar su trabajo y ayudarlos a subir en la clasificación!"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    {rankedMembers.map((member, index) => (
                        <div key={member.id} className="bg-background p-3 rounded-xl flex items-center gap-3">
                            <span className="font-bold text-lg w-6 text-center text-on-surface-secondary">{index + 1}</span>
                            <div className="w-10 h-10 rounded-full bg-active-surface flex items-center justify-center font-bold text-on-surface">{member.avatarInitial}</div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-on-surface text-sm truncate">{member.name}</p>
                                <div className="flex items-center text-xs text-yellow-400/80 font-semibold mt-0.5">
                                    <TrophyIcon className="w-3.5 h-3.5 mr-1"/>
                                    <span>{member.kudosReceived} trofeos</span>
                                </div>
                            </div>
                            {member.name !== 'Tú' && (
                                <button 
                                    onClick={() => handleSendKudos(member)}
                                    className="flex items-center gap-1.5 font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full text-sm hover:bg-yellow-400/20 transition-colors whitespace-nowrap"
                                >
                                    <HandThumbUpIcon className="w-4 h-4"/> Reconocer
                                </button>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-surface rounded-2xl p-4">
                <h3 className="text-lg font-bold text-on-surface mb-3">Reconocimiento General</h3>
                <div className="relative">
                    <MagnifyingGlassIcon className="w-5 h-5 text-on-surface-secondary absolute left-3 top-1/2 -translate-y-1/2"/>
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Buscar a un colega..."
                        className="w-full bg-background border border-active-surface rounded-xl p-2.5 pl-10"
                    />
                </div>
                <div className="mt-3 space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                    {searchResults.map(member => (
                         <div key={member.id} className="bg-background p-3 rounded-xl flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-active-surface flex items-center justify-center font-bold text-on-surface">{member.avatarInitial}</div>
                            <div className="flex-1 min-w-0">
                                <p className="font-bold text-on-surface text-sm truncate">{member.name}</p>
                                <p className="text-xs text-on-surface-secondary">{(member as any).tribeName}</p>
                            </div>
                            <button 
                                onClick={() => handleSendKudos(member)}
                                className="flex items-center gap-1.5 font-bold text-yellow-400 bg-yellow-400/10 px-3 py-1.5 rounded-full text-sm hover:bg-yellow-400/20 transition-colors"
                            >
                                <HandThumbUpIcon className="w-4 h-4"/> Reconocer
                            </button>
                        </div>
                    ))}
                     {searchQuery.length > 1 && searchResults.length === 0 && (
                        <p className="text-center text-sm text-on-surface-secondary py-4">No se encontraron colegas.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TeamsView;