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
      className="masonry-item overflow-hidden rounded-lg p-2 laptop:p-4 first:ml-0 link"
      onClick={onClick}
    >
      <div className="relative rounded-lg overflow-hidden transition-all ease-out duration-300 group">
        <img
          alt={name}
          className="w-full h-auto object-cover hover:scale-105 transition-all ease-out duration-300"
          src={img}
        />

        {/* Save (favorites) button overlay - uses public/images/star.svg */}
        <button
          type="button"
          onClick={handleSave}
          aria-pressed={saved}
          aria-label={saved ? `Quitar ${name} de favoritos` : `Guardar ${name} en favoritos`}
          className={`absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 dark:bg-gray-800/80 rounded-full w-8 h-8 flex items-center justify-center shadow-sm ${
            saved ? "ring-2 ring-yellow-400" : ""
          } ${saved ? 'text-yellow-400' : 'text-gray-700'}`}
        >
          {/* Inline SVG so sizing and color are consistent */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="w-4 h-4 fill-current"
            aria-hidden="true"
          >
            <path d="M12 .587l3.668 7.431L23.4 9.75l-5.7 5.557L19.335 24 12 20.202 4.665 24l1.635-8.693L.6 9.75l7.732-1.732L12 .587z" />
          </svg>
        </button>
      </div>
      <h1 className="mt-5 text-xl font-medium">
        {name ? name : "Project Name"}
      </h1>
      <h2 className="text-sm opacity-50">
        {description ? description : "Description"}
      </h2>
    </div>
  );
};

export default WorkCard;
