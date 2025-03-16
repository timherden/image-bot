# CLAUDE.md - Assistant Guidelines

## Commands
- Build: `npm run build`
- Dev: `npm run dev` (uses turbopack)
- Start: `npm run start`
- Lint: `npm run lint`

## Code Style
- TypeScript with strict mode enabled
- Next.js app router structure
- Use Tailwind CSS for styling
- Use shadcn/ui components (install with `npx shadcn@latest add [component-name]`)
  - Example: `npx shadcn@latest add button`
- Follow React functional component patterns

## Naming & Structure
- Component files: PascalCase.tsx
- Utility functions: camelCase.ts
- Import order: React, external libs, internal modules
- Use path aliases: `@/components`, `@/lib`, etc.
- Keep components atomic and reusable

## Best Practices
- Use TypeScript types for all props and returns
- Prefer server components where possible
- Handle loading/error states for async operations
- Follow ESLint rules (next/core-web-vitals)
- Commit often with descriptive messages