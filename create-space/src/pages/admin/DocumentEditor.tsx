// Shared editor used by Quotations and Invoices.
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import { newId } from "@/lib/admin/store";
import type { Customer, DocBase, DocStatus, LineItem } from "@/lib/admin/types";

interface Props {
  value: DocBase;
  customers: Customer[];
  statuses: DocStatus[];
  onChange: (v: DocBase) => void;
}

export const DocumentEditor = ({ value, customers, statuses, onChange }: Props) => {
  const set = <K extends keyof DocBase>(k: K, v: DocBase[K]) => onChange({ ...value, [k]: v });
  const updateItem = (id: string, patch: Partial<LineItem>) =>
    set(
      "items",
      value.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    );
  const addItem = () => set("items", [...value.items, { id: newId(), description: "", qty: 1, rate: 0 }]);
  const removeItem = (id: string) => {
    if (value.items.length <= 1) return;
    set(
      "items",
      value.items.filter((i) => i.id !== id),
    );
  };

  const subtotal = value.items.reduce((s, i) => s + i.qty * i.rate, 0);
  const gst = (subtotal * value.gstPercent) / 100;
  const total = subtotal + gst;

  return (
    <div className="space-y-4">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="space-y-1.5">
          <Label>Number</Label>
          <Input
            value={value.number}
            placeholder="Auto on save"
            onChange={(e) => set("number", e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label>
            Customer <span className="text-destructive">*</span>
          </Label>
          <Select value={value.customerId || undefined} onValueChange={(v) => set("customerId", v)}>
            <SelectTrigger>
              <SelectValue placeholder={customers.length ? "Select customer" : "No customers yet"} />
            </SelectTrigger>
            <SelectContent>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {(c.company || c.name) + (c.company && c.name ? ` — ${c.name}` : "")}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>Date</Label>
          <Input type="date" value={value.date} onChange={(e) => set("date", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>Due / Valid till</Label>
          <Input type="date" value={value.dueDate ?? ""} onChange={(e) => set("dueDate", e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label>GST %</Label>
          <Input
            type="number"
            min={0}
            value={value.gstPercent}
            onChange={(e) => set("gstPercent", Number(e.target.value))}
          />
        </div>
        <div className="space-y-1.5">
          <Label>Status</Label>
          <Select value={value.status} onValueChange={(v) => set("status", v as DocStatus)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statuses.map((s) => (
                <SelectItem key={s} value={s}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>
            Line items <span className="text-destructive">*</span>
          </Label>
          <Button size="sm" variant="outline" onClick={addItem}>
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>
        <div className="space-y-2">
          {value.items.map((it) => (
            <div key={it.id} className="grid grid-cols-12 gap-2">
              <Input
                className="col-span-12 md:col-span-6"
                placeholder="Description"
                value={it.description}
                onChange={(e) => updateItem(it.id, { description: e.target.value })}
              />
              <Input
                className="col-span-3 md:col-span-2"
                type="number"
                min={0}
                placeholder="Qty"
                value={it.qty}
                onChange={(e) => updateItem(it.id, { qty: Number(e.target.value) })}
              />
              <Input
                className="col-span-5 md:col-span-2"
                type="number"
                min={0}
                placeholder="Rate"
                value={it.rate}
                onChange={(e) => updateItem(it.id, { rate: Number(e.target.value) })}
              />
              <div className="col-span-3 md:col-span-1 flex items-center text-sm font-semibold justify-end">
                ₹{(it.qty * it.rate).toLocaleString("en-IN")}
              </div>
              <Button
                size="icon"
                variant="ghost"
                className="col-span-1"
                disabled={value.items.length <= 1}
                onClick={() => removeItem(it.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Notes / terms</Label>
        <Textarea rows={3} value={value.notes ?? ""} onChange={(e) => set("notes", e.target.value)} />
      </div>

      <div className="bg-muted/40 rounded-lg p-4 grid grid-cols-3 gap-2 text-sm">
        <div className="text-muted-foreground">Subtotal</div>
        <div className="col-span-2 text-right">₹{subtotal.toLocaleString("en-IN")}</div>
        <div className="text-muted-foreground">GST ({value.gstPercent}%)</div>
        <div className="col-span-2 text-right">₹{gst.toLocaleString("en-IN")}</div>
        <div className="font-bold">Total</div>
        <div className="col-span-2 text-right font-bold">₹{total.toLocaleString("en-IN")}</div>
      </div>
    </div>
  );
};

export const computeTotal = (d: DocBase) => {
  const sub = d.items.reduce((s, i) => s + i.qty * i.rate, 0);
  return sub + (sub * d.gstPercent) / 100;
};

export const validateDocument = (d: DocBase): string | null => {
  if (!d.customerId) return "Please select a customer.";
  if (!d.date) return "Please set a document date.";
  if (!d.items.length) return "Add at least one line item.";
  if (!d.items.some((i) => i.description.trim())) return "Add a description for at least one line item.";
  if (d.items.some((i) => i.qty < 0 || i.rate < 0)) return "Qty and rate cannot be negative.";
  if (Number.isNaN(d.gstPercent) || d.gstPercent < 0) return "GST % must be zero or greater.";
  return null;
};

export const useDocState = <T extends DocBase>(initial: T) => useState<T>(initial);
