import React from 'react';
import { useNavigate } from 'react-router-dom';

function HeartIcon({ filled }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24"
      fill={filled ? '#e53935' : 'transparent'} stroke={filled ? '#e53935' : 'currentColor'}
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  );
}

// Product tile: image, price pill, brand, name. Used in category rows and the grid.
export default function ProductTile({ product, onAddToCart, wished = false, onWishToggle }) {
  const navigate = useNavigate();
  const inStock = product.stock > 0;

  return (
    <div className="ptile" onClick={() => navigate(`/product/${product.id}`)}>
      <div className="ptile-img">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          onError={e => { e.currentTarget.style.opacity = '.25'; }}
        />
        <button
          type="button"
          className={`ptile-heart${wished ? ' active' : ''}`}
          onClick={e => { e.stopPropagation(); onWishToggle && onWishToggle(product.id); }}
          title={wished ? 'Remove from stash' : 'Add to stash'}
        >
          <HeartIcon filled={wished} />
        </button>
        {!inStock && <span className="ptile-oos">Out of stock</span>}
      </div>
      <span className="ptile-price">{product.price}</span>
      <div className="ptile-brand">{product.brand}</div>
      <div className="ptile-name" title={product.name}>{product.name}</div>
      <button
        type="button"
        className="ptile-add"
        disabled={!inStock}
        onClick={e => { e.stopPropagation(); if (inStock && onAddToCart) onAddToCart(product); }}
      >
        {inStock ? 'Add to cart' : 'Out of stock'}
      </button>
    </div>
  );
}
