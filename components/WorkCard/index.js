import React, { useState, useEffect } from "react";

const WorkCard = ({ img, name, description, onClick }) => {
  const [saved, setSaved] = useState(false);

  // favorites are stored in localStorage under key 'favorites' as array of items
  useEffect(() => {
    // check if this item is already saved
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem("favorites");
      const favs = raw ? JSON.parse(raw) : [];
      const id = img || name || null;
      if (id && favs.find((f) => f.id === id)) {
        setSaved(true);
      }
    } catch (err) {
      // ignore parse errors
    }
  }, [img, name]);

  const handleSave = (e) => {
    // prevent parent click (which may open the project) from firing
    if (e && e.stopPropagation) e.stopPropagation();

    const id = img || name || null;
    if (!id) return;

    try {
      const raw = localStorage.getItem("favorites");
      const favs = raw ? JSON.parse(raw) : [];

      const exists = favs.find((f) => f.id === id);
      let next = [];
      if (exists) {
        // remove from favorites (toggle)
        next = favs.filter((f) => f.id !== id);
        setSaved(false);
      } else {
        // add to favorites
        const item = { id, img, name, description };
        next = [item, ...favs];
        setSaved(true);
      }

      localStorage.setItem("favorites", JSON.stringify(next));
    } catch (err) {
      // ignore storage errors for now
      console.error("Failed to update favorites", err);
    }
  };

  return (
    <div
      className="overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link"
      onClick={onClick}
    >
      <div
        className="relative rounded-lg overflow-hidden transition-all ease-out duration-300 h-48 mob:h-auto group"
        style={{ height: "600px" }}
      >
        <img
          alt={name}
          className="h-full w-full object-cover hover:scale-110 transition-all ease-out duration-300"
          src={img}
        />

        {/* Save (favorites) button overlay - uses public/images/star.svg */}
        <button
          type="button"
          onClick={handleSave}
          aria-pressed={saved}
          aria-label={saved ? `Quitar ${name} de favoritos` : `Guardar ${name} en favoritos`}
          className={`absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/80 rounded-full p-2 shadow-md hover:scale-105 ${
            saved ? "ring-2 ring-yellow-400" : ""
          }`}
        >
          <img src="/images/star.svg" alt="star" className="w-5 h-5" />
        </button>
      </div>
      <h1 className="mt-5 text-3xl font-medium">
        {name ? name : "Project Name"}
      </h1>
      <h2 className="text-xl opacity-50">
        {description ? description : "Description"}
      </h2>
    </div>
  );
};

export default WorkCard;
