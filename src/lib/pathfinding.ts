// A* pathfinding for parking grid navigation

interface Node {
  row: number;
  col: number;
  g: number;
  h: number;
  f: number;
  parent: Node | null;
}

function heuristic(a: { row: number; col: number }, b: { row: number; col: number }): number {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

export interface GridCell {
  row: number;
  col: number;
  type: "lane" | "slot" | "occupied" | "entry" | "target" | "path";
}

/**
 * Build a parking floor grid.
 * Layout: row 0 = entry lane, odd rows = parking slots, even rows = driving lanes.
 * The grid has (rows*2 + 1) actual rows and (cols + 2) actual cols for lanes.
 */
export function buildFloorGrid(
  rows: number,
  cols: number,
  occupiedSlots: Set<string>,
  floor: number,
  targetSlot?: string
): { grid: GridCell[][]; entry: { row: number; col: number }; target: { row: number; col: number } | null } {
  const gridRows = rows * 2 + 1;
  const gridCols = cols + 2;
  const grid: GridCell[][] = [];

  let targetPos: { row: number; col: number } | null = null;

  for (let r = 0; r < gridRows; r++) {
    const row: GridCell[] = [];
    for (let c = 0; c < gridCols; c++) {
      if (r === 0 || r % 2 === 0 || c === 0 || c === gridCols - 1) {
        // Lanes
        row.push({ row: r, col: c, type: "lane" });
      } else {
        // Parking slots
        const slotRow = Math.floor((r - 1) / 2);
        const slotCol = c - 1;
        const slotId = `F${floor}-${String.fromCharCode(65 + slotRow)}${slotCol + 1}`;
        const isOccupied = occupiedSlots.has(slotId);
        const isTarget = targetSlot === slotId;

        if (isTarget) {
          targetPos = { row: r, col: c };
          row.push({ row: r, col: c, type: "target" });
        } else if (isOccupied) {
          row.push({ row: r, col: c, type: "occupied" });
        } else {
          row.push({ row: r, col: c, type: "slot" });
        }
      }
    }
    row[row.length] // noop
    grid.push(row);
  }

  // Entry point: middle of top lane
  const entry = { row: 0, col: Math.floor(gridCols / 2) };
  grid[entry.row][entry.col].type = "entry";

  return { grid, entry, target: targetPos };
}

/**
 * A* algorithm to find shortest path on the grid.
 * Can only walk on "lane", "entry", "target", and the immediate neighbor of "target".
 */
export function findPath(
  grid: GridCell[][],
  start: { row: number; col: number },
  end: { row: number; col: number }
): { row: number; col: number }[] {
  const rows = grid.length;
  const cols = grid[0].length;

  function isWalkable(r: number, c: number): boolean {
    if (r < 0 || r >= rows || c < 0 || c >= cols) return false;
    const t = grid[r][c].type;
    return t === "lane" || t === "entry" || t === "target";
  }

  const open: Node[] = [];
  const closed = new Set<string>();
  const key = (r: number, c: number) => `${r},${c}`;

  const startNode: Node = { row: start.row, col: start.col, g: 0, h: heuristic(start, end), f: 0, parent: null };
  startNode.f = startNode.g + startNode.h;
  open.push(startNode);

  const dirs = [
    [0, 1], [0, -1], [1, 0], [-1, 0],
  ];

  while (open.length > 0) {
    open.sort((a, b) => a.f - b.f);
    const current = open.shift()!;

    if (current.row === end.row && current.col === end.col) {
      // Reconstruct path
      const path: { row: number; col: number }[] = [];
      let node: Node | null = current;
      while (node) {
        path.unshift({ row: node.row, col: node.col });
        node = node.parent;
      }
      return path;
    }

    closed.add(key(current.row, current.col));

    for (const [dr, dc] of dirs) {
      const nr = current.row + dr;
      const nc = current.col + dc;
      if (!isWalkable(nr, nc)) continue;
      if (closed.has(key(nr, nc))) continue;

      const g = current.g + 1;
      const existing = open.find((n) => n.row === nr && n.col === nc);
      if (existing) {
        if (g < existing.g) {
          existing.g = g;
          existing.f = g + existing.h;
          existing.parent = current;
        }
      } else {
        const h = heuristic({ row: nr, col: nc }, end);
        open.push({ row: nr, col: nc, g, h, f: g + h, parent: current });
      }
    }
  }

  return []; // No path found
}
