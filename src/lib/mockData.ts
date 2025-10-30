export interface Transaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  amount: number;
  type: "bank" | "system";
  status: "matched" | "unmatched" | "pending" | "exception";
  matchConfidence?: number;
  category?: string;
}

export interface DashboardStats {
  totalTransactions: number;
  autoMatched: number;
  exceptions: number;
  matchRate: number;
  accounts: AccountStatus[];
}

export interface AccountStatus {
  id: string;
  name: string;
  balance: number;
  status: "reconciled" | "pending" | "critical";
  lastReconciled: string;
}

export const dashboardStats: DashboardStats = {
  totalTransactions: 2847,
  autoMatched: 2790,
  exceptions: 57,
  matchRate: 98,
  accounts: [
    {
      id: "1",
      name: "Main Operating Account",
      balance: 2450000,
      status: "reconciled",
      lastReconciled: "2024-10-30 09:35 AM",
    },
    {
      id: "2",
      name: "Payroll Account",
      balance: 850000,
      status: "reconciled",
      lastReconciled: "2024-10-30 09:32 AM",
    },
    {
      id: "3",
      name: "Reserve Account",
      balance: 5200000,
      status: "pending",
      lastReconciled: "2024-10-29 04:15 PM",
    },
  ],
};

export const bankTransactions: Transaction[] = [
  {
    id: "B001",
    date: "2024-10-30",
    description: "WIRE TRANSFER FROM ACME CORP",
    reference: "INV-2024-1045",
    amount: 15000,
    type: "bank",
    status: "exception",
    category: "Receivables",
  },
  {
    id: "B002",
    date: "2024-10-30",
    description: "ACH PAYMENT - VENDOR XYZ",
    reference: "PO-8842",
    amount: -4250.50,
    type: "bank",
    status: "matched",
    matchConfidence: 100,
    category: "Payables",
  },
  {
    id: "B003",
    date: "2024-10-30",
    description: "CUSTOMER PAYMENT - INVOICE 1050",
    reference: "INV-1050",
    amount: 8500,
    type: "bank",
    status: "matched",
    matchConfidence: 100,
    category: "Receivables",
  },
  {
    id: "B004",
    date: "2024-10-29",
    description: "WIRE FEE",
    reference: "WIRE-FEE-10292024",
    amount: -15,
    type: "bank",
    status: "unmatched",
    category: "Bank Fees",
  },
  {
    id: "B005",
    date: "2024-10-29",
    description: "PAYROLL DIRECT DEPOSIT BATCH",
    reference: "PR-10252024",
    amount: -125000,
    type: "bank",
    status: "matched",
    matchConfidence: 100,
    category: "Payroll",
  },
];

export const systemTransactions: Transaction[] = [
  {
    id: "S001",
    date: "2024-10-30",
    description: "Invoice Payment - ACME CORP",
    reference: "INV-2024-1045",
    amount: 14985,
    type: "system",
    status: "exception",
    category: "Receivables",
  },
  {
    id: "S002",
    date: "2024-10-30",
    description: "Purchase Order Payment",
    reference: "PO-8842",
    amount: -4250.50,
    type: "system",
    status: "matched",
    matchConfidence: 100,
    category: "Payables",
  },
  {
    id: "S003",
    date: "2024-10-30",
    description: "Customer Invoice Payment",
    reference: "INV-1050",
    amount: 8500,
    type: "system",
    status: "matched",
    matchConfidence: 100,
    category: "Receivables",
  },
  {
    id: "S004",
    date: "2024-10-29",
    description: "Payroll Processing",
    reference: "PR-10252024",
    amount: -125000,
    type: "system",
    status: "matched",
    matchConfidence: 100,
    category: "Payroll",
  },
];

export interface Exception {
  id: string;
  type: "timing" | "duplicate" | "amount_mismatch" | "unmatched";
  severity: "low" | "medium" | "high";
  bankTransaction?: Transaction;
  systemTransaction?: Transaction;
  suggestedAction?: string;
  description: string;
}

export const exceptions: Exception[] = [
  {
    id: "E001",
    type: "amount_mismatch",
    severity: "medium",
    bankTransaction: bankTransactions[0],
    systemTransaction: systemTransactions[0],
    suggestedAction: "Match and post $15 wire fee adjustment",
    description: "Bank amount ($15,000) differs from system ($14,985) by $15 - likely wire fee",
  },
  {
    id: "E002",
    type: "unmatched",
    severity: "low",
    bankTransaction: bankTransactions[3],
    suggestedAction: "Create bank fee expense entry",
    description: "Wire transfer fee with no matching system entry",
  },
  {
    id: "E003",
    type: "timing",
    severity: "low",
    description: "23 payments recorded today, expected to clear within 3 days",
  },
  {
    id: "E004",
    type: "duplicate",
    severity: "medium",
    description: "15 potential duplicate entries detected between bank and system",
  },
];
