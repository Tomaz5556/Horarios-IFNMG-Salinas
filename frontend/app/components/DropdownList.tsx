'use client';

interface DropdownListProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: string[];
  label: string;
  staticOptions?: { [key: string]: string };
}

export default function DropdownList({ value, onChange, options, label, staticOptions }: DropdownListProps) {
  return (
    <div className="mb-2">
      <select
        value={value}
        onChange={onChange}
        className="p-2 border border-neutral-500"
      >
        <option value="">{label}</option>
        {staticOptions && Object.entries(staticOptions).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
        {options.length > 0 && options.map((option, index) => (
          <option key={index} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}