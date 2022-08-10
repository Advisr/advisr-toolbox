<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://advisr.com.au
 * @since      1.0.0
 *
 * @package    Advisr_Toolbox
 * @subpackage Advisr_Toolbox/admin/partials
 */
?>

		<?php
	
			$options = get_option($this->plugin_name);
			$apikey = $options['apikey'];
			$advisr_brokers_config = $options['advisr-brokers-config'];

			//settings_fields($this->plugin_name);
			//do_settings_sections($this->plugin_name);
	if(!empty($_POST['disconnect']) && $_POST['disconnect'] == 'Disconnect'){
		// $disconnect=$_POST['disconnect'];
		 $disconnect['apikey']='';
		update_option($this->plugin_name, $disconnect);
		echo '<script>window.location.reload();</script>';
	}
	$email=$_POST['email'];
	$password=$_POST['password'];
	$submit=$_POST['submit'];
	if(!empty($email) && !empty($password) && $submit == 'Login') {
		//print_r($_POST);
		$curl = curl_init();
		curl_setopt_array($curl, array(
        CURLOPT_URL => 'https://advisr.com.au/api/authenticate?email='.$email.'&password='.$password,
//		CURLOPT_URL => 'https://advisr.advisrdev.com.au/api/authenticate?email='.$email.'&password='.$password,
		CURLOPT_RETURNTRANSFER => true,
		CURLOPT_ENCODING => '',
		CURLOPT_MAXREDIRS => 10,
		CURLOPT_TIMEOUT => 0,
		CURLOPT_FOLLOWLOCATION => true,
		CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
		CURLOPT_CUSTOMREQUEST => 'POST',
		));
		$response = curl_exec($curl);
		curl_close($curl);
		//echo $response;		
	}
	$result=json_decode($response);
	//echo"token new:  ";print_r($result->token);
	$newtoken=$result->token;
	$message=$result->message;
	if(!empty($newtoken)){
		$apikey_token['apikey']=$newtoken;
	update_option($this->plugin_name, $apikey_token);
	  echo '<script>window.location.reload();</script>';
	}
		?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<div class="wrap">

    <h1><img class="advisr_logo" style="width: 20px;margin-top: 0;margin-right: 10px;margin-bottom: -2px;" src="<?php echo plugin_dir_url( __FILE__ ).'/logo.png' ?>"><?php echo sanitize_text_field(get_admin_page_title()); ?></h1>
<div class="adivsr_seeting_page">
<div class="adivsr_tab">
  <button class="adivsr_tablinks" onclick="openCity(event, 'welcome')" id="defaultOpen">Welcome</button>
  <button class="adivsr_tablinks" onclick="openCity(event, 'team-page')">Team Page</button>
  <button class="adivsr_tablinks" onclick="openCity(event, 'reviews-integration')">Reviews Integration</button>
</div>
<div class="adivsr_right_side">
<div id="welcome" class="adivsr_tabcontent">
 
	 
	<h3><?php _e( 'Welcome to the Advisr Toolbox', 'adviser_plugin' ); ?></h3>
	
     <p><?php _e( 'The Advisr Toolbox allows insurance brokerages to make instant and real time updates to their Wordpress website using their insurance brokerage data on Advisr. You can find Advisr at <a href="https://www.advisr.com.au/">www.advisr.com.au</a>', 'adviser_plugin' ); ?> </p>
	 
	  <p><?php _e( 'The Advisr Toolbox includes functionality to', 'adviser_plugin' ); ?> </p>
	  <ul style="list-style: disc;margin-left: 30px;">
	    <li><?php _e( 'instantly build the team page on your brokerage website and') ?></li>
	    <li><?php _e( 'add your Google and Advisr Reviews to your website.') ?></li>
	  </ul>
	 <p><?php _e( 'As your Advisr data updates, eg. a new review or team member, your Wordpress website will be updated in real time.', 'adviser_plugin' ); ?> </p>
	<?php  if(empty($apikey)){ ?>
		<h2><?php _e( 'Getting Started - Connecting Advisr to your Wordpress Site.', 'adviser_plugin' ); ?></h2>
         <p><?php _e( 'To connect your data via our APIs simply login to your Advisr brokerage account.', 'adviser_plugin' ); ?></p>
	<?php } ?>
				<div class="adiver_login">
				<?php if(!empty($apikey)){
							?>
							<div class="advisr_connect_bulider">
							</div>
							<form method="post">
							<input type="hidden" name="disconnect" value="Disconnect" />
							<input type="submit" name="submit" value="Disconnect from Advisr" class="button button-primary disconnect_advisr">
						
						</form>
                    <p>Need help? Connect with <a href="mailto:support@advisr.com.au">support@advisr.com.au</a> </p>
						<?php	
						} else{ ?>
				    <h3>Login to Advisr</h3>
					<p class="error"><?php echo $message; ?></p>
					<form method="post">
						<div class="input-group">
							<label>Email: </label><input class="input-group-field email" type="email" name="email" placeholder="Email" required />	</div>
							<div class="input-group">	<label>Password: </label><input name="password" class="input-group-field password" type="password" placeholder="Password" />
							</div>
								<a href="https://advisr.com.au/password/reset" class="forget_pass">Forgot Password?</a><br><br>
								<input type="submit" name="submit" value="Login" class="button button-primary ">
						</form>
						<?php	
						}  ?>
				</div>
			

		

		<hr>
