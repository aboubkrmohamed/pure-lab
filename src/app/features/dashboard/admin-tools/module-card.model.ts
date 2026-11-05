export type ReceiptStyle = 'with-prices' | 'without-prices' | 'hidden';

export interface Branch {
  id: number;
  name: string;
  receiptStyle: ReceiptStyle | null;
  footer1: string;
  footer2: string;
  footer3: string;
  printDailySerial: boolean;
  headerImage: string | null;
}
