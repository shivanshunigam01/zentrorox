import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createAnnouncement,
  createDepartment,
  createDesignation,
  fetchAnnouncements,
  fetchDepartments,
  fetchDesignations,
  fetchHrOrganization,
  updateHrOrganization,
  type HrDepartment,
  type HrDesignation,
} from "@/lib/hr/api";
import type { HrOrganization } from "@/lib/hr/auth";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function HrOrganizationPage() {
  const [org, setOrg] = useState<HrOrganization | null>(null);
  const [departments, setDepartments] = useState<HrDepartment[]>([]);
  const [designations, setDesignations] = useState<HrDesignation[]>([]);
  const [announcements, setAnnouncements] = useState<{ id: string; title: string; body: string }[]>([]);
  const [deptName, setDeptName] = useState("");
  const [desName, setDesName] = useState("");
  const [ann, setAnn] = useState({ title: "", body: "" });

  const setOrgField = (key: keyof HrOrganization, value: string) => {
    setOrg((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const load = async () => {
    try {
      const [o, d, des, a] = await Promise.all([
        fetchHrOrganization(),
        fetchDepartments(),
        fetchDesignations(),
        fetchAnnouncements(),
      ]);
      setOrg(o);
      setDepartments(d.items);
      setDesignations(des.items);
      setAnnouncements(a.items);
    } catch (e) {
      toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
    }
  };

  useEffect(() => {
    load();
  }, []);

  if (!org) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold">Organization</h1>
        <p className="text-sm text-muted-foreground">Company profile, departments and announcements.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Company profile</CardTitle>
        </CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-3">
          {(
            [
              ["name", "Name"],
              ["industry", "Industry"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["website", "Website"],
            ] as const
          ).map(([key, label]) => (
            <div key={key} className="space-y-1.5">
              <Label>{label}</Label>
              <Input
                value={String(org[key] ?? "")}
                onChange={(e) => setOrgField(key, e.target.value)}
              />
            </div>
          ))}
          <div className="sm:col-span-2">
            <Button
              onClick={async () => {
                try {
                  const saved = await updateHrOrganization(org);
                  setOrg(saved);
                  toast({ title: "Organization saved" });
                } catch (e) {
                  toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
                }
              }}
            >
              Save profile
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Departments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input placeholder="New department" value={deptName} onChange={(e) => setDeptName(e.target.value)} />
              <Button
                onClick={async () => {
                  if (!deptName.trim()) return;
                  try {
                    await createDepartment({ name: deptName.trim() });
                    setDeptName("");
                    load();
                  } catch (e) {
                    toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
                  }
                }}
              >
                Add
              </Button>
            </div>
            <ul className="text-sm space-y-1">
              {departments.map((d) => (
                <li key={d.id} className="border rounded-lg px-3 py-2">
                  {d.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Designations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex gap-2">
              <Input placeholder="New designation" value={desName} onChange={(e) => setDesName(e.target.value)} />
              <Button
                onClick={async () => {
                  if (!desName.trim()) return;
                  try {
                    await createDesignation({ name: desName.trim() });
                    setDesName("");
                    load();
                  } catch (e) {
                    toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
                  }
                }}
              >
                Add
              </Button>
            </div>
            <ul className="text-sm space-y-1">
              {designations.map((d) => (
                <li key={d.id} className="border rounded-lg px-3 py-2">
                  {d.name}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Announcements</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input placeholder="Title" value={ann.title} onChange={(e) => setAnn({ ...ann, title: e.target.value })} />
          <Input placeholder="Body" value={ann.body} onChange={(e) => setAnn({ ...ann, body: e.target.value })} />
          <Button
            onClick={async () => {
              try {
                await createAnnouncement(ann);
                setAnn({ title: "", body: "" });
                toast({ title: "Published" });
                load();
              } catch (e) {
                toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
              }
            }}
          >
            Publish
          </Button>
          <div className="space-y-2 pt-2">
            {announcements.map((a) => (
              <div key={a.id} className="border rounded-lg p-3 text-sm">
                <div className="font-semibold">{a.title}</div>
                <p className="text-muted-foreground">{a.body}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
