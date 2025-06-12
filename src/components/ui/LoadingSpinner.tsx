import React from 'react';

interface LoadingSpinnerProps {
    size?: number;
    text?: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
                                                           size = 80,
                                                           text = 'Loading...'
                                                       }) => {

    return (
        <div className="flex flex-col items-center justify-center">
            {/* Spinner Wheel */}
            <div
                className="relative animate-spin"
                style={{
                    width: `${size}px`,
                    height: `${size}px`,
                    borderRadius: "50%",
                    border: `${size * 0.1}px solid #111`,
                    borderTopColor: "#ff1801", // Ferrari Red
                    borderRightColor: "#fcd400", // Pirelli Yellow
                    borderBottomColor: "#00d2be", // Mercedes Teal
                    borderLeftColor: "#1e41ff", // Red Bull Blue
                }}
            >
                {/* Center cap */}
                <div
                    className="absolute bg-black rounded-full"
                    style={{
                        width: `${size * 0.3}px`,
                        height: `${size * 0.3}px`,
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        border: "2px solid white",
                    }}
                />
            </div>

            {/* Loading Text */}
            <p className="mt-3 text-white text-sm font-mono tracking-wide animate-pulse">
                {text}
            </p>
        </div>
    );
};

export default LoadingSpinner;