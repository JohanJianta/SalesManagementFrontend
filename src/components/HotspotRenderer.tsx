import { G, Rect, Circle, Polygon, Text as SvgText } from "react-native-svg";
import React from "react";

interface Props {
  spot: ImageHotspot;
  name?: string;
  testID?: string;
  onPress: () => void;
}

export default function HotspotRenderer({ spot, name, testID, onPress }: Props) {
  const FONT_SIZE = 40;
  const TEXT_RECT_HEIGHT = 70;
  const VERTICAL_TEXT_OFFSET = FONT_SIZE * 0.35;

  const MIN_TEXT_RECT_WIDTH = 80;
  const HORIZONTAL_PADDING = 20;

  const estimatedTextWidth = name?.length ? name.length * (FONT_SIZE * 0.5) : 0;

  const dynamicTextRectWidth = Math.max(MIN_TEXT_RECT_WIDTH, estimatedTextWidth + 2 * HORIZONTAL_PADDING);

  let centerX: number;
  let centerY: number;

  switch (spot.shape) {
    case "rectangle":
      centerX = spot.x + spot.width / 2;
      centerY = spot.y + spot.height / 2;
      return (
        <G testID={testID} onPressOut={onPress}>
          <Rect {...spot} fill="transparent" />
          {name && (
            <>
              <Rect
                x={centerX - dynamicTextRectWidth / 2}
                y={centerY - TEXT_RECT_HEIGHT / 2}
                rx={10}
                ry={10}
                width={dynamicTextRectWidth}
                height={TEXT_RECT_HEIGHT}
                fill="#0F7480"
              />
              <SvgText
                x={centerX}
                y={centerY + VERTICAL_TEXT_OFFSET}
                fontSize={FONT_SIZE}
                fontWeight="bold"
                textAnchor="middle"
                fill="white"
              >
                {name}
              </SvgText>
            </>
          )}
        </G>
      );

    case "circle":
      centerX = spot.x;
      centerY = spot.y;
      return (
        <G testID={testID} onPressOut={onPress}>
          <Circle cx={spot.x} cy={spot.y} r={spot.radius} fill="transparent" />
          {name && (
            <>
              <Rect
                x={centerX - dynamicTextRectWidth / 2}
                y={centerY - TEXT_RECT_HEIGHT / 2}
                rx={10}
                ry={10}
                width={dynamicTextRectWidth}
                height={TEXT_RECT_HEIGHT}
                fill="#0F7480"
              />
              <SvgText
                x={centerX}
                y={centerY + VERTICAL_TEXT_OFFSET}
                fontSize={FONT_SIZE}
                fontWeight="bold"
                textAnchor="middle"
                fill="white"
              >
                {name}
              </SvgText>
            </>
          )}
        </G>
      );

    case "polygon":
      let minX = Infinity,
        minY = Infinity,
        maxX = -Infinity,
        maxY = -Infinity;
      spot.points.forEach((p) => {
        minX = Math.min(minX, p.x);
        minY = Math.min(minY, p.y);
        maxX = Math.max(maxX, p.x);
        maxY = Math.max(maxY, p.y);
      });

      centerX = minX + (maxX - minX) / 2;
      centerY = minY + (maxY - minY) / 2;

      const pointsStr = spot.points.map((p) => `${p.x},${p.y}`).join(" ");

      return (
        <G testID={testID} onPressOut={onPress}>
          <Polygon points={pointsStr} fill="transparent" />
          {name && (
            <>
              <Rect
                x={centerX - dynamicTextRectWidth / 2}
                y={centerY - TEXT_RECT_HEIGHT / 2}
                rx={10}
                ry={10}
                width={dynamicTextRectWidth}
                height={TEXT_RECT_HEIGHT}
                fill="#0F7480"
              />
              <SvgText
                x={centerX}
                y={centerY + VERTICAL_TEXT_OFFSET}
                fontSize={FONT_SIZE}
                fontWeight="bold"
                textAnchor="middle"
                fill="white"
              >
                {name}
              </SvgText>
            </>
          )}
        </G>
      );

    default:
      return null;
  }
}
