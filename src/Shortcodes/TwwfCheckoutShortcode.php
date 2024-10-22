<?php
namespace TwwFormsAuth0\Shortcodes;

use MeprProduct;
use TwwFormsAuth0\Includes\TwweStripeGateway;
use TwwFormsAuth0\Controllers\TwweSubscriptionsCtrl;

class TwwfCheckoutShortcode extends TwwfShortcodes {
    private $txn;

    private $sub;

    private $invoice_html = '';

    public function set_sc_settings() {
        $this->sc_settings = [
            'name' => 'twwf_checkout',
            'handle' => 'twwf-checkout-shortcode',
            'css_handle' => 'twwf-checkout-shortcode',
            'script_deps' => ['mepr-checkout-js'],
        ];
    }

    public function __construct() {
        parent::__construct();

        add_action('wp_enqueue_scripts', [$this, 'enqueue_stripe_scripts']);
    }

    public function render_shortcode($atts, $content = null) {
        $atts = shortcode_atts([
            'class' => 'tww-checkout',
        ], $atts);

        $mepr_options = \MeprOptions::fetch();
        $integrations = $mepr_options->integrations;
        $first_element = array_values($integrations)[0];
        $post_id = get_the_ID();
        $membership_id  = get_post_meta($post_id, 'membership_id', true);
        $user = !empty(get_current_user_id()) ? new \MeprUser(get_current_user_id()) : null;
        $product = new MeprProduct($membership_id);
        $coupon_code = isset($_GET['coupon_code']) ? sanitize_text_field($_GET['coupon_code']) : null;
        $coupon = $coupon_code ? \MeprCoupon::get_one_from_code($coupon_code) : false;
        $gateway = new \MeprStripeGateway();
        $last_active_subscription = TwweSubscriptionsCtrl::get_last_subscription() ?? null;
        
        if($product && $gateway) {
            $gateway->load($first_element);
            $gateway_id = $gateway->id;

            list($txn, $sub) = \MeprCheckoutCtrl::prepare_transaction(
                $product,
                0,
                $user instanceof \MeprUser ? $user->ID : 0,
                $gateway->id,
                $coupon,
                false
            );
            
            $amount = (float) ($sub->trial && $sub->trial_days > 0 ? $sub->trial_total : $sub->total);

            if($txn) {
                $this->txn = $txn;
                $this->sub = $sub;

                $this->set_invoice_html();
            }

            $product_title = $product->post_title;
            $price = $txn->amount;
        }             

        if($this->sc_settings['handle']) {
            wp_enqueue_script($this->sc_settings['handle']);

            $localized_object = [
                'price' => $price,
                'membership_id' => $membership_id,
                'gateway_id' => $gateway_id,
                'product_title' => $product_title,
                'coupon_code' => $coupon_code,
            ];  
            
            wp_localize_script($this->sc_settings['handle'], 'twwFormsRegister', $localized_object);
        }

        if($this->sc_settings['css_handle']) {
            wp_enqueue_style($this->sc_settings['css_handle']);
        }

        $payment_methods = $product->payment_methods();
        $payment_methods = \MeprHooks::apply_filters('mepr_options_helper_payment_methods', $payment_methods, 'mepr_payment_method');
        $payment_methods = array_map(function($pm_id) use($mepr_options) {
            return $mepr_options->payment_method($pm_id);
        }, $payment_methods);

        ob_start();
            if($last_active_subscription &&  $last_active_subscription->user_id == $user->ID && 'active' == $last_active_subscription->status && $last_active_subscription->product_id == $membership_id) {
                require_once TWW_FORMS_AUTH0_PLUGIN . 'templates/checkout-already-subscribed.php';
            } else {
                require_once TWW_FORMS_AUTH0_PLUGIN . 'templates/checkout.php';
            }
        return ob_get_clean();
    }

    public function enqueue_stripe_scripts() {
        $mepr_options = \MeprOptions::fetch();

        wp_register_script('jquery.payment', MEPR_JS_URL.'/jquery.payment.js', array(), MEPR_VERSION);
        wp_register_script('mepr-checkout-js', MEPR_JS_URL . '/checkout.js', array('jquery', 'jquery.payment'), MEPR_VERSION);
        wp_enqueue_script('jquery');
        wp_enqueue_script('jquery.payment');
        wp_enqueue_script('mepr-checkout-js');
        
        if (wp_script_is('mp-signup', 'enqueued')) {
            wp_dequeue_script('mp-signup');
        }
        $prereqs = \MeprHooks::apply_filters('mepr-signup-styles', []);
        wp_enqueue_script('mp-signup', MEPR_JS_URL.'/signup.js', $prereqs, MEPR_VERSION);

        $local_data = array(
            'coupon_nonce' => wp_create_nonce('mepr_coupons'),
            'spc_enabled'  => ( $mepr_options->enable_spc || $mepr_options->design_enable_checkout_template ),
            'spc_invoice'  => ( $mepr_options->enable_spc_invoice || $mepr_options->design_enable_checkout_template ),
            'no_compatible_pms' => __('There are no payment methods available that can purchase this product, please contact the site administrator or purchase it separately.', 'memberpress'),
            'switch_pm_prompt' => __('It looks like your purchase requires %s. No problem! Just click below to switch.', 'memberpress'),
            'switch_pm' => __('Switch to %s', 'memberpress'),
            'cancel' => __('Cancel', 'memberpress'),
            'warning_icon_url' => MEPR_IMAGES_URL . '/mepr-notice-icon-error.png',
        );
        wp_localize_script('mp-signup', 'MeprSignup', $local_data);

        $twweGateway = new TwweStripeGateway();
        $twweGateway->enqueue_payment_form_scripts();
    }

    public function set_invoice_html() {
        if($this->txn) {
            $this->invoice_html = \MeprTransactionsHelper::get_invoice($this->txn, tmpsub: $this->sub);
        }
    }

    public function render_invoice_html() {
        echo $this->invoice_html;
    }
}