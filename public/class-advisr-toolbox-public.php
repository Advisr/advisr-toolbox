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
		wp_enqueue_style( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'css/bootstrap.min.css', array(), $this->version, 'all' );
        wp_enqueue_style( 'advisr-bootstrap', plugin_dir_url( __FILE__ ) . 'css/vendor/bootstrap/bootstrap-custom.css', array(), $this->version, 'all' );
//		wp_enqueue_style( 'custombox', plugin_dir_url( __FILE__ ) . 'css/vendor/custombox/custombox.min.css', array(), $this->version, 'all' );
		wp_enqueue_style( 'fontawesome', plugin_dir_url( __FILE__ ) . 'css/vendor/fontawesome/css/font-awesome.min.css', array(), $this->version, 'all' );

		wp_enqueue_style( 'font', plugin_dir_url( __FILE__ ) . 'css/fonts/Proxima-Nova/stylesheet.css', array(), $this->version, 'all' );
		
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
	public function review_advisr_member_review(){
		?>
		<script src="//cdnjs.cloudflare.com/ajax/libs/jquery.touchswipe/1.6.4/jquery.touchSwipe.min.js"></script>
		  <link rel="stylesheet" href="<?php echo plugin_dir_url( __FILE__ );?>css/bootstrap.min.css">  
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>

  <style>
  .advisr-prefix-class-container {max-width: 1140px; margin-left: auto; margin-right: auto;} 
               .advisr-prefix-class-h6 {font-size: 1.2rem; font-weight: 600;}  
                .advisr-prefix-class-d-flex {display: flex; justify-content: space-between;}  
                ul.advisr-prefix-class {display: flex; list-style-type: none; padding-left: 0;}  
                i.fa.fa-star{color: #f9d304;font-size: 20px;}  
                .advisr-prefix-class-text-center {text-align: center;} 
                .advisr-prefix-class-text-left {text-align: left;}
                .advisr-prefix-class-text-secondary {color: grey;} 
                .advisr-prefix-class-link-muted {margin-bottom: 32px;} 
                .advisr-prefix-class-list-inline {text-align: center; margin-left: auto; margin-right: auto;} 
                .advisr-prefix-class-row {display: flex; flex-wrap: wrap; margin-right: auto; margin-left: auto; align-items: center; width: 100%;} 
                .advisr-prefix-class-col-1 {margin-left: 4.15%; -webkit-box-flex: 0; flex: 0 0 8.3333333333%; max-width: 8.3333333333%;} 
                .advisr-prefix-class-col-2 {-webkit-box-flex: 0; flex: 0 0 16.6666666667%; max-width: 16.6666666667%;}
                .advisr-prefix-class-col-8 {-webkit-box-flex: 0; flex: 0 0 66.6666666667%; max-width: 66.6666666667%;} 
                .advisr-prefix-class-col-8 {text-align: center; margin-left: auto; margin-right: auto;} 
               .advisr-prefix-class-mt-5 {margin-top: 64px;} 
                .advisr-prefix-class-col-8 ul {display: flex; margin-left: auto; margin-right: auto; justify-content: center;} 
              .advisr-prefix-class-col-12 {-webkit-box-flex: 0; flex: 0 0 100%; max-width: 100%; padding-left: 15px; padding-right: 15px; position: relative; width: 100%; min-height: 1px;} 
              .advisr-prefix-class-text-dark {color: gray; margin-top: 32px;} 
               .advisr-prefix-class-h5 {font-size: 1.25rem; line-height: 1.2; font-weight: 500;} 
               .advisr-prefix-class-h5-carousel {font-size: 1.4rem; line-height: 1.2; font-weight: 600;} 
               .advisr-prefix-class-border-bottom {border-bottom: 1px solid grey; margin-bottom: 20px; padding-bottom: 20px;}
               .advisr-prefix-class-spacing-y-3 {margin-top:1rem} 
                .advisr-prefix-class-ml-auto {margin-left: auto} 
                .advisr-prefix-class-mr-2 {margin-right: .5rem}
                .advisr-prefix-class-mb-0 {margin-bottom: 0} 
                .advisr-prefix-class-mb-1 {margin-bottom: .25rem}
               .advisr-prefix-class-small {font-size: 80%; font-weight: 400;} 
               .advisr-prefix-class-justify-content-center {justify-content: center;} 
               .advisr-prefix-class-align-items-center {align-items: center;} 
               .advisr-prefix-class-u-header__navbar-brand-text {font-size: 2.25rem; font-weight: 700; margin-left: .5rem; color: #0062d8;}
				.fa-quote-left:before {
				content: "\f10d";
				}
				.carousel .item {
				cursor: pointer;
				}
				span.advisr-prefix-class-h5-carousel {
					font-size: 15px;
				}
				@media only screen and (max-width: 400px) {
					img.advisr-prefix-class-mr-2 {
					margin-top: 0px;
					float: left;
					display: inline-block;
					}
					span.advisr-prefix-class-h5-carousel {
					text-align: left;
					}
					.advisr-container .carousel-inner .item {
    height: 550px;
}
				}

                </style>
				<script>
				jQuery(document).ready(function($){
					$(".carousel .item:first-child").addClass('active');
				$('.carousel').carousel({
  interval: 10000 
}); 
				$(".carousel").swipe({
				swipe: function(event, direction, distance, duration, fingerCount, fingerData) {
				if (direction == 'left') $(this).carousel('next');
				if (direction == 'right') $(this).carousel('prev');
				},
				allowPageScroll:"vertical"
				});
				});
				</script>
				
		<?php
		$advisr_toolbox= get_option('advisr-toolbox');
		$apikey=$advisr_toolbox['apikey'];
	
		$curl = curl_init();
curl_setopt_array($curl, array(
  CURLOPT_URL => "https://advisr.com.au/api/v1/brokerages/150?withReviews=true&recursiveReviews=true",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => array(
    "authorization: Bearer ".$apikey,
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);
curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
   $response;
}
$array_result = json_decode($response, true);
$reivew=$array_result['reviews'];
$reivew_slug=$array_result['slug'];
$reivew_name=$array_result['name'];

$html = '';
?>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/2.1.1/jquery.min.js"></script>
<?php
		
		   $html.='<div class="advisr-container container">';
  $html.='<div id="carousel-example-generic" class="carousel slide slide advisr-prefix-class-col-12" data-interval="10000" data-ride="carousel">';
  $html.=' <div class="carousel-inner" role="listbox">';  
foreach($reivew as $reviews_data){
	//print_r($reviews_data);
 $rating=$reviews_data['rating'];

    $html.='  <div class="item">';
    $html.='<div class="advisr-prefix-class-row advisr-prefix-class-text-center advisr-prefix-class-align-items-center">
	<div class="advisr-prefix-class-col-2"><i class="fa fa-quote-left" aria-hidden="true"></i></div><div class="advisr-prefix-class-col-8"><p></p>
	<ul class="advisr-prefix-class advisr-prefix-class-list-inline advisr-prefix-class-small advisr-prefix-class-mb-3">';
	
	for ($x = 1; $x <= $rating; $x++) {
  $html.='<li class="advisr-prefix-class-list-inline-item advisr-prefix-class-mx-0"><i class="fa fa-star" aria-hidden="true"></i></li>';
}

	$html.='</ul> 
	'.$reviews_data['comment'].'<p></p>
	
	<div class="advisr-prefix-class-col-12 advisr-prefix-class-text-center advisr-prefix-class-d-flex advisr-prefix-class-justify-content-center advisr-prefix-class-align-items-center">';
    if($reviews_data['google'] == false){
	 $html.='<img src="'.plugin_dir_url( __FILE__ ).'/advisr-logo.png" data-toggle="tooltip" data-placement="top" title="Advisr review" class="advisr-prefix-class-mr-2" alt="advisr-logo" style="height: 16px; width: 16px;">';
	}else{
	 $html.='<img src="'.plugin_dir_url( __FILE__ ).'/google-logo.png" data-toggle="tooltip" data-placement="top" title="Advisr review" class="advisr-prefix-class-mr-2" alt="advisr-logo" style="height: 16px; width: 16px;">';
}
	 $html.='<span class="advisr-prefix-class-h5-carousel">'.$reviews_data['reviewer'].' reviewed '.$reviews_data['reviewee'].'</span></div>
	</div>
	<div class="advisr-prefix-class-col-2">
	<i class="fa fa-quote-right"></i></div></div>';
     $html.=' </div>';
   

	}
	
	 $html.='<div class="add-review advisr-prefix-class-text-center advisr-prefix-class-text-dark">
	 <a href="https://advisr.com.au/'.$reivew_slug.'#reviews" target="_blank">Leave '.$reivew_name.' a review</a></div>';
		  $html.='  </div>';
 $html.=' </div>';
$html.='</div>'; 
$html.='</div>'; 

		return $html;
	}
		
	public function advisr_toolbox_review_shortcodes() {
		$plugin_public = new Advisr_Toolbox_Public( $this->get_plugin_name(), $this->get_version() );
		//add_shortcode( 'advisr-reviews', array('review_advisr_member_review'));
		add_shortcode( 'advisr-reviews', array($plugin_public, 'review_advisr_member_review' ));
		if ( version_compare($GLOBALS['wp_version'], '5.0-beta', '>') ) {
    // WP > 5 beta
    add_filter( 'use_block_editor_for_post_type', '__return_false', 100 );
} else {
    // WP < 5 beta
    add_filter( 'gutenberg_can_edit_post_type', '__return_false' );
}
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
