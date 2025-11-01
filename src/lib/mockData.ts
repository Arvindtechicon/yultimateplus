
export interface User {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Organizer' | 'Participant';
}

export interface Event {
  id: number;
  name: string;
  date: string;
  description: string;
  venueId: number;
  organizationId: number;
  type: 'Tournament' | 'Workshop' | 'Meetup';
  participants: number[]; // array of user IDs
  winners?: {
    first: string;
    second: string;
    third: string;
  }
}

export interface Venue {
  id: number;
  name:string;
  location: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Organization {
  id: number;
  name: string;
  organizers: number[]; // array of user IDs
}

export interface CoachingCenter {
  id: number;
  name: string;
  specialty: string;
  location: string;
  participants: number[];
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface Child {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
  age: number;
  community: string;
  school: string;
}

export interface Session {
  id: string;
  date: string;
  community: string;
  coach: string;
  participants: string[];
  status: 'completed' | 'upcoming';
}

export interface Assessment {
  childId: string;
  date: string;
  type: 'Baseline' | 'Endline';
  score: {
    teamwork: number;
    confidence: number;
    communication: number;
  };
}

export interface HomeVisit {
    id: string;
    childId: string;
    date: string;
    notes: string;
}

export interface MockAlert {
    id: number;
    message: string;
    type: 'destructive' | 'default';
}

export interface Community {
    name: string;
    lat: number;
    lng: number;
    children: number;
}


export const mockAlerts: MockAlert[] = [
    { id: 1, message: "Attendance missing for Session S002", type: 'destructive' },
    { id: 2, message: "Endline assessment due for Sneha Rao", type: 'default' },
];

export const mockChildren: Child[] = [
  {
    id: 'CH001',
    name: 'Aarav Kumar',
    gender: 'Male',
    age: 12,
    community: 'VV Puram',
    school: 'Viveka School',
  },
  {
    id: 'CH002',
    name: 'Sneha Rao',
    gender: 'Female',
    age: 13,
    community: 'Lalithadripura',
    school: 'Vivekananda High',
  },
   {
    id: 'CH003',
    name: 'Rohan Patel',
    gender: 'Male',
    age: 11,
    community: 'VV Puram',
    school: 'Viveka School',
  },
];

export const mockSessions: Session[] = [
  {
    id: 'S001',
    date: '2025-10-20T10:00:00Z',
    community: 'VV Puram',
    coach: 'Coach Ramesh',
    participants: ['CH001', 'CH003'],
    status: 'completed',
  },
  {
    id: 'S002',
    date: '2025-10-22T10:00:00Z',
    community: 'Lalithadripura',
    coach: 'Coach Priya',
    participants: ['CH002'],
    status: 'completed',
  },
  {
    id: 'S003',
    date: '2025-10-27T10:00:00Z',
    community: 'VV Puram',
    coach: 'Coach Ramesh',
    participants: [],
    status: 'upcoming',
  },
    {
    id: 'S004',
    date: '2025-10-29T10:00:00Z',
    community: 'Lalithadripura',
    coach: 'Coach Priya',
    participants: [],
    status: 'upcoming',
  },
];

export const mockAssessments: Assessment[] = [
  {
    childId: 'CH001',
    date: '2025-09-10T10:00:00Z',
    type: 'Baseline',
    score: { teamwork: 7, confidence: 8, communication: 6 },
  },
  {
    childId: 'CH001',
    date: '2025-10-18T10:00:00Z',
    type: 'Endline',
    score: { teamwork: 8, confidence: 9, communication: 7 },
  },
  {
    childId: 'CH002',
    date: '2025-09-11T10:00:00Z',
    type: 'Baseline',
    score: { teamwork: 6, confidence: 7, communication: 8 },
  },
];

export const mockHomeVisits: HomeVisit[] = [
    {
        id: 'HV001',
        childId: 'CH001',
        date: '2025-10-15T10:00:00Z',
        notes: 'Discussed progress with Aarav and his parents. They are very happy with his development in the program. He is showing more confidence at home as well.'
    },
    {
        id: 'HV002',
        childId: 'CH002',
        date: '2025-10-16T10:00:00Z',
        notes: 'Initial home visit. Sneha is excited to participate. Parents are supportive and keen to see her develop new skills.'
    }
]


export const users: User[] = [
  { id: 1, name: 'Admin User', email: 'admin@yultimate.com', role: 'Admin' },
  { id: 2, name: 'Organizer User', email: 'organizer@yultimate.com', role: 'Organizer' },
  { id: 3, name: 'Participant User', email: 'participant@yultimate.com', role: 'Participant' },
  { id: 4, name: 'Jane Doe', email: 'jane@example.com', role: 'Participant' },
  { id: 5, name: 'John Smith', email: 'john@example.com', role: 'Participant' },
  { id: 6, name: 'Alice Johnson', email: 'alice@example.com', role: 'Organizer' },
];

export const organizations: Organization[] = [
    { id: 1, name: 'Y-Ultimate Sports', organizers: [2, 6] },
    { id: 2, name: 'Community Frisbee League', organizers: [6] },
];

export const venues: Venue[] = [
  { id: 1, name: 'City Park Fields', location: '123 Park Ave, Cityville', coordinates: { lat: 40.7128, lng: -74.0060 } },
  { id: 2, name: 'University Stadium', location: '456 University Dr, Townsville', coordinates: { lat: 34.0522, lng: -118.2437 } },
  { id: 3, name: 'Beachfront Arena', location: '789 Ocean Blvd, Beachtown', coordinates: { lat: 33.7701, lng: -118.1937 } },
];

export const events: Event[] = [
  {
    id: 1,
    name: 'Summer Breeze Tournament',
    date: '2024-07-20T09:00:00Z',
    description: 'Annual summer ultimate frisbee tournament. All levels welcome.',
    venueId: 1,
    organizationId: 1,
    type: 'Tournament',
    participants: [3, 4, 5],
    winners: {
        first: 'John Smith',
        second: 'Jane Doe',
        third: 'Participant User',
    }
  },
  {
    id: 2,
    name: 'Advanced Throws Workshop',
    date: '2024-08-05T14:00:00Z',
    description: 'Learn advanced throwing techniques from pro players.',
    venueId: 2,
    organizationId: 1,
    type: 'Workshop',
    participants: [3, 5],
  },
  {
    id: 3,
    name: 'Weekly Pickup Game',
    date: '2024-07-25T18:00:00Z',
    description: 'Casual pickup games for the community.',
    venueId: 1,
    organizationId: 2,
    type: 'Meetup',
    participants: [3, 4, 5],
  },
  {
    id: 4,
    name: 'Beach Ultimate Championship',
    date: '2024-09-10T10:00:00Z',
    description: 'The final championship on the sunny beaches.',
    venueId: 3,
    organizationId: 2,
    type: 'Tournament',
    participants: [4, 5],
  },
];

export const coachingCenters: CoachingCenter[] = [
    { id: 1, name: 'Ultimate Performance Academy', specialty: 'Advanced Skills', location: 'Cityville', participants: [3], coordinates: { lat: 40.7328, lng: -74.0160 } },
    { id: 2, name: 'Frisbee Fundamentals', specialty: 'Beginner Training', location: 'Townsville', participants: [], coordinates: { lat: 34.0622, lng: -118.2537 } },
    { id: 3, name: 'Beach Ultimate Coaching', specialty: 'Beach Tactics', location: 'Beachtown', participants: [4,5], coordinates: { lat: 33.7901, lng: -118.2037 } },
];

export const mockCommunities: Community[] = [
    { name: 'VV Puram', lat: 12.2958, lng: 76.6394, children: 30 },
    { name: 'Lalithadripura', lat: 12.2710, lng: 76.6930, children: 22 },
];
