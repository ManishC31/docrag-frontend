import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FolderOpen } from "lucide-react";
import { GroupCard } from "@/components/groups/GroupCard";
import { CreateGroupDialog } from "@/components/groups/CreateGroupDialog";
import { useToast } from "@/hooks/use-toast";
import { api, getErrorMessage } from "@/lib/api";
import type { Group } from "@/types";

export function DashboardPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: groups = [], isLoading } = useQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const { data } = await api.get<Group[]>("/groups");
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async ({ name, description }: { name: string; description: string }) => {
      const { data } = await api.post<Group>("/groups", { name, description: description || undefined });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast({ title: "Group created successfully" });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Failed to create group", description: getErrorMessage(err) });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (groupId: string) => {
      await api.delete(`/groups/${groupId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast({ title: "Group deleted" });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Failed to delete group", description: getErrorMessage(err) });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">My Groups</h1>
          <p className="text-sm text-muted-foreground">Organize documents into groups and chat with them</p>
        </div>
        <CreateGroupDialog
          onCreate={(name, description) => createMutation.mutateAsync({ name, description })}
        />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-40 rounded-lg border bg-muted/30 animate-pulse" />
          ))}
        </div>
      ) : groups.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16 text-center text-muted-foreground">
          <FolderOpen className="h-12 w-12 opacity-40" />
          <div>
            <p className="font-medium">No groups yet</p>
            <p className="text-sm">Create a group to start uploading documents</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onDelete={(id) => deleteMutation.mutate(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
