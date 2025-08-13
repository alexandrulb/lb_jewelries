import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { RichText, URLInputButton, useBlockProps } from '@wordpress/block-editor';
import './style.css';

registerBlockType('lb_jewelry/cta', {
  edit: ({ attributes, setAttributes }) => {
    const { heading, text, buttonLabel, buttonURL } = attributes;
    const blockProps = useBlockProps({ className: 'lb_jewelry-cta' });

    return (
      <div {...blockProps}>
        <RichText
          tagName="h3"
          className="lb_jewelry-cta__heading"
          value={heading}
          onChange={(v) => setAttributes({ heading: v })}
          placeholder={__('Add heading…', 'lb_jewelry')}
        />
        <RichText
          tagName="p"
          className="lb_jewelry-cta__text"
          value={text}
          onChange={(v) => setAttributes({ text: v })}
          placeholder={__('Add text…', 'lb_jewelry')}
        />
        <div className="lb_jewelry-cta__actions">
          <RichText
            tagName="a"
            className="lb_jewelry-cta__button"
            value={buttonLabel}
            onChange={(v) => setAttributes({ buttonLabel: v })}
            placeholder={__('Button label…', 'lb_jewelry')}
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
    const blockProps = useBlockProps.save({ className: 'lb_jewelry-cta' });
    return (
      <div {...blockProps}>
        <RichText.Content tagName="h3" className="lb_jewelry-cta__heading" value={heading} />
        <RichText.Content tagName="p" className="lb_jewelry-cta__text" value={text} />
        <div className="lb_jewelry-cta__actions">
          <a className="lb_jewelry-cta__button" href={buttonURL}>
            <RichText.Content value={buttonLabel} />
          </a>
        </div>
      </div>
    );
  }
});
