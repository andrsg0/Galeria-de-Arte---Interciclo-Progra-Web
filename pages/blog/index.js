import Head from "next/head";
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
  fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments")
    .then(res => res.json())
    .then(data => {
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
  fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?departmentId=${selectedDept}&hasImages=true&isHighligth=true&q=a`)
    .then(res => res.json())
    .then(data => {
      console.log('Búsqueda por departamento ', selectedDept, data);
      const ids = (data.objectIDs || []).slice(0, 12); // Limita a 12 artworks
      if (ids.length === 0) {
        setArtworks([]);
        setLoading(false);
        return;
      }
    Promise.allSettled(
      ids.map(id =>
        fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
          .then(res => {
            if (!res.ok) throw new Error("Not Found");
            return res.json();
          })
      )
    ).then(results => {
      // Solo los que están fulfilled y tienen imagen y título
      setArtworks(
        results
          .filter(r => r.status === "fulfilled" && r.value?.primaryImageSmall && r.value?.title)
          .map(r => ({
            id: r.value.objectID,
            image: r.value.primaryImageSmall,
            title: r.value.title,
            desc: r.value.artistDisplayName || r.value.objectDate || "",
            url: r.value.objectURL,
            date: r.value.objectDate
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
              <label htmlFor="departments" style={{fontWeight: "bold"}}>Filtrar por departamento:</label>
              <select
                id="departments"
                className="ml-3 p-2 border rounded-md"
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
              >
                {departments.map(dept => (
                  <option key={dept.departmentId} value={dept.departmentId}>
                    {dept.displayName}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-10 grid grid-cols-1 mob:grid-cols-1 tablet:grid-cols-2 laptop:grid-cols-3 justify-between gap-10">
              {loading ? (
                <p>Cargando obras...</p>
              ) : (
                artworks.length === 0 && selectedDept
                  ? <p>No hay obras en este departamento.</p>
                  : artworks.map(obj => (
                        <div
                          key={obj.id}
                          className="cursor-pointer relative"
                          onClick={() => window.open(obj.url, "_blank")}
                        >
                          <img className="w-full h-60 rounded-lg shadow-lg object-cover" src={obj.image} alt={obj.title} />
                          <h2 className="mt-5 text-4xl">{obj.title}</h2>
                          <p className="mt-2 opacity-50 text-lg">{obj.desc}</p>
                          <span className="text-sm mt-5 opacity-25">{obj.date}</span>
                        </div>
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
