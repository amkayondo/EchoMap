import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'glass';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  ...props 
}) => {
  const baseStyles = "relative px-6 py-4 font-bold text-sm transition-all duration-300 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed rounded-full shadow-xl flex items-center justify-center gap-2";
  
  const variants = {
    // White pill button
    primary: "bg-white text-black hover:bg-gray-100 shadow-[0_0_20px_rgba(255,255,255,0.3)]",
    // Darker button for secondary actions
    secondary: "bg-[#1A1A1A] text-white hover:bg-[#252525]",
    // Glass effect
    glass: "bg-white/10 backdrop-blur-md text-white border border-white/10 hover:bg-white/20"
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