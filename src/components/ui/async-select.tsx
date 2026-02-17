import { useState, useEffect, useCallback } from "react";
import { Check, ChevronsUpDown, Search, Loader2 } from "lucide-react";
import { useDebounce } from "@/hooks/use-debounce";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export interface Option {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: React.ReactNode;
}

export interface AsyncSelectProps<T> {
  fetcher: (query?: string) => Promise<T[]>;
  preload?: boolean;
  filterFn?: (option: T, query: string) => boolean;
  renderOption: (option: T) => React.ReactNode;
  getOptionValue: (option: T) => string;
  getDisplayValue: (option: T) => React.ReactNode;
  notFound?: React.ReactNode;
  loadingSkeleton?: React.ReactNode;
  value: string;
  onChange: (value: string) => void;
  label: string;
  placeholder?: string;
  disabled?: boolean;
  width?: string | number;
  className?: string;
  triggerClassName?: string;
  noResultsMessage?: string;
  clearable?: boolean;
}

export function AsyncSelect<T>({
  fetcher,
  preload,
  filterFn,
  renderOption,
  getOptionValue,
  getDisplayValue,
  notFound,
  loadingSkeleton,
  label,
  placeholder = "Select...",
  value,
  onChange,
  disabled = false,
  width = "200px",
  className,
  triggerClassName,
  noResultsMessage,
  clearable = true,
}: AsyncSelectProps<T>) {
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedValue, setSelectedValue] = useState(value);
  const [selectedOption, setSelectedOption] = useState<T | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, preload ? 0 : 300);
  const [originalOptions, setOriginalOptions] = useState<T[]>([]);

  useEffect(() => {
    setMounted(true);
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetcher(debouncedSearchTerm);
        setOriginalOptions(data);
        setOptions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch options");
      } finally {
        setLoading(false);
      }
    };

    if (!mounted) {
      fetchOptions();
    } else if (!preload && debouncedSearchTerm) {
      fetchOptions();
    } else if (preload) {
      if (debouncedSearchTerm) {
        setOptions(
          originalOptions.filter((option) =>
            filterFn ? filterFn(option, debouncedSearchTerm) : true
          )
        );
      } else {
        setOptions(originalOptions);
      }
    }
  }, [fetcher, debouncedSearchTerm, mounted, preload, filterFn]);

  const handleSelect = useCallback(
    (currentValue: string) => {
      const newValue =
        clearable && currentValue === selectedValue ? "" : currentValue;
      setSelectedValue(newValue);
      setSelectedOption(
        options.find((option) => getOptionValue(option) === newValue) || null
      );
      onChange(newValue);
      setOpen(false);
    },
    [selectedValue, onChange, clearable, options, getOptionValue]
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          disabled={disabled}
          className={cn(
            "justify-between font-normal",
            !selectedOption && "text-muted-foreground",
            triggerClassName
          )}
          style={{ width }}
        >
          {selectedOption ? (
            getDisplayValue(selectedOption)
          ) : (
            <span>{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)} style={{ width }}>
        <Command shouldFilter={false}>
          <div className="relative border-b">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder={`Search ${label.toLowerCase()}...`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="focus-visible:ring-0 rounded-b-none border-none pl-8 flex-1"
            />
            {loading && options.length > 0 && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            )}
          </div>
          <CommandList>
            {error && (
              <div className="p-4 text-sm text-destructive">{error}</div>
            )}
            {loading && options.length === 0 && (
              loadingSkeleton || <DefaultLoadingSkeleton />
            )}
            {!loading && !error && options.length === 0 && (
              notFound || (
                <CommandEmpty>
                  {noResultsMessage ?? `No ${label.toLowerCase()} found.`}
                </CommandEmpty>
              )
            )}
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={getOptionValue(option)}
                  value={getOptionValue(option)}
                  onSelect={handleSelect}
                >
                  {renderOption(option)}
                  <Check
                    className={cn(
                      "ml-auto h-4 w-4",
                      selectedValue === getOptionValue(option)
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function DefaultLoadingSkeleton() {
  return (
    <div className="p-1">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2 rounded-sm px-2 py-1.5">
          <div className="flex items-center gap-2 w-full">
            <div className="h-6 w-6 animate-pulse rounded-full bg-muted" />
            <div className="space-y-1 flex-1">
              <div className="h-4 w-24 animate-pulse rounded bg-muted" />
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
