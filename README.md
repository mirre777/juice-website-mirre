# Juice Fitness - Trainer Marketplace Platform

*Automatically synced with your [v0.dev](https://v0.dev) deployments*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/mirre777s-projects/v0-v2-website)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.dev-black?style=for-the-badge)](https://v0.dev/chat/projects/JdpRzuWmhx6)

## Overview

Juice Fitness is a comprehensive trainer marketplace platform that connects fitness professionals with clients. The platform enables trainers to create professional profiles, accept payments, and manage their fitness services through an integrated subscription system.

## Key Features

- **Trainer Profile Creation**: Professional fitness trainer profiles with customizable content
- **Subscription Management**: Stripe-powered subscription system with webhook processing
- **Payment Processing**: Secure payment handling with promotion code support
- **Content Management**: Dynamic content editing and blog system
- **Responsive Design**: Mobile-first design optimized for all devices

## Recent Updates

### Stripe Webhook Integration (Latest)
- **Fixed signature verification**: Resolved production deployment issues preventing webhook processing
- **Implemented subscription processing**: Automatic user activation and flag updates upon successful payment
- **Enhanced debugging**: Comprehensive logging for webhook events and signature verification
- **Database operations**: Proper Firebase integration for user status updates

**Files modified:**
- `app/api/stripe-webhook/route.ts` - Complete webhook processing implementation

## Architecture

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **React Hook Form** for form management

### Backend
- **Next.js API Routes** for serverless functions
- **Firebase Firestore** for database operations
- **Stripe** for payment processing and webhooks
- **Vercel Blob** for content storage

### Integrations
- **Stripe**: Payment processing, subscriptions, webhooks
- **Firebase**: User data, trainer profiles, content management
- **Vercel**: Hosting, serverless functions, blob storage

## Deployment

Your project is live at:

**Production**: [https://juice.fitness](https://juice.fitness)
**Staging**: [https://vercel.com/mirre777s-projects/v0-v2-website](https://vercel.com/mirre777s-projects/v0-v2-website)

## Development

Continue building your app on:

**[https://v0.dev/chat/projects/JdpRzuWmhx6](https://v0.dev/chat/projects/JdpRzuWmhx6)**

## Environment Variables

Required environment variables for deployment:

### Firebase Configuration
\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_PROJECT_ID
FIREBASE_PROJECT_ID
FIREBASE_CLIENT_EMAIL
FIREBASE_PRIVATE_KEY
\`\`\`

### Stripe Configuration
\`\`\`
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
\`\`\`

### Vercel Integration
\`\`\`
BLOB_READ_WRITE_TOKEN
NEXT_PUBLIC_APP_URL
\`\`\`

## How It Works

1. **Trainer Registration**: Trainers create profiles through the registration flow
2. **Payment Processing**: Stripe handles subscription payments with webhook confirmation
3. **Profile Activation**: Successful payments trigger automatic profile activation
4. **Content Management**: Activated trainers can manage their profiles and content
5. **Client Discovery**: Clients can browse and connect with trainers

### Webhook Flow
1. Stripe sends webhook events to `/api/stripe-webhook`
2. Signature verification ensures request authenticity
3. `checkout.session.completed` events trigger user activation
4. Firebase collections are updated with subscription status
5. Trainer profiles are automatically activated

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── marketplace/       # Trainer marketplace pages
│   └── payment/          # Payment processing pages
├── components/            # Reusable React components
├── lib/                  # Utility functions and configurations
├── actions/              # Server actions
└── docs/                 # Project documentation
\`\`\`

## Contributing

This project uses automated syncing with v0.dev. Changes should be made through the v0 interface and will be automatically pushed to this repository.

## Support

For technical support or questions, please refer to the comprehensive documentation in the `/docs` folder or contact the development team.
