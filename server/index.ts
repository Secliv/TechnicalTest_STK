import "dotenv/config";
import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import { handleDemo } from "./routes/demo";
import {
  getMenus,
  getMenuById,
  createMenu,
  updateMenu,
  deleteMenu,
  moveMenu,
  reorderMenu,
} from "./routes/menus";

// Swagger documentation
const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: "Menu Tree API",
    version: "1.0.0",
    description: "RESTful API for managing hierarchical menu structures",
  },
  servers: [
    {
      url: "/api",
      description: "API Server",
    },
  ],
  paths: {
    "/menus": {
      get: {
        summary: "Get all menus",
        description: "Retrieve all menu items in tree structure",
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: {
                      type: "array",
                      items: { $ref: "#/components/schemas/MenuItem" },
                    },
                  },
                },
              },
            },
          },
        },
      },
      post: {
        summary: "Create new menu item",
        description: "Create a new menu item with optional parent",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "label"],
                properties: {
                  name: { type: "string" },
                  label: { type: "string" },
                  parentId: { type: "string", nullable: true },
                },
              },
            },
          },
        },
        responses: {
          "201": {
            description: "Menu created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/MenuItem" },
                  },
                },
              },
            },
          },
          "400": { description: "Validation error" },
          "404": { description: "Parent not found" },
        },
      },
    },
    "/menus/{id}": {
      get: {
        summary: "Get menu by ID",
        description: "Retrieve a specific menu item with its children",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "200": {
            description: "Successful response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/MenuItem" },
                  },
                },
              },
            },
          },
          "404": { description: "Menu not found" },
        },
      },
      put: {
        summary: "Update menu item",
        description: "Update menu item properties",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  label: { type: "string" },
                  parentId: { type: "string", nullable: true },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Menu updated successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/MenuItem" },
                  },
                },
              },
            },
          },
          "404": { description: "Menu not found" },
        },
      },
      delete: {
        summary: "Delete menu item",
        description: "Delete a menu item and all its children",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        responses: {
          "204": { description: "Menu deleted successfully" },
          "404": { description: "Menu not found" },
        },
      },
    },
    "/menus/{id}/move": {
      patch: {
        summary: "Move menu to different parent",
        description: "Move a menu item to a different parent node",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  parentId: { type: "string", nullable: true },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Menu moved successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/MenuItem" },
                  },
                },
              },
            },
          },
          "404": { description: "Menu not found" },
        },
      },
    },
    "/menus/{id}/reorder": {
      patch: {
        summary: "Reorder menu within same level",
        description: "Change the order of a menu item within its siblings",
        parameters: [
          {
            name: "id",
            in: "path",
            required: true,
            schema: { type: "string" },
          },
        ],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["order"],
                properties: {
                  order: { type: "number", minimum: 0 },
                },
              },
            },
          },
        },
        responses: {
          "200": {
            description: "Menu reordered successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    data: { $ref: "#/components/schemas/MenuItem" },
                  },
                },
              },
            },
          },
          "404": { description: "Menu not found" },
        },
      },
    },
  },
  components: {
    schemas: {
      MenuItem: {
        type: "object",
        properties: {
          id: { type: "string" },
          name: { type: "string" },
          label: { type: "string" },
          depth: { type: "integer" },
          order: { type: "integer" },
          parentId: { type: "string", nullable: true },
          children: {
            type: "array",
            items: { $ref: "#/components/schemas/MenuItem" },
          },
          createdAt: { type: "string", format: "date-time" },
          updatedAt: { type: "string", format: "date-time" },
        },
      },
    },
  },
};

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Swagger documentation
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Menu API routes
  app.get("/api/menus", getMenus);
  app.get("/api/menus/:id", getMenuById);
  app.post("/api/menus", createMenu);
  app.put("/api/menus/:id", updateMenu);
  app.delete("/api/menus/:id", deleteMenu);
  app.patch("/api/menus/:id/move", moveMenu);
  app.patch("/api/menus/:id/reorder", reorderMenu);

  return app;
}
