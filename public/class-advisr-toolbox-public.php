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
	function custom_footer_ajex() {
		
	?>
	<script src="https://cdn.jsdelivr.net/jquery.slick/1.5.2/slick.min.js"></script>
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/jquery.slick/1.5.2/slick.css">
    <link rel="stylesheet" type="text/css" href="https://cdn.jsdelivr.net/jquery.slick/1.5.2/slick-theme.css">
    <script>
        jQuery(document).ready(function($){
            jQuery(".slickItem .advisr-prefix-class-align-items-center").show();
            $(".slickContainer").slick({
                slide: '.slickItem',
                arrows : false,
                autoplay: true,
                autoplaySpeed: 10000,
            });
        
        });
    </script>
	<input type="hidden" id="ajax_url" value="<?php echo admin_url('admin-ajax.php'); ?>">
	
		<?php
	}
	public function advisr_toolbox_custom_footer_ajex() {
		$plugin_public = new Advisr_Toolbox_Public( $this->get_plugin_name(), $this->get_version() );
        add_action('wp_head',array($plugin_public, 'custom_footer_ajex' ));
	
	}
	function save_review_custom_pop() {
        $advisr_toolbox= get_option('advisr-toolbox');
        $apikey=$advisr_toolbox['apikey'];

		//print_r($_POST[user_name]);
        $rating=$_POST['rating'];
        if (empty($rating)) {
            $rating=1;
        }
        $fields = array(
            'reviewee_id' => $_POST['reviewee_id'],
            'rating' =>  $rating,
            'fullName' =>  $_POST['user_name'],
            'email' =>  $_POST['email_user'],
            'comment' =>  $_POST['comment_user']
        );

        $fields = json_encode($fields);
        //print_r($field);

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://advisr.com.au/api/v2/reviews/submit",
//            CURLOPT_URL => "https://advisr.advisrdev.com.au/api/v2/reviews/submit",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            ///curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
            CURLOPT_POSTFIELDS => $fields,
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache",
                "content-type: application/json",
                "authorization: Bearer ".$apikey,
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
          echo "cURL Error #:" . $err;
        } else {
         //= echo $response;
        }
        //print_r( $response);
        if(!empty($response)){
            echo "Done";
        }
		exit;
	}
