import React from 'react';

interface InputFieldProps {
  label?: string;
  name: string;
  type: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  step?: string;
  error?: string;
  disabled?: boolean;
}

const InputField: React.FC<InputFieldProps> = ({
  label,
  name,
  type,
  value,
  onChange,
  step,
  error,
  disabled
}) => {
  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="label">
          <span className="label-text">{label}</span>
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        step={step}
        disabled={disabled}
        className={`input w-full ${error ? 'border-destructive' : ''}`}
      />
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
};

export default InputField;