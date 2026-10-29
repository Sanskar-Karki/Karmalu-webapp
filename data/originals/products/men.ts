import type { Product } from "@/types";

export const menProducts: Product[] = [
  {
    id: "aw-1",
    slug: "essential-tee",
    name: "Essential Tee",
    brand: "originals",
    categorySlug: "tshirt",
    category: "T-shirt",
    price: 34,
    sizes: ["XS", "S", "M", "L", "XL"],
    sizeChart: [
      { size: "XS", chest: 86, waist: 71, hip: 86 },
      { size: "S", chest: 91, waist: 76, hip: 91 },
      { size: "M", chest: 97, waist: 81, hip: 97 },
      { size: "L", chest: 104, waist: 89, hip: 104 },
      { size: "XL", chest: 112, waist: 97, hip: 112 },
    ],
    colors: [
      { hex: "#1B1716", label: "Noir" },
      { hex: "#810100", label: "Cherry" },
      { hex: "#EDEBDE", label: "Cotton" },
    ],
    image: "/images/activewear/men/essential-training-tee/main.jpg",
    hoverImage: "/images/activewear/men/essential-training-tee/hover.webp",
    gallery: [
      "/images/activewear/men/essential-training-tee/main.jpg",
      "/images/activewear/men/essential-training-tee/hover.webp",
    ],
    description:
      "A soft, four-way stretch tee with a clean everyday fit and smooth, comfortable seams.",
    details: [
      "4-way stretch fabric",
      "Lightweight stretch jersey",
      "Everyday fit",
      "Smooth seams",
    ],
    badge: "Bestseller",
    rating: 4.8,
    reviews: 212,
  },
  {
    id: "aw-2",
    slug: "everyday-jogger-men",
    name: "Everyday Jogger",
    brand: "originals",
    categorySlug: "trousers",
    category: "Trousers",
    price: 52,
    sizes: ["S", "M", "L", "XL"],
    sizeChart: [
      { size: "S", chest: 91, waist: 76, hip: 91 },
      { size: "M", chest: 97, waist: 81, hip: 97 },
      { size: "L", chest: 104, waist: 89, hip: 104 },
      { size: "XL", chest: 112, waist: 97, hip: 112 },
    ],
    colors: [
      { hex: "#2D2A24", label: "Ink" },
      { hex: "#EDEBDE", label: "Cotton" },
    ],
    image:
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&h=1125&fit=crop&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1125&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=900&h=1125&fit=crop&q=80",
    ],
    description:
      "Tapered joggers in soft brushed-back terry, with a comfortable fit and handy pockets for everyday wear.",
    details: [
      "Brushed-back terry",
      "Tapered leg",
      "Zip pockets",
      "Adjustable drawcord",
    ],
    rating: 4.7,
    reviews: 143,
  },
  {
    id: "aw-3",
    slug: "everyday-quarter-zip",
    name: "Everyday Quarter-Zip",
    brand: "originals",
    categorySlug: "sweatshirt",
    category: "Sweatshirt",
    price: 68,
    sizes: ["S", "M", "L", "XL", "XXL"],
    sizeChart: [
      { size: "S", chest: 93, waist: 78, hip: 93 },
      { size: "M", chest: 99, waist: 83, hip: 99 },
      { size: "L", chest: 106, waist: 91, hip: 106 },
      { size: "XL", chest: 114, waist: 99, hip: 114 },
      { size: "XXL", chest: 122, waist: 107, hip: 122 },
    ],
    colors: [
      { hex: "#810100", label: "Cherry" },
      { hex: "#1B1716", label: "Noir" },
    ],
    image:
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&h=1125&fit=crop&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&h=1125&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1611312449408-fcece27cdbb7?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1516826957135-700dedea698c?w=900&h=1125&fit=crop&q=80",
    ],
    description:
      "A comfortable fleece quarter-zip for layering on cooler days or wearing on its own.",
    details: [
      "Midweight fleece",
      "Zip chest pocket",
      "Raglan sleeves",
      "Comfortable cuffs",
    ],
    badge: "New",
    rating: 4.6,
    reviews: 89,
  },
  {
    id: "aw-4",
    slug: "everyday-shorts",
    name: "Everyday Shorts",
    brand: "originals",
    categorySlug: "men",
    category: "Men",
    tags: ["bottoms"],
    price: 40,
    sizes: ["XS", "S", "M", "L"],
    sizeChart: [
      { size: "XS", chest: 86, waist: 71, hip: 86 },
      { size: "S", chest: 91, waist: 76, hip: 91 },
      { size: "M", chest: 97, waist: 81, hip: 97 },
      { size: "L", chest: 104, waist: 89, hip: 104 },
    ],
    colors: [
      { hex: "#1B1716", label: "Noir" },
      { hex: "#810100", label: "Cherry" },
      { hex: "#4a3728", label: "Mocha" },
    ],
    image:
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&h=1125&fit=crop&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1591311630200-ffa9120a540f?w=900&h=1125&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1591311630200-ffa9120a540f?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554344728-77cf90d9ed26?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1584735175315-9d5df23860e6?w=900&h=1125&fit=crop&q=80",
    ],
    description:
      "Lightweight shorts with a soft inner layer, comfortable fit and useful zip pocket for warm days.",
    details: [
      "2-in-1 liner",
      "Zip back pocket",
      "5-inch inseam",
      "Easy-care fabric",
    ],
    rating: 4.5,
    reviews: 76,
  },
];
