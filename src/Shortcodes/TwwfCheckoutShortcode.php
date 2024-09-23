<?php
namespace TwwFormsAuth0\Shortcodes;

class TwwfCheckoutShortcode extends TwwfShortcodes {
    public function set_sc_settings() {
        $this->sc_settings = [
            'name' => 'tww_checkout',
            'handle' => 'tww-checkout-shortcode',
            'css_handle' => 'tww-checkout-shortcode',
        ];
    }

    public function __construct() {
        parent::__construct();

        add_action('wp_enqueue_scripts', [$this, 'enqueue_stripe_scripts']);
    }

    public function render_shortcode($atts, $content = null) {
        if($this->sc_settings['handle']) {
            wp_enqueue_script($this->sc_settings['handle']);
        }

        if($this->sc_settings['css_handle']) {
            wp_enqueue_style($this->sc_settings['css_handle']);
        }
        
        $atts = shortcode_atts([
            'class' => 'tww-checkout',
        ], $atts);

        $is_logged_in = is_user_logged_in();

        
            
        require_once TWW_FORMS_AUTH0_PLUGIN . 'templates/checkout.php';
    }

    public function enqueue_stripe_scripts() {
        $mepr_options = \MeprOptions::fetch();
        
        $integrations = $mepr_options->integrations;
        $first_element = array_values($integrations)[0];
        $gateway_id = $first_element['id'];

        wp_register_script('jquery.payment', MEPR_JS_URL.'/jquery.payment.js', array(), MEPR_VERSION);
        wp_register_script('mepr-checkout-js', MEPR_JS_URL . '/checkout.js', array('jquery', 'jquery.payment'), MEPR_VERSION);
        wp_enqueue_script('jquery');
        wp_enqueue_script('jquery.payment');
        wp_enqueue_script('mepr-checkout-js');

        $gateway = new \MeprStripeGateway();
        $gateway->load($first_element);
        $gateway->enqueue_payment_form_scripts();

        $mepr_options = \MeprOptions::fetch();
        
        wp_enqueue_script('mepr-checkout-js');
    }
}