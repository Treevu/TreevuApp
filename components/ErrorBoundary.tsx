import React, { ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon } from './Icons';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  // FIX: Use a class property for state initialization, which is the modern and recommended approach for React class components. This resolves type errors related to `this.state` and `this.props`.
  public state: State = {
    hasError: false,
    error: undefined,
  };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render(): React.ReactNode {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-background text-on-surface">
            <div className="text-center bg-surface p-8 rounded-2xl shadow-card max-w-sm">
                <ExclamationTriangleIcon className="w-12 h-12 text-danger mx-auto" />
                <h1 className="mt-4 text-xl font-bold">¡Ups! Algo salió mal.</h1>
                <p className="mt-2 text-sm text-on-surface-secondary">
                    Ocurrió un error inesperado en la aplicación. Hemos reiniciado los datos de la sesión para solucionar el problema.
                </p>
                
                <button 
                    onClick={() => {
                        localStorage.clear();
                        window.location.reload();
                    }}
                    className="mt-6 w-full bg-primary text-primary-dark font-bold py-2 px-4 rounded-xl hover:opacity-90 transition-opacity"
                >
                    Recargar Página
                </button>
            </div>
        </div>
      );
    }
    
    return this.props.children;
  }
}

export default ErrorBoundary;
