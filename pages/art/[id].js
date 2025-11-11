import Head from "next/head";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import SkeletonLoader from "../../components/SkeletonLoader";

export default function ArtDetail() {
  const router = useRouter();
  const { id } = router.query;

  const [objectData, setObjectData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    let cancelled = false;

    async function fetchObject() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
        );
        if (!res.ok) {
          throw new Error(`Status ${res.status}`);
        }
        const data = await res.json();
        if (!cancelled) {
          // Basic validation
          if (!data || (!data.primaryImage && !data.primaryImageSmall && !data.title)) {
            setObjectData(null);
            setError("Obra no encontrada");
          } else {
            setObjectData(data);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError("Error al obtener datos. Revisa tu conexión o intenta más tarde.");
          setObjectData(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchObject();

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Mostrar skeleton mientras carga o mientras no hay id en el router
  if (loading || !id) {
    return (
      <div className="relative">
        <div className="container mx-auto mb-10 p-4">
          <Header />
          <SkeletonLoader />
          <Footer />
        </div>
      </div>
    );
  }

  if (error)
    return (
      <div className="container mx-auto p-4">
        <Header />
        <p>{error}</p>
        <Link href="/">← Volver</Link>
        <Footer />
      </div>
    );

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
      <div className="container mx-auto mb-10 p-4 laptop:p-0">
        <Header />

        <div className="mt-12 laptop:mt-20">
          {/* Grid con imagen y información */}
          <div className="grid grid-cols-1 laptop:grid-cols-2 gap-12 laptop:gap-16">
            {/* Imagen principal con efecto sutil */}
            <div className="mb-8 laptop:mb-0">
              {primaryImage ? (
                <img 
                  src={primaryImage} 
                  alt={title} 
                  className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              ) : primaryImageSmall ? (
                <img 
                  src={primaryImageSmall} 
                  alt={title} 
                  className="w-full h-auto rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300"
                />
              ) : (
                <div className="w-full h-64 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-800 rounded-lg flex items-center justify-center shadow-md">
                  <p className="text-gray-600 dark:text-gray-400">Sin imagen disponible</p>
                </div>
              )}
            </div>

            {/* Grid con información */}
            <div className="space-y-8">
              <div className="border-b border-gray-200 dark:border-gray-700 pb-8">
                <h1 className="text-4xl laptop:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-4">
                  {title}
                </h1>
                {artistDisplayName && (
                  <p className="text-xl laptop:text-2xl text-gray-700 dark:text-gray-300 font-medium">
                    {artistDisplayName}
                  </p>
                )}
                {objectDate && (
                  <p className="mt-2 text-sm laptop:text-base text-gray-600 dark:text-gray-400">
                    {objectDate}
                  </p>
                )}
              </div>

              {/* Detalles en grid */}
              <div className="grid grid-cols-1 tablet:grid-cols-2 gap-6">
                {medium && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Medio
                    </h3>
                    <p className="text-base text-gray-800 dark:text-gray-200">
                      {medium}
                    </p>
                  </div>
                )}
                {dimensions && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Dimensiones
                    </h3>
                    <p className="text-base text-gray-800 dark:text-gray-200">
                      {dimensions}
                    </p>
                  </div>
                )}
                {culture && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Cultura
                    </h3>
                    <p className="text-base text-gray-800 dark:text-gray-200">
                      {culture}
                    </p>
                  </div>
                )}
                {classification && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                      Clasificación
                    </h3>
                    <p className="text-base text-gray-800 dark:text-gray-200">
                      {classification}
                    </p>
                  </div>
                )}
              </div>

              {/* Procedencia y departamento */}
              {(creditLine || department) && (
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6 space-y-4">
                  {creditLine && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Procedencia
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {creditLine}
                      </p>
                    </div>
                  )}
                  {department && (
                    <div>
                      <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                        Departamento
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300">
                        {department}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Enlaces de acción */}
              <div className="space-y-3 pt-4">
                {objectURL && (
                  <a
                    href={objectURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-4 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-medium rounded-lg hover:bg-gray-800 dark:hover:bg-gray-100 transition-colors duration-200 text-center"
                  >
                    Ver en MET →
                  </a>
                )}
                <Link href="/">
                  <a className="block w-full px-4 py-3 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors duration-200 text-center">
                    ← Volver
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-20 laptop:mt-32 border-t border-gray-200 dark:border-gray-700 pt-20">
          <Footer />
        </div>
      </div>
    </div>
  );
}
