# Menu Tree System - Full Stack Application

A production-ready full-stack application implementing a hierarchical menu tree system with CRUD operations. Built with React, Express, TypeScript, and Zustand.

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🎯 Overview

This application provides a complete menu management system with:

- **Hierarchical Menu Structure**: Support for unlimited depth nested menus
- **RESTful API**: Complete CRUD operations with validation
- **Interactive UI**: Real-time updates with Zustand state management
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Type-Safe**: Full TypeScript coverage for both frontend and backend
- **API Documentation**: Built-in Swagger/OpenAPI documentation
- **Docker Support**: Production-ready Docker setup

## 🛠 Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Zustand** - State management
- **TailwindCSS** - Styling
- **React Router 6** - Routing
- **Radix UI** - UI components
- **React Hook Form** - Form management

### Backend
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **Zod** - Input validation
- **Swagger UI** - API documentation

### Database
- **SQLite** - Lightweight database (can be swapped for PostgreSQL/MySQL)
- **Prisma** - ORM (configured for future migration)

## 📋 Project Structure

```
.
├── client/                    # React frontend
│   ├── components/
│   │   ├── MenuTree.tsx       # Menu tree component
│   │   ├── MenuForm.tsx       # Menu details form
│   │   └── Sidebar.tsx        # Sidebar navigation
│   ├── store/
│   │   └── menu.store.ts      # Zustand store
│   ├── pages/
│   │   ├── Index.tsx          # Main page
│   │   └── NotFound.tsx       # 404 page
│   ├── App.tsx                # App entry
│   └── global.css             # Global styles
├── server/                    # Express backend
│   ├── services/
│   │   └── menu.service.ts    # Business logic
│   ├── routes/
│   │   ├── menus.ts           # Menu endpoints
│   │   └── demo.ts            # Demo endpoint
│   └── index.ts               # Server setup
├── shared/                    # Shared types
│   └── api.ts                 # API interfaces
├── prisma/                    # Database
│   ├── schema.prisma          # Schema definition
│   └── dev.db                 # SQLite database
├── package.json               # Dependencies
├── vite.config.ts             # Vite config
├── vite.config.server.ts      # Server build config
├── Dockerfile                 # Container image
├── docker-compose.yml         # Docker composition
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- pnpm (preferred) or npm
- Docker (optional, for containerized deployment)

### Development Setup

1. **Clone and install dependencies**
   ```bash
   cd "Technical Test - STK"
   pnpm install
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

3. **Initialize database**
   ```bash
   pnpm prisma db push
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

   The application will be available at `http://localhost:8080`

## 📝 API Documentation

### Endpoints

All endpoints are prefixed with `/api`

#### Get All Menus
```http
GET /menus
```
Returns all menu items in tree structure.

**Response:**
```json
{
  "data": [
    {
      "id": "1",
      "name": "system_management",
      "label": "System Management",
      "depth": 1,
      "order": 0,
      "parentId": null,
      "children": [],
      "createdAt": "2024-01-21T10:00:00Z",
      "updatedAt": "2024-01-21T10:00:00Z"
    }
  ]
}
```

#### Get Menu by ID
```http
GET /menus/:id
```

#### Create Menu
```http
POST /menus
Content-Type: application/json

{
  "name": "new_menu",
  "label": "New Menu",
  "parentId": "1"  // optional
}
```

#### Update Menu
```http
PUT /menus/:id
Content-Type: application/json

{
  "name": "updated_name",
  "label": "Updated Label",
  "parentId": "1"  // optional
}
```

#### Delete Menu
```http
DELETE /menus/:id
```
Deletes menu and all children.

#### Move Menu
```http
PATCH /menus/:id/move
Content-Type: application/json

{
  "parentId": "new-parent-id"  // null for root
}
```

#### Reorder Menu
```http
PATCH /menus/:id/reorder
Content-Type: application/json

{
  "order": 2
}
```

### Error Responses

```json
{
  "error": "VALIDATION_ERROR",
  "message": "Name is required"
}
```

### Swagger Documentation

Interactive API documentation is available at: `http://localhost:8080/api/docs`

## 🎨 Features

### Core Features ✅
- [x] Display menu tree in hierarchical structure
- [x] Add new menu items at any level
- [x] Edit existing menu items inline or via modal
- [x] Delete menu items with confirmation
- [x] Expand/collapse nested menu items
- [x] RESTful API with proper error handling
- [x] Input validation using Zod
- [x] TypeScript throughout
- [x] Responsive design

### Bonus Features ✅
- [x] State management with Zustand
- [x] Drag-and-drop ready architecture
- [x] Docker support (development & production)
- [x] Swagger/OpenAPI documentation
- [x] Service layer pattern
- [x] Custom dialogs for CRUD operations
- [x] Menu details panel
- [x] Real-time UI updates

