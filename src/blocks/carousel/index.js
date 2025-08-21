import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import {
  useBlockProps,
  InspectorControls,
  RichText,
  MediaUpload,
  MediaUploadCheck,
} from '@wordpress/block-editor';
import {
  PanelBody,
  ToggleControl,
  SelectControl,
  TextControl,
  Button,
  BaseControl,
  Flex,
  FlexBlock,
} from '@wordpress/components';
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

// Send debug logs to server
function log(message) {
  try {
    fetch('/wp-json/lb-jewelry/v1/log', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    });
  } catch (e) {
    // fail silently
  }
}

async function fetchStoreJSON(url) {
  log(`[fetch] ${url}`);
  const res = await fetch(url, { credentials: 'same-origin' });
  const ct = res.headers.get('content-type') || '';
  const body = await res.text();
  log(`[fetch] status=${res.status} ct=${ct} body[0..120]=${body.slice(0,120)}`);

  if (!res.ok) throw new Error(`HTTP ${res.status} ${res.statusText}`);
  if (!ct.includes('application/json')) throw new Error('Non-JSON response');

  try { return JSON.parse(body); }
  catch (e) { throw new Error(`JSON parse error: ${e?.message || e}`); }
}

function buildLatestUrl({ perPage = 10 } = {}) {
  const u = new URL('/wp-json/wc/store/v1/products', window.location.origin);
  u.searchParams.set('per_page', String(perPage));
  u.searchParams.set('orderby', 'date');
  u.searchParams.set('order', 'desc');
  return u.toString();
}

function buildAttributeUrl({ perPage = 10 } = {}) {
  const u = new URL('/wp-json/wc/store/v1/products', window.location.origin);
  u.searchParams.set('per_page', String(perPage));
  u.searchParams.set('attributes[0][attribute]', 'pa_product_type');
  u.searchParams.set('attributes[0][slug]', 'jewelry');
  return u.toString();
}

