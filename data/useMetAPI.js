import { useState, useEffect } from "react";

export function useMetAPI(query = "paint", limit = 10) {
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&q=${query}`)
      .then(res => res.json())
      .then(data => {
        const artworkIds = data.objectIDs.slice(0, limit);
        Promise.all(
          artworkIds.map(id =>
            fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`)
              .then(res => res.json())
          )
        ).then(results => {
          const cards = results
            .filter(item => item.primaryImageSmall && item.title)
            .map(item => ({
              id: item.objectID,
              imageSrc: item.primaryImageSmall,
              title: item.title,
              description: item.artistDisplayName || item.objectDate || "",
              url: item.objectURL,
            }));
          setArtworks(cards);
          setLoading(false);
        });
      });
  }, [query, limit]);

  return { artworks, loading };
}
