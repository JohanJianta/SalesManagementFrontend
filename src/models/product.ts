interface BriefProduct {
  id: number;
  name: string;
  default_price: number;
  corner_price: number;
  thumbnail_url: string | null;
  product_units: ProductUnit[];
  image_hotspots: ImageHotspot[];
}

interface ProductUnit {
  id: number;
  name: string;
  type: string;
}

interface DetailProduct {
  id: number;
  name: string;
  default_price: number;
  corner_price: number;
  product_images: string[];
  product_features: ProductFeature[];
  product_specifications: ProductSpecification[];
  product_units: ProductUnit[];
  cluster_ref: ClusterRef;
}

interface ProductSpecification {
  name: string;
  detail: string;
}

interface ProductFeature {
  name: string;
  total: string;
}

interface ClusterRef {
  id: number;
  name: string;
  brochure_url: string | null;
  promotions: BriefPromotion[];
}

interface PropertyCluster {
  id: number;
  name: string;
  products: PropertyProduct[];
}

interface PropertyProduct {
  id: number;
  name: string;
  default_price: number;
  corner_price: number;
  units: ProductUnit[];
}
