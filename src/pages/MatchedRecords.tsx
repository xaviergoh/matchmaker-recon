import { useState } from "react";
import { Search, ArrowLeftRight, CheckCircle2, User, Calendar, Link2, FileText, AlertCircle, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { matchRecords, bankTransactions, systemTransactions, MatchRecord, Transaction } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function MatchedRecords() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMatch, setSelectedMatch] = useState<MatchRecord | null>(null);

  const filteredMatches = matchRecords.filter((match) => {
    const bank = bankTransactions.find((t) => t.id === match.bankTransactionId);
    const system = systemTransactions.find((t) => t.id === match.systemTransactionId);
    
    const searchLower = searchTerm.toLowerCase();
    return (
      match.id.toLowerCase().includes(searchLower) ||
      match.matchedBy.toLowerCase().includes(searchLower) ||
      bank?.reference.toLowerCase().includes(searchLower) ||
      system?.reference.toLowerCase().includes(searchLower) ||
      bank?.partner?.toLowerCase().includes(searchLower) ||
      bank?.bankAccount?.toLowerCase().includes(searchLower) ||
      bank?.accountNumber?.toLowerCase().includes(searchLower)
    );
  });

  const getBankTransaction = (id: string): Transaction | undefined => {
    return bankTransactions.find((t) => t.id === id);
  };

  const getSystemTransaction = (id: string): Transaction | undefined => {
    return systemTransactions.find((t) => t.id === id);
  };

  const handleUnmatch = (matchId: string) => {
    toast.success("Match reversed", {
      description: `Match ${matchId} has been unmatched for review`,
    });
    setSelectedMatch(null);
  };

  const TransactionDetail = ({ transaction, label }: { transaction: Transaction; label: string }) => (
    <div className="space-y-3 bg-muted/30 p-4 rounded-lg">
      <div className="flex items-center justify-between">
        <p className="font-semibold text-sm text-muted-foreground">{label}</p>
        <Badge variant="outline">{transaction.id}</Badge>
      </div>
      <div className="space-y-2">
        <div>
          <p className="text-sm text-muted-foreground">Description</p>
          <p className="font-medium">{transaction.description}</p>
        </div>
        {transaction.type === "bank" && transaction.bankAccount && (
          <div>
            <p className="text-sm text-muted-foreground">Bank Account</p>
            <div className="flex items-center gap-2 mt-1">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">{transaction.bankAccount}</p>
                <p className="text-xs font-mono text-muted-foreground">
                  {transaction.accountNumber}
                </p>
              </div>
            </div>
          </div>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Reference</p>
            <p className="font-mono text-sm">{transaction.reference}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Date</p>
            <p className="text-sm">{transaction.date}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Amount</p>
            <p className="text-lg font-semibold text-success">
              {transaction.currency} {Math.abs(transaction.amount).toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Category</p>
            <p className="text-sm">{transaction.category || "N/A"}</p>
          </div>
        </div>
        {transaction.partner && (
          <div>
            <p className="text-sm text-muted-foreground">Partner</p>
            <p className="text-sm">{transaction.partner}</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Matched Records</h1>
          <p className="text-muted-foreground mt-1">View and audit reconciled transactions</p>
        </div>
        <div className="flex gap-3">
          <Card className="bg-card">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Total Matched</p>
              <p className="text-2xl font-bold text-foreground">{matchRecords.length}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input
          placeholder="Search by match ID, reference, partner, bank account, or user..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Match History</CardTitle>
          <CardDescription>Complete audit trail of all matched transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Match ID</TableHead>
                <TableHead>Date Matched</TableHead>
                <TableHead>Bank Reference</TableHead>
                <TableHead>System Reference</TableHead>
                <TableHead>Bank Account</TableHead>
                <TableHead>Partner</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Matched By</TableHead>
                <TableHead>Confidence</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMatches.map((match) => {
                const bank = getBankTransaction(match.bankTransactionId);
                const system = getSystemTransaction(match.systemTransactionId);
                
                if (!bank || !system) return null;

                return (
                  <TableRow key={match.id} className="cursor-pointer hover:bg-muted/50">
                    <TableCell className="font-mono text-sm">{match.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        {new Date(match.matchedAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm">{bank.reference}</TableCell>
                    <TableCell className="font-mono text-sm">{system.reference}</TableCell>
                    <TableCell className="text-sm">
                      {bank.bankAccount ? (
                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1">
                            <Building2 className="h-3 w-3 text-muted-foreground" />
                            <span className="font-medium text-xs">{bank.bankAccount}</span>
                          </div>
                          <div className="font-mono text-xs text-muted-foreground">
                            {bank.accountNumber}
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">{bank.partner || "N/A"}</TableCell>
                    <TableCell className="font-semibold text-success">
                      {bank.currency} {Math.abs(bank.amount).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge variant={match.matchType === "auto" ? "default" : "secondary"}>
                        {match.matchType}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 text-sm">
                        <User className="h-4 w-4 text-muted-foreground" />
                        {match.matchedBy.split("@")[0]}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="text-sm font-medium">{match.matchConfidence}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedMatch(match)}
                      >
                        <FileText className="h-4 w-4" />
                        Details
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {filteredMatches.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-lg font-medium text-foreground">No matches found</p>
              <p className="text-sm text-muted-foreground mt-1">
                Try adjusting your search criteria
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!selectedMatch} onOpenChange={(open) => !open && setSelectedMatch(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Link2 className="h-5 w-5" />
              Match Details: {selectedMatch?.id}
            </DialogTitle>
            <DialogDescription>
              Complete audit information for this matched transaction pair
            </DialogDescription>
          </DialogHeader>

          {selectedMatch && (
            <div className="space-y-6 mt-4">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg">Match Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Match Type</p>
                      <Badge variant={selectedMatch.matchType === "auto" ? "default" : "secondary"}>
                        {selectedMatch.matchType.toUpperCase()}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Confidence</p>
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-success" />
                        <span className="font-semibold">{selectedMatch.matchConfidence}%</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Matched By</p>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{selectedMatch.matchedBy}</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Matched At</p>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {new Date(selectedMatch.matchedAt).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  {selectedMatch.notes && (
                    <div>
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="text-sm bg-muted/30 p-3 rounded-md mt-1">{selectedMatch.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <div className="flex items-center justify-center py-2">
                <div className="flex items-center gap-2">
                  <div className="h-1 w-16 bg-primary rounded" />
                  <ArrowLeftRight className="h-6 w-6 text-primary" />
                  <div className="h-1 w-16 bg-primary rounded" />
                </div>
              </div>

              <div className="grid gap-4">
                {getBankTransaction(selectedMatch.bankTransactionId) && (
                  <TransactionDetail
                    transaction={getBankTransaction(selectedMatch.bankTransactionId)!}
                    label="Bank Statement"
                  />
                )}
                {getSystemTransaction(selectedMatch.systemTransactionId) && (
                  <TransactionDetail
                    transaction={getSystemTransaction(selectedMatch.systemTransactionId)!}
                    label="System Record"
                  />
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => setSelectedMatch(null)}>
                  Close
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleUnmatch(selectedMatch.id)}
                >
                  Unmatch Transactions
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
