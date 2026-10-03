# CareerConnect — Frontend-Only React Job Portal

**CareerConnect** is a modern, responsive, and professional frontend-only job portal built with **React**, **Vite**, **React Router DOM**, **React Icons**, and **Pure CSS**.

---

## 🚀 Key Features

1. **Hero & Landing Page (`/`)**:
   - Hero search by keyword/title and location.
   - Interactive popular category exploration with custom icons.
   - Featured job listings with instant save/bookmark toggles.
   - Platform value propositions ("Why CareerConnect?").
   - Call to action banners and statistics counter strip.

2. **Job Discovery & Search (`/jobs`)**:
   - Real-time client-side keyword search (matches titles, companies, skills, descriptions).
   - Multi-facet filters: Category, Job Type (Full Time, Part Time, Remote, Internship), and Experience level.
   - Dynamic results counter and "Clear Filters" reset capability.
   - Clean empty-state handling.

3. **Job Details Page (`/jobs/:id`)**:
   - In-depth job specifications: Company overview, responsibilities, required skills chips, salary, and job type.
   - **Apply Now** action with duplicate application prevention and instant feedback.
   - **Save Job** toggle directly synchronized with `localStorage`.
   - "Job Not Found" graceful fallback for invalid routes.

4. **Candidate Dashboard (`/dashboard`)**:
   - Personalized welcome banner.
   - Live metric cards: Applied Jobs, Saved Jobs, Under Review, and Shortlisted.
   - Recent applications summary table with status badges.
   - Quick action shortcuts to explore jobs, view bookmarks, and edit profile.

5. **Application Tracker (`/applications`)**:
   - Filter tabs by application status: All, Applied, Under Review, Shortlisted, Rejected.
   - Details of applied jobs with submission date, company, and location.
   - Capability to withdraw/remove applications.

6. **Saved Jobs / Bookmarks (`/saved-jobs`)**:
   - Dedicated dashboard of all bookmarked opportunities.
   - Quick "View & Apply" or "Remove" actions.
   - Empty state guidance with direct link to browse jobs.

7. **Candidate Profile & Resume (`/profile`)**:
   - Profile avatar, contact details, headline, and bio.
   - Technical skills tag cloud with add/delete capability.
   - Work experience and education timeline cards.
   - Simulated resume document preview and upload.
   - Interactive edit profile modal with localStorage persistence.

8. **Authentication Demo UI (`/login` & `/register`)**:
   - Clean forms with comprehensive client-side validation (email regex, password length, password matching, required checkboxes).
   - Clear college frontend demo indicators and simulated session persistence.

---

## 🛠️ Technology Stack

- **Framework**: React 18
- **Bundler & Dev Server**: Vite
- **Routing**: React Router DOM v6
- **Icons**: React Icons (`fa` suite)
- **Styling**: Pure Modern CSS (CSS custom variables, flexbox, responsive CSS grids, media queries)
- **Data & Persistence**: Local dummy dataset (`src/data/jobs.js`) + Browser `localStorage`

---

## 📁 Project Structure

```
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx          # Header navigation with responsive drawer & badges
│   │   ├── Footer.jsx          # Professional footer with links & social icons
│   │   ├── JobCard.jsx         # Reusable card with save & view actions
│   │   └── SearchBar.jsx       # Keyword and location search bar
│   ├── pages/
│   │   ├── Home.jsx            # Landing page
│   │   ├── Jobs.jsx            # Job search and multi-facet filtering
│   │   ├── JobDetails.jsx      # Job details and apply submission
│   │   ├── Login.jsx           # Frontend login UI with validation
│   │   ├── Register.jsx        # Frontend registration UI with validation
│   │   ├── Dashboard.jsx       # Candidate dashboard & metrics
│   │   ├── Profile.jsx         # Candidate profile & resume management
│   │   ├── SavedJobs.jsx       # Bookmarked jobs listing
│   │   └── Applications.jsx    # Application tracker with status tabs
│   ├── data/
│   │   └── jobs.js             # Static dataset with 12+ realistic listings
│   ├── App.jsx                 # Route definitions & scroll restoration
│   ├── main.jsx                # React root rendering
│   └── index.css               # Complete responsive CSS design system
├── index.html                  # HTML entry point
├── package.json
└── vite.config.js
```

---

## 💻 How to Run

1. **Install dependencies** (if not already installed):
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

3. **Open in browser**:
   Visit `http://localhost:5173` (or the port displayed in your terminal).

4. **Create a production build**:
   ```bash
   npm run build
   ```

---

## 🎓 College Viva Guide & Discussion Points

- **Why is this a Frontend-Only project?**
  All job listings are stored in structured static JavaScript objects (`jobs.js`), and user interactions (saved bookmarks, submitted applications, candidate profile) are persisted across browser reloads using the browser's native `localStorage` API and dispatched window events.
- **How does state management work?**
  Standard React hooks (`useState`, `useEffect`, `useMemo`) are used alongside React Router hooks (`useParams`, `useSearchParams`, `useNavigate`, `useLocation`) for state synchronization without requiring bulky external state libraries like Redux.
- **How are duplicates prevented?**
  When applying to a job in `JobDetails.jsx`, the code inspects the `applications` array in `localStorage` by `jobId`. If a record already exists, it alerts the user and prevents duplicate entries.