## 📦 Available Scripts

```bash
# Development
pnpm dev              # Start dev server with hot reload

# Building
pnpm build            # Build for production
pnpm build:client     # Build only frontend
pnpm build:server     # Build only backend

# Running
pnpm start            # Start production server

# Quality
pnpm typecheck        # TypeScript type checking
pnpm format.fix       # Auto-format code
pnpm test             # Run tests (Vitest)

# Database
pnpm prisma db push   # Push schema to database
pnpm prisma studio   # Open Prisma Studio
```

## 🐳 Docker Setup

### Development with Docker

```bash
# Build and run
docker-compose up --build

# In another terminal, initialize database
docker exec <container-id> pnpm prisma db push
```

### Production with Docker

```bash
# Build image
docker build -t menu-tree-app .

# Run container
docker run -p 8080:8080 \
  -e NODE_ENV=production \
  -e DATABASE_URL="file:./prisma/dev.db" \
  menu-tree-app
```

## 🏗 Architecture

### Frontend Architecture

- **Component-based**: Modular React components
- **Store Pattern**: Zustand for state management
- **Hooks**: React hooks for side effects and state
- **Type Safety**: Full TypeScript typing
- **Styling**: TailwindCSS utility classes

### Backend Architecture

- **Service Layer**: Business logic separated from routes
- **Route Handlers**: Express request handlers
- **Validation**: Zod schemas for input validation
- **Error Handling**: Consistent error responses
- **In-Memory Storage**: Current implementation (database-ready)

## 🔄 Data Flow

```
User Action → React Component → Zustand Store
                                     ↓
                            Fetch API Request
                                     ↓
                            Express Route Handler
                                     ↓
                            Menu Service (Business Logic)
                                     ↓
                            In-Memory Store / Database
                                     ↓
                            Response to Client
                                     ↓
                            Store Update → Re-render
```

## 🛡 Error Handling

All API endpoints return consistent error responses:

- **400 Bad Request**: Validation errors
- **404 Not Found**: Resource not found
- **500 Internal Server Error**: Server errors

Error Response Format:
```json
{
  "error": "ERROR_CODE",
  "message": "Human readable message"
}
```

## 🚀 Deployment

### Netlify
The app is ready for Netlify deployment:

```bash
# Configure in netlify.toml (already configured)
pnpm build
# Deploy dist/spa folder
```

### Vercel
The app is also compatible with Vercel:

```bash
pnpm build
# Deploy is automatic via git integration
```

### Self-Hosted
```bash
# Build
pnpm build

# Start production server
pnpm start

# Or with PM2
pm2 start dist/server/node-build.mjs --name "menu-tree-app"
```

## 📊 Performance Considerations

- **Tree Rendering**: Optimized with React's reconciliation
- **State Management**: Zustand is lightweight and performant
- **Lazy Loading**: Ready for code splitting via dynamic imports
- **Caching**: Ready for React Query integration

## 🔮 Future Enhancements

- [ ] Database integration (PostgreSQL/MySQL)
- [ ] Authentication & Authorization
- [ ] Drag-and-drop reordering UI
- [ ] Full-text search functionality
- [ ] Menu versioning & audit logs
- [ ] Bulk operations
- [ ] Advanced filtering
- [ ] Export/Import functionality
- [ ] Multi-language support
- [ ] Performance metrics

## 📚 API Integration Guide

### Using Fetch API

```typescript
// Fetch all menus
const response = await fetch('/api/menus');
const { data } = await response.json();

// Create menu
const result = await fetch('/api/menus', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'new_menu',
    label: 'New Menu',
    parentId: null
  })
});
```

### Using Zustand Store

```typescript
import { useMenuStore } from '@/store/menu.store';

function MyComponent() {
  const { 
    menus, 
    createMenu, 
    updateMenu, 
    deleteMenu,
    isLoading,
    error 
  } = useMenuStore();

  // All state and actions are available
}
```

## 🧪 Testing

Run the test suite:

```bash
pnpm test
```

## 📝 Code Quality

- **TypeScript**: Strict type checking
- **Prettier**: Code formatting
- **ESLint**: Linting (can be added)
- **Zod**: Runtime validation

## 🔐 Security Considerations

- Input validation with Zod
- Error messages don't expose sensitive information
- CORS enabled for same-origin requests
- No sensitive data in database (in-memory for demo)

## 📄 License

MIT License - feel free to use this project

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support

For issues and questions:
- Check the documentation
- Review API examples
- Check the Swagger docs at `/api/docs`

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Express.js Guide](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
- [Zod Documentation](https://zod.dev)

---

**Built with ❤️ using React, Express, and TypeScript**

Version 1.0.0 - January 2024
