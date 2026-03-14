export type Category = "Men" | "Women" | "Boys" | "Girls" | "Baby";
export type ProductType = "Shirt" | "Pants";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  type: ProductType;
  image: string;
  featured: boolean;
  sizes: string[];
}

export const products: Product[] = [
  {
    id: "1",
    name: "Classic White Oxford",
    category: "Men",
    type: "Shirt",
    price: 34.99,
    image: "/assets/generated/product-men-shirt.dim_400x400.jpg",
    description:
      "A timeless white Oxford shirt crafted from breathable cotton. Perfect for any occasion.",
    featured: true,
    sizes: ["S", "M", "L", "XL", "XXL"],
  },
  {
    id: "2",
    name: "Slim Fit Denim",
    category: "Men",
    type: "Pants",
    price: 54.99,
    image: "/assets/generated/product-men-pants.dim_400x400.jpg",
    description:
      "Slim-fit jeans with a modern cut, durable denim fabric and comfortable stretch.",
    featured: true,
    sizes: ["30", "32", "34", "36"],
  },
  {
    id: "3",
    name: "Floral Blouse",
    category: "Women",
    type: "Shirt",
    price: 29.99,
    image: "/assets/generated/product-women-shirt.dim_400x400.jpg",
    description:
      "Lightweight floral blouse with soft fabric, ideal for spring and summer outings.",
    featured: true,
    sizes: ["XS", "S", "M", "L"],
  },
  {
    id: "4",
    name: "Tailored Trousers",
    category: "Women",
    type: "Pants",
    price: 49.99,
    image: "/assets/generated/product-women-pants.dim_400x400.jpg",
    description:
      "Elegant high-waist trousers with a straight-leg cut, perfect for office or formal wear.",
    featured: false,
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    id: "5",
    name: "Boys Polo Shirt",
    category: "Boys",
    type: "Shirt",
    price: 19.99,
    image: "/assets/generated/product-boys-shirt.dim_400x400.jpg",
    description:
      "Colorful and comfortable polo shirt for boys. Easy to wash and durable for everyday play.",
    featured: true,
    sizes: ["4T", "5T", "6", "7", "8"],
  },
  {
    id: "6",
    name: "Boys Cargo Pants",
    category: "Boys",
    type: "Pants",
    price: 24.99,
    image: "/assets/generated/product-boys-pants.dim_400x400.jpg",
    description:
      "Rugged cargo pants with multiple pockets, perfect for active boys who love adventure.",
    featured: false,
    sizes: ["4T", "5T", "6", "7", "8"],
  },
  {
    id: "7",
    name: "Girls Ruffle Blouse",
    category: "Girls",
    type: "Shirt",
    price: 22.99,
    image: "/assets/generated/product-girls-shirt.dim_400x400.jpg",
    description:
      "Adorable ruffle-trim blouse in soft pink, great for school or special occasions.",
    featured: true,
    sizes: ["4T", "5T", "6", "7", "8"],
  },
  {
    id: "8",
    name: "Girls Leggings",
    category: "Girls",
    type: "Pants",
    price: 17.99,
    image: "/assets/generated/product-girls-pants.dim_400x400.jpg",
    description:
      "Stretchy and soft leggings in fun prints. Perfect fit for girls on the go.",
    featured: false,
    sizes: ["4T", "5T", "6", "7", "8"],
  },
  {
    id: "9",
    name: "Baby Onesie Set",
    category: "Baby",
    type: "Shirt",
    price: 14.99,
    image: "/assets/generated/product-baby-shirt.dim_400x400.jpg",
    description:
      "Super-soft cotton onesie in gentle pastel colors. Safe for sensitive baby skin.",
    featured: true,
    sizes: ["0-3m", "3-6m", "6-12m"],
  },
  {
    id: "10",
    name: "Baby Soft Pants",
    category: "Baby",
    type: "Pants",
    price: 12.99,
    image: "/assets/generated/product-baby-pants.dim_400x400.jpg",
    description:
      "Cozy elastic-waist pants in soft fabric, easy to pull on and off.",
    featured: true,
    sizes: ["0-3m", "3-6m", "6-12m"],
  },
  {
    id: "11",
    name: "Men Linen Shirt",
    category: "Men",
    type: "Shirt",
    price: 39.99,
    image: "/assets/generated/product-men-shirt.dim_400x400.jpg",
    description:
      "Breathable linen shirt for hot weather. Relaxed fit with button-down collar.",
    featured: false,
    sizes: ["S", "M", "L", "XL"],
  },
  {
    id: "12",
    name: "Women Casual Pants",
    category: "Women",
    type: "Pants",
    price: 44.99,
    image: "/assets/generated/product-women-pants.dim_400x400.jpg",
    description:
      "Comfortable wide-leg casual pants with elastic waistband, available in multiple colors.",
    featured: false,
    sizes: ["XS", "S", "M", "L", "XL"],
  },
];

export const categories: Category[] = ["Men", "Women", "Boys", "Girls", "Baby"];
export const productTypes: ProductType[] = ["Shirt", "Pants"];
