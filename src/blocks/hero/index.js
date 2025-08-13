import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, RichText, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, Button } from '@wordpress/components';
import './style.css';
import './editor.css';

registerBlockType('lb-jewelry/hero', {
  edit: ({ attributes, setAttributes }) => {
    const { title, subtitle, coverURL, overlayOpacity, minHeight } = attributes;
    const blockProps = useBlockProps({ className: 'wpgcb-hero' });

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Cover Image', 'luxurybazaar_jewelry')} initialOpen={true}>
            <MediaUpload
              onSelect={(media) => setAttributes({ coverURL: media.url })}
              allowedTypes={['image']}
              render={({ open }) => (
                <Button variant="primary" onClick={open}>
                  { coverURL ? __('Change cover', 'luxurybazaar_jewelry') : __('Choose cover', 'luxurybazaar_jewelry') }
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
            <RangeControl
              label={__('Minimum height (px)', 'luxurybazaar_jewelry')}
              value={minHeight}
              onChange={(v) => setAttributes({ minHeight: v })}
              min={280}
              max={800}
              step={10}
            />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps} style={{ minHeight: minHeight + 'px' }}>
          {coverURL && <img className="wpgcb-hero__cover" src={coverURL} alt="" />}
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
    const { title, subtitle, coverURL, overlayOpacity, minHeight } = attributes;
    const blockProps = useBlockProps.save({ className: 'wpgcb-hero', style: { minHeight: minHeight + 'px' } });
    return (
      <div {...blockProps}>
        {coverURL && <img className="wpgcb-hero__cover" src={coverURL} alt="" />}
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
