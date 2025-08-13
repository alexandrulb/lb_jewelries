<?php
/**
 * Render callback for product carousel block.
 *
 * @param array $attributes Block attributes.
 * @return string HTML.
 */
return function( $attributes ) {
    $title   = isset( $attributes['title'] ) ? $attributes['title'] : '';
    $count   = isset( $attributes['productsToShow'] ) ? intval( $attributes['productsToShow'] ) : 6;
    $preview = ! empty( $attributes['preview'] );

    if ( ! function_exists( 'wc_get_products' ) ) {
        return '';
    }

    $products = wc_get_products(
        array(
            'status'   => 'publish',
            'limit'    => $count,
            'orderby'  => 'date',
            'order'    => 'DESC',
            'category' => array( 'jewelry' ),
        )
    );

    if ( empty( $products ) ) {
        return $preview ? '<p>' . esc_html__( 'No jewelry products found.', 'luxurybazaar_jewelry' ) . '</p>' : '';
    }

    ob_start();
    ?>
    <div class="lbj-carousel-block">
        <?php if ( $title && ! $preview ) : ?>
            <h2 class="lbj-carousel__title"><?php echo esc_html( $title ); ?></h2>
        <?php endif; ?>
        <div class="wpgcb-carousel lbj-carousel">
            <div class="swiper">
                <div class="swiper-wrapper">
                    <?php foreach ( $products as $product ) : ?>
                        <div class="swiper-slide">
                            <a href="<?php echo esc_url( get_permalink( $product->get_id() ) ); ?>">
                                <?php echo $product->get_image( 'medium' ); ?>
                                <p class="wpgcb-carousel__caption"><?php echo esc_html( $product->get_name() ); ?></p>
                            </a>
                        </div>
                    <?php endforeach; ?>
                </div>
                <div class="swiper-pagination"></div>
                <div class="swiper-button-prev"></div>
                <div class="swiper-button-next"></div>
            </div>
        </div>
    </div>
    <?php
    return ob_get_clean();
};
