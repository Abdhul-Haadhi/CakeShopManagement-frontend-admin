export interface ProductVariantDto {
    variantId?: number;
    variantName?: string;
    weight?: string;
    price?: number;
    available?: boolean;
}

export interface ProductReportDto {
    productId: number;
    productSku: string;
    productName: string;
    categoryId: number;
    categoryName: string;
    minPrice: number;
    maxPrice: number;
    priceDisplay: string;
    active: boolean;
    availabilityStatus: 'In Stock' | 'Out of Stock' | 'Inactive';
    variantCount: number;
    addedDate: Date | string;
    variants?: ProductVariantDto[]; // Added variants property
}