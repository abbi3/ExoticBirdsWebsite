# Design Guidelines: Exotic Birds Information Website

## Design Approach

**Selected Approach:** Reference-Based with Material Design influence
- **Primary References:** National Geographic (wildlife presentation), Airbnb (card browsing patterns), Allbirds (nature-focused aesthetics)
- **Supporting System:** Material Design for data-dense information sections
- **Rationale:** Wildlife catalog requires trustworthy, educational presentation while maintaining visual appeal through nature imagery

## Core Design Principles

1. **Wildlife Photography First:** Let bird imagery dominate visual hierarchy
2. **Scientific Credibility:** Professional, clean layouts that inspire trust for legal/CITES information
3. **Discovery-Focused:** Easy browsing and filtering with clear visual feedback
4. **Information Density Balance:** Rich details without overwhelming users

---

## Typography System

**Font Families:**
- **Headings:** Inter (700 weight for titles, 600 for subtitles)
- **Body Text:** Inter (400 regular, 500 medium for emphasis)
- **Accent/Legal:** System monospace for price badges and legal notices

**Type Scale:**
- **Hero Headlines:** 3xl on mobile (text-3xl), 5xl on tablet (md:text-5xl), 6xl on desktop (lg:text-6xl)
- **Page Titles:** 2xl mobile, 3xl tablet, 4xl desktop
- **Section Headers:** xl mobile, 2xl desktop
- **Card Titles:** lg mobile, xl desktop
- **Body Text:** Base (16px equivalent)
- **Captions/Metadata:** sm for timestamps, legal notes

---

## Layout System

**Spacing Primitives:** Tailwind units of **2, 4, 6, 8, 12, 16, 20**
- Micro spacing: p-2, gap-2 (within components)
- Standard spacing: p-4, p-6, gap-4 (cards, sections)
- Section padding: py-12 mobile, py-16 tablet, py-20 desktop
- Generous spacing: p-8, gap-8, py-20 (hero sections, feature areas)

**Container Strategy:**
- Full-width sections with max-w-7xl centered containers
- Content sections: max-w-6xl
- Bird profile content: max-w-4xl for optimal reading
- Admin panels: max-w-3xl

**Grid Patterns:**
- Bird Cards Grid: 1 column mobile, 2 columns tablet (md:grid-cols-2), 3 columns desktop (lg:grid-cols-3)
- Filter Sidebar: Vertical on mobile (full-width), sticky sidebar on desktop (w-64)
- Profile Page: Single column mobile, 2-column layout desktop (60/40 split for content/sidebar)

---

## Component Library

### Header & Navigation
**Structure:** Full-width sticky header with contained navigation
- Logo left-aligned with bird icon or illustration
- Desktop: horizontal nav menu (Home, About, Admin)
- Search bar integrated in header (desktop: center-right, mobile: below nav)
- Mobile: hamburger menu with slide-in drawer
- Height: 16 units (h-16), with shadow on scroll

### Home Page Layout

**Hero Section:**
- Height: 70vh minimum with nature/aviary background image (large hero image)
- Overlay gradient for text legibility
- Centered headline: "Discover Exotic Pet Birds" with descriptive subheading
- Prominent search bar with rounded-full styling (w-full max-w-2xl)
- Blurred-background CTA button for "Browse All Species"

**Featured Birds Carousel:**
- Horizontal scroll on mobile, 3-card grid on desktop
- Large bird images (aspect-ratio-4/3) with subtle rounded corners (rounded-xl)
- Card content overlay at bottom with name and price range
- Auto-advance carousel with manual navigation dots

**Filter Section:**
- Sticky filter bar on desktop (top-20)
- Chip-style filter buttons for quick categories (Size: Small/Medium/Large, Noise Level, Price Range)
- Active state with filled background, inactive with border-only
- Mobile: Collapsible filter drawer triggered by "Filters" button

**Birds Grid:**
- Masonry-style card layout with consistent gap-6
- Cards maintain aspect ratio with overflow-hidden for images

### Bird Card Component
**Structure:**
- Image container: aspect-ratio-square with object-cover
- Hover state: subtle scale transform (hover:scale-105) and shadow elevation
- Content padding: p-4 or p-6
- Bird name: text-xl font-semibold
- Quick stats row: text-sm with icons (size, noise level)
- Price badge: absolute positioned top-right with backdrop-blur
- "Learn More" link: text-base font-medium with arrow icon

### Bird Profile Page

**Hero Section:**
- Full-width image banner (h-96 on desktop)
- Image overlay gradient for breadcrumb navigation
- Breadcrumb: Home > Birds > [Species Name]

