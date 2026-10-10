import { FiFilter } from "react-icons/fi";

interface FilterBarProps {
  title: string;
  breadcrumb: string;
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onOpenFilters?: () => void;
}

export const FilterBar = ({
  title,
  breadcrumb,
  filters,
  activeFilter,
  onFilterChange,
  onOpenFilters,
}: FilterBarProps) => {
  return (
    <div className="w-full px-6 md:px-12 py-10 pt-[120px]">
      <nav className="text-[10px] uppercase tracking-[0.3em] text-gray-400 mb-6 flex gap-2 font-bold">
        {breadcrumb}
      </nav>
      <h1 className="text-5xl md:text-7xl font-serif italic uppercase tracking-tighter mb-8">
        {title}
      </h1>
      <div className="flex flex-wrap justify-between items-center gap-6 border-b border-gray-100 pb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => onFilterChange("VER TODO")}
            className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
              activeFilter === "VER TODO"
                ? "bg-black text-white border-black"
                : "border-gray-200 hover:border-black"
            }`}
          >
            {"VER TODO"}
          </button>

          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => onFilterChange(filter)}
              className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest border transition-all ${
                activeFilter === filter
                  ? "bg-black text-white border-black"
                  : "border-gray-200 hover:border-black"
              }`}
            >
              {filter.replace(/_/g, " ")}
            </button>
          ))}
        </div>

        <button
          onClick={onOpenFilters}
          className="flex items-center gap-3 border border-black px-8 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all"
        >
          <FiFilter size={16} /> {"Filtrar"}
        </button>
      </div>
    </div>
  );
};

interface SimplifiedFilterBarProps {
  title: string;
  itemCount: number;
  filters: string[];
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  onOpenFilters?: () => void;
}

export const SimplifiedFilterBar = ({
  title,
  itemCount,
  filters,
  activeFilter,
  onFilterChange,
  onOpenFilters,
}: SimplifiedFilterBarProps) => {
  return (
    <div className="w-full px-6 md:px-12 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl md:text-5xl font-serif italic uppercase tracking-tighter mb-2">
            {title}
          </h1>
          <p className="text-[10px] font-black tracking-[0.4em] text-gray-400 uppercase">
            {itemCount} {"artículos"} {title.toUpperCase()}
          </p>
        </div>

        {onOpenFilters && (
          <button
            onClick={onOpenFilters}
            className="flex items-center gap-3 border border-black px-6 py-2.5 text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all mt-4 md:mt-0"
          >
            <FiFilter size={14} /> {"Filtrar"}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 pb-6 border-b border-gray-100">
        <button
          onClick={() => onFilterChange("VER TODO")}
          className={`px-5 py-1.5 text-[10px] font-bold tracking-widest border transition-all ${
            activeFilter === "VER TODO"
              ? "bg-black text-white border-black"
              : "bg-white text-gray-500 border-gray-100 hover:border-black"
          }`}
        >
          {"VER TODO"}
        </button>

        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`px-5 py-1.5 text-[10px] font-bold tracking-widest border transition-all ${
              activeFilter === filter
                ? "bg-black text-white border-black"
                : "bg-white text-gray-500 border-gray-100 hover:border-black"
            }`}
          >
            {filter.replace(/_/g, " ")}
          </button>
        ))}
      </div>
    </div>
  );
};
