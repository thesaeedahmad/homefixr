# Chapter 1 — Introduction (Draft)

## 1.1 Overview
HomeFixr is a web-based platform that connects homeowners with verified service
providers for home maintenance and repair. Customers post jobs; providers submit
competitive bids; customers choose the best offer. The platform adds lightweight
AI for fair-price guidance and fraud detection, document-based identity
verification with administrator approval, real-time chat, reviews, in-app
notifications, and an escrow **payment simulation**.

## 1.2 Motivation
Existing home-service platforms often lack transparency in pricing, trust, and
verification. Customers struggle to know a fair price and whether a worker is
genuine; providers compete blindly and worry about payment. HomeFixr addresses
these gaps with transparent bidding, AI price guidance, verification, ratings, and
an escrow workflow — promoting transparency, safety, and efficiency.

## 1.3 Vision
A simple, trustworthy marketplace where homeowners hire confidently and
professionals win fair work and get paid reliably.

## 1.4 Objectives
1. Develop a web application for customers and providers.
2. Provide secure identity verification (ID and license; facial recognition as
   optional Phase 2).
3. Implement a dynamic bidding system based on hourly rate and equipment cost.
4. Incorporate lightweight AI for fair pricing and fraud detection.
5. Enable a secure escrow-based payment workflow (simulation).

## 1.5 Scope
- **Categories:** Plumbing, Electrical, Appliances, Handyman, Cleaning.
- **Core flows:** job/work requests, bidding (offers), chat, escrow, reviews,
  notifications, verification, admin oversight.
- **Out of scope:** real payment processing, native mobile apps, group chat,
  file/voice/video in chat, multi-language. Facial recognition is optional Phase 2.

## 1.6 Tools and technologies
Next.js, React, TypeScript, Tailwind CSS (frontend); Node.js, Express, Prisma
(backend); Supabase PostgreSQL (database); JWT + bcrypt (auth); Socket.io
(real-time); Cloudinary (media); Python, FastAPI, scikit-learn (AI); Git/GitHub;
Vercel + Render (hosting). All free and largely open-source.

## 1.7 Glossary
| Term | Meaning |
|---|---|
| Customer | Homeowner who posts jobs and hires providers |
| Provider | Verified professional who bids on and completes jobs |
| Administrator | Operator who approves verifications and reviews fraud |
| Bid / Offer | A provider's priced proposal for a job |
| Escrow simulation | Held → Released payment state machine (no real money) |
| Trust badge | Marker shown for a verified provider |
| SUS | System Usability Scale (usability questionnaire) |

## 1.8 Report structure
Chapter 2 reviews background and related work; Chapter 3 covers requirements and
design; Chapter 4 details the iteration-wise implementation and testing; Chapter 5
presents results and the HCI evaluation; Chapter 6 concludes with future work.
