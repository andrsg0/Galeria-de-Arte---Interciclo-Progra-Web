import { useRef } from "react";
import Header from "../components/Header";
import ServiceCard from "../components/ServiceCard";
import Socials from "../components/Socials";
import WorkCard from "../components/WorkCard";
import { useIsomorphicLayoutEffect } from "../utils";
import { stagger } from "../animations";
import Footer from "../components/Footer";
import Head from "next/head";
import Button from "../components/Button";
import Link from "next/link";
import Cursor from "../components/Cursor";
import { useRouter } from "next/router";

// Dynamic Data
import { useMetAPI } from "../data/useMetAPI";
import data from "../data/portfolio.json";

export default function Home() {
  const router = useRouter();
  // Ref
  const workRef = useRef();
  const aboutRef = useRef();
  const textOne = useRef();
  const textTwo = useRef();
  const textThree = useRef();
  const textFour = useRef();

  const { artworks, loading } = useMetAPI();


  // Handling Scroll
  const handleWorkScroll = () => {
    window.scrollTo({
      top: workRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  

  const handleAboutScroll = () => {
    window.scrollTo({
      top: aboutRef.current.offsetTop,
      left: 0,
      behavior: "smooth",
    });
  };

  useIsomorphicLayoutEffect(() => {
    stagger(
      [textOne.current, textTwo.current, textThree.current, textFour.current],
      { y: 40, x: -10, transform: "scale(0.95) skew(10deg)" },
      { y: 0, x: 0, transform: "scale(1)" }
    );
  }, []);

  return (
    <div className={`relative ${data.showCursor && "cursor-none"}`}>
      {data.showCursor && <Cursor />}
      <Head>
        <title>Galeria de Arte</title>
      </Head>

      <div className="gradient-circle"></div>
      <div className="gradient-circle-bottom"></div>

      <div className="container mx-auto mb-10">
        <Header
          handleWorkScroll={handleWorkScroll}
          handleAboutScroll={handleAboutScroll}
        />
        <div className="laptop:mt-20 mt-10">
          <div className="mt-5">
            <h1
              ref={textOne}
              className="text-3xl tablet:text-6xl laptop:text-6xl laptopl:text-8xl p-1 tablet:p-2 text-bold w-4/5 mob:w-full laptop:w-4/5"
            >
              Galería de Arte
            </h1>
            <h6
              ref={textTwo}
              className="text-lg tablet:text-2xl laptop:text-3xl p-1 tablet:p-2 font-medium w-full laptop:w-4/5 text-gray-700 dark:text-gray-300"
            >
              Obras contemporáneas y clásicas
            </h6>
          </div>

          <Socials className="mt-2 laptop:mt-5" />
        </div>
        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0" ref={workRef}>
          <h1 className="text-2xl text-bold">Obras.</h1>
          <div className="mt-5 laptop:mt-10 masonry">
            {loading ? (
              // Render a grid of skeleton cards while loading
              Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="masonry-item overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 bg-transparent"
                >
                  <div className="relative rounded-lg overflow-hidden transition-all ease-out duration-300 group">
                    <div className="bg-gray-300 dark:bg-gray-700 w-full object-cover animate-pulse" style={{paddingBottom: '75%'}} />
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
            ) : (
              artworks.map((project) => (
                <WorkCard
                  key={project.id}
                  img={project.imageSrc}
                  name={project.title}
                  description={project.description}
                  onClick={() => router.push(`/art/${project.id}`)}
                />
              ))
            )}
          </div>
        </div>

        <div className="mt-10 laptop:mt-30 p-2 laptop:p-0">
          <h1 className="tablet:m-10 text-2xl text-bold">Servicios de la galería.</h1>
          <div className="mt-5 tablet:m-10 grid grid-cols-1 laptop:grid-cols-2 gap-6">
            {data.services.map((service, index) => (
              <ServiceCard
                key={index}
                name={service.title}
                description={service.description}
              />
            ))}
          </div>
        </div>
        <div className="mt-10 laptop:mt-40 p-2 laptop:p-0" ref={aboutRef}>
          <h1 className="tablet:m-10 text-2xl text-bold">Sobre la galería.</h1>
          <p className="tablet:m-10 mt-2 text-xl laptop:text-3xl w-full laptop:w-3/5">
            Galería de Arte es un espacio dedicado a exhibir obras seleccionadas de
            artistas emergentes y consagrados. Nuestro objetivo es conectar al
            público con la riqueza creativa local e internacional a través de
            exposiciones temporales y colecciones permanentes. Navega por las
            obras, descubre artistas y guarda tus piezas favoritas para volver a
            ellas más tarde.
          </p>
        </div>
        <Footer />
      </div>
    </div>
  );
}
