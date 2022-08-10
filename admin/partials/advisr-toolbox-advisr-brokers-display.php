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

<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<div class="wrap">

    <h1><?php echo sanitize_text_field(get_admin_page_title()); ?> <a href="https://www.advisr.com.au/login" class="page-title-action">Add or Remove Broker Team Member</a></h1> 
     <form method="post" name="advisr_toolbox_options" action="options.php">

		<?php
			//Grab all options
			$options = get_option($this->plugin_name);

			// Cleanup
			$apikey = $options['apikey'];
			$advisr_brokers_config = $options['advisr-brokers-config'];
		?>

		<?php
			settings_fields($this->plugin_name);
			do_settings_sections($this->plugin_name);
		?>

		<h3>Status</h3>
		<?php if (empty($apikey)) { ?>
		<div class="advisr_connect">
			<!--<p class="regular-text">Enter your API key <a href="options-general.php?page=advisr-toolbox">here</a>.</p>-->
			<!--<p class="regular-text"><i class="dashicons-before dashicons-dismiss" style="color: red"></i> Not connected to Advisr</p>
			<p style="width: 30em;" class="regular-text">Go to <a href="options-general.php?page=advisr-toolbox">Advisr Toolbox Settings</a>  to connect your Advisr brokers.</p>-->
		   </div>
		<?php } else { ?>
		<div class="advisr_connect">
		<!--	<p class="regular-text"><i class="dashicons-before dashicons-yes-alt" style="color: green"></i> Successfully connected to Advisr.</p> -->
		 </div>
		<?php } ?>
		<input type="hidden" class="regular-text" id="<?php echo $this->plugin_name; ?>-apikey" name="<?php echo $this->plugin_name; ?>[apikey]" value="<?php if(!empty($apikey)) echo $apikey; ?>"></input>
		</br />
        <?php if (!empty($apikey)) { ?>
		<h3>Broker Configuration</h3>
		<a class="button button-primary" style="cursor: pointer;" href="https://www.advisr.com.au/login">Add or Remove Broker Team Member</a>
		<p class="regular-text">Customise order of Advisr brokers.</p>

		<advisr-team-page></advisr-team-page>

        <?php submit_button('Save changes', 'primary','submit', TRUE); ?>
		 <?php } ?>

    </form>

</div>

