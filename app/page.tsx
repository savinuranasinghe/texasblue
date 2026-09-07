'use client';

import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import type {
  Product,
  RawProduct,
  ColorProduct,
  ActiveColor,
  IconProps,
  HeaderProps,
  EditorialProps,
  ProductsProps,
  ArrivalsScrollerProps,
  ColorScrollerProps,
  ProductModalProps,
  NavDropdownGroup,
  NavBrandItem
} from '@/types';

const fadeUpProps = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-100px' },
  transition: { duration: 0.8, ease: 'easeOut' as const }
};

const childVariants = {
  hidden: { opacity: 0, y: 44 },
  visible: { opacity: 1, y: 0 }
};

const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.05 } }
};

export function useIsMobile(): boolean {
  const [mobile, setMobile] = useState<boolean>(false);
  useEffect(() => {
    const mq = window.matchMedia('(max-width:900px)');
    const fn = (e: MediaQueryListEvent) => setMobile(e.matches);
    setMobile(mq.matches);
    mq.addEventListener('change', fn);
    return () => mq.removeEventListener('change', fn);
  }, []);
  return mobile;
}

export const Icon: React.FC<IconProps> = ({ name }) => {
  const paths: Record<IconProps['name'], React.ReactNode> = {
    search: <><circle cx="10.8" cy="10.8" r="6.4"/><path d="m15.6 15.6 4.1 4.1"/></>,
    user: <><circle cx="12" cy="8.1" r="3.5"/><path d="M5.8 20c.8-4 3-6 6.2-6s5.4 2 6.2 6"/></>,
    bag: <><path d="M5.2 8.5h13.6l-.7 11H5.9l-.7-11Z"/><path d="M9 9V6.8a3 3 0 0 1 6 0V9"/></>,
    heart: <path d="M20 8.8c0 5-8 10.2-8 10.2S4 13.8 4 8.8C4 5.7 7.8 4 10 6.6L12 9l2-2.4C16.2 4 20 5.7 20 8.8Z"/>,
    pin: <><path d="M18.5 10c0 5-6.5 10-6.5 10S5.5 15 5.5 10a6.5 6.5 0 1 1 13 0Z"/><circle cx="12" cy="10" r="2"/></>,
    instagram: <><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none"/></>,
    facebook: <path d="M14 8h3V4h-3c-3.3 0-5 2-5 5v3H6v4h3v6h4v-6h3.2l.8-4h-4V9c0-.7.3-1 1-1Z" fill="currentColor" stroke="none"/>,
    whatsapp: <><path d="M20.5 11.8a8.5 8.5 0 0 1-12.6 7.4L3 21l1.7-4.8a8.5 8.5 0 1 1 15.8-4.4Z"/><path d="M8.2 7.8c.4-.4 1-.3 1.3.1l1.1 1.6c.2.3.2.7-.1 1l-.8.8a7.2 7.2 0 0 0 3 3l.8-.8c.3-.3.7-.3 1-.1l1.6 1.1c.4.3.5.9.1 1.3l-.7.7c-.8.8-2 .9-3 .5A11.2 11.2 0 0 1 7 11.5c-.4-1-.3-2.2.5-3Z"/></>,
    premium: <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  };
  return <svg className="icon" viewBox="0 0 24 24" aria-hidden="true">{paths[name]}</svg>;
};

const addMockData = (items: RawProduct[], brand: string, category: string): Product[] =>
  items.map(item => ({
    brand,
    styleCode: `TB-${Math.floor(Math.random() * 9000) + 1000}`,
    category,
    images: item.images || [item.image],
    colors: ['Black', 'White', 'Navy', 'Grey'],
    sizes: ['S', 'M', 'L', 'XL'],
    material: '100% Premium Cotton',
    moq: '50 Pieces per color/style',
    description:
      'A premium quality garment designed for comfort and style. Ideal for retail stores looking for high-demand, trendy wholesale items. Manufactured with durability and modern fashion in mind.',
    ...item
  }));

