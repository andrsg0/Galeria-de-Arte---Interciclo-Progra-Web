import React, { useEffect, useState } from "react";
import { get, set } from "idb-keyval";
import Head from "next/head";
import Header from "../components/Header";
import Footer from "../components/Footer";
import WorkCard from "../components/WorkCard";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Favorites() {
  const [favs, setFavs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;
        let mounted = true;
        async function loadFavs() {
          try {
            // intenta leer desde IndexedDB primero
            const idb = await get("favorites");
            let arr = Array.isArray(idb) ? idb : null;
            // fallback a localStorage si no hay nada en idb
            if (!arr) {
              const raw = localStorage.getItem("favorites");
              arr = raw ? JSON.parse(raw) : [];
            }
            if (mounted) setFavs(arr);
          } catch (err) {
            if (mounted) setFavs([]);
          } finally {
            if (mounted) setLoading(false);
          }
        }
    
        loadFavs();
        const handleOnline = () => loadFavs();
        window.addEventListener("online", handleOnline);
        return () => {
          mounted = false;
          window.removeEventListener("online", handleOnline);
        };
      }, []);

  const removeFavorite = async (id) => {
    try {
      const next = favs.filter((f) => f.id !== id);
      setFavs(next);
      // sincroniza en localStorage e IndexedDB
      localStorage.setItem("favorites", JSON.stringify(next));
      await set("favorites", next);
    } catch (err) {
      console.error("Failed to remove favorite", err);
    }
  };

  return (
    <div className="relative">
      <Head>
        <title>Favoritos — Galería de Arte</title>
      </Head>

      <div className="container mx-auto mb-10 p-4">
        <Header />

        <div className="mt-8">
          <h1 className="text-3xl font-bold">Tus favoritos</h1>
          {!navigator.onLine && (
            <p className="text-sm text-gray-600 mt-2">Estás sin conexión — mostrando favoritas guardadas</p>
          )}
          <p className="text-gray-600 mt-2">Aquí encontrarás las obras que guardaste.</p>

          <div className="mt-6">
            {loading ? (
              <p>Cargando favoritos...</p>
            ) : favs.length === 0 ? (
              <div className="mt-6">
                <p className="text-gray-700">No tienes favoritos aún.</p>
                <Link href="/">
                  <a className="text-blue-600 underline">Volver a la galería</a>
                </Link>
              </div>
            ) : (
              <div className="masonry mt-4">
                {favs.map((item) => (
                  <div key={item.id} className="masonry-item">
                    <WorkCard
                      img={item.img}
                      name={item.name}
                      description={item.description}
                      onClick={() => router.push(`/art/${item.id}`)}
                    />
                    <div className="mt-2 flex items-center justify-between">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(item.id);
                        }}
                        className="text-sm text-red-600 hover:underline"
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mt-12">
          <Footer />
        </div>
      </div>
    </div>
  );
}
