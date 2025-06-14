interface BriefPromotion {
  id: number;
  title: string;
  thumbnail_url: string | null;
  created_at: Date;
}

interface DetailPromotion {
  cluster_id: number | null;
  title: string;
  content: string;
  thumbnail_url: string | null;
  created_at: Date;
  expired_at: Date | null;
}
