/**
 * Utility function to test whether a product matches a given search query string.
 * Matches against:
 * - Product title / name
 * - Product description
 * - Product brand
 * - Category name
 * - Top-level sku, partNumber, modelNumber
 * - Variant sku, partNumber, modelNumber, title, displayTitle, size, color, storage, ram, glass
 */
export const matchesProductSearch = (prod, query) => {
  if (!prod) return false;
  if (!query || typeof query !== 'string' || !query.trim()) return true;

  const q = query.trim().toLowerCase();

  const title = (prod.title || prod.name || '').toLowerCase();
  const description = (prod.description || '').toLowerCase();
  const brand = (prod.brand || '').toLowerCase();
  const categoryName = (prod.category?.name || prod.category || '').toLowerCase();
  const sku = (prod.sku || '').toLowerCase();
  const partNumber = (prod.partNumber || '').toLowerCase();
  const modelNumber = (prod.modelNumber || '').toLowerCase();

  if (
    title.includes(q) ||
    description.includes(q) ||
    brand.includes(q) ||
    categoryName.includes(q) ||
    sku.includes(q) ||
    partNumber.includes(q) ||
    modelNumber.includes(q)
  ) {
    return true;
  }

  // Check variants array if present
  if (Array.isArray(prod.variants) && prod.variants.length > 0) {
    return prod.variants.some((v) => {
      if (!v) return false;
      const vSku = (v.sku || '').toLowerCase();
      const vPartNumber = (v.partNumber || '').toLowerCase();
      const vModelNumber = (v.modelNumber || '').toLowerCase();
      const vTitle = (v.title || v.displayTitle || '').toLowerCase();
      const vSize = (v.size || '').toLowerCase();
      const vColor = (v.color || '').toLowerCase();
      const vStorage = (v.storage || '').toLowerCase();

      return (
        vSku.includes(q) ||
        vPartNumber.includes(q) ||
        vModelNumber.includes(q) ||
        vTitle.includes(q) ||
        vSize.includes(q) ||
        vColor.includes(q) ||
        vStorage.includes(q)
      );
    });
  }

  return false;
};

/**
 * Returns the matching SKU / Part Number / Model Number string for display badge if present
 */
export const getMatchingSku = (prod, query) => {
  if (!prod) return null;
  const q = (query || '').trim().toLowerCase();

  const sku = prod.sku || '';
  if (q && sku.toLowerCase().includes(q)) return sku;

  const partNumber = prod.partNumber || '';
  if (q && partNumber.toLowerCase().includes(q)) return partNumber;

  const modelNumber = prod.modelNumber || '';
  if (q && modelNumber.toLowerCase().includes(q)) return modelNumber;

  if (Array.isArray(prod.variants)) {
    for (const v of prod.variants) {
      if (!v) continue;
      if (q && v.sku && v.sku.toLowerCase().includes(q)) return v.sku;
      if (q && v.partNumber && v.partNumber.toLowerCase().includes(q)) return v.partNumber;
      if (q && v.modelNumber && v.modelNumber.toLowerCase().includes(q)) return v.modelNumber;
    }
  }

  return prod.sku || prod.partNumber || prod.modelNumber || prod.variants?.[0]?.partNumber || prod.variants?.[0]?.sku || null;
};
