import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
  InspectorControls,
  MediaUpload,
  MediaUploadCheck,
  useBlockProps
} from '@wordpress/block-editor';
import {
  Button,
  PanelBody,
  RangeControl,
  ToggleControl
} from '@wordpress/components';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import './style.css';
import './editor.css';

registerBlockType('lb-jewelry/carousel', {
  edit: ({ attributes, setAttributes }) => {
    const {
      images = [],
      autoplay,
      autoplayDelay,
      loop,
      showPagination,
      showNavigation
    } = attributes;
    const blockProps = useBlockProps({ className: 'wpgcb-carousel' });

    const onSelectImages = (newImages) => {
      setAttributes({ images: newImages.map((img) => img.url) });
    };

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Carousel Settings', 'luxurybazaar_jewelry')}>
            <ToggleControl
              label={__('Autoplay', 'luxurybazaar_jewelry')}
              checked={autoplay}
              onChange={(v) => setAttributes({ autoplay: v })}
            />
            {autoplay && (
              <RangeControl
                label={__('Autoplay delay (ms)', 'luxurybazaar_jewelry')}
                value={autoplayDelay}
                onChange={(v) => setAttributes({ autoplayDelay: v })}
                min={1000}
                max={10000}
                step={500}
              />
            )}
            <ToggleControl
              label={__('Loop', 'luxurybazaar_jewelry')}
              checked={loop}
              onChange={(v) => setAttributes({ loop: v })}
            />
            <ToggleControl
              label={__('Show Pagination', 'luxurybazaar_jewelry')}
              checked={showPagination}
              onChange={(v) => setAttributes({ showPagination: v })}
            />
            <ToggleControl
              label={__('Show Navigation', 'luxurybazaar_jewelry')}
              checked={showNavigation}
              onChange={(v) => setAttributes({ showNavigation: v })}
            />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <MediaUploadCheck>
            <MediaUpload
              onSelect={onSelectImages}
              allowedTypes={['image']}
              multiple
              gallery
              render={({ open }) => (
                <Button variant="primary" onClick={open}>
                  { images.length ? __('Edit images', 'luxurybazaar_jewelry') : __('Add images', 'luxurybazaar_jewelry') }
                </Button>
              )}
            />
          </MediaUploadCheck>
          {images.length > 0 && (
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              loop={loop}
              autoplay={autoplay ? { delay: autoplayDelay } : false}
              pagination={showPagination ? { clickable: true } : false}
              navigation={showNavigation}
            >
              {images.map((src, index) => (
                <SwiperSlide key={index}>
                  <img src={src} className="wpgcb-carousel__image" alt="" />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </>
    );
  },
  save: ({ attributes }) => {
    const {
      images = [],
      autoplay,
      autoplayDelay,
      loop,
      showPagination,
      showNavigation
    } = attributes;
    const blockProps = useBlockProps.save({
      className: 'wpgcb-carousel',
      'data-autoplay': autoplay ? autoplayDelay : 0,
      'data-loop': loop,
      'data-pagination': showPagination,
      'data-navigation': showNavigation
    });
    return (
      <div {...blockProps}>
        <div className="swiper">
          <div className="swiper-wrapper">
            {images.map((src, index) => (
              <div className="swiper-slide" key={index}>
                <img src={src} className="wpgcb-carousel__image" alt="" />
              </div>
            ))}
          </div>
          {showPagination && <div className="swiper-pagination" />}
          {showNavigation && (
            <>
              <div className="swiper-button-prev" />
              <div className="swiper-button-next" />
            </>
          )}
        </div>
      </div>
    );
  }
});
