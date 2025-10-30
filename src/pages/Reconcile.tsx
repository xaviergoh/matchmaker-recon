import { useState } from "react";
import { Search, CheckCircle2, X, ArrowLeftRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { bankTransactions, systemTransactions, Transaction } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Reconcile() {
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const handleMatch = () => {
    if (selectedBank && selectedSystem) {
      toast.success("Transactions matched successfully", {
        description: `Matched ${selectedBank} with ${selectedSystem}`,
      });
      setSelectedBank(null);
      setSelectedSystem(null);
    }
  };

  const filteredBankTransactions = bankTransactions.filter(
    (t) =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredSystemTransactions = systemTransactions.filter(
    (t) =>
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.reference.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const TransactionRow = ({
    transaction,
    isBank,
    isSelected,
    onClick,
  }: {
    transaction: Transaction;
    isBank: boolean;
    isSelected: boolean;
    onClick: () => void;
  }) => (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between rounded-lg border p-4 cursor-pointer transition-all",
        isSelected && "border-primary bg-primary/5 ring-2 ring-primary/20",
        transaction.status === "matched" && "bg-success-light border-success/20",
        transaction.status === "exception" && "bg-warning-light border-warning/20",
        !isSelected && transaction.status === "unmatched" && "hover:border-accent hover:bg-accent/5"
      )}
    >
      <div className="flex-1 space-y-1">
        <div className="flex items-center gap-2">
          <p className="font-medium text-foreground">{transaction.description}</p>
          {transaction.status === "matched" && (
            <CheckCircle2 className="h-4 w-4 text-success" />
          )}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{transaction.date}</span>
          <span>•</span>
          <span className="font-mono">{transaction.reference}</span>
          {transaction.category && (
            <>
              <span>•</span>
              <Badge variant="secondary" className="text-xs">
                {transaction.category}
              </Badge>
            </>
          )}
          {transaction.partner && (
            <>
              <span>•</span>
              <span className="text-xs">{transaction.partner}</span>
            </>
          )}
        </div>
      </div>
      <div className="text-right">
        <p
          className={cn(
            "text-lg font-semibold",
            transaction.amount > 0 ? "text-success" : "text-foreground"
          )}
        >
          {transaction.amount > 0 ? "+" : ""}{transaction.currency} {Math.abs(transaction.amount).toLocaleString()}
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reconciliation</h1>
          <p className="text-muted-foreground mt-1">Match bank statements with system records</p>
        </div>
        {(selectedBank || selectedSystem) && (
          <Button
            onClick={handleMatch}
            disabled={!selectedBank || !selectedSystem}
            size="lg"
            className="gap-2"
          >
            <ArrowLeftRight className="h-4 w-4" />
            Match Transactions
          </Button>
        )}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by partner, reference, FX pair, settlement ID..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              Bank Statements
              <Badge variant="secondary">{filteredBankTransactions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredBankTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                isBank={true}
                isSelected={selectedBank === transaction.id}
                onClick={() => setSelectedBank(transaction.id === selectedBank ? null : transaction.id)}
              />
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b bg-muted/30">
            <CardTitle className="text-lg flex items-center gap-2">
              System Records
              <Badge variant="secondary">{filteredSystemTransactions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
            {filteredSystemTransactions.map((transaction) => (
              <TransactionRow
                key={transaction.id}
                transaction={transaction}
                isBank={false}
                isSelected={selectedSystem === transaction.id}
                onClick={() => setSelectedSystem(transaction.id === selectedSystem ? null : transaction.id)}
              />
            ))}
          </CardContent>
        </Card>
      </div>

      {(selectedBank || selectedSystem) && (
        <Card className="border-primary bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground">Selection</p>
                <p className="text-sm text-muted-foreground">
                  {selectedBank && selectedSystem
                    ? "Both transactions selected - ready to match"
                    : "Select one transaction from each side to match"}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSelectedBank(null);
                  setSelectedSystem(null);
                }}
              >
                <X className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
