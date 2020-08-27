<?php

/**
 * Provide a admin area view for the plugin
 *
 * This file is used to markup the admin-facing aspects of the plugin.
 *
 * @link       https://advisr.com.au
 * @since      1.0.0
 *
 * @package    Advisr_Team_Pages
 * @subpackage Advisr_Team_Pages/admin/partials
 */
?>

<!-- This file should primarily consist of HTML with a little bit of PHP. -->
<div class="wrap">

    <h1><?php echo esc_html(get_admin_page_title()); ?></h1>

    <form method="post" name="advisr_team_page_options" action="options.php">

		<?php
			//Grab all options
			$options = get_option($this->plugin_name);

			// Cleanup
			$apikey = $options['apikey'];
			$members_before = $options['members-before'];
			$members_after = $options['members-after'];
			// $body_class_slug = $options['body_class_slug'];
			// $jquery_cdn = $options['jquery_cdn'];
			// $cdn_provider = $options['cdn_provider'];
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
			<textarea type="text" required class="regular-text" id="<?php echo $this->plugin_name; ?>-apikey" name="<?php echo $this->plugin_name; ?>[apikey]" value="<?php if(!empty($apikey)) echo $apikey; ?>" rows="5" placeholder="eg. kjhgafysd65f865ehgf8ehgfsdfr3876rytesd67tywgjrjhasdfyugrhi6fyghrafisd6ftykgjehrfiae76rtyigefe9274567sdkcnmbd23e98w7esd8fasdhfbqr8a76erthbweof87v4gk5jrhag78wbl4efseo87uib"><?php if(!empty($apikey)) echo $apikey; ?></textarea>
		</fieldset>
		<br/>

		<h3>Step 2</h3>
		<p class="regular-text">Manage your internal team members <a href="edit.php?post_type=advisr-team-member">here</a>.</p>
		<br/>

		<h3>Step 3</h3>
		<p class="regular-text">Configure below.</p>
        <!-- Show internal team members before Advisr brokers -->
        <fieldset>
            <legend class="screen-reader-text"><span>Show internal team members before Advisr brokers</span></legend>
            <label for="<?php echo $this->plugin_name; ?>-members-before">
                <input type="checkbox" id="<?php echo $this->plugin_name; ?>-members-before" name="<?php echo $this->plugin_name; ?>[members-before]" value="1" <?php checked($members_before, 1); ?>/>
                <span><?php esc_attr_e('Show internal team members categorised under \'before Advisr brokers\'.', $this->plugin_name); ?></span>
            </label>
		</fieldset>
		
        <!-- Show internal team members after Advisr brokers -->
        <fieldset>
            <legend class="screen-reader-text"><span>Show internal team members after Advisr brokers</span></legend>
            <label for="<?php echo $this->plugin_name; ?>-members-after">
                <input type="checkbox" id="<?php echo $this->plugin_name; ?>-members-after" name="<?php echo $this->plugin_name; ?>[members-after]" value="1" <?php checked($members_after, 1); ?>/>
                <span><?php esc_attr_e('Show internal team members categorised under \'after Advisr brokers\'.', $this->plugin_name); ?></span>
            </label>
        </fieldset>
        <!-- remove injected CSS from comments widgets -->
        <!-- <fieldset>
            <legend class="screen-reader-text"><span>Remove Injected CSS for comment widget</span></legend>
            <label for="<?php echo $this->plugin_name; ?>-comments_css_cleanup">
                <input type="checkbox" id="<?php echo $this->plugin_name; ?>-comments_css_cleanup" name="<?php echo $this->plugin_name; ?>[comments_css_cleanup]" value="1"/>
                <span><?php esc_attr_e('Remove Injected CSS for comment widget', $this->plugin_name); ?></span>
            </label>
        </fieldset> -->

        <!-- remove injected CSS from gallery -->
        <!-- <fieldset>
            <legend class="screen-reader-text"><span>Remove Injected CSS for galleries</span></legend>
            <label for="<?php echo $this->plugin_name; ?>-gallery_css_cleanup">
                <input type="checkbox" id="<?php echo $this->plugin_name; ?>-gallery_css_cleanup" name="<?php echo $this->plugin_name; ?>[gallery_css_cleanup]" value="1" />
                <span><?php esc_attr_e('Remove Injected CSS for galleries', $this->plugin_name); ?></span>
            </label>
        </fieldset> -->

        <!-- add post,page or product slug class to body class -->
        <!-- <fieldset>
            <legend class="screen-reader-text"><span><?php _e('Add Post, page or product slug to body class', $this->plugin_name); ?></span></legend>
            <label for="<?php echo $this->plugin_name; ?>-body_class_slug">
                <input type="checkbox" id="<?php echo $this->plugin_name;?>-body_class_slug" name="<?php echo $this->plugin_name; ?>[body_class_slug]" value="1" />
                <span><?php esc_attr_e('Add Post slug to body class', $this->plugin_name); ?></span>
            </label>
        </fieldset> -->

        <!-- load jQuery from CDN -->
        <!-- <fieldset>
            <legend class="screen-reader-text"><span><?php _e('Load jQuery from CDN instead of the basic wordpress script', $this->plugin_name); ?></span></legend>
            <label for="<?php echo $this->plugin_name; ?>-jquery_cdn">
                <input type="checkbox"  id="<?php echo $this->plugin_name; ?>-jquery_cdn" name="<?php echo $this->plugin_name; ?>[jquery_cdn]" value="1" />
                <span><?php esc_attr_e('Load jQuery from CDN', $this->plugin_name); ?></span>
            </label>
                    <fieldset>
                        <p>You can choose your own cdn provider and jQuery version(default will be Google Cdn and version 1.11.1)-Recommended CDN are <a href="https://cdnjs.com/libraries/jquery">CDNjs</a>, <a href="https://code.jquery.com/jquery/">jQuery official CDN</a>, <a href="https://developers.google.com/speed/libraries/#jquery">Google CDN</a> and <a href="http://www.asp.net/ajax/cdn#jQuery_Releases_on_the_CDN_0">Microsoft CDN</a></p>
                        <legend class="screen-reader-text"><span><?php _e('Choose your prefered cdn provider', $this->plugin_name); ?></span></legend>
                        <input type="url" class="regular-text" id="<?php echo $this->plugin_name; ?>-cdn_provider" name="<?php echo $this->plugin_name; ?>[cdn_provider]" value=""/>
                    </fieldset>
        </fieldset> -->

        <?php submit_button('Save changes', 'primary','submit', TRUE); ?>

    </form>

</div>