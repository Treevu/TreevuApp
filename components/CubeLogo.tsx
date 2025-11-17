import React from 'react';
import { UsersIcon, BriefcaseIcon, BuildingStorefrontIcon, TreevuNetworkIcon } from './Icons';

interface CubeLogoProps {
    className?: string;
}

const CubeLogo: React.FC<CubeLogoProps> = ({ className }) => {
    return (
        <div className={`cube-scene ${className}`} aria-label="treevü ecosystem logo">
            <div className="cube">
                <div className="cube__face cube__face--front">
                    <UsersIcon className="w-2/3 h-2/3 text-primary" />
                </div>
                <div className="cube__face cube__face--back">
                     <BriefcaseIcon className="w-2/3 h-2/3 text-accent" />
                </div>
                <div className="cube__face cube__face--right">
                    <BuildingStorefrontIcon className="w-2/3 h-2/3 text-accent-secondary" />
                </div>
                <div className="cube__face cube__face--left">
                     <TreevuNetworkIcon className="w-2/3 h-2/3 text-on-surface-secondary" />
                </div>
                <div className="cube__face cube__face--top"></div>
                <div className="cube__face cube__face--bottom"></div>
            </div>
        </div>
    );
};

export default CubeLogo;
