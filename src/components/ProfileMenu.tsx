

import React, { useState } from 'react';
import { useStore } from '../contexts/Store';
import { UserProfile, UserRole, SubscriptionTier, AppTheme, AppView } from '../types';
import { 
  UserCircleIcon, 
  Cog6ToothIcon, 
  CreditCardIcon, 
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  BriefcaseIcon,
  QuestionMarkCircleIcon,
  ShieldCheckIcon,
  BellIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  DocumentArrowDownIcon
} from '@heroicons/react/24/outline';

interface ProfileMenuProps {
  user: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onSwitchRole: (role: UserRole) => void;
  onOpenPricing: () => void;
  onSignOut: () => void;
}

type MenuItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  action?: () => void;
  children?: MenuItem[];
};

const ProfileMenu: React.FC<ProfileMenuProps> = ({ user, isOpen, onClose, onSwitchRole, onOpenPricing, onSignOut }) => {
  const { setTheme, navigate, downloadReport } = useStore();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  if (!isOpen) return null;

  const toggleExpand = (id: string) => {
    setExpandedItem(prev => prev === id ? null : id);
  };

  const handleNav = (view: AppView) => {
      navigate(view);
      onClose();
  };

  const MENU_STRUCTURE: MenuItem[] = [
    {
      id: 'account',
      label: 'Mi Cuenta',
      icon: UserCircleIcon,
      children: [
        { id: 'profile_details', label: 'Datos Personales', icon: UserCircleIcon, action: () => handleNav(AppView.PROFILE_DETAILS) },
        { id: 'security', label: 'Seguridad y Claves', icon: ShieldCheckIcon, action: () => handleNav(AppView.SECURITY) },
      ]
    },
    {
      id: 'data',
      label: 'Datos',
      icon: DocumentArrowDownIcon,
      children: [
        { id: 'download_report', label: 'Descargar Reporte Global', icon: DocumentArrowDownIcon, action: () => { downloadReport(); onClose(); } },
      ]
    },
    {
      id: 'settings',
      label: 'Configuración',
      icon: Cog6ToothIcon,
      children: [
        { id: 'general_settings', label: 'Preferencias', icon: BellIcon, action: () => handleNav(AppView.SETTINGS) },
      ]
    },
    {
        id: 'roles',
        label: 'Cambiar Perfil (Demo)',
        icon: BriefcaseIcon,
        children: [
            { id: 'role_b2c', label: 'Usuario Personal', icon: UserCircleIcon, action: () => { onSwitchRole(UserRole.EMPLOYEE); onClose(); } },
            { id: 'role_b2b', label: 'Panel Organizacional', icon: BriefcaseIcon, action: () => { onSwitchRole(UserRole.EMPLOYER); onClose(); } },
            { id: 'role_merc', label: 'Panel de Socios', icon: CreditCardIcon, action: () => { onSwitchRole(UserRole.MERCHANT); onClose(); } },
        ]
    },
    {
      id: 'billing',
      label: 'Suscripción',
      icon: CreditCardIcon,
      action: () => { onClose(); onOpenPricing(); }
    },
    {
        id: 'help',
        label: 'Ayuda',
        icon: QuestionMarkCircleIcon,
        action: () => handleNav(AppView.HELP)
    }
  ];

  return (
    <>
      {/* Invisible Backdrop for click-outside */}
      <div className="fixed inset-0 z-40" onClick={onClose}></div>
      
      {/* Dropdown Menu - Solid Background for Accessibility */}
      <div className="absolute top-16 right-4 w-80 bg-surface border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fadeIn origin-top-right ring-1 ring-black/5 dark:ring-white/10 flex flex-col max-h-[80vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-base">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                  <img src={user.avatarUrl} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-gray-900 dark:text-white font-bold truncate text-sm">{user.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 bg-black/5 dark:bg-white/5 px-2 py-0.5 rounded">
                        {user.role === UserRole.EMPLOYEE ? 'Personal' : user.role === UserRole.EMPLOYER ? 'Empresa' : 'Comercio'}
                    </span>
                    {user.subscriptionTier !== SubscriptionTier.FREE && (
                        <span className="text-[10px] text-black font-bold bg-accent px-1.5 py-0.5 rounded shadow-sm">
                            {user.subscriptionTier}
                        </span>
                    )}
                </div>
              </div>
          </div>
        </div>

        {/* Theme Selector */}
        <div className="p-3 border-b border-white/10 bg-base/50">
            <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2 px-2">Apariencia</p>
            <div className="grid grid-cols-3 gap-2 bg-black/5 dark:bg-black/20 p-1 rounded-lg">
                <button 
                    onClick={() => setTheme(AppTheme.LIGHT)} 
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-medium transition-all ${user.theme === AppTheme.LIGHT ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <SunIcon className="w-3 h-3" /> Claro
                </button>
                <button 
                    onClick={() => setTheme(AppTheme.DARK)} 
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-medium transition-all ${user.theme === AppTheme.DARK ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <MoonIcon className="w-3 h-3" /> Oscuro
                </button>
                <button 
                    onClick={() => setTheme(AppTheme.SYSTEM)} 
                    className={`flex items-center justify-center gap-1 py-1.5 rounded-md text-xs font-medium transition-all ${user.theme === AppTheme.SYSTEM ? 'bg-white dark:bg-gray-700 text-primary shadow-sm' : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'}`}
                >
                    <ComputerDesktopIcon className="w-3 h-3" /> Auto
                </button>
            </div>
        </div>

        {/* Hierarchical Menu Items */}
        <div className="p-2 flex-1 overflow-y-auto custom-scrollbar space-y-1">
            {MENU_STRUCTURE.map((item) => (
                <div key={item.id} className="rounded-lg overflow-hidden">
                    <button 
                        onClick={() => item.children ? toggleExpand(item.id) : item.action?.()}
                        className={`w-full flex items-center justify-between px-3 py-3 text-sm transition-all ${
                            expandedItem === item.id 
                            ? 'bg-primary/10 text-primary' 
                            : 'text-gray-700 dark:text-gray-300 hover:bg-black/5 dark:hover:bg-white/5'
                        } rounded-lg`}
                    >
                        <div className="flex items-center gap-3">
                            <item.icon className={`w-5 h-5 ${expandedItem === item.id ? 'text-primary' : 'text-gray-400'}`} />
                            <span className="font-medium">{item.label}</span>
                        </div>
                        {item.children && (
                            expandedItem === item.id 
                                ? <ChevronUpIcon className="w-4 h-4 text-primary" /> 
                                : <ChevronDownIcon className="w-4 h-4 text-gray-400" />
                        )}
                    </button>

                    {/* Submenu */}
                    {item.children && expandedItem === item.id && (
                        <div className="bg-black/5 dark:bg-black/20 mt-1 rounded-lg py-1 ml-4 border-l-2 border-primary/20">
                            {item.children.map(sub => (
                                <button
                                    key={sub.id}
                                    onClick={sub.action}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-xs text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
                                >
                                    <sub.icon className="w-4 h-4 opacity-70" />
                                    {sub.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>

        {/* Footer */}
        <div className="p-2 border-t border-white/10 bg-base">
          <button onClick={() => { onClose(); onSignOut(); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all font-bold">
            <ArrowRightOnRectangleIcon className="w-5 h-5" /> Cerrar Sesión
          </button>
        </div>
      </div>
    </>
  );
};

export default ProfileMenu;
