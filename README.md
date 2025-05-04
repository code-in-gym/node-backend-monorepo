# Node Backend Template

A modern, type-safe, and scalable backend template for building REST APIs with Node.js.

## Tech Stack

### Core
- **Framework**: [Koa](https://koajs.com/) - Lightweight and flexible Node.js web framework
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js & TypeScript
- **Testing**: [Vitest](https://vitest.dev/) - Next-generation testing framework
- **Logging**: [Pino](https://getpino.io/) + ELK Stack for log analysis
- **ID Encoding**: [Sqids](https://sqids.org/) - Generate short unique IDs from numbers

### Development
- **Runtime**: [tsx](https://github.com/esbuild-kit/tsx) - Enhanced TypeScript execution
- **Build**: [esbuild](https://esbuild.github.io/) - An extremely fast bundler for the web
- **Package Manager**: [pnpm](https://pnpm.io/) - Fast, disk space efficient package manager
- **Hot Reload**: [nodemon](https://nodemon.io/) - Monitor for changes and auto-restart

### Code Quality
- **Linting**: ESLint with modern flat config
- **Formatting**: Prettier
- **Git Hooks**: Husky + lint-staged
- **Type Safety**: TypeScript with strict mode

## Project Structure

```
src/
├── __tests__/          # Test files
├── controllers/        # Route controllers
├── middlewares/       # Custom middlewares
├── prisma/            # Prisma schema and client
├── routes/            # Route definitions
├── types/             # Type definitions
│   └── models.ts      # Model type constants
├── utils/             # Utility functions
│   └── sqids.ts       # ID encoding utilities
└── index.ts           # Application entry point

config/
├── vitest.config.ts   # Vitest configuration
├── eslint.config.js   # ESLint configuration
└── tsconfig.json      # TypeScript configuration
```

## Features
- 🚀 Modern ESM support
- 💪 Full TypeScript support
- 📝 Comprehensive logging
- 🔒 Type-safe database operations
- 🧪 Unit and integration testing
- 📦 Docker support
- 📊 ELK Stack integration
- ⚡️ Fast development and build
- 🔑 Secure ID encoding with model-specific namespaces

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev

# Run tests
pnpm test

# Build for production
pnpm build

# Start production server
pnpm start
```

## Environment Variables

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname?schema=public"

# ID Encoding
SQIDS_ALPHABET="abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" # Optional
```

## ID Encoding

The template uses [Sqids](https://sqids.org/) for generating short, unique, non-sequential IDs for database records. Key features:

- Model-specific namespaces prevent ID collisions between different models
- Type-safe model type handling with TypeScript
- Configurable alphabet for ID generation
- Minimum length guarantee for security
- Easy to add new model types

Example usage:
```typescript
import { MODEL_TYPES } from '@/types/models';
import { encodeId, decodeId } from '@/utils/sqids';

// Encoding
const encodedId = encodeId(MODEL_TYPES.USER, 1);
// => "Wy9QvXvP1m"

// Decoding
const id = decodeId(MODEL_TYPES.USER, "Wy9QvXvP1m");
// => 1
```

## Docker Support

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm test:coverage` - Run tests with coverage
- `pnpm lint` - Lint code
- `pnpm format` - Format code
- `pnpm prisma:generate` - Generate Prisma client
- `pnpm prisma:migrate` - Run database migrations

## License

MIT

