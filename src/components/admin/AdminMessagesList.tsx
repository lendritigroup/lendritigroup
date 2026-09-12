"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { ContactMessage } from "@/types/database";

export function AdminMessagesList({
  locale,
  messages,
}: {
  locale: string;
  messages: ContactMessage[];
}) {
  const [selected, setSelected] = useState<ContactMessage | null>(null);
  const supabase = createClient();

  const markAsRead = async (id: string) => {
    await supabase
      .from("contact_messages")
      .update({ status: "read" })
      .eq("id", id);
    setSelected((prev) =>
      prev?.id === id ? { ...prev, status: "read" as const } : prev
    );
  };

  return (
    <div className="rounded-lg border overflow-hidden">
      <table className="w-full">
        <thead className="bg-muted">
          <tr>
            <th className="text-left p-4">From</th>
            <th className="text-left p-4">Subject</th>
            <th className="text-left p-4">Date</th>
            <th className="text-left p-4">Status</th>
          </tr>
        </thead>
        <tbody>
          {messages.map((msg) => (
            <tr
              key={msg.id}
              className="border-t cursor-pointer hover:bg-muted/50"
              onClick={() => {
                setSelected(msg);
                if (msg.status === "new") markAsRead(msg.id);
              }}
            >
              <td className="p-4">{msg.name}</td>
              <td className="p-4 truncate max-w-[200px]">{msg.message.slice(0, 50)}...</td>
              <td className="p-4 text-sm text-muted-foreground">
                {new Date(msg.created_at).toLocaleDateString()}
              </td>
              <td className="p-4">
                <Badge variant={msg.status === "new" ? "default" : "secondary"}>
                  {msg.status}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{selected?.name}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="space-y-2 text-sm">
              <p><strong>Email:</strong> {selected.email}</p>
              <p><strong>Phone:</strong> {selected.phone || "—"}</p>
              <p><strong>Product ref:</strong> {selected.product_id || "—"}</p>
              <p className="pt-4 whitespace-pre-wrap">{selected.message}</p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
