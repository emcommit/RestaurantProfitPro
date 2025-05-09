import React from 'react';

interface SelectFieldProps {
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  error?: string;
}

const SelectField: React.FC<SelectFieldProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error
}) => {
  return (
    <div className="mb-4">
      <label htmlFor={name} className="label">
        <span className="label-text">{label}</span>
      </label>
      <select
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        className={`select w-full ${error ? 'border-destructive' : ''}`}
      >
        <option value="">Select an option</option>
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && <p className="text-destructive text-sm mt-1">{error}</p>}
    </div>
  );
};

export default SelectField;