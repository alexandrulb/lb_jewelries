import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './style.css';
import './editor.css';

// Robust brand extractor for Woo Store API payloads
function getBrand(product) {
  if (!product) return '';

  // 1) First-class Brands taxonomy (if present)
  const b1 = product.brands?.[0]?.name || product.brands?.[0]?.slug;
  if (b1) return b1;

  // 2) Common attribute slugs used in your catalog
  const preferredSlugs = ['lux_g_brand', 'lux_qb_brand', 'brand', 'lux_g_signatures'];
  const attrs = Array.isArray(product.attributes) ? product.attributes : [];

  // 2a) exact slug match (preferred order)
  for (const slug of preferredSlugs) {
    const a = attrs.find(x => x?.slug?.toLowerCase?.() === slug);
    const t = a?.terms?.[0];
    if (t?.name || t?.slug) return t.name || t.slug;
  }

  // 2b) name/label exactly "brand"
  const fromLabel = attrs.find(x => x?.name?.toLowerCase?.() === 'brand');
  if (fromLabel?.terms?.[0]) return fromLabel.terms[0].name || fromLabel.terms[0].slug;

  // 2c) any attribute whose slug/label contains "brand"
  for (const a of attrs) {
    const s = a?.slug?.toLowerCase?.() || '';
    const n = a?.name?.toLowerCase?.() || '';
    if (s.includes('brand') || n.includes('brand')) {
      const t = a?.terms?.[0];
      if (t?.name || t?.slug) return t.name || t.slug;
    }
  }

  return '';
}

registerBlockType('lb-jewelry/carousel', {
  edit: ({ attributes, setAttributes }) => {
    const { autoplay = false, loop = false } = attributes;
    const blockProps = useBlockProps({ className: 'wpgcb-carousel' });
    const [products, setProducts] = useState([]);

    useEffect(() => {
      const url =
        '/wp-json/wc/store/v1/products' +
        '?attributes[0][attribute]=pa_product_type' +
        '&attributes[0][slug]=jewelry' +
        '&per_page=10';
      fetch(url)
        .then((res) => res.json())
        .then((data) => (Array.isArray(data) ? setProducts(data) : setProducts([])))
        .catch(() => setProducts([]));
    }, []);

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Carousel Settings', 'luxurybazaar_jewelry')} initialOpen={true}>
            <ToggleControl
              label={__('Autoplay', 'luxurybazaar_jewelry')}
              checked={autoplay}
              onChange={(value) => setAttributes({ autoplay: value })}
            />
            <ToggleControl
              label={__('Loop', 'luxurybazaar_jewelry')}
              checked={loop}
              onChange={(value) => setAttributes({ loop: value })}
            />
          </PanelBody>
        </InspectorControls>

        <div {...blockProps}>
          {products.length ? (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={autoplay ? { delay: 3000 } : false}
              loop={loop}
              slidesPerView={1}
              breakpoints={{
                480: { slidesPerView: 2 },
                768: { slidesPerView: 3 },
                1024: { slidesPerView: 5 },
              }}
            >
              {products.map((product) => {
                const brand = getBrand(product);
                const img = product.images?.[0]?.src;
                return (
                  <SwiperSlide key={product.id}>
                    {img && <img src={img} alt={product.name || ''} />}
                    {brand && <div className="product-brand">{brand}</div>}
                    <div className="product-title">{product.name}</div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          ) : (
            __('Loading products...', 'luxurybazaar_jewelry')
          )}
        </div>
      </>
    );
  },

  save: ({ attributes }) => {
    const { autoplay = false, loop = false } = attributes;
    const blockProps = useBlockProps.save({
      className: 'wpgcb-carousel swiper',
      'data-autoplay': autoplay,
      'data-loop': loop,
    });
    return (
      <div {...blockProps}>
        <div className="swiper-wrapper"></div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-pagination"></div>
      </div>
    );
  },
});
