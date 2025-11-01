
"use client";

import { createContext, useContext, useState, type ReactNode, useCallback } from 'react';
import type { Event, CoachingCenter, Session } from '@/lib/mockData';
import { events as initialEvents, coachingCenters as initialCoachingCenters, mockSessions as initialSessions } from '@/lib/mockData';

interface AppContextType {
  events: Event[];
  coachingCenters: CoachingCenter[];
  sessions: Session[];
  addEvent: (newEventData: Omit<Event, 'id' | 'participants'>) => void;
  updateEvent: (eventId: number, updatedEventData: Omit<Event, 'id' | 'participants'>) => void;
  toggleEventRegistration: (eventId: number, userId: number) => void;
  addCoachingCenter: (newCenterData: Omit<CoachingCenter, 'id' | 'participants'>) => void;
  toggleCoachingCenterRegistration: (centerId: number, userId: number) => void;
  markSessionAttendance: (sessionId: string, childId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [coachingCenters, setCoachingCenters] = useState<CoachingCenter[]>(initialCoachingCenters);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);

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

  const toggleEventRegistration = useCallback((eventId: number, userId: number) => {
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

  const addCoachingCenter = useCallback((newCenterData: Omit<CoachingCenter, 'id' | 'participants'>) => {
    setCoachingCenters(prevCenters => [
      ...prevCenters,
      {
        ...newCenterData,
        id: prevCenters.length > 0 ? Math.max(...prevCenters.map(c => c.id)) + 1 : 1,
        participants: [],
      }
    ]);
  }, []);

  const toggleCoachingCenterRegistration = useCallback((centerId: number, userId: number) => {
    setCoachingCenters(prevCenters =>
      prevCenters.map(center => {
        if (center.id === centerId) {
          const isRegistered = center.participants.includes(userId);
          const newParticipants = isRegistered
            ? center.participants.filter(id => id !== userId)
            : [...center.participants, userId];
          return { ...center, participants: newParticipants };
        }
        return center;
      })
    );
  }, []);

  const markSessionAttendance = useCallback((sessionId: string, childId: string) => {
    setSessions(prevSessions =>
      prevSessions.map(session => {
        if (session.id === sessionId) {
          if (!session.participants.includes(childId)) {
            return { ...session, participants: [...session.participants, childId] };
          }
        }
        return session;
      })
    );
  }, []);

  return (
    <AppContext.Provider value={{ events, coachingCenters, sessions, addEvent, updateEvent, toggleEventRegistration, addCoachingCenter, toggleCoachingCenterRegistration, markSessionAttendance }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
