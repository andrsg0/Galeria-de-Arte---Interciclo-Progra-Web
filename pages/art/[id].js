import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";

export default function ArtDetail({ objectData }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  if (!objectData) {
    return (
      <div className="container mx-auto p-4">
        <Header />
        <p>Obra no encontrada.</p>
        <Link href="/">← Volver</Link>
        <Footer />
      </div>
    );
  }

  const {
    primaryImage,
    primaryImageSmall,
    title,
    artistDisplayName,
    objectDate,
    medium,
    dimensions,
    creditLine,
    department,
    objectURL,
    culture,
    classification,
  } = objectData;

  return (
    <div className="relative">
      <Head>
        <title>{title} — Galería de Arte</title>
      </Head>
      <div className="container mx-auto mb-10 p-4">
        <Header />

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {primaryImage ? (
              <img src={primaryImage} alt={title} className="w-full h-auto" />
            ) : primaryImageSmall ? (
              <img src={primaryImageSmall} alt={title} className="w-full h-auto" />
            ) : (
              <div className="w-full h-96 bg-gray-200 flex items-center justify-center">
                Sin imagen disponible
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <h1 className="text-3xl font-bold">{title}</h1>
            <p className="mt-2 text-lg text-gray-700">{artistDisplayName}</p>
            <p className="mt-1 text-sm text-gray-500">{objectDate}</p>

            <div className="mt-4">
              <h2 className="text-xl font-semibold">Detalles</h2>
              <ul className="mt-2 space-y-2 text-sm text-gray-700">
                {medium && (
                  <li>
                    <strong>Medio:</strong> {medium}
                  </li>
                )}
                {dimensions && (
                  <li>
                    <strong>Dimensiones:</strong> {dimensions}
                  </li>
                )}
                {culture && (
                  <li>
                    <strong>Cultura:</strong> {culture}
                  </li>
                )}
                {classification && (
                  <li>
                    <strong>Clasificación:</strong> {classification}
                  </li>
                )}
                {creditLine && (
                  <li>
                    <strong>Procedencia:</strong> {creditLine}
                  </li>
                )}
                {department && (
                  <li>
                    <strong>Departamento:</strong> {department}
                  </li>
                )}
              </ul>
            </div>

            {objectURL && (
              <p className="mt-4">
                <a
                  className="text-blue-600 underline"
                  href={objectURL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Ver en MET (fuente)
                </a>
              </p>
            )}

            <div className="mt-6">
              <Link href="/">
                <a className="text-sm text-gray-600">← Volver a la galería</a>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const res = await fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`);
    if (!res.ok) {
      return { notFound: true };
    }
    const data = await res.json();

    // If the object has no images and no title, treat as not found
    if (!data || (!data.primaryImage && !data.primaryImageSmall && !data.title)) {
      return { notFound: true };
    }

    return { props: { objectData: data } };
  } catch (err) {
    return { notFound: true };
  }
}
