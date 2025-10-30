# Exotic Birds Info

A comprehensive, production-ready website cataloging exotic pet birds with detailed species profiles, care guides, and pricing information for India.

![Exotic Birds Info](./docs/screenshot.png)

## Features

- **🦜 Species Catalog**: Detailed profiles for 7 exotic bird species including Macaws, Cockatoos, African Grey, and Amazon Parrots
- **🔍 Advanced Search & Filters**: Search by name or filter by size, noise level, and price range
- **📊 Detailed Profiles**: Comprehensive information on behavior, diet, care requirements, and legal considerations
- **💰 India Pricing**: Estimated price ranges in INR with last-updated timestamps
- **📱 Responsive Design**: Mobile-first design with Tailwind CSS and Shadcn UI components
- **♿ Accessibility**: Keyboard navigable, semantic HTML, ARIA labels, and alt text for all images
- **📄 PDF Export**: Download bird profile cards (coming soon)
- **🔐 Admin Panel**: Simple passphrase-protected panel for updating bird data
- **⚖️ Legal Compliance**: CITES and Wildlife Protection Act information for each species

## Tech Stack

### Frontend
- **React** (Vite)
- **Tailwind CSS** for styling
- **Shadcn UI** components
- **Wouter** for routing
- **TanStack Query** for state management
- **Lucide React** for icons

### Backend
- **Express.js**
- **In-memory storage** (easily upgradeable to database)
- **Zod** for validation
- **TypeScript** throughout

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd exotic-birds-info
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/
│   ├── src/
│   │   ├── components/       # Reusable React components
│   │   │   ├── ui/          # Shadcn UI components
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── BirdCard.tsx
│   │   │   ├── FilterChips.tsx
│   │   │   ├── PriceBadge.tsx
│   │   │   ├── QuickFacts.tsx
│   │   │   └── CareChecklist.tsx
│   │   ├── pages/           # Page components
│   │   │   ├── Home.tsx
│   │   │   ├── BirdProfile.tsx
│   │   │   ├── About.tsx
│   │   │   └── Admin.tsx
│   │   ├── lib/             # Utilities and data
│   │   │   └── birdsData.ts # Seed data for birds
│   │   └── App.tsx
├── server/
│   ├── routes.ts            # API routes
│   └── storage.ts           # Storage interface
├── shared/
│   └── schema.ts            # Shared TypeScript types
└── attached_assets/
    └── generated_images/    # Bird images
```

## Updating Bird Data

### Via Admin Panel (Recommended for Non-Technical Users)

1. Navigate to `/admin`
2. Enter the passphrase: `exotic2024` (change this in production!)
3. Edit the JSON data
4. Click "Save Changes"

**Note**: Currently saves to browser memory only. See "Future Enhancements" for API integration.

### Via Code (For Developers)

Edit `client/src/lib/birdsData.ts` to update bird information:

```typescript
{
  id: "1",
  name: "Blue-and-Gold Macaw",
  priceMin: 80000,
  priceMax: 200000,
  lastUpdated: new Date().toISOString(), // Update this when changing prices
  // ... other fields
}
```

## Customization

### Changing Colors

Edit `client/src/index.css` to customize the color scheme. The current theme uses a nature-focused teal color:

```css
:root {
  --primary: 165 75% 28%; /* Teal color */
  /* ... other colors */
}
```

### Adding New Birds

Add new bird entries to `client/src/lib/birdsData.ts`:

```typescript
{
  id: "8",
  name: "New Bird Species",
  scientificName: "Species scientificus",
  slug: "new-bird-species",
  image: "/path/to/image.png",
  size: "medium",
  noiseLevel: "moderate",
  // ... complete all required fields
}
```

### Updating Legal Information

Legal notices and CITES information can be updated in:
- Individual bird entries (`birdsData.ts`)
- About page (`client/src/pages/About.tsx`)

## SEO

Each page includes:
- Unique, descriptive title tags
- Meta descriptions
- Open Graph tags (can be extended)

### Adding Meta Tags to Bird Pages

The BirdProfile page can be enhanced with dynamic meta tags using a library like `react-helmet`:

```bash
npm install react-helmet
```

## Future Enhancements

### Planned Features (TODO Comments in Code)

1. **Real Pricing API Integration**
   - Location: `client/src/pages/BirdProfile.tsx`
   - Connect to regional marketplace API for live pricing across Indian cities

2. **PDF Generation**
   - Location: `client/src/pages/BirdProfile.tsx`
   - Implement client-side PDF generation using jsPDF

3. **Backend API for Bird Data**
   - Location: `server/routes.ts`
   - Create REST endpoints for CRUD operations on bird data
   - Move from in-memory storage to database (PostgreSQL recommended)

4. **Admin Authentication**
   - Implement proper authentication instead of simple passphrase
   - Add user roles and permissions

5. **Breeder Directory**
   - Add verified breeder listings
   - User reviews and ratings
   - Contact forms

6. **Comparison Feature**
   - Side-by-side species comparison
   - Care requirement calculator

## Deployment

### Netlify / Vercel

This project is ready to deploy on Netlify or Vercel:

1. Connect your repository
2. Build command: `npm run build`
3. Output directory: `dist`
4. Environment variables: Set `SESSION_SECRET` for production

### Environment Variables

Create a `.env` file for local development:

```env
SESSION_SECRET=your-secret-key-here
```

## Legal & Compliance

**Important**: This website is for informational purposes only. Users must:

- Check local laws regarding exotic pet ownership
- Understand CITES regulations
- Comply with India's Wildlife Protection Act, 1972
- Work with licensed breeders only
- Obtain all necessary permits

## License

[Your License Here]

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## Support

For questions or issues, please open an issue on GitHub or contact [your-email@example.com]

---

**Disclaimer**: The information provided is for educational purposes only. Always consult with qualified avian veterinarians and legal experts before acquiring exotic birds.
