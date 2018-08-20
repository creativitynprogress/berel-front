export interface Ticket {
  _id?: string;
  subsidiary?: string;
  total: number;
  paints: PaintItem[];
  products: ProductItem[];
  bases: any[];
  cash_pays?: any;
  card_pays?: any;
  transfers?: any;
  checks?: any;
  date: number;
  client?: any;
  discount?: any;
  invoice?: any;
  payed?: boolean;
  folio?: number;
  seller?: any;
  canceled?: boolean;
}

export interface PaintItem {
  _id?: string;
  line: any;
  color: string;
  base: string;
  quantity: number;
  price?: number;
  presentation?: string;
  paint?: any;
  presentationId?: string;
}

export interface ProductItem {
  _id?: string;
  product_id: string;
  po?: string;
  sp?: string;
  unit: string;
  quantity: number;
  bar_code: string;
  description: string;
  brand: string;
  price: number;
  payed: boolean;
}

