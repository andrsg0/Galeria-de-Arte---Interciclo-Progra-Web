import Head from "next/head";
import WorkCard from "../../components/WorkCard";
import Router, { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { stagger } from "../../animations";
import Button from "../../components/Button";
import Cursor from "../../components/Cursor";
import Header from "../../components/Header";
import data from "../../data/portfolio.json";
import { ISOToDate, useIsomorphicLayoutEffect } from "../../utils";
import { getAllPosts } from "../../utils/api";
const Departments = ({ posts }) => {
  const showBlog = useRef(data.showBlog);
  const text = useRef();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  // Para el museo
  const [departments, setDepartments] = useState([]);
  const [selectedDept, setSelectedDept] = useState("");
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(
      "https://collectionapi.metmuseum.org/public/collection/v1/departments"
    )
      .then((res) => res.json())
      .then((data) => {
        setDepartments(data.departments);
        if (!selectedDept && data.departments && data.departments.length > 0) {
          setSelectedDept(String(data.departments[0].departmentId)); // primer depto recibido
        }
      });
  }, []);

  useIsomorphicLayoutEffect(() => {
    // Solo ejecutar si el elemento existe
    if (text.current) {
      stagger(
        [text.current],
        { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
        { y: 0, x: 0, transform: "scale(1)" }
      );
      if (showBlog.current) {
        stagger([text.current], { y: 30 }, { y: 0 });
      } else {
        router.push("/");
      }
    }
  }, []);

  useEffect(() => {
    if (!selectedDept) {
      setArtworks([]);
      return;
    }
    setLoading(true);
    fetch(
      `https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${selectedDept}&hasImages=true&isHighligth=true&q=a`
    )
      .then((res) => res.json())
      .then((data) => {
        console.log("Búsqueda por departamento ", selectedDept, data);
        const ids = (data.objectIDs || []).slice(0, 20); // Limita a 20 artworks
        if (ids.length === 0) {
          setArtworks([]);
          setLoading(false);
          return;
        }
        Promise.allSettled(
          ids.map((id) =>
            fetch(
              `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`
            ).then((res) => {
              if (!res.ok) throw new Error("Not Found");
              return res.json();
            })
          )
        ).then((results) => {
          // Solo los que están fulfilled y tienen imagen y título
          setArtworks(
            results
              .filter(
                (r) =>
                  r.status === "fulfilled" &&
                  r.value?.primaryImageSmall &&
                  r.value?.title
              )
              .map((r) => ({
                id: r.value.objectID,
                image: r.value.primaryImageSmall,
                title: r.value.title,
                desc: r.value.artistDisplayName || r.value.objectDate || "",
                url: r.value.objectURL,
                date: r.value.objectDate,
              }))
          );
          setLoading(false);
        });
      });
  }, [selectedDept]);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    showBlog.current && (
      <>
        {data.showCursor && <Cursor />}
        <Head>
          <title>Obras por Departamento</title>
        </Head>
        <div
          className={`container mx-auto mb-10 ${
            data.showCursor && "cursor-none"
          }`}
        >
          <Header isBlog={true}></Header>
          <div className="mt-10">
            <h1
              ref={text}
              className="mx-auto mob:p-2 text-bold text-6xl laptop:text-8xl w-full"
            >
              Obras por Departamento
            </h1>
            <div className="my-8">
              <label htmlFor="departments" style={{ fontWeight: "bold" }}>
                Filtrar por departamento:
              </label>
              <select
                id="departments"
                className="ml-3 p-2 border rounded-md"
                value={selectedDept}
                onChange={(e) => setSelectedDept(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-5 laptop:mt-10 masonry">
              {loading ? (
                // Render a grid of skeleton cards while loading
                Array.from({ length: 8 }).map((_, i) => (
                  <div
                    key={i}
                    className="masonry-item overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 bg-transparent"
                  >
                    <div className="relative rounded-lg overflow-hidden transition-all ease-out duration-300 group">
                      <div
                        className="bg-gray-300 dark:bg-gray-700 w-full object-cover animate-pulse"
                        style={{ paddingBottom: "75%" }}
                      />
                      <div className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-6 h-6 bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse" />
                      </div>
                    </div>
                    <h1 className="mt-5 text-xl font-medium">
                      <span className="block h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 animate-pulse" />
                    </h1>
                    <h2 className="text-sm opacity-50">
                      <span className="block mt-2 h-3 bg-gray-300 dark:bg-gray-700 rounded w-2/3 animate-pulse" />
                    </h2>
                  </div>
                ))
              ) : artworks.length === 0 && selectedDept ? (
                <p>No hay obras en este departamento.</p>
              ) : (
                artworks.map((obj) => (
                  <WorkCard
                    key={obj.id}
                    img={obj.image}
                    name={obj.title}
                    description={obj.desc}
                    onClick={() => router.push(`/art/${obj.id}`)}
                    url={obj.url}
                  />
                ))
              )}
            </div>
          </div>
        </div>
      </>
    )
  );
};

export async function getStaticProps() {
  const posts = getAllPosts([
    "slug",
    "title",
    "image",
    "preview",
    "author",
    "date",
  ]);

  return {
    props: {
      posts: [...posts],
    },
  };
}

export default Departments;
