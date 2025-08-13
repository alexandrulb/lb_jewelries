<?php
/**
 * Plugin Name:       luxurybazaar_jewelry
 * Description:       A starter plugin providing several custom Gutenberg blocks (Section, Carousel, Hero, CTA) for custom page designs.
 * Version:           0.1.0
 * Author:            ChatGPT
 * Requires at least: 6.0
 * Requires PHP:      7.4
 *
 * @package WPGutenbergCustomBlocks
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'WPGCB_VERSION', '0.1.0' );
define( 'WPGCB_DIR', plugin_dir_path( __FILE__ ) );
define( 'WPGCB_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registers all blocks using block.json files.
 */
function lb_jewelry_register_blocks() {
    register_block_type( __DIR__ . '/build/blocks/simple-section' );
    register_block_type( __DIR__ . '/build/blocks/hero' );
    register_block_type( __DIR__ . '/build/blocks/cta' );
    register_block_type( __DIR__ . '/build/blocks/carousel' );
}
add_action( 'init', 'lb_jewelry_register_blocks' );

/**
 * Front-end only: enqueue Swiper for the Carousel block if present.
 */
function lb_jewelry_maybe_enqueue_front_assets() {
    if ( ! is_admin() ) {
        // Basic heuristic: only enqueue on singular content where blocks are rendered.
        if ( is_singular() ) {
            // Enqueue only if content has our carousel block.
            global $post;
            if ( $post && has_block( 'lb_jewelry/carousel', $post ) ) {
                // Swiper from CDN. Feel free to bundle locally if you prefer.
                wp_enqueue_style( 'swiper', 'https://unpkg.com/swiper@10/swiper-bundle.min.css', array(), '10.0.0' );
                wp_enqueue_script( 'swiper', 'https://unpkg.com/swiper@10/swiper-bundle.min.js', array(), '10.0.0', true );

                // Init script
                wp_enqueue_script(
                    'lb_jewelry-carousel-init',
                    WPGCB_URL . 'build/carousel-init.js',
                    array( 'swiper' ),
                    WPGCB_VERSION,
                    true
                );
            }
        }
    }
}
add_action( 'wp_enqueue_scripts', 'lb_jewelry_maybe_enqueue_front_assets' );
