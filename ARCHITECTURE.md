# Architecture Documentation

## System Overview

This is a full-stack hierarchical menu management system built with React and Express, designed with clear separation of concerns and scalability in mind.

```
┌─────────────────────────────────────────────────────────────┐
│                      Client (React/TypeScript)               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │              React Components Layer                   │   │
│  │  ├─ MenuTree.tsx      (Tree rendering & interaction) │   │
│  │  ├─ MenuForm.tsx      (Details display)              │   │
│  │  └─ Sidebar.tsx       (Navigation)                   │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Zustand Store (State Management)            │   │
│  │  ├─ menus[]          (Menu data)                      │   │
│  │  ├─ selectedMenuId   (Active menu)                   │   │
│  │  ├─ isLoading        (Loading state)                 │   │
│  │  └─ actions          (CRUD operations)               │   │
│  └──────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────┤
│                    HTTP/REST API Layer                      │
├─────────────────────────────────────────────────────────────┤
│                   Server (Express/TypeScript)               │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Route Handlers Layer                     │   │
│  │  ├─ GET    /api/menus       (Fetch all)              │   │
│  │  ├─ GET    /api/menus/:id   (Fetch one)              │   │
│  │  ├─ POST   /api/menus       (Create)                 │   │
│  │  ├─ PUT    /api/menus/:id   (Update)                 │   │
│  │  ├─ DELETE /api/menus/:id   (Delete)                 │   │
│  │  ├─ PATCH  /api/menus/:id/move      (Move)           │   │
│  │  └─ PATCH  /api/menus/:id/reorder   (Reorder)        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │           Business Logic (Service Layer)              │   │
│  │  ├─ MenuService.createMenu()                         │   │
│  │  ├─ MenuService.updateMenu()                         │   │
│  │  ├─ MenuService.deleteMenu()                         │   │
│  │  ├─ MenuService.moveMenu()                           │   │
│  │  ├─ MenuService.reorderMenu()                        │   │
│  │  └─ MenuService.getAllMenus()                        │   │
│  └──────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Data Storage Layer                       │   │
│  │  ├─ PostgreSQL Database                              │   │
│  │  └─ Prisma ORM (v5.22.0)                             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

#### MenuTree Component
- **Purpose**: Renders hierarchical menu structure
- **Responsibilities**:
  - Display menu items with expand/collapse
  - Show action buttons (add, edit, delete)
  - Handle tree navigation
  - Communicate with Zustand store

- **Props**: None (uses Zustand store)
- **State**: 
  - `expanded`: Track expanded nodes
  - Dialog states: delete, edit, add

#### MenuForm Component
- **Purpose**: Display selected menu item details
- **Responsibilities**:
  - Show menu properties (ID, depth, parent, name, label)
  - Display timestamps
  - Read-only display

- **Props**: None (uses Zustand store)
- **Data Source**: `useMenuStore().selectedMenuId`

#### Sidebar Component
- **Purpose**: Navigation and branding
- **Responsibilities**:
  - Show app logo and menu
  - Navigate to different sections
  - Display active menu status

## State Management Architecture

### Zustand Store (`useMenuStore`)

```typescript
interface MenuStore {
  // State
  menus: MenuItem[]           // All menus in tree
  selectedMenuId: string | null
  isLoading: boolean
  error: string | null

  // Actions
  fetchMenus()
  selectMenu(id)
  createMenu(input)
  updateMenu(id, input)
  deleteMenu(id)
  moveMenu(id, parentId)
  reorderMenu(id, order)
  setError(error)
}
```

### State Flow
```
User Action
    ↓
Component calls store action
    ↓
Action calls API (fetch/async)
    ↓
API returns data
    ↓
Store updates state
    ↓
Component re-renders (React subscription)
```

## Backend Architecture

### Service Layer Pattern

The `MenuService` implements the business logic layer, separating concerns from HTTP handlers.

```typescript
export const MenuService = {
  // Query operations
  getAllMenus()
  getMenuById(id)
  getMenuWithChildren(id)

  // Mutation operations
  createMenu(input)
  updateMenu(id, input)
  deleteMenu(id)
  moveMenu(id, parentId)
  reorderMenu(id, order)
}
```

### Route Handler Pattern

Each route handler:
1. Validates input using Zod
2. Calls service layer
3. Handles errors consistently
4. Returns appropriate HTTP status

```typescript
export const createMenu: RequestHandler = (req, res) => {
  // 1. Validate
  const validationResult = createMenuSchema.safeParse(req.body);
  if (!validationResult.success) {
    return res.status(400).json({ error: "VALIDATION_ERROR" });
  }

  // 2. Call service
  const newMenu = MenuService.createMenu(validationResult.data);

  // 3. Return response
  res.status(201).json({ data: newMenu });
};
```

## Data Model

### MenuItem Type
```typescript
interface MenuItem {
  id: string              // Unique identifier (UUID)
  name: string            // Machine-readable name
  label: string           // Human-readable label
  depth: number           // Hierarchical level (1-based)
  order: number           // Sort order within siblings
  parentId: string | null // Parent reference
  children?: MenuItem[]   // Child items (computed)
  createdAt: string       // ISO timestamp
  updatedAt: string       // ISO timestamp
}
```

### Parent-Child Relationships
- Root items: `parentId = null`
- Depth calculation: `child.depth = parent.depth + 1`
- Tree structure: Children organized by `parentId`

## Data Flow Examples

### Creating a Menu Item
```
User clicks "Add" button
    ↓
MenuTree opens "Add Dialog"
    ↓
User enters name and label
    ↓
User clicks "Create Menu"
    ↓
Store calls createMenu(input)
    ↓
fetch POST /api/menus
    ↓
Express route validates input
    ↓
