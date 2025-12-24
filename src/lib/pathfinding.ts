import { Point, BoundingBox } from '../types';

interface Node {
  x: number;
  y: number;
  g: number; // cost from start
  h: number; // heuristic to goal
  f: number; // g + h
  parent: Node | null;
}

/**
 * A* pathfinding on cost map to find lowest-cost path between two points
 * Limited to a local window for performance
 */
export function findLowestCostPath(
  start: Point,
  goal: Point,
  costMap: Float32Array,
  width: number,
  height: number,
  windowSize: number = 200
): Point[] {
  // Clamp points to image bounds
  start = {
    x: Math.max(0, Math.min(width - 1, Math.round(start.x))),
    y: Math.max(0, Math.min(height - 1, Math.round(start.y)))
  };
  
  goal = {
    x: Math.max(0, Math.min(width - 1, Math.round(goal.x))),
    y: Math.max(0, Math.min(height - 1, Math.round(goal.y)))
  };

  // Define search window (adaptive based on distance)
  const distance = Math.sqrt(
    Math.pow(goal.x - start.x, 2) + Math.pow(goal.y - start.y, 2)
  );
  const adaptiveWindow = Math.min(windowSize, Math.max(100, distance * 1.5));
  
  const bbox: BoundingBox = {
    minX: Math.max(0, Math.floor(Math.min(start.x, goal.x) - adaptiveWindow / 2)),
    minY: Math.max(0, Math.floor(Math.min(start.y, goal.y) - adaptiveWindow / 2)),
    maxX: Math.min(width - 1, Math.ceil(Math.max(start.x, goal.x) + adaptiveWindow / 2)),
    maxY: Math.min(height - 1, Math.ceil(Math.max(start.y, goal.y) + adaptiveWindow / 2))
  };

  const heuristic = (x: number, y: number): number => {
    return Math.sqrt(Math.pow(x - goal.x, 2) + Math.pow(y - goal.y, 2));
  };

  const openSet: Node[] = [];
  const closedSet = new Set<string>();
  
  const startNode: Node = {
    x: start.x,
    y: start.y,
    g: 0,
    h: heuristic(start.x, start.y),
    f: heuristic(start.x, start.y),
    parent: null
  };
  
  openSet.push(startNode);

  const getNodeKey = (x: number, y: number) => `${x},${y}`;

  let iterations = 0;
  const maxIterations = 10000;

  while (openSet.length > 0 && iterations < maxIterations) {
    iterations++;
    
    // Find node with lowest f score
    let currentIdx = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (openSet[i].f < openSet[currentIdx].f) {
        currentIdx = i;
      }
    }
    
    const current = openSet[currentIdx];
    
    // Check if we reached the goal
    if (Math.abs(current.x - goal.x) <= 1 && Math.abs(current.y - goal.y) <= 1) {
      return reconstructPath(current);
    }
    
    // Move current from open to closed
    openSet.splice(currentIdx, 1);
    closedSet.add(getNodeKey(current.x, current.y));
    
    // Check 8-connected neighbors
    const neighbors = [
      { dx: -1, dy: 0 }, { dx: 1, dy: 0 },
      { dx: 0, dy: -1 }, { dx: 0, dy: 1 },
      { dx: -1, dy: -1 }, { dx: -1, dy: 1 },
      { dx: 1, dy: -1 }, { dx: 1, dy: 1 }
    ];
    
    for (const { dx, dy } of neighbors) {
      const nx = current.x + dx;
      const ny = current.y + dy;
      
      // Check bounds (within search window)
      if (nx < bbox.minX || nx > bbox.maxX || ny < bbox.minY || ny > bbox.maxY) {
        continue;
      }
      
      const nodeKey = getNodeKey(nx, ny);
      if (closedSet.has(nodeKey)) {
        continue;
      }
      
      const idx = ny * width + nx;
      const cost = costMap[idx] || 1.0;
      
      // Diagonal moves cost more
      const moveCost = (dx !== 0 && dy !== 0) ? Math.SQRT2 : 1.0;
      const tentativeG = current.g + cost * moveCost;
      
      // Check if neighbor is already in open set
      let neighborNode = openSet.find(n => n.x === nx && n.y === ny);
      
      if (!neighborNode) {
        neighborNode = {
          x: nx,
          y: ny,
          g: tentativeG,
          h: heuristic(nx, ny),
          f: tentativeG + heuristic(nx, ny),
          parent: current
        };
        openSet.push(neighborNode);
      } else if (tentativeG < neighborNode.g) {
        // Found a better path to this neighbor
        neighborNode.g = tentativeG;
        neighborNode.f = tentativeG + neighborNode.h;
        neighborNode.parent = current;
      }
    }
  }
  
  // No path found, return straight line
  return [start, goal];
}

function reconstructPath(node: Node): Point[] {
  const path: Point[] = [];
  let current: Node | null = node;
  
  while (current !== null) {
    path.unshift({ x: current.x, y: current.y });
    current = current.parent;
  }
  
  return path;
}

/**
 * Simplify path by removing collinear points (Douglas-Peucker style)
 */
export function simplifyPath(points: Point[], tolerance: number = 1.0): Point[] {
  if (points.length <= 2) return points;
  
  const simplified: Point[] = [points[0]];
  
  for (let i = 1; i < points.length - 1; i++) {
    const prev = simplified[simplified.length - 1];
    const curr = points[i];
    const next = points[i + 1];
    
    // Calculate perpendicular distance from current point to line prev-next
    const dist = perpendicularDistance(curr, prev, next);
    
    if (dist > tolerance) {
      simplified.push(curr);
    }
  }
  
  simplified.push(points[points.length - 1]);
  return simplified;
}

function perpendicularDistance(point: Point, lineStart: Point, lineEnd: Point): number {
  const dx = lineEnd.x - lineStart.x;
  const dy = lineEnd.y - lineStart.y;
  const mag = Math.sqrt(dx * dx + dy * dy);
  
  if (mag < 0.001) return 0;
  
  const u = ((point.x - lineStart.x) * dx + (point.y - lineStart.y) * dy) / (mag * mag);
  
  const closestX = lineStart.x + u * dx;
  const closestY = lineStart.y + u * dy;
  
  return Math.sqrt(
    Math.pow(point.x - closestX, 2) + Math.pow(point.y - closestY, 2)
  );
}
