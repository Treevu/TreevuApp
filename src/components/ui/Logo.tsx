import React from 'react';

interface LogoProps {
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ className }) => {
    return (
        <svg
            className={className}
            viewBox="0 0 96 96"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
        >
            {/* Use currentColor to inherit color from parent CSS */}
            <path d="M48 96C49.1046 96 50 95.1046 50 94V40C50 38.8954 49.1046 38 48 38C46.8954 38 46 38.8954 46 40V94C46 95.1046 46.8954 96 48 96Z" fill="currentColor"/>
            <path d="M48 0C25.9086 0 8 17.9086 8 40H88C88 17.9086 70.0914 0 48 0Z" fill="currentColor"/>
        </svg>
    );
};

export default Logo;
