
import React, { useState } from 'react';
import { useStore } from '@/contexts/Store';
import { UserCircleIcon, ShieldCheckIcon, KeyIcon, DevicePhoneMobileIcon, BellIcon, EyeIcon, LockClosedIcon, EnvelopeIcon, ChevronDownIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

// --- PROFILE DETAILS VIEW ---
export const ProfileDetailsView = () => {
  const { user, updateUserProfile, levelUp } = useStore();
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio || '');
  const [email, setEmail] = useState(user.email || '');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateUserProfile({ name, bio, email });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto animate-fadeIn">
        <div className="mb-8 text-center">
            <div className="relative inline-block">
                <img src={user.avatarUrl} className="w-32 h-32 rounded-full border-4 border-primary shadow-[0_0_30px_rgba(52,211,153,0.3)]" />
                <button className="absolute bottom-0 right-0 bg-gray-800 text-white p-2 rounded-full border border-white/10 hover:bg-gray-700 shadow-lg">
                   <span className="text-xs font-bold">Edit</span>
                </button>
            </div>
            <h2 className="text-2xl font-bold text-white mt-4">{user.name}</h2>
            <p className="text-gray-400 text-sm">Nivel {user.level}</p>
        </div>

        <div className="bg-surface border border-white/10 rounded-2xl p-6 space-y-6 shadow-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Nombre Completo</label>
                    <div className="relative">
                        <UserCircleIcon className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
                        <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-primary transition-colors" />
                    </div>
                </div>
                <div>
                    <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Email Corporativo</label>
                    <div className="relative">
                        <EnvelopeIcon className="w-5 h-5 absolute left-3 top-3 text-gray-500" />
                        <input value={email} onChange={e => setEmail(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white outline-none focus:border-primary transition-colors" />
                    </div>
                </div>
            </div>
            <div>
                <label className="text-xs text-gray-400 uppercase font-bold block mb-2">Bio / Cargo</label>
                <textarea value={bio} onChange={e => setBio(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-xl p-4 text-white outline-none focus:border-primary transition-colors h-24 resize-none" placeholder="Ej. Gerente de Marketing" />
            </div>
            <div className="flex justify-end pt-4">
                <button onClick={handleSave} className={`px-8 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${saved ? 'bg-emerald-500 text-black' : 'bg-primary text-black hover:bg-primary/90'}`}>
                    {saved ? <CheckCircleIcon className="w-5 h-5" /> : null}
                    {saved ? 'Guardado' : 'Guardar Cambios'}
                </button>
            </div>
        </div>
    </div>
  );
};

// --- SECURITY VIEW ---
export const SecurityView = () => {
    const [currentPass, setCurrentPass] = useState('');
    const [newPass, setNewPass] = useState('');
    const [is2FA, setIs2FA] = useState(false);
    const [isBiometric, setIsBiometric] = useState(true);
  
    return (
      <div className="p-6 max-w-2xl mx-auto animate-fadeIn space-y-6">
          <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <KeyIcon className="w-6 h-6 text-accent" /> Contraseña
              </h3>
              <div className="space-y-4">
                  <input type="password" value={currentPass} onChange={e => setCurrentPass(e.target.value)} placeholder="Contraseña Actual" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-accent" />
                  <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)} placeholder="Nueva Contraseña" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-accent" />
                  <input type="password" placeholder="Confirmar Contraseña" className="w-full bg-black/30 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-accent" />
                  <button className="w-full py-3 bg-white/10 text-white font-bold rounded-xl hover:bg-white/20 transition-colors">Actualizar Clave</button>
              </div>
          </div>
  
          <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-lg">
              <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                  <ShieldCheckIcon className="w-6 h-6 text-emerald-400" /> Autenticación Avanzada
              </h3>
              <div className="space-y-6">
                  <div className="flex items-center justify-between">
                      <div>
                          <p className="text-white font-bold">Doble Factor (2FA)</p>
                          <p className="text-xs text-gray-400">Código SMS al iniciar sesión.</p>
                      </div>
                      <div onClick={() => setIs2FA(!is2FA)} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${is2FA ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${is2FA ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                  </div>
                  <div className="h-px bg-white/5"></div>
                  <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                          <DevicePhoneMobileIcon className="w-5 h-5 text-gray-400" />
                          <div>
                              <p className="text-white font-bold">FaceID / TouchID</p>
                              <p className="text-xs text-gray-400">Ingreso rápido biométrico.</p>
                          </div>
                      </div>
                      <div onClick={() => setIsBiometric(!isBiometric)} className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${isBiometric ? 'bg-emerald-500' : 'bg-gray-600'}`}>
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${isBiometric ? 'translate-x-6' : 'translate-x-0'}`}></div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
    );
};

// --- GENERAL SETTINGS VIEW ---
export const GeneralSettingsView = () => {
    const { user, updateUserProfile } = useStore();
    const notifications = user.notifications || { email: true, push: true, marketing: false };
    const privacy = user.privacy || { publicProfile: true, shareStats: true };

    const toggleNotif = (key: keyof typeof notifications) => {
        updateUserProfile({ notifications: { ...notifications, [key]: !notifications[key] } });
    };

    const togglePrivacy = (key: keyof typeof privacy) => {
        updateUserProfile({ privacy: { ...privacy, [key]: !privacy[key] } });
    };

    return (
        <div className="p-6 max-w-2xl mx-auto animate-fadeIn space-y-6">
             <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <BellIcon className="w-6 h-6 text-accent" /> Notificaciones
                </h3>
                <div className="space-y-4">
                     {[
                         { k: 'email', l: 'Email Resumen', d: 'Recibe tu reporte semanal.' },
                         { k: 'push', l: 'Push App', d: 'Alertas de gastos y metas.' },
                         { k: 'marketing', l: 'Novedades y Ofertas', d: 'Promociones de partners.' }
                     ].map((item) => (
                        <div key={item.k} className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg transition-colors">
                            <div>
                                <p className="text-white font-medium">{item.l}</p>
                                <p className="text-xs text-gray-400">{item.d}</p>
                            </div>
                            <div onClick={() => toggleNotif(item.k as any)} className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${notifications[item.k as any] ? 'bg-accent' : 'bg-gray-600'}`}>
                                <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${notifications[item.k as any] ? 'translate-x-5' : 'translate-x-0'}`}></div>
                            </div>
                        </div>
                     ))}
                </div>
            </div>

            <div className="bg-surface border border-white/10 rounded-2xl p-6 shadow-lg">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <EyeIcon className="w-6 h-6 text-purple-400" /> Privacidad
                </h3>
                <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg">
                        <div>
                            <p className="text-white font-medium">Perfil Público</p>
                            <p className="text-xs text-gray-400">Visible para tu Squad y Rankings.</p>
                        </div>
                        <div onClick={() => togglePrivacy('publicProfile')} className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${privacy.publicProfile ? 'bg-purple-500' : 'bg-gray-600'}`}>
                            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${privacy.publicProfile ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                     </div>
                     <div className="flex items-center justify-between p-3 hover:bg-white/5 rounded-lg">
                        <div>
                            <p className="text-white font-medium">Compartir Stats Anónimas</p>
                            <p className="text-xs text-gray-400">Ayuda a mejorar la IA de Treevü.</p>
                        </div>
                        <div onClick={() => togglePrivacy('shareStats')} className={`w-10 h-5 rounded-full p-1 cursor-pointer transition-colors ${privacy.shareStats ? 'bg-purple-500' : 'bg-gray-600'}`}>
                            <div className={`bg-white w-3 h-3 rounded-full shadow-md transform transition-transform ${privacy.shareStats ? 'translate-x-5' : 'translate-x-0'}`}></div>
                        </div>
                     </div>
                </div>
            </div>
        </div>
    );
};

// --- HELP VIEW ---
export const HelpView = () => {
    const faqs = [
        { q: "¿Cómo subo de nivel?", a: "Gana Treevüs registrando gastos, completando misiones de Squad y ahorrando. Cada nivel desbloquea nuevos badges." },
        { q: "¿Qué es un gasto formal?", a: "Es cualquier gasto sustentado con boleta electrónica donde figure tu DNI o RUC. Esto mejora tu FWI Fiscal." },
        { q: "¿Cómo funciona el Squad?", a: "Unete a un equipo de 3-5 personas. Si todos cumplen las metas semanales, ganan bonificaciones multiplicadoras." },
        { q: "¿Es seguro conectar mis cuentas?", a: "Treevü usa encriptación bancaria. Solo leemos datos de transacción para darte insights, nunca para mover dinero." }
    ];

    return (
        <div className="p-6 max-w-2xl mx-auto animate-fadeIn space-y-8">
            <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white">Centro de Ayuda</h2>
                <p className="text-gray-400 mt-2">¿Tienes dudas? Estamos aquí para resolverlas.</p>
            </div>

            <div className="space-y-4">
                {faqs.map((f, i) => (
                    <div key={i} className="bg-surface border border-white/10 rounded-xl overflow-hidden">
                        <details className="group">
                            <summary className="flex justify-between items-center font-medium cursor-pointer list-none p-4 bg-white/5 hover:bg-white/10 transition-colors">
                                <span className="text-white font-bold">{f.q}</span>
                                <span className="transition group-open:rotate-180">
                                    <ChevronDownIcon className="w-5 h-5 text-gray-400" />
                                </span>
                            </summary>
                            <div className="text-gray-300 text-sm p-4 bg-black/20 border-t border-white/5">
                                {f.a}
                            </div>
                        </details>
                    </div>
                ))}
            </div>

            <div className="bg-gradient-to-r from-primary/20 to-accent/20 border border-white/10 rounded-2xl p-6 text-center mt-8">
                <h3 className="text-xl font-bold text-white mb-2">¿Aún necesitas ayuda?</h3>
                <p className="text-sm text-gray-300 mb-4">Nuestro equipo de soporte responde en menos de 24 horas.</p>
                <button className="bg-white text-black font-bold py-3 px-6 rounded-xl hover:bg-gray-200 transition-colors shadow-lg">
                    Contactar Soporte
                </button>
            </div>
        </div>
    );
};
