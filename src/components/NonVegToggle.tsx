interface NonVegToggleProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}

export function NonVegToggle({ enabled, onChange }: NonVegToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label="Show Non-Veg Recipes"
      onClick={() => onChange(!enabled)}
      className="group inline-flex items-center gap-3 rounded-full"
    >
      <span className="text-sm font-bold text-ink dark:text-white">🍗 Show Non-Veg Recipes</span>
      <span
        className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 shadow-sm transition-colors duration-300 ${
          enabled
            ? 'bg-gradient-to-r from-orange-400 to-red-500'
            : 'bg-gray-300 dark:bg-gray-600'
        }`}
      >
        <span
          className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform duration-300 ease-out ${
            enabled ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </span>
    </button>
  );
}
