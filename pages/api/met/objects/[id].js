// Server-side proxy for MET Collection API objects endpoint
// This avoids CORS issues by fetching from the server and returning the JSON to the client
export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).json({ error: 'Missing object ID' });
  }

  const url = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;

  try {
    const apiRes = await fetch(url);

    // Forward status and body
    const data = await apiRes.json();

    // Cache on CDN/edge for 24 hours, allow stale while revalidate for 1 hour
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=3600');

    return res.status(apiRes.status).json(data);
  } catch (err) {
    console.error(`Error proxying MET object ${id}:`, err);
    return res.status(502).json({ error: 'Bad gateway', message: err.message });
  }
}
