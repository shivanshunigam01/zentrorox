import flowImage from "@/assets/ecosystem-flow.png";

export default function EcosystemFlow() {
  return (
    <section className="w-full bg-white pt-4 pb-12 md:pb-16 px-4">
      <div className="max-w-7xl mx-auto">
        <img
          src={flowImage}
          alt="The Zentroverse Flow — Your Complete Growth Journey: Lead, AI Engagement, Inspection, CRM, Dealer, Customer, Service, Upgrade"
          className="w-full h-auto"
          loading="lazy"
        />
      </div>
    </section>
  );
}
