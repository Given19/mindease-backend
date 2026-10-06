async function geocodeAddress(address) {
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'MindEase-App (contact: mindease.app@example.com)'
    }
  });

  if (!response.ok) {
    throw new Error('Geocoding service error.');
  }

  const results = await response.json();

  if (!results || results.length === 0) {
    return null;
  }

  return {
    latitude: parseFloat(results[0].lat),
    longitude: parseFloat(results[0].lon)
  };
}

module.exports = { geocodeAddress };