<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       https://advisr.com.au
 * @since      1.0.0
 *
 * @package    Advisr_Team_Pages
 * @subpackage Advisr_Team_Pages/public
 */

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the public-facing stylesheet and JavaScript.
 *
 * @package    Advisr_Team_Pages
 * @subpackage Advisr_Team_Pages/public
 * @author     Ev Ooi <ev@advisr.com.au>
 */
class Advisr_Team_Pages_Public {

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
		$this->advisr_team_page_options = get_option($this->plugin_name);
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
		 * defined in Advisr_Team_Pages_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Advisr_Team_Pages_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/advisr-team-pages-public.css', array(), $this->version, 'all' );

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
		 * defined in Advisr_Team_Pages_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The Advisr_Team_Pages_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/advisr-team-pages-public.js', array( 'jquery' ), $this->version, false );
		
		// Register the Advisr Team Page script file for enqueueing in function team_pages_member_post_type()
		// wp_register_script('advisr-reviews', 'https://advisr.com.au/js/advisr-team-page.js', array(), 1.0, true);
		// @TODO remove this
		wp_register_script( 'advisr-reviews', plugin_dir_url( __FILE__ ) . 'js/advisr-team-page.js', array(), 1.0, true );
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

		$users = [];

		if($query->have_posts()) :

			while($query->have_posts()) :
				// render the widget <advisr-team-page>

				$query->the_post() ;
				array_push($users, array(
					'name' => get_the_title(),
					'description' => get_the_content(),
					'image' => get_the_post_thumbnail(),
					'group' => get_post_meta(get_the_ID(), 'group', true),
					'order' => get_post_meta(get_the_ID(), 'order', true)
				));

			$result .= '<advisr-reviews api-token="ey0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiI5IiwianRpIjoiZDc2MGM2MzFlNGY1NTk5MjJmMjY4NWQxOGY1ODIyZDhiNDFhNzZkM2E5OWNlN2JhNjA0MmZmY2IxZTgwMzM5NGExNTlkMDYxMDRjODhkMmIiLCJpYXQiOjE1OTU4MjY1ODksIm5iZiI6MTU5NTgyNjU4OSwiZXhwIjoxNjI3MzYyNTg5LCJzdWIiOiIzMDM2Iiwic2NvcGVzIjpbXX0.JGDhNeKYUwtCyGBcINL2NENDUUMurFABDtsubam1MnxSxh9MHn9nSIK66zvFFpAiIAsyzGftSq1TB9xzutZPR8FT_oLg3ZZRHpdgeOyl42zRcWBXeqXUBBdOCVzr78Hn3Ztc-zAA8jhoifPNtGLlU6L0hWgl0h695Hht5SccFtZ8-cnSkyHyouI9MAuhwKoTNesTzmy7zQP2kvLU709bNpHDxbvnRs9ExrrTgyKgh11-7ujjSZZ77REZ99S1El9WozucfaXXM5zSNeqK8BYrL9tLjSuPgAYvHIBnhyzImJ2hlid_bJhwKQOruKUny_Wvr0jw0j1GKqitEWyy39mv_N8xWu00fwdeQMKhTv-cll1nIXwGiZmdArkffj-LY6jF8zgAb0NgWiuDnIi-c74NYQILXXGoC37KCCcF5LMkVnNVOyEC8k2eou0Myr_QJDmY64maRURnzVgEj1BUz4FJatty09azCP5fmg0QOcRMfnax_Xd7ZwCxaQpeECrSWA4c9h8lc-ao7ckveKrHzHtjKUM6FymJ_l_DGxXVHv02g1c_KXpLkm2TOh-6VxTcmNdff4UdrXgkyqBvOIgqmuGf4IBGN0CMgmTyqSOnkB6Kgo6xRZtiMCr6iPRp5mOvxa5QDnixqZk4Di9wEqUpsXJtvA0GdQ8vaPvnQ7o7PcK9dOU" include-styles="false" show-review-link="true"></advisr-reviews>';
			$result .= '<div class="team-member-item">';
			$result .= '<div class="team-member-poster">' . get_the_post_thumbnail() . '</div>';
			$result .= '<div class="team-member-name">' . get_the_title() . '</div>';
			$result .= '<div class="team-member-desc">' . get_the_content() . '</div>'; 
			$result .= '<div class="team-member-group">' . get_post_meta(get_the_ID(), 'group', true) . '</div>'; 
			$result .= '<div class="team-member-order">' . get_post_meta(get_the_ID(), 'order', true) . '</div>'; 
			$result .= '</div>';

			endwhile;

			wp_reset_postdata();

		endif;   
				
		$script_params = array(
			'users' => $users,
			'apikey' => $this->advisr_team_page_options['apikey'],
			'membersBefore' => $this->advisr_team_page_options['members-before'],
			'membersAfter' => $this->advisr_team_page_options['members-after'],
		);

		wp_localize_script( 'advisr-reviews', 'scriptParams', $script_params );

		wp_enqueue_script( 'advisr-reviews' );

		return $result;            
	}

	public function advisr_team_page_register_shortcodes() {
		$plugin_public = new Advisr_Team_Pages_Public( $this->get_plugin_name(), $this->get_version() );
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
