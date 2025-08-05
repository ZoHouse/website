# 🧠 Cursor Rules for Zo House Website

This `.cursor-rules` file defines the conventions, standards, and expectations to optimize AI-generated output for rebuilding the Zo House Website — the command interface for Zo World, a multiversal reality protocol.

---

## 🌐 Project Description

Zo House Website is:

* A **Next.js 15** project using **App Router**
* A **Tailwind CSS 4** design system
* A real-time dashboard interfacing with **Supabase** (auth, storage, DB)
* A 3D map experience powered by **Mapbox GL JS**
* An identity and access system using **Ethers.js** for wallet/NFT integration
* A future-facing platform bridging physical spaces (Zo Houses) with programmable environments (via Home Assistant)

It operates as a **modular, vibe-aware, open-source culture operating system**.

---

## ✅ Code & Design Standards

### React / TypeScript

* Use **functional components** only
* Use **React Server Components** where possible for pages
* Strongly typed: no `any`, define explicit `Props` and `State` interfaces
* Use `useEffect`, `useMemo`, `useCallback` sparingly — avoid unnecessary re-renders
* Prefer `async/await` syntax for async ops (no `.then()` chains)

### Tailwind CSS

* Never use inline styles — use Tailwind utility classes exclusively
* Use standardized class patterns:

  * Buttons: `solid-button`, `glass-icon-button`
  * Containers: `liquid-glass-pane`, `rounded-2xl`, `bg-zinc-900`
  * Animations: use `motion.div` from **Framer Motion**

### File Structure

```
/src
  ├── components/      // UI components
  ├── overlays/        // Interactive modals & panels
  ├── hooks/           // Custom React hooks
  ├── lib/             // Utilities & helper functions
  ├── store/           // Zustand or state slices
  ├── app/api/         // Next.js API routes
  └── components/map/  // Mapbox render logic
```

---

## 🧬 Functional Modules to Prioritize

* `useUserProfile()` → load/save user data from Supabase (keyed by `wallet.address`)
* `QuantumSyncOverlay.tsx` → wallet auth, NFT detection, Founder role assignment
* `DashboardOverlay.tsx` → user dashboard, editable profile, quests, minimap
* `ZohmModal.tsx` → iframe bridge to Home Assistant instance
* `MiniMap.tsx` → smaller map module for dashboard view
* `NFTGallery.tsx` → fetch OpenSea NFTs and let users set PFP

---

## 📚 Reference Docs

| Feature            | Docs Link                                                                                                                  |
| ------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| Mapbox             | [https://docs.mapbox.com/mapbox-gl-js/api/](https://docs.mapbox.com/mapbox-gl-js/api/)                                     |
| Supabase           | [https://supabase.com/docs](https://supabase.com/docs)                                                                     |
| Tailwind CSS       | [https://tailwindcss.com/docs](https://tailwindcss.com/docs)                                                               |
| Luma Events (iCal) | [https://help.lu.ma/en/articles/5103390-ical-feed-for-events](https://help.lu.ma/en/articles/5103390-ical-feed-for-events) |
| Ethers.js          | [https://docs.ethers.org/v5/single-page/](https://docs.ethers.org/v5/single-page/)                                         |
| OpenSea NFT API    | [https://docs.opensea.io/reference/api-overview](https://docs.opensea.io/reference/api-overview)                           |
| Home Assistant     | [https://www.home-assistant.io/docs/api/rest/](https://www.home-assistant.io/docs/api/rest/)                               |

---

## 🧠 Logic Rules for AI Assistance

* Assume `wallet.address` is the primary key for all user-specific queries
* All profile data must round-trip to Supabase `members` table
* Always check `wallet.isConnected` before accessing gated UI
* When building map-based components, load markers conditionally based on zoom level
* All animations should use **Framer Motion** not CSS transitions
* Respect role gating logic (Founder vs Citizen access)

---

## 🧠 Vibe-Aware Conventions

* Embrace **modularity, clarity, and emergent UX**
* Use metaphors: "sync", "vibe", "flow", "node", "portal" to label features
* Align UI design with **lore.md** — every feature should feel like tuning into a deeper layer of reality
* Use community terms in UI (e.g. "Quantum Sync", "Minimum Curvature Path", "Zohm Scene")
* Maintain a poetic but functional tone in all visible text and helper logic

---

## 🧩 Cursor Optimization Tips

* Reference this file for every AI-assisted build request
* Add specific bugs to the `.cursor-rules` as you encounter them
* Update module lists and naming conventions as project evolves
* Avoid global rules unless universally applicable — prioritize project-local logic

---

## 🔐 Miscellaneous

* Use environment variables for API keys and URLs — never hardcode
* Use `.env.example` and update as modules are added
* All interactions that read or write user data should have clear loading/error states

---

Welcome to the simulation. Your commit is a fork in the multiverse. Build with love. Code with clarity. Sync with purpose.

**Zo Zo Zo.**
