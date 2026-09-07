'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Footer, Header } from '../../page';
import type { KidsCategoryItem } from '@/types';

const categoryData: Record<string, KidsCategoryItem[]> = {
  boys: [
    { name: 'Collar T-Shirts', image: '/boys/collart.png', position: 'center' },
    { name: 'Round Collar T-Shirts', image: '/boys/roundcollar.png', position: 'center' },
    { name: 'Sets', image: '/boys/set.png', position: 'center' },
    { name: 'Pants', image: '/boys/pant.png', position: 'center' },
    { name: 'Shorts', image: '/boys/short.png', position: 'center' },
    { name: 'View All', image: '/assets/texas.jpg', position: '48% center', viewAll: true }
  ],
  girls: [
    { name: 'Collar T-Shirts', image: '/girls/gcollart.png', position: 'center' },
    { name: 'Round Collar T-Shirts', image: '/girls/roundcollart.png', position: 'center' },
    { name: 'Sets', image: '/girls/gset.png', position: 'center' },
    { name: 'Pants', image: '/girls/gpant.png', position: 'center' },
    { name: 'Shorts', image: '/girls/gshorts.png', position: 'center' },
    { name: 'View All', image: '/assets/Bravo.jpg', position: 'center', viewAll: true }
  ]
};

export default function KidsCategoryPage() {
  const params = useParams();
  const gender = typeof params?.gender === 'string' ? params.gender : Array.isArray(params?.gender) ? params.gender[0] : '';
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const categories = categoryData[gender] || [];
  const title = gender === 'girls' ? 'GIRLS' : 'BOYS';

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  return (
    <main>
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
      <section className="kids-category-heading">
        <span>COLLECTION</span>
        <h1>{title}</h1>
        <p>SHOP BY CATEGORY</p>
      </section>
      <section className="kids-category-grid" aria-label={`${title} categories`}>
        {categories.map(category => {
          const href = category.viewAll
            ? `/brand/${gender}`
            : { pathname: `/brand/${gender}`, query: { type: category.name } };

          return (
            <Link href={href} className="kids-category-card" key={category.name}>
              <img src={category.image} alt="" style={{ objectPosition: category.position }} />
              <span>{category.name}</span>
            </Link>
          );
        })}
      </section>
      <Footer />
    </main>
  );
}
