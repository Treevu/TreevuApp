import React, { useState, useEffect } from 'react';
import { XMarkIcon } from '@/components/ui/Icons';
import { DEPARTMENTS, TENURES, MODALITIES, AGE_RANGES } from '@/types/employer';

interface FilterDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    filters: {
        selectedDepartment: string;
        selectedTenure: string;
        selectedModality: string;
        selectedAgeRange: string;
    };
    setFilters: {
        setSelectedDepartment: (value: string) => void;
        setSelectedTenure: (value: string) => void;
        setSelectedModality: (value: string) => void;
        setSelectedAgeRange: (value: string) => void;
    };
    userDepartment?: string;
}

const FilterSelect: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
    disabled?: boolean;
}> = ({ label, value, onChange, options, disabled }) => (
    <div>
        <label htmlFor={`${label}-select`} className="block text-sm font-medium text-on-surface-secondary mb-1">
            {label}
        </label>
        <select
            id={`${label}-select`}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className="bg-background border border-active-surface text-on-surface text-base rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5 disabled:opacity-50 disabled:cursor-not-allowed"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);

const FilterDrawer: React.FC<FilterDrawerProps> = ({ isOpen, onClose, filters, setFilters, userDepartment }) => {
    const [tempFilters, setTempFilters] = useState(filters);
    const isDisabled = true;

    useEffect(() => {
        if (isOpen) {
            setTempFilters(filters);
        }
    }, [isOpen, filters]);

    const handleFilterChange = (filterName: keyof typeof filters, value: string) => {
        setTempFilters(prev => ({ ...prev, [filterName]: value }));
    };

    const handleApply = () => {
        setFilters.setSelectedDepartment(tempFilters.selectedDepartment);
        setFilters.setSelectedTenure(tempFilters.selectedTenure);
        setFilters.setSelectedModality(tempFilters.selectedModality);
        setFilters.setSelectedAgeRange(tempFilters.selectedAgeRange);
        onClose();
    };
    
    const handleReset = () => {
        setTempFilters({
            selectedDepartment: 'all',
            selectedTenure: 'all',
            selectedModality: 'all',
            selectedAgeRange: 'all',
        });
    };

    const departmentOptions = [
        { value: 'all', label: 'Toda la Empresa' },
        ...DEPARTMENTS.map(d => ({ value: d, label: d }))
    ];
    
    const tenureOptions = [
        { value: 'all', label: 'Todos' },
        ...TENURES.map(t => ({ value: t, label: t === '< 1 año' ? 'Menos de 1 año' : t === '> 5 años' ? 'Más de 5 años' : '1 a 5 años'}))
    ];

    const modalityOptions = [
        { value: 'all', label: 'Todas' },
        ...MODALITIES.map(m => ({ value: m, label: m }))
    ];
    
    const ageRangeOptions = [
        { value: 'all', label: 'Todas' },
        ...AGE_RANGES.map(ar => ({ value: ar, label: `${ar} años`}))
    ];

    return (
        <div 
            className={`fixed inset-0 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            role="dialog"
            aria-modal="true"
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60" onClick={onClose}></div>
            
            {/* Drawer Panel */}
            <div className={`absolute top-0 right-0 h-full w-full max-w-sm bg-surface shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
                <header className="p-4 border-b border-active-surface/50 flex justify-between items-center flex-shrink-0">
                    <h2 id="filter-drawer-title" className="text-lg font-bold text-on-surface">Filtros Estratégicos</h2>
                    <button onClick={onClose} className="text-on-surface-secondary hover:text-on-surface">
                        <XMarkIcon className="w-6 h-6" />
                    </button>
                </header>
                
                <main className="flex-1 p-4 overflow-y-auto space-y-4">
                    <FilterSelect
                        label="Área"
                        value={tempFilters.selectedDepartment}
                        onChange={(e) => handleFilterChange('selectedDepartment', e.target.value)}
                        options={departmentOptions}
                        disabled={isDisabled}
                    />
                    <FilterSelect
                        label="Antigüedad"
                        value={tempFilters.selectedTenure}
                        onChange={(e) => handleFilterChange('selectedTenure', e.target.value)}
                        options={tenureOptions}
                        disabled={isDisabled}
                    />
                    <FilterSelect
                        label="Modalidad"
                        value={tempFilters.selectedModality}
                        onChange={(e) => handleFilterChange('selectedModality', e.target.value)}
                        options={modalityOptions}
                        disabled={isDisabled}
                    />
                    <FilterSelect
                        label="Rango de Edad"
                        value={tempFilters.selectedAgeRange}
                        onChange={(e) => handleFilterChange('selectedAgeRange', e.target.value)}
                        options={ageRangeOptions}
                        disabled={isDisabled}
                    />
                </main>
                
                <footer className="p-4 border-t border-active-surface/50 grid grid-cols-2 gap-3 flex-shrink-0">
                    <button 
                        onClick={handleReset}
                        disabled={isDisabled}
                        className="w-full bg-active-surface text-on-surface font-bold py-3 rounded-xl hover:bg-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Limpiar
                    </button>
                    <button 
                        onClick={handleApply}
                        disabled={isDisabled}
                        className="w-full bg-primary text-primary-dark font-bold py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Aplicar Filtros
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default FilterDrawer;