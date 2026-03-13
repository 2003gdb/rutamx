import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  trend?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  className?: string;
  valueClassName?: string;
}

export function KPICard({
  title,
  value,
  trend,
  trendLabel,
  icon,
  className,
  valueClassName,
}: KPICardProps) {
  const getTrendIcon = () => {
    if (trend === undefined || trend === 0) return <Minus className="h-3 w-3" />;
    return trend > 0 ? (
      <TrendingUp className="h-3 w-3" />
    ) : (
      <TrendingDown className="h-3 w-3" />
    );
  };

  const getTrendColor = () => {
    if (trend === undefined || trend === 0) return "text-text-secondary";
    return trend > 0 ? "text-accent-green" : "text-accent-red";
  };

  return (
    <Card className={cn("card-hover", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm text-text-secondary">{title}</p>
            <p className={cn("text-3xl font-bold tracking-tight tabular-nums", valueClassName)}>
              {value}
            </p>
            {trend !== undefined && (
              <div className={cn("flex items-center gap-1 text-xs", getTrendColor())}>
                {getTrendIcon()}
                <span className="tabular-nums">
                  {trend > 0 ? "+" : ""}
                  {trend.toFixed(1)}%
                </span>
                {trendLabel && (
                  <span className="text-text-muted ml-1">{trendLabel}</span>
                )}
              </div>
            )}
          </div>
          {icon && (
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary-light">
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
