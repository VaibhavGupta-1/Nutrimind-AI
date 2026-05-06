# 🥗 NutriMind AI

**NutriMind AI** is a production-grade, AI-powered nutritional intelligence platform designed to help users understand their eating habits through visual recognition and contextual health insights. 

Built with **Next.js 15**, **TypeScript**, and **Gemini 2.0 Flash**, it transforms a simple photo of a meal into a detailed nutritional breakdown, complete with health scoring and personalized recommendations.

---

## ✨ Key Features

*   **📸 AI Vision Analysis:** Leverages Google's Gemini Vision AI to identify food items, estimate portion sizes, and calculate nutritional values from a single photo.
*   **📊 Health Dashboard:** Track daily intake with an aggregated health score, calorie tracking, and macronutrient (Protein, Carbs, Fat) visualization.
*   **📜 Meal History:** Persistent storage of your nutritional journey using Google Firestore, allowing you to reflect on past meals and improvements.
*   **⚡ Fallback Resilience:** Features a custom-built heuristic analysis engine to ensure the platform remains functional and responsive even during API outages.
*   **♿ Accessibility First:** Designed with a focus on inclusivity, featuring full ARIA support, keyboard navigation, semantic HTML, and high-contrast visuals.
- **🚀 Production Ready:** Fully containerized with Docker and optimized for deployment on Google Cloud Run.

---

## 🛠️ Technology Stack

*   **Frontend:** Next.js 15 (App Router), TypeScript, Tailwind CSS, Lucide React
*   **AI Engine:** Google Gemini 2.0 Flash (Server-side implementation)
*   **Backend:** Next.js API Routes (Serverless)
*   **Database:** Google Cloud Firestore
*   **Storage:** Firebase Storage (ready for image persistence)
*   **Deployment:** Docker, Google Cloud Run

---

## 🚀 Getting Started

### Prerequisites

*   Node.js 20+
*   Google Cloud Project (with Gemini API access)
*   Firebase Project (Firestore enabled)

### Local Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/VaibhavGupta-1/Nutrimind-AI.git
    cd Nutrimind-AI
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env.local` file in the root directory and add your credentials:
    ```env
    # Firebase (Public)
    NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
    NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
    NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
    NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
    
    # Gemini AI (Secret)
    GEMINI_API_KEY=your_gemini_api_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
    Open [http://localhost:3000](http://localhost:3000) to see the app.

---

## 🐳 Deployment (Google Cloud Run)

NutriMind AI is optimized for Google Cloud. To deploy:

1.  **Build and Push with Google Cloud Build:**
    ```bash
    gcloud builds submit --tag gcr.io/nutrimind-ai-vaibhav/nutrimind-ai
    ```

2.  **Deploy to Cloud Run:**
    ```bash
    gcloud run deploy nutrimind-ai \
      --image gcr.io/nutrimind-ai-vaibhav/nutrimind-ai \
      --platform managed \
      --region us-central1 \
      --allow-unauthenticated
    ```

---

## 🏗️ Architecture & Security

*   **Secure API Handling:** All Gemini AI calls are handled through a secure server-side API route (`/api/analyze`). This ensures your `GEMINI_API_KEY` is never exposed to the client browser.
*   **Standalone Build:** Uses Next.js `standalone` output for minimal Docker image size and faster deployment cycles.
*   **Validation:** Robust client-side and server-side validation for image types (JPG, PNG, WebP) and file size limits (5MB).

---

## ♿ Accessibility Statement

NutriMind AI is built for everyone. We have implemented:
- **ARIA Roles & Labels:** Comprehensive labelling for screen readers.
- **Focus States:** High-visibility focus rings for keyboard users.
- **Semantic HTML:** Correct usage of `main`, `section`, `nav`, and `time` elements.
- **Live Regions:** Real-time feedback for AI processing and success states.

---

## 📜 Future Roadmap

- [ ] **User Accounts:** Re-introducing Google Auth for private meal tracking.
- [ ] **Water Tracking:** Hydration metrics alongside nutritional data.
- [ ] **Goal Setting:** Personalized calorie and macro goals based on user profile.
- [ ] **Meal Persistence:** Saving the actual meal images to Firebase Storage.

---

## 📄 License

This project is licensed under the MIT License.

Created with ❤️ by the NutriMind AI Team.
