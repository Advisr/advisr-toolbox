=== Advisr Toolbox ===
Contributors: evthedev, advisr
Donate link: https://advisr.com.au
Tags: insurance, insurtech, team, members
Requires PHP: 5.6 or higher
Requires at least: 4.7
Tested up to: 5.5
Stable tag: 4.3
License: GPLv2 or later
License URI: http://www.gnu.org/licenses/gpl-2.0.html

Connect your native data with Advisr data to create dynamic team pages and more.

== Description ==

This plugin relies on Advisr.com.au, as a third party service that provides data that drives this plugin's functionality. Specifically, when this plugin is implemented on a page, it makes a single GET request to the Advisr REST API, using Javascript Fetch API, and receives the response which it then renders on the page. All API calls must be authenticated by an access token that Advisr securely provides to the plugin user.

For more info on this service provider: https://advisr.com.au
API documentation: https://advisr.com.au/api/doc
Terms and Conditions: https://advisr.com.au/privacy-policy/#TermsAndConditions
Privacy Policy: https://advisr.com.au/privacy-policy


Features available:
* Team pages

Feature roadmap:
* Advisr Reviews
* Google My Business Reviews
* Leads submission
* Reviews submissions

== Installation ==

1. Upload `advisr-toolbox.php` to the `/wp-content/plugins/` directory.
2. Activate the plugin through the 'Plugins' menu in WordPress.
3. Insert your Advisr API access token.
4. Create internal team members.
5. Organise Advisr team members.
6. Paste this code anywhere in your site: `[advisr-team-page]`


== Frequently Asked Questions ==

== Screenshots ==

== Changelog ==

= v2.1 =
* Updated the look and feel of Advisr Team Pages

= v0.1 =
* Create and edit internal team members
* Meta data for internal team members: Order, Role, Mobile and Telephone
* Parametrised Advisr API token
* Added shortcode capability
* Plugin settings page
* Advisr data settings page
* Sort external Advisr data
* Team page listing
* Individual broker modals

== Upgrade Notice ==
