import React, { useState, useEffect } from 'react';
import { BosqueIcon, InformationCircleIcon } from './Icons';
import { useAuth } from '../contexts/AuthContext';
import { useModal } from '../contexts/ModalContext';

const TREEVUS_PER_TREE = 10000;

const BosqueColectivoWidget: React.FC = () => {
    const { user } = useAuth();
    const { openModal } = useModal();
    const [collectiveTotal, setCollectiveTotal] = useState(1234567);
    const [personalTotal, setPersonalTotal] = useState(0);

    useEffect(() => {
        const updateTotals = () => {
            if (!user) return;
            const collective = Number(localStorage.getItem('treevu_collective_total') || 1234567);
            const personal = Number(localStorage.getItem(`treevu_personal_contribution_${user.id}`) || 0);
            setCollectiveTotal(collective);
            setPersonalTotal(personal);
        };

        updateTotals(); // Initial read

        // Listen for changes from other tabs/windows
        window.addEventListener('storage', updateTotals);
        return () => window.removeEventListener('storage', updateTotals);
    }, [user]);

    const treeCount = Math.floor(collectiveTotal / TREEVUS_PER_TREE);
    const progressToNextTree = (collectiveTotal % TREEVUS_PER_TREE) / TREEVUS_PER_TREE * 100;

    return (
        <div className="bg-surface rounded-2xl p-4 w-full mb-6 animate-grow-and-fade-in">
            <div className="flex justify-between items-start">
                <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                    <BosqueIcon className="w-6 h-6 text-primary" />
                    Bosque Colectivo
                </h3>
                <button onClick={() => openModal('proofOfImpact')} className="text-on-surface-secondary hover:text-on-surface">
                    <InformationCircleIcon className="w-5 h-5" />
                </button>
            </div>

            <div className="text-center my-4">
                <p className="text-4xl font-black text-primary tracking-tighter">{treeCount.toLocaleString()}</p>
                <p className="text-sm font-semibold text-on-surface-secondary -mt-1">Árboles Plantados por la Comunidad</p>
            </div>

            <div>
                <div className="flex justify-between items-center text-xs text-on-surface-secondary mb-1">
                    <span>Progreso al siguiente árbol</span>
                    <span className="font-bold">{progressToNextTree.toFixed(0)}%</span>
                </div>
                <div className="h-2 w-full bg-active-surface rounded-full progress-bar-bg-textured">
                    <div
                        className="h-2 rounded-full bg-primary progress-bar-neon"
                        style={{ width: `${progressToNextTree}%` }}
                    ></div>
                </div>
            </div>

            <div className="mt-3 text-center bg-background p-2 rounded-lg">
                <p className="text-xs text-on-surface-secondary">
                    Tu Aporte Personal: <strong className="text-primary">{personalTotal.toLocaleString()} treevüs</strong>
                </p>
            </div>
        </div>
    );
};

export default BosqueColectivoWidget;