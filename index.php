<?php
/**
 * Plugin Name:       luxurybazaar_jewelry
 * Description:       Custom Gutenberg Hero block for LuxuryBazaar.
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
 * Registers the Hero block using the compiled block.json from /build.
 */
function lb_jewelry_register_blocks() {
    register_block_type( __DIR__ . '/build/blocks/hero' );
}
add_action( 'init', 'lb_jewelry_register_blocks' );
