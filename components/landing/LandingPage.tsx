import React from 'react';
import { ArrowRightIcon, BriefcaseIcon, ChartBarIcon, CommandLineIcon, CheckIcon } from '../Icons';
import TreevuLogoText from '../TreevuLogoText';

interface LandingPageProps {
    onPortalAccess: () => void;
}

const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; children: React.ReactNode }> = ({ icon, title, children }) => (
    <div className="bg-surface/50 backdrop-blur-sm p-6 rounded-2xl border border-active-surface/50">
        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
            {icon}
        </div>
        <h3 className="font-bold text-lg text-on-surface mb-2">{title}</h3>
        <p className="text-sm text-on-surface-secondary">{children}</p>
    </div>
);


const LandingPage: React.FC<LandingPageProps> = ({ onPortalAccess }) => {
    return (
        <div className="w-full min-h-screen bg-background text-on-surface custom-scrollbar overflow-y-auto">
            <header className="fixed top-0 left-0 right-0 z-30 bg-background/80 backdrop-blur-lg border-b border-active-surface/30">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h1 className="text-2xl font-bold leading-tight">
                            <TreevuLogoText />
                            <span className="text-primary text-sm font-semibold italic tracking-tight"> for business</span>
                        </h1>
                    </div>
                    <button onClick={onPortalAccess} className="bg-primary text-primary-dark font-bold py-2 px-5 rounded-xl hover:opacity-90 transition-opacity text-sm">
                        Acceder al Portal
                    </button>
                </div>
            </header>

            <main className="pt-24">
                {/* Hero Section */}
                <section className="text-center py-16 md:py-24 px-4">
                    <h1 className="text-4xl md:text-6xl font-black text-on-surface max-w-4xl mx-auto leading-tight animate-fade-in-down">
                        El Dashboard Estratégico que Convierte Datos en <span className="text-primary">Retención</span>.
                    </h1>
                    <p className="mt-6 text-lg md:text-xl text-on-surface-secondary max-w-2xl mx-auto animate-fade-in-down" style={{ animationDelay: '200ms' }}>
                        Deja de reaccionar. Con treevü, anticipa el riesgo de fuga y mide el ROI real de tu cultura de bienestar con inteligencia predictiva.
                    </p>
                    <div className="mt-10 flex justify-center items-center gap-4 animate-fade-in-down" style={{ animationDelay: '400ms' }}>
                        <button onClick={onPortalAccess} className="bg-primary text-primary-dark font-bold py-3 px-8 rounded-xl text-lg hover:opacity-90 transition-opacity transform hover:scale-105">
                            Solicitar Demo
                        </button>
                    </div>
                </section>

                {/* Problem Section */}
                <section className="py-16 md:py-24 bg-surface px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-on-surface">¿Te suena familiar?</h2>
                        <p className="text-center text-on-surface-secondary mt-2">Los dolores de cabeza silenciosos que frenan tu crecimiento.</p>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-background p-6 rounded-xl animate-staggered-fade-in-slide-up">
                                <h3 className="font-bold text-lg">Fuga de Talento Inexplicable</h3>
                                <p className="text-sm mt-2 text-on-surface-secondary">Pierdes gente valiosa y no entiendes por qué. Las encuestas anuales llegan tarde y no revelan la causa raíz.</p>
                            </div>
                            <div className="bg-background p-6 rounded-xl animate-staggered-fade-in-slide-up" style={{ animationDelay: '150ms' }}>
                                <h3 className="font-bold text-lg">Beneficios a Ciegas</h3>
                                <p className="text-sm mt-2 text-on-surface-secondary">Inviertes miles en beneficios que nadie usa o valora, sin poder medir su impacto real en el engagement.</p>
                            </div>
                            <div className="bg-background p-6 rounded-xl animate-staggered-fade-in-slide-up" style={{ animationDelay: '300ms' }}>
                                <h3 className="font-bold text-lg">Incapacidad de Medir la Cultura</h3>
                                <p className="text-sm mt-2 text-on-surface-secondary">Te cuesta justificar la inversión en bienestar con datos duros, ROI y métricas que el C-level entienda.</p>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* How it Works Section */}
                <section className="py-16 md:py-24 px-4">
                    <div className="max-w-4xl mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-on-surface">De la Data Anónima a la Decisión Estratégica</h2>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                            <div className="animate-staggered-fade-in-slide-up">
                                <div className="text-primary font-bold text-lg mb-2">Paso 1</div>
                                <h3 className="font-bold text-xl mb-2">Conecta</h3>
                                <p className="text-sm text-on-surface-secondary">Tu equipo usa la app de treevü para registrar sus gastos de forma privada. Nosotros recibimos únicamente data 100% anónima y agregada.</p>
                            </div>
                            <div className="animate-staggered-fade-in-slide-up" style={{ animationDelay: '150ms' }}>
                                <div className="text-primary font-bold text-lg mb-2">Paso 2</div>
                                <h3 className="font-bold text-xl mb-2">Analiza</h3>
                                <p className="text-sm text-on-surface-secondary">Nuestra IA procesa los datos para generar insights predictivos sobre el bienestar, riesgo de fuga y patrones de consumo de tu equipo.</p>
                            </div>
                            <div className="animate-staggered-fade-in-slide-up" style={{ animationDelay: '300ms' }}>
                                <div className="text-primary font-bold text-lg mb-2">Paso 3</div>
                                <h3 className="font-bold text-xl mb-2">Actúa</h3>
                                <p className="text-sm text-on-surface-secondary">Usa el dashboard para tomar decisiones informadas, lanzar iniciativas de alto impacto y medir el ROI de tu estrategia de talento.</p>
                            </div>
                        </div>
                    </div>
                </section>


                {/* Features Section */}
                <section className="py-16 md:py-24 bg-surface px-4">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-3xl md:text-4xl font-bold text-center text-on-surface">Tu Centro de Mando Estratégico</h2>
                        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
                            <FeatureCard icon={<ChartBarIcon className="w-7 h-7 text-primary" />} title="FWI: El Pulso de tu Equipo">
                                Mide el Índice de Bienestar Financiero (FWI), tu métrica líder para predecir el comportamiento del talento y la salud organizacional.
                            </FeatureCard>
                            <FeatureCard icon={<BriefcaseIcon className="w-7 h-7 text-primary" />} title="Riesgo de Fuga Predictivo">
                                Nuestro sistema de alerta temprana te permite actuar antes de que sea tarde para retener a tu talento clave, identificando áreas en riesgo.
                            </FeatureCard>
                            <FeatureCard icon={<CommandLineIcon className="w-7 h-7 text-primary" />} title="Asistente Estratégico IA">
                                Deiega análisis complejos, redacta comunicados y obtén recomendaciones accionables con el poder de Gemini.
                            </FeatureCard>
                        </div>
                    </div>
                </section>
                
                {/* Final CTA */}
                <section className="py-24 text-center px-4">
                     <h2 className="text-3xl md:text-4xl font-bold text-on-surface max-w-2xl mx-auto">
                        Transforma tu Estrategia de Talento Hoy
                    </h2>
                    <p className="mt-4 text-lg text-on-surface-secondary max-w-xl mx-auto">
                        Descubre cómo las empresas líderes están construyendo una cultura de bienestar medible y de alto impacto.
                    </p>
                    <button onClick={onPortalAccess} className="mt-8 bg-primary text-primary-dark font-bold py-3 px-8 rounded-xl text-lg hover:opacity-90 transition-opacity transform hover:scale-105">
                        Solicitar mi Demo Estratégica
                    </button>
                </section>
            </main>
        </div>
    );
};

export default LandingPage;
