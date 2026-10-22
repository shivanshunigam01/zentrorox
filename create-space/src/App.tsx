import { BrowserRouter, Route, Routes, useLocation, type Location } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { GOOGLE_CLIENT_ID } from "@/config/google";
import Index from "./pages/Index.tsx";
import AutomationLayout from "./layouts/AutomationLayout.tsx";
import AutomationHome from "./pages/Automation.tsx";
import AutomationTopicPage from "./pages/automation/AutomationTopicPage.tsx";
import Login from "./pages/Login.tsx";
import Register from "./pages/Register.tsx";
import NotFound from "./pages/NotFound.tsx";
import AdminLogin from "./pages/admin/AdminLogin.tsx";
import AdminLayout from "./components/admin/AdminLayout.tsx";
import AdminDashboard from "./pages/admin/AdminDashboard.tsx";
import AdminLeads from "./pages/admin/AdminLeads.tsx";
import AdminBajajAsd from "./pages/admin/AdminBajajAsd.tsx";
import AdminCustomers from "./pages/admin/AdminCustomers.tsx";
import AdminQuotations from "./pages/admin/AdminQuotations.tsx";
import AdminInvoices from "./pages/admin/AdminInvoices.tsx";
import AdminReceipts from "./pages/admin/AdminReceipts.tsx";
import AdminSettings from "./pages/admin/AdminSettings.tsx";
import BusinessSettings from "./pages/BusinessSettings.tsx";
import ProductDetail from "./pages/ProductDetail.tsx";
import ProductsIndex from "./pages/ProductsIndex.tsx";
import ServicePage from "./pages/ServicePage.tsx";
import ServicesIndex from "./pages/ServicesIndex.tsx";
import LocationPage from "./pages/LocationPage.tsx";
import LocationsIndex from "./pages/LocationsIndex.tsx";
import BlogIndex from "./pages/BlogIndex.tsx";
import BlogPostPage from "./pages/BlogPostPage.tsx";
import { SeoLandingTemplate } from "./components/seo/SeoLandingTemplate.tsx";
import { SEO_LANDING_PAGES } from "./data/seoLandingPages.ts";
import { AnalyticsProvider } from "./components/AnalyticsProvider.tsx";
import { ScrollToTop } from "./components/ScrollToTop.tsx";
import { CmsProvider } from "./contexts/CmsContext.tsx";
import AdminContent from "./pages/admin/AdminContent.tsx";
import AdminWorks from "./pages/admin/content/AdminWorks.tsx";
import AdminCaseStudies from "./pages/admin/content/AdminCaseStudies.tsx";
import AdminReviews from "./pages/admin/content/AdminReviews.tsx";
import AdminGallery from "./pages/admin/content/AdminGallery.tsx";
import AdminProductDemos from "./pages/admin/content/AdminProductDemos.tsx";
import AdminCompany from "./pages/admin/content/AdminCompany.tsx";
import AdminHeroSeo from "./pages/admin/content/AdminHeroSeo.tsx";
import AdminFaqs from "./pages/admin/content/AdminFaqs.tsx";
import AdminGrowthHub from "./pages/admin/AdminGrowthHub.tsx";
import AdminSubmissions from "./pages/admin/AdminSubmissions.tsx";
import AdminPulsarReferrals from "./pages/admin/AdminPulsarReferrals.tsx";
import GrowthHubIndex from "./pages/GrowthHubIndex.tsx";
import GrowthHubToolPage from "./pages/GrowthHubToolPage.tsx";
import AskZentroAI from "./pages/AskZentroAI.tsx";
import WorksPage from "./pages/WorksPage.tsx";
import AboutPage from "./pages/AboutPage.tsx";
import IndustriesPage from "./pages/IndustriesPage.tsx";
import ResourcesPage from "./pages/ResourcesPage.tsx";
import ContactPage from "./pages/ContactPage.tsx";
import PrivacyPolicyPage from "./pages/PrivacyPolicyPage.tsx";
import TermsAndConditionsPage from "./pages/TermsAndConditionsPage.tsx";
import PricingPage from "./pages/PricingPage.tsx";
import AdminPlans from "./pages/admin/content/AdminPlans.tsx";
import HyOffersLogin from "./pages/hyOffers/HyOffersLogin.tsx";
import HyOffersDashboard from "./pages/hyOffers/HyOffersDashboard.tsx";
import ReferralLandingPage from "./pages/hyOffers/ReferralLandingPage.tsx";
import BajajAsdLandingPage from "./pages/bajajAsd/BajajAsdLandingPage.tsx";
import AdminZentroFlow from "./pages/admin/AdminZentroFlow.tsx";
import AdminHr from "./pages/admin/AdminHr.tsx";
import ZentroFlowLayout from "./pages/zentroflow/ZentroFlowLayout.tsx";
import ZentroFlowLogin from "./pages/zentroflow/ZentroFlowLogin.tsx";
import ZentroFlowDashboard from "./pages/zentroflow/ZentroFlowDashboard.tsx";
import ZentroFlowLeads from "./pages/zentroflow/ZentroFlowLeads.tsx";
import ZentroFlowLeadDetail from "./pages/zentroflow/ZentroFlowLeadDetail.tsx";
import ZentroFlowVerification from "./pages/zentroflow/ZentroFlowVerification.tsx";
import ZentroFlowIntegrations from "./pages/zentroflow/ZentroFlowIntegrations.tsx";
import ZentroFlowJobs from "./pages/zentroflow/ZentroFlowJobs.tsx";
import ZentroFlowSettings, { ZentroFlowAutomations } from "./pages/zentroflow/ZentroFlowSettings.tsx";
import HrLayout from "./pages/hr/HrLayout.tsx";
import HrLogin from "./pages/hr/HrLogin.tsx";
import HrRegister from "./pages/hr/HrRegister.tsx";
import HrDashboard from "./pages/hr/HrDashboard.tsx";
import HrEmployees from "./pages/hr/HrEmployees.tsx";
import HrAttendance from "./pages/hr/HrAttendance.tsx";
import HrLeave from "./pages/hr/HrLeave.tsx";
import HrOrganizationPage from "./pages/hr/HrOrganization.tsx";
import HrProfile from "./pages/hr/HrProfile.tsx";

