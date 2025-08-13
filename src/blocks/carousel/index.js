import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import {
  MediaUpload,
  MediaUploadCheck,
  useBlockProps,
  InspectorControls
} from '@wordpress/block-editor';
import {
  Button,
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
    const { images = [], autoplay = false, loop = false } = attributes;
    const blockProps = useBlockProps({ className: 'wpgcb-carousel' });

    const onSelectImages = (newImages) => {
      setAttributes({ images: newImages.map((img) => img.url) });
    };

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
              {images.map((src, index) => (
                <SwiperSlide key={index}>
                  <img src={src} alt="" />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </>
    );
  },
  save: ({ attributes }) => {
    const { images = [], autoplay = false, loop = false } = attributes;
    const blockProps = useBlockProps.save({
      className: 'wpgcb-carousel swiper',
      'data-autoplay': autoplay,
      'data-loop': loop
    });
    return (
      <div {...blockProps}>
        <div className="swiper-wrapper">
          {images.map((src, index) => (
            <div className="swiper-slide" key={index}>
              <img src={src} alt="" />
            </div>
          ))}
        </div>
        <div className="swiper-button-prev"></div>
        <div className="swiper-button-next"></div>
        <div className="swiper-pagination"></div>
      </div>
    );
  }
});