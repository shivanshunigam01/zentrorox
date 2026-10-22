import { buildHomepageSchemas } from "@/lib/homepageSchema";

export const HomepageSchema = () => {
  const schemas = buildHomepageSchemas();

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
};
