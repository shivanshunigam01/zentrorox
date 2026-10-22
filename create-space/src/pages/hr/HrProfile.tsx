import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { hrMe, updateHrProfile } from "@/lib/hr/api";
import { getHrUser, setHrSession, getHrToken, getHrOrg, type HrUser } from "@/lib/hr/auth";
import { toast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";

export default function HrProfile() {
  const [user, setUser] = useState<HrUser | null>(getHrUser());
  const [phone, setPhone] = useState("");
  const [employeeCode, setEmployeeCode] = useState("");

  useEffect(() => {
    hrMe()
      .then((d) => {
        setUser(d.user);
        setPhone(d.employee?.phone || "");
        setEmployeeCode(d.employee?.employeeCode || "");
        if (d.user && d.organization) {
          setHrSession(getHrToken(), d.user, d.organization);
        }
      })
      .catch((e) => toast({ title: "Failed", description: e.message, variant: "destructive" }));
  }, []);

  if (!user) {
    return <Skeleton className="h-40 w-full" />;
  }

  return (
    <div className="space-y-6 max-w-xl">
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold">My Profile</h1>
        <p className="text-sm text-muted-foreground">Your HR account and employee details.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-1.5">
            <Label>Name</Label>
            <Input value={user.name} onChange={(e) => setUser({ ...user, name: e.target.value })} />
          </div>
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input value={user.email} disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Role</Label>
            <Input value={user.role} disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Employee code</Label>
            <Input value={employeeCode || "—"} disabled />
          </div>
          <div className="space-y-1.5">
            <Label>Phone</Label>
            <Input value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="text-xs text-muted-foreground">Org: {getHrOrg()?.name || user.organizationName || "—"}</div>
          <Button
            onClick={async () => {
              try {
                const updated = await updateHrProfile({ name: user.name, phone });
                setUser(updated);
                setHrSession(getHrToken(), updated, getHrOrg());
                toast({ title: "Profile saved" });
              } catch (e) {
                toast({ title: "Failed", description: (e as Error).message, variant: "destructive" });
              }
            }}
          >
            Save profile
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
