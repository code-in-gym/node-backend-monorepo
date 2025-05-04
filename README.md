# Node Backend Template

A modern, type-safe, and scalable backend template for building REST APIs with Node.js.

## Tech Stack

### Core
- **Framework**: [Koa](https://koajs.com/) - Lightweight and flexible Node.js web framework
- **ORM**: [Prisma](https://www.prisma.io/) - Next-generation ORM for Node.js & TypeScript
- **Testing**: [Vitest](https://vitest.dev/) - Next-generation testing framework
- **Logging**: [Pino](https://getpino.io/) + ELK Stack for log analysis

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
├── utils/             # Utility functions
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

