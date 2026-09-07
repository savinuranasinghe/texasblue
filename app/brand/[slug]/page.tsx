'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { Header, Footer, Products, ProductModal, collections, useIsMobile } from '../../page';
import { motion, AnimatePresence } from 'framer-motion';
import type { Product, FilterState, FilterOptions, FilterCategory } from '@/types';

export default function BrandPage() {
  const params = useParams();
  const slug = typeof params?.slug === 'string' ? params.slug : Array.isArray(params?.slug) ? params.slug[0] : '';
  
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState<boolean>(false);
  const isMobile = useIsMobile();
  
  const titleName = slug.replace(/-/g, ' ').toUpperCase();
  
  const baseProducts = useMemo<Product[]>(() => {
    let accurateTypes = ['T-Shirt', 'Shirt', 'Vest', 'Pant', 'Shorts', 'Suit', 'Skirt', 'Blouse', 'Top', 'Sleeveless'];
    
    if (slug === 'boys') accurateTypes = ['Collar T-Shirts', 'Round Collar T-Shirts', 'Shorts', 'Pants', 'Sets'];
    else if (slug === 'girls') accurateTypes = ['Collar T-Shirts', 'Round Collar T-Shirts', 'Sets', 'Pants', 'Shorts'];
    else if (slug === 'women') accurateTypes = ['T-Shirts', 'Blouses', 'Tops', 'Skirts', 'Pants'];
    
    // Generate an extended mock list to ensure there's enough varied data to test filtering
    const extended: Product[] = [...collections[0], ...collections[1], ...collections[3]].map((p, i) => ({ 
      ...p, 
      brand: p.brand || titleName,
      category: p.category || accurateTypes[i % accurateTypes.length],
      sizes: p.sizes || ['S', 'M', 'L', 'XL'].slice(0, 2 + (i % 3)),
      colors: p.colors || ['Black', 'White', 'Navy', 'Grey', i % 2 === 0 ? 'Pink' : 'Yellow'].slice(0, 2 + (i % 4)),
      material: p.material || (i % 4 === 0 ? '100% Premium Cotton' : 'Cotton Blend'),
      moq: p.moq || (i % 2 === 0 ? '50 Pieces per color/style' : '100 Pieces per color/style')
    }));
    return extended;
  }, [titleName, slug]);

  const [filters, setFilters] = useState<FilterState>({
    type: [],
    size: [],
    color: [],
    fabric: [],
    moq: [],
    brand: []
  });

  useEffect(() => {
    const type = new URLSearchParams(window.location.search).get('type');
    setFilters(prev => ({ ...prev, type: type ? [type] : [] }));
  }, [slug]);

  const toggleFilter = (category: FilterCategory, value: string) => {
    setFilters(prev => {
      const current = prev[category];
      const updated = current.includes(value) ? current.filter(item => item !== value) : [...current, value];
      return { ...prev, [category]: updated };
    });
  };

  const filterOptions = useMemo<FilterOptions>(() => {
    const opts = {
      type: new Set<string>(),
      size: new Set<string>(),
      color: new Set<string>(),
      fabric: new Set<string>(),
      moq: new Set<string>(),
      brand: new Set<string>()
    };
    baseProducts.forEach(p => {
      if (p.category) opts.type.add(p.category);
      if (p.sizes) p.sizes.forEach(s => opts.size.add(s));
      if (p.colors) p.colors.forEach(c => opts.color.add(c));
      if (p.material) opts.fabric.add(p.material);
      if (p.moq) opts.moq.add(p.moq);
      if (p.brand) opts.brand.add(p.brand);
    });
    return {
      type: Array.from(opts.type).sort(),
      size: Array.from(opts.size).sort(),
      color: Array.from(opts.color).sort(),
      fabric: Array.from(opts.fabric).sort(),
      moq: Array.from(opts.moq).sort(),
      brand: Array.from(opts.brand).sort()
    };
  }, [baseProducts]);

  const filteredProducts = useMemo<Product[]>(() => {
    return baseProducts.filter(p => {
      if (filters.type.length > 0 && !filters.type.includes(p.category)) return false;
      if (filters.size.length > 0 && !(p.sizes && p.sizes.some(s => filters.size.includes(s)))) return false;
      if (filters.color.length > 0 && !(p.colors && p.colors.some(c => filters.color.includes(c)))) return false;
      if (filters.fabric.length > 0 && !filters.fabric.includes(p.material)) return false;
      if (filters.moq.length > 0 && !filters.moq.includes(p.moq)) return false;
      if (filters.brand.length > 0 && !filters.brand.includes(p.brand)) return false;
      return true;
    });
  }, [baseProducts, filters]);

  useEffect(() => { 
    document.body.style.overflow = (menuOpen || selectedProduct || filterDrawerOpen) ? 'hidden' : ''; 
    return () => { document.body.style.overflow = ''; }; 
  }, [menuOpen, selectedProduct, filterDrawerOpen]);

  interface FilterGroupProps {
    title: string;
    category: FilterCategory;
    options: string[];
    initialOpen?: boolean;
  }

  const FilterGroup: React.FC<FilterGroupProps> = ({ title, category, options, initialOpen = false }) => {
    const [open, setOpen] = useState<boolean>(initialOpen);
    if (options.length === 0) return null;
    return (
      <div className="filter-group">
        <button className="filter-group-toggle" onClick={() => setOpen(!open)}>
          {title} <span>{open ? '−' : '＋'}</span>
        </button>
        <AnimatePresence>
          {open && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="filter-options-wrapper">
              <div className="filter-options">
                {options.map(opt => (
                  <label key={opt} className="filter-label">
                    <input type="checkbox" checked={filters[category].includes(opt)} onChange={() => toggleFilter(category, opt)}/>
                    <span className="filter-custom-check">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    </span>
                    <span className="filter-label-text">{opt}</span>
                  </label>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  const FilterSidebar: React.FC = () => (
    <div className="filter-sidebar">
      <div className="filter-header">
        <h3>Filters</h3>
        <button className="clear-filters" onClick={() => setFilters({ type: [], size: [], color: [], fabric: [], moq: [], brand: [] })}>Clear All</button>
      </div>
      <div className="filter-scroll-area">
        <FilterGroup title="Product Type" category="type" options={filterOptions.type} />
        <FilterGroup title="Sizes" category="size" options={filterOptions.size} />
        <FilterGroup title="Color" category="color" options={filterOptions.color} />
        <FilterGroup title="Fabric Type" category="fabric" options={filterOptions.fabric} />
        <FilterGroup title="Minimum Order Qty" category="moq" options={filterOptions.moq} />
      </div>
    </div>
  );

  return (
    <main>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      
      <section className="info-section" style={{ minHeight: '30vh', paddingTop: '150px', paddingBottom: '30px', borderBottom: '1px solid var(--line)', background: '#fff' }}>
        <h1 style={{ fontSize: isMobile ? '3rem' : '4.5rem', fontWeight: 300, letterSpacing: '0.1em', marginBottom: '10px' }}>
          {titleName}
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Wholesale Catalogue
        </p>
      </section>

      <div className="category-layout">
        {isMobile && (
          <div className="mobile-filter-bar">
            <button onClick={() => setFilterDrawerOpen(true)}>
               <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/></svg>
               Filter Products
            </button>
            <span>{filteredProducts.length} Results</span>
          </div>
        )}

        {!isMobile && (
          <aside className="category-sidebar">
            <FilterSidebar />
          </aside>
        )}

        <div className="category-content">
          {!isMobile && (
            <div className="results-header">
              <span className="results-count">{filteredProducts.length} Results</span>
            </div>
          )}
          {filteredProducts.length > 0 ? (
            <Products products={filteredProducts} onProductClick={setSelectedProduct} grid={true} />
          ) : (
            <div className="no-results">
              <p>No products match your selected filters.</p>
              <button className="btn-secondary" onClick={() => setFilters({ type: [], size: [], color: [], fabric: [], moq: [], brand: [] })} style={{ padding: '12px 24px', cursor: 'pointer', marginTop: '15px' }}>Clear Filters</button>
            </div>
          )}
        </div>
      </div>

      {isMobile && (
        <>
          <div className={`filter-drawer ${filterDrawerOpen ? 'open' : ''}`}>
            <div className="filter-drawer-head">
              <h3>Filters</h3>
              <button onClick={() => setFilterDrawerOpen(false)} aria-label="Close filters">✕</button>
            </div>
            <div className="filter-drawer-body">
              <FilterSidebar />
            </div>
            <div className="filter-drawer-foot">
              <button onClick={() => setFilterDrawerOpen(false)}>View {filteredProducts.length} Results</button>
            </div>
          </div>
          {filterDrawerOpen && <div className="filter-drawer-overlay" onClick={() => setFilterDrawerOpen(false)} />}
        </>
      )}

      <Footer />
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </main>
  );
}