export const collections: Product[][] = [
  addMockData([
    { 
      name: "Boys' Casual Cotton Shorts", 
      price: 'Wholesale Price', 
      image: '/boys/boyshortmain.png', 
      images: ['/boys/boyshortmain.png', '/boys/boyshort2.png', '/boys/boyshort3.jpeg'],
      note: 'New', 
      tag: '100% Premium Cotton • Breathable',
      category: 'Shorts',
      categoryHref: '/brand/boys?type=Shorts',
      colors: ['Navy', 'Khaki', 'Black', 'Grey'],
      sizes: ['2-3Y', '4-5Y', '6-7Y', '8-9Y', '10-11Y'],
      material: '100% Premium Cotton',
      moq: '50 Pieces per color/style',
      description: 'Premium boys cotton shorts designed for everyday comfort and style. Made from soft, breathable 100% cotton with an elasticated waistband and durable stitching. Ideal for retail stores looking for fast-selling kids wear.'
    },
    { name: 'Kids\' Character Print T-Shirt', price: 'Wholesale Price', image: '/assets/texast2.jpeg', note: 'New', tag: 'Organic Cotton • Soft Touch' },
    { 
      name: 'Women\'s Printed T-Shirt', 
      price: 'Wholesale Price', 
      image: '/assets/husst1.jpeg', 
      tag: 'Cotton Blend • Moisture Wicking',
      colorsData: [
        { name: 'Pink', hex: '#f5daed', images: ['/assets/husst1.jpeg', '/assets/sidev.jpeg', '/assets/backv.jpeg'] },
        { name: 'Yellow', hex: '#F4E087', images: ['/assets/yellowt.jpeg'] },
        { name: 'Green', hex: '#98B99A', images: ['/assets/greent.jpeg'] }
      ]
    },
    { name: 'Kids\' Fun Print T-Shirt', price: 'Wholesale Price', image: '/assets/husst2.jpeg', note: 'New', tag: 'Polycotton • Durable' }
  ], 'TEXAS BLUE & HUSS BEE', 'T-Shirts & Tops'),
  addMockData([
    { name: 'Women\'s Knit Lounge Set', price: 'Wholesale Price', image: '/assets/bravot1.jpeg', tag: 'Ribbed Knit • Cozy' },
    { name: 'Men\'s Cotton Chino Trousers', price: 'Wholesale Price', image: '/assets/bravot2.jpeg', tag: 'Stretch Cotton • Smart Fit' },
    { name: 'Ladies\' Floral Mini Skirt', price: 'Wholesale Price', image: '/assets/passot1.jpeg', tag: 'Viscose • Lightweight' },
    { name: 'Women\'s Relaxed Linen Blazer', price: 'Wholesale Price', image: '/assets/passot2.jpeg', tag: 'Pure Linen • Premium' }
  ], 'BRAVO & PASSO', 'Casual & Formal Wear'),
  addMockData([
    { name: 'Ladies\' Wrap Maxi Dress', price: 'Wholesale Price', image: '/assets/alba.jpg', tag: 'Satin Silk • Elegant' },
    { name: 'Men\'s Formal Oxford Shirt', price: 'Wholesale Price', image: '/assets/tourni.jpg', note: 'New', tag: '100% Cotton • Wrinkle Free' },
    { name: 'Women\'s Cropped Denim Jacket', price: 'Wholesale Price', image: '/assets/mimosa.jpg', tag: 'Heavy Denim • Vintage Wash' },
    { name: 'Men\'s Casual Polo Tee', price: 'Wholesale Price', image: '/assets/spiaggia.jpg', tag: 'Pique Cotton • Breathable' }
  ], 'VARIOUS BRANDS', 'Mixed Collection'),
  addMockData([
    { name: 'Women\'s Evening Gown', price: 'Wholesale Price', image: '/assets/inti1.jpeg', note: 'New Collection', tag: 'Silk Blend • Exquisite' },
    { name: 'Ladies\' Satin Blouse', price: 'Wholesale Price', image: '/assets/inti2.jpeg', note: 'New Collection', tag: 'Satin • Smooth Finish' },
    { name: 'Men\'s Tailored Suit Jacket', price: 'Wholesale Price', image: '/assets/inti3.jpeg', note: 'New Collection', tag: 'Wool Blend • Sharp Tailoring' },
    { name: 'Women\'s Pleated Wide-Leg Trousers', price: 'Wholesale Price', image: '/assets/inti4.jpeg', note: 'New Collection', tag: 'Crepe • High Waist' }
  ], 'INTIMATE', 'Formal & Evening Wear')
];

