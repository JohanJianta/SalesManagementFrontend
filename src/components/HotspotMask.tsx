import { Defs, Mask, Rect, Circle, Polygon } from "react-native-svg";
import React from "react";

interface Props {
  maskId: string;
  hotspots: ImageHotspot[];
}

export default function HotspotMask({ maskId, hotspots }: Props) {
  return (
    <>
      <Defs>
        <Mask id={maskId}>
          <Rect x="0" y="0" width="100%" height="100%" fill="white" />

          {hotspots.map((spot, index) => {
            switch (spot.shape) {
              case "rectangle":
                return (
                  <Rect
                    key={`mask-rect-${index}`}
                    x={spot.x}
                    y={spot.y}
                    width={spot.width}
                    height={spot.height}
                    fill="black"
                  />
                );
              case "circle":
                return <Circle key={`mask-circle-${index}`} cx={spot.x} cy={spot.y} r={spot.radius} fill="black" />;
              case "polygon":
                return (
                  <Polygon
                    key={`mask-polygon-${index}`}
                    points={spot.points.map((p) => `${p.x},${p.y}`).join(" ")}
                    fill="black"
                  />
                );
              default:
                return null;
            }
          })}
        </Mask>
      </Defs>

      <Rect x="0" y="0" width="100%" height="100%" opacity={0.5} mask={`url(#${maskId})`} />
    </>
  );
}
