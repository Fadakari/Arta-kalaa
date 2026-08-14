export function getProductPrice(product: {
  unit_price?: number;
  price?: number;
}): number {
  return Number(product?.unit_price ?? product?.price ?? 0);
}

export function getProductFinalPrice(product: {
  final_price?: number | null;
  discount_price?: number | null;
}): number | null {
  const finalPrice = product?.final_price ?? product?.discount_price;
  if (finalPrice === null || finalPrice === undefined) {
    return null;
  }
  return Number(finalPrice);
}

export function hasProductDiscount(product: {
  is_discounted?: boolean;
  isDiscounted?: boolean;
  discount_percentage?: number;
  unit_price?: number;
  price?: number;
  final_price?: number | null;
  discount_price?: number | null;
}): boolean {
  if (product?.is_discounted || product?.isDiscounted) return true;
  if (Number(product?.discount_percentage) > 0) return true;

  const price = getProductPrice(product);
  const finalPrice = getProductFinalPrice(product);
  if (finalPrice === null) return false;
  return finalPrice < price;
}

export function markDiscountedProduct(product: Record<string, unknown>) {
  const price = getProductPrice(product);
  const finalPrice = getProductFinalPrice(product);

  return {
    ...product,
    isDiscounted: true,
    final_price: finalPrice ?? product.final_price,
    discount_percentage:
      product.discount_percentage ??
      (price > 0 && finalPrice !== null
        ? Math.round(((price - finalPrice) / price) * 100)
        : undefined),
  };
}