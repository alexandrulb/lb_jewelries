import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck, RichText, useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import './style.css';

registerBlockType('lb-jewelry/carousel', {
  edit: ({ attributes, setAttributes }) => {
    const { slides = [] } = attributes;
    const blockProps = useBlockProps({ className: 'wpgcb-carousel' });

    const addSlide = (media) => {
      const next = [ ...slides, { url: media.url, alt: media.alt || '', caption: '' } ];
      setAttributes({ slides: next });
    };

    const updateCaption = (i, caption) => {
      const next = slides.map((s, idx) => idx === i ? { ...s, caption } : s);
      setAttributes({ slides: next });
    };

    const removeSlide = (i) => {
      const next = slides.filter((_, idx) => idx !== i);
      setAttributes({ slides: next });
    };

    return (
      <div {...blockProps}>
        <div className="wpgcb-carousel__controls">
          <MediaUploadCheck>
            <MediaUpload
              onSelect={addSlide}
              allowedTypes={['image']}
              multiple={false}
              render={({ open }) => (
                <Button variant="primary" onClick={open}>
                  {__('Add image', 'luxurybazaar_jewelry')}
                </Button>
              )}
            />
          </MediaUploadCheck>
        </div>
        <div className="wpgcb-carousel__editor-list">
          {slides.length === 0 && <p>{__('No slides yet. Use “Add image”.', 'luxurybazaar_jewelry')}</p>}
          {slides.map((s, i) => (
            <div key={i} className="wpgcb-carousel__editor-item">
              <img src={s.url} alt={s.alt || ''} />
              <RichText
                tagName="p"
                className="wpgcb-carousel__caption"
                value={s.caption}
                onChange={(v) => updateCaption(i, v)}
                placeholder={__('Add caption…', 'luxurybazaar_jewelry')}
              />
              <Button variant="secondary" onClick={() => removeSlide(i)}>{__('Remove', 'luxurybazaar_jewelry')}</Button>
            </div>
          ))}
        </div>
      </div>
    );
  },
  save: ({ attributes }) => {
    const { slides = [] } = attributes;
    const blockProps = useBlockProps.save({ className: 'wpgcb-carousel lbj-carousel' });
    return (
      <div {...blockProps}>
        <div className="swiper">
          <div className="swiper-wrapper">
            {slides.map((s, i) => (
              <div key={i} className="swiper-slide">
                <img src={s.url} alt={s.alt || ''} />
                {s.caption && <p className="wpgcb-carousel__caption">{s.caption}</p>}
              </div>
            ))}
          </div>
          <div className="swiper-pagination"></div>
          <div className="swiper-button-prev"></div>
          <div className="swiper-button-next"></div>
        </div>
      </div>
    );
  }
});
