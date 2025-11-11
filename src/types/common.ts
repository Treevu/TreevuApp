export enum CategoriaGasto {
    Alimentacion = 'Alimentación',
    Vivienda = 'Vivienda',
    Transporte = 'Transporte',
    Salud = 'Salud',
    Ocio = 'Ocio',
    Educacion = 'Educación',
    Consumos = 'Consumos',
    Servicios = 'Servicios',
    Otros = 'Otros',
}

export enum TipoComprobante {
    FacturaElectronica = 'Factura Electrónica',
    BoletaVentaElectronica = 'Boleta de Venta Electrónica',
    ReciboHonorariosElectronico = 'Recibo por Honorarios Electrónico',
    ReciboArrendamiento = 'Recibo por Arrendamiento',
    BoletoTransporte = 'Boleto de Transporte',
    ReciboServiciosPublicos = 'Recibo de Servicios Públicos',
    TicketPOS = 'Ticket POS',
    TicketMaquinaRegistradora = 'Ticket de Máquina Registradora',
    Otro = 'Otro Comprobante',
    SinComprobante = 'Sin Comprobante',
}

export enum TreevuLevel {
    Brote = 1,
    Plantón = 2,
    Arbusto = 3,
    Roble = 4,
    Bosque = 5,
}

export type ActiveTab = 'inicio' | 'billetera' | 'club' | 'perfil';

export interface FwiComponent {
    name: string;
    value: number; // 0-100
    weight: number; // 0-1
}

export interface FwiComponents {
    financialHealth: FwiComponent;
    workLifeBalance: FwiComponent;
    selfDevelopment: FwiComponent;
}