import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
  useBlockProps,
  InspectorControls
} from '@wordpress/block-editor';
import {
  PanelBody,
  ToggleControl
} from '@wordpress/components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './style.css';
import './editor.css';

registerBlockType('lb-jewelry/carousel', {
  edit: ({ attributes, setAttributes }) => {
    const { autoplay = false, loop = false } = attributes;
    const blockProps = useBlockProps({ className: 'wpgcb-carousel' });
    const [products, setProducts] = useState([]);

    useEffect(() => {
      fetch('/wp-json/wc/store/products?category=jewelry&per_page=10')
        .then((res) => res.json())
        .then((data) => setProducts(data));
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
                const brandAttr = product.attributes?.find(
                  (attr) =>
                    attr.name === 'lux_g_brand' || attr.slug === 'lux_g_brand'
                );
                const brand = brandAttr?.options?.[0] || '';
                return (
                  <SwiperSlide key={product.id}>
                    {product.images && product.images.length > 0 && (
                      <img src={product.images[0].src} alt={product.name} />
                    )}
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
      'data-loop': loop
    });
    return (
      <div {...blockProps}>
        <div className="swiper-wrapper"></div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-pagination"></div>
      </div>
    );
  }
});
