
import React from 'react';

interface InputProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  mask?: 'cpf' | 'phone' | 'none';
  disabled?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  type,
  placeholder,
  value,
  onChange,
  required = true,
  mask = 'none',
  disabled = false
}) => {
  const formatValue = (val: string) => {
    if (mask === 'cpf') {
      return val
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
    }
    if (mask === 'phone') {
      return val
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d)/, '$1-$2')
        .replace(/(-\d{4})\d+?$/, '$1');
    }
    return val;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(formatValue(e.target.value));
  };

  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-black uppercase text-gray-500 tracking-widest ml-1">
        {label}
      </label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        disabled={disabled}
        className={`w-full px-5 py-4 rounded-2xl border-2 outline-none transition-all font-bold ${
          disabled
            ? 'border-gray-100 bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'border-gray-100 bg-gray-50/50 text-gray-700 hover:bg-white hover:border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
        }`}
      />
    </div>
  );
};
