import React from 'react';

interface LogoProps {
    className?: string;
    src?: string;
}

const Logo: React.FC<LogoProps> = ({ className, src }) => {
    // If a src is provided, render an img tag for the company logo.
    if (src) {
        return (
            <img src={src} className={className} alt="Logotipo de la empresa" />
        );
    }

    // Otherwise, render the default SVG logo.
    return (
        <svg
            className={className}
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Use currentColor to inherit color from parent CSS */}
            <path d="M 44 96 L 46 38 H 50 L 52 96 Z" fill="currentColor"/>
            <path d="M 8 40 C 12 10, 35 -5, 48 2 C 61 -5, 84 10, 88 40 Z" fill="currentColor"/>
        </svg>
    );
};

export default Logo;
