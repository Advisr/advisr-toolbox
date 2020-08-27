<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://advisr.com.au
 * @since      1.0.0
 *
 * @package    Advisr_Team_Pages
 * @subpackage Advisr_Team_Pages/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Advisr_Team_Pages
 * @subpackage Advisr_Team_Pages/admin
 * @author     Ev Ooi <ev@advisr.com.au>
 */
class Advisr_Team_Pages_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $plugin_name    The ID of this plugin.
	 */
	private $plugin_name;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $plugin_name       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Advisr_Team_Pages_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Advisr_Team_Pages_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/advisr-team-pages-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in Advisr_Team_Pages_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Advisr_Team_Pages_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/advisr-team-pages-admin.js', array( 'jquery' ), $this->version, false );

	}

	/**
	* Creates a new custom post type
	*
	* @since 1.0.0
	* @access public
	* @uses register_post_type()
	*/
	public static function new_cpt_team_member() {
		$cap_type = 'post';
		$plural = 'Team Members';
		$single = 'Team Member';
		$cpt_name = 'advisr-team-member';
		$opts['can_export'] = TRUE;
		$opts['capability_type'] = $cap_type;
		$opts['description'] = '';
		$opts['exclude_from_search'] = FALSE;
		$opts['has_archive'] = FALSE;
		$opts['hierarchical'] = FALSE;
		$opts['map_meta_cap'] = TRUE;
		$opts['menu_icon'] = 'dashicons-businessman';
		$opts['menu_position'] = 25;
		$opts['public'] = TRUE;
		$opts['publicly_querable'] = TRUE;
		$opts['query_var'] = TRUE;
		$opts['register_meta_box_cb'] = '';
		$opts['rewrite'] = FALSE;
		$opts['show_in_admin_bar'] = TRUE;
		$opts['show_in_menu'] = TRUE;
		$opts['show_in_nav_menu'] = TRUE;
		
		$opts['labels']['add_new'] = esc_html__( "Add New {$single}", 'team member' );
		$opts['labels']['add_new_item'] = esc_html__( "Add New {$single}", 'team member' );
		$opts['labels']['all_items'] = esc_html__( $plural, 'team member' );
		$opts['labels']['edit_item'] = esc_html__( "Edit {$single}" , 'team member' );
		$opts['labels']['menu_name'] = esc_html__( $plural, 'team member' );
		$opts['labels']['name'] = esc_html__( $plural, 'team member' );
		$opts['labels']['name_admin_bar'] = esc_html__( $single, 'team member' );
		$opts['labels']['new_item'] = esc_html__( "New {$single}", 'team member' );
		$opts['labels']['not_found'] = esc_html__( "No {$plural} Found", 'team member' );
		$opts['labels']['not_found_in_trash'] = esc_html__( "No {$plural} Found in Trash", 'team member' );
		$opts['labels']['parent_item_colon'] = esc_html__( "Parent {$plural} :", 'team member' );
		$opts['labels']['search_items'] = esc_html__( "Search {$plural}", 'team member' );
		$opts['labels']['singular_name'] = esc_html__( $single, 'team member' );
		$opts['labels']['view_item'] = esc_html__( "View {$single}", 'team member' );
		register_post_type( strtolower( $cpt_name ), $opts );
	} // new_cpt_job()

	/**
	 * Register the administration menu for this plugin into the WordPress Dashboard menu.
	 *
	 * @since    1.0.0
	 */

	public function add_plugin_admin_menu() {

		/*
		* Add a settings page for this plugin to the Settings menu.
		*
		* NOTE:  Alternative menu locations are available via WordPress administration menu functions.
		*
		*        Administration Menus: http://codex.wordpress.org/Administration_Menus
		*
		*/
		add_options_page( 'Advisr Team Page Setup', 'Advisr Team Page', 'manage_options', $this->plugin_name, array($this, 'display_plugin_setup_page')
		);
	}

	/**
	 * Add settings action link to the plugins page.
	 *
	 * @since    1.0.0
	 */

	public function add_action_links( $links ) {
		/*
		*  Documentation : https://codex.wordpress.org/Plugin_API/Filter_Reference/plugin_action_links_(plugin_file_name)
		*/
		$settings_link = array(
			'<a href="' . admin_url( 'options-general.php?page=' . $this->plugin_name ) . '">' . __('Settings', $this->plugin_name) . '</a>',
		);
		return array_merge(  $settings_link, $links );

	}

	/**
	 * Render the settings page for this plugin.
	 *
	 * @since    1.0.0
	 */

	public function display_plugin_setup_page() {
		include_once( 'partials/advisr-team-pages-admin-display.php' );
	}

	/**
	*
	* admin/class-advisr-team-pages-admin.php
	*
	**/
	public function options_update() {
		register_setting($this->plugin_name, $this->plugin_name, array($this, 'validate'));
	}
	
	/**
	*
	* admin/class-advisr-team-pages-admin.php
	*
	**/
	public function validate($input) {
		// All checkboxes inputs        
		$valid = array();

		//Cleanup
		$valid['apikey'] = (isset($input['apikey']) && !empty($input['apikey'])) ? sanitize_text_field($input['apikey']) : '';
		$valid['members-before'] = (isset($input['members-before']) && !empty($input['members-before'])) ? 1: 0;
		$valid['members-after'] = (isset($input['members-after']) && !empty($input['members-after'])) ? 1 : 0;
		// $valid['body_class_slug'] = (isset($input['body_class_slug']) && !empty($input['body_class_slug'])) ? 1 : 0;
		// $valid['jquery_cdn'] = (isset($input['jquery_cdn']) && !empty($input['jquery_cdn'])) ? 1 : 0;
		// $valid['cdn_provider'] = esc_url($input['cdn_provider']);

		return $valid;
	}


}
