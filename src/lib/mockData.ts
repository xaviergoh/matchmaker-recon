export interface Transaction {
  id: string;
  date: string;
  description: string;
  reference: string;
  amount: number;
  currency: string;
  type: "bank" | "system";
  status: "matched" | "unmatched" | "pending" | "exception";
  matchConfidence?: number;
  category?: string;
  partner?: string;
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
      name: "SGD Settlement Account",
      balance: 12450000,
      status: "reconciled",
      lastReconciled: "2024-10-30 09:35 AM",
    },
    {
      id: "2",
      name: "USD Multi-Currency Pool",
      balance: 8850000,
      status: "reconciled",
      lastReconciled: "2024-10-30 09:32 AM",
    },
    {
      id: "3",
      name: "FX Treasury Reserve",
      balance: 25200000,
      status: "pending",
      lastReconciled: "2024-10-29 04:15 PM",
    },
  ],
};

export const bankTransactions: Transaction[] = [
  {
    id: "B001",
    date: "2024-10-30",
    description: "FX SETTLEMENT - FINTECH PARTNER A",
    reference: "FX-2024-1045",
    amount: 150000,
    currency: "SGD",
    type: "bank",
    status: "exception",
    category: "FX Settlement",
    partner: "Fintech Partner A",
  },
  {
    id: "B002",
    date: "2024-10-30",
    description: "CARD SCHEME SETTLEMENT - VISA",
    reference: "VISA-2024-8842",
    amount: 45000,
    currency: "USD",
    type: "bank",
    status: "matched",
    matchConfidence: 100,
    category: "Card Settlement",
    partner: "VISA International",
  },
  {
    id: "B003",
    date: "2024-10-30",
    description: "PLATFORM LICENSING FEE",
    reference: "LIC-Q4-1050",
    amount: 85000,
    currency: "USD",
    type: "bank",
    status: "matched",
    matchConfidence: 100,
    category: "Platform Revenue",
    partner: "Corporate Client B",
  },
  {
    id: "B004",
    date: "2024-10-29",
    description: "CROSS-BORDER PAYMENT FEE",
    reference: "XB-FEE-10292024",
    amount: -150,
    currency: "SGD",
    type: "bank",
    status: "unmatched",
    category: "Transaction Fees",
  },
  {
    id: "B005",
    date: "2024-10-29",
    description: "TREASURY MANAGEMENT - EUR POOL",
    reference: "TRES-EUR-10252024",
    amount: 125000,
    currency: "EUR",
    type: "bank",
    status: "matched",
    matchConfidence: 100,
    category: "Treasury",
    partner: "Bank Partner C",
  },
];

export const systemTransactions: Transaction[] = [
  {
    id: "S001",
    date: "2024-10-30",
    description: "FX Settlement Expected - Partner A",
    reference: "FX-2024-1045",
    amount: 149850,
    currency: "SGD",
    type: "system",
    status: "exception",
    category: "FX Settlement",
    partner: "Fintech Partner A",
  },
  {
    id: "S002",
    date: "2024-10-30",
    description: "Card Scheme Settlement Booking",
    reference: "VISA-2024-8842",
    amount: 45000,
    currency: "USD",
    type: "system",
    status: "matched",
    matchConfidence: 100,
    category: "Card Settlement",
    partner: "VISA International",
  },
  {
    id: "S003",
    date: "2024-10-30",
    description: "Platform License Revenue Q4",
    reference: "LIC-Q4-1050",
    amount: 85000,
    currency: "USD",
    type: "system",
    status: "matched",
    matchConfidence: 100,
    category: "Platform Revenue",
    partner: "Corporate Client B",
  },
  {
    id: "S004",
    date: "2024-10-29",
    description: "Treasury EUR Pool Management",
    reference: "TRES-EUR-10252024",
    amount: 125000,
    currency: "EUR",
    type: "system",
    status: "matched",
    matchConfidence: 100,
    category: "Treasury",
    partner: "Bank Partner C",
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
    suggestedAction: "Match and post SGD 150 FX spread adjustment",
    description: "Bank amount (SGD 150,000) differs from system (SGD 149,850) by SGD 150 - FX spread variance",
  },
  {
    id: "E002",
    type: "unmatched",
    severity: "low",
    bankTransaction: bankTransactions[3],
    suggestedAction: "Create cross-border fee expense entry",
    description: "Cross-border payment fee with no matching system entry",
  },
  {
    id: "E003",
    type: "timing",
    severity: "low",
    description: "18 partner settlements recorded today, expected to clear within 2 business days",
  },
  {
    id: "E004",
    type: "duplicate",
    severity: "medium",
    description: "12 potential duplicate FX settlements detected across multiple currency pools",
  },
];
