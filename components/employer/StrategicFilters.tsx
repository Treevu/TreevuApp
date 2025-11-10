import React from 'react';
import Tooltip from '../Tooltip';
// FIX: Updated imports from deprecated 'types.ts' to 'types/employer.ts'.
import { DEPARTMENTS, TENURES, MODALITIES, AGE_RANGES } from '../../types/employer';

interface StrategicFiltersProps {
    selectedDepartment: string;
    onSelectDepartment: (value: string) => void;
    selectedTenure: string;
    onSelectTenure: (value: string) => void;
    selectedModality: string;
    onSelectModality: (value: string) => void;
    selectedAgeRange: string;
    onSelectAgeRange: (value: string) => void;
}

const FilterSelect: React.FC<{
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    options: { value: string; label: string }[];
}> = ({ label, value, onChange, options }) => (
    <div>
        <label htmlFor={`${label}-select`} className="block text-xs font-medium text-on-surface-secondary mb-1">
            {label}
        </label>
        <select
            id={`${label}-select`}
            value={value}
            onChange={onChange}
            className="bg-surface border border-active-surface text-on-surface text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    </div>
);


const StrategicFilters: React.FC<StrategicFiltersProps> = ({
    selectedDepartment, onSelectDepartment,
    selectedTenure, onSelectTenure,
    selectedModality, onSelectModality,
    selectedAgeRange, onSelectAgeRange,
}) => {

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
        <div className="mt-6 p-4 bg-surface/50 rounded-2xl relative">
            <div className="absolute top-3 right-3">
                <Tooltip id="strategic-filters-tooltip" text="Cruza variables para un análisis profundo. Segmenta los datos por área, tiempo en la empresa o modalidad de trabajo para descubrir insights ocultos." />
            </div>
            <h3 className="text-base font-bold text-on-surface mb-3">Filtros Estratégicos</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <FilterSelect
                    label="Área"
                    value={selectedDepartment}
                    onChange={(e) => onSelectDepartment(e.target.value)}
                    options={departmentOptions}
                />
                 <FilterSelect
                    label="Antigüedad"
                    value={selectedTenure}
                    onChange={(e) => onSelectTenure(e.target.value)}
                    options={tenureOptions}
                />
                 <FilterSelect
                    label="Modalidad"
                    value={selectedModality}
                    onChange={(e) => onSelectModality(e.target.value)}
                    options={modalityOptions}
                />
                <FilterSelect
                    label="Rango de Edad"
                    value={selectedAgeRange}
                    onChange={(e) => onSelectAgeRange(e.target.value)}
                    options={ageRangeOptions}
                />
            </div>
        </div>
    );
};

export default StrategicFilters;