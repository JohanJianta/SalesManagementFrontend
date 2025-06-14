interface BriefBooking {
  id: number;
  customer_name: string;
  status: string;
  created_at: Date;
  property_data: Propertydata;
}

interface DetailBooking {
  status: string;
  created_at: Date;
  dp_price: number;
  customer_data: Customerdata;
  property_data: Propertydata;
}

interface Propertydata {
  cluster: string;
  product: string;
  unit: string;
}

interface Customerdata {
  name: string;
  identification_number: string;
  phones: string[];
}
