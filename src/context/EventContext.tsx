"use client";

import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { Event } from '@/lib/mockData';
import { events as initialEvents } from '@/lib/mockData';

interface EventContextType {
  events: Event[];
  addEvent: (newEventData: Omit<Event, 'id' | 'participants'>) => void;
  updateEvent: (eventId: number, updatedEventData: Omit<Event, 'id' | 'participants'>) => void;
  toggleRegistration: (eventId: number, userId: number) => void;
}

const EventContext = createContext<EventContextType | undefined>(undefined);

export function EventProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(initialEvents);

  const addEvent = useCallback((newEventData: Omit<Event, 'id' | 'participants'>) => {
    setEvents(prevEvents => [
      ...prevEvents,
      {
        ...newEventData,
        id: prevEvents.length > 0 ? Math.max(...prevEvents.map(e => e.id)) + 1 : 1,
        participants: [],
      }
    ]);
  }, []);

  const updateEvent = useCallback((eventId: number, updatedEventData: Omit<Event, 'id' | 'participants'>) => {
    setEvents(prevEvents => 
        prevEvents.map(event => {
            if (event.id === eventId) {
                return {
                    ...event,
                    ...updatedEventData
                };
            }
            return event;
        })
    );
  }, []);

  const toggleRegistration = useCallback((eventId: number, userId: number) => {
    setEvents(prevEvents =>
      prevEvents.map(event => {
        if (event.id === eventId) {
          const isRegistered = event.participants.includes(userId);
          const newParticipants = isRegistered
            ? event.participants.filter(id => id !== userId)
            : [...event.participants, userId];
          return { ...event, participants: newParticipants };
        }
        return event;
      })
    );
  }, []);

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, toggleRegistration }}>
      {children}
    </EventContext.Provider>
  );
}

export function useEvents() {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
}
