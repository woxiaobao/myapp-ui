export interface TradeRecord {
  id?: number;
  tradeTime?: string;
  tradeType?: string;
  counterparty?: string;
  product?: string;
  direction?: string;
  amount?: number;
  paymentMethod?: string;
  status?: string;
  tradeNo?: string;
  merchantOrderNo?: string;
  remarks?: string;
  createTime?: string;
}

export interface TradeRecordQuery {
  tradeType?: string;
  counterparty?: string;
  direction?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  minAmount?: number;
  maxAmount?: number;
  paymentMethod?: string;
  tradeNo?: string;
  merchantOrderNo?: string;
  pageNum?: number;
  pageSize?: number;
  offset?: number;
}

export interface PaginatedResponse<T> {
  records: T[];
  total: number;
}

export interface StatusMap {
  [key: string]: {
    label: string;
    type: string;
  };
}

export interface ExportResponse extends Blob {}
