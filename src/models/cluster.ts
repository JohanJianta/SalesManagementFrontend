interface ClusterResponse {
  masterplan_url: string;
  clusters: Cluster[];
}

interface Cluster {
  id: number;
  name: string;
  address: string;
  category: string;
  is_apartment: boolean;
  available_unit: number;
  thumbnail_url: string | null;
  image_hotspots: ImageHotspot[];
}

type ImageHotspot =
  | {
      shape: "rectangle";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      shape: "circle";
      x: number;
      y: number;
      radius: number;
    }
  | {
      shape: "polygon";
      points: { x: number; y: number }[];
    };
