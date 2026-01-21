# API Examples

This document contains practical examples for using the Menu Tree API.

## Base URL

```
http://localhost:8080/api
```

## Authentication

Currently, the API is public. In production, add authentication headers.

## Examples

### 1. Get All Menus

Retrieve all menus in tree structure.

**Request:**
```bash
curl -X GET http://localhost:8080/api/menus
```

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
      "children": [
        {
          "id": "1-1",
          "name": "system_mgmt",
          "label": "System Management",
          "depth": 2,
          "order": 0,
          "parentId": "1",
          "children": [],
          "createdAt": "2024-01-21T10:00:00Z",
          "updatedAt": "2024-01-21T10:00:00Z"
        }
      ],
      "createdAt": "2024-01-21T10:00:00Z",
      "updatedAt": "2024-01-21T10:00:00Z"
    }
  ]
}
```

---

### 2. Get Single Menu

Retrieve a specific menu and its children.

**Request:**
```bash
curl -X GET http://localhost:8080/api/menus/1
```

**Response:**
```json
{
  "data": {
    "id": "1",
    "name": "system_management",
    "label": "System Management",
    "depth": 1,
    "order": 0,
    "parentId": null,
    "children": [
      {
        "id": "1-1",
        "name": "system_mgmt",
        "label": "System Management",
        "depth": 2,
        "order": 0,
        "parentId": "1",
        "children": [],
        "createdAt": "2024-01-21T10:00:00Z",
        "updatedAt": "2024-01-21T10:00:00Z"
      }
    ],
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T10:00:00Z"
  }
}
```

---

### 3. Create Root Menu

Create a top-level menu item.

**Request:**
```bash
curl -X POST http://localhost:8080/api/menus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "my_menu",
    "label": "My Menu"
  }'
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "7f5e4e9a-1234-5678-90ab-cdefghijklmn",
    "name": "my_menu",
    "label": "My Menu",
    "depth": 1,
    "order": 1,
    "parentId": null,
    "createdAt": "2024-01-21T12:30:00Z",
    "updatedAt": "2024-01-21T12:30:00Z"
  }
}
```

---

### 4. Create Child Menu

Create a menu under an existing parent.

**Request:**
```bash
curl -X POST http://localhost:8080/api/menus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "child_menu",
    "label": "Child Menu",
    "parentId": "1"
  }'
```

**Response (201 Created):**
```json
{
  "data": {
    "id": "a1b2c3d4-e5f6-4g7h-8i9j-0k1l2m3n4o5p",
    "name": "child_menu",
    "label": "Child Menu",
    "depth": 2,
    "order": 1,
    "parentId": "1",
    "createdAt": "2024-01-21T12:35:00Z",
    "updatedAt": "2024-01-21T12:35:00Z"
  }
}
```

---

### 5. Update Menu

Update a menu's name, label, or parent.

**Request:**
```bash
curl -X PUT http://localhost:8080/api/menus/1 \
  -H "Content-Type: application/json" \
  -d '{
    "name": "updated_name",
    "label": "Updated Label"
  }'
```

**Response:**
```json
{
  "data": {
    "id": "1",
    "name": "updated_name",
    "label": "Updated Label",
    "depth": 1,
    "order": 0,
    "parentId": null,
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T12:40:00Z"
  }
}
```

---

### 6. Move Menu to Different Parent

Move a menu item to a different parent (changes depth automatically).

**Request:**
```bash
curl -X PATCH http://localhost:8080/api/menus/1-1/move \
  -H "Content-Type: application/json" \
  -d '{
    "parentId": "2"
  }'
```

**Response:**
```json
{
  "data": {
    "id": "1-1",
    "name": "system_mgmt",
    "label": "System Management",
    "depth": 2,
    "order": 0,
    "parentId": "2",
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T12:45:00Z"
  }
}
```

---

### 7. Move Menu to Root

Move a menu to the root level (null parent).

**Request:**
```bash
curl -X PATCH http://localhost:8080/api/menus/1-1/move \
  -H "Content-Type: application/json" \
  -d '{
    "parentId": null
  }'
