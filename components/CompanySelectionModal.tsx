import React, { useState, useMemo } from 'react';
import ModalWrapper from './ModalWrapper';
import { useAuth } from '../contexts/AuthContext';
import { MOCK_ALLIANCES } from '../services/companyService';
import { BuildingOffice2Icon, CheckIcon, MagnifyingGlassIcon } from './Icons';
import Logo from './Logo';

interface CompanySelectionModalProps {
    onClose: () => void;
}

const CompanySelectionModal: React.FC<CompanySelectionModalProps> = ({ onClose }) => {
    const { linkCompany } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState<string | null>(null); // store company id being loaded
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const filteredCompanies = useMemo(() => {
        if (!searchQuery.trim()) {
            return MOCK_ALLIANCES;
        }
        const lowercasedQuery = searchQuery.toLowerCase();
        return MOCK_ALLIANCES.filter(company =>
            company.name.toLowerCase().includes(lowercasedQuery)
        );
    }, [searchQuery]);

    const handleLink = async (companyId: string, companyCode: string) => {
        setIsLoading(companyId);
        setError('');
        setSuccess('');
        try {
            const company = await linkCompany(companyCode);
            setSuccess(`¡Vinculado con ${company.name}! Redirigiendo...`);
            // The context change will trigger navigation, no need to call onClose manually
        } catch (err: any) {
            setError(err.message || 'Error al vincular.');
            setIsLoading(null);
        }
    };

    return (
        <ModalWrapper title="Empresas Afiliadas" onClose={onClose}>
            <div className="space-y-4 -mt-4">
                <p className="text-sm text-on-surface-secondary">
                    Selecciona tu empresa para vincular tu cuenta y desbloquear beneficios exclusivos, incluyendo el Asistente IA gratuito.
                </p>
                <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <MagnifyingGlassIcon className="h-5 w-5 text-on-surface-secondary" />
                    </div>
                    <input
                        type="search"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Busca tu empresa..."
                        className="block w-full rounded-xl border-transparent bg-background py-2.5 pl-10 pr-4 text-on-surface placeholder:text-on-surface-secondary focus:border-primary focus:ring-1 focus:ring-primary"
                    />
                </div>
                {error && <p className="text-danger text-sm text-center">{error}</p>}
                {success && <p className="text-primary font-bold text-sm text-center flex items-center justify-center gap-2"><CheckIcon className="w-5 h-5"/> {success}</p>}
                
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                    {filteredCompanies.length > 0 ? (
                        filteredCompanies.map(company => (
                            <button
                                key={company.id}
                                onClick={() => handleLink(company.id, company.validCodes[0])}
                                disabled={!!isLoading}
                                className="w-full p-3 bg-active-surface rounded-lg text-left flex items-center gap-3 transition-colors hover:bg-background disabled:opacity-50"
                            >
                                <Logo src={company.branding.logoUrl} className="w-8 h-8 rounded-md flex-shrink-0" />
                                <span className="font-semibold text-on-surface flex-1">{company.name}</span>
                                {isLoading === company.id && <div className="w-5 h-5 border-2 border-t-primary border-background rounded-full animate-spin"></div>}
                            </button>
                        ))
                    ) : (
                        <p className="text-center text-sm text-on-surface-secondary py-8">No se encontraron empresas.</p>
                    )}
                </div>
            </div>
        </ModalWrapper>
    );
};

export default CompanySelectionModal;