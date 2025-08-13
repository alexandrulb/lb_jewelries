import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText, URLInputButton, useBlockProps } from '@wordpress/block-editor';
import './style.css';

registerBlockType('lb-jewelry/cta', {
  edit: ({ attributes, setAttributes }) => {
    const { heading, text, buttonLabel, buttonURL } = attributes;
    const blockProps = useBlockProps({ className: 'wpgcb-cta' });

    return (
      <div {...blockProps}>
        <RichText
          tagName="h3"
          className="wpgcb-cta__heading"
          value={heading}
          onChange={(v) => setAttributes({ heading: v })}
          placeholder={__('Add heading…', 'luxurybazaar_jewelry')}
        />
        <RichText
          tagName="p"
          className="wpgcb-cta__text"
          value={text}
          onChange={(v) => setAttributes({ text: v })}
          placeholder={__('Add text…', 'luxurybazaar_jewelry')}
        />
        <div className="wpgcb-cta__actions">
          <RichText
            tagName="a"
            className="wpgcb-cta__button"
            value={buttonLabel}
            onChange={(v) => setAttributes({ buttonLabel: v })}
            placeholder={__('Button label…', 'luxurybazaar_jewelry')}
            href={buttonURL}
          />
          <URLInputButton
            url={buttonURL}
            onChange={(url) => setAttributes({ buttonURL: url })}
          />
        </div>
      </div>
    );
  },
  save: ({ attributes }) => {
    const { heading, text, buttonLabel, buttonURL } = attributes;
    const blockProps = useBlockProps.save({ className: 'wpgcb-cta' });
    return (
      <div {...blockProps}>
        <RichText.Content tagName="h3" className="wpgcb-cta__heading" value={heading} />
        <RichText.Content tagName="p" className="wpgcb-cta__text" value={text} />
        <div className="wpgcb-cta__actions">
          <a className="wpgcb-cta__button" href={buttonURL}>
            <RichText.Content value={buttonLabel} />
          </a>
        </div>
      </div>
    );
  }
});
