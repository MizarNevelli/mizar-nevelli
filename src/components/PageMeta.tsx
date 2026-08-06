const SITE_URL = import.meta.env.VITE_SITE_URL ?? "https://mizarnevelli.vercel.app";

type Props = {
  title: string;
  description: string;
  image?: string;
  path?: string;
};

export function PageMeta({ title, description, image, path }: Props) {
  const fullTitle = title === "Mizar" ? "Mizar" : `${title} · Mizar`;
  const ogImage = image ?? `${SITE_URL}/og.png`;
  const canonical = path ? `${SITE_URL}${path}` : undefined;

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {canonical && <link rel="canonical" href={canonical} />}

      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      {canonical && <meta property="og:url" content={canonical} />}

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      <meta property="og:type" content="website" />
    </>
  );
}
