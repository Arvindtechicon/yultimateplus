
"use client";

import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from 'react';
import type { Event, CoachingCenter, Session, Child, Assessment, HomeVisit, MockAlert, Venue, ImagePlaceholder } from '@/lib/mockData';
import { 
    events as initialEvents, 
    coachingCenters as initialCoachingCenters, 
    mockSessions as initialSessions,
    mockChildren as initialChildrenData,
    mockAssessments as initialAssessments,
    mockHomeVisits as initialHomeVisits,
    mockAlerts as initialAlerts,
    venues as initialVenues
} from '@/lib/mockData';

interface AppContextType {
  events: Event[];
  coachingCenters: CoachingCenter[];
  sessions: Session[];
  children: Child[];
  assessments: Assessment[];
  homeVisits: HomeVisit[];
  alerts: MockAlert[];
  venues: Venue[];
  tempEventImages: { [eventId: number]: ImagePlaceholder[] };
  addEvent: (newEventData: Omit<Event, 'id' | 'participants'>) => void;
  updateEvent: (eventId: number, updatedEventData: Omit<Event, 'id' | 'participants'>) => void;
  toggleEventRegistration: (eventId: number, userId: number) => void;
  addCoachingCenter: (newCenterData: Omit<CoachingCenter, 'id' | 'participants'>) => void;
  toggleCoachingCenterRegistration: (centerId: number, userId: number) => void;
  markSessionAttendance: (sessionId: string, childId: string) => void;
  addAssessment: (newAssessmentData: Omit<Assessment, 'date'>) => void;
  addHomeVisit: (newHomeVisitData: Omit<HomeVisit, 'id'>) => void;
  addVenue: (venueName: string) => Venue;
  addImageToEvent: (eventId: number, image: ImagePlaceholder) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') {
        return fallback;
    }
    try {
        const stored = localStorage.getItem(key);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        localStorage.removeItem(key);
    }
    return fallback;
};


export function AppDataProvider({ children: componentChildren }: { children: ReactNode }) {
  const [events, setEvents] = useState<Event[]>(() => getInitialState('y-ultimate-events', initialEvents));
  const [coachingCenters, setCoachingCenters] = useState<CoachingCenter[]>(() => getInitialState('y-ultimate-coaching-centers', initialCoachingCenters));
  const [sessions, setSessions] = useState<Session[]>(() => getInitialState('y-ultimate-sessions', initialSessions));
  const [appChildren, setAppChildren] = useState<Child[]>(initialChildrenData);
  const [assessments, setAssessments] = useState<Assessment[]>(() => getInitialState('y-ultimate-assessments', initialAssessments));
  const [homeVisits, setHomeVisits] = useState<HomeVisit[]>(() => getInitialState('y-ultimate-home-visits', initialHomeVisits));
  const [alerts, setAlerts] = useState<MockAlert[]>(initialAlerts);
  const [venues, setVenues] = useState<Venue[]>(() => getInitialState('y-ultimate-venues', initialVenues));
  const [tempEventImages, setTempEventImages] = useState<{ [eventId: number]: ImagePlaceholder[] }>(() => getInitialState('y-ultimate-temp-images', {}));

  useEffect(() => {
    localStorage.setItem('y-ultimate-events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem('y-ultimate-coaching-centers', JSON.stringify(coachingCenters));
  }, [coachingCenters]);
  
  useEffect(() => {
    localStorage.setItem('y-ultimate-sessions', JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem('y-ultimate-assessments', JSON.stringify(assessments));
  }, [assessments]);

  useEffect(() => {
    localStorage.setItem('y-ultimate-home-visits', JSON.stringify(homeVisits));
  }, [homeVisits]);

  useEffect(() => {
    localStorage.setItem('y-ultimate-venues', JSON.stringify(venues));
    }, [venues]);
  
  useEffect(() => {
    localStorage.setItem('y-ultimate-temp-images', JSON.stringify(tempEventImages));
  }, [tempEventImages]);


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
        // Assign mock coordinates for new centers
        coordinates: {
            lat: 40.7128 + (Math.random() - 0.5) * 0.1,
            lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        }
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

  const addAssessment = useCallback((newAssessmentData: Omit<Assessment, 'date'>) => {
    setAssessments(prev => [
      ...prev,
      {
        ...newAssessmentData,
        date: new Date().toISOString(),
      }
    ]);
  }, []);

  const addHomeVisit = useCallback((newHomeVisitData: Omit<HomeVisit, 'id'>) => {
    setHomeVisits(prev => [
        ...prev,
        {
            ...newHomeVisitData,
            id: `HV${prev.length + 1}`,
        }
    ])
  }, []);

  const addVenue = useCallback((venueName: string): Venue => {
    const newVenue: Venue = {
        id: venues.length > 0 ? Math.max(...venues.map(v => v.id)) + 1 : 1,
        name: venueName,
        location: `${venueName} Location`,
        coordinates: {
            lat: 12.2958 + (Math.random() - 0.5) * 0.1,
            lng: 76.6394 + (Math.random() - 0.5) * 0.1,
        },
    };
    setVenues(prevVenues => [...prevVenues, newVenue]);
    return newVenue;
  }, [venues]);

  const addImageToEvent = useCallback((eventId: number, image: ImagePlaceholder) => {
    setTempEventImages(prev => ({
        ...prev,
        [eventId]: [...(prev[eventId] || []), image]
    }));
  }, []);

  const contextValue = {
      events,
      coachingCenters,
      sessions,
      children: appChildren,
      assessments,
      homeVisits,
      alerts,
      venues,
      tempEventImages,
      addEvent,
      updateEvent,
      toggleEventRegistration,
      addCoachingCenter,
      toggleCoachingCenterRegistration,
      markSessionAttendance,
      addAssessment,
      addHomeVisit,
      addVenue,
      addImageToEvent,
  }

  return (
    <AppContext.Provider value={contextValue}>
      {componentChildren}
    </AppContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