<?php if(empty($apikey)){
							?>
		<div class="welcome-help">

						<h4 style="margin-bottom:0;">Don’t have an Advisr account?</h4>
					<p>To use the Advisr Toolbox you will need to have an Advisr brokerage account. To
					see if you have an Advisr account search for your brokerage at
					<a href="https://www.advisr.com.au/">www.advisr.com.au</a></p>
					<p>Register your brokerage <a href="https://advisr.com.au/register" class="register_btn">here.</a></p> <br>
					<p><strong>Need help? Connect with <a href="mailto:support@advisr.com.au">support@advisr.com.au</a> </strong></p>
		</div>
<?php }?>


	 
</div>

<div id="team-page" class="adivsr_tabcontent">
    <h3><?php _e( 'Team Pages', 'adivsr_plugin' ); ?></h3>
		<p>Instantly build the team page on your brokerage website. Bring together your
		broker team as they appear on Advisr with your other team members into a single
		team page.
		</p>
		<div class="advisr_connect_login">
		<h4 style="margin:0;">Step 1:</h4>
		<h4 style="margin:0;">Connect Advisr to your Wordpress Site</h4>
		<h4 style="margin-bottom:0;">Status</h4>
		<div class="advisr_connect_bulider"></div>
		<h4 style="margin-bottom:0;">Step 2:</h4>
		<h4 style="margin:0;">Set up your Advisr Broker Team</h4>
		Add, order, edit or remove your Advisr broker team <a href="<?php echo site_url() ?>/wp-admin/edit.php?post_type=advisr-team-member&page=advisr-brokers">here.</a> 
		<p>This includes your client-facing directors, brokers and broker assistants who have
		an Advisr Broker profile.</p>
		<h4 style="margin-bottom:0;">Step 3:</h4>
		<h4 style="margin:0;">Set up the rest of your Team</h4>
		<p>
		Add, order, edit or remove your other team members <a href="<?php echo site_url() ?>/wp-admin/edit.php?post_type=advisr-team-member">here</a>. </p>
		<p>This includes management team, claims staff or administrative staff who do not
		have an Advisr Broker profile.</p>
		<h4 style="margin-bottom:0;">Step 4: Create your Page</h4>
		Add this code anywhere on your site to instantly create create your team page
		<h4 style="margin:15px 0;">[advisr-team-page]</h4>
		</div>

		<div class="help_part">
		<h4 style="margin-bottom:0;">Keeping your Team Up to Date</h4>
		<p>As your Advisr data updates, your Wordpress website will be updated in real time.
		This includes adding and removing team members on Advisr, new reviews your
		team members receive and any changes to phone numbers and more.<p><br>
		<p><strong>Need help? Connect with <a href="mailto:support@advisr.com.au">support@advisr.com.au</a> </strong></p>
		</div>
 
</div>

<div id="reviews-integration" class="adivsr_tabcontent">
  <h3><?php _e( 'Reviews Integration', 'adivsr_plugin' ); ?></h3>
<?php 	$save_color = $_POST['submit'];
			$slider_text_color = $_POST['slider_text_color'];
			if (!empty($slider_text_color) && $save_color =='Save Text Color') {
			    update_option('slider_text_color',$slider_text_color);
			}
				$slider_text_color = get_option('slider_text_color');
				if(empty($slider_text_color)){
					$slider_text_color='#000';
				}
				?>
   <p>Instantly add both your Advisr and Google reviews to any part of your brokerage