<script>
	jQuery(document).ready(function() {
		init();
	})

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
		const template = document.createElement('template');

		template.innerHTML += `
		<style>
			.m-0 {
				margin: 0;
			}
			.mb-1, .my-1 {
				margin-bottom: .25rem;
			}
			.mb-2, .my-2 {
				margin-bottom: .5rem;
			}
			.mt-2, .my-2 {
				margin-top: .5rem!important;
			}
			.mb-3, .my-3 {
				margin-bottom: 1rem;
			}
			.mb-4, .my-4 {
				margin-bottom: 1.5rem;
			}
			.mb-5, .my-5 {
				margin-bottom: 3rem;
			}
			.ml-0, .mx-0 {
				margin-left: 0;
			}
			.mr-0, .mx-0 {
				margin-right: 0;
			}
			.mb-auto, .my-auto {
				margin-bottom: auto;
			}


			.d-flex {
				display: -webkit-box;
				display: flex;
			}
			.flex-row {
				-webkit-box-orient: horizontal;
				-webkit-box-direction: normal;
				flex-direction: row;
			}
			.flex-column {
				-ms-flex-direction: column;
				flex-direction: column;
			}
			.align-items-center {
				-ms-flex-align: center!important;
				align-items: center!important;
			}
			.justify-content-between {
				-webkit-box-pack: justify;
				justify-content: space-between;
			}
			.list-inline {
				padding-left: 0;
				margin-top: 0;
				margin-bottom: 0.5rem;
				list-style: none;
			}
			.list-inline-item {
				display: inline-block;
			}
			.list-inline-item:not(:last-child) {
				margin-right: .2rem;
			}
			.text-warning {
				color: #ffc107;
			}
			.image {
				object-fit: cover;
			}
			.custombox-lock {
				overflow: auto;
			}
			.u-custombox-no-scroll.custombox-lock {
				margin-right: 1.0625rem;
				overflow: hidden;
			}
			.custombox-content, .custombox-overlay {
				width: 100vw;
			}
			.u-modal-window {
				display: none;
				max-height: 85vh;
				width: 680px;
			}
			.w-100 {
				width: 100%;
			}
			
			.image {
				max-width: 100%;
			}
			.embed-responsive {
				position: relative;
				display: block;
				width: 100%;
				padding: 0;
				overflow: hidden;
			}
			.embed-responsive-1by1::before {
				padding-top: 100%;
			}
			.embed-responsive::before {
				display: block;
				content: "";
			}
			.embed-responsive .embed-responsive-item, .embed-responsive embed, .embed-responsive iframe, .embed-responsive object, .embed-responsive video {
				position: absolute;
				top: 0;
				bottom: 0;
				left: 0;
				width: 100%;
				height: 100%;
				border: 0;
			}
		

			.row {
				display: -ms-flexbox;
				display: flex;
				-ms-flex-wrap: wrap;
				flex-wrap: wrap;
				margin-right: -7.5px;
				margin-left: -7.5px;
			}

			[class*="col-"] {
				position: relative;
				width: 100%;
				padding-right: 7.5px;
				padding-left: 7.5px;
			}
			.col-12 {
				-ms-flex: 0 0 100%;
				flex: 0 0 100%;
				max-width: 100%;
			}

			@media (min-width: 576px) {
				.container, .container-sm {
					max-width: 540px;
				}
				.col-sm-6 {
					-ms-flex: 0 0 50%;
					flex: 0 0 50%;
					max-width: 50%;
				}
			}

			@media (min-width: 768px) {
				.container, .container-md, .container-sm {
					max-width: 720px;
				}
				.col-md-4 {
					-ms-flex: 0 0 33.333333%;
					flex: 0 0 33.333333%;
					max-width: 33.333333%;
				}
			}

			@media (min-width: 992px) {
				.container, .container-lg, .container-md, .container-sm {
					max-width: 960px;
				}
				.col-lg-3 {
					-ms-flex: 0 0 25%;
					flex: 0 0 25%;
					max-width: 25%;
				}
			}

			@media (min-width: 1200px) {
				.container, .container-lg, .container-md, .container-sm, .container-xl {
					max-width: 1140px;
				}
			}

			@media  screen and (max-width: 720px) {
				.u-modal-window {
					width: 95vw;
				}
				.grecaptcha-badge{
					display: none !important;
				}
			}

		</style>
		<div id='members-wrapper' style="max-width: 500px; width: 100%;"></div>`;

		let fragment = document.importNode(template.content, true);

		let membersHtml = '';
		let advisr_connect = '';

		if (advisrBrokerageWithBrokersAndReviews && advisrBrokerageWithBrokersAndReviews.brokers && advisrBrokerageWithBrokersAndReviews.brokers.length > 0) {
			membersHtml += `<div class="row">`;
			advisrBrokerageWithBrokersAndReviews.brokers.forEach((member) => {
				membersHtml += `<div class="team-member-item d-flex flex-column justify-content-between d-flex col-12 col-sm-6 col-md-4 col-lg-3 mb-4">`;
				const imageHtml = member.avatar_url ? `<div class="team-member-image embed-responsive embed-responsive-1by1 mb-1"><img src="${member.avatar_url}" class="image img-fluid embed-responsive-item "></div>` : '';
				const nameHtml = member.name ? `<div class="team-member-name mb-auto regular-text"><h4 class="name m-0">${member.name}</h4></div>` : '';
				const orderHtml = `<div class="team-member-wrapper d-flex align-items-center justify-content-between mt-2"><label for="advisr-order-${member.id}">Order:</label><input type="number" class="advisr-broker-order" id="advisr-order-${member.id}" name="advisr-order-${member.id}" value="<?php if(!empty($apikey)) echo $apikey; ?>"placeholder="eg. 2" style="width: 60px"/></div>`;
				membersHtml += imageHtml  + nameHtml + orderHtml;
				membersHtml += '</div>';
			});
			const stringifiedConfig = <?php echo (string) $advisr_brokers_config; ?>;
			membersHtml += `<input type="hidden" id="advisr-brokers-config" name="<?php echo $this->plugin_name; ?>[advisr-brokers-config]" value=${stringifiedConfig}>`;
			membersHtml += '</div>';
			advisr_connect += '<p class="regular-text"><i class="dashicons-before dashicons-yes-alt" style="color: green"></i> Successfully connected to Advisr.</p>';
		} else {
			membersHtml = '<p>No brokers found.</p>';
			advisr_connect += '<p class="regular-text"><i class="dashicons-before dashicons-dismiss" style="color: red"></i> Not connected to Advisr. Connect <a href="options-general.php?page=advisr-toolbox">here</a></p>';
			
		}
           jQuery(".advisr_connect").html(advisr_connect);
            jQuery(".advisr_connect_bulider").html(advisr_connect);
         
		fragment.querySelector('#members-wrapper').innerHTML = membersHtml;
		const component = document.querySelector('advisr-team-page');
		component.appendChild(fragment);

	}
</script>