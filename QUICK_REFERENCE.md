# Quick Reference Guide

A quick lookup guide for common tasks and commands.

## 🚀 Getting Started (60 seconds)

```bash
# 1. Install dependencies
pnpm install

# 2. Start development server
pnpm dev

# 3. Open in browser
http://localhost:8080
```

## 📖 Documentation

| Document | Purpose |
|----------|---------|
| **README.md** | Complete setup and features guide |
| **ARCHITECTURE.md** | System design and data flow |
| **API_EXAMPLES.md** | API usage examples and tests |
| **IMPLEMENTATION_SUMMARY.md** | What was built and status |
| **This file** | Quick reference |

## 🎯 Common Tasks

### Development
```bash
# Start dev server with hot reload
pnpm dev

# Type check
pnpm typecheck

# Format code
pnpm format.fix

# Run tests
pnpm test

# Run tests in watch mode
pnpm test:watch
```

### Building
```bash
# Full build
pnpm build

# Build frontend only
pnpm build:client

# Build backend only
pnpm build:server

# Start production
pnpm start
```

### Docker
```bash
# Build image
pnpm docker:build

# Run image
pnpm docker:run

# Development with Docker Compose
pnpm docker:compose
```

## 🔌 API Endpoints

### Base URL
```
http://localhost:8080/api
```

### Endpoints
```
GET    /menus              - Get all menus
GET    /menus/:id          - Get one menu
POST   /menus              - Create menu
PUT    /menus/:id          - Update menu
DELETE /menus/:id          - Delete menu
PATCH  /menus/:id/move     - Move menu
PATCH  /menus/:id/reorder  - Reorder menu
GET    /docs               - Swagger documentation
```

## 📝 Quick Examples

### Create Menu (cURL)
```bash
curl -X POST http://localhost:8080/api/menus \
  -H "Content-Type: application/json" \
  -d '{"name":"my_menu","label":"My Menu"}'
```

### Create Menu (JavaScript)
```javascript
const response = await fetch('/api/menus', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'my_menu',
    label: 'My Menu'
  })
});
```

### Using Zustand Store (React)
```typescript
import { useMenuStore } from '@/store/menu.store';

function MyComponent() {
  const { menus, createMenu, deleteMenu } = useMenuStore();
  
  return (
    <button onClick={() => createMenu({ name: 'test', label: 'Test' })}>
      Add Menu
    </button>
  );
}
```

## 📁 File Structure

```
client/              - React frontend
├── components/      - React components
├── store/           - Zustand store
└── pages/           - Page components

server/              - Express backend
├── services/        - Business logic
└── routes/          - API endpoints

shared/              - Shared types
prisma/              - Database config
```

## 🧪 Testing

```bash
# Run all tests
pnpm test

# Watch mode
pnpm test:watch

# Specific file
pnpm vitest server/services/menu.service.spec.ts

# Coverage
pnpm vitest --coverage
```

### Test Results
- ✅ 27 tests passing
- ✅ 22 MenuService tests
- ✅ 5 utility tests
- ⏱️ ~1.5 seconds

## 🔐 Environment Variables

```env
DATABASE_URL="file:./prisma/dev.db"
PORT=8080
NODE_ENV=development
```

## 🐛 Troubleshooting

### Port already in use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9

# Or use different port
PORT=3000 pnpm dev
```

### Dependencies issue
```bash
# Clear and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### TypeScript errors
```bash
# Type check
pnpm typecheck

# Fix common issues
pnpm format.fix
```

## 📊 Performance

| Operation | Time |
|-----------|------|
| Dev start | ~5s |
| Build | ~6s |
| Tests | ~1.5s |
| TypeCheck | ~2s |
| API call | <10ms |

## 🚀 Deployment

### Vercel
```bash
pnpm build
# Deploy dist/spa folder
```

### Netlify
```bash
# netlify.toml already configured
pnpm build
# Deploy dist/spa folder
```

### Docker
```bash
docker build -t menu-app .
docker run -p 8080:8080 menu-app
```

### Self-hosted
```bash
pnpm build
pnpm start
```

## 📚 Technology Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Zustand |
| Backend | Express, TypeScript |
| Styling | TailwindCSS, Radix UI |
| Database | Prisma, SQLite |
| Testing | Vitest |
| Container | Docker |

## 🎓 Learning Resources

- [React Docs](https://react.dev)
- [Express Guide](https://expressjs.com)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Zustand Docs](https://github.com/pmndrs/zustand)
- [Zod Docs](https://zod.dev)

## 💡 Tips

### Keep console clean
```bash
# In .env
NODE_ENV=production
```

### Enable TypeScript strict mode
Already enabled in `tsconfig.json`

### Auto-save formatting
Prettier is configured to auto-format on save in VS Code

### Database reset
```bash
# Remove database file
rm prisma/dev.db

# Recreate
pnpm dev
```

## ⚡ Keyboard Shortcuts (VS Code)

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + K Cmd/Ctrl + F` | Format document |
| `Cmd/Ctrl + .` | Quick fix |
| `F5` | Debug |
| `Cmd/Ctrl + Shift + D` | Go to definition |

## 🔍 Debugging

### Browser DevTools
- React DevTools extension
- Redux DevTools (can work with Zustand)
- Network tab for API calls

### VS Code
```javascript
// Add breakpoint and hit F5
debugger;
```

### Logging
```typescript
// Use console in React
console.log('state:', state);

// Server logging
console.log('API call:', req.method, req.path);
```

## 📞 Support

### API Documentation
```
http://localhost:8080/api/docs
```

### Common Issues
1. Check README.md for setup
2. Read ARCHITECTURE.md for system design
3. See API_EXAMPLES.md for usage
4. Review test files for examples

## 🎉 Success Checklist

- [x] Dependencies installed
- [x] Development server running
- [x] Tests passing
- [x] TypeScript checking passes
- [x] API responding
- [x] UI interactive
- [x] Build successful

## Next Steps

1. **Explore**: Check `http://localhost:8080/api/docs`
2. **Test**: Try creating menus in the UI
3. **Understand**: Read ARCHITECTURE.md
4. **Develop**: Make changes and see hot reload
5. **Deploy**: Follow deployment section above

---

**Version 1.0.0** | January 21, 2024
