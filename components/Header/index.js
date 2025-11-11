import { Popover } from "@headlessui/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import Button from "../Button";
// Local Data
import data from "../../data/portfolio.json";

const Header = ({ handleWorkScroll, isBlog }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  const { name, showBlog, showResume } = data;

  useEffect(() => {
    setMounted(true);
  }, []);

    // Ensure theme is defined (default to 'light' during hydration)
    const currentTheme = mounted ? theme : 'light';
  return (
    <>
      <Popover className="block tablet:hidden mt-5">
        {({ open }) => (
          <>
            <div className="flex items-center justify-between p-2 laptop:p-0">
              <h1
                onClick={() => router.push("/")}
                className="font-medium p-2 laptop:p-0 link"
              >
                {name}.
              </h1>

              <div className="flex items-center">
                {data.darkMode && (
                  <Button
                    onClick={() =>
                        setTheme(currentTheme === "dark" ? "light" : "dark")
                    }
                  >
                    <img
                      className="h-6"
                      src={`/images/${
                          currentTheme === "dark" ? "moon.svg" : "sun.svg"
                      }`}
                        alt="Toggle theme"
                    ></img>
                  </Button>
                )}

                <Popover.Button>
                  <img
                    className="h-5"
                    src={`/images/${
                      !open
                        ? theme === "dark"
                          ? "menu-white.svg"
                          : "menu.svg"
                        : theme === "light"
                        ? "cancel.svg"
                        : "cancel-white.svg"
                    }`}
                  ></img>
                </Popover.Button>
              </div>
            </div>
            <Popover.Panel
              className={`absolute right-0 z-10 w-11/12 p-0 mt-2 ${
                theme === "dark" ? "bg-gray-900" : "bg-white"
              } shadow-lg rounded-lg border ${
                theme === "dark" ? "border-gray-700" : "border-gray-200"
              }`}
            >
              {!isBlog ? (
                <div className="grid grid-cols-1">
                  <button
                    onClick={handleWorkScroll}
                    className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors first:rounded-t-lg text-sm"
                  >
                    Destacados
                  </button>
                  {showBlog && (
                    <button
                      onClick={() => router.push("/blog")}
                      className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm border-t border-gray-200 dark:border-gray-700"
                    >
                      Departamentos
                    </button>
                  )}
                  {showResume && (
                    <button
                      onClick={() => router.push("/favorites")}
                      className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors last:rounded-b-lg text-sm border-t border-gray-200 dark:border-gray-700"
                    >
                      Favoritos
                    </button>
                  )}

                  {/* Contact button removed */}
                </div>
              ) : (
                <div className="grid grid-cols-1">
                  <button
                    onClick={() => router.push("/")}
                    className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors first:rounded-t-lg text-sm"
                  >
                    Inicio
                  </button>
                  {showBlog && (
                    <button
                      onClick={() => router.push("/blog")}
                      className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-sm border-t border-gray-200 dark:border-gray-700"
                    >
                      Departamentos
                    </button>
                  )}
                  {showResume && (
                    <button
                      onClick={() => router.push("/favorites")}
                      className="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors last:rounded-b-lg text-sm border-t border-gray-200 dark:border-gray-700"
                    >
                      Favoritos
                    </button>
                  )}

                  {/* Contact button removed */}
                </div>
              )}
            </Popover.Panel>
          </>
        )}
      </Popover>
      <div
        className={`mt-10 hidden flex-row items-center justify-between sticky ${
          mounted && theme === "light" ? "bg-white" : ""
        } dark:text-white top-0 z-10 tablet:flex`}
      >
        <h1
          onClick={() => router.push("/")}
          className="font-medium cursor-pointer mob:p-2 laptop:p-0"
        >
          {name}.
        </h1>
        {!isBlog ? (
          <div className="flex">
            <Button onClick={handleWorkScroll}>Destacados</Button>
            {showBlog && (
              <Button onClick={() => router.push("/blog")}>Departamentos</Button>
            )}
            {showResume && (
              <Button
                onClick={() => router.push("/favorites")}
                classes="first:ml-1"
              >
                Favoritos
              </Button>
            )}

            {/* Contact button removed */}
            {data.darkMode && (
              <Button
                  onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
              >
                <img
                  className="h-6"
                  alt="Toggle theme"
                    src={`/images/${currentTheme === "dark" ? "moon.svg" : "sun.svg"}`}
                ></img>
              </Button>
            )}
          </div>
        ) : (
          <div className="flex">
            <Button onClick={() => router.push("/")}>Inicio</Button>
            {showBlog && (
              <Button onClick={() => router.push("/blog")}>Departamentos</Button>
            )}
            {showResume && (
              <Button
                onClick={() => router.push("/favorites")}
                classes="first:ml-1"
              >
                Favoritos
              </Button>
            )}

            {/* Contact button removed */}

            {data.darkMode && (
              <Button
                  onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
              >
                <img
                  className="h-6"
                  alt="Toggle theme"
                    src={`/images/${currentTheme === "dark" ? "moon.svg" : "sun.svg"}`}
                ></img>
              </Button>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default Header;
