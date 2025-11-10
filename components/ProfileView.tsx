import React, { useState, useEffect, useMemo } from 'react';
import {
    PencilIcon, IdentificationIcon, CheckIcon, DocumentArrowDownIcon, TrashIcon,
    InformationCircleIcon, BookOpenIcon, UserCircleIcon,
    TrophyIcon,
    BroteIcon, PlantonIcon, ArbustoIcon, RobleIcon, BosqueIcon, TreevuCoinIcon, ChevronDownIcon
} from './Icons';
import { useAuth } from '../contexts/AuthContext';
import GamificationBar from './GamificationBar';
import { useAppContext } from '../contexts/AppContext';
import { useAlert } from '../contexts/AlertContext';
import { useModal } from '../contexts/ModalContext';
import ThemeSwitcher from './ThemeSwitcher';
import { levelData } from '../services/gamificationService';
import LearnView from './LearnView';
import { BadgeType } from '../types/user';
import { useTribes } from '../contexts/TribesContext';
import SubNavBar from './SubNavBar';
import { TreevuLevel } from '../types/common';
import StatusCard from './StatusCard';


type ProfileSubTab = 'profile' | 'learn';

const badgeData: { [key in BadgeType]: { icon: string; title: string; description: (user: any) => string; isUnlocked: (user: any) => boolean } } = {
    pioneer: { icon: '🚀', title: "Pionero Fundador", description: () => "Por ser de los primeros en unirte a la aventura treevü.", isUnlocked: () => true },
    level: { icon: '🏆', title: "Maestro del Bosque", description: user => `Alcanzaste el nivel ${levelData[user.level].name}.`, isUnlocked: user => user.level >= 5 },
    streak: { icon: '🔥', title: "Corazón de Fuego", description: user => `Mantuviste una racha de ${user.streak?.count || 0} días.`, isUnlocked: user => (user.streak?.count || 0) >= 7 },
    kudos: { icon: '💖', title: "Corazón Generoso", description: user => `Has enviado ${user.kudosSent} kudos a tus compañeros.`, isUnlocked: user => user.kudosSent >= 25 },
};

const MyTribeCard: React.FC = () => {
    const { user } = useAuth();
    const { tribes } = useTribes();

    const myTribe = useMemo(() => tribes.find(t => t.id === user?.tribeId), [tribes, user]);
    
    if (!myTribe || !user) return null;

    const rankedMembers = [...myTribe.members].sort((a, b) => b.kudosReceived - a.kudosReceived);
    const myRank = rankedMembers.findIndex(m => m.id === user?.id) + 1;
    const currentUserInTribe = myTribe.members.find(m => m.id === user?.id);

    return (
        <div className="bg-background rounded-2xl p-4">
            <h4 className="font-bold text-on-surface mb-3 text-sm flex items-center">{myTribe.icon} {myTribe.name}</h4>
            <div className="space-y-3">
                 <div className="text-center bg-active-surface p-2 rounded-lg">
                    <p className="text-xs text-on-surface-secondary">Tu Ranking en el Escuadrón</p>
                    <p className="text-2xl font-bold text-primary">#{myRank > 0 ? myRank : 'N/A'}</p>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                     <div className="bg-active-surface p-2 rounded-lg text-center">
                         <p className="text-xs text-on-surface-secondary flex items-center justify-center gap-1"><TrophyIcon className="w-4 h-4 text-yellow-400"/> Recibidos</p>
                         <p className="font-bold text-lg">{currentUserInTribe?.kudosReceived.toLocaleString()}</p>
                     </div>
                     <div className="bg-active-surface p-2 rounded-lg text-center">
                         <p className="text-xs text-on-surface-secondary flex items-center justify-center gap-1"><TrophyIcon className="w-4 h-4" title="Kudos enviados"/> Enviados</p>
                         <p className="font-bold text-lg">{user?.kudosSent.toLocaleString()}</p>
                     </div>
                 </div>
            </div>
        </div>
    );
}

