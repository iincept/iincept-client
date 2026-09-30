/**
 * Utility for parsing and calculating product card pricing, MRP, selling price, and discount percentage.
 * Handles percentage discounts (e.g. 10 -> 10% OFF), rupee off amounts (e.g. ₹10,000 OFF),
 * discounted selling prices (e.g. ₹1,82,324 when MRP is ₹2,39,900), and parent vs variant fallbacks.
 */
export const getProductCardPricing = (prod) => {
  if (!prod) {
    return { sellingPrice: 0, originalMrp: 0, discountPercent: 0, hasDiscount: false };
  }

  let baseMrp = Number(prod.price || 0);

  let variantPrices = [];
  let variantDiscPrices = [];
  let variantDiscPercents = [];

  if (prod.variants && Array.isArray(prod.variants) && prod.variants.length > 0) {
    prod.variants.forEach((v) => {
      const vp = Number(v.price || 0);
      if (vp > 0) variantPrices.push(vp);

      const vdp = Number(v.discountPrice || 0);
      if (vdp > 0) variantDiscPrices.push(vdp);

      const vdper = Number(v.discountPercent || 0);
      if (vdper > 0) variantDiscPercents.push(vdper);
    });

    if (variantPrices.length > 0 && baseMrp === 0) {
      baseMrp = Math.min(...variantPrices);
    }
  }

  // Check for explicit percentage discount first
  let explicitPercent = Number(
    prod.discountPercent !== undefined && prod.discountPercent !== null && Number(prod.discountPercent) > 0
      ? prod.discountPercent
      : (prod.discount !== undefined && prod.discount !== null && Number(prod.discount) > 0 && Number(prod.discount) <= 99
          ? prod.discount
          : (variantDiscPercents.length > 0 ? Math.max(...variantDiscPercents) : 0))
  );

  let rawDisc = Number(prod.discountPrice !== undefined && prod.discountPrice !== null ? prod.discountPrice : 0);
  if (rawDisc === 0 && variantDiscPrices.length > 0) {
    rawDisc = Math.min(...variantDiscPrices);
  }

  let sellingPrice = baseMrp;
  let originalMrp = 0;
  let discountPercent = 0;

  if (explicitPercent > 0 && explicitPercent <= 99) {
    // Admin specified explicit percentage discount (e.g. 10 -> 10% OFF)
    discountPercent = Math.round(explicitPercent);
    originalMrp = baseMrp;
    if (rawDisc > 99 && rawDisc < baseMrp) {
      sellingPrice = rawDisc;
    } else {
      sellingPrice = Math.round(baseMrp - (baseMrp * explicitPercent / 100));
    }
  } else if (rawDisc > 0 && baseMrp > 0) {
    if (rawDisc <= 99) {
      // Percentage Discount (e.g. 10 -> 10% OFF)
      discountPercent = Math.round(rawDisc);
      originalMrp = baseMrp;
      sellingPrice = Math.round(baseMrp - (baseMrp * rawDisc / 100));
    } else if (rawDisc < baseMrp) {
      if (rawDisc < (baseMrp / 2)) {
        // Flat Rupee Discount Amount (e.g. ₹10,000 OFF)
        originalMrp = baseMrp;
        sellingPrice = baseMrp - rawDisc;
        discountPercent = Math.round((rawDisc / baseMrp) * 100);
      } else {
        // Discounted Selling Price (e.g. selling for ₹1,82,324 when MRP is ₹2,39,900)
        originalMrp = baseMrp;
        sellingPrice = rawDisc;
        discountPercent = Math.round(((baseMrp - rawDisc) / baseMrp) * 100);
      }
    } else if (rawDisc > baseMrp) {
      // rawDisc is MRP and baseMrp is Selling Price
      originalMrp = rawDisc;
      sellingPrice = baseMrp;
      discountPercent = Math.round(((rawDisc - baseMrp) / rawDisc) * 100);
    }
  }

  const hasDiscount = originalMrp > sellingPrice && sellingPrice > 0 && discountPercent > 0;

  return {
    sellingPrice,
    originalMrp: hasDiscount ? originalMrp : 0,
    discountPercent: hasDiscount ? discountPercent : 0,
    hasDiscount
  };
};