```

**Response:**
```json
{
  "data": {
    "id": "1-1",
    "name": "system_mgmt",
    "label": "System Management",
    "depth": 1,
    "order": 0,
    "parentId": null,
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T12:50:00Z"
  }
}
```

---

### 8. Reorder Menu

Change the order of a menu within its siblings.

**Request:**
```bash
curl -X PATCH http://localhost:8080/api/menus/1/reorder \
  -H "Content-Type: application/json" \
  -d '{
    "order": 2
  }'
```

**Response:**
```json
{
  "data": {
    "id": "1",
    "name": "system_management",
    "label": "System Management",
    "depth": 1,
    "order": 2,
    "parentId": null,
    "createdAt": "2024-01-21T10:00:00Z",
    "updatedAt": "2024-01-21T12:55:00Z"
  }
}
```

---

### 9. Delete Menu

Delete a menu and all its children.

**Request:**
```bash
curl -X DELETE http://localhost:8080/api/menus/1
```

**Response (204 No Content):**
```
[Empty response body]
```

---

## Error Examples

### 400 - Validation Error

Missing required field:

**Request:**
```bash
curl -X POST http://localhost:8080/api/menus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "menu_without_label"
  }'
```

**Response:**
```json
{
  "error": "VALIDATION_ERROR",
  "message": "Label is required"
}
```

---

### 404 - Not Found

Trying to access non-existent menu:

**Request:**
```bash
curl -X GET http://localhost:8080/api/menus/non-existent-id
```

**Response:**
```json
{
  "error": "NOT_FOUND",
  "message": "Menu not found"
}
```

---

### 404 - Parent Not Found

Creating a menu with non-existent parent:

**Request:**
```bash
curl -X POST http://localhost:8080/api/menus \
  -H "Content-Type: application/json" \
  -d '{
    "name": "orphan_menu",
    "label": "Orphan Menu",
    "parentId": "non-existent-parent"
  }'
```

**Response:**
```json
{
  "error": "PARENT_NOT_FOUND",
  "message": "Parent menu not found"
}
```

---

## Using with JavaScript

### Fetch API

```javascript
// Get all menus
const response = await fetch('/api/menus');
const { data } = await response.json();
console.log(data);

// Create menu
const createResponse = await fetch('/api/menus', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'new_menu',
    label: 'New Menu',
    parentId: null
  })
});

if (!createResponse.ok) {
  const error = await createResponse.json();
  console.error(error.message);
} else {
  const { data: newMenu } = await createResponse.json();
  console.log('Created:', newMenu);
}
```

### Using Zustand Store (React)

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

  // Fetch all menus
  useEffect(() => {
    useMenuStore().fetchMenus();
  }, []);

  // Create menu
  const handleCreate = async () => {
    await createMenu({
      name: 'new_menu',
      label: 'New Menu',
      parentId: null
    });
  };

  // Update menu
  const handleUpdate = async (id: string) => {
    await updateMenu(id, {
      label: 'Updated Label'
    });
  };

  // Delete menu
  const handleDelete = async (id: string) => {
    await deleteMenu(id);
  };

  return (
    <div>
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {/* Display menus */}
    </div>
  );
}
```

## Rate Limiting

Currently, no rate limiting is implemented. For production, add:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## CORS Configuration

Currently, CORS is enabled for all origins. For production:

```javascript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(','),
  credentials: true
}));
```

## Testing with Postman

1. Import collection from `Postman_Collection.json` (when available)
2. Or manually create requests following the examples above
3. Set `{{base_url}}` to `http://localhost:8080/api`

## GraphQL Ready

The API can be wrapped with GraphQL. Example setup:

```javascript
import { graphqlHTTP } from 'express-graphql';
import { buildSchema } from 'graphql';

// Define schema
// Create resolvers
// Mount GraphQL endpoint
app.use('/graphql', graphqlHTTP({
  schema: schema,
  rootValue: root,
  graphiql: true,
}));
```

## Pagination (Future)

When implementing pagination:

```bash
curl -X GET "http://localhost:8080/api/menus?page=1&limit=20"
```

Response:

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

---

## Documentation

- **Swagger UI**: http://localhost:8080/api/docs
- **Interactive testing**: Available in Swagger UI
- **API Reference**: This file
- **Architecture**: See ARCHITECTURE.md
