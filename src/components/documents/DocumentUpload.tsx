import { useCallback, useState } from "react";
import { FileText, Loader2, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { formatFileSize, MAX_DOCS_PER_GROUP } from "@/lib/utils";
import type { Document, DocumentStatus } from "@/types";

const STATUS_BADGE: Record<DocumentStatus, { label: string; variant: "success" | "warning" | "destructive" | "processing" | "outline" }> = {
  ready: { label: "Ready", variant: "success" },
  processing: { label: "Processing", variant: "processing" },
  pending: { label: "Pending", variant: "warning" },
  failed: { label: "Failed", variant: "destructive" },
};

interface DocumentUploadProps {
  documents: Document[];
  onUpload: (file: File) => Promise<void>;
  onDelete: (documentId: string) => Promise<void>;
  isUploading: boolean;
}

export function DocumentUpload({ documents, onUpload, onDelete, isUploading }: DocumentUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const canUpload = documents.length < MAX_DOCS_PER_GROUP;

  const handleFile = useCallback(
    async (file: File) => {
      if (!canUpload) return;
      await onUpload(file);
    },
    [canUpload, onUpload]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-sm">Documents ({documents.length}/{MAX_DOCS_PER_GROUP})</h3>
      </div>

      {/* Document list */}
      <div className="space-y-2">
        {documents.map((doc) => {
          const { label, variant } = STATUS_BADGE[doc.status];
          return (
            <Card key={doc.id} className="flex items-center gap-3 p-3">
              <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{doc.original_filename}</p>
                <p className="text-xs text-muted-foreground">{formatFileSize(doc.file_size)}</p>
              </div>
              <Badge variant={variant}>{label}</Badge>
              {doc.status === "processing" && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground" />}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => onDelete(doc.id)}
                disabled={doc.status === "processing"}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </Card>
          );
        })}
      </div>

      {/* Upload area */}
      {canUpload && (
        <label
          className={`flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed p-6 text-center transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/30"
          } ${isUploading ? "pointer-events-none opacity-60" : ""}`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <input
            type="file"
            className="sr-only"
            accept=".pdf,.txt,.docx"
            onChange={handleFileInput}
            disabled={isUploading}
          />
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          ) : (
            <Upload className="h-6 w-6 text-muted-foreground" />
          )}
          <div>
            <p className="text-sm font-medium">{isUploading ? "Uploading..." : "Drop file or click to upload"}</p>
            <p className="text-xs text-muted-foreground">PDF, TXT, DOCX — max 10 MB</p>
          </div>
        </label>
      )}

      {!canUpload && (
        <p className="text-center text-xs text-muted-foreground">
          Maximum {MAX_DOCS_PER_GROUP} documents reached. Delete one to upload another.
        </p>
      )}
    </div>
  );
}
