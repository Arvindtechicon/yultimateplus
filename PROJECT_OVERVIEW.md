
# Y-Ultimate Pulse: Project Overview

This document provides a detailed explanation of the features, architecture, and functionality of the Y-Ultimate Pulse application.

## 1. Core Technologies

The application is built on a modern, React-based technology stack:

- **Framework:** Next.js (App Router)
- **Language:** TypeScript
- **UI Library:** React
- **Component Library:** ShadCN UI
- **Styling:** Tailwind CSS
- **Animation:** Framer Motion
- **State Management:** React Context API (for both authentication and application data)
- **Mapping:** Google Maps API via `@react-google-maps/api`
- **Charting:** Recharts

## 2. Key Features & Functionality

### Authentication & Authorization

The application features a role-based access control (RBAC) system that defines what each user can see and do.

**Roles:**
- **Admin:** Has full access to all features, including user and organization management.
- **Organizer:** Can create and manage their own events and see related data.
- **Coach:** Manages community sessions, tracks child attendance, logs home visits, and views assessments.
- **Participant:** Can register for events and coaching centers, and view their personal progress.

**How it Works:**
1.  **`AuthContext` (`src/context/AuthContext.tsx`):** This is the heart of the authentication system.
    - When a user logs in, the `login` function finds a mock user with the selected role and saves the entire user object to the browser's `localStorage`.
    - On application load, the `AuthProvider` checks `localStorage` for a saved user. If one exists, the user is considered logged in.
    - The `useAuth()` hook provides access to the current `user` object, `loading` state, and `login`/`logout` functions throughout the app.
2.  **Registration (`src/app/register/...`):**
    - Each role has a dedicated registration page and form (`ParticipantRegistrationForm`, `OrganizerRegistrationForm`, `CoachRegistrationForm`).
    - When a user fills out a registration form, a new user object is created. This new user is added to the global application state via `AppContext` and simultaneously logged in using the `loginFromRegistration` function in `AuthContext`.
3.  **Protected Routes & UI:**
    - The `DashboardLayout` component and individual page components use the `useAuth()` hook to check the user's role.
    - Based on the `user.role`, navigation links in the `Sidebar` are dynamically rendered, and specific UI elements (like "Add Event" buttons) are shown or hidden. Pages that require a specific role will show an access-denied message if the user's role does not match.

### Data Management

The application simulates a backend database using a combination of React Context and browser `localStorage`.

**How it Works:**
1.  **`AppContext` (`src/context/EventContext.tsx`):** This provider acts as a centralized, client-side "database".
    - It initializes its state (events, users, coaching centers, etc.) from two sources:
        1.  Initial data from `src/lib/mockData.ts`.
        2.  Updated data saved in `localStorage`. If data exists in `localStorage`, it overrides the initial mock data.
    - It uses `useState` for each data type (e.g., `useState<Event[]>`).
    - A `useEffect` hook is set up for each state variable to automatically save any changes back to `localStorage`. This ensures data persists across page reloads.
    - It exposes functions to modify the data (e.g., `addEvent`, `toggleEventRegistration`, `updateEventResults`). These functions update the state, which then triggers the `useEffect` to save the changes.
2.  **`mockData.ts` (`src/lib/mockData.ts`):** This file contains the initial, "seed" data for the entire application. It defines the structure (interfaces) and default records for users, events, venues, and more.

### Interactive Map System

The map feature allows users to see the locations of event venues and coaching centers and get directions.

**How it Works:**
1.  **`MapComponent` (`src/components/MapComponent.tsx`):** This is the main component for the map page.
    - It uses the `@react-google-maps/api` library to render a Google Map.
    - Your Google Maps API key is loaded from the environment variable `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.
    - **Points of Interest (POIs):** It combines `venues` and `coachingCenters` from `AppContext` into a single `pointsOfInterest` array.
    - **Markers:** It loops through the POIs and places a custom-colored `Marker` on the map for each one. Venues are red, and coaching centers are teal.
    - **Interactivity:**
        - Clicking a POI on the list or a marker on the map sets it as the `selectedPoi`. This centers the map on that point and opens an `InfoWindow` with its name and description.
        - A user can enter their starting location into an input field. Clicking "Go" uses the `google.maps.DirectionsService` to calculate the route from their location to the `selectedPoi` and displays it on the map using `DirectionsRenderer`.
    - **Theming:** The map component detects whether the app is in light or dark mode and applies a corresponding map style for better visual integration.

### Dashboards

Each user role has a unique dashboard tailored to their specific needs.

- **Admin Dashboard (`src/components/dashboard/AdminDashboard.tsx`):** Provides a high-level overview of the entire platform, including system-wide statistics, community metrics, user lists, and report generation.
- **Organizer Dashboard (`src/components/dashboard/OrganizerDashboard.tsx`):** Focuses on event management. It shows stats for the organizer's events, a list of those events, and provides actions to add or edit them.
- **Coach Dashboard (`src/components/dashboard/CoachDashboard.tsx`):** Centers on community and child development. It displays attendance metrics, upcoming sessions, and provides quick actions to mark attendance or log home visits.
- **Participant Dashboard (`src/components/dashboard/ParticipantDashboard.tsx`):** Gives the participant a summary of their own journey, including sessions attended, assessment results (visualized with radar and bar charts), and upcoming registered events with their QR codes.

### Other Key Components

- **`EventCard.tsx`:** A reusable card that displays event details. It contains complex logic to show different buttons (Register, Unregister, Show QR, Edit, Manage Results) based on the user's role and whether the event is in the past or future.
- **Forms:** All forms (registration, adding events, submitting results, etc.) are built using `react-hook-form` for state management and `zod` for validation, ensuring a robust and user-friendly data entry experience.
- **`Sidebar.tsx`:** Dynamically generates navigation links based on the logged-in user's role, ensuring users only see links to pages they are authorized to access.
