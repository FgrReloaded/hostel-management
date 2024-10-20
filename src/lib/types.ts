import {ModeType} from "@prisma/client";

export interface PaymentMode {
  type: ModeType;
  upiId?: string;
  beneficiaryName?: string;
  accountNumber?: string;
  ifsc?: string;
  qrcode?: string;
  bankName?: string;
}
