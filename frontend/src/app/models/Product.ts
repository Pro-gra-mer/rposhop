export interface Product {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  categoryId: number;
  description?: string; // propiedad opcional para la descripción
}
