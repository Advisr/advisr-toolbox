<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://advisr.com.au
 * @since      1.0.0
 *
 * @package    Advisr_Toolbox
 * @subpackage Advisr_Toolbox/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Advisr_Toolbox
 * @subpackage Advisr_Toolbox/public
 * @author     Ev Ooi <ev@advisr.com.au>
 */
class Advisr_Toolbox_Public {

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
	 * @param      string    $plugin_name       The name of the plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $plugin_name, $version ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;
		$this->advisr_toolbox_options = get_option($this->plugin_name);
	}

	/**
	 * Register the stylesheets for the public-facing side of the site.
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

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/advisr-toolbox-public.css', array(), $this->version, 'all' );
        wp_enqueue_style( 'advisr-bootstrap', plugin_dir_url( __FILE__ ) . 'css/vendor/bootstrap/bootstrap-custom.css', array(), $this->version, 'all' );
//		wp_enqueue_style( 'custombox', plugin_dir_url( __FILE__ ) . 'css/vendor/custombox/custombox.min.css', array(), $this->version, 'all' );
		wp_enqueue_style( 'fontawesome', plugin_dir_url( __FILE__ ) . 'css/vendor/fontawesome/css/font-awesome.min.css', array(), $this->version, 'all' );
		
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
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

		// Register the Advisr Toolbox script file for enqueueing in function team_pages_member_post_type()

		wp_register_script( 'advisr-reviews', plugin_dir_url( __FILE__ ) . 'js/advisr-team-page.js', array(), 1.0, true );
		wp_enqueue_script( 'advisr-bootstrap', plugin_dir_url( __FILE__ ) . 'js/vendor/bootstrap/bootstrap.min.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'custombox', plugin_dir_url( __FILE__ ) . 'js/vendor/custombox/dist/custombox.min.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'hs-core', plugin_dir_url( __FILE__ ) . 'js/vendor/hs.core.js', array( 'jquery' ), $this->version, false );
		wp_enqueue_script( 'hs-modal-window', plugin_dir_url( __FILE__ ) . 'js/vendor/hs.modal-window.js', array( 'jquery' ), $this->version, false );
		
	}

	/**
	 * Shortcode to display team page list
	 *
	 * Since everything within the plugin is registered via hooks,
	 * then kicking off the plugin from this point in the file does
	 * not affect the page life cycle.
	 *
	 * @since    1.0.0
	 */

	public function team_pages_member_post_type() {
		
		$args = array(
			'post_type'      => 'advisr-team-member',
			'posts_per_page' => '-1',
			'publish_status' => 'published',
			'orderby'		 => 'meta_value_num',
			'meta_key'		 => 'order',
			'order'			 => 'ASC'
		);

		$query = new WP_Query($args);

		$team_members = [];
		$result = '';

		if($query->have_posts()) :

			while($query->have_posts()) :

				$query->the_post() ;
				array_push($team_members, array(
					'name' => get_the_title(),
					'description' => get_the_content(),
					// @TODO camelcase fields
					'avatar_url' => get_the_post_thumbnail_url(get_the_ID(), 'medium'),
					'role' => get_post_meta(get_the_ID(), 'role', true),
					'mobile' => get_post_meta(get_the_ID(), 'mobile', true),
					'telephone' => get_post_meta(get_the_ID(), 'telephone', true),
					'email' => get_post_meta(get_the_ID(), 'email', true),
					'order' => get_post_meta(get_the_ID(), 'order', true)
				));

			endwhile;

			wp_reset_postdata();
			
		endif;   

		$result .= '<advisr-team-page></advisr-reviews>';
				
		$script_params = array(
			'teamMembers' => $team_members,
			'apikey' => $this->advisr_toolbox_options['apikey'],
			'advisrBrokersConfig' => $this->advisr_toolbox_options['advisr-brokers-config']
		);
		
		// pass results from WP_Query to js
		wp_localize_script( 'advisr-reviews', 'scriptParams', $script_params );
		wp_enqueue_script( 'advisr-reviews' );
		
		return $result;            
	}

	public function advisr_toolbox_register_shortcodes() {
		$plugin_public = new Advisr_Toolbox_Public( $this->get_plugin_name(), $this->get_version() );
		add_shortcode( 'advisr-team-page', array($plugin_public, 'team_pages_member_post_type' ));
	}

	/**
	 * The name of the plugin used to uniquely identify it within the context of
	 * WordPress and to define internationalization functionality.
	 *
	 * @since     1.0.0
	 * @return    string    The name of the plugin.
	 */
	public function get_plugin_name() {
		return $this->plugin_name;
	}

	/**
	 * Retrieve the version number of the plugin.
	 *
	 * @since     1.0.0
	 * @return    string    The version number of the plugin.
	 */
	public function get_version() {
		return $this->version;
	}

}
