
import React from 'react';

interface ButtonProps {
  label: string;
  onClick: (label: string) => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ label, onClick, className = '' }) => {
  return (
    <button
      onClick={() => onClick(label)}
      className={`flex items-center justify-center text-xl sm:text-2xl font-semibold rounded-lg shadow-md transition-all duration-150 ease-in-out transform active:scale-95 focus:outline-none focus:ring-2 focus:ring-opacity-75 ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;
