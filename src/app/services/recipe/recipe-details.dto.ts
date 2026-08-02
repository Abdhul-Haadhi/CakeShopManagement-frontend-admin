export interface RecipeDto {
    recipeId: number;
    productId: number;
    productName: string;

    inventoryId: number;
    inventoryName: string;

    quantityRequired: number;

    variantId: number;
    variantType: string;
    variantValue: number;
}

export interface RecipeDetailsDto {

    productId: number;
    productName: string;

    variantId: number;
    variantType: string;

    weight: number;
    pieces: number;

    ingredients: RecipeDto[];
}