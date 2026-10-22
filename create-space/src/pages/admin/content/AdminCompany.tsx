import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CmsModuleHeader } from "@/components/admin/cms/CmsModuleHeader";
import { fetchCmsSection, saveCmsCompany } from "@/lib/cms/cmsApi";
import { DEFAULT_CMS } from "@/lib/cms/defaults";
import { useCmsAdminSave } from "@/hooks/useCmsAdminSave";
import type { CompanyProfile } from "@/lib/cms/types";

const AdminCompany = () => {
  const { publishResult } = useCmsAdminSave();
  const [company, setCompany] = useState<CompanyProfile>(DEFAULT_CMS.company);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchCmsSection("company").then((d) => {
      if (d?.company) setCompany(d.company);
    });
  }, []);

  const patch = (patch: Partial<CompanyProfile>) => setCompany((c) => ({ ...c, ...patch }));

  const handleSave = async () => {
    setSaving(true);
    const result = await saveCmsCompany(company);
    setSaving(false);
    await publishResult(result, "Company profile published", "Contact info and footer are updated.");
  };

  return (
    <div className="space-y-6">
      <CmsModuleHeader
        title="Company Profile"
        description="Legal info, contact details, bank account, and social links used across the site."
        onSave={handleSave}
        saving={saving}
      />

      <Card>
        <CardHeader><CardTitle>Company profile</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4 max-w-4xl">
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Legal name</Label>
            <Input value={company.legalName} onChange={(e) => patch({ legalName: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Tagline</Label>
            <Input value={company.tagline} onChange={(e) => patch({ tagline: e.target.value })} />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <Label>Address</Label>
            <Textarea rows={3} value={company.address} onChange={(e) => patch({ address: e.target.value })} />
          </div>
          <div className="space-y-1.5"><Label>GSTIN</Label><Input value={company.gstin} onChange={(e) => patch({ gstin: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Email</Label><Input value={company.email} onChange={(e) => patch({ email: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Website</Label><Input value={company.website} onChange={(e) => patch({ website: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Phone (display)</Label><Input value={company.phone} onChange={(e) => patch({ phone: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>WhatsApp number (no +)</Label><Input value={company.whatsappNumber} onChange={(e) => patch({ whatsappNumber: e.target.value })} /></div>
          <div className="space-y-1.5 sm:col-span-2"><Label>WhatsApp message</Label><Textarea rows={2} value={company.whatsappMessage} onChange={(e) => patch({ whatsappMessage: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Business hours</Label><Input value={company.hours} onChange={(e) => patch({ hours: e.target.value })} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Bank / account details</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4 max-w-4xl">
          <div className="space-y-1.5"><Label>Bank name</Label><Input value={company.bankName} onChange={(e) => patch({ bankName: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Account name</Label><Input value={company.accountName} onChange={(e) => patch({ accountName: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>Account number</Label><Input value={company.accountNumber} onChange={(e) => patch({ accountNumber: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>IFSC</Label><Input value={company.ifsc} onChange={(e) => patch({ ifsc: e.target.value })} /></div>
          <div className="space-y-1.5"><Label>UPI ID</Label><Input value={company.upi} onChange={(e) => patch({ upi: e.target.value })} /></div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Social links</CardTitle></CardHeader>
        <CardContent className="grid sm:grid-cols-2 gap-4 max-w-4xl">
          {company.social.map((s, i) => (
            <div key={s.platform} className="space-y-1.5">
              <Label className="capitalize">{s.platform}</Label>
              <Input
                placeholder={`https://${s.platform}.com/...`}
                value={s.url}
                onChange={(e) => {
                  const social = [...company.social];
                  social[i] = { ...s, url: e.target.value };
                  patch({ social });
                }}
              />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminCompany;
