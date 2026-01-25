import React from "react";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  change?: number;
  trend?: "up" | "down";
}

export const StatCard: React.FC<StatCardProps> = ({
  icon,
  label,
  value,
  change,
  trend,
}) => {
  const trendColor = trend === "up" ? "text-green-600" : "text-red-600";
  const trendSign = trend === "up" ? "+" : "";

  return (
    <div className="card overflow-hidden group">
      <div className="card-body">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-slate-600 font-medium mb-2">{label}</p>
            <h3 className="text-3xl font-bold text-slate-900 mb-2">{value}</h3>
            {change !== undefined && (
              <p className={`text-sm font-semibold ${trendColor}`}>
                {trendSign}
                {change}% from last month
              </p>
            )}
          </div>
          <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
        </div>
      </div>
      <div className="h-1 bg-gradient-to-r from-primary-500 to-primary-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
    </div>
  );
};
