export function DashboardCard({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <div className="p-6 flex flex-col">
        <span className="text-sm font-medium text-muted-foreground">
          {title}
        </span>
        <span className="text-2xl font-bold">{value}</span>
      </div>
    </div>
  );
}
