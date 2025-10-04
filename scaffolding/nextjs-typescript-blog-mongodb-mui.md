# Next.js TypeScript Blog with MongoDB & Material-UI

## Project Overview
A full-stack blog application built with Next.js 14+ (App Router), TypeScript, MongoDB Atlas, Material-UI, TinyMCE rich text editor, NextAuth.js authentication, and Zustand state management. Deployed on Vercel with comprehensive testing setup.

## Prerequisites
- Node.js 18+ 
- pnpm package manager
- MongoDB Atlas account
- Vercel account (for deployment)
- TinyMCE API key (free tier available)

## Project Structure
```
blog-app/
├── .env.local.example
├── .env.local
├── .eslintrc.json
├── .gitignore
├── README.md
├── next.config.js
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── jest.config.js
├── jest.setup.js
├── public/
│   ├── favicon.ico
│   └── images/
├── src/
│   ├── app/
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts
│   │   │   ├── posts/
│   │   │   │   ├── route.ts
│   │   │   │   └── [id]/
│   │   │   │       └── route.ts
│   │   │   └── users/
│   │   │       └── route.ts
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx
│   │   │   └── posts/
│   │   │       ├── page.tsx
│   │   │       ├── new/
│   │   │       │   └── page.tsx
│   │   │       └── [id]/
│   │   │           └── edit/
│   │   │               └── page.tsx
│   │   └── posts/
│   │       ├── page.tsx
│   │       └── [slug]/
│   │           └── page.tsx
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── AuthProvider.tsx
│   │   ├── blog/
│   │   │   ├── PostCard.tsx
│   │   │   ├── PostList.tsx
│   │   │   ├── PostEditor.tsx
│   │   │   └── RichTextEditor.tsx
│   │   └── providers/
│   │       ├── ThemeProvider.tsx
│   │       └── Providers.tsx
│   ├── lib/
│   │   ├── auth.ts
│   │   ├── mongodb.ts
│   │   ├── validations.ts
│   │   └── utils.ts
│   ├── models/
│   │   ├── User.ts
│   │   └── Post.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── postStore.ts
│   │   └── index.ts
│   ├── types/
│   │   ├── auth.ts
│   │   ├── post.ts
│   │   └── index.ts
│   └── __tests__/
│       ├── components/
│       ├── pages/
│       └── utils/
```

## Dependencies

### package.json
```json
{
  "name": "nextjs-blog-app",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  },
  "dependencies": {
    "@emotion/react": "^11.11.1",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.14.19",
    "@mui/material": "^5.14.20",
    "@tinymce/tinymce-react": "^4.3.2",
    "bcryptjs": "^2.4.3",
    "mongodb": "^6.3.0",
    "mongoose": "^8.0.3",
    "next": "14.0.4",
    "next-auth": "^4.24.5",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "zod": "^3.22.4",
    "zustand": "^4.4.7"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.1.5",
    "@testing-library/react": "^14.1.2",
    "@testing-library/user-event": "^14.5.1",
    "@types/bcryptjs": "^2.4.6",
    "@types/node": "^20.10.5",
    "@types/react": "^18.2.45",
    "@types/react-dom": "^18.2.18",
    "@typescript-eslint/eslint-plugin": "^6.14.0",
    "@typescript-eslint/parser": "^6.14.0",
    "eslint": "^8.55.0",
    "eslint-config-next": "14.0.4",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-prettier": "^5.0.1",
    "jest": "^29.7.0",
    "jest-environment-jsdom": "^29.7.0",
    "prettier": "^3.1.1",
    "typescript": "^5.3.3"
  }
}
```

## Configuration Files

### next.config.js
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ['localhost', 'your-domain.com'],
  },
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
}

module.exports = nextConfig
```

### tsconfig.json
```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "es6"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"],
      "@/store/*": ["./src/store/*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### .eslintrc.json
```json
{
  "extends": [
    "next/core-web-vitals",
    "@typescript-eslint/recommended",
    "prettier"
  ],
  "parser": "@typescript-eslint/parser",
  "plugins": ["@typescript-eslint", "prettier"],
  "rules": {
    "prettier/prettier": "error",
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/no-explicit-any": "warn",
    "prefer-const": "error"
  }
}
```

### jest.config.js
```javascript
const nextJest = require('next/jest')

const createJestConfig = nextJest({
  dir: './',
})

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
}

module.exports = createJestConfig(customJestConfig)
```

### jest.setup.js
```javascript
import '@testing-library/jest-dom'
```

## Environment Variables

### .env.local.example
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-db

# NextAuth.js
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# TinyMCE
NEXT_PUBLIC_TINYMCE_API_KEY=your-tinymce-api-key

# App
NODE_ENV=development
```

## Development Setup

### 1. Initialize Project
```bash
# Create Next.js app with TypeScript
pnpm create next-app@latest blog-app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"

cd blog-app

# Install dependencies
pnpm install @emotion/react @emotion/styled @mui/icons-material @mui/material @tinymce/tinymce-react bcryptjs mongodb mongoose next-auth zod zustand

# Install dev dependencies  
pnpm install -D @testing-library/jest-dom @testing-library/react @testing-library/user-event @types/bcryptjs @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-config-prettier eslint-plugin-prettier jest jest-environment-jsdom prettier
```

### 2. Setup Environment
```bash
# Copy environment template
cp .env.local.example .env.local

# Edit .env.local with your actual values
```

### 3. MongoDB Models
```bash
# Create MongoDB connection and models
mkdir -p src/lib src/models src/types
```

## Implementation Examples

### src/lib/mongodb.ts
```typescript
import mongoose from 'mongoose'

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable')
}

