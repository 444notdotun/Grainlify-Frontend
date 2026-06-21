"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "../../../app/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../../../app/components/ui/popover";
import { useTheme } from "../../contexts/ThemeContext";
import { cn } from "../../../app/components/ui/utils";

interface DatePickerProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
  error?: string | null;
}

export function DatePicker({
  label,
  value,
  onChange,
  placeholder = "Pick a date",
  required = false,
  className = "",
  error
}: DatePickerProps) {
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const triggerRef = React.useRef<HTMLButtonElement>(null);

  const isError = !!error;

  const date = React.useMemo(() => {
    if (!value) return undefined;
    try {
      const [year, month, day] = value.split('-').map(Number);
      return new Date(Date.UTC(year, month - 1, day));
    } catch { return undefined; }
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      onChange(format(selectedDate, "yyyy-MM-dd"));
      setOpen(false);
      // Return focus to trigger after selection
      triggerRef.current?.focus();
    }
  };

  const inputClasses = cn(
    "w-full px-4 py-3 rounded-[14px] backdrop-blur-[30px] border focus:outline-none transition-all text-[14px] flex items-center justify-between",
    isError 
      ? (theme === 'dark' ? 'border-red-500/40' : 'border-red-500/40') 
      : (theme === 'dark' ? 'border-white/15' : 'border-white/25'),
    className
  );

  return (
    <div>
      {label && <label className="block text-[13px] font-medium mb-2">{label}</label>}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={triggerRef}
            type="button"
            className={inputClasses}
            aria-label={label || "Select date"}
            aria-haspopup="dialog"
            aria-expanded={open}
          >
            <span>{date ? format(date, "MMM dd, yyyy") : placeholder}</span>
            <CalendarIcon className="h-4 w-4 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent 
          className="w-auto p-0 z-[10001]" 
          onEscapeKeyDown={() => { setOpen(false); triggerRef.current?.focus(); }}
        >
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
      {isError && <p className="text-[12px] mt-1.5 text-red-500">{error}</p>}
    </div>
  );
}
