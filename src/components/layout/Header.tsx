import React, { useRef, useEffect } from 'react';
import { Button } from 'primereact/button';
import Logo from '@/components/ui/Logo';
import TreevuLogoText from '@/components/ui/TreevuLogoText.tsx';
import { OverlayPanel } from 'primereact/overlaypanel';
import NotificationCenter from '@/features/notifications/NotificationCenter';
import useNotificationStore from '@/stores/useNotificationStore';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
    const alertOverlay = useRef<OverlayPanel>(null);
    const notifications = useNotificationStore((state) => state.notifications);
    const unReadNotifications = useNotificationStore((state) => state.getUnreadCount);
    
    // Realinear el overlay cuando cambien las notificaciones
    useEffect(() => {
        if (alertOverlay.current && alertOverlay.current.isVisible()) {
            setTimeout(() => {
                alertOverlay.current?.align();
            }, 50);
        }
    }, [notifications]);
    

    return (
        <header className="bg-surface text-on-surface relative border-b border-active-surface/50">
            <div className="max-w-3xl mx-auto px-4 pt-4 pb-4">
                <div className="flex justify-between items-center">
                     <div className="flex items-center gap-2">
                        <Logo className="w-8 h-8 text-primary" />
                        <h1 className="text-3xl font-bold leading-tight treevu-text">
                            <TreevuLogoText />
                        </h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            id="alertOverlayBtn" 
                            icon="pi pi-bell" 
                            className="p-button-rounded p-button-text p-button-sm"
                            aria-label="Notificaciones"
                            badge={unReadNotifications()!=0? String(unReadNotifications()):null}
                            badgeClassName="p-badge-danger"
                            onClick={(e) => alertOverlay.current?.toggle(e)}
                        />
                        <OverlayPanel 
                            ref={alertOverlay}
                            style={{
                                width: '400px',
                                maxHeight: '500px'
                            }}
                        >
                            <NotificationCenter />
                        </OverlayPanel>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default React.memo(Header);