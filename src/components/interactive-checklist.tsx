"use client";

import { useState, useCallback, createContext, useContext, useRef } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChecklistState {
  [itemId: string]: boolean;
}

// LocalStorage key for checklist state
const getStorageKey = (chapterId: string) => `vibekai-checklist-${chapterId}`;

// Context for checklist state
interface ChecklistContextType {
  isChecked: (itemId: string) => boolean;
  toggleItem: (itemId: string) => void;
  getNextId: () => string;
  registerCheckbox: (itemId: string) => void;
  getTotalCheckboxes: () => number;
  getCheckedCount: () => number;
  areAllChecked: () => boolean;
}

const ChecklistContext = createContext<ChecklistContextType | null>(null);

export function useChecklistContext() {
  const context = useContext(ChecklistContext);
  if (!context) {
    throw new Error("useChecklistContext must be used within ChecklistProvider");
  }
  return context;
}

// Provider component
interface ChecklistProviderProps {
  chapterId: string;
  children: React.ReactNode;
}

export function ChecklistProvider({
  chapterId,
  children,
}: ChecklistProviderProps) {
  const [checkedItems, setCheckedItems] = useState<ChecklistState>(() => {
    // Initialize from localStorage on client side
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(getStorageKey(chapterId));
        if (stored) {
          return JSON.parse(stored);
        }
      } catch {
        // Invalid JSON, ignore
      }
    }
    return {};
  });

  // Track all registered checkboxes
  const registeredCheckboxesRef = useRef<Set<string>>(new Set());

  // Counter for generating sequential IDs
  const idCounterRef = useRef(0);

  // Reset counter when content changes (re-renders)
  const getNextId = useCallback(() => {
    const id = `item-${idCounterRef.current}`;
    idCounterRef.current += 1;
    return id;
  }, []);

  // Register a checkbox when it's rendered
  const registerCheckbox = useCallback((itemId: string) => {
    registeredCheckboxesRef.current.add(itemId);
  }, []);

  // Get total number of registered checkboxes
  const getTotalCheckboxes = useCallback(() => {
    return registeredCheckboxesRef.current.size;
  }, []);

  // Get number of checked checkboxes
  const getCheckedCount = useCallback(() => {
    let count = 0;
    registeredCheckboxesRef.current.forEach((itemId) => {
      if (checkedItems[itemId]) {
        count++;
      }
    });
    return count;
  }, [checkedItems]);

  // Check if all checkboxes are checked
  const areAllChecked = useCallback(() => {
    const total = registeredCheckboxesRef.current.size;
    if (total === 0) return true; // No checkboxes = all checked
    let checked = 0;
    registeredCheckboxesRef.current.forEach((itemId) => {
      if (checkedItems[itemId]) {
        checked++;
      }
    });
    return checked === total;
  }, [checkedItems]);

  // Save to localStorage when state changes
  const saveToStorage = useCallback((items: ChecklistState) => {
    if (typeof window !== 'undefined') {
      const storageKey = getStorageKey(chapterId);
      localStorage.setItem(storageKey, JSON.stringify(items));
    }
  }, [chapterId]);

  const toggleItem = useCallback((itemId: string) => {
    setCheckedItems((prev) => {
      const newState = {
        ...prev,
        [itemId]: !prev[itemId],
      };
      // Save immediately after toggle
      saveToStorage(newState);
      return newState;
    });
  }, [saveToStorage]);

  const isChecked = useCallback(
    (itemId: string) => checkedItems[itemId] ?? false,
    [checkedItems]
  );

  return (
    <ChecklistContext.Provider value={{
      isChecked,
      toggleItem,
      getNextId,
      registerCheckbox,
      getTotalCheckboxes,
      getCheckedCount,
      areAllChecked
    }}>
      {children}
    </ChecklistContext.Provider>
  );
}

// Checkbox component for list items (exported for direct use)
interface CheckboxItemProps {
  itemId: string;
  isChecked: boolean;
  onToggle: (itemId: string) => void;
  children: React.ReactNode;
}

export function CheckboxItem({
  itemId,
  isChecked,
  onToggle,
  children,
}: CheckboxItemProps) {
  return (
    <li className="flex items-start gap-3 py-1.5 group cursor-pointer select-none" onClick={() => onToggle(itemId)}>
      <button
        type="button"
        className={cn(
          "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200",
          isChecked
            ? "bg-[#56d364] border-[#56d364]"
            : "border-[#484f58] hover:border-[#8b949e] bg-transparent group-hover:border-[#8b949e]"
        )}
        aria-checked={isChecked}
        role="checkbox"
      >
        <Check
          className={cn(
            "h-3.5 w-3.5 text-[#0d1117] transition-all duration-200",
            isChecked ? "opacity-100 scale-100" : "opacity-0 scale-75"
          )}
          strokeWidth={3}
        />
      </button>
      <span
        className={cn(
          "flex-1 transition-all duration-200",
          isChecked && "text-[#8b949e] line-through"
        )}
      >
        {children}
      </span>
    </li>
  );
}
