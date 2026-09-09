import React from 'react';

export interface ProductColorData {
  name: string;
  hex: string;
  images: string[];
}

export interface RawProduct {
  name: string;
  price: string;
  image: string;
  images?: string[];
  note?: string;
  tag?: string;
  category?: string;
  categoryHref?: string;
  colors?: string[];
  colorsData?: ProductColorData[];
  sizes?: string[];
  material?: string;
  moq?: string;
  description?: string;
  brand?: string;
  styleCode?: string;
  autoSwap?: boolean;
  hoverImages?: string[];
}

export interface Product {
  name: string;
  price: string;
  image: string;
  images: string[];
  hoverImages?: string[];
  note?: string;
  tag?: string;
  category: string;
  categoryHref?: string;
  colors: string[];
  colorsData?: ProductColorData[];
  sizes: string[];
  material: string;
  moq: string;
  description: string;
  brand: string;
  styleCode: string;
  autoSwap?: boolean;
}

export interface ColorProduct {
  name: string;
  image: string;
  href: string;
}

export interface ActiveColor {
  name: string;
  hex?: string;
  images: string[];
}

export interface NavBrandItem {
  name: string;
  slug: string;
  logo: string;
}

export interface NavDropdownSection {
  heading: string;
  href?: string;
  items: string[];
}

export interface NavDropdownGroup {
  label: string;
  href?: string;
  sections: NavDropdownSection[];
}

export type IconName =
  | 'search'
  | 'user'
  | 'bag'
  | 'heart'
  | 'pin'
  | 'instagram'
  | 'facebook'
  | 'whatsapp'
  | 'premium';

export interface IconProps {
  name: IconName;
}

export interface HeaderProps {
  menuOpen: boolean;
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface EditorialProps {
  image: string;
  title: string;
  position?: string;
  dark?: boolean;
  href?: string;
}

export interface ProductsProps {
  products: Product[];
  onProductClick: (product: Product) => void;
  grid?: boolean;
}

export interface ArrivalsScrollerProps {
  products: Product[];
  onProductClick: (product: Product) => void;
}

export interface ColorScrollerProps {
  colors: ColorProduct[];
}

export interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

export interface KidsCategoryItem {
  name: string;
  image: string;
  position: string;
  viewAll?: boolean;
}

export type FilterCategory = 'type' | 'size' | 'color' | 'fabric' | 'moq' | 'brand';

export interface FilterState {
  type: string[];
  size: string[];
  color: string[];
  fabric: string[];
  moq: string[];
  brand: string[];
}

export interface FilterOptions {
  type: string[];
  size: string[];
  color: string[];
  fabric: string[];
  moq: string[];
  brand: string[];
}
