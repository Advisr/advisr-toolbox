<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       https://advisr.com.au
 * @since      1.0.0
 *
 * @package    Advisr_Toolbox
 * @subpackage Advisr_Toolbox/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    Advisr_Toolbox
 * @subpackage Advisr_Toolbox/admin
 * @author     Ev Ooi <ev@advisr.com.au>
 */
class Advisr_Toolbox_Admin {

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
		 * defined in Advisr_Toolbox_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Advisr_Toolbox_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/advisr-toolbox-admin.css', array(), $this->version, 'all' );

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
		 * defined in Advisr_Toolbox_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Advisr_Toolbox_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/advisr-toolbox-admin.js', array( 'jquery' ), $this->version, false );

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
		$plural = 'Team from Wordpress';
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
		$opts['supports'] = array( 'title', 'editor', 'thumbnail');
		$opts['menu_position'] = 25;
		$opts['public'] = TRUE;
		$opts['publicly_querable'] = TRUE;
		$opts['query_var'] = TRUE;
		$opts['register_meta_box_cb'] = '';
		$opts['rewrite'] = FALSE;
		$opts['show_in_admin_bar'] = TRUE;
		$opts['show_in_menu'] = TRUE;
		$opts['show_in_nav_menu'] = TRUE;
		
		$opts['labels']['add_new'] = sanitize_text_field( "Add New {$single}" );
		$opts['labels']['add_new_item'] = sanitize_text_field( "Add New {$single}" );
		$opts['labels']['all_items'] = sanitize_text_field( $plural );
		$opts['labels']['edit_item'] = sanitize_text_field( "Edit {$single}"  );
		$opts['labels']['menu_name'] = sanitize_text_field( $plural );
		$opts['labels']['name'] = sanitize_text_field( $plural );
		$opts['labels']['name_admin_bar'] = sanitize_text_field( $single );
		$opts['labels']['new_item'] = sanitize_text_field( "New {$single}" );
		$opts['labels']['not_found'] = sanitize_text_field( "No {$plural} Found" );
		$opts['labels']['not_found_in_trash'] = sanitize_text_field( "No {$plural} Found in Trash" );
		$opts['labels']['parent_item_colon'] = sanitize_text_field( "Parent {$plural} :" );
		$opts['labels']['search_items'] = sanitize_text_field( "Search {$plural}" );
		$opts['labels']['singular_name'] = sanitize_text_field( $single );
		$opts['labels']['view_item'] = sanitize_text_field( "View {$single}" );
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
		add_options_page( 'Advisr Toolbox Setup', 'Advisr Toolbox', 'manage_options', $this->plugin_name, array($this, 'display_plugin_setup_page')
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
		include_once( 'partials/advisr-toolbox-admin-display.php' );
	}

	/**
	*
	* admin/class-advisr-toolbox-admin.php
	*
	**/
	public function options_update() {
		register_setting($this->plugin_name, $this->plugin_name, array($this, 'validate'));
	}
	
	/**
	*
	* admin/class-advisr-toolbox-admin.php
	*
	**/
	public function validate($input) {
		// All checkboxes inputs        
		$valid = array();

		//Cleanup
		$valid['apikey'] = (isset($input['apikey']) && !empty($input['apikey'])) ? sanitize_text_field($input['apikey']) : '';
		$valid['advisr-brokers-config'] = (!empty($input['advisr-brokers-config']) ) ? $input['advisr-brokers-config'] : "'[]'";

		return $valid;
	}

	/**
	 * Adds a metabox to the right side of the screen under the Publish box
	 */
	public function add_role_metaboxes() {

		function team_member_role_cb() {
			global $post;
	
			// Nonce field to validate form request came from current site
			wp_nonce_field( basename( __FILE__ ), 'event_fields' );
	
			// Get the role data if it's already been entered
			$role = get_post_meta( $post->ID, 'role', true );
	
			// Output the field
			echo '<p>Team member role</p>
				<input type="text" name="role" placeholder="eg. Team leader" value="' . sanitize_text_field( $role )  . '" class="widefat">';
		}
		
		add_meta_box(
			'role',
			'Role',
			'team_member_role_cb',
			'advisr-team-member',
			'side',
			'default'
		);
	}

	/**
	 * Adds a metabox to the right side of the screen under the Publish box
	 */
	public function add_mobile_metaboxes() {

		function team_member_mobile_cb() {
			global $post;
	
			// Nonce field to validate form request came from current site
			wp_nonce_field( basename( __FILE__ ), 'event_fields' );
	
			// Get the mobile data if it's already been entered
			$mobile = get_post_meta( $post->ID, 'mobile', true );
	
			// Output the field
			echo '<p>Team member mobile number.</p>
				<input type="number" name="mobile" placeholder="eg. 0444 222 555" value="' . sanitize_text_field( $mobile )  . '" class="widefat">';
		}
		
		add_meta_box(
			'mobile',
			'Mobile',
			'team_member_mobile_cb',
			'advisr-team-member',
			'side',
			'default'
		);
	}

