import { ArrowRight, CheckCircle2, AlertTriangle, Clock, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";
import StatCard from "@/components/StatCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { dashboardStats, exceptions } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reconciliation Dashboard</h1>
          <p className="text-muted-foreground mt-1">Multi-currency settlement overview - October 30, 2024</p>
        </div>
        <Link to="/reconcile">
          <Button size="lg" className="gap-2">
            Start Reconciliation
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Transactions"
          value={dashboardStats.totalTransactions.toLocaleString()}
          icon={TrendingUp}
          variant="default"
        />
        <StatCard
          title="Auto-Matched"
          value={dashboardStats.autoMatched.toLocaleString()}
          icon={CheckCircle2}
          variant="success"
          trend={{ value: `${dashboardStats.matchRate}% match rate`, positive: true }}
        />
        <StatCard
          title="Exceptions"
          value={dashboardStats.exceptions}
          icon={AlertTriangle}
          variant="warning"
        />
        <StatCard
          title="Pending Review"
          value="23"
          icon={Clock}
          variant="default"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Settlement Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dashboardStats.accounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-secondary/50"
              >
                <div className="space-y-1">
                  <p className="font-medium text-foreground">{account.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Last reconciled: {account.lastReconciled}
                  </p>
                </div>
                <div className="text-right space-y-2">
                  <p className="font-semibold text-foreground">
                    SGD {(account.balance / 1000000).toFixed(1)}M
                  </p>
                  <Badge
                    variant={
                      account.status === "reconciled"
                        ? "default"
                        : account.status === "pending"
                        ? "secondary"
                        : "destructive"
                    }
                    className={cn(
                      account.status === "reconciled" && "bg-success text-success-foreground",
                      account.status === "pending" && "bg-warning text-warning-foreground"
                    )}
                  >
                    {account.status === "reconciled" && <CheckCircle2 className="mr-1 h-3 w-3" />}
                    {account.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
                    {account.status === "critical" && <AlertTriangle className="mr-1 h-3 w-3" />}
                    {account.status.charAt(0).toUpperCase() + account.status.slice(1)}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Recent Exceptions</CardTitle>
            <Link to="/exceptions">
              <Button variant="ghost" size="sm" className="gap-1">
                View All
                <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {exceptions.slice(0, 4).map((exception) => (
              <div
                key={exception.id}
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-secondary/50"
              >
                <div
                  className={cn(
                    "mt-0.5 rounded-full p-1",
                    exception.severity === "high" && "bg-destructive/10",
                    exception.severity === "medium" && "bg-warning/10",
                    exception.severity === "low" && "bg-muted"
                  )}
                >
                  <AlertTriangle
                    className={cn(
                      "h-4 w-4",
                      exception.severity === "high" && "text-destructive",
                      exception.severity === "medium" && "text-warning",
                      exception.severity === "low" && "text-muted-foreground"
                    )}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-foreground capitalize">
                    {exception.type.replace("_", " ")}
                  </p>
                  <p className="text-xs text-muted-foreground">{exception.description}</p>
                  {exception.suggestedAction && (
                    <p className="text-xs font-medium text-accent">{exception.suggestedAction}</p>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link to="/reconcile" className="group">
              <div className="rounded-lg border p-4 transition-all hover:border-primary hover:bg-primary/5">
                <p className="font-medium text-foreground group-hover:text-primary">Multi-Currency Match</p>
                <p className="text-sm text-muted-foreground mt-1">Reconcile FX settlements side by side</p>
              </div>
            </Link>
            <Link to="/exceptions" className="group">
              <div className="rounded-lg border p-4 transition-all hover:border-warning hover:bg-warning/5">
                <p className="font-medium text-foreground group-hover:text-warning">Partner Exceptions</p>
                <p className="text-sm text-muted-foreground mt-1">Resolve settlement variances</p>
              </div>
            </Link>
            <Link to="/watchlist" className="group">
              <div className="rounded-lg border p-4 transition-all hover:border-accent hover:bg-accent/5">
                <p className="font-medium text-foreground group-hover:text-accent">Pending Settlements</p>
                <p className="text-sm text-muted-foreground mt-1">Monitor partner transactions</p>
              </div>
            </Link>
            <div className="group cursor-not-allowed opacity-60">
              <div className="rounded-lg border p-4">
                <p className="font-medium text-foreground">Generate Report</p>
                <p className="text-sm text-muted-foreground mt-1">Export reconciliation summary</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
