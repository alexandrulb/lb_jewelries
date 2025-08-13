import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, RichText, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl, Button } from '@wordpress/components';
import metadata from './block.json';
import './style.css';
import './editor.css';

registerBlockType(metadata, {
  edit: ({ attributes, setAttributes }) => {
    const { title, subtitle, mediaURL, overlayOpacity, minHeight } = attributes;
    const blockProps = useBlockProps({ className: 'lb_jewelry-hero' });

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Background', 'lb_jewelry')} initialOpen={true}>
            <MediaUpload
              onSelect={(media) => setAttributes({ mediaURL: media.url })}
              allowedTypes={['image']}
              render={({ open }) => (
                <Button variant="primary" onClick={open}>
                  { mediaURL ? __('Change image', 'lb_jewelry') : __('Choose image', 'lb_jewelry') }
                </Button>
              )}
            />
            <RangeControl
              label={__('Overlay opacity', 'lb_jewelry')}
              value={overlayOpacity}
              onChange={(v) => setAttributes({ overlayOpacity: v })}
              min={0}
              max={0.8}
              step={0.05}
            />
            <RangeControl
              label={__('Minimum height (px)', 'lb_jewelry')}
              value={minHeight}
              onChange={(v) => setAttributes({ minHeight: v })}
              min={280}
              max={800}
              step={10}
            />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps} style={{ minHeight: minHeight + 'px' }}>
          {mediaURL && <div className="lb_jewelry-hero__bg" style={{ backgroundImage: `url(${mediaURL})` }} />}
          <div className="lb_jewelry-hero__overlay" style={{ opacity: overlayOpacity }} />
          <div className="lb_jewelry-hero__content">
            <RichText
              tagName="h1"
              className="lb_jewelry-hero__title"
              value={title}
              onChange={(v) => setAttributes({ title: v })}
              placeholder={__('Add title…', 'lb_jewelry')}
            />
            <RichText
              tagName="p"
              className="lb_jewelry-hero__subtitle"
              value={subtitle}
              onChange={(v) => setAttributes({ subtitle: v })}
              placeholder={__('Add subtitle…', 'lb_jewelry')}
            />
          </div>
        </div>
      </>
    );
  },
  save: ({ attributes }) => {
    const { title, subtitle, mediaURL, overlayOpacity, minHeight } = attributes;
    const blockProps = useBlockProps.save({ className: 'lb_jewelry-hero', style: { minHeight: minHeight + 'px' } });
    return (
      <div {...blockProps}>
        {mediaURL && <div className="lb_jewelry-hero__bg" style={{ backgroundImage: `url(${mediaURL})` }} />}
        <div className="lb_jewelry-hero__overlay" style={{ opacity: overlayOpacity }} />
        <div className="lb_jewelry-hero__content">
          <RichText.Content tagName="h1" className="lb_jewelry-hero__title" value={title} />
          <RichText.Content tagName="p" className="lb_jewelry-hero__subtitle" value={subtitle} />
        </div>
      </div>
    );
  }
});
