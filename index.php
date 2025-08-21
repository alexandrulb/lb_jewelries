<?php
/**
 * Plugin Name:       luxurybazaar_jewelry
 * Description:       Custom Gutenberg blocks for LuxuryBazaar.
 * Version:           0.1.2
 * Author:            ChatGPT
 * Requires at least: 6.0
 * Requires PHP:      7.4
 *
 * @package luxurybazaar_jewelry
 */

if ( ! defined( 'ABSPATH' ) ) { exit; }

define( 'LBJ_VERSION', '0.1.2' );
define( 'LBJ_DIR', plugin_dir_path( __FILE__ ) );
define( 'LBJ_URL', plugin_dir_url( __FILE__ ) );

/**
 * Registers the blocks using the compiled block.json from /build.
 */
function lb_jewelry_register_blocks() {
    register_block_type( __DIR__ . '/build/blocks/hero' );
    register_block_type( __DIR__ . '/build/blocks/carousel' );
    register_block_type( __DIR__ . '/build/blocks/brand-spotlight' );
    register_block_type( __DIR__ . '/build/blocks/image-banner' );
}
add_action( 'init', 'lb_jewelry_register_blocks' );

/**
 * Simple REST endpoint for logging debug messages.
 */
function lbj_debug_log( WP_REST_Request $request ) {
    $message   = $request->get_param( 'message' );
    $timestamp = current_time( 'mysql' );
    $line      = '[' . $timestamp . '] ' . $message . PHP_EOL;
    $file      = '/var/www/debug.log';
    file_put_contents( $file, $line, FILE_APPEND );
    return rest_ensure_response( array( 'logged' => true ) );
}

add_action( 'rest_api_init', function() {
    register_rest_route( 'lb-jewelry/v1', '/log', array(
        'methods'             => 'POST',
        'callback'            => 'lbj_debug_log',
        'permission_callback' => '__return_true',
    ) );
} );
