import { ChevronDown, Plus } from "lucide-react";
import { useState, useRef, useEffect } from "react";

interface TreeNode {
  id: string;
  label: string;
  depth: number;
  expanded?: boolean;
  hasChildren?: boolean;
  hasAddButton?: boolean;
  children?: TreeNode[];
}

const menuData: TreeNode[] = [
  {
    id: "1",
    label: "system management",
    depth: 1,
    expanded: true,
    hasChildren: true,
    children: [
      {
        id: "1-1",
        label: "System Management",
        depth: 2,
        expanded: true,
        hasChildren: true,
        children: [
          {
            id: "1-1-1",
            label: "Systems",
            depth: 3,
            expanded: true,
            hasChildren: true,
            children: [
              {
                id: "1-1-1-1",
                label: "System Code",
                depth: 4,
                expanded: true,
                hasChildren: true,
                hasAddButton: true,
                children: [
                  {
                    id: "1-1-1-1-1",
                    label: "Code Registration",
                    depth: 5,
                    hasChildren: false,
                  },
                ],
              },
              {
                id: "1-1-1-2",
                label: "Code Registration - 2",
                depth: 4,
                hasChildren: false,
              },
              {
                id: "1-1-1-3",
                label: "Properties",
                depth: 4,
                hasChildren: false,
              },
              {
                id: "1-1-1-4",
                label: "Menus",
                depth: 4,
                expanded: true,
                hasChildren: true,
                children: [
                  {
                    id: "1-1-1-4-1",
                    label: "Menu Registration",
                    depth: 5,
                    hasChildren: false,
                  },
                ],
              },
              {
                id: "1-1-1-5",
                label: "API List",
                depth: 4,
                expanded: true,
                hasChildren: true,
                children: [
                  {
                    id: "1-1-1-5-1",
                    label: "API Registration",
                    depth: 5,
                    hasChildren: false,
                  },
                  {
                    id: "1-1-1-5-2",
                    label: "API Edit",
                    depth: 5,
                    hasChildren: false,
                  },
                ],
              },
            ],
          },
          {
            id: "1-1-2",
            label: "Users & Groups",
            depth: 3,
            expanded: true,
            hasChildren: true,
            children: [
              {
                id: "1-1-2-1",
                label: "Users ",
                depth: 4,
                expanded: true,
                hasChildren: true,
                children: [
                  {
                    id: "1-1-2-1-1",
                    label: "User Account Registration",
                    depth: 5,
                    hasChildren: false,
                  },
                ],
              },
              {
                id: "1-1-2-2",
                label: "Groups",
                depth: 4,
                expanded: true,
                hasChildren: true,
                children: [
                  {
                    id: "1-1-2-2-1",
                    label: "User Group Registration",
                    depth: 5,
                    hasChildren: false,
                  },
                ],
              },
              {
                id: "1-1-2-3",
                label: "사용자 승인",
                depth: 4,
                expanded: true,
                hasChildren: true,
                children: [
                  {
                    id: "1-1-2-3-1",
                    label: "사용자 승인 상세",
                    depth: 5,
                    hasChildren: false,
                  },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
];

// Calculate padding based on depth (in pixels)
const getPaddingLeft = (depth: number): number => {
  return (depth - 1) * 26 + 13;
};

interface TreeItemProps {
  node: TreeNode;
  expanded: boolean;
  onToggle: (id: string) => void;
  itemRef: React.RefObject<HTMLDivElement>;
}

function TreeItem({ node, expanded, onToggle, itemRef }: TreeItemProps) {
  const paddingLeft = getPaddingLeft(node.depth);

  return (
    <div
      ref={itemRef}
      className="flex items-center gap-3 h-[26px] relative mb-3"
      style={{ paddingLeft: `${paddingLeft}px` }}
      data-node-id={node.id}
      data-depth={node.depth}
    >
      {/* Toggle button */}
      {node.hasChildren && (
        <button
          onClick={() => onToggle(node.id)}
          className="flex items-center justify-center w-[26px] h-[26px] rounded-full bg-white hover:bg-gray-50 transition-colors flex-shrink-0"
        >
          <ChevronDown
            className={`w-3.5 h-3.5 text-gray-900 transition-transform ${
              expanded ? "" : "-rotate-90"
            }`}
          />
        </button>
      )}

      {!node.hasChildren && (
        <div className="w-[26px] h-[26px] flex-shrink-0" />
      )}

      {/* Label */}
      <span className="text-sm font-normal leading-[14px] tracking-[-0.28px] text-gray-900">
        {node.label}
      </span>

      {/* Add button */}
      {node.hasAddButton && (
        <button className="flex items-center justify-center w-[26px] h-[26px] rounded-full bg-blue-primary hover:bg-blue-secondary transition-colors flex-shrink-0 ml-auto">
          <Plus className="w-3.5 h-3.5 text-white" strokeWidth={2} />
        </button>
      )}
    </div>
  );
}

interface RenderTreeProps {
  nodes: TreeNode[];
  expanded: Map<string, boolean>;
  onToggle: (id: string) => void;
  itemRefs: Map<string, React.RefObject<HTMLDivElement>>;
}

function RenderTree({ nodes, expanded, onToggle, itemRefs }: RenderTreeProps) {
  return (
    <>
      {nodes.map((node) => {
        const isExpanded = expanded.get(node.id) ?? node.expanded ?? false;
        const itemRef = itemRefs.get(node.id) || { current: null };

        return (
          <div key={node.id}>
            <TreeItem
              node={node}
              expanded={isExpanded}
              onToggle={onToggle}
              itemRef={itemRef}
            />
            {isExpanded && node.children && node.children.length > 0 && (
              <RenderTree
                nodes={node.children}
                expanded={expanded}
                onToggle={onToggle}
                itemRefs={itemRefs}
              />
            )}
          </div>
        );
      })}
    </>
  );
}

export default function MenuTree() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState<Map<string, boolean>>(
    new Map(
      menuData.flatMap((node) => {
        const entries: [string, boolean][] = [];
        const collectIds = (n: TreeNode) => {
          entries.push([n.id, n.expanded ?? false]);
          n.children?.forEach(collectIds);
        };
        collectIds(node);
        return entries;
      })
    )
  );

  const itemRefs = useRef<Map<string, React.RefObject<HTMLDivElement>>>(
    new Map()
  );

  const handleToggle = (id: string) => {
    const newExpanded = new Map(expanded);
    newExpanded.set(id, !newExpanded.get(id));
    setExpanded(newExpanded);
  };

  useEffect(() => {
    // Generate connector lines
    if (!containerRef.current) return;

    const svg = containerRef.current.querySelector("svg");
    if (svg) {
      svg.remove();
    }

    const svgElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    svgElement.setAttribute("class", "absolute left-0 top-0 pointer-events-none");
    svgElement.setAttribute("style", "width: 100%; height: 100%;");

    // Get all visible items
    const items = containerRef.current.querySelectorAll(
      "[data-node-id][data-depth]"
    );

    const positions = new Map<string, { y: number; depth: number }>();
    items.forEach((item) => {
      const nodeId = item.getAttribute("data-node-id");
      const depth = parseInt(item.getAttribute("data-depth") || "1");
      const rect = item.getBoundingClientRect();
      const containerRect = containerRef.current!.getBoundingClientRect();
      const y = rect.top - containerRect.top + rect.height / 2;
      positions.set(nodeId, { y, depth });
    });

    // Function to create SVG paths
    const createConnectorLines = () => {
      const lines: SVGLineElement[] = [];

      // Track parent positions for each depth
      const depthPositions = new Map<number, number[]>();

      positions.forEach((pos, nodeId) => {
        if (!depthPositions.has(pos.depth)) {
          depthPositions.set(pos.depth, []);
        }
        depthPositions.get(pos.depth)!.push(pos.y);
      });

      // Draw vertical lines for each depth
      for (let depth = 1; depth < 5; depth++) {
        const yPositions = depthPositions.get(depth) || [];
        if (yPositions.length > 0) {
          const x = getPaddingLeft(depth);
          const minY = Math.min(...yPositions);
          const maxY = Math.max(...yPositions);

          // Vertical connector line
          const vLine = document.createElementNS(
            "http://www.w3.org/2000/svg",
            "line"
          );
          vLine.setAttribute("x1", String(x));
          vLine.setAttribute("y1", String(minY));
          vLine.setAttribute("x2", String(x));
          vLine.setAttribute("y2", String(maxY));
          vLine.setAttribute("stroke", "#98A2B3");
          vLine.setAttribute("stroke-width", "1");
          lines.push(vLine);

          // Horizontal connectors to children
          if (depth < 5) {
            const childYPositions = depthPositions.get(depth + 1) || [];
            if (childYPositions.length > 0) {
              const childX = getPaddingLeft(depth + 1);

              yPositions.forEach((parentY) => {
                childYPositions.forEach((childY) => {
                  // Simple approach: connect to nearby children
                  if (
                    childY >= parentY &&
                    childY <= (depthPositions.get(depth)?.[(depthPositions.get(depth)?.indexOf(parentY) || 0) + 1] || parentY + 100)
                  ) {
                    const hLine = document.createElementNS(
                      "http://www.w3.org/2000/svg",
                      "line"
                    );
                    hLine.setAttribute("x1", String(x));
                    hLine.setAttribute("y1", String(parentY));
                    hLine.setAttribute("x2", String(childX));
                    hLine.setAttribute("y2", String(parentY));
                    hLine.setAttribute("stroke", "#98A2B3");
                    hLine.setAttribute("stroke-width", "1");
                    lines.push(hLine);
                  }
                });
              });
            }
          }
        }
      }

      return lines;
    };

    const lines = createConnectorLines();
    lines.forEach((line) => {
      svgElement.appendChild(line);
    });

    containerRef.current.insertBefore(svgElement, containerRef.current.firstChild);
  }, [expanded]);

  // Initialize refs for all nodes
  useEffect(() => {
    const initRefs = (nodes: TreeNode[]) => {
      nodes.forEach((node) => {
        if (!itemRefs.current.has(node.id)) {
          itemRefs.current.set(node.id, { current: null });
        }
        if (node.children) {
          initRefs(node.children);
        }
      });
    };
    initRefs(menuData);
  }, []);

  return (
    <div ref={containerRef} className="relative w-full">
      <RenderTree
        nodes={menuData}
        expanded={expanded}
        onToggle={handleToggle}
        itemRefs={itemRefs.current}
      />
    </div>
  );
}