website. All reviews received on Advisr for either your brokerage or team will
appear.
</p>
	<div class="advisr_connect_login">
	<h4 style="margin-bottom:0;">Step 1:</h4>
	<h4 style="margin:0;">Connect Advisr to your Wordpress Site</h4>
	<h4 style="margin-bottom:0;">Status</h4>
	<div class="advisr_connect_bulider"></div>
	<h4 style="margin-bottom:0;">Step 2:</h4>
	<h4 style="margin:0;">Determine your colour scheme</h4>
	<form method="post" name="advisr_toolbox_color" >
	<p style="margin:0;">Specify the colour of your reviews text: </p>
	<label> <input type="color" value="<?php echo $slider_text_color; ?>" name="slider_text_color"></label> 
	<?php submit_button('Save Text Color', 'primary','submit', TRUE); ?>
	</form>
	<h4 style="margin:0;">Step 3:</h4>
	<h4 style="margin:0;">Add your reviews</h4>
	<p>Add this code anywhere on your site to instantly add your reviews</p>
	<h4 style="margin:15px 0;">[advisr-reviews]</h4>
		
	</div>
<div class="review_inter">
		<h4 style="margin-bottom:0;">Including your Google Reviews</h4>
		<p>Be sure to integrate your Google Reviews onto your Advisr brokerage profile in
		order to see your Google Reviews appear on your Wordpress Site. Login <a href="https://advisr.com.au/login">here</a> to connect your Google Reviews in Advisr.  </p>
		<br>
		<p><strong>Need help? Connect with <a href="mailto:support@advisr.com.au">support@advisr.com.au</a> </strong> </p>
		</div>
</div>


	</div>
	</div>
	
  <!--  <form method="post" name="advisr_toolbox_options" action="options.php">

		<h3>Step 1</h3>-->
		<!-- Advisr API access key -->
		<!--<p><strong>(<span style="color: red">*</span> Required)</strong> Fill in your Advisr API access key below . To get one, please contact <a href="mailto: support@advisr.com.au">Advisr support</a> with your account email or company name.</p>
        
		<fieldset>
			<legend class="screen-reader-text"><span><?php _e('Advisr API access key', $this->plugin_name); ?></span></legend>
			<textarea type="text" required class="regular-text" id="<?php echo $this->plugin_name; ?>-apikey" name="<?php echo $this->plugin_name; ?>[apikey]" value="<?php if(!empty($apikey)) echo $apikey; ?>" rows="8" placeholder="eg. kjhgafysd65f865ehgf8ehgfsdfr3876rytesd67tywgjrjhasdfyugrhi6fyghrafisd6ftykgjehrfiae76rtyigefe9274567sdkcnmbd23e98w7esd8fasdhfbqr8a76erthbweof87v4gk5jrhag78wbl4efseo87uib"><?php if(!empty($apikey)) echo $apikey; ?></textarea>
		</fieldset>
        <?php submit_button('Save Access Token', 'primary','submit', TRUE); ?>
		
		<textarea type="text" class="regular-text" style="display: none" id="<?php echo $this->plugin_name; ?>-advisr_brokers_config" name="<?php echo $this->plugin_name; ?>[advisr-brokers-config]" value="<?php if(!empty($advisr_brokers_config)) echo $advisr_brokers_config; ?>" rows="8" placeholder="eg. kjhgafysd65f865ehgf8ehgfsdfr3876rytesd67tywgjrjhasdfyugrhi6fyghrafisd6ftykgjehrfiae76rtyigefe9274567sdkcnmbd23e98w7esd8fasdhfbqr8a76erthbweof87v4gk5jrhag78wbl4efseo87uib"><?php if(!empty($advisr_brokers_config)) echo $advisr_brokers_config; ?></textarea>
		<h3>Step 2</h3>
		<p class="regular-text">Manage your internal team members <a href="edit.php?post_type=advisr-team-member">here</a>.</p>
		<br/>

		<h3>Step 3</h3>
		<p class="regular-text">Organise your Advisr generated team members <a href="edit.php?post_type=advisr-team-member&page=advisr-brokers">here</a>.</p>
		<br/>

        <h3>Step 4</h3>
		<p>Paste this code anywhere in your site: <code>[advisr-team-page]</code></p>

    </form>
	  <hr>
	 <form method="post" name="advisr_toolbox_color" >
	 <h3>Advisr Reviews Settings</h3>
	   
	   <label><strong> Reviews Carousel Text Color : </strong> <input type="color" value="<?php echo $slider_text_color; ?>" name="slider_text_color"></label> 
	   
	  <?php //submit_button('Save Text Color', 'primary','submit', TRUE); ?>
	 </form>-->

