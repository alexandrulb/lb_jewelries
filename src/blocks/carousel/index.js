import { registerBlockType } from '@wordpress/blocks';
import { __ } from '@wordpress/i18n';
import { MediaUpload, MediaUploadCheck, useBlockProps } from '@wordpress/block-editor';
import { Button } from '@wordpress/components';
import './style.css';
import './editor.css';

registerBlockType('lb-jewelry/carousel', {
  edit: ({ attributes, setAttributes }) => {
    const { images = [] } = attributes;
    const blockProps = useBlockProps({ className: 'wpgcb-carousel' });

    const onSelectImages = (newImages) => {
      setAttributes({ images: newImages.map((img) => img.url) });
    };

    return (
      <div {...blockProps}>
        <MediaUploadCheck>
          <MediaUpload
            onSelect={onSelectImages}
            allowedTypes={['image']}
            multiple
            gallery
            render={({ open }) => (
              <Button variant="primary" onClick={open}>
                { images.length ? __('Edit images', 'luxurybazaar_jewelry') : __('Add images', 'luxurybazaar_jewelry') }
              </Button>
            )}
          />
        </MediaUploadCheck>
        <div className="wpgcb-carousel__images">
          {images.map((src, index) => (
            <img src={src} className="wpgcb-carousel__image" alt="" key={index} />
          ))}
        </div>
      </div>
    );
  },
  save: ({ attributes }) => {
    const { images = [] } = attributes;
    const blockProps = useBlockProps.save({ className: 'wpgcb-carousel' });
    return (
      <div {...blockProps}>
        {images.map((src, index) => (
          <img src={src} className="wpgcb-carousel__image" alt="" key={index} />
        ))}
      </div>
    );
  }
});
