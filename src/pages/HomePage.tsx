import React from 'react';
import { useNavigate } from 'react-router-dom';
import TreevuLogo from "@/components/TreevuLogo";
import RoleCard from "@/components/RoleCard";
import {
  UserRole
} from "@/types";
import {
  BuildingOfficeIcon,
  StarIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";

const AccessPortal: React.FC<{ onSelectRole: (r: UserRole) => void }> = ({
  onSelectRole,
}) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-6 relative overflow-hidden">
      {/* Ambient Spotlights */}
      <div className="absolute top-[-10%] left-[20%] w-[600px] h-[600px] bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
      <div
        className="absolute bottom-[-10%] right-[20%] w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"
        style={{ animationDelay: "2s" }}
      ></div>

      {/* Header Section */}
      <div className="text-center mb-12 md:mb-16 animate-slideUp relative z-20 w-full max-w-4xl mx-auto flex flex-col items-center">
        <div className="flex items-center gap-2">
          <div className="bg-white/5 border border-white/10 rounded-full px-4 md:px-6 py-1.5 md:py-2 backdrop-blur-md">
            <p className="flex flex-row justify-between items-center text-[8px] md:text-[10px] font-bold tracking-[0.3em] text-gray-300">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse me-2"></span>
              DEMO APP
            </p>
          </div>
        </div>
        <div className="mb-2 md:mb-4 duration-500 flex justify-center">
          <TreevuLogo size="text-6xl md:text-9xl" />
        </div>

        <h2 className="text-lg md:text-3xl font-medium text-gray-400 tracking-tight max-w-2xl mx-auto leading-relaxed px-4 text-center">
          Donde el{" "}
          <span className="text-white font-bold">
            Bienestar
          </span>{" "}
          se encuentra con la{" "}
          <span className="text-white font-bold">
            Data
          </span>
          .
        </h2>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-6xl px-2 md:px-4 relative z-20">
        <div className="animate-fadeIn" style={{ animationDelay: "0.1s" }}>
          <RoleCard
            role={UserRole.EMPLOYEE}
            icon={UserCircleIcon}
            title="Persona"
            subtitle="People"
            description="Comprobante capturado, control asegurado. Tu billetera inteligente potenciada por gamificación."
            theme="emerald"
            onClick={() => onSelectRole(UserRole.EMPLOYEE)}
            delay="0.1s"
          />
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <RoleCard
            role={UserRole.EMPLOYER}
            icon={BuildingOfficeIcon}
            title="Empresa"
            subtitle="Corporate"
            description="La inteligencia que reduce el riesgo de fuga. Analítica predictiva para retener a tu mejor talento."
            theme="blue"
            onClick={() => onSelectRole(UserRole.EMPLOYER)}
            delay="0.2s"
          />
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: "0.3s" }}>
          <RoleCard
            role={UserRole.MERCHANT}
            icon={StarIcon}
            title="Socio"
            subtitle="Partner"
            description="De ofertas a aciertos. IA Marketing que convierte visitas anónimas en ventas reales."
            theme="purple"
            onClick={() => onSelectRole(UserRole.MERCHANT)}
            delay="0.3s"
          />
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 md:mt-16 flex flex-col items-center gap-2 transition-opacity">
        <p className="text-[10px] text-gray-500 font-mono">
          © {new Date().getFullYear()} Treevü. All rights reserved.
        </p>
      </div>
    </div>
  );
};

const HomePage: React.FC = () => {
  const navigate = useNavigate();

  const onSelectRole = (r: UserRole) => {
    switch(r) {
      case UserRole.EMPLOYEE:
        navigate('/people');
        break;
      case UserRole.EMPLOYER:
        navigate('/companies');
        break;
      case UserRole.MERCHANT:
        navigate('/partners');
        break;
      default:
        navigate('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <AccessPortal onSelectRole={onSelectRole}/>
    </div>
  );
};

export default HomePage;
