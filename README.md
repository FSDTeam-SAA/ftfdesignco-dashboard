## 🚀 Template Overview Website

A modern, scalable website built using **Next.js 14**, **TypeScript**, **Tailwind CSS**, **Shadcn UI**, **Lucide Icons**, **Zod**, **Axios**, **TanStack Query**, and **Sonner Toast** — with a clean architecture and modular folder structure.

---

## 🚀 Tech Stack

- **Framework:** [Next.js 16.0.7](https://nextjs.org/)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Shadcn/UI
- **Icons:** Lucide Icons
- **Form Validation:** Zod
- **Data Fetching:** Axios + TanStack Query
- **Notifications:** Sonner Toast
- **Linting & Commit Hooks:** ESLint, Husky, Commitlint, Lint-staged

---

---

## ⚙️ Setup & Installation

# 1️⃣ Clone the repository

git clone https://github.com/RashedulHaqueRasel1/Template-Overview-Website.git

# 2️⃣ Navigate to the project

cd Template-Overview-Website

# 3️⃣ Install dependencies

npm install

# 4️⃣ Run development server

npm run dev

Then open http://localhost:3000 in your browser.

🧩 Features
✨ Modern UI built with Tailwind + Shadcn

🔐 Authentication with NextAuth.js

⚡ API integration with Axios

🔍 Data fetching & caching using TanStack Query

🧠 Strong validation using Zod

💬 Beautiful toasts with Sonner

🧰 Modular, scalable folder structure

🔒 Husky pre-commit hook + Commitlint setup

📦 Scripts
Command Description
npm run dev Start development server
npm run build Create production build
npm run start Run production build
npm run lint Run ESLint
npm run format Prettify code (if configured)

🧪 Husky Setup (Pre-commit)
This project uses Husky and Lint-staged to enforce clean commits.

# Add a new hook

npx husky add .husky/pre-commit "npm run lint"
git add .husky/pre-commit

--

## 📚 Book Creation Flow

The book creation feature allows users to transform images into sketch coloring books with the following capabilities:

### Generation Limits (Security)

To prevent API exploitation, strict generation limits are enforced:

| Feature                        | Limit | Behavior                                             |
| ------------------------------ | ----- | ---------------------------------------------------- |
| Cover Image Generation         | 3 max | Cannot be reset; persists in localStorage            |
| Line Art Conversion (per page) | 3 max | Cannot be reset; persists even if images are deleted |

**Note:** Users receive toast notifications showing remaining generation attempts after each successful conversion.

### Mid-Flow Book Preview

Users can preview their book at any point during creation:

1. Click **"Preview Book"** button on the image upload page
2. View PDF preview of current progress (opens in new tab)
3. Click **"Return to Creation"** to resume exactly where they left off

State is preserved across preview navigation via the `returnStep` mechanism.

### State Management

All book creation state is managed via Zustand with localStorage persistence:

- Progress is automatically saved and restored
- Users can close the browser and resume later
- State includes: images, texts, generation counts, step position

### Post-Login Redirect

When login is required during book creation:

- User is redirected to `/login?callbackUrl=/create-book`
- After successful login, user returns to `/create-book`
- Book creation state is preserved via localStorage

### Key Files

| File                                | Purpose                                  |
| ----------------------------------- | ---------------------------------------- |
| `store/book-store.ts`               | Zustand store with all state and actions |
| `types.ts`                          | TypeScript interfaces and constants      |
| `components/image-upload-page.tsx`  | Page image upload and conversion         |
| `components/landing-page.tsx`       | Cover image upload                       |
| `components/finalize-book-page.tsx` | Book review and preview                  |
| `features/auth/component/Login.tsx` | Login with callbackUrl redirect          |

---

🧑‍💻 Author

Rashedul Haque Rasel

Built with ❤️ using Next.js, TypeScript, and Tailwind CSS.

📧 [rashedulhaquerasel1@gmail.com](rashedulhaquerasel1@gmail.com)
🌐 [Protfolio](https://rashedul-haque-rasel.vercel.app)
