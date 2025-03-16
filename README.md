# AI Image Generator

A Next.js application that allows users to generate images using Amazon Bedrock's Stability AI Stable Diffusion XL model. Users can provide prompts to generate up to 3 images at once and download their favorites.

## Features

- Generate 1-3 images per request using text prompts
- Real-time image generation with loading states
- Download generated images
- Clean, responsive UI using shadcn/ui components

## Prerequisites

- AWS account with Bedrock access
- AWS credentials with permissions to call the Bedrock API

## Getting Started

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Configure AWS credentials:
   - Copy `.env.local.example` to `.env.local`
   - Add your AWS credentials in the `.env.local` file

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
