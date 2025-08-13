import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components';
import './style.css';
import './editor.css';

registerBlockType('lb-jewelry/simple-section', {
  edit: ({ attributes, setAttributes }) => {
    const { contained, maxWidth } = attributes;
    const blockProps = useBlockProps({
      className: 'wpgcb-section ' + (contained ? 'wpgcb-section--contained' : 'wpgcb-section--full'),
      style: contained ? { maxWidth: maxWidth + 'px' } : {}
    });

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Layout', 'luxurybazaar_jewelry')} initialOpen={true}>
            <ToggleControl
              label={__('Contained width', 'luxurybazaar_jewelry')}
              checked={contained}
              onChange={(val) => setAttributes({ contained: val })}
            />
            {contained && (
              <RangeControl
                label={__('Max width (px)', 'luxurybazaar_jewelry')}
                value={maxWidth}
                onChange={(val) => setAttributes({ maxWidth: val })}
                min={600}
                max={1600}
              />
            )}
          </PanelBody>
        </InspectorControls>
        <div {...blockProps}>
          <InnerBlocks />
        </div>
      </>
    );
  },
  save: ({ attributes }) => {
    const { contained, maxWidth } = attributes;
    const blockProps = useBlockProps.save({
      className: 'wpgcb-section ' + (contained ? 'wpgcb-section--contained' : 'wpgcb-section--full'),
      style: contained ? { maxWidth: maxWidth + 'px' } : {}
    });
    return (
      <div {...blockProps}>
        <InnerBlocks.Content />
      </div>
    );
  }
});
