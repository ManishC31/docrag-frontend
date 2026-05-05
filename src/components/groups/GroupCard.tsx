import { FileText, MessageSquare, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Group } from "@/types";

interface GroupCardProps {
  group: Group;
  onDelete: (id: string) => void;
}

export function GroupCard({ group, onDelete }: GroupCardProps) {
  return (
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-1 text-base">{group.name}</CardTitle>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
            onClick={() => onDelete(group.id)}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
        {group.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{group.description}</p>
        )}
      </CardHeader>

      <CardContent className="pb-3">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <FileText className="h-3.5 w-3.5" />
          <span>
            {group.document_count} / 3 document{group.document_count !== 1 ? "s" : ""}
          </span>
        </div>
      </CardContent>

      <CardFooter className="mt-auto gap-2 pt-0">
        <Button asChild className="flex-1" size="sm">
          <Link to={`/groups/${group.id}`}>
            <MessageSquare className="mr-1.5 h-3.5 w-3.5" />
            Open
          </Link>
        </Button>
        <p className="text-xs text-muted-foreground">{formatDate(group.created_at)}</p>
      </CardFooter>
    </Card>
  );
}
