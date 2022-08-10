<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://advisr.com.au
 * @since             1.0.0
 * @package           Advisr_Toolbox
 *
 * @wordpress-plugin
 * Plugin Name:       Advisr Toolbox
 * Description:       Connect your native data with Advisr data to create dynamic team pages and more.
 * Version:           2.5.0
 * Author:            Advisr
 * Author URI:        https://advisr.com.au
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       advisr-toolbox
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'ADVISR_TOOLBOX_VERSION', '2.5.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-advisr-toolbox-activator.php
 */
function activate_advisr_toolbox() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-advisr-toolbox-activator.php';
	Advisr_Toolbox_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-advisr-toolbox-deactivator.php
 */
function deactivate_advisr_toolbox() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-advisr-toolbox-deactivator.php';
	Advisr_Toolbox_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_advisr_toolbox' );
register_deactivation_hook( __FILE__, 'deactivate_advisr_toolbox' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-advisr-toolbox.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_advisr_toolbox() {

	$plugin = new Advisr_Toolbox();
	$plugin->run();

}
run_advisr_toolbox();