</div>

<script>
function openCity(evt, cityName) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("adivsr_tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("adivsr_tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();
</script>	
<script>
	jQuery(document).ready(function() {
		init();
	   jQuery(".disconnect_advisr").click(function(){
			if(confirm("Are you sure?")){
			  			   
		}
		else{
			return false;
		}	
	});
	});

	jQuery(document).on('input', '.advisr-broker-order', function(event) {
		// get advisr brokers config value
		let advisrBrokersConfig = (jQuery('#advisr-brokers-config').val() && jQuery('#advisr-brokers-config').val() !== '[]') ? jQuery('#advisr-brokers-config').val() : [];
		
		if (typeof(advisrBrokersConfig) === 'string') {
			advisrBrokersConfig = JSON.parse(advisrBrokersConfig);
		}
		if (typeof(advisrBrokersConfig) === 'string') {
			advisrBrokersConfig = JSON.parse(advisrBrokersConfig);
		}

		// check if update current id exists in array, if yes, update order value, 
		let match = 0;
		for (var i = 0; i < advisrBrokersConfig.length; i++) {
			if (advisrBrokersConfig[i].id === event.target.name) {
				advisrBrokersConfig[i].value = event.target.value;
				match++;
			}
		}
		if (match === 0) {
			advisrBrokersConfig.push({
				id: event.target.name,
				value: event.target.value
			})
		}
		jQuery('#advisr-brokers-config').val(JSON.stringify(JSON.stringify(advisrBrokersConfig)));
	})

	async function init () {
		let advisrBrokerageWithBrokersAndReviews = []
		try {
			advisrBrokerageWithBrokersAndReviews = await fetchFromAdvisrApi("<?php echo $apikey; ?>");
		} catch (error) {
			throw new Error(error);
		}

		render(advisrBrokerageWithBrokersAndReviews.data);
		
		// check if config param advisr-brokers-config is set. If set, iterate and search for input name assigned to broker id, set the input value as the value
		let advisrBrokersConfig;

		<?php if(!empty($advisr_brokers_config)) { ?>
			advisrBrokersConfig = JSON.parse(<?php echo $advisr_brokers_config; ?>);

			if (typeof(JSON.parse(<?php echo $advisr_brokers_config; ?>)) === 'string') {
				advisrBrokersConfig = JSON.parse(advisrBrokersConfig);			}
			
				advisrBrokersConfig.forEach(function (advisrBrokersConfigItem) {
				if (jQuery(`#${advisrBrokersConfigItem.id}`).length === 1) {
					jQuery(`#${advisrBrokersConfigItem.id}`).val(advisrBrokersConfigItem.value)
				}
			});
		<?php } ?>
	} 
	
	async function fetchFromAdvisrApi(apikey) {
		const url = `https://advisr.com.au/api/v2/brokerages`;
		// const url = `https://advisr.advisrdev.com.au/api/v2/brokerages`;

		var myHeaders = new Headers();
		myHeaders.append("Authorization", `Bearer ${apikey}`);

		var requestOptions = {
			method: 'GET',
			headers: myHeaders,
			redirect: 'follow'
		};

		try {
			const res = await fetch(url, requestOptions);
			return await res.json();
		} catch {
			console.log("Error");
		}
	}

	function render(advisrBrokerageWithBrokersAndReviews) {
	
		let advisr_connect = '';

		if (advisrBrokerageWithBrokersAndReviews && advisrBrokerageWithBrokersAndReviews.brokers && advisrBrokerageWithBrokersAndReviews.brokers.length > 0) {
			
			advisr_connect += '<p class="regular-text"><i class="dashicons-before dashicons-yes-alt" style="color: green"></i> Successfully connected to Advisr.</p>';
		} else {
			advisr_connect += '<p class="regular-text"><i class="dashicons-before dashicons-dismiss" style="color: red"></i> Not connected to Advisr. Connect <a href="options-general.php?page=advisr-toolbox">here</a></p>';
		
		}
           jQuery(".advisr_connect_bulider").html(advisr_connect);


	}
</script>