MenuService.createMenu() creates item
    ↓
In-memory store updated
    ↓
Response returned to client
    ↓
Store calls fetchMenus() to refresh
    ↓
Menus list updated
    ↓
Dialog closed, tree re-rendered
```

### Moving a Menu Item
```
User drags menu to new parent (future)
    ↓
Store calls moveMenu(id, newParentId)
    ↓
fetch PATCH /api/menus/:id/move
    ↓
Express validates parent exists
    ↓
MenuService.moveMenu() updates item
    ↓
Depth recalculated for descendants
    ↓
Response returned
    ↓
Tree refreshed with new structure
```

## Validation Architecture

### Input Validation with Zod

```typescript
// Define schemas
const createMenuSchema = z.object({
  name: z.string().min(1, "Name is required"),
  label: z.string().min(1, "Label is required"),
  parentId: z.string().optional().nullable(),
});

// Validate in route handler
const validationResult = createMenuSchema.safeParse(req.body);
if (!validationResult.success) {
  return res.status(400).json({
    error: "VALIDATION_ERROR",
    message: validationResult.error.errors[0].message,
  });
}
```

### Validation Points
1. **Input validation**: Zod schemas in route handlers
2. **Business logic validation**: 
   - Parent existence check
   - Circular reference prevention
   - Depth consistency
3. **State validation**: TypeScript types

## Error Handling

### Error Response Format
```json
{
  "error": "ERROR_CODE",
  "message": "Human readable message"
}
```

### Error Categories
- `VALIDATION_ERROR` (400): Invalid input
- `NOT_FOUND` (404): Resource doesn't exist
- `PARENT_NOT_FOUND` (404): Parent menu doesn't exist
- `INVALID_OPERATION` (400): Invalid state transition
- `INTERNAL_SERVER_ERROR` (500): Server error

### Client-Side Error Handling
```typescript
// In Zustand store
try {
  const response = await fetch('/api/menus', { method: 'POST', body });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  // Handle success
} catch (error) {
  set({ error: error.message, isLoading: false });
}
```

## Performance Considerations

### Frontend Optimization
1. **React rendering**: Only affected components re-render
2. **State management**: Zustand minimal re-render overhead
3. **Tree rendering**: Recursive rendering optimized
4. **Dialog lazy loading**: Dialogs only render when needed

### Backend Optimization
1. **In-memory storage**: O(1) lookups with Map
2. **Tree building**: O(n) tree construction on GET
3. **Depth updates**: O(n) for descendant updates (necessary)
4. **Indexing**: Ready for database queries

### Caching Opportunities
- Client-side: React Query ready integration
- Server-side: Redis caching ready
- Browser: Service worker ready

## Scalability Architecture

### Current Implementation
- In-memory storage (single process)
- Suitable for: Development, small deployments

### For Production Scale
1. **Database Migration**
   - Replace Map with database
   - Use Prisma ORM
   - Add indexes on `parentId`, `order`

2. **Caching Layer**
   - Redis for tree structure
   - Cache invalidation on mutations

3. **API Optimization**
   - Pagination for large lists
   - GraphQL for complex queries
   - Batching for multiple updates

4. **Frontend Optimization**
   - Code splitting
   - Lazy loading for deep trees
   - Virtual scrolling for large lists

## Security Architecture

### Authentication Ready
- Route protection layer ready
- JWT integration points
- User context through middleware

### Authorization Ready
- Role-based access control ready
- Resource ownership validation ready
- Audit logging ready

### Current Implementation
- Public API (for demo)
- Input validation
- Error messages don't expose internals

## Testing Architecture

### Unit Tests
- MenuService methods tested
- 22 test cases covering:
  - CRUD operations
  - Tree structure integrity
  - Depth calculations
  - Ordering logic

### Integration Tests (Ready)
- API endpoint tests
- End-to-end flows
- Error scenarios

### Setup
```bash
pnpm test              # Run once
pnpm test:watch       # Watch mode
```

## Deployment Architecture

### Development
```
pnpm dev
  ↓
Vite dev server (port 5173 or 8080)
  ↓
Express backend (same port)
  ↓
Hot reload on changes
```

### Production Build
```
pnpm build
  ├─ build:client → dist/spa/
  └─ build:server → dist/server/
```

### Docker
```
Dockerfile (multi-stage)
  ├─ Builder stage: Install & build
  └─ Runtime stage: Minimal image

docker-compose.yml
  └─ Single service setup
```

## Technology Rationale

### Frontend
- **React**: Component model, large ecosystem
- **Zustand**: Lightweight state, simple API
- **TypeScript**: Type safety, better DX
- **TailwindCSS**: Utility-first, responsive

### Backend
- **Express**: Minimal, flexible, large ecosystem
- **TypeScript**: Type safety for backend
- **Zod**: Runtime validation, type inference

### Database: PostgreSQL
- **Pros**: Production-ready, ACID compliant, scalable
- **Features**: Full persistence, advanced querying, indexing
- **ORM**: Prisma for type-safe database access

## Future Enhancements

### Phase 1: Database ✅
- ✅ Prisma ORM configured
- ✅ PostgreSQL integration
- ✅ Data persistence ready

### Phase 2: Advanced Features
- Search/filter functionality
- Bulk operations
- Versioning and audit logs

### Phase 3: Performance
- Database query optimization
- Caching layer (Redis)
- API pagination

### Phase 4: Scale
- Microservices architecture
- GraphQL API
- Real-time updates (WebSocket)

## Conclusion

This architecture provides:
- ✅ Clear separation of concerns
- ✅ Scalability through layers
- ✅ Type safety throughout
- ✅ Easy testing
- ✅ Production-ready basics
- ✅ Clear migration path

The system is designed to be simple initially but scalable for production use.
