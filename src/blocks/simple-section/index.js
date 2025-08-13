import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { InspectorControls, InnerBlocks, useBlockProps } from '@wordpress/block-editor';
import { PanelBody, ToggleControl, RangeControl } from '@wordpress/components';
import './style.css';
import './editor.css';

registerBlockType('lb_jewelry/simple-section', {
  edit: ({ attributes, setAttributes }) => {
    const { contained, maxWidth } = attributes;
    const blockProps = useBlockProps({
      className: 'lb_jewelry-section ' + (contained ? 'lb_jewelry-section--contained' : 'lb_jewelry-section--full'),
      style: contained ? { maxWidth: maxWidth + 'px' } : {}
    });

    return (
      <>
        <InspectorControls>
          <PanelBody title={__('Layout', 'lb_jewelry')} initialOpen={true}>
            <ToggleControl
              label={__('Contained width', 'lb_jewelry')}
              checked={contained}
              onChange={(val) => setAttributes({ contained: val })}
            />
            {contained && (
              <RangeControl
                label={__('Max width (px)', 'lb_jewelry')}
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
      className: 'lb_jewelry-section ' + (contained ? 'lb_jewelry-section--contained' : 'lb_jewelry-section--full'),
      style: contained ? { maxWidth: maxWidth + 'px' } : {}
    });
    return (
      <div {...blockProps}>
        <InnerBlocks.Content />
      </div>
    );
  }
});