const AchievementsSection: React.FC = () => {
    const { user, updateUser } = useAuth();
    if (!user) return null;
    
    const unlockedBadges = Object.keys(badgeData).filter(key => badgeData[key as BadgeType].isUnlocked(user)) as BadgeType[];

    const handleSelectBadge = (badge: BadgeType) => {
        updateUser({ featuredBadge: badge });
    };

    return (
        <div className="bg-background rounded-2xl p-4">
            <h4 className="font-bold text-on-surface mb-3 text-sm">Insignias y Logros</h4>
            <div className="grid grid-cols-4 gap-3">
                {(Object.keys(badgeData) as BadgeType[]).map(key => {
                    const badge = badgeData[key];
                    const isUnlocked = unlockedBadges.includes(key);
                    const isFeatured = user.featuredBadge === key;

                    return (
                        <div key={key} className="tooltip-container flex flex-col items-center">
                            <button
                                onClick={() => isUnlocked && handleSelectBadge(key)}
                                disabled={!isUnlocked}
                                className={`w-14 h-14 text-3xl rounded-full flex items-center justify-center transition-all duration-200 ${
                                    isUnlocked ? 'bg-active-surface' : 'bg-active-surface/50 grayscale opacity-50'
                                } ${isFeatured ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}
                            >
                                {badge.icon}
                            </button>
                            <div className="tooltip-box !w-40">
                                <p className="font-bold">{badge.title}</p>
                                <p className="text-xs mt-1">{isUnlocked ? badge.description(user) : '???'}</p>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};


const ProfileContent: React.FC<{ setActiveTab: (tab: any) => void }> = ({ setActiveTab }) => {
    const { user, signOut, updateUser } = useAuth();
    const { state: { expenses, budget, annualIncome } } = useAppContext();
    const { setAlert } = useAlert();
    const { openModal } = useModal();
    
    const [isEditingDocId, setIsEditingDocId] = useState(false);
    const [docIdValue, setDocIdValue] = useState(user?.documentId || '');
    const [validationMessage, setValidationMessage] = useState('');
    const [expandedRewardId, setExpandedRewardId] = useState<string | null>(null);

    if (!user) return null;
    
    const handleToggleReward = (id: string) => {
        setExpandedRewardId(prevId => (prevId === id ? null : id));
    };

    const handleSaveDocId = () => {
        if (docIdValue.length !== 8) {
            setValidationMessage('El DNI debe tener 8 dígitos.');
            return;
        }
        updateUser({ documentId: docIdValue });
        setIsEditingDocId(false);
        setValidationMessage('');
    };
    
    const handleEditClick = () => {
        setDocIdValue(user.documentId || '');
        setIsEditingDocId(true);
        setValidationMessage('');
    }

    const handleExportData = () => {
        if (!user) return;
        const dataToExport = { user, expenses, budget, annualIncome, exportDate: new Date().toISOString() };
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(dataToExport, null, 2))}`;
        const link = document.createElement("a");
        link.href = jsonString;
        link.download = `treevu-backup-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
    };

    const handleGoogleSheetsExport = () => {
        setAlert({
            type: 'info',
            message: 'Esta funcionalidad se encuentra en desarrollo y estará disponible próximamente.'
        });
    };
    
    const handleResetData = () => {
        if (window.confirm("¿Estás seguro de que quieres reiniciar la aplicación? Se borrarán todos tus datos. Esta acción no se puede deshacer.")) {
            localStorage.clear();
            signOut();
        }
    };

    const renderDocIdContent = () => {
        if (isEditingDocId) {
            return (
                <div className="w-full mt-2 animate-fade-in">
                    <div className="flex items-center space-x-2">
                         <input
                            type="text"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            value={docIdValue}
                            onChange={(e) => setDocIdValue(e.target.value.replace(/\D/g, ''))}
                            maxLength={8}
                            placeholder="Ingresa tu DNI"
                            className="flex-grow bg-active-surface border border-active-surface rounded-lg p-2 outline-none transition focus:border-primary focus:ring-1 focus:ring-primary"
                        />
                        <button
                            onClick={handleSaveDocId}
                            className="bg-primary text-primary-dark font-bold px-3 py-2 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center"
                            aria-label="Guardar DNI"
                        >
                            <CheckIcon className="w-5 h-5" />
                        </button>
                    </div>
                     {validationMessage && (
                        <p className="text-xs mt-2 text-center text-danger">
                            {validationMessage}
                        </p>
                    )}
                </div>
            )
        }
        
        return (
            <div className="flex items-center space-x-2 text-on-surface-secondary">
                <IdentificationIcon className="w-5 h-5"/>
                <span className="flex-grow">{user.documentId || 'No has añadido un DNI'}</span>
                <button onClick={handleEditClick} className="text-primary hover:opacity-80" aria-label="Editar DNI">
                     <PencilIcon className="w-5 h-5"/>
                </button>
            </div>
        )
    };

    return (
        <div className="animate-fade-in space-y-4">
            <StatusCard />
            <GamificationBar onOpen={() => openModal('gamificationLevels')} />
            <MyTribeCard />
            <AchievementsSection />
            
             <div className="w-full">
                <h4 className="text-sm font-bold text-on-surface-secondary mb-2">Mis Beneficios Canjeados</h4>
                {user.redeemedRewards && user.redeemedRewards.length > 0 ? (
                    <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                        {user.redeemedRewards.slice().reverse().map(reward => {
                             const uniqueId = reward.rewardId + reward.date;
                             const isExpanded = expandedRewardId === uniqueId;
                            return (
                                <div key={uniqueId} className="bg-background rounded-xl">
                                    <button
                                        onClick={() => handleToggleReward(uniqueId)}
                                        className="w-full p-3 flex items-center gap-3 text-left"
                                        aria-expanded={isExpanded}
                                    >
                                        <span className="text-2xl">{reward.icon}</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-bold text-on-surface text-sm truncate">{reward.title}</p>
                                            <p className="text-xs text-on-surface-secondary">
                                                {new Date(reward.date).toLocaleDateString('es-PE', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                        <div className="text-right flex-shrink-0 flex items-center gap-2">
                                            <p className="font-bold text-primary text-sm flex items-center gap-1">
                                                {reward.costInTreevus.toLocaleString()}
                                                <TreevuCoinIcon className="w-4 h-4" level={user.level} />
                                            </p>
                                            <ChevronDownIcon className={`w-5 h-5 text-on-surface-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
                                        </div>
                                    </button>
                                    <div
                                        className="transition-all duration-300 ease-in-out overflow-hidden"
                                        style={{ maxHeight: isExpanded ? '150px' : '0px' }}
                                    >
                                        <div className="px-4 pb-3 pt-1 border-t border-active-surface">
                                            <h5 className="text-xs font-bold text-on-surface-secondary mb-1">Condiciones del Beneficio</h5>
                                            <p className="text-xs text-on-surface-secondary">{reward.description}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className="bg-background p-4 rounded-xl text-center">
                        <p className="text-sm text-on-surface-secondary">Aún no has canjeado ningún beneficio.</p>
                    </div>
                )}
            </div>

            <div className="w-full p-3 bg-background rounded-2xl">
                {renderDocIdContent()}
            </div>
            
            <div className="w-full">
                <h4 className="text-sm font-bold text-on-surface-secondary mb-2">Apariencia</h4>
                <ThemeSwitcher />
            </div>
            
            <div className="w-full pt-4 border-t border-active-surface/50 space-y-2.5">
                <div className="grid grid-cols-2 gap-2.5">
                     <button onClick={handleExportData} className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:bg-background">
                        <DocumentArrowDownIcon className="w-5 h-5 mr-2" /> Exportar .JSON
                    </button>
                     <button onClick={handleGoogleSheetsExport} className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:bg-background">
                        <DocumentArrowDownIcon className="w-5 h-5 mr-2" /> Exportar a Sheets
                    </button>
                </div>
                <button onClick={signOut} className="w-full flex items-center justify-center px-4 py-3 text-sm font-bold text-on-surface bg-active-surface rounded-xl hover:bg-background">
                    Cerrar Sesión
                </button>
            </div>
        </div>
    );
};

const ProfileView: React.FC<{ setActiveTab: (tab: any) => void }> = ({ setActiveTab }) => {
    const [activeSubTab, setActiveSubTab] = useState<ProfileSubTab>('profile');
    
    const subTabs = [
        { id: 'profile' as const, label: 'Mi Perfil', Icon: UserCircleIcon },
        { id: 'learn' as const, label: 'Senda', Icon: BookOpenIcon },
    ];

    return (
        <div className="animate-fade-in">
            <SubNavBar tabs={subTabs} activeTab={activeSubTab} onTabClick={(tab) => setActiveSubTab(tab)} />

            <div className="space-y-4">
                {activeSubTab === 'profile' && <ProfileContent setActiveTab={setActiveTab} />}
                {activeSubTab === 'learn' && <LearnView />}
            </div>
        </div>
    );
};

export default ProfileView;