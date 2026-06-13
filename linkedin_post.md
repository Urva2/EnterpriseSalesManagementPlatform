# LinkedIn Post Draft — TurfBook

---

## Post Text

We didn't start building **TurfBook** to launch a startup.

We started because we wanted to understand — *how are real products actually built?*

As students, we've done plenty of academic projects. But we wanted something different this time. We wanted to feel the real challenges — designing database schemas with 29+ tables, handling payments, building role-based access, managing real-time communication — the kind of things no tutorial truly teaches you.

So we picked a real problem: **Turf booking is still a mess of calls, messages, and manual coordination for most players and venue owners.**

And we started building. Through vibe coding — bouncing ideas, writing code, breaking things, fixing them, and learning at every step.

---

**Here's what we actually built:**

🏟️ A full-stack turf booking platform with three separate interfaces — one for Players, one for Turf Owners, and one for Admins.

✅ JWT Authentication + Google OAuth
✅ Real-time chat between players and owners (Socket.IO)
✅ Razorpay payment integration with webhook handling
✅ Role-Based Access Control (Player / Owner / Admin)
✅ Slot management with hold-before-pay mechanism
✅ Booking verification with unique verification codes
✅ Admin panel for turf verification before going live
✅ Tournament listing and management system
✅ OTP-based password recovery via email (Nodemailer)
✅ Image galleries, testimonials, and comment sections per turf
✅ Social sharing (WhatsApp, Facebook, Twitter, LinkedIn)
✅ Favourite turfs, player dashboard, and profile management
✅ Contact forms with email notifications
✅ A 29-table PostgreSQL database architecture

---

**But here's the honest part — what's still missing:**

🔲 Automated testing (unit + integration) — we know it matters, we're learning it
🔲 CI/CD pipeline for automated deployments
🔲 Proper rate limiting and security hardening at scale
🔲 Push notifications (email/SMS reminders for bookings)
🔲 Advanced analytics dashboard for turf owners
🔲 Mobile-responsive optimization (it works, but it can be better)
🔲 Caching layer (Redis) for performance at scale
🔲 Search and filtering with geolocation-based turf discovery
🔲 Reviews and rating system with moderation

---

We're not pretending this is production-ready. We know what's missing — and that's actually the point. **The goal was never perfection; it was understanding.**

Understanding how a real codebase grows. How payments flow. How roles and permissions shape an app. How real-time features work beyond a "Hello World" chat demo.

And we're still going. Every week we learn a new technology, pick up a missing feature, and ship an upgrade.

---

**Tech Stack:**

React + TypeScript + Vite
Node.js + Express
Supabase (PostgreSQL)
Socket.IO
Razorpay
JWT + Google OAuth
Nodemailer
Tailwind CSS + shadcn/ui

---

A huge thanks to my teammate **Ankit Jethava** for starting this journey together. From late-night debugging sessions to figuring out webhook flows — this project has been the best learning experience we could have asked for.

This is Version 1. We're just getting started.

🌐 bookmyturf.xyz

---

#TurfBook #BuildInPublic #LearningByBuilding #VibeCoding #FullStackDevelopment #ReactJS #NodeJS #Supabase #PostgreSQL #WebDevelopment #StartupJourney #SoftwareEngineering #SportsTech

---

> [!TIP]
> **Posting Tips:**
> - Add 3–4 screenshots of the platform (homepage, booking flow, dashboard, admin panel)
> - Tag Ankit Jethava in the post
> - Post on a weekday morning (Tue–Thu, 8–10 AM IST) for maximum reach
> - Engage with early comments within the first hour to boost visibility
