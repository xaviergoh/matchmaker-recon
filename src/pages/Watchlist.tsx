import { Clock, CheckCircle2, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface WatchlistItem {
  id: string;
  description: string;
  amount: number;
  daysRemaining: number;
  addedDate: string;
  expectedClearDate: string;
  type: "timing" | "partial" | "pending";
}

const watchlistItems: WatchlistItem[] = [
  {
    id: "W001",
    description: "FX Settlement - Partner A (USD/SGD)",
    amount: 125000,
    daysRemaining: 2,
    addedDate: "2024-10-28",
    expectedClearDate: "2024-11-01",
    type: "timing",
  },
  {
    id: "W002",
    description: "Card Scheme Settlement - Mastercard EUR",
    amount: -87500,
    daysRemaining: 1,
    addedDate: "2024-10-29",
    expectedClearDate: "2024-10-31",
    type: "timing",
  },
  {
    id: "W003",
    description: "Partial Treasury Rebalance - GBP Pool",
    amount: 50000,
    daysRemaining: 3,
    addedDate: "2024-10-27",
    expectedClearDate: "2024-11-02",
    type: "partial",
  },
];

export default function Watchlist() {
  const handleMarkCleared = (id: string) => {
    toast.success("Item marked as cleared", {
      description: "Transaction has been matched and reconciled",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Watchlist</h1>
          <p className="text-muted-foreground mt-1">Monitor pending partner settlements and timing differences</p>
        </div>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {watchlistItems.length} Items
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Settlement Timing</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {watchlistItems.filter(i => i.type === "timing").length}
                </p>
              </div>
              <div className="rounded-lg bg-warning/10 p-3">
                <Clock className="h-6 w-6 text-warning" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Partial Settlements</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  {watchlistItems.filter(i => i.type === "partial").length}
                </p>
              </div>
              <div className="rounded-lg bg-accent/10 p-3">
                <AlertCircle className="h-6 w-6 text-accent" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Value</p>
                <p className="text-2xl font-bold text-foreground mt-1">
                  SGD {(watchlistItems.reduce((sum, item) => sum + Math.abs(item.amount), 0) / 1000).toFixed(0)}K
                </p>
              </div>
              <div className="rounded-lg bg-primary/10 p-3">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Monitored Settlements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {watchlistItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="rounded-lg bg-muted p-2 mt-1">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-foreground">{item.description}</p>
                    <Badge variant="outline" className="capitalize">
                      {item.type}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>Added: {item.addedDate}</span>
                    <span>•</span>
                    <span>Expected: {item.expectedClearDate}</span>
                    <span>•</span>
                    <span className={item.daysRemaining <= 1 ? "text-destructive font-medium" : ""}>
                      {item.daysRemaining} {item.daysRemaining === 1 ? "day" : "days"} remaining
                    </span>
                  </div>
                </div>

                <div className="text-right space-y-2">
                  <p className="text-lg font-semibold text-foreground">
                    {item.amount > 0 ? "+" : ""}SGD {Math.abs(item.amount).toLocaleString()}
                  </p>
                  <Button size="sm" onClick={() => handleMarkCleared(item.id)}>
                    Mark Cleared
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-accent mt-0.5" />
            <div className="space-y-1">
              <p className="font-medium text-foreground">Auto-Clear Monitoring</p>
              <p className="text-sm text-muted-foreground">
                Items on the watchlist will automatically clear when matching entries appear within the expected timeframe.
                You'll receive notifications for any items that exceed their monitoring period.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
