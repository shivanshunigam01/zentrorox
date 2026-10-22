import ecosystemOrbit from "@/assets/ecosystem-orbit.png";

export default function EcosystemOrbit() {
  return (
    <section className="w-full bg-white py-8 md:py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <img
          src={ecosystemOrbit}
          alt="One Universe. Nine Products. The Zentroverse Ecosystem"
          className="w-full h-auto"
        />
      </div>
    </section>
  );
}
