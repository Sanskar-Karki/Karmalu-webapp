import type { Product } from "@/types";

export const womenProducts: Product[] = [
  {
    id: "aw-5",
    slug: "zen-flow-legging",
    name: "Zen Flow Legging",
    brand: "activewear",
    categorySlug: "women",
    category: "Women",
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
      "Buttery-soft high-waist leggings with a squat-proof weave and a hidden waistband pocket. Your second-skin for flow.",
    details: [
      "Squat-proof weave",
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
    slug: "sculpt-sports-bra",
    name: "Sculpt Sports Bra",
    brand: "activewear",
    categorySlug: "women",
    category: "Women",
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
      "Medium-support sports bra with removable cups, a racerback design, and a barely-there feel. Studio to street.",
    details: [
      "Medium support",
      "Removable cups",
      "Racerback",
      "Moisture-wicking",
    ],
    badge: "New",
    rating: 4.8,
    reviews: 204,
  },
  {
    id: "aw-7",
    slug: "studio-crop-hoodie",
    name: "Studio Crop Hoodie",
    brand: "activewear",
    categorySlug: "women",
    category: "Women",
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
      "A cropped hoodie in soft French terry. Wear it over your sports bra at the studio or paired with jeans on the weekend.",
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
    slug: "flow-shorts-women",
    name: "Flow Biker Short",
    brand: "activewear",
    categorySlug: "women",
    category: "Women",
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
      "High-waist biker shorts in our softest fabric. The perfect base layer from mat to meal.",
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
