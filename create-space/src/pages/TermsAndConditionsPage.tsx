import { LegalDocumentPage } from "@/components/legal/LegalDocumentPage";
import { PRIVACY_POLICY, TERMS_AND_CONDITIONS } from "@/data/legalContent";

const TermsAndConditionsPage = () => (
  <LegalDocumentPage
    document={TERMS_AND_CONDITIONS}
    alternate={{ label: "Privacy Policy", href: PRIVACY_POLICY.path }}
  />
);

export default TermsAndConditionsPage;
