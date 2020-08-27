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
 * @package           Advisr_Team_Pages
 *
 * @wordpress-plugin
 * Plugin Name:       Advisr Team Pages
 * Plugin URI:        https://advisr.com.au
 * Description:       Create and configure your company's team members.
 * Version:           1.0.0
 * Author:            Advisr.com.au
 * Author URI:        https://advisr.com.au
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       advisr-team-pages
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
define( 'ADVISR_TEAM_PAGES_VERSION', '1.0.0' );

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-advisr-team-pages-activator.php
 */
function activate_advisr_team_pages() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-advisr-team-pages-activator.php';
	Advisr_Team_Pages_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-advisr-team-pages-deactivator.php
 */
function deactivate_advisr_team_pages() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-advisr-team-pages-deactivator.php';
	Advisr_Team_Pages_Deactivator::deactivate();
}

register_activation_hook( __FILE__, 'activate_advisr_team_pages' );
register_deactivation_hook( __FILE__, 'deactivate_advisr_team_pages' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-advisr-team-pages.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_advisr_team_pages() {

	$plugin = new Advisr_Team_Pages();
	$plugin->run();

}
run_advisr_team_pages();
