# Rizen Showcase: Builds Page Specification
*Status: Requirements Defined | Scope: Web Showcase Subsystem*

This document outlines the requirements for the **Builds Page**, a dedicated subsystem of the Rizen platform designed to showcase "Operations" (projects) with a consistent tactical aesthetic.

---

## 1. Visual Identity & Consistency
The Builds page must be a seamless extension of the Rizen homepage.
*   **Inheritance:** Must reuse global layout, navigation, announcement bar, and footer.
*   **Theming:** Strict adherence to the "Neural Breach" (Cyber-Noir) design system.
*   **Variables:** Use existing CSS variables for colors (Cyan/Crimson accents), typography (Space Grotesk/Fira Code), and spacing.

## 2. Page Structure

### A. Hero Section
*   **Title:** `BUILDS`
*   **Subtitle:** *"Operations shipped by the Guild. Real work. Real progression."*
*   **Styling:** Matches the homepage hero spacing and background gradients.

### B. Builds Grid Section
A responsive grid of "Operation Cards." Each card must include:
*   **Project Title:** Tactical heading style.
*   **Description:** Single-sentence summary.
*   **Tags:** (e.g., `AI`, `Automation`, `Security`, `Web`).
*   **Status Badge:** Visual indicator for `Live`, `Beta`, or `WIP`.
*   **Metadata:** Date created.
*   **CTA:** "View Build" button (standard `.btn-primary` or `.btn-secondary` style).

## 3. Dynamic Data Architecture
To ensure scalability, the grid must be driven by a data array (JSON/Object list).
**Required Data Fields:**
*   `id`: Unique identifier.
*   `title`: Project name.
*   `description`: Short brief.
*   `tags`: Array of strings.
*   `status`: Current deployment state.
*   `image`: Thumbnail URL/path.
*   `link`: Path to the detail page.
*   `created_date`: ISO format or formatted string.

## 4. Build Detail Page
Individual "Operation Briefs" triggered by card interaction.
**Sections Required:**
*   **OPERATION BRIEF:** Comprehensive project overview.
*   **DEPLOYMENT STATUS:** Current phase (Live/Beta/Dev).
*   **PATCH NOTES:** Chronological update log.
*   **INTEL GAINED:** Lessons learned and technical hurdles.
*   **RESOURCES:** External links to Demo and Repository.

## 5. UI/UX & Technical Constraints
*   **Aesthetic:** Modern SaaS with a futuristic tactical/hacker feel.
*   **Interactivity:** Smooth hover states and transition animations for cards.
*   **Responsiveness:** Full mobile optimization.
*   **Maintainability:** Centralized theme variables to ensure platform-wide updates sync automatically.

---
*Note: This page is a subsystem of the Rizen platform, not a standalone portfolio.*
