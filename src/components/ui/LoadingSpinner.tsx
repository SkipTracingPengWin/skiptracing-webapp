import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
    className?: string;
    size?: number;
    text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ className = "text-blue-600", size = 48, text }) => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full min-h-[400px]">
            <Loader2 className={`animate-spin mb-4 ${className}`} size={size} />
            {text && <p className="text-slate-500 font-medium">{text}</p>}
        </div>
    );
};

export default LoadingSpinner;
