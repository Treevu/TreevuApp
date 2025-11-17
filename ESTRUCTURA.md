# TreevuApp - Estructura del Proyecto

## 📁 Estructura de Directorios

```
TreevuApp/
├── public/                    # Archivos estáticos
│   ├── index.html
│   ├── manifest.json
│   └── metadata.json
│
├── src/                       # Código fuente principal
│   ├── components/            # Componentes reutilizables
│   │   ├── ui/               # Componentes de interfaz básicos
│   │   ├── layout/           # Componentes de layout (Header, Nav, etc.)
│   │   └── auth/             # Componentes de autenticación
│   │
│   ├── features/             # Características organizadas por dominio
│   │   ├── dashboard/        # Dashboard y pantalla principal
│   │   ├── wallet/          # Funcionalidad de billetera
│   │   ├── expenses/        # Gestión de gastos y transacciones
│   │   ├── profile/         # Perfil de usuario y configuración
│   │   ├── gamification/    # Sistema de gamificación y recompensas
│   │   ├── social/          # Funciones sociales y clubs
│   │   ├── goals/           # Metas financieras
│   │   ├── analytics/       # Análisis y reportes
│   │   ├── notifications/   # Sistema de notificaciones
│   │   ├── ai-assistant/    # Asistente de IA
│   │   └── employer/        # Funcionalidad empresarial
│   │
│   ├── contexts/            # Contextos de React (estado global)
│   ├── hooks/              # Hooks personalizados
│   ├── services/           # Servicios (API, externos)
│   ├── types/              # Definiciones de TypeScript
│   ├── utils/              # Utilidades y funciones helper
│   ├── App.tsx             # Componente principal de la aplicación
│   └── main.tsx            # Punto de entrada de Vite
│
├── package.json
├── tsconfig.json           # Configuración de TypeScript
├── vite.config.ts         # Configuración de Vite
└── README.md
```

## 🎯 Principios de Organización

### 1. **Separación por Features (Características)**
- Cada feature tiene sus propios componentes, hooks y lógica
- Facilita el mantenimiento y la escalabilidad
- Permite trabajar en features independientes

### 2. **Componentes por Tipo**
- **UI**: Componentes reutilizables básicos (botones, modales, spinners)
- **Layout**: Componentes de estructura (header, nav, sidebar)
- **Auth**: Componentes relacionados con autenticación

### 3. **Imports Absolutos**
- Uso de alias `@/` para imports más limpios
- Configurado en `tsconfig.json` y `vite.config.ts`
- Ejemplo: `import { Button } from '@/components/ui'`

## 📦 Features Principales

### Dashboard
- `MainApp.tsx` - Aplicación principal
- `DashboardView.tsx` - Vista del dashboard
- `SummaryCards.tsx` - Tarjetas de resumen

### Wallet
- `WalletView.tsx` - Vista principal de billetera
- `BudgetTracker.tsx` - Seguimiento de presupuesto
- `WalletSummaryCard.tsx` - Resumen de billetera

### Expenses
- `TransactionList.tsx` - Lista de transacciones
- `AddExpenseModal.tsx` - Modal para añadir gastos
- `CategoryAnalysis.tsx` - Análisis por categorías

### Profile
- `ProfileView.tsx` - Vista del perfil
- `OnboardingTour.tsx` - Tutorial de bienvenida
- `ThemeSwitcher.tsx` - Cambio de tema

### Gamification
- `GamificationProgress.tsx` - Progreso del juego
- `RewardsView.tsx` - Vista de recompensas
- `StreakCard.tsx` - Tarjeta de rachas

## 🔧 Configuración de Paths

### TypeScript (tsconfig.json)
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/features/*": ["./src/features/*"],
      "@/contexts/*": ["./src/contexts/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/services/*": ["./src/services/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

### Vite (vite.config.ts)
```typescript
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@/components': path.resolve(__dirname, 'src/components'),
      '@/features': path.resolve(__dirname, 'src/features'),
      // ... otros alias
    }
  }
});
```

## 📝 Convenciones de Naming

- **Componentes**: PascalCase (`UserProfile.tsx`)
- **Hooks**: camelCase con prefijo "use" (`useSwipeNavigation.ts`)
- **Types**: PascalCase (`User.ts`, `ExpenseType.ts`)
- **Services**: camelCase con sufijo "Service" (`geminiService.ts`)
- **Utils**: camelCase (`formatCurrency.ts`)

## 🚀 Mejoras Implementadas

1. ✅ **Estructura de src/**: Todo el código fuente en `src/`
2. ✅ **Organización por features**: Componentes agrupados por funcionalidad
3. ✅ **Imports absolutos**: Uso de alias `@/` para imports más limpios
4. ✅ **Separación UI/Layout/Features**: Componentes organizados por tipo
5. ✅ **Public folder**: Archivos estáticos en `public/`
6. ✅ **Path aliases**: Configuración en TypeScript y Vite

## 📚 Cómo Trabajar con esta Estructura

### Añadir un Nuevo Componente UI
```typescript
// src/components/ui/NewButton.tsx
export const NewButton = () => {
  // Lógica del componente
};

// Añadir al index.ts
export { NewButton } from './NewButton';
```

### Añadir una Nueva Feature
1. Crear carpeta en `src/features/nueva-feature/`
2. Añadir componentes específicos de la feature
3. Crear `index.ts` para exports
4. Importar desde otros componentes: `import { Componente } from '@/features/nueva-feature'`

### Usar Contextos
```typescript
import { useModal } from '@/contexts/ModalContext';
```

Esta estructura sigue las mejores prácticas de React y facilita el mantenimiento y escalabilidad del proyecto.