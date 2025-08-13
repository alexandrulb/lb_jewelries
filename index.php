<?php
/**
 * Plugin Name:       luxurybazaar_jewelry
 * Description:       Custom Gutenberg blocks (Section, Carousel, Hero, CTA) for LuxuryBazaar.
 * Version:           0.1.1
 * Author:            ChatGPT
 * Requires at least: 6.0
 * Requires PHP:      7.4
 *
 * @package luxurybazaar_jewelry
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'LBJ_VERSION', '0.1.1' );
define( 'LBJ_DIR', plugin_dir_path( __FILE__ ) );
define( 'LBJ_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registers all blocks using compiled block.json files from /build.
 */
function lb_jewelry_register_blocks() {
    register_block_type( __DIR__ . '/build/blocks/simple-section' );
    register_block_type( __DIR__ . '/build/blocks/hero' );
    register_block_type( __DIR__ . '/build/blocks/cta' );
    register_block_type( __DIR__ . '/build/blocks/carousel' );
}
add_action( 'init', 'lb_jewelry_register_blocks' );

/**
 * Front‑end only: enqueue Swiper + tiny init script for the Carousel block.
 */
function lb_jewelry_enqueue_front_assets() {
    if ( is_admin() ) return;
    if ( ! is_singular() ) return;

    global $post;
    if ( ! $post ) return;

    if ( has_block( 'lb-jewelry/carousel', $post ) ) {
        // Swiper from CDN. Swap to local if desired.
        wp_enqueue_style( 'swiper', 'https://unpkg.com/swiper@10/swiper-bundle.min.css', array(), '10.0.0' );
        wp_enqueue_script( 'swiper', 'https://unpkg.com/swiper@10/swiper-bundle.min.js', array(), '10.0.0', true );
        // Simple init (no build step required)
        wp_enqueue_script(
            'lbj-carousel-init',
            LBJ_URL . 'assets/carousel-init.js',
            array( 'swiper' ),
            LBJ_VERSION,
            true
        );
    }
}
add_action( 'wp_enqueue_scripts', 'lb_jewelry_enqueue_front_assets' );
