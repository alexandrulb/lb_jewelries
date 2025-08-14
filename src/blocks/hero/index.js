import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, RichText, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, Button } from '@wordpress/components';
import { useEffect } from '@wordpress/element';
import { Swiper, SwiperSlide } from 'swiper/react';
import { EffectFade, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import './style.css';
import './editor.css';

registerBlockType('lb-jewelry/hero', {
  edit: ({ attributes, setAttributes }) => {
    const {
      title,
      subtitle,
      coverURLs = [],
      coverURL,
      overlayOpacity,
    } = attributes;
    const blockProps = useBlockProps({ className: 'wpgcb-hero' });

    useEffect(() => {
      if (!coverURLs.length && coverURL) {
        setAttributes({ coverURLs: [coverURL], coverURL: undefined });
      }
    }, [coverURL, coverURLs, setAttributes]);

    const images = coverURLs.length ? coverURLs : coverURL ? [coverURL] : [];

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Hero Images', 'luxurybazaar_jewelry')} initialOpen={true}>
            <MediaUpload
              onSelect={(media) =>
                setAttributes({
                  coverURLs: media.map((m) => m.url),
                  coverURL: undefined,
                })
              }
              allowedTypes={['image']}
              multiple
              gallery
              render={({ open }) => (
                <Button variant="primary" onClick={open}>
                  {coverURLs.length
                    ? __('Edit images', 'luxurybazaar_jewelry')
                    : __('Choose images', 'luxurybazaar_jewelry')}
                </Button>
              )}
            />
            <RangeControl
              label={__('Overlay opacity', 'luxurybazaar_jewelry')}
              value={overlayOpacity}
              onChange={(v) => setAttributes({ overlayOpacity: v })}
              min={0}
              max={0.8}
              step={0.05}
            />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          {images.length > 0 && (
            <Swiper
              modules={[EffectFade, Autoplay]}
              effect="fade"
              slidesPerView={1}
              allowTouchMove={false}
              autoplay={{ delay: 4000 }}
              loop
              className="wpgcb-hero__slider"
            >
              {images.map((url, index) => (
                <SwiperSlide key={index}>
                  <img
                    className={`wpgcb-hero__cover${index === 0 ? ' wpgcb-hero__cover--first' : ''}`}
                    src={url}
                    alt=""
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          )}
          <div className="wpgcb-hero__overlay" style={{ opacity: overlayOpacity }} />
          <div className="wpgcb-hero__rect wpgcb-hero__rect--left" />
          <div className="wpgcb-hero__rect wpgcb-hero__rect--right" />
          <div className="wpgcb-hero__content">
            <RichText
              tagName="h1"
              className="wpgcb-hero__title"
              value={title}
              onChange={(v) => setAttributes({ title: v })}
              placeholder={__('Add title…', 'luxurybazaar_jewelry')}
            />
            <RichText
              tagName="p"
              className="wpgcb-hero__subtitle"
              value={subtitle}
              onChange={(v) => setAttributes({ subtitle: v })}
              placeholder={__('Add subtitle…', 'luxurybazaar_jewelry')}
            />
          </div>
        </div>
      </>
    );
  },
  save: ({ attributes }) => {
    const { title, subtitle, coverURLs = [], overlayOpacity } = attributes;
    const blockProps = useBlockProps.save({ className: 'wpgcb-hero' });
    return (
      <div {...blockProps}>
        {coverURLs.length > 0 && (
          <div className="wpgcb-hero__slider swiper">
            <div className="swiper-wrapper">
              {coverURLs.map((url, index) => (
                <div className="swiper-slide" key={index}>
                  <img
                    className={`wpgcb-hero__cover${index === 0 ? ' wpgcb-hero__cover--first' : ''}`}
                    src={url}
                    alt=""
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="wpgcb-hero__overlay" style={{ opacity: overlayOpacity }} />
        <div className="wpgcb-hero__rect wpgcb-hero__rect--left" />
        <div className="wpgcb-hero__rect wpgcb-hero__rect--right" />
        <div className="wpgcb-hero__content">
          <RichText.Content tagName="h1" className="wpgcb-hero__title" value={title} />
          <RichText.Content tagName="p" className="wpgcb-hero__subtitle" value={subtitle} />
        </div>
      </div>
    );
  }
});