const queryClient = new QueryClient();

type LocationState = {
  backgroundLocation?: Location;
};

const AppRoutes = () => {
  const location = useLocation();
  const state = location.state as LocationState | null;
  const backgroundLocation = state?.backgroundLocation;

  return (
    <>
      <Routes location={backgroundLocation || location}>
        <Route path="/" element={<Index />} />
        <Route path="/works" element={<WorksPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/industries" element={<IndustriesPage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditionsPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/products" element={<ProductsIndex />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/services" element={<ServicesIndex />} />
        <Route path="/services/:slug" element={<ServicePage />} />
        <Route path="/locations" element={<LocationsIndex />} />
        <Route path="/locations/:slug" element={<LocationPage />} />
        <Route path="/blogs" element={<BlogIndex />} />
        <Route path="/blogs/:slug" element={<BlogPostPage />} />
        {SEO_LANDING_PAGES.map((p) => (
          <Route key={p.slug} path={`/${p.slug}`} element={<SeoLandingTemplate page={p} />} />
        ))}
        <Route path="/growth-hub" element={<GrowthHubIndex />} />
        <Route path="/growth-hub/tools/:toolId" element={<GrowthHubToolPage />} />
        <Route path="/growth-hub/ask-ai" element={<AskZentroAI />} />
        <Route path="/automation" element={<AutomationLayout />}>
          <Route index element={<AutomationHome />} />
          <Route path=":category/:slug" element={<AutomationTopicPage />} />
        </Route>
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="submissions" element={<AdminSubmissions />} />
          <Route path="leads" element={<AdminLeads />} />
          <Route path="bajaj-asd" element={<AdminBajajAsd />} />
          <Route path="pulsar" element={<AdminPulsarReferrals />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="quotations" element={<AdminQuotations />} />
          <Route path="invoices" element={<AdminInvoices />} />
          <Route path="receipts" element={<AdminReceipts />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="content" element={<AdminContent />} />
          <Route path="content/works" element={<AdminWorks />} />
          <Route path="content/case-studies" element={<AdminCaseStudies />} />
          <Route path="content/reviews" element={<AdminReviews />} />
          <Route path="content/gallery" element={<AdminGallery />} />
          <Route path="content/product-demos" element={<AdminProductDemos />} />
          <Route path="content/company" element={<AdminCompany />} />
          <Route path="content/hero-seo" element={<AdminHeroSeo />} />
          <Route path="content/faqs" element={<AdminFaqs />} />
          <Route path="content/plans" element={<AdminPlans />} />
          <Route path="growth-hub" element={<AdminGrowthHub />} />
          <Route path="zentroflow" element={<AdminZentroFlow />} />
          <Route path="hr" element={<AdminHr />} />
        </Route>
        <Route path="/zentroflow/login" element={<ZentroFlowLogin />} />
        <Route path="/zentroflow" element={<ZentroFlowLayout />}>
          <Route index element={<ZentroFlowDashboard />} />
          <Route path="leads" element={<ZentroFlowLeads />} />
          <Route path="leads/:id" element={<ZentroFlowLeadDetail />} />
          <Route path="verification" element={<ZentroFlowVerification />} />
          <Route path="integrations" element={<ZentroFlowIntegrations />} />
          <Route path="automations" element={<ZentroFlowAutomations />} />
          <Route path="jobs" element={<ZentroFlowJobs />} />
          <Route path="settings" element={<ZentroFlowSettings />} />
        </Route>
        <Route path="/hr/login" element={<HrLogin />} />
        <Route path="/hr/register" element={<HrRegister />} />
        <Route path="/hr" element={<HrLayout />}>
          <Route index element={<HrDashboard />} />
          <Route path="employees" element={<HrEmployees />} />
          <Route path="attendance" element={<HrAttendance />} />
          <Route path="leave" element={<HrLeave />} />
          <Route path="organization" element={<HrOrganizationPage />} />
          <Route path="profile" element={<HrProfile />} />
        </Route>
        <Route path="/business" element={<BusinessSettings />} />
        <Route path="/hy_offers/login" element={<HyOffersLogin />} />
        <Route path="/hy_offers" element={<HyOffersDashboard />} />
        <Route path="/pulsar/:branch/:code" element={<ReferralLandingPage />} />
        <Route path="/pulsar/:code" element={<ReferralLandingPage />} />
        <Route path="/bajaj_asd" element={<BajajAsdLandingPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>

      {backgroundLocation ? (
        <Routes>
          <Route path="/login" element={<Login isPopup />} />
          <Route path="/register" element={<Register isPopup />} />
        </Routes>
      ) : null}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <BrowserRouter>
          <ScrollToTop />
          <CmsProvider>
            <AnalyticsProvider>
              <AppRoutes />
            </AnalyticsProvider>
          </CmsProvider>
        </BrowserRouter>
      </GoogleOAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
