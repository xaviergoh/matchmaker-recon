import { useState } from "react";
import { AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { exceptions, Exception } from "@/lib/mockData";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function Exceptions() {
  const [exceptionList, setExceptionList] = useState(exceptions);
  const [selectedType, setSelectedType] = useState<string>("all");

  const handleResolve = (id: string, action?: string) => {
    setExceptionList((prev) => prev.filter((e) => e.id !== id));
    toast.success("Exception resolved", {
      description: action || "Successfully processed",
    });
  };

  const handleBulkAccept = (type: string) => {
    const count = exceptionList.filter((e) => e.type === type).length;
    setExceptionList((prev) => prev.filter((e) => e.type !== type));
    toast.success(`${count} ${type} exceptions resolved`, {
      description: "Items added to watchlist for monitoring",
    });
  };

  const filteredExceptions = selectedType === "all" 
    ? exceptionList 
    : exceptionList.filter((e) => e.type === selectedType);

  const exceptionTypes = [
    { value: "all", label: "All Exceptions", count: exceptionList.length },
    { value: "timing", label: "Timing Differences", count: exceptionList.filter(e => e.type === "timing").length },
    { value: "amount_mismatch", label: "Amount Mismatches", count: exceptionList.filter(e => e.type === "amount_mismatch").length },
    { value: "unmatched", label: "Unmatched", count: exceptionList.filter(e => e.type === "unmatched").length },
    { value: "duplicate", label: "Duplicates", count: exceptionList.filter(e => e.type === "duplicate").length },
  ];

  const ExceptionCard = ({ exception }: { exception: Exception }) => (
    <Card className={cn(
      "transition-all hover:shadow-md",
      exception.severity === "high" && "border-destructive/50",
      exception.severity === "medium" && "border-warning/50"
    )}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex gap-4 flex-1">
            <div className={cn(
              "rounded-full p-2 mt-1",
              exception.severity === "high" && "bg-destructive/10",
              exception.severity === "medium" && "bg-warning/10",
              exception.severity === "low" && "bg-muted"
            )}>
              <AlertTriangle className={cn(
                "h-5 w-5",
                exception.severity === "high" && "text-destructive",
                exception.severity === "medium" && "text-warning",
                exception.severity === "low" && "text-muted-foreground"
              )} />
            </div>
            
            <div className="flex-1 space-y-3">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-foreground capitalize">
                  {exception.type.replace("_", " ")}
                </h3>
                <Badge variant={
                  exception.severity === "high" ? "destructive" : 
                  exception.severity === "medium" ? "default" : 
                  "secondary"
                } className={cn(
                  exception.severity === "medium" && "bg-warning text-warning-foreground"
                )}>
                  {exception.severity}
                </Badge>
              </div>
              
              <p className="text-sm text-muted-foreground">{exception.description}</p>
              
              {exception.suggestedAction && (
                <div className="rounded-lg bg-accent/10 border border-accent/20 p-3">
                  <p className="text-sm font-medium text-accent flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Suggested Action
                  </p>
                  <p className="text-sm text-foreground mt-1">{exception.suggestedAction}</p>
                </div>
              )}

              {exception.bankTransaction && exception.systemTransaction && (
                <div className="grid gap-3 sm:grid-cols-2 text-sm">
                  <div className="rounded-lg border p-3 bg-card">
                    <p className="font-medium text-foreground mb-1">Bank</p>
                    <p className="text-muted-foreground">{exception.bankTransaction.description}</p>
                    <p className="font-semibold text-success mt-1">
                      ${exception.bankTransaction.amount.toLocaleString()}
                    </p>
                  </div>
                  <div className="rounded-lg border p-3 bg-card">
                    <p className="font-medium text-foreground mb-1">System</p>
                    <p className="text-muted-foreground">{exception.systemTransaction.description}</p>
                    <p className="font-semibold text-success mt-1">
                      ${exception.systemTransaction.amount.toLocaleString()}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button 
              size="sm" 
              onClick={() => handleResolve(exception.id, exception.suggestedAction)}
              className="whitespace-nowrap"
            >
              Accept & Resolve
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => handleResolve(exception.id)}
            >
              Dismiss
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Exception Management</h1>
          <p className="text-muted-foreground mt-1">Review and resolve unmatched items</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {exceptionTypes.map((type) => (
          <Button
            key={type.value}
            variant={selectedType === type.value ? "default" : "outline"}
            onClick={() => setSelectedType(type.value)}
            className="gap-2"
          >
            {type.label}
            <Badge variant="secondary" className={cn(
              selectedType === type.value && "bg-primary-foreground/20 text-primary-foreground"
            )}>
              {type.count}
            </Badge>
          </Button>
        ))}
      </div>

      {selectedType === "timing" && exceptionList.some(e => e.type === "timing") && (
        <Card className="bg-warning-light border-warning">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="font-medium text-foreground">Bulk Action Available</p>
              <p className="text-sm text-muted-foreground mt-1">
                Accept all timing differences and add to watchlist for 3-day monitoring
              </p>
            </div>
            <Button onClick={() => handleBulkAccept("timing")} className="gap-2">
              Accept All
              <ArrowRight className="h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredExceptions.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">All Clear!</h3>
              <p className="text-muted-foreground">No exceptions to review in this category</p>
            </CardContent>
          </Card>
        ) : (
          filteredExceptions.map((exception) => (
            <ExceptionCard key={exception.id} exception={exception} />
          ))
        )}
      </div>
    </div>
  );
}
