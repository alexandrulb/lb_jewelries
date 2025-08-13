import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, RichText, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';
import './style.css';

registerBlockType('lb-jewelry/carousel', {
  edit: ({ attributes, setAttributes }) => {
    const { title, productsToShow } = attributes;
    const blockProps = useBlockProps({ className: 'lbj-product-carousel' });
    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Carousel Settings', 'luxurybazaar_jewelry')} initialOpen={true}>
            <RangeControl
              label={__('Number of products', 'luxurybazaar_jewelry')}
              value={productsToShow}
              onChange={(v) => setAttributes({ productsToShow: v })}
              min={1}
              max={12}
            />
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <RichText
            tagName="h2"
            className="lbj-carousel__title"
            value={title}
            onChange={(v) => setAttributes({ title: v })}
            placeholder={__('Add title…', 'luxurybazaar_jewelry')}
          />
          <ServerSideRender
            block="lb-jewelry/carousel"
            attributes={{ ...attributes, preview: true }}
          />
        </div>
      </>
    );
  },
  save: () => null,
});
