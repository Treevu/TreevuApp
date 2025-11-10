
import React, { Component, ReactNode } from 'react';
import { ExclamationTriangleIcon } from './Icons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  // FIX: Replaced constructor with a class property for state initialization to resolve issues with `this.props` and `this.state` being unrecognized.
  state: State = { hasError: false, error: undefined };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  }

  public render(): React.ReactNode {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="w-full h-full flex items-center justify-center p-4 bg-background text-on-surface">
            <div className="text-center bg-surface p-8 rounded-2xl shadow-card max-w-sm">
                <ExclamationTriangleIcon className="w-12 h-12 text-danger mx-auto" />
                <h1 className="mt-4 text-xl font-bold">¡Ups! Algo salió mal.</h1>
                <p className="mt-2 text-sm text-on-surface-secondary">
                    Ocurrió un error inesperado en la aplicación. Nuestro equipo ha sido notificado.
                </p>
                <button 
                    onClick={this.handleReload}
                    className="mt-6 bg-primary text-primary-dark font-bold py-2 px-5 rounded-xl hover:opacity-90 transition-opacity text-sm"
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