let cached = global.mongoose

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null }
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose
    })
  }

  try {
    cached.conn = await cached.promise
  } catch (e) {
    cached.promise = null
    throw e
  }

  return cached.conn
}

export default dbConnect
```

### src/models/Post.ts
```typescript
import mongoose from 'mongoose'

export interface IPost {
  _id?: string
  title: string
  slug: string
  content: string
  excerpt: string
  author: mongoose.Types.ObjectId
  published: boolean
  createdAt: Date
  updatedAt: Date
}

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
  },
  content: {
    type: String,
    required: true,
  },
  excerpt: {
    type: String,
    maxlength: 200,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  published: {
    type: Boolean,
    default: false,
  },
}, {
  timestamps: true,
})

export default mongoose.models.Post || mongoose.model('Post', PostSchema)
```

### src/lib/auth.ts
```typescript
import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import dbConnect from './mongodb'
import User from '../models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await dbConnect()
        
        const user = await User.findOne({ email: credentials.email })
        
        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
}
```

### src/components/blog/RichTextEditor.tsx
```typescript
'use client'

import { Editor } from '@tinymce/tinymce-react'
import { useRef } from 'react'

interface RichTextEditorProps {
  value: string
  onChange: (content: string) => void
  height?: number
}

export default function RichTextEditor({ 
  value, 
  onChange, 
  height = 400 
}: RichTextEditorProps) {
  const editorRef = useRef<any>(null)

  return (
    <Editor
      apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
      onInit={(evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={onChange}
      init={{
        height,
        menubar: false,
        plugins: [
          'advlist autolink lists link image charmap preview anchor',
          'searchreplace visualblocks code fullscreen',
          'insertdatetime media table code help wordcount'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | help',
        content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
      }}
    />
  )
}
```

### src/store/authStore.ts
```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface User {
  id: string
  email: string
  name: string
}

interface AuthState {
  user: User | null
  isLoading: boolean
  setUser: (user: User | null) => void
  setLoading: (loading: boolean) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    (set) => ({
      user: null,
      isLoading: false,
      setUser: (user) => set({ user }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-store',
    }
  )
)
```

## Testing Strategy

### Component Tests
```typescript
// src/__tests__/components/PostCard.test.tsx
import { render, screen } from '@testing-library/react'
import PostCard from '@/components/blog/PostCard'

const mockPost = {
  _id: '1',
  title: 'Test Post',
  excerpt: 'Test excerpt',
  slug: 'test-post',
  createdAt: new Date().toISOString(),
}

describe('PostCard', () => {
  it('renders post title and excerpt', () => {
    render(<PostCard post={mockPost} />)
    
    expect(screen.getByText('Test Post')).toBeInTheDocument()
    expect(screen.getByText('Test excerpt')).toBeInTheDocument()
  })
})
```

### API Route Tests
```typescript
// src/__tests__/api/posts.test.ts
import { createMocks } from 'node-mocks-http'
import handler from '@/app/api/posts/route'

describe('/api/posts', () => {
  it('returns posts successfully', async () => {
    const { req, res } = createMocks({
      method: 'GET',
    })

    await handler(req, res)

    expect(res._getStatusCode()).toBe(200)
  })
})
```

## Deployment Considerations

### Vercel Configuration
```json
{
  "builds": [
    {
      "src": "next.config.js",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "MONGODB_URI": "@mongodb_uri",
    "NEXTAUTH_SECRET": "@nextauth_secret",
    "NEXT_PUBLIC_TINYMCE_API_KEY": "@tinymce_api_key"
  }
}
```

### Production Environment Variables
- Set up environment variables in Vercel dashboard
- Configure MongoDB Atlas IP whitelist (0.0.0.0/0 for Vercel)
- Set up proper NEXTAUTH_URL for production domain

### Performance Optimizations
- Image optimization with Next.js Image component
- Code splitting with dynamic imports
- MongoDB connection pooling
- Proper caching strategies

### Security Considerations
- Input validation with Zod schemas
- Password hashing with bcryptjs
- Rate limiting for API routes
- CSRF protection with NextAuth.js
- Environment variable security

### Monitoring & Analytics
- Vercel Analytics integration
- Error tracking with Sentry (optional)
- Performance monitoring
- User behavior analytics

This template provides a complete foundation for a modern, scalable blog application with all the features you specified. The structure follows Next.js best practices and includes comprehensive TypeScript support, testing setup, and deployment configuration.