import React from 'react';

interface AuthLayoutProps {
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, footer }) => {
    return (
        <div className="min-h-screen flex flex-col items-center p-4 text-on-surface animate-fade-in">
            <main className="w-full max-w-sm flex-grow flex flex-col justify-center">
                <div className="bg-surface rounded-3xl shadow-2xl p-6 sm:p-8">
                    {children}
                </div>
                {footer && <div className="mt-6 text-center">{footer}</div>}
            </main>
            <footer className="pt-6 text-center text-sm text-on-surface-secondary">
                <p>&copy; {new Date().getFullYear()} Sinapsis Innovadora S.A.C.</p>
                <p className="mt-1 italic">Powered by Gemini</p>
            </footer>
        </div>
    );
};

export default AuthLayout;