import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MediaUpload, RichText, InspectorControls, URLInputButton } from '@wordpress/block-editor';
import { Button, PanelBody, ToggleControl, RangeControl } from '@wordpress/components';
import './editor.css';
import './style.css';

const SlideEditor = ({ slide, onChange, onRemove }) => {
  const RightContent = () => (
    <div className="bs-right">
      <RichText
        tagName="div"
        placeholder={__('Eyebrow (e.g., SHOP BY BRAND)', 'brand-spotlight')}
        value={slide.eyebrow}
        onChange={(val) => onChange({ ...slide, eyebrow: val })}
        className="bs-eyebrow"
      />
      <RichText
        tagName="h2"
        placeholder={__('Brand name', 'brand-spotlight')}
        value={slide.brand}
        onChange={(val) => onChange({ ...slide, brand: val })}
        className="bs-brand"
      />
      <RichText
        tagName="p"
        placeholder={__('Description', 'brand-spotlight')}
        value={slide.description}
        onChange={(val) => onChange({ ...slide, description: val })}
        className="bs-desc"
      />
      {(slide.showPrimary !== false || slide.showSecondary !== false) && (
        <div className="bs-buttons">
          {slide.showPrimary !== false && (
            <div>
              <RichText
                tagName="span"
                placeholder={__('Primary CTA', 'brand-spotlight')}
                value={slide.primaryText}
                onChange={(val) => onChange({ ...slide, primaryText: val })}
                className="bs-btn-label"
              />
              <URLInputButton
                url={slide.primaryUrl}
                onChange={(url) => onChange({ ...slide, primaryUrl: url })}
                label={__('Link', 'brand-spotlight')}
              />
            </div>
          )}
          {slide.showSecondary !== false && (
            <div>
              <RichText
                tagName="span"
                placeholder={__('Secondary CTA', 'brand-spotlight')}
                value={slide.secondaryText}
                onChange={(val) => onChange({ ...slide, secondaryText: val })}
                className="bs-btn-label"
              />
              <URLInputButton
                url={slide.secondaryUrl}
                onChange={(url) => onChange({ ...slide, secondaryUrl: url })}
                label={__('Link', 'brand-spotlight')}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="bs-slide-editor">
      <div className="bs-slide-grid">
        {slide.imageRight ? (
          <>
            <RightContent />
            <div className="bs-left img">
              <MediaUpload
                onSelect={(media) => onChange({ ...slide, imageUrl: media.url, imageId: media.id })}
                allowedTypes={['image']}
                render={({ open }) => (
                  <Button variant="secondary" onClick={open}>
                    {slide.imageUrl ? __('Change Image', 'brand-spotlight') : __('Choose Image', 'brand-spotlight')}
                  </Button>
                )}
              />
              {slide.imageUrl && <img src={slide.imageUrl} alt="" />}
            </div>
          </>
        ) : (
          <>
            <div className="bs-left img">
              <MediaUpload
                onSelect={(media) => onChange({ ...slide, imageUrl: media.url, imageId: media.id })}
                allowedTypes={['image']}
                render={({ open }) => (
                  <Button variant="secondary" onClick={open}>
                    {slide.imageUrl ? __('Change Image', 'brand-spotlight') : __('Choose Image', 'brand-spotlight')}
                  </Button>
                )}
              />
              {slide.imageUrl && <img src={slide.imageUrl} alt="" />}
            </div>
            <RightContent />
          </>
        )}
      </div>
      <ToggleControl
        label={__('Image on right', 'brand-spotlight')}
        checked={!!slide.imageRight}
        onChange={(val) => onChange({ ...slide, imageRight: val })}
      />
      <ToggleControl
        label={__('Show primary button', 'brand-spotlight')}
        checked={slide.showPrimary !== false}
        onChange={(val) => onChange({ ...slide, showPrimary: val })}
      />
      <ToggleControl
        label={__('Show secondary button', 'brand-spotlight')}
        checked={slide.showSecondary !== false}
        onChange={(val) => onChange({ ...slide, showSecondary: val })}
      />
      <div className="bs-slide-actions">
        <Button variant="secondary" onClick={onRemove}>{__('Remove slide', 'brand-spotlight')}</Button>
      </div>
    </div>
  );
};

const Edit = (props) => {
  const { attributes, setAttributes, className } = props;
  const { slides = [], autoplay, autoplayDelay, showDots } = attributes;

  const addSlide = () => {
    setAttributes({
      slides: [
        ...slides,
        { imageUrl: '', imageId: 0, eyebrow: 'SHOP BY BRAND', brand: 'Brand', description: '', primaryText: 'Shop now', primaryUrl: '#', secondaryText: 'See all', secondaryUrl: '#', imageRight: false, showPrimary: true, showSecondary: true }
      ]
    });
  };
  const updateSlide = (index, next) => {
    const nextSlides = [...slides];
    nextSlides[index] = next;
    setAttributes({ slides: nextSlides });
  };
  const removeSlide = (index) => {
    const nextSlides = slides.filter((_, i) => i !== index);
    setAttributes({ slides: nextSlides });
  };

  return (
    <>
      <InspectorControls>
        <PanelBody title={__('Carousel settings', 'brand-spotlight')}>
          <ToggleControl
            label={__('Autoplay', 'brand-spotlight')}
            checked={autoplay}
            onChange={(val) => setAttributes({ autoplay: val })}
          />
          <RangeControl
            label={__('Autoplay Delay (ms)', 'brand-spotlight')}
            min={2000}
            max={15000}
            step={500}
            value={autoplayDelay}
            onChange={(val) => setAttributes({ autoplayDelay: val })}
          />
          <ToggleControl
            label={__('Show dots', 'brand-spotlight')}
            checked={showDots}
            onChange={(val) => setAttributes({ showDots: val })}
          />
        </PanelBody>
      </InspectorControls>
      <div className={className + ' bs-editor-wrap'}>
        {slides.length === 0 && (
          <div className="bs-empty">
            <p>{__('No slides yet.', 'brand-spotlight')}</p>
            <Button variant="primary" onClick={addSlide}>{__('Add slide', 'brand-spotlight')}</Button>
          </div>
        )}
        {slides.map((slide, index) => (
          <SlideEditor
            key={index}
            slide={slide}
            onChange={(next) => updateSlide(index, next)}
            onRemove={() => removeSlide(index)}
          />
        ))}
        {slides.length > 0 && (
          <div className="bs-add-more">
            <Button variant="primary" onClick={addSlide}>{__('Add another slide', 'brand-spotlight')}</Button>
          </div>
        )}
      </div>
    </>
  );
};

const save = ({ attributes }) => {
  const { slides = [], autoplay, autoplayDelay, showDots } = attributes;
  return (
    <div
      className="bs-carousel"
      data-autoplay={autoplay ? 'true' : 'false'}
      data-delay={String(autoplayDelay || 5000)}
      data-dots={showDots ? 'true' : 'false'}
    >
      {slides.map((slide, index) => {
        const hasPrimary = slide.showPrimary !== false && slide.primaryText && slide.primaryUrl;
        const hasSecondary = slide.showSecondary !== false && slide.secondaryText && slide.secondaryUrl;
        const RightInner = (
          <div className="bs-inner">
            {slide.eyebrow && <div className="bs-eyebrow">{slide.eyebrow}</div>}
            {slide.brand && <h2 className="bs-brand">{slide.brand}</h2>}
            {slide.description && <p className="bs-desc">{slide.description}</p>}
            {(hasPrimary || hasSecondary) && (
              <div className="bs-buttons">
                {hasPrimary && (
                  <a className="bs-btn bs-btn--primary" href={slide.primaryUrl}>
                    <span>{slide.primaryText}</span>
                  </a>
                )}
                {hasSecondary && (
                  <a className="bs-btn bs-btn--secondary" href={slide.secondaryUrl}>
                    <span>{slide.secondaryText}</span>
                  </a>
                )}
              </div>
            )}
            {showDots && (
              <div className="bs-dots" role="tablist" aria-label="Carousel Pagination">
                {slides.map((_, i) => (
                  <button key={i} className="bs-dot" data-index={i} role="tab" aria-selected={i===0?'true':'false'} aria-controls={`bs-slide-${i}`} />
                ))}
              </div>
            )}
          </div>
        );
        return (
          <section className="bs-slide" key={index} aria-roledescription="slide">
            <div className="bs-grid">
              {slide.imageRight ? (
                <>
                  <div className="bs-right">{RightInner}</div>
                  <div className="bs-left">
                    {slide.imageUrl && <img src={slide.imageUrl} alt="" />}
                  </div>
                </>
              ) : (
                <>
                  <div className="bs-left">
                    {slide.imageUrl && <img src={slide.imageUrl} alt="" />}
                  </div>
                  <div className="bs-right">{RightInner}</div>
                </>
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
};
registerBlockType('lbj/brand-spotlight', {
  edit: Edit,
  save,
  attributes: {
    slides: { type: 'array', default: [] },
    autoplay: { type: 'boolean', default: true },
    autoplayDelay: { type: 'number', default: 5000 },
    showDots: { type: 'boolean', default: true }
  }
});