**Profile Layout (Desktop):**
- Main content area (w-2/3): tabbed sections
- Sidebar (w-1/3): Quick Facts card, Price Badge, Care Checklist card
- Tab Navigation: Underline style with smooth transition (Overview | Behavior | Diet | As a Pet | Legal & Pricing)

**Quick Facts Card:**
- White/elevated background with rounded-lg, p-6
- Icon-label pairs in grid (grid-cols-2 gap-4)
- Items: Scientific name, Origin, Lifespan, Size, Noise Level

**Price Badge Component:**
- Prominent display with INR symbol
- Range format: "₹80,000 - ₹2,00,000"
- Subtitle: "Estimated Price in India" (text-sm)
- Last updated timestamp with calendar icon
- Info tooltip icon explaining price variability

**Care Checklist Card:**
- Checkbox-style list (visual only, not interactive)
- Items: Daily feeding, Social interaction, Cage cleaning, Vet visits
- Each item with spacing (gap-3)

**Tab Content Sections:**
- Rich text formatting with headings (text-xl font-semibold), paragraphs (space-y-4)
- Bulleted lists with custom markers
- Definition lists for structured data (Behavior characteristics, Diet requirements)
- Callout boxes for important notes (rounded-lg border with background tint)

### About Page
- Single column centered layout (max-w-4xl)
- Generous line-height (leading-relaxed) for readability
- Legal notice section: border-l-4 with background tint, p-6
- CITES information in expandable accordion sections

### Admin Panel
- Centered form layout (max-w-3xl)
- Passphrase protection: simple input with "Unlock" button
- JSON editor: monospace textarea (font-mono) with syntax highlighting consideration
- Bird edit form: labeled inputs with clear spacing (space-y-6)
- Save/Cancel action buttons in footer (sticky bottom)

### Footer
- Three-column layout on desktop, stacked on mobile
- Sections: About & Legal, Quick Links, Contact & Social
- Copyright notice and last-updated timestamp
- Minimal height: py-12 with border-top

---

## Interactive Elements

### Buttons
**Primary:** Filled with medium-high contrast, rounded-lg, px-6 py-3, font-medium
**Secondary:** Border-only with transparent background, same padding
**Icon Buttons:** Square (w-10 h-10) with rounded-full, centered icon
**Blurred Background (Hero CTAs):** backdrop-blur-md with semi-transparent background

### Search Bar
- Rounded-full with shadow-sm
- Leading search icon (pl-12 for input padding)
- Placeholder: "Search birds by name, species..."
- Dropdown suggestions on focus with rounded-lg, shadow-lg

### Filter Chips
- Rounded-full, px-4 py-2, text-sm
- Inactive: border-2 with transparent background
- Active: filled background, border matches fill
- Close icon on active chips (trailing X)

### Hover States
- Cards: Lift effect (shadow elevation increase, subtle scale)
- Links: Underline animation from left to right
- Images: Slight zoom on parent container (scale-105 over 300ms)

---

## Imagery Guidelines

**Hero Image:** Large panoramic aviary or tropical bird habitat scene - vibrant, professional wildlife photography

**Bird Profile Images:**
- High-resolution species photos (minimum 1200x900)
- Multiple angles if available (side profile, face close-up, in habitat)
- Image gallery with thumbnail navigation

**Card Thumbnails:**
- Square crop focusing on bird's head/upper body
- Consistent aspect ratio across all cards
- Sharp, well-lit photography prioritized

**Placeholder Strategy:**
- Use bird silhouettes or illustrated placeholders when photos unavailable
- Maintain visual hierarchy even with placeholders

---

## Accessibility & Interactions

- Keyboard navigation: visible focus rings (ring-2 ring-offset-2)
- Skip-to-content link for screen readers
- Alt text pattern: "[Bird Common Name] - [Key Visual Feature]"
- ARIA labels for icon-only buttons
- Color contrast ratio minimum 4.5:1 for text
- Form labels always visible (not placeholder-only)
- Error states with icon + text explanation

---

## Visual Enhancements

**Animations:** Minimal and purposeful
- Page transitions: Fade-in for route changes (200ms)
- Card hover: Transform and shadow (300ms ease)
- Tab switching: Slide animation (200ms)
- NO scroll-triggered animations to avoid distraction

**Shadows:**
- Cards: shadow-sm default, shadow-lg on hover
- Dropdowns/Modals: shadow-xl
- Sticky elements: shadow-md

**Borders:**
- Subtle borders (border-gray-200 equivalent) for separation
- Accent borders (border-l-4) for callouts and legal notices

This design creates a professional, trustworthy catalog that balances beautiful wildlife imagery with dense educational content, ensuring both engagement and credibility for this specialized pet bird information resource.