//add_action('wp_ajax_save_review_custom_pop', 'save_review_custom_pop');
//add_action('wp_ajax_nopriv_save_review_custom_pop', 'save_review_custom_pop');
	public function advisr_toolbox_save_review_custom_pop() {
		$plugin_public = new Advisr_Toolbox_Public( $this->get_plugin_name(), $this->get_version() );
		add_action('wp_ajax_save_review_custom_pop',  array($plugin_public, 'save_review_custom_pop' ));
        add_action('wp_ajax_nopriv_save_review_custom_pop',array($plugin_public, 'save_review_custom_pop' ));
		add_action('wp_ajax_save_massage_drop_user_custom_pop',  array($plugin_public, 'save_massage_drop_user_custom_pop' ));
        add_action('wp_ajax_nopriv_save_massage_drop_user_custom_pop',array($plugin_public, 'save_massage_drop_user_custom_pop' ));
	}
	
	function save_massage_drop_user_custom_pop(){
        $advisr_toolbox= get_option('advisr-toolbox');
        $apikey=$advisr_toolbox['apikey'];
        $fields = array(
            'user_id' => $_POST['reviewee_id'],
            'firstName' => $_POST['first_name'],
            'lastName' => $_POST['last_name'],
            'email' =>  $_POST['email_user'],
            'mobile' =>  $_POST['phone_number'],
            'message' =>  $_POST['comment_user']
        );

        $fields = json_encode($fields);
        //print_r($field);

        $curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://advisr.com.au/api/v2/leads/submit",
//            CURLOPT_URL => "https://advisr.advisrdev.com.au/api/v2/leads/submit",
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            ///curl_setopt($ch, CURLOPT_POSTFIELDS, $fields);
            CURLOPT_POSTFIELDS => $fields,
            CURLOPT_HTTPHEADER => array(
                "cache-control: no-cache",
                "content-type: application/json",
                "authorization: Bearer ".$apikey,
            ),
        ));

        $response = curl_exec($curl);
        $err = curl_error($curl);

        curl_close($curl);

        if ($err) {
          echo "cURL Error #:" . $err;
        } else {
         //= echo $response;
        }
       // print_r( $response);
        if(!empty($response)){
            echo "Done";
        }
		exit;
	}
	
	
	public function review_advisr_member_review() {
		?>
	
		<?php
		$advisr_toolbox= get_option('advisr-toolbox');
		$apikey=$advisr_toolbox['apikey'];
        $slider_text_color = get_option('slider_text_color');
	
		$curl = curl_init();
        curl_setopt_array($curl, array(
            CURLOPT_URL => "https://advisr.com.au/api/v2/brokerages",
//            CURLOPT_URL => "https://advisr.advisrdev.com.au/api/v2/brokerages",
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
        $array_result = $array_result['data'];

        $reivew=$array_result['reviews'];
        $reivew_slug=$array_result['profile_url'];
        $reivew_name=$array_result['name'];
        
        $html = '';

		
        $html.='<div class="advisr-container container">';
        $html.='<div class="review_section">';
        $html.=' <div class="slickContainer" >';
        foreach($reivew as $reviews_data) {
            $rating=$reviews_data['rating'];
            $html.=' <div class="slickItem">';
                $html.='<div class="advisr-prefix-class-row advisr-prefix-class-text-center advisr-prefix-class-align-items-center" style="display: none;">';
                            $html.='<div class="advisr-prefix-class-col-2"><svg id="Capa_1" style="fill: '.$slider_text_color.'" data-name="Capa 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 36.02 31.78"><path d="M14.47,6.31A1.74,1.74,0,0,0,15.36,4l0,0L13.9,1A1.74,1.74,0,0,0,11.63.15,19.9,19.9,0,0,0,5.38,4.22a15.09,15.09,0,0,0-4.21,6.65A36.27,36.27,0,0,0,0,21.09V30a1.76,1.76,0,0,0,1.75,1.77H13.16A1.75,1.75,0,0,0,14.9,30h0V18.59a1.74,1.74,0,0,0-1.74-1.74H7.7a12.29,12.29,0,0,1,2-7.06A11.1,11.1,0,0,1,14.47,6.31Z" transform="translate(0.01 0.01)"/><path d="M35,6.31A1.74,1.74,0,0,0,35.86,4l0,0L34.42,1A1.74,1.74,0,0,0,32.15.14a20.73,20.73,0,0,0-6.24,4,15.45,15.45,0,0,0-4.24,6.67A36.14,36.14,0,0,0,20.54,21v8.91a1.75,1.75,0,0,0,1.65,1.85h11.5A1.77,1.77,0,0,0,35.44,30V18.59a1.76,1.76,0,0,0-1.75-1.74H28.2a12.27,12.27,0,0,1,2-7.06A11,11,0,0,1,35,6.31Z" transform="translate(0.01 0.01)"/></svg></div><div class="advisr-prefix-class-col-8" style="color:'.$slider_text_color.'"><p></p>
                                    <ul class="advisr-prefix-class advisr-prefix-class-list-inline advisr-prefix-class-small advisr-prefix-class-mb-3">';
                                    for ($x = 1; $x <= $rating; $x++) {
                                    $html.='<li class="advisr-prefix-class-list-inline-item advisr-prefix-class-mx-0"><i class="fa fa-star" aria-hidden="true"></i></li>';
                                    }
                                    $html.='</ul> 
                                    '.$reviews_data['comment'].'<p style="margin-bottom: 15px; "></p>';
                                    $html.='<div class="advisr-prefix-class-col-12 advisr-prefix-class-text-center advisr-prefix-class-d-flex advisr-prefix-class-justify-content-center advisr-prefix-class-align-items-center">';
                                            if($reviews_data['google'] == false){
                                            $html.='<img src="'.plugin_dir_url( __FILE__ ).'/advisr-logo.png" data-toggle="tooltip" data-placement="top" title="Advisr review" class="advisr-prefix-class-mr-2" alt="advisr-logo" style="height: 16px; width: 16px;">';
                                            }else{
                                            $html.='<img src="'.plugin_dir_url( __FILE__ ).'/google-logo.png" data-toggle="tooltip" data-placement="top" title="Advisr review" class="advisr-prefix-class-mr-2" alt="advisr-logo" style="height: 16px; width: 16px;">';
                                            }
                                           $html.='<span class="advisr-prefix-class-h5-carousel">'.$reviews_data['reviewer'].' reviewed '.$reviews_data['reviewee'].'</span>';
                                    $html.='</div>';
                            $html.='</div>';
                        $html.='<div class="advisr-prefix-class-col-2">
                            <svg version="1.1" style="fill: '.$slider_text_color.'" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                            viewBox="0 0 36 31.7" style="enable-background:new 0 0 36 31.7;" xml:space="preserve">
                            <path d="M21.5,25.5c-0.9,0.4-1.3,1.4-0.9,2.3c0,0,0,0,0,0l1.4,3c0.4,0.8,1.4,1.2,2.3,0.8c2.3-0.9,4.4-2.3,6.3-4.1
                            c2-1.8,3.4-4.1,4.2-6.7c0.9-3.3,1.3-6.8,1.2-10.2V1.8c0-1-0.8-1.8-1.7-1.8c0,0,0,0,0,0L22.8,0c-1,0-1.7,0.8-1.7,1.8c0,0,0,0,0,0
                            v11.4c0,1,0.8,1.7,1.7,1.7h5.5c0.1,2.5-0.6,5-2,7.1C25,23.5,23.4,24.7,21.5,25.5z"/>
                            <path d="M1,25.5c-0.9,0.4-1.3,1.4-0.9,2.3c0,0,0,0,0,0l1.4,3C2,31.6,3,32,3.8,31.6c2.3-0.9,4.4-2.3,6.2-4c2-1.8,3.4-4.1,4.2-6.7
                            c0.9-3.3,1.2-6.8,1.1-10.2V1.8c0.1-1-0.7-1.8-1.6-1.8c0,0-0.1,0-0.1,0L2.3,0c-1,0-1.7,0.8-1.7,1.8v11.4c0,1,0.8,1.7,1.7,1.7h5.5
                            c0.1,2.5-0.6,5-2,7.1C4.5,23.5,2.9,24.7,1,25.5z"/>
                            </svg>
                        </div>
                    </div>';
					$html.='<div class="add-review advisr-prefix-class-text-center advisr-prefix-class-text-dark">
	    <a href="'.$reivew_slug.'" target="_blank" style="color:'.$slider_text_color.'">Leave '.$reivew_name.' a review</a></div>';
            $html.=' </div>';
					
            
        }

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
