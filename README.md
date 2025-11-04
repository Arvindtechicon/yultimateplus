
# Y-Ultimate Pulse

### Connecting Students, Events & Innovation

Y-Ultimate Pulse is a comprehensive platform designed to manage sports events, coaching programs, and participant progress, with a primary focus on Ultimate Frisbee communities. It provides distinct experiences for different user roles, including Admins, Organizers, Coaches, and Participants, each with a dashboard and tools tailored to their needs.

![Y-Ultimate Pulse Dashboard](https://yultimateplus.vercel.app/)

---

## Key Features

- **Role-Based Access Control (RBAC):** Separate, permission-driven experiences for Admins, Organizers, Coaches, and Participants.
- **Event Management:** Organizers can create, edit, and manage events. Participants can register and view event details.
- **Coaching Center Management:** Admins and Organizers can create coaching centers, which Participants can enroll in.
- **Interactive Dashboards:** Each role gets a unique dashboard with relevant statistics, charts, and quick actions.
- **Participant Progress Tracking:** Coaches and Participants can track progress through LSAS assessments, attendance records, and home visit logs.
- **Interactive Map:** Uses Google Maps to display event venues and coaching centers, with support for directions.
- **QR Code Check-in:** A simple system for event and session check-ins using QR codes.
- **Photo Gallery:** Organizers can create photo albums for past events.

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Authentication:** [Firebase Authentication](https://firebase.google.com/docs/auth)
- **Database:** [Cloud Firestore](https://firebase.google.com/docs/firestore)
- **UI Library:** [React](https://react.dev/)
- **Component Library:** [ShadCN UI](https://ui.shadcn.com/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animation:** [Framer Motion](https://www.framer.com/motion/)
- **Charting:** [Recharts](https://recharts.org/)
- **Form Management:** [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- [Node.js](https://nodejs.org/en/) (v18 or later recommended)
- `npm` or `yarn`

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/y-ultimate-pulse.git
    cd y-ultimate-pulse
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up Environment Variables:**

    This project requires API keys for Firebase and Google Maps.

    -   Create a file named `.env.local` in the root of your project.
    -   Add the following variables to it:

    ```env
    # Your Google Maps API Key
    NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=Your_API_Key_Here
    ```

4.  **Configure Firebase:**

    The project is pre-configured with a placeholder Firebase project. To use your own, follow these steps:
    - Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project.
    - In your project settings, create a new "Web App".
    - Firebase will provide you with a configuration object. Copy this object.
    - Open the file `src/firebase/config.ts` and replace the existing `firebaseConfig` object with the one from your project.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) (or the port specified in your terminal) with your browser to see the result.

---

## Supporting Documents

For a more detailed explanation of the project's architecture, features, and functionality, please refer to the [**Project Overview**](./docs/PROJECT_OVERVIEW.md) document.
