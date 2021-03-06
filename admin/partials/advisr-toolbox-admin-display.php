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

    <h1><?php echo sanitize_text_field(get_admin_page_title()); ?></h1>

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

		<h3>Step 1</h3>
		<!-- Advisr API access key -->
		<p><strong>(<span style="color: red">*</span> Required)</strong> Fill in your Advisr API access key below . To get one, please contact <a href="mailto: support@advisr.com.au">Advisr support</a> with your account email or company name.</p>
        
		<fieldset>
			<legend class="screen-reader-text"><span><?php _e('Advisr API access key', $this->plugin_name); ?></span></legend>
			<textarea type="text" required class="regular-text" id="<?php echo $this->plugin_name; ?>-apikey" name="<?php echo $this->plugin_name; ?>[apikey]" value="<?php if(!empty($apikey)) echo $apikey; ?>" rows="8" placeholder="eg. kjhgafysd65f865ehgf8ehgfsdfr3876rytesd67tywgjrjhasdfyugrhi6fyghrafisd6ftykgjehrfiae76rtyigefe9274567sdkcnmbd23e98w7esd8fasdhfbqr8a76erthbweof87v4gk5jrhag78wbl4efseo87uib"><?php if(!empty($apikey)) echo $apikey; ?></textarea>
		</fieldset>
        <?php submit_button('Save settings', 'primary','submit', TRUE); ?>
		
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

</div>