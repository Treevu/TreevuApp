import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';

// Ejemplo completo de componentes PrimeReact
export const PrimeReactExample: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedCity, setSelectedCity] = useState(null);
    
    const cities = [
        { name: 'Lima', code: 'LIM' },
        { name: 'Arequipa', code: 'AQP' },
        { name: 'Cusco', code: 'CUZ' }
    ];

    const sampleData = [
        { id: 1, name: 'Juan Pérez', email: 'juan@example.com', city: 'Lima' },
        { id: 2, name: 'María García', email: 'maria@example.com', city: 'Arequipa' },
        { id: 3, name: 'Carlos López', email: 'carlos@example.com', city: 'Cusco' }
    ];

    const showSuccess = () => {
        // Toast functionality would need ref implementation
        console.log('¡Acción completada exitosamente!');
    };

    return (
        <div className="p-4 space-y-4">
            <h2 className="text-2xl font-bold mb-4">Ejemplos de PrimeReact</h2>
            
            {/* Botones */}
            <Card title="Botones" className="mb-4">
                <div className="flex flex-wrap gap-2">
                    <Button 
                        label="Primario" 
                        onClick={showSuccess}
                        className="p-button-primary"
                    />
                    <Button 
                        label="Secundario" 
                        onClick={showSuccess}
                        className="p-button-secondary"
                    />
                    <Button 
                        label="Con Icono" 
                        icon="pi pi-check" 
                        onClick={showSuccess}
                        className="p-button-success"
                    />
                    <Button 
                        label="Danger" 
                        onClick={showSuccess}
                        className="p-button-danger"
                    />
                </div>
            </Card>

            {/* Inputs */}
            <Card title="Campos de Entrada" className="mb-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="field">
                        <label htmlFor="input1" className="block text-sm font-medium mb-2">
                            Input de Texto
                        </label>
                        <InputText 
                            id="input1"
                            value={inputValue} 
                            onChange={(e) => setInputValue(e.target.value)}
                            placeholder="Escribe algo..."
                            className="w-full"
                        />
                    </div>
                    
                    <div className="field">
                        <label htmlFor="calendar1" className="block text-sm font-medium mb-2">
                            Selector de Fecha
                        </label>
                        <Calendar 
                            id="calendar1"
                            value={selectedDate} 
                            onChange={(e) => setSelectedDate(e.value as Date)} 
                            dateFormat="dd/mm/yy"
                            placeholder="Selecciona una fecha"
                            className="w-full"
                        />
                    </div>
                    
                    <div className="field">
                        <label htmlFor="dropdown1" className="block text-sm font-medium mb-2">
                            Dropdown
                        </label>
                        <Dropdown 
                            id="dropdown1"
                            value={selectedCity} 
                            onChange={(e) => setSelectedCity(e.value)} 
                            options={cities} 
                            optionLabel="name"
                            placeholder="Selecciona una ciudad"
                            className="w-full"
                        />
                    </div>
                </div>
            </Card>

            {/* Tabla */}
            <Card title="Tabla de Datos" className="mb-4">
                <DataTable 
                    value={sampleData} 
                    paginator 
                    rows={5} 
                    rowsPerPageOptions={[5, 10, 25]}
                    tableStyle={{ minWidth: '50rem' }}
                    className="p-datatable-gridlines"
                >
                    <Column field="id" header="ID" sortable></Column>
                    <Column field="name" header="Nombre" sortable></Column>
                    <Column field="email" header="Email" sortable></Column>
                    <Column field="city" header="Ciudad" sortable></Column>
                </DataTable>
            </Card>

            {/* Información */}
            <Card title="Estado de PrimeReact" className="mb-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center">
                        <i className="pi pi-check-circle text-green-600 mr-2"></i>
                        <span className="text-green-800">
                            ✅ PrimeReact configurado correctamente
                        </span>
                    </div>
                    <div className="mt-2 text-sm text-green-700">
                        <p><strong>Valor del input:</strong> {inputValue || 'Vacío'}</p>
                        <p><strong>Fecha seleccionada:</strong> {selectedDate ? selectedDate.toLocaleDateString() : 'Ninguna'}</p>
                        <p><strong>Ciudad seleccionada:</strong> {selectedCity ? (selectedCity as any).name : 'Ninguna'}</p>
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default PrimeReactExample;