	/**
	 * Adds a metabox to the right side of the screen under the Publish box
	 */
	public function add_telephone_metaboxes() {

		function team_member_telephone_cb() {
			global $post;
	
			// Nonce field to validate form request came from current site
			wp_nonce_field( basename( __FILE__ ), 'event_fields' );
	
			// Get the telephone data if it's already been entered
			$telephone = get_post_meta( $post->ID, 'telephone', true );
	
			// Output the field
			echo '<p>Team member phone number</p>
				<input type="number" name="telephone" placeholder="eg. 02 3333 9999" value="' . sanitize_text_field( $telephone )  . '" class="widefat">';
		}
		
		add_meta_box(
			'telephone',
			'Telephone',
			'team_member_telephone_cb',
			'advisr-team-member',
			'side',
			'default'
		);
	}

	/**
	 * Adds a metabox to the right side of the screen under the Publish box
	 */
	public function add_email_metaboxes() {

		function team_member_email_cb() {
			global $post;
	
			// Nonce field to validate form request came from current site
			wp_nonce_field( basename( __FILE__ ), 'event_fields' );
	
			// Get the email data if it's already been entered
			$email = get_post_meta( $post->ID, 'email', true );
	
			// Output the field
			echo '<p>Team member email</p>
				<input type="text" name="email" placeholder="eg. john@doe.com" value="' . sanitize_text_field( $email )  . '" class="widefat">';
		}
		
		add_meta_box(
			'email',
			'Email',
			'team_member_email_cb',
			'advisr-team-member',
			'side',
			'default'
		);
	}

	/**
	 * Adds a metabox to the right side of the screen under the Publish box
	 */
	public function add_order_metaboxes() {

		/**
		 * Output the HTML for the team member order metabox.
		 */
		function team_member_order_cb() {
			global $post;

			// Nonce field to validate form request came from current site
			wp_nonce_field( basename( __FILE__ ), 'event_fields' );

			// Get the order data if it's already been entered
			$order = get_post_meta( $post->ID, 'order', true );

			// Output the field
			echo '<p>Team member position on the page</p>
				<input type="number" name="order" required placeholder="eg. 12" value="' . sanitize_text_field( $order )  . '" class="widefat">';
		}

		add_meta_box(
			'order',
			'Order',
			'team_member_order_cb',
			'advisr-team-member',
			'side',
			'default'
		);
	}
	
	/**
	 * Save the metabox data
	 */
	public function advisr_toolbox_save_meta( $post_id, $post ) {

		// Return if the user doesn't have edit permissions.
		if ( ! current_user_can( 'edit_post', $post_id ) ) {
			return $post_id;
		}

		// Verify this came from the our screen and with proper authorization,
		// because save_post can be triggered at other times.
		if ( ! isset( $_POST['order'] ) || ! wp_verify_nonce( $_POST['event_fields'], basename(__FILE__) ) ) {
			return $post_id;
		}
		if ( ! isset( $_POST['role'] ) || ! wp_verify_nonce( $_POST['event_fields'], basename(__FILE__) ) ) {
			return $post_id;
		}
		if ( ! isset( $_POST['mobile'] ) || ! wp_verify_nonce( $_POST['event_fields'], basename(__FILE__) ) ) {
			return $post_id;
		}
		if ( ! isset( $_POST['telephone'] ) || ! wp_verify_nonce( $_POST['event_fields'], basename(__FILE__) ) ) {
			return $post_id;
		}
		if ( ! isset( $_POST['email'] ) || ! wp_verify_nonce( $_POST['event_fields'], basename(__FILE__) ) ) {
			return $post_id;
		}

		// Now that we're authenticated, time to save the data.
		// This sanitizes the data from the field and saves it into an array $events_meta.
		$events_meta['order'] = sanitize_text_field( $_POST['order'] );
		$events_meta['role'] = sanitize_text_field( $_POST['role'] );
		$events_meta['mobile'] = sanitize_text_field( $_POST['mobile'] );
		$events_meta['telephone'] = sanitize_text_field( $_POST['telephone'] );
		$events_meta['email'] = sanitize_text_field( $_POST['email'] );

		// Cycle through the $events_meta array.
		// Note, in this example we just have one item, but this is helpful if you have multiple.
		foreach ( $events_meta as $key => $value ) :

			// Don't store custom data twice
			if ( 'revision' === $post->post_type ) {
				return;
			}

			if ( get_post_meta( $post_id, $key, false ) ) {
				// If the custom field already has a value, update it.
				update_post_meta( $post_id, $key, $value );
			} else {
				// If the custom field doesn't have a value, add it.
				add_post_meta( $post_id, $key, $value);
			}

			if ( ! $value ) {
				// Delete the meta key if there's no value
				delete_post_meta( $post_id, $key );
			}
		endforeach;
	}

	public function advisr_toolbox_fetched_data_submenu_page() {

		add_submenu_page(
			'edit.php?post_type=advisr-team-member',
			__( 'Advisr Brokers Configuration', 'textdomain' ),
			__( 'Team from Advisr (Brokers)', 'textdomain' ),
			'manage_options',
			'advisr-brokers',
			array($this, 'advisr_fetched_data_page_callback'),
			1
		);

	}

	/**
	 * Display callback for the submenu page.
	 */
	public function advisr_fetched_data_page_callback() { 
		include_once( 'partials/advisr-toolbox-advisr-brokers-display.php' );
	}


}
