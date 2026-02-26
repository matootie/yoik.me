# Yoik.ME

An anonymous microblogging platform. Post short thoughts, see what others are thinking.

## Stack

- **Client:** React 18, TypeScript, Vite, Tailwind CSS
- **Data:** Firebase (Firestore + Anonymous Auth)
- **Monorepo:** Yarn Workspaces + Turborepo

## Getting started

```bash
# Install dependencies
yarn

# Start the development server
yarn develop
```

The client runs at [http://localhost:3000](http://localhost:3000).

## Project structure

```
yoik.me/
├── packages/
│   └── tsconfig/       Shared TypeScript configurations
├── services/
│   └── client/         React SPA (Vite)
└── config/             Prettier, Commitlint, Husky
```

## Contributing

See [CONTRIBUTING.md](.github/CONTRIBUTING.md) for guidelines on pull requests, labels, and code ownership.
