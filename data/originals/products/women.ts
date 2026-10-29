import type { Product } from "@/types";

export const womenProducts: Product[] = [
  {
    id: "aw-5",
    slug: "high-rise-everyday-legging",
    name: "High-Rise Everyday Legging",
    brand: "originals",
    categorySlug: "women",
    category: "Women",
    tags: ["bottoms"],
    price: 58,
    sizes: ["XS", "S", "M", "L", "XL"],
    sizeChart: [
      { size: "XS", chest: 79, waist: 61, hip: 87 },
      { size: "S", chest: 84, waist: 66, hip: 92 },
      { size: "M", chest: 89, waist: 71, hip: 97 },
      { size: "L", chest: 96, waist: 78, hip: 104 },
      { size: "XL", chest: 104, waist: 86, hip: 112 },
    ],
    colors: [
      { hex: "#810100", label: "Cherry" },
      { hex: "#1B1716", label: "Noir" },
      { hex: "#c9a24b", label: "Gold" },
    ],
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&h=1125&fit=crop&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=900&h=1125&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=900&h=1125&fit=crop&q=80",
    ],
    description:
      "Soft, high-waist stretch leggings with a smooth feel and a discreet pocket for everyday essentials.",
    details: [
      "Comfortable stretch",
      "High-waist",
      "Hidden pocket",
      "Four-way stretch",
    ],
    badge: "Bestseller",
    rating: 4.9,
    reviews: 387,
  },
  {
    id: "aw-6",
    slug: "sculpt-bra",
    name: "Sculpt Bra",
    brand: "originals",
    categorySlug: "women",
    category: "Women",
    tags: ["tops"],
    price: 44,
    sizes: ["XS", "S", "M", "L"],
    sizeChart: [
      { size: "XS", chest: 76, waist: 60, hip: 84 },
      { size: "S", chest: 81, waist: 65, hip: 89 },
      { size: "M", chest: 87, waist: 71, hip: 95 },
      { size: "L", chest: 94, waist: 78, hip: 102 },
    ],
    colors: [
      { hex: "#810100", label: "Cherry" },
      { hex: "#EDEBDE", label: "Cotton" },
    ],
    image:
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900&h=1125&fit=crop&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=900&h=1125&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1538805060514-97d9cc17730c?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1571731956672-f2b94d7dd0cb?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1595078475328-1ab05d0a6a0e?w=900&h=1125&fit=crop&q=80",
    ],
    description:
      "A medium-support bra with removable cups, a racerback shape and comfortable stretch for all-day wear.",
    details: [
      "Medium support",
      "Removable cups",
      "Racerback",
      "Soft stretch fabric",
    ],
    badge: "New",
    rating: 4.8,
    reviews: 204,
  },
  {
    id: "aw-7",
    slug: "cropped-everyday-hoodie",
    name: "Cropped Everyday Hoodie",
    brand: "originals",
    categorySlug: "hoodie",
    category: "Hoodie",
    price: 62,
    sizes: ["S", "M", "L", "XL"],
    sizeChart: [
      { size: "S", chest: 88, waist: 70, hip: 96 },
      { size: "M", chest: 94, waist: 76, hip: 102 },
      { size: "L", chest: 101, waist: 83, hip: 109 },
      { size: "XL", chest: 109, waist: 91, hip: 117 },
    ],
    colors: [
      { hex: "#EDEBDE", label: "Cotton" },
      { hex: "#2D2A24", label: "Ink" },
      { hex: "#810100", label: "Cherry" },
    ],
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&h=1125&fit=crop&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1125&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1554344728-77cf90d9ed26?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=900&h=1125&fit=crop&q=80",
    ],
    description:
      "A cropped hoodie in soft French terry, easy to layer with your favorite everyday pieces.",
    details: [
      "French terry cotton",
      "Cropped fit",
      "Kangaroo pocket",
      "Relaxed hood",
    ],
    rating: 4.7,
    reviews: 156,
  },
  {
    id: "aw-8",
    slug: "biker-shorts",
    name: "Biker Shorts",
    brand: "originals",
    categorySlug: "women",
    category: "Women",
    tags: ["bottoms"],
    price: 46,
    sizes: ["XS", "S", "M", "L"],
    sizeChart: [
      { size: "XS", chest: 79, waist: 61, hip: 87 },
      { size: "S", chest: 84, waist: 66, hip: 92 },
      { size: "M", chest: 89, waist: 71, hip: 97 },
      { size: "L", chest: 96, waist: 78, hip: 104 },
    ],
    colors: [
      { hex: "#810100", label: "Cherry" },
      { hex: "#1B1716", label: "Noir" },
    ],
    image:
      "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=900&h=1125&fit=crop&q=80",
    hoverImage:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&h=1125&fit=crop&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1550345332-09e3ac987658?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=900&h=1125&fit=crop&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=900&h=1125&fit=crop&q=80",
    ],
    description:
      "High-waist stretch shorts with a smooth feel and discreet pocket for an easy, comfortable fit.",
    details: [
      "High-waist",
      "7-inch inseam",
      "Hidden waistband pocket",
      "Squat-proof",
    ],
    rating: 4.8,
    reviews: 312,
  },
];
