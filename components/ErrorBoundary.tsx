import React, { ErrorInfo, ReactNode } from 'react';
import { ExclamationTriangleIcon } from './Icons';

// FIX: Added the 'children' property to the props interface. This allows the
// component to be used as a wrapper and fixes the error in App.tsx.
interface ErrorBoundaryProps {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, State> {
  // FIX: Added a constructor to properly initialize component state. This resolves
  // errors where `this.state` was being accessed before it was defined.
  // Calling super(props) also ensures `this.props` is correctly set up.
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    localStorage.clear();
    window.location.reload();
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
                    onClick={this.handleReload}
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