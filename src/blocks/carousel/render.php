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

    $args = array(
        'post_type'      => 'product',
        'posts_per_page' => $count,
        'orderby'        => 'date',
        'order'          => 'DESC',
        'tax_query'      => array(
            array(
                'taxonomy' => 'product_cat',
                'field'    => 'slug',
                'terms'    => array( 'jewelry' ),
            ),
        ),
    );

    $query = new WP_Query( $args );
    if ( ! $query->have_posts() ) {
        return '';
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
                    <?php
                    while ( $query->have_posts() ) :
                        $query->the_post();
                        ?>
                        <div class="swiper-slide">
                            <a href="<?php the_permalink(); ?>">
                                <?php if ( has_post_thumbnail() ) {
                                    the_post_thumbnail( 'medium' );
                                } ?>
                                <p class="wpgcb-carousel__caption"><?php the_title(); ?></p>
                            </a>
                        </div>
                        <?php
                    endwhile;
                    wp_reset_postdata();
                    ?>
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

