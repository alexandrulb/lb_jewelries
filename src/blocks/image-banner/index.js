import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, MediaUpload, RichText, URLInputButton, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, Button } from '@wordpress/components';
import './style.css';
import './editor.css';

registerBlockType('lb-jewelry/image-banner', {
  edit: ({ attributes, setAttributes }) => {
    const { title, subtitle, buttonText, buttonURL, imageURL } = attributes;
    const blockProps = useBlockProps({ className: 'wpgcb-image-banner' });

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Background Image', 'luxurybazaar_jewelry')} initialOpen={true}>
            <MediaUpload
              onSelect={(media) => setAttributes({ imageURL: media.url })}
              allowedTypes={['image']}
              render={({ open }) => (
                <Button variant="primary" onClick={open}>
                  { imageURL ? __('Change image', 'luxurybazaar_jewelry') : __('Choose image', 'luxurybazaar_jewelry') }
                </Button>
              )}
            />
          </PanelBody>
          <PanelBody title={__('Button Link', 'luxurybazaar_jewelry')} initialOpen={false}>
            <URLInputButton
              url={buttonURL}
              onChange={(url) => setAttributes({ buttonURL: url })}
            />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          {imageURL && <img className="wpgcb-image-banner__img" src={imageURL} alt="" />}
          <div className="wpgcb-image-banner__box">
            <RichText
              tagName="h2"
              className="wpgcb-image-banner__title"
              value={title}
              onChange={(v) => setAttributes({ title: v })}
              placeholder={__('Add title…', 'luxurybazaar_jewelry')}
            />
            <RichText
              tagName="p"
              className="wpgcb-image-banner__subtitle"
              value={subtitle}
              onChange={(v) => setAttributes({ subtitle: v })}
              placeholder={__('Add subtitle…', 'luxurybazaar_jewelry')}
            />
            <RichText
              tagName="a"
              className="wpgcb-image-banner__button"
              value={buttonText}
              onChange={(v) => setAttributes({ buttonText: v })}
              placeholder={__('Add button text…', 'luxurybazaar_jewelry')}
              href={buttonURL}
            />
          </div>
        </div>
      </>
    );
  },
  save: ({ attributes }) => {
    const { title, subtitle, buttonText, buttonURL, imageURL } = attributes;
    const blockProps = useBlockProps.save({ className: 'wpgcb-image-banner' });

    return (
      <div {...blockProps}>
        {imageURL && <img className="wpgcb-image-banner__img" src={imageURL} alt="" />}
        <div className="wpgcb-image-banner__box">
          <RichText.Content tagName="h2" className="wpgcb-image-banner__title" value={title} />
          <RichText.Content tagName="p" className="wpgcb-image-banner__subtitle" value={subtitle} />
          {buttonText && (
            <RichText.Content tagName="a" className="wpgcb-image-banner__button" href={buttonURL} value={buttonText} />
          )}
        </div>
      </div>
    );
  }
});
