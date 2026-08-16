import dagre from 'dagre';
import { AppNode, AppEdge } from '../types/workflow';

const NODE_WIDTH = 280;
const NODE_HEIGHT = 160;

/**
 * Dagre-based auto layout engine for hierarchical graph arrangement.
 * Supports 'LR' (Horizontal Left-to-Right) and 'TB' (Vertical Top-to-Bottom).
 */
export function getLayoutedElements(
  nodes: AppNode[],
  edges: AppEdge[],
  direction: 'LR' | 'TB' = 'LR'
): { nodes: AppNode[]; edges: AppEdge[] } {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  const isHorizontal = direction === 'LR';

  dagreGraph.setGraph({
    rankdir: direction,
    align: 'DL',
    nodesep: isHorizontal ? 60 : 80,
    ranksep: isHorizontal ? 90 : 80,
    marginx: 50,
    marginy: 50,
  });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, {
      width: NODE_WIDTH,
      height: NODE_HEIGHT,
    });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes: AppNode[] = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
    };
  });

  return {
    nodes: layoutedNodes,
    edges,
  };
}
