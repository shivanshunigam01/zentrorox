import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from "@/data/legalContent";

const PrivacyPolicyPage = () => (
  <LegalDocumentPage
    document={PRIVACY_POLICY}
    alternate={{ label: "Terms & Conditions", href: TERMS_AND_CONDITIONS.path }}
  />
);

export default PrivacyPolicyPage;
