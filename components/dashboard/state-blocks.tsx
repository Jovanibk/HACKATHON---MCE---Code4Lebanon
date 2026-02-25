import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LoadingGrid() {
  return <div className="grid gap-4 md:grid-cols-2">{Array.from({ length: 4 }).map((_, i) => <Card key={i}><CardHeader><Skeleton className="h-5 w-1/3" /></CardHeader><CardContent><Skeleton className="h-56 w-full" /></CardContent></Card>)}</div>;
}

export function ErrorState({ message }: { message: string }) {
  return <Card><CardContent className="p-6 text-sm text-destructive">Error: {message}</CardContent></Card>;
}

export function EmptyState({ message }: { message: string }) {
  return <Card><CardContent className="p-6 text-sm text-muted-foreground">{message}</CardContent></Card>;
}
