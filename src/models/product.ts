interface BriefProduct {
  id: number;
  name: string;
  default_price: number;
  corner_price: number;
  thumbnail_url: string | null;
  product_units: Productunit[];
  image_hotspots: ImageHotspot[];
}

interface Productunit {
  id: number;
  name: string;
  type: string;
}
