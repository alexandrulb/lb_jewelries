import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck, RichText, useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import metadata from './block.json';
import './style.css';

registerBlockType(metadata, {
  edit: ({ attributes, setAttributes }) => {
    const { slides = [] } = attributes;
    const blockProps = useBlockProps({ className: 'lb_jewelry-carousel' });

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
        <div className="lb_jewelry-carousel__controls">
          <MediaUploadCheck>
            <MediaUpload
              onSelect={addSlide}
              allowedTypes={['image']}
              multiple={false}
              render={({ open }) => (
                <Button variant="primary" onClick={open}>
                  {__('Add image', 'lb_jewelry')}
                </Button>
              )}
            />
          </MediaUploadCheck>
        </div>
        <div className="lb_jewelry-carousel__editor-list">
          {slides.length === 0 && <p>{__('No slides yet. Use “Add image”.', 'lb_jewelry')}</p>}
          {slides.map((s, i) => (
            <div key={i} className="lb_jewelry-carousel__editor-item">
              <img src={s.url} alt={s.alt || ''} />
              <RichText
                tagName="p"
                className="lb_jewelry-carousel__caption"
                value={s.caption}
                onChange={(v) => updateCaption(i, v)}
                placeholder={__('Add caption…', 'lb_jewelry')}
              />
              <Button variant="secondary" onClick={() => removeSlide(i)}>{__('Remove', 'lb_jewelry')}</Button>
            </div>
          ))}
        </div>
      </div>
    );
  },
  save: ({ attributes }) => {
    const { slides = [] } = attributes;
    const blockProps = useBlockProps.save({ className: 'lb_jewelry-carousel' });
    return (
      <div {...blockProps}>
        <div className="swiper">
          <div className="swiper-wrapper">
            {slides.map((s, i) => (
              <div key={i} className="swiper-slide">
                <img src={s.url} alt={s.alt || ''} />
                {s.caption && <p className="lb_jewelry-carousel__caption">{s.caption}</p>}
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