export const colorProducts: ColorProduct[] = [
  { name: 'Black', image: '/assets/black.jpeg', href: '/brand/all?color=Black' },
  { name: 'White', image: '/assets/white.jpeg', href: '/brand/all?color=White' },
  { name: 'Navy', image: '/assets/navy.jpeg', href: '/brand/all?color=Navy' },
  { name: 'Green', image: '/assets/green.jpeg', href: '/brand/all?color=Green' }
];

const navDropdowns: Record<string, NavDropdownGroup> = {
  boys: {
    label: 'BOYS',
    href: '/kids/boys',
    sections: [
      { heading: 'SHOP ALL BOYS', href: '/kids/boys', items: ['Collar T-Shirts', 'Round Collar T-Shirts', 'Shorts', 'Pants', 'Sets'] }
    ]
  },
  girls: {
    label: 'GIRLS',
    href: '/kids/girls',
    sections: [
      { heading: 'SHOP ALL GIRLS', href: '/kids/girls', items: ['Collar T-Shirts', 'Round Collar T-Shirts', 'Sets', 'Pants', 'Shorts'] }
    ]
  }
};

export function Header({ menuOpen, setMenuOpen }: HeaderProps) {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [drawerOpen, setDrawerOpen] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const toggleDrawer = (key: string) => setDrawerOpen(prev => ({ ...prev, [key]: !prev[key] }));
  
  const pathname = usePathname();
  
  const handleSmoothNav = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
      setMenuOpen(false);
    }
  };

  return (
    <>
      <div className="shipping">WHOLESALE ENQUIRIES WELCOME — CALL OR WHATSAPP US</div>
      <header className={scrolled ? 'site-header scrolled' : 'site-header'}>
        <button className="mobile-menu-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
          <span/><span/>
        </button>
        <style>{`
          .nav-logo-img { display: flex; align-items: center; }
          .nav-logo-img img { height: 46px; width: auto; }
          @media(max-width: 900px) {
            .nav-logo-img { position: absolute; left: 50%; transform: translateX(-50%); }
            .nav-logo-img img { height: 36px; }
          }
        `}</style>
        <a href="#" className="nav-logo-img" aria-label="TexasBlue.lk home">
          <img src="/assets/texasLogo.png" alt="TexasBlue" />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          <Link href="/">HOME</Link>
          <Link href="/#arrivals" onClick={(e) => handleSmoothNav(e, 'arrivals')}>NEW ARRIVALS</Link>
          {Object.entries(navDropdowns).map(([key, { label, href, sections }]) => (
            <div key={key} className="nav-dropdown">
              <Link href={href || '#'} className="nav-dropdown-trigger nav-trigger-plain" onClick={e => { if (!href) e.preventDefault(); }}>
                {label} <span className="nav-chevron">▾</span>
              </Link>
              <div className="nav-dropdown-menu nav-dropdown-hidden">
                {sections.map(sec => (
                  <div key={sec.heading} className="nav-dropdown-section">
                    <Link href={sec.href || `/brand/${sec.heading.toLowerCase()}`} className="nav-dropdown-heading" style={{ textDecoration: 'none' }}>
                      {sec.heading}
                    </Link>
                    <div>
                      {sec.items.map(item => (
                        <Link href={{ pathname: `/brand/${key}`, query: { type: item } }} key={item}>{item}</Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          <Link href="/#about" onClick={(e) => handleSmoothNav(e, 'about')}>ABOUT US</Link>
          <Link href="/#partners" onClick={(e) => handleSmoothNav(e, 'partners')}>PARTNERS</Link>
        </nav>
        <div className="tools desktop-tool">
          <button aria-label="User Login"><Icon name="user" /></button>
        </div>
      </header>
      <aside className={menuOpen ? 'mobile-drawer open' : 'mobile-drawer'} aria-hidden={!menuOpen}>
        <div className="drawer-head">
          <span className="nav-logo-img"><img src="/assets/texasLogo.png" alt="TexasBlue" style={{ height: '28px', width: 'auto' }} /></span>
          <button onClick={() => setMenuOpen(false)} aria-label="Close menu">CLOSE</button>
        </div>
        <nav>
          <Link href="/" onClick={() => setMenuOpen(false)}>HOME</Link>
          <Link href="/#arrivals" onClick={(e) => handleSmoothNav(e, 'arrivals')}>NEW ARRIVALS</Link>
          {Object.entries(navDropdowns).map(([key, { label, sections }]) => (
            <div key={key}>
              <a href="#" onClick={e => { e.preventDefault(); toggleDrawer(key); }} className="drawer-accordion-trigger">
                {label} <span>{drawerOpen[key] ? '−' : '＋'}</span>
              </a>
              {drawerOpen[key] && sections.map(sec => (
                <div key={sec.heading} className="drawer-sub-section">
                  <Link href={sec.href || `/brand/${sec.heading.toLowerCase()}`} className="drawer-sub-heading" style={{ textDecoration: 'none' }} onClick={() => setMenuOpen(false)}>
                    {sec.heading}
                  </Link>
                  <div>
                    {sec.items.map(item => (
                      <Link href={{ pathname: `/brand/${key}`, query: { type: item } }} key={item} onClick={() => setMenuOpen(false)} className="drawer-sub-item">{item}</Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
          <Link href="/#about" onClick={(e) => handleSmoothNav(e, 'about')}>ABOUT US</Link>
          <Link href="/#partners" onClick={(e) => handleSmoothNav(e, 'partners')}>PARTNERS</Link>
        </nav>
      </aside>
      {menuOpen && <button className="drawer-overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)}/>}
    </>
  );
}

export function Editorial({ image, title, position = 'center', dark = false, href }: EditorialProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const router = useRouter();
  const slug = title.toLowerCase().replace(/\s+/g, '-');
  const destination = href || `/brand/${slug}`;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });
  const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <motion.a
      ref={ref}
      {...fadeUpProps}
      href={destination}
      onClick={(e) => { e.preventDefault(); router.push(destination); }}
      className={`editorial ${dark ? 'dark' : ''}`}
      whileHover="hovered"
      initial="rest"
      animate="rest"
    >
      <motion.div
        initial={{ scale: 1.15 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ width: '100%', height: '100%', overflow: 'hidden' }}
      >
        <motion.img
          src={image}
          alt=""
          style={{ objectPosition: position, height: '120%', width: '100%', top: '-10%', position: 'relative', y }}
          variants={{ rest: { scale: 1 }, hovered: { scale: 1.06 } }}
          transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
      </motion.div>
      <motion.span
        variants={{
          rest:    { y: 0,  letterSpacing: '0.02em' },
          hovered: { y: -6, letterSpacing: '0.18em' }
        }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      >
        {title}
      </motion.span>
    </motion.a>
  );
}

function VideoHero({ isMobile: isMobileProp }: { isMobile?: boolean } = {}) {
  const detectedMobile = useIsMobile();
  const isMobile = isMobileProp ?? detectedMobile;
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);

  return (
    <section ref={ref} className="video-hero">
      <motion.video
        key={isMobile ? 'mobile-hero-video' : 'desktop-hero-video'}
        src={isMobile ? '/assets/babyheromobile.mp4' : '/assets/texashero.mp4'}
        autoPlay
        loop
        muted
        playsInline
        className="video-hero-bg"
        style={{ y }}
      />
      <div className="video-hero-content">
        <img src="/assets/texasLogohero.png" alt="Texas Blue" className="video-hero-logo" />
        <p>Style that moves with you</p>
      </div>
    </section>
  );
}

export function BrandVideo() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

  return (
    <section ref={ref} className="video-banner">
      <motion.video
        src="/assets/brand.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="video-hero-bg"
        style={{ y }}
      />
    </section>
  );
}

const productVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function Products({ products, onProductClick, grid = false }: ProductsProps) {
  return (
    <motion.section 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-50px' }}
      transition={{ staggerChildren: 0.1 }}
      className={grid ? 'product-grid' : 'products'}
      aria-label="Featured products"
    >
      {products.map((p, i) => (
        <motion.article variants={productVariants} transition={{ duration: 0.6, ease: 'easeOut' }} className="product" key={`${p.name}-${i}`}>
          <a href="#" className="product-image" onClick={(e) => { e.preventDefault(); onProductClick(p); }}>
            <img src={p.image} alt={p.name}/>
            {p.note && <span className="product-note">{p.note}</span>}
            <button className="wish" aria-label={`Add ${p.name} to wishlist`}><Icon name="heart"/></button>
            <span className="quick">MORE INFO</span>
            {p.tag && (
              <span className="product-insta-tag">
                <span className="insta-dot"></span>
                <span className="insta-text">{p.tag}</span>
              </span>
            )}
          </a>
          <div className="product-info">
            <a href="#" onClick={(e) => { e.preventDefault(); onProductClick(p); }}>{p.name}</a>
            <span>{p.price}</span>
          </div>
        </motion.article>
      ))}
    </motion.section>
  );
}

export function ArrivalsScroller({ products, onProductClick }: ArrivalsScrollerProps) {
  const scrollRef = useRef<HTMLElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <div className="arrivals-scroller">
      <motion.section
        ref={scrollRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        transition={{ staggerChildren: 0.1 }}
        className="products"
        aria-label="New arrivals products"
      >
        {products.map((p, i) => (
          <motion.article variants={productVariants} transition={{ duration: 0.6, ease: 'easeOut' }} className="product" key={`${p.name}-${i}`}>
            <a href="#" className="product-image" onClick={(e) => { e.preventDefault(); onProductClick(p); }}>
              <img src={p.image} alt={p.name}/>
              {p.note && <span className="product-note">{p.note}</span>}
              <button className="wish" aria-label={`Add ${p.name} to wishlist`}><Icon name="heart"/></button>
              <span className="quick">MORE INFO</span>
              {p.tag && (
                <span className="product-insta-tag">
                  <span className="insta-dot"></span>
                  <span className="insta-text">{p.tag}</span>
                </span>
              )}
            </a>
            <div className="product-info"><a href="#" onClick={(e) => { e.preventDefault(); onProductClick(p); }}>{p.name}</a><span>{p.price}</span></div>
          </motion.article>
        ))}
      </motion.section>
      <div className="arrivals-nav">
        <button
          className={`arrivals-arrow arrivals-arrow--prev${canScrollLeft ? '' : ' arrivals-arrow--hidden'}`}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button
          className={`arrivals-arrow arrivals-arrow--next${canScrollRight ? '' : ' arrivals-arrow--hidden'}`}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );
}

function Services() {
  return (
    <motion.section {...fadeUpProps} className="services">
      <a href="#"><Icon name="pin"/><h3>Visit Our Showroom</h3><p>Colombo, Sri Lanka — open to registered wholesale buyers.</p></a>
      <a href="#"><svg className="service-icon" viewBox="0 0 34 24"><path d="M1 5h20v14H1zM21 10h6l5 5v4H21zM6 19a3 3 0 1 0 6 0M24 19a3 3 0 1 0 6 0"/></svg><h3>Island-Wide Delivery</h3><p>Reliable delivery across Sri Lanka for all wholesale orders.</p></a>
      <a href="#"><svg className="service-icon" viewBox="0 0 28 28"><rect x="2" y="5" width="24" height="18" rx="1"/><path d="M2 10h24M7 18h5"/></svg><h3>Flexible Payment Terms</h3><p>Bank transfer, cheque, and cash-on-delivery options available for trade buyers.</p></a>
    </motion.section>
  );
}

function About() {
  return (
    <section id="about" className="about-section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="about-container"
      >
        <motion.div variants={childVariants} transition={{ duration: 0.75, ease: 'easeOut' }} className="about-content">
          <span className="about-subtitle">OUR STORY</span>
          <h2>A Heritage of<br/>Garment Making</h2>
          <div className="about-divider"></div>
          <p className="about-lead">Texas Blue is a Sri Lankan fashion brand bringing the latest wearable designs at affordable prices.</p>
          <p>As a premier wholesale supplier, we house multiple exclusive collections under one roof. Our focus is supplying premium, high-quality garments to retailers and business buyers tailored for the modern market.</p>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Partners() {
  const logos = [
    { src: '/assets/thike.png', alt: 'Thike' },
    { src: '/assets/kandyy.png', alt: 'Kandyy' },
    { src: '/assets/ladyj.jpg', alt: 'Lady J' },
  ];
  const scrollLogos = [...logos, ...logos, ...logos, ...logos];
  return (
    <section id="partners" className="partners-section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.3 }}
        className="partners-container"
      >
        <motion.span variants={childVariants} transition={{ duration: 0.75, ease: 'easeOut' }} className="partners-subtitle">RETAIL NETWORK</motion.span>
        <motion.h2 variants={childVariants} transition={{ duration: 0.75, ease: 'easeOut' }}>Trusted Partners</motion.h2>
        <motion.p variants={childVariants} transition={{ duration: 0.75, ease: 'easeOut' }} className="partners-lead">We supply to leading retailers and boutiques across the island and beyond.</motion.p>
        <motion.div variants={childVariants} transition={{ duration: 0.75, ease: 'easeOut' }} className="partners-marquee">
          <div className="partners-track">
            {scrollLogos.map((logo, i) => (
              <span key={i} className="partner-logo"><img src={logo.src} alt={logo.alt} /></span>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}

function Contact() {
  return (
    <section id="contact" className="info-section">
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, amount: 0.2 }}
        style={{ width: '100%', maxWidth: '500px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
      >
        <motion.h2 variants={childVariants} transition={{ duration: 0.75, ease: 'easeOut' }}>Contact Us</motion.h2>
        <motion.div variants={childVariants} transition={{ duration: 0.75, ease: 'easeOut' }} className="contact-details">
          <div><strong>Showroom</strong>Colombo, Sri Lanka</div>
          <div><strong>Phone / WhatsApp</strong>+94 77 123 4567</div>
          <div><strong>Email</strong>wholesale@texasblue.lk</div>
        </motion.div>
        <motion.form variants={childVariants} transition={{ duration: 0.75, ease: 'easeOut' }} className="contact-form" onSubmit={e => e.preventDefault()}>
          <input type="text" placeholder="Business Name *" required />
          <input type="email" placeholder="Email Address *" required />
          <textarea placeholder="Your Enquiry *" required></textarea>
          <button type="submit">SEND ENQUIRY</button>
        </motion.form>
      </motion.div>
    </section>
  );
}

export function Footer() {
  const groups = [
    ['NEED HELP? CONTACT US', 'Customer Service', 'Wholesale enquiry form', 'Track an order', 'Request a catalogue'],
    ['LEGAL', 'Terms of sale', 'Privacy policy', 'Terms of Use'],
    ['COMPANY', 'About TexasBlue.lk', 'Showroom', 'Careers'],
    ['BLOGS & GUIDES', 'Fashion & Style Blog', 'Fabric & Material Guide', 'Wholesale Buying Tips', 'Industry News']
  ];
  return (
    <footer className="premium-footer">
      <div className="footer-links">
        <div className="footer-brand-col">
          <span className="footer-logo">TEXASBLUE.LK</span>
          <p>Style that moves with you.<br/>Colombo, Sri Lanka.</p>
          <div className="social-icons">
            <a href="#" aria-label="Instagram"><Icon name="instagram" /></a>
            <a href="#" aria-label="Facebook"><Icon name="facebook" /></a>
            <a href="#" aria-label="WhatsApp"><Icon name="whatsapp" /></a>
          </div>
        </div>
        {groups.map((g, i) => (
          <details key={g[0]} open={true}>
            <summary>{g[0]}<span>＋</span></summary>
            {i === 0 && <p className="business-hours">Mon - Fri: 9am – 6pm<br/>Sat: 9am – 1pm</p>}
            {g.slice(1).map(x => <a href="#" key={x}>{x}</a>)}
          </details>
        ))}
      </div>
      <div className="footer-bottom">
        <span>© TEXASBLUE.LK 2026. ALL RIGHTS RESERVED.</span>
        <span>Designed by <a href="https://divgaze.com" target="_blank" rel="noopener noreferrer">divgaze.com</a></span>
      </div>
    </footer>
  );
}

export function ProductModal({ product, onClose }: ProductModalProps) {
  const [activeColor, setActiveColor] = useState<ActiveColor | null>(null);

  useEffect(() => {
    if (product) {
      if (product.colorsData && product.colorsData.length > 0) {
        setActiveColor(product.colorsData[0]);
      } else {
        setActiveColor({ name: 'Default', images: product.images || [product.image] });
      }
    }
  }, [product]);

  if (!product || !activeColor) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <motion.div 
        className="modal-content"
        initial={{ opacity: 0, y: 50, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 20, scale: 0.95 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-grid">
          <div className="modal-images">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeColor.name}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
                className="modal-images-inner"
              >
                {activeColor.images.map((img, i) => (
                  <img key={i} src={img} alt={`${product.name} ${i+1}`} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="modal-details">
            <span className="modal-brand">{product.brand}</span>
            <h2 className="modal-title">{product.name}</h2>
            <div className="modal-code">Style Code: {product.styleCode}</div>
            
            <div className="modal-specs">
              <div>
                <strong>Category</strong>
                {product.categoryHref ? (
                  <Link href={product.categoryHref} onClick={onClose} style={{ textDecoration: 'underline', color: 'inherit' }}>
                    {product.category}
                  </Link>
                ) : (
                  <span>{product.category}</span>
                )}
              </div>
              <div><strong>Material</strong><span>{product.material}</span></div>
              {product.colorsData ? (
                <div className="color-section">
                  <strong>Colours</strong>
                  <div className="color-options">
                    {product.colorsData.map(c => (
                      <button 
                        key={c.name}
                        className={`color-btn ${activeColor.name === c.name ? 'active' : ''}`}
                        style={{ backgroundColor: c.hex }}
                        onClick={() => setActiveColor(c)}
                        aria-label={c.name}
                        title={c.name}
                      />
                    ))}
                  </div>
                </div>
              ) : (
                <div><strong>Colours</strong><span>{product.colors.join(', ')}</span></div>
              )}
              <div><strong>Sizes</strong><span>{product.sizes.join(', ')}</span></div>
              <div><strong>MOQ</strong><span>{product.moq}</span></div>
            </div>
            
            <p className="modal-desc">{product.description}</p>
            
            <div className="modal-actions">
              <a href="#contact" className="btn-primary" onClick={onClose}>CONTACT FOR WHOLESALE</a>
              <a href="#partners" className="btn-secondary" onClick={onClose}>GET FROM RETAIL PARTNER</a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export function ColorScroller({ colors }: ColorScrollerProps) {
  const scrollRef = useRef<HTMLElement>(null);
  const router = useRouter();
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateScrollState, { passive: true });
    updateScrollState();
    return () => el.removeEventListener('scroll', updateScrollState);
  }, []);

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  return (
    <div className="arrivals-scroller">
      <motion.section
        ref={scrollRef}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-50px' }}
        transition={{ staggerChildren: 0.1 }}
        className="products"
        aria-label="Shop by Color"
      >
        {colors.map((c, i) => (
          <motion.article variants={productVariants} transition={{ duration: 0.6, ease: 'easeOut' }} className="product" key={`${c.name}-${i}`}>
            <a href={c.href} className="product-image" onClick={(e) => { e.preventDefault(); router.push(c.href); }}>
              <img src={c.image} alt={c.name} />
            </a>
            <div className="product-info" style={{ justifyContent: 'center' }}>
              <a href={c.href} onClick={(e) => { e.preventDefault(); router.push(c.href); }} style={{ fontSize: '1.4rem', fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase' }}>SHOP {c.name}</a>
            </div>
          </motion.article>
        ))}
      </motion.section>
      <div className="arrivals-nav">
        <button
          className={`arrivals-arrow arrivals-arrow--prev${canScrollLeft ? '' : ' arrivals-arrow--hidden'}`}
          onClick={() => scroll('left')}
          aria-label="Scroll left"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <button
          className={`arrivals-arrow arrivals-arrow--next${canScrollRight ? '' : ' arrivals-arrow--hidden'}`}
          onClick={() => scroll('right')}
          aria-label="Scroll right"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    document.body.style.overflow = (menuOpen || selectedProduct) ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen, selectedProduct]);

  return (
    <main>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>
      {isMobile ? (
        <>
          <VideoHero isMobile={true} />
          <section className="new-arrivals" id="arrivals">
            <h2 style={{ textAlign: 'center', margin: '50px 0 20px', fontSize: '2rem', fontWeight: 300 }}>NEW ARRIVALS</h2>
            <ArrivalsScroller products={[...collections[0], ...collections[1]]} onProductClick={setSelectedProduct} />
            <div style={{ textAlign: 'center', marginBottom: '50px' }}>
              <a href="#" className="btn-primary" style={{ display: 'inline-block', padding: '16px 48px', fontSize: '1.1rem', letterSpacing: '0.15em', transition: 'all 0.3s ease', border: '1px solid var(--black)', textDecoration: 'none' }}>DISCOVER MORE</a>
            </div>
          </section>
          <section className="mob-card"><Editorial image="/assets/texas.jpg" title="BOYS" position="48% center" href="/kids/boys"/></section>
          <section className="mob-card"><Editorial image="/assets/Bravo.jpg" title="GIRLS" position="center center" href="/kids/girls"/></section>
          <section className="feature"><Editorial image="/assets/Huss.jpg" title="INFANT SETS" position="center 35%" href="/brand/infant-sets"/></section>
        </>
      ) : (
        <>
          <VideoHero isMobile={false} />
          <section className="new-arrivals" id="arrivals">
            <h2 style={{ textAlign: 'center', margin: '60px 0 30px', fontSize: '2.5rem', fontWeight: 300 }}>NEW ARRIVALS</h2>
            <ArrivalsScroller products={[...collections[0], ...collections[1]]} onProductClick={setSelectedProduct} />
            <div style={{ textAlign: 'center', marginBottom: '60px' }}>
              <a href="#" className="btn-primary" style={{ display: 'inline-block', padding: '18px 54px', fontSize: '1.2rem', letterSpacing: '0.15em', transition: 'all 0.3s ease', border: '1px solid var(--black)', textDecoration: 'none' }}>DISCOVER MORE</a>
            </div>
          </section>
          <section className="hero">
            <Editorial image="/assets/texas.jpg" title="BOYS" position="48% center" href="/kids/boys"/>
            <Editorial image="/assets/Bravo.jpg" title="GIRLS" position="center center" href="/kids/girls"/>
            <div className="hero-dots"><i/><i/></div>
          </section>
          <section className="feature"><Editorial image="/assets/Huss.jpg" title="INFANT SETS" position="center 35%" href="/brand/infant-sets"/></section>
        </>
      )}
      <About />
      <BrandVideo />
      <Partners />
      <Footer/>
      {selectedProduct && <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />}
    </main>
  );
}
