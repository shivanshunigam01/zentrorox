import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createBranch, createUser, fetchAutomations, fetchBranches, fetchUsers, upsertAutomation } from "@/lib/zentroflow/api";
import { toast } from "@/hooks/use-toast";

export default function ZentroFlowSettings() {
  const [branches, setBranches] = useState<Array<{ id: string; name: string; branch_code: string }>>([]);
  const [users, setUsers] = useState<Array<{ id: string; name: string; email: string; role: string }>>([]);
  const [branchName, setBranchName] = useState("");
  const [userForm, setUserForm] = useState({ name: "", email: "", password: "ChangeMe@123", role: "client_executive" });

  const load = async () => {
    try {
      const [b, u] = await Promise.all([fetchBranches(), fetchUsers()]);
      setBranches(b.items);
      setUsers(u.items);
    } catch (e) {
      toast({ title: (e as Error).message, variant: "destructive" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold">Team & branches</h1>
        <p className="text-sm text-muted-foreground">RBAC users and outlet structure for this tenant.</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add branch</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input value={branchName} onChange={(e) => setBranchName(e.target.value)} />
            </div>
            <Button
              size="sm"
              onClick={async () => {
                await createBranch({ name: branchName });
                setBranchName("");
                load();
              }}
            >
              Create branch
            </Button>
            <ul className="text-sm space-y-1 pt-2">
              {branches.map((b) => (
                <li key={b.id}>
                  {b.name} <span className="text-xs text-muted-foreground">({b.branch_code})</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Add user</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <Label>Name</Label>
              <Input value={userForm.name} onChange={(e) => setUserForm({ ...userForm, name: e.target.value })} />
            </div>
            <div>
              <Label>Email</Label>
              <Input value={userForm.email} onChange={(e) => setUserForm({ ...userForm, email: e.target.value })} />
            </div>
            <div>
              <Label>Role</Label>
              <Input value={userForm.role} onChange={(e) => setUserForm({ ...userForm, role: e.target.value })} />
            </div>
            <Button
              size="sm"
              onClick={async () => {
                await createUser(userForm);
                setUserForm({ name: "", email: "", password: "ChangeMe@123", role: "client_executive" });
                load();
              }}
            >
              Create user
            </Button>
            <ul className="text-sm space-y-1 pt-2">
              {users.map((u) => (
                <li key={u.id}>
                  {u.name} · {u.role} <span className="text-xs text-muted-foreground">{u.email}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export function ZentroFlowAutomations() {
  const [items, setItems] = useState<Array<Record<string, unknown>>>([]);
  const [name, setName] = useState("New lead → notify owner");

  const load = () => fetchAutomations().then((r) => setItems(r.items));
  useEffect(() => {
    load().catch(() => undefined);
  }, []);

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold">Automations</h1>
        <p className="text-sm text-muted-foreground">Trigger + conditions + actions (versioned). Providers execute via job queue.</p>
      </div>
      <Card>
        <CardContent className="p-4 flex gap-2 flex-wrap items-end">
          <div className="flex-1 min-w-[200px]">
            <Label>Rule name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <Button
            onClick={async () => {
              await upsertAutomation({
                name,
                trigger: "lead.created",
                conditions: {},
                actions: [{ type: "notify", target: "owner" }],
                active: true,
              });
              load();
            }}
          >
            Save rule
          </Button>
        </CardContent>
      </Card>
      {items.map((r) => (
        <Card key={String(r.id)}>
          <CardContent className="p-4 text-sm">
            <div className="font-semibold">{String(r.name)}</div>
            <div className="text-xs text-muted-foreground">
              {String(r.trigger)} · v{String(r.version)} · {r.active ? "active" : "off"}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
