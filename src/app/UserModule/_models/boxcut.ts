export interface BoxCut {
  _id?: string;
  tickets?: any[];
  date?: number;
  subsidiary?: string;
  total?: number;
  cash_pays?: number;
  card_pays?: number;
  transfers?: number;
  checks?: number;
}
