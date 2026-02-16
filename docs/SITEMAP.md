# JUICE FITNESS PLATFORM SITEMAP

*Last Updated: January 2025*

## Overview
Complete site structure for the Juice Fitness Platform, including all pages, routes, and API endpoints.

## Main Pages

| Route | Description | Audience |
|-------|-------------|----------|
| `/` | Homepage (redirects to /trainers) | Both |
| `/trainers` | Trainer-focused homepage | Trainers |
| `/clients` | Client-focused homepage | Clients |
| `/marketplace` | Main marketplace | Both |
| `/blog` | Blog listing | Both |
| `/blog/[slug]` | Individual blog posts | Both |
| `/workout-planner` | Workout planning tool | Both |
| `/workout-programs` | Workout programs collection page | Both |
| `/workout-programs/free/[slug]` | Free workout programs | Both |
| `/workout-programs/paid/[slug]` | Paid workout programs | Both |
| `/workout-programs/celebrity/[slug]` | Celebrity workout programs | Both |
| `/100trainers` | Special trainer showcase | Clients |
| `/legal` | Legal/terms page | Both |
| `/interview/[slug]` | Trainer interview articles | Both |

## Landing Pages

### Client-Focused Landing Pages
| Route | Description | Target Market |
|-------|-------------|---------------|
| `/best-free-workout-app-uk` | UK fitness app landing | UK Clients |
| `/download-juice-app` | App download page | Global Clients |
| `/findatrainer` | Find a trainer landing | Clients |
| `/findatrainer/amsterdam` | Find trainers in Amsterdam | Netherlands Clients |
| `/findatrainer/berlin` | Find trainers in Berlin | German Clients |
| `/findatrainer/london` | Find trainers in London | UK Clients |
| `/findatrainer/rotterdam` | Find trainers in Rotterdam | Netherlands Clients |
| `/findatrainer/the-hague` | Find trainers in The Hague | Netherlands Clients |
| `/findatrainer/vienna` | Find trainers in Vienna | Austrian Clients |
| `/getfit` | Get fit with personal trainer matching | Global Clients |
| `/gratis-fitness-app-danmark` | Danish fitness app landing | Danish Clients |
| `/gratis-workout-app-met-trainer` | Dutch workout app landing | Dutch Clients |
| `/juice-raffle-win-free-personal-training` | Raffle promotion page | Global Clients |
| `/trainingsplan-app-gratis` | German training plan app landing | German Clients |

### City-Specific Personal Training Pages
| Route | City | Country |
|-------|------|---------|
| `/personal-training-amsterdam` | Amsterdam | Netherlands |
| `/personal-training-berlin` | Berlin | Germany |
| `/personal-training-koebenhavn` | Copenhagen | Denmark |
| `/personal-training-muenchen` | Munich | Germany |
| `/personal-training-wien` | Vienna | Austria |

### Trainer-Focused Landing Pages
| Route | Description | Purpose |
|-------|-------------|---------|
| `/getclients` | Client acquisition for trainers | Lead generation |
| `/personal-trainer-app-demo` | Personal trainer app landing | App promotion |

## Marketplace & Trainer System

### Marketplace Pages
| Route | Description | Access |
|-------|-------------|--------|
| `/marketplace/personal-trainer-website` | Website builder for trainers | Trainers |
| `/marketplace/trainer/[id]` | Full-featured trainer profiles | Public |
| `/marketplace/public-trainer-page/[id]` | Standalone public trainer profiles | Public |
| `/marketplace/trainer/[id]/dashboard` | Trainer dashboard | Trainer only |
| `/marketplace/trainer/[id]/edit` | Profile editor | Trainer only |
| `/marketplace/trainer/temp/[tempId]` | Temporary trainer pages | Public |

## User Account System

### Authentication & Accounts
| Route | Description | Access |
|-------|-------------|--------|
| `/account/signup` | User registration | Public |
| `/account/dashboard` | User dashboard | Authenticated |
| `/client` | Client portal | Clients |

### Payment System
| Route | Description | Access |
|-------|-------------|--------|
| `/payment` | Payment processing | Authenticated |
| `/payment/success` | Payment confirmation | Authenticated |

## Non-Indexed Routes

These routes exist but are **not indexed** by search engines (robots: noindex, nofollow):

| Route | Description | Reason |
|-------|-------------|--------|
| `/home` | Backup/homepage route | Internal use only, not for public indexing |
| `/legal` | Legal/terms page | Disallowed in robots.txt |
| `/sell-programs` | Marketplace program selling page | Not for public indexing |

## Admin Panel

| Route | Description | Access |
|-------|-------------|--------|
| `/admin/blog` | Blog management | Admin |
| `/admin/user-management` | User administration | Admin |
| `/admin/waitlist` | Waitlist management | Admin |
| `/admin/firebase-rules` | Firebase rules viewer | Admin |

## Development & Testing

### Debug Pages
| Route | Description | Environment |
|-------|-------------|-------------|
| `/debug-env` | Environment debugging | Development |
| `/debug-firestore` | Firestore debugging | Development |
| `/debug-stripe` | Stripe debugging | Development |
| `/test-firebase` | Firebase testing | Development |
| `/stripe-test` | Stripe integration testing | Development |

## API Endpoints

### Admin APIs
- `/api/admin/*` - Various admin operations

### Core APIs
- `/api/create-payment-intent` - Payment processing
- `/api/stripe-webhook` - Stripe webhooks
- `/api/trainer/*` - Trainer management
- `/api/blog-post` - Blog functionality

## Route Groups Structure

\`\`\`
app/
├── (landing-pages)/
│   ├── (client)/
│   │   ├── best-free-workout-app-uk/
│   │   ├── download-juice-app/
│   │   ├── findatrainer/
│   │   ├── getfit/
│   │   ├── gratis-fitness-app-danmark/
│   │   ├── gratis-workout-app-met-trainer/
│   │   ├── juice-raffle-win-free-personal-training/
│   │   ├── trainingsplan-app-gratis/
│   │   ├── personal-training-amsterdam/
│   │   ├── personal-training-berlin/
│   │   ├── personal-training-koebenhavn/
│   │   ├── personal-training-muenchen/
│   │   ├── personal-training-wien/
│   │   └── workout-programs/
│   └── (trainers)/
│       ├── getclients/
│       ├── personal-trainer-app-demo/
│       ├── sell-programs/
│       └── 100trainers/
├── marketplace/
│   ├── (marketplace)/
│   ├── (microsite)/
│   ├── (landing-page-onboarding-form)/
│   └── public-trainer-page/
├── admin/
├── payment/
└── api/
\`\`\`

## Statistics

- **Total Pages:** ~60+ including dynamic routes
- **Languages Supported:** English, Dutch, German, Danish
- **Main Audiences:** Personal Trainers, Fitness Clients
- **Core Features:** Marketplace, Landing Pages, Payment Processing, Admin Panel, Workout Programs, Interviews
- **Route Groups:** Client Landing Pages, Trainer Landing Pages, Marketplace, Admin
- **City-Specific Pages:** 6 cities (Amsterdam, Berlin, London, Rotterdam, The Hague, Vienna)

## SEO Strategy

### URL Structure
- **Client pages:** Focus on fitness, workout, and training keywords
- **Trainer pages:** Focus on client acquisition and business growth
- **City pages:** Local SEO for personal training services
- **Marketplace:** Professional trainer services and tools

### Multi-language Support
- **English:** Global market, UK, US
- **Dutch:** Netherlands market
- **German:** Germany, Austria market  
- **Danish:** Denmark market

---

*This sitemap is automatically maintained and should be updated whenever new routes are added or existing routes are modified.*
