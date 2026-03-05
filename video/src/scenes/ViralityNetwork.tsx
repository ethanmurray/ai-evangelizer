import React from "react";
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
} from "remotion";
import { ConspiracyBackground } from "../components/ConspiracyBackground";
import { NetworkNode } from "../components/NetworkNode";
import { RedLine } from "../components/RedLine";
import { fontFamily } from "../fonts";
import { COLORS } from "../theme";
import { fadeIn, fadeOut, SPRING_SNAPPY } from "../lib/animations";

// Build a binary tree of nodes
interface TreeNode {
  x: number;
  y: number;
  level: number;
  parentX?: number;
  parentY?: number;
}

function buildTree(): TreeNode[] {
  const nodes: TreeNode[] = [];
  const rootX = 960;
  const rootY = 240;
  const levelHeight = 160;
  const maxLevel = 4;

  function addNode(
    x: number,
    y: number,
    level: number,
    parentX?: number,
    parentY?: number,
  ) {
    nodes.push({ x, y, level, parentX, parentY });
    if (level < maxLevel) {
      const spread = 320 / Math.pow(2, level);
      addNode(x - spread, y + levelHeight, level + 1, x, y);
      addNode(x + spread, y + levelHeight, level + 1, x, y);
    }
  }

  addNode(rootX, rootY, 0);
  return nodes;
}

const TREE_NODES = buildTree();

export const ViralityNetwork: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const headerOpacity = fadeIn(frame, 0, 12);
  const exitOpacity = fadeOut(frame, 132, 17);

  return (
    <AbsoluteFill>
      <ConspiracyBackground />
      <AbsoluteFill style={{ opacity: exitOpacity }}>
        {/* Header */}
        <div
          style={{
            position: "absolute",
            top: 80,
            width: "100%",
            textAlign: "center",
            fontFamily: fontFamily.heading,
            fontSize: 52,
            color: COLORS.textHeading,
            opacity: headerOpacity,
          }}
        >
          Spread the Word
        </div>

        {/* Network visualization */}
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", top: 0, left: 0 }}
        >
          {/* Glow filter */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Lines (drawn behind nodes) */}
          {TREE_NODES.filter((n) => n.parentX !== undefined).map((node, i) => {
            // Each level appears progressively
            const lineStartFrame = 10 + node.level * 25;
            return (
              <RedLine
                key={`line-${i}`}
                x1={node.parentX!}
                y1={node.parentY!}
                x2={node.x}
                y2={node.y}
                startFrame={lineStartFrame}
                duration={18}
              />
            );
          })}

          {/* Nodes */}
          {TREE_NODES.map((node, i) => {
            const nodeStartFrame = 10 + node.level * 25 + 10;
            const nodeProgress = spring({
              frame: frame - nodeStartFrame,
              fps,
              config: SPRING_SNAPPY,
            });

            // Wave glow at end
            const glowStart = 115;
            const glowDelay = node.level * 4;
            const glowIntensity =
              frame >= glowStart + glowDelay
                ? Math.min((frame - glowStart - glowDelay) / 10, 1)
                : 0;

            return (
              <g
                key={`node-${i}`}
                opacity={nodeProgress}
                transform={`translate(0, ${(1 - nodeProgress) * 20})`}
              >
                <NetworkNode
                  x={node.x}
                  y={node.y}
                  scale={nodeProgress}
                  glowIntensity={glowIntensity}
                />
              </g>
            );
          })}
        </svg>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
