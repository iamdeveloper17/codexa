<div align="center">

# ⚡ Codexa

### AI-Powered Design to Code Generator

Turn your ideas into production-ready React code in seconds. Live preview, save projects, and ship faster.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com)
[![GSAP](https://img.shields.io/badge/GSAP-3.15-88ce02?style=for-the-badge&logo=greensock)](https://gsap.com)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)](LICENSE)

[**Live Demo**](https://codexa-iamdeveloper17.vercel.app) · [**Report Bug**](https://github.com/iamdeveloper17/codexa/issues) · [**Request Feature**](https://github.com/iamdeveloper17/codexa/issues)

</div>

---

## 📸 Screenshots

<div align="center">

### 🎨 Hero Section with GSAP Animations
![Hero](public/screenshots/hero.png)

### 💻 Live Preview with Sandpack
![Preview](public/screenshots/preview.png)

### 🔐 Authentication
![Auth](public/screenshots/auth.png)

</div>

---

## ✨ Features

- 🎨 **GSAP-Powered Animations** — Cinematic hero reveal with SplitText, ScrollTrigger sections, and Lenis smooth scroll
- 🤖 **AI Code Generation** — Streaming React + Tailwind code using OpenRouter (Llama 3.3 70B)
- 💻 **Live Preview** — Real-time rendering with Sandpack in-browser sandbox
- 🔐 **Authentication** — Secure email/password auth with Supabase + Row Level Security
- 💾 **Save Projects** — Database-backed project history with one-click load
- 📋 **Copy to Clipboard** — One-click copy of generated code
- 🎯 **Preview / Code Toggle** — Switch between rendered output and source code
- 📱 **Fully Responsive** — Mobile-first design with Tailwind
- 🌙 **Dark Theme** — Premium black + purple aesthetic
- ⚡ **Blazing Fast** — Next.js 16 with Turbopack

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **Animations** | GSAP, ScrollTrigger, SplitText, Lenis |
| **AI** | OpenRouter (Llama 3.3 70B Instruct) |
| **AI SDK** | Vercel AI SDK |
| **Live Preview** | Sandpack (CodeSandbox) |
| **Auth & DB** | Supabase (PostgreSQL + RLS) |
| **Deployment** | Vercel |
| **Package Manager** | pnpm |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 20+ ([download](https://nodejs.org))
- **pnpm** (`npm install -g pnpm`)
- **OpenRouter API key** ([get free](https://openrouter.ai))
- **Supabase account** ([free tier](https://supabase.com))

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/iamdeveloper17/codexa.git
   cd codexa
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Set up environment variables:**

   Create `.env.local` in the root directory:

   ```bash
   OPENROUTER_API_KEY=sk-or-v1-...
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
   ```

4. **Set up Supabase database:**

   Run this SQL in your Supabase SQL Editor:

   ```sql
   create table public.projects (
     id uuid default gen_random_uuid() primary key,
     user_id uuid references auth.users(id) on delete cascade not null,
     prompt text not null,
     code text not null,
     created_at timestamp with time zone default timezone('utc'::text, now()) not null
   );

   alter table public.projects enable row level security;

   create policy "Users can view own projects"
     on public.projects for select using (auth.uid() = user_id);
   create policy "Users can insert own projects"
     on public.projects for insert with check (auth.uid() = user_id);
   create policy "Users can update own projects"
     on public.projects for update using (auth.uid() = user_id);
   create policy "Users can delete own projects"
     on public.projects for delete using (auth.uid() = user_id);
   ```

5. **Run the development server:**

   ```bash
   pnpm dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)**

---

## 📁 Project Structure

```
codexa/
├── src/
│   ├── app/
│   │   ├── api/generate/route.ts     # AI code generation API
│   │   ├── login/page.tsx             # Login page
│   │   ├── signup/page.tsx            # Signup page
│   │   ├── layout.tsx                 # Root layout + SmoothScroll
│   │   └── page.tsx                   # Landing page
│   ├── components/
│   │   └── landing/
│   │       ├── Hero.tsx               # Main hero + AI generation
│   │       ├── Features.tsx           # GSAP ScrollTrigger features
│   │       ├── HowItWorks.tsx         # 3-step process section
│   │       ├── CTA.tsx                # Call to action
│   │       ├── CodePreview.tsx        # Sandpack live preview
│   │       ├── ProjectsSidebar.tsx    # Saved projects sidebar
│   │       └── SmoothScroll.tsx       # Lenis smooth scroll
│   ├── lib/
│   │   ├── supabase/client.ts         # Browser Supabase client
│   │   ├── supabase/server.ts         # Server Supabase client
│   │   ├── storage.ts                 # Project save/load helpers
│   │   ├── ai.ts                      # AI client config
│   │   └── utils.ts                   # Utility functions
│   └── middleware.ts                  # Auth route protection
└── public/
```

---

## 🎬 GSAP Animations

Codexa uses GSAP for cinematic scroll-based animations:

- **SplitText** — Hero title letter-by-letter reveal
- **Timeline** — Sequenced entrance animations (title → subtitle → CTA)
- **ScrollTrigger** — Features, How It Works, and CTA sections animate on scroll
- **Scrub** — Scroll-linked animations for premium feel
- **Lenis** — Butter-smooth scrolling synced with GSAP ticker

---

## 🔐 Security

- **Row Level Security (RLS)** — Users can only access their own projects
- **Supabase Auth** — Secure email/password authentication
- **Middleware Protection** — All routes except `/login` and `/signup` require auth
- **Environment Variables** — All secrets stored in `.env.local` (never committed)

---

## 🌐 Deployment

### Deploy on Vercel (Recommended)

1. Push code to GitHub
2. Import project at [vercel.com/new](https://vercel.com/new)
3. Add environment variables:
   - `OPENROUTER_API_KEY`
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy 🚀

### Supabase URL Configuration

After deploy, add your Vercel URL to Supabase:

- Dashboard → **Authentication** → **URL Configuration**
- **Site URL:** `https://your-app.vercel.app`
- **Redirect URLs:** `https://your-app.vercel.app/**`

---

## 🗺️ Roadmap

- [x] AI code generation with streaming
- [x] GSAP hero + scroll animations
- [x] Live preview with Sandpack
- [x] Project save/load with Supabase
- [x] Email/password authentication
- [x] Password show/hide toggle
- [ ] OAuth (Google, GitHub)
- [ ] Code syntax highlighting with Shiki
- [ ] Export project as ZIP
- [ ] Share generated code via link
- [ ] Custom AI model selection
- [ ] Dark/light theme toggle

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Amit Kumar** ([@iamdeveloper17](https://github.com/iamdeveloper17))

- GitHub: [github.com/iamdeveloper17](https://github.com/iamdeveloper17)
- Project Link: [github.com/iamdeveloper17/codexa](https://github.com/iamdeveloper17/codexa)

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) — The React framework
- [GSAP](https://gsap.com) — Professional-grade animations
- [Sandpack](https://sandpack.codesandbox.io) — In-browser code preview
- [Supabase](https://supabase.com) — Open source Firebase alternative
- [OpenRouter](https://openrouter.ai) — Unified AI API
- [Vercel](https://vercel.com) — Deployment platform

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by [Amit Kumar](https://github.com/iamdeveloper17)

</div>