registerBlockType('lb-jewelry/carousel', {
  edit: ({ attributes, setAttributes }) => {
    const {
      autoplay = false,
      loop = false,
      mode = 'latest',
      heading = '',
      slides = [],
    } = attributes;
    const blockProps = useBlockProps();
    const [products, setProducts] = useState([]);

    useEffect(() => {
      if (mode !== 'latest') return;

      const tryLoad = async () => {
        try {
          const data = await fetchStoreJSON(buildAttributeUrl({ perPage: 10 }));
          if (Array.isArray(data)) { setProducts(data); return; }
        } catch (e) {
          log(`Editor carousel: attribute query failed -> ${e.message}`);
        }
        try {
          const data = await fetchStoreJSON(buildLatestUrl({ perPage: 10 }));
          setProducts(Array.isArray(data) ? data : []);
        } catch (e) {
          log(`Editor carousel: latest fallback failed -> ${e.message}`);
          setProducts([]);
        }
      };

      tryLoad();
    }, [mode]);

    const addSlide = () =>
      setAttributes({
        slides: [...slides, { image: '', hoverImage: '', url: '', title: '' }],
      });

    const updateSlide = (index, field, value) => {
      const newSlides = [...slides];
      newSlides[index] = { ...newSlides[index], [field]: value };
      setAttributes({ slides: newSlides });
    };

    const removeSlide = (index) => {
      const newSlides = slides.filter((_, i) => i !== index);
      setAttributes({ slides: newSlides });
    };

    return (
      <>
        <InspectorControls>
          <PanelBody
            title={__('Carousel Settings', 'luxurybazaar_jewelry')}
            initialOpen={true}
          >
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
            <SelectControl
              label={__('Content Source', 'luxurybazaar_jewelry')}
              value={mode}
              options={[
                {
                  label: __('Latest Jewelry', 'luxurybazaar_jewelry'),
                  value: 'latest',
                },
                {
                  label: __('Custom Slides', 'luxurybazaar_jewelry'),
                  value: 'custom',
                },
              ]}
              onChange={(value) => setAttributes({ mode: value })}
            />
          </PanelBody>
          {mode === 'custom' && (
            <PanelBody title={__('Slides', 'luxurybazaar_jewelry')} initialOpen={true}>
              {slides.map((slide, index) => (
                <div key={index} className="carousel-slide-control">
                  <Flex gap="8">
                    <FlexBlock>
                      <BaseControl label={__('Image', 'luxurybazaar_jewelry')}>
                        <MediaUploadCheck>
                          <MediaUpload
                            onSelect={(media) =>
                              updateSlide(index, 'image', media.url || '')
                            }
                            allowedTypes={['image']}
                            render={({ open }) => (
                              <Button onClick={open} isSecondary>
                                {slide.image
                                  ? __('Change', 'luxurybazaar_jewelry')
                                  : __('Select', 'luxurybazaar_jewelry')}
                              </Button>
                            )}
                          />
                        </MediaUploadCheck>
                        {slide.image && (
                          <img
                            src={slide.image}
                            alt=""
                            style={{ width: '100%', height: 'auto', marginTop: '10px' }}
                          />
                        )}
                      </BaseControl>
                    </FlexBlock>
                    <FlexBlock>
                      <BaseControl label={__('Hover Image', 'luxurybazaar_jewelry')}>
                        <MediaUploadCheck>
                          <MediaUpload
                            onSelect={(media) =>
                              updateSlide(index, 'hoverImage', media.url || '')
                            }
                            allowedTypes={['image']}
                            render={({ open }) => (
                              <Button onClick={open} isSecondary>
                                {slide.hoverImage
                                  ? __('Change', 'luxurybazaar_jewelry')
                                  : __('Select', 'luxurybazaar_jewelry')}
                              </Button>
                            )}
                          />
                        </MediaUploadCheck>
                        {slide.hoverImage && (
                          <img
                            src={slide.hoverImage}
                            alt=""
                            style={{ width: '100%', height: 'auto', marginTop: '10px' }}
                          />
                        )}
                      </BaseControl>
                    </FlexBlock>
                  </Flex>
                  <TextControl
                    label={__('Title', 'luxurybazaar_jewelry')}
                    value={slide.title}
                    onChange={(value) => updateSlide(index, 'title', value)}
                  />
                  <TextControl
                    label={__('Link URL', 'luxurybazaar_jewelry')}
                    value={slide.url}
                    onChange={(value) => updateSlide(index, 'url', value)}
                  />
                  <Button
                    isDestructive
                    onClick={() => removeSlide(index)}
                    style={{ marginTop: '10px' }}
                  >
                    {__('Remove Slide', 'luxurybazaar_jewelry')}
                  </Button>
                </div>
              ))}
              <Button onClick={addSlide} isSecondary style={{ marginTop: '10px' }}>
                {__('Add Slide', 'luxurybazaar_jewelry')}
              </Button>
            </PanelBody>
          )}
        </InspectorControls>

        <div {...blockProps}>
          <RichText
            tagName="h2"
            className="wpgcb-carousel-heading"
            value={heading}
            onChange={(value) => setAttributes({ heading: value })}
            placeholder={__('Carousel Heading...', 'luxurybazaar_jewelry')}
          />
          {mode === 'latest' ? (
            products.length ? (
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
            )
          ) : (
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
              {slides.length ? (
                slides.map((slide, index) => {
                  const imageEl = (
                    <div className="carousel-image-wrapper">
                      {slide.image && (
                        <img
                          className="main-image"
                          src={slide.image}
                          alt={slide.title || ''}
                        />
                      )}
                      {slide.hoverImage && (
                        <img
                          className="hover-image"
                          src={slide.hoverImage}
                          alt={slide.title || ''}
                        />
                      )}
                    </div>
                  );
                  return (
                    <SwiperSlide key={index}>
                      {slide.url ? (
                        <a
                          href={slide.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {imageEl}
                        </a>
                      ) : (
                        imageEl
                      )}
                      {slide.title && (
                        <div className="product-title">{slide.title}</div>
                      )}
                    </SwiperSlide>
                  );
                })
              ) : (
                <SwiperSlide>
                  {__('Add slides in settings', 'luxurybazaar_jewelry')}
                </SwiperSlide>
              )}
            </Swiper>
          )}
        </div>
      </>
    );
  },

  save: ({ attributes }) => {
    const {
      autoplay = false,
      loop = false,
      mode = 'latest',
      heading = '',
      slides = [],
    } = attributes;

    const blockProps = useBlockProps.save();

    return (
      <div {...blockProps}>
        {heading && (
          <h2 className="wpgcb-carousel-heading">{heading}</h2>
        )}
        <div
          className="wpgcb-carousel swiper"
          data-autoplay={autoplay}
          data-loop={loop}
          data-mode={mode}
        >
          <div className="swiper-wrapper">
            {mode === 'custom' &&
              slides.map((slide, index) => {
                const imageEl = (
                  <div className="carousel-image-wrapper">
                    {slide.image && (
                      <img
                        className="main-image"
                        src={slide.image}
                        alt={slide.title || ''}
                      />
                    )}
                    {slide.hoverImage && (
                      <img
                        className="hover-image"
                        src={slide.hoverImage}
                        alt={slide.title || ''}
                      />
                    )}
                  </div>
                );
                return (
                  <div className="swiper-slide" key={index}>
                    {slide.url ? <a href={slide.url}>{imageEl}</a> : imageEl}
                    {slide.title && (
                      <div className="product-title">{slide.title}</div>
                    )}
                  </div>
                );
              })}
          </div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
          <div className="swiper-pagination"></div>
        </div>
      </div>
    );
  },
});