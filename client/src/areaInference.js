const normalizeText = value => (value || '')
  .toLowerCase()
  .replace(/[^a-z0-9\s]/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

export function findBestAreaMatch(rawText, areaCatalog = []) {
  const text = normalizeText(rawText);
  if (!text) return null;

  const areaScores = areaCatalog.map(area => {
    const fullName = normalizeText(area.name);
    const cityName = normalizeText(area.city);

    let score = 0;
    if (fullName && text.includes(fullName)) score += 80;
    if (cityName && text.includes(cityName)) score += 10;

    const tokens = fullName.split(' ');
    for (const token of tokens) {
      if (token.length < 3) continue;
      if (text.includes(token)) score += 18;
    }

    const aliasPatterns = [
      `${fullName.replace(/\s+/g, '')}`,
      ...tokens.filter(token => token.length > 3).map(token => token),
      ...tokens.slice(0, 2).join(' '),
      ...tokens.slice(0, 1)
    ];

    for (const alias of aliasPatterns) {
      if (alias && text.includes(alias)) score += 8;
    }

    if (/sector\s*18/.test(text) && /sector\s*18/.test(fullName.toLowerCase())) score += 35;
    if (/knowledge\s*park\s*ii/.test(text) && /knowledge\s*park\s*ii/.test(fullName.toLowerCase())) score += 35;
    if (/gaur\s*city/.test(text) && /gaur\s*city/.test(fullName.toLowerCase())) score += 35;
    if (/dwarka/.test(text) && /dwarka/.test(fullName.toLowerCase())) score += 35;
    if (/saket/.test(text) && /saket/.test(fullName.toLowerCase())) score += 35;

    const distanceBoost = (fullName.match(/\b(road|street|sector|park|city|gate|market|chowk|garden|market)\b/g) || []).length;
    score += distanceBoost * 2;

    return { ...area, score };
  });

  const best = areaScores
    .filter(area => area.score > 0)
    .sort((a, b) => b.score - a.score)[0];

  return best || null;
}

export function inferAreaFromImageText(imageText, areaCatalog = []) {
  if (!imageText) return null;
  const match = findBestAreaMatch(imageText, areaCatalog);
  return match ? { areaName: match.name, city: match.city, latitude: match.latitude, longitude: match.longitude } : null;
}
