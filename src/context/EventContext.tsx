
"use client";

import { createContext, useContext, useState, type ReactNode, useCallback, useEffect } from 'react';
import type { Event, CoachingCenter, Session, Child, Assessment, HomeVisit, MockAlert, Venue, ImagePlaceholder, Organization, User, Participant, Coach, Organizer, Team } from '@/lib/mockData';
import { 
    events as initialEvents, 
    coachingCenters as initialCoachingCenters, 
    mockSessions as initialSessions,
    mockChildren as initialChildrenData,
    mockAssessments as initialAssessments,
    mockHomeVisits as initialHomeVisits,
    mockAlerts as initialAlerts,
    venues as initialVenues,
    organizations as initialOrganizations,
    mockUsers as initialUsers,
    mockParticipants as initialParticipants,
    mockOrganizers as initialOrganizers,
    mockCoaches as initialCoaches,
    mockTeams as initialTeams
} from '@/lib/mockData';
import type { TeamResult } from '@/components/dashboard/SubmitResultsForm';

interface AppContextType {
  events: Event[];
  coachingCenters: CoachingCenter[];
  sessions: Session[];
  children: Child[];
  assessments: Assessment[];
  homeVisits: HomeVisit[];
  alerts: MockAlert[];
  venues: Venue[];
  organizations: Organization[];
  users: User[];
  participants: Participant[];
  organizers: Organizer[];
  coaches: Coach[];
  teams: Team[];
  tempEventImages: { [eventId: number]: ImagePlaceholder[] };
  addEvent: (newEventData: Omit<Event, 'id' | 'participants'>) => Event;
  updateEvent: (eventId: number, updatedEventData: Omit<Event, 'id' | 'participants'>) => void;
  updateEventResults: (eventId: number, results: { first: TeamResult; second: TeamResult; third: TeamResult; highlights: string }) => void;
  toggleEventRegistration: (eventId: number, userId: string) => void;
  addCoachingCenter: (newCenterData: Omit<CoachingCenter, 'id' | 'participants' | 'coordinates'>) => void;
  toggleCoachingCenterRegistration: (centerId: number, userId: string) => void;
  markSessionAttendance: (sessionId: string, childId: string) => void;
  addAssessment: (newAssessmentData: Omit<Assessment, 'date'>) => void;
  addHomeVisit: (newHomeVisitData: Omit<HomeVisit, 'id'>) => void;
  addVenue: (venueName: string, venueLocation: string) => Venue;
  addImageToEvent: (eventId: number, image: ImagePlaceholder) => void;
  addOrganization: (newOrgData: Omit<Organization, 'id' | 'organizers'>) => void;
  addParticipant: (participant: Participant) => void;
  addOrganizer: (organizer: Organizer) => void;
  addCoach: (coach: Coach) => void;
  addUser: (user: User) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const getInitialState = <T,>(key: string, fallback: T): T => {
    if (typeof window === 'undefined') {
        return fallback;
    }
    try {
        const stored = localStorage.getItem(key);
        if (stored && stored !== 'undefined' && stored !== 'null') {
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
  const [organizations, setOrganizations] = useState<Organization[]>(() => getInitialState('y-ultimate-organizations', initialOrganizations));
  const [tempEventImages, setTempEventImages] = useState<{ [eventId: number]: ImagePlaceholder[] }>(() => getInitialState('y-ultimate-temp-images', {}));
  
  const [users, setUsers] = useState<User[]>(() => getInitialState('y-ultimate-users', initialUsers));
  const [participants, setParticipants] = useState<Participant[]>(() => getInitialState('y-ultimate-participants', initialParticipants));
  const [organizers, setOrganizers] = useState<Organizer[]>(() => getInitialState('y-ultimate-organizers', initialOrganizers));
  const [coaches, setCoaches] = useState<Coach[]>(() => getInitialState('y-ultimate-coaches', initialCoaches));
  const [teams, setTeams] = useState<Team[]>(() => getInitialState('y-ultimate-teams', initialTeams));

  useEffect(() => { localStorage.setItem('y-ultimate-events', JSON.stringify(events)); }, [events]);
  useEffect(() => { localStorage.setItem('y-ultimate-coaching-centers', JSON.stringify(coachingCenters)); }, [coachingCenters]);
  useEffect(() => { localStorage.setItem('y-ultimate-sessions', JSON.stringify(sessions)); }, [sessions]);
  useEffect(() => { localStorage.setItem('y-ultimate-assessments', JSON.stringify(assessments)); }, [assessments]);
  useEffect(() => { localStorage.setItem('y-ultimate-home-visits', JSON.stringify(homeVisits)); }, [homeVisits]);
  useEffect(() => { localStorage.setItem('y-ultimate-venues', JSON.stringify(venues)); }, [venues]);
  useEffect(() => { localStorage.setItem('y-ultimate-temp-images', JSON.stringify(tempEventImages)); }, [tempEventImages]);
  useEffect(() => { localStorage.setItem('y-ultimate-organizations', JSON.stringify(organizations)); }, [organizations]);
  useEffect(() => { localStorage.setItem('y-ultimate-users', JSON.stringify(users)); }, [users]);
  useEffect(() => { localStorage.setItem('y-ultimate-participants', JSON.stringify(participants)); }, [participants]);
  useEffect(() => { localStorage.setItem('y-ultimate-organizers', JSON.stringify(organizers)); }, [organizers]);
  useEffect(() => { localStorage.setItem('y-ultimate-coaches', JSON.stringify(coaches)); }, [coaches]);
  useEffect(() => { localStorage.setItem('y-ultimate-teams', JSON.stringify(teams)); }, [teams]);

  const addUser = useCallback((user: User) => {
    setUsers(prev => [...prev, user]);
  }, []);
  const addParticipant = useCallback((participant: Participant) => {
    setParticipants(prev => [...prev, participant]);
  }, []);
  const addOrganizer = useCallback((organizer: Organizer) => {
    setOrganizers(prev => [...prev, organizer]);
  }, []);
  const addCoach = useCallback((coach: Coach) => {
    setCoaches(prev => [...prev, coach]);
  }, []);


  const addEvent = useCallback((newEventData: Omit<Event, 'id' | 'participants'>) => {
    const newEvent = {
        ...newEventData,
        id: events.length > 0 ? Math.max(...events.map(e => e.id)) + 1 : 1,
        participants: [],
      };
    setEvents(prevEvents => [
      ...prevEvents,
      newEvent
    ]);
    return newEvent;
  }, [events]);

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

  const updateEventResults = useCallback((eventId: number, results: { first: TeamResult; second: TeamResult; third: TeamResult; highlights: string }) => {
    const { first, second, third, highlights } = results;
    
    // Update team stats
    setTeams(prevTeams => {
        const teamMap = new Map(prevTeams.map(t => [t.id, {...t}]));

        const updateTeam = (teamId: string, isWinner: boolean) => {
            const team = teamMap.get(teamId);
            if(team) {
                if (isWinner) team.wins += 1;
                else team.losses += 1;
                
                if (teamId === first.teamId) team.spiritScore = (team.spiritScore + first.spiritScore) / 2;
                if (teamId === second.teamId) team.spiritScore = (team.spiritScore + second.spiritScore) / 2;
                if (teamId === third.teamId) team.spiritScore = (team.spiritScore + third.spiritScore) / 2;
            }
        };

        updateTeam(first.teamId, true);
        updateTeam(second.teamId, false); // Simplified: assuming 2nd/3rd are losses for ranking
        updateTeam(third.teamId, false);

        return Array.from(teamMap.values());
    });

    // Update event details
    setEvents(prevEvents => 
        prevEvents.map(event => {
            if (event.id === eventId) {
                return {
                    ...event,
                    winners: {
                        first: teams.find(t => t.id === first.teamId)?.name || 'Unknown',
                        second: teams.find(t => t.id === second.teamId)?.name || 'Unknown',
                        third: teams.find(t => t.id === third.teamId)?.name || 'Unknown',
                    },
                    highlights,
                };
            }
            return event;
        })
    );
}, [teams]);


  const toggleEventRegistration = useCallback((eventId: number, userId: string) => {
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

  const addCoachingCenter = useCallback((newCenterData: Omit<CoachingCenter, 'id' | 'participants' | 'coordinates'>) => {
    setCoachingCenters(prevCenters => [
      ...prevCenters,
      {
        ...newCenterData,
        fee: Number(newCenterData.fee) || 0,
        id: prevCenters.length > 0 ? Math.max(...prevCenters.map(c => c.id)) + 1 : 1,
        participants: [],
        coordinates: {
            lat: 40.7128 + (Math.random() - 0.5) * 0.1,
            lng: -74.0060 + (Math.random() - 0.5) * 0.1,
        }
      }
    ]);
  }, []);

  const toggleCoachingCenterRegistration = useCallback((centerId: number, userId: string) => {
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

  const addVenue = useCallback((venueName: string, venueLocation: string): Venue => {
    const newVenue: Venue = {
        id: venues.length > 0 ? Math.max(...venues.map(v => v.id)) + 1 : 1,
        name: venueName,
        location: venueLocation,
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

  const addOrganization = useCallback((newOrgData: Omit<Organization, 'id' | 'organizers'>) => {
    setOrganizations(prevOrgs => [
      ...prevOrgs,
      {
        ...newOrgData,
        id: prevOrgs.length > 0 ? Math.max(...prevOrgs.map(o => o.id)) + 1 : 1,
        organizers: [],
      }
    ]);
  }, []);

  const contextValue = {
      events, coachingCenters, sessions, children: appChildren, assessments,
      homeVisits, alerts, venues, organizations, users, participants,
      organizers, coaches, teams, tempEventImages, addEvent, updateEvent, toggleEventRegistration,
      addCoachingCenter, toggleCoachingCenterRegistration, markSessionAttendance, addAssessment,
      addHomeVisit, addVenue, addImageToEvent, addOrganization,
      addUser, addParticipant, addOrganizer, addCoach, updateEventResults
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
