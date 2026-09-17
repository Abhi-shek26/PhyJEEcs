
# PhyJEEcs (live link - https://phyjeecs.vercel.app/)

PhyJEEcs is a web application designed to help JEE aspirants practice Physics questions chapter-wise, track their progress, and enhance their problem-solving skills. It offers a structured and user-friendly interface to attempt questions of varying difficulty levels, view attempt history, and monitor chapter-wise performance.

## 💻Tech Stack
### Frontend
- React.js (Frontend Framework)

- React Router DOM (Routing)

- Context API (State Management)

- Custom Hooks (Reusable Logic)

- React Icons (Icon Library)

### Backend
- Node.js (Runtime)

- Express.js (Server Framework)

- MongoDB (Database)

- Cloudinary (Image Storage for Question Images)

- REST APIs (Communication between Frontend & Backend)

## ⚙️ Current Functionalities

✅ User Authentication (Login/Signup/Logout, JWT + RBAC)

✅ Chapter-wise Progress Tracking 

✅ Search Questions by Code, Chapter, Level (JM/JA), Type + Difficulty

✅ Attempt Questions (SCQ, MCQ, Numerical with grading engine)

✅ View Attempt History (Correct/Incorrect, Time Taken, Correct Answer)

✅ Insights Dashboard — accuracy KPIs, 14-day trend, chapter/type/difficulty charts, weakest-topics table, CSV export

✅ Product metrics — activation / power-user / active-days funnel, cohort by Class (11/12/Dropper), bookmarks + 1–5 question feedback

✅ AI recommendations — weakest-chapter-first queue + spaced repetition of incorrect attempts + step-by-step solution/explain endpoint

✅ Production hardening — helmet, rate limiting (stricter on auth), paginated APIs, answer hiding, health check

## 🔌 Key APIs

```
GET  /api/health
GET  /api/questions?page&limit&difficulty&includeAnswers=
POST /api/attempt
GET  /api/attempts?page&limit
GET  /api/analytics/summary | /funnel | /recommendations | /export.csv
GET+POST /api/bookmarks        POST /api/feedback
GET  /api/explain/:id          PATCH /api/questions/:id/solution (admin)
```

Backend env: `MONGO_URI PORT SECRET CORS_ORIGIN CLOUDINARY_CLOUD_NAME CLOUDINARY_API_KEY CLOUDINARY_API_SECRET`.
Frontend env: `VITE_API_URL`.

## 📸 Screenshots

| Page | Preview |
| :-- | :-- |
| **Landing Page** | ![Landing Page](https://github.com/Abhi-shek26/PhyJEEcs/blob/main/screenshots/LandingPage.png?raw=true) |
| **MCQ Attempt Page** | ![MCQ Attempt](https://github.com/Abhi-shek26/PhyJEEcs/blob/main/screenshots/MCQAttempt.png?raw=true) |
| **Numerical Attempt Page** | ![Numerical Attempt](https://github.com/Abhi-shek26/PhyJEEcs/blob/main/screenshots/NumericalAttempt.png?raw=true) |
| **Dashboard** | ![Dashboard](https://github.com/Abhi-shek26/PhyJEEcs/blob/main/screenshots/dashboard.png?raw=true) |
| **Profile Page** | ![Profile](https://github.com/Abhi-shek26/PhyJEEcs/blob/main/screenshots/profile.png?raw=true) |
| **Filter/Search Page** | ![Filter](https://github.com/Abhi-shek26/PhyJEEcs/blob/main/screenshots/filter.png?raw=true) |
| **Attempt History Page** | ![Attempt History](https://github.com/Abhi-shek26/PhyJEEcs/blob/main/screenshots/AttemptHistory.png?raw=true) |
| **Already Attempted Page** | ![Already Attempted](https://github.com/Abhi-shek26/PhyJEEcs/blob/main/screenshots/AlreadyAttempted.png?raw=true) |

---

## 🚫 Error Pages

<p align="center">
  <img src="https://github.com/Abhi-shek26/PhyJEEcs/blob/main/screenshots/loginError.png?raw=true" width="300" />
  <img src="https://github.com/Abhi-shek26/PhyJEEcs/blob/main/screenshots/signupError1.png?raw=true" width="300" />
  <img src="https://github.com/Abhi-shek26/PhyJEEcs/blob/main/screenshots/signupError2.png?raw=true" width="300" />
  <img src="https://github.com/Abhi-shek26/PhyJEEcs/blob/main/screenshots/signupError3.png?raw=true" width="300" />
</p>


## 🎯Upcoming Features (To-Do)
📌 Add more high-quality Physics questions to the database

📌 Implement Bookmark Questions functionality

📌 Implement Feedback System for users 

📌 Add Forgot Password and Email Verification features

📌 Build a Solutions Window for detailed explanations

📌 Create a Discussion Forum for peer learning



### 📊 Why This Project?
- #### For Students: 
Provides a focused platform for practicing JEE Physics questions.

- #### For Developers: 
Demonstrates full-stack web development skills with a structured, scalable architecture.

- #### For Recruiters: 
Showcases proficiency in React.js, Node.js, Express.js, MongoDB, Cloudinary, and REST APIs with a clean, maintainable codebase.


