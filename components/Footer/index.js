import React from "react";

// Minimal, elegant footer matching the site's style.
// Change the values below to the real names, university and year.
const PERSON_ONE = "Fabio Camacho";
const PERSON_TWO = "Andrés Gómez";
const UNIVERSITY = "Universidad de Cuenca";
const YEAR = new Date().getFullYear();

const Footer = () => {
  return (
    <footer className="mt-12 border-t border-gray-200 dark:border-gray-700 py-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center gap-2">
          <p className="text-sm font-large text-gray-800 dark:text-gray-100">
            {PERSON_ONE} · {PERSON_TWO}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {UNIVERSITY} • {YEAR}
          </p>
          <small className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Galería de Arte
          </small>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
