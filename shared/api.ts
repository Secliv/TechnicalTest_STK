/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Menu Item types
 */
export interface MenuItem {
  id: string;
  name: string;
  label: string;
  depth: number;
  order: number;
  parentId: string | null;
  children?: MenuItem[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuInput {
  name: string;
  label: string;
  parentId?: string | null;
}

export interface UpdateMenuInput {
  name?: string;
  label?: string;
  parentId?: string | null;
}

export interface MoveMenuInput {
  parentId?: string | null;
}

export interface ReorderMenuInput {
  order: number;
}

export interface MenusResponse {
  data: MenuItem[];
}

export interface MenuResponse {
  data: MenuItem;
}

export interface ErrorResponse {
  error: string;
  message: string;
}
