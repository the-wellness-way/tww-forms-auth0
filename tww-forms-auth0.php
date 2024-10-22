<?php
/**
 * Plugin Name: TWW Forms Auth0
 * Description: Custom forms for TWW Plus registration using Auth0
 * Version: 1.0.0
 * Author: The Wellness Way
 * Author URI: https://www.thewellnessway.com
 * License: GPL2
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: tww-forms
 * Domain Path: /languages
 */

 if(!defined('ABSPATH')) {
     exit;
 }

 if(!defined('TWW_FORMS_AUTH0_PLUGIN_FILE')) {
     define('TWW_FORMS_AUTH0_PLUGIN_FILE', __FILE__);
 }

 if(!defined('TWW_FORMS_AUTH0_PLUGIN')) {
     define('TWW_FORMS_AUTH0_PLUGIN', plugin_dir_path(__FILE__));
 }  

 if(!defined('TWW_FORMS_AUTH0_PLUGIN_URL')) {
     define('TWW_FORMS_AUTH0_PLUGIN_URL', plugin_dir_url(__FILE__));
 }

 if(!defined('TWW_FORMS_AUTH0_ASSETS_VERSION')) {
     define('TWW_FORMS_AUTH0_ASSETS_VERSION', '1.1.42');
 }

 require_once 'vendor/autoload.php';

if (!is_plugin_active('memberpress/memberpress.php')) {
    add_action('admin_notices', function() {
        echo '<div class="error"><p>Error: MemberPress must be active for My Custom Plugin to function.</p></div>';
    });

    return;
}

use TwwFormsAuth0\Routes\TwwfRegisterRoute;

$twwfRegisterRoute = new TwwfRegisterRoute();
add_action('rest_api_init', [$twwfRegisterRoute, 'boot']);

use TwwFormsAuth0\Shortcodes\TwwfAuth0ModalLinkShortcode;
$twwfAuth0ModalLinkShortcode = new TwwfAuth0ModalLinkShortcode();

use TwwFormsAuth0\Shortcodes\TwwfCheckoutShortcode;
$twwfAuth0ModalLinkShortcode = new TwwfCheckoutShortcode();

use TwwFormsAuth0\Includes\TwwfAuth0Login;
$twwfAuth0Login = new TwwfAuth0Login();

use TwwFormsAuth0\Flows\TwwfPrelogin;
$twwfPrelogin = new TwwfPrelogin();

use TwwFormsAuth0\Shortcodes\TwwfAuth0TokenLinkShortcode;
$twwfAuth0TokenLinkShortcode = new TwwfAuth0TokenLinkShortcode();

add_action('validate_username', '__return_true');

function enqueue_tww_forms_auth0_webpack() {  
    $version = false !== strpos($_SERVER['HTTP_HOST'],'localhost') ? null : TWW_FORMS_AUTH0_ASSETS_VERSION;

    $file = false !== strpos($_SERVER['HTTP_HOST'],'localhost') ? 'main' : 'index';
    $url = TWW_FORMS_AUTH0_PLUGIN_URL . 'resources/dist/' . $file . '.bundle.js';

    wp_register_script('tww-forms-auth0-webpack', $url, array(), $version, true);
    wp_enqueue_script('tww-forms-auth0-webpack');
    $localized_object = [
        'tww_forms_auth0' => [
            'active' => true
        ]
    ];
    wp_localize_script('tww-forms-auth0-webpack', 'tww_forms_auth0', $localized_object);
}

add_action('wp_enqueue_scripts', 'enqueue_tww_forms_auth0_webpack', 12);

