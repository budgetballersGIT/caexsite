import React, { useRef } from 'react';
import ProductTile from './ProductTile';

function ArrowRight() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// One category: title, "See all", and a horizontally scrolling strip of product tiles.
export default function ProductRow({ title, products, onSeeAll, onAddToCart, wishedIds, onWishToggle }) {
  const trackRef = useRef(null);
  const scrollNext = () => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: Math.max(el.clientWidth * 0.8, 240), behavior: 'smooth' });
  };

  return (
    <section className="prow">
      <div className="prow-head">
        <h2 className="prow-title">{title}</h2>
        {onSeeAll && (
          <button type="button" className="prow-seeall" onClick={onSeeAll}>
            See all <ArrowRight />
          </button>
        )}
      </div>
      <div className="prow-viewport">
        <div className="prow-track" ref={trackRef}>
          {products.map(p => (
            <ProductTile
              key={p.id}
              product={p}
              onAddToCart={onAddToCart}
              wished={wishedIds.has(p.id)}
              onWishToggle={onWishToggle}
            />
          ))}
        </div>
        {products.length > 3 && (
          <button type="button" className="prow-next" onClick={scrollNext} aria-label="Scroll right">
            <ArrowRight />
          </button>
        )}
      </div>
    </section>
  );
}
