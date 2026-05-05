import { useCallback, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DocumentUpload } from "@/components/documents/DocumentUpload";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { useToast } from "@/hooks/use-toast";
import { api, getErrorMessage } from "@/lib/api";
import type { ChatMessage, Document, Group } from "@/types";

export function GroupDetailPage() {
  const { groupId } = useParams<{ groupId: string }>();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: group } = useQuery({
    queryKey: ["group", groupId],
    queryFn: async () => {
      const { data } = await api.get<Group>(`/groups/${groupId}`);
      return data;
    },
    enabled: !!groupId,
  });

  const { data: documents = [] } = useQuery({
    queryKey: ["documents", groupId],
    queryFn: async () => {
      const { data } = await api.get<Document[]>(`/groups/${groupId}/documents`);
      return data;
    },
    enabled: !!groupId,
    refetchInterval: (query) => {
      const docs = query.state.data ?? [];
      const hasPending = docs.some((d) => d.status === "pending" || d.status === "processing");
      return hasPending ? 3000 : false;
    },
  });

  const { data: chatHistory = [] } = useQuery({
    queryKey: ["chat", groupId],
    queryFn: async () => {
      const { data } = await api.get<ChatMessage[]>(`/groups/${groupId}/chat/history`);
      return data;
    },
    enabled: !!groupId,
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const { data } = await api.post<Document>(`/groups/${groupId}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast({ title: "Document uploaded", description: "Processing in the background..." });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Upload failed", description: getErrorMessage(err) });
    },
  });

  const deleteDocMutation = useMutation({
    mutationFn: async (documentId: string) => {
      await api.delete(`/groups/${groupId}/documents/${documentId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents", groupId] });
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      toast({ title: "Document deleted" });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Delete failed", description: getErrorMessage(err) });
    },
  });

  const chatMutation = useMutation({
    mutationFn: async (question: string) => {
      const { data } = await api.post<ChatMessage>(`/groups/${groupId}/chat`, { question });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["chat", groupId] });
    },
    onError: (err) => {
      toast({ variant: "destructive", title: "Failed to get answer", description: getErrorMessage(err) });
    },
  });

  const hasReadyDocuments = documents.some((d) => d.status === "ready");

  return (
    <div className="flex h-[calc(100vh-3.5rem-3rem)] flex-col gap-4 lg:flex-row">
      {/* Sidebar: Group info + documents */}
      <aside className="w-full shrink-0 space-y-4 lg:w-72">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
            <Link to="/dashboard">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-semibold">{group?.name ?? "Loading..."}</h1>
            {group?.description && (
              <p className="truncate text-xs text-muted-foreground">{group.description}</p>
            )}
          </div>
        </div>

        <div className="rounded-lg border bg-card p-4">
          <DocumentUpload
            documents={documents}
            onUpload={(file) => uploadMutation.mutateAsync(file)}
            onDelete={(id) => deleteDocMutation.mutateAsync(id)}
            isUploading={uploadMutation.isPending}
          />
        </div>
      </aside>

      {/* Chat panel */}
      <div className="flex min-h-0 flex-1 flex-col rounded-lg border bg-card overflow-hidden">
        <div className="border-b px-4 py-2.5">
          <h2 className="text-sm font-medium">Chat</h2>
          <p className="text-xs text-muted-foreground">Ask questions about your documents</p>
        </div>
        <div className="flex-1 overflow-hidden">
          <ChatInterface
            messages={chatHistory}
            onSend={(q) => chatMutation.mutateAsync(q)}
            isLoading={chatMutation.isPending}
            hasReadyDocuments={hasReadyDocuments}
          />
        </div>
      </div>
    </div>
  );
}
