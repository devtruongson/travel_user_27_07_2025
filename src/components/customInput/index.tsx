"use client";
import React, { useState, forwardRef } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
  disableFocusRing?: boolean;
}

const CustomInput = forwardRef<HTMLInputElement, IProps>(
  (
    {
      label,
      type = 'text',
      placeholder,
      required = false,
      error,
      className = '',
      inputClassName = '',
      disableFocusRing,
      ...rest
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
      <div className={`relative ${className}`}>
        {label && (
          <label htmlFor={rest.name} className="block text-sm font-medium text-gray-700 mb-1">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <input
          type={isPassword ? (showPassword ? 'text' : 'password') : type}
          id={rest.name}
          placeholder={placeholder}
          required={required}
          ref={ref}
          className={`w-full px-3 py-2 border rounded-md focus:outline-none 
            ${disableFocusRing ? 'focus:ring-0' : 'focus:ring-2 focus:ring-cyan-400'} 
            ${error ? 'border-red-500' : 'border-gray-300'} 
            ${inputClassName}`}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-[46px] transform -translate-y-1/2 text-[#2d66d4] hover:text-gray-900"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeSlashIcon className="w-6 h-6 cursor-pointer" color="#2d66d4" />
            ) : (
              <EyeIcon className="w-6 h-6 cursor-pointer" color="#2d66d4" />
            )}
          </button>
        )}
        {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      </div>
    );
  }
);

CustomInput.displayName = 'CustomInput';

export default CustomInput;