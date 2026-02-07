import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 font-semibold transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wide text-sm";
  
  const variants = {
    primary: "bg-metro-cyan text-black hover:bg-white hover:text-metro-cyan border-2 border-metro-cyan hover:border-white",
    outline: "bg-transparent text-white border-2 border-metro-border hover:border-metro-cyan hover:text-metro-cyan",
    ghost: "bg-transparent text-gray-400 hover:text-white"
  };

  const widthStyle = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthStyle} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
