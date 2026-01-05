'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
interface CalendarContextType {
  selectedDate: Date | null;
  isOpen: boolean;
  open: (transaction: Date) => void;
  close: () => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [selectedDate, setSelectedDate] =
    useState<Date | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const open = (date : Date) => {
    setSelectedDate(date);
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
  };

  return (
    <CalendarContext.Provider
      value={{ selectedDate, isOpen, open, close }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar= () => {
  const context = useContext(CalendarContext);
  if (!context) {
    throw new Error('error');
  }
  return context;
};
