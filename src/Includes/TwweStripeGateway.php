<?php
namespace TwwFormsAuth0\Includes;

class TwweStripeGateway {
    const STRIPE_API_VERSION = '2022-11-15';

    /**
     * This gets called on wp_enqueue_script and enqueues a set of
     * scripts for use on the page containing the payment form
     */
    public function enqueue_payment_form_scripts()
    {
        if (wp_script_is('mepr-stripe-form', 'enqueued')) {
            wp_dequeue_script('mepr-stripe-form');
        }

        $mepr_options = \MeprOptions::fetch();

        wp_enqueue_script('stripe-js', 'https://js.stripe.com/v3/', [], TWW_FORMS_AUTH0_ASSETS_VERSION);
        wp_enqueue_script('twwe-mepr-stripe-form', trailingslashit(TWW_FORMS_AUTH0_PLUGIN_URL) . 'resources/assets/js/gateways/form.js', ['stripe-js', 'mepr-checkout-js', 'jquery.payment'], TWW_FORMS_AUTH0_ASSETS_VERSION);

        $l10n = [
            'api_version' => self::STRIPE_API_VERSION,
            'currency' => strtolower($mepr_options->currency_code),
            'payment_information_incomplete' => __('Please complete payment information', 'memberpress'),
            'elements_appearance' => $this->get_elements_appearance(),
            'payment_element_terms' => $this->get_payment_element_terms(),
            'ajax_url' => admin_url('admin-ajax.php'),
            'ajax_error' => __('An error occurred, please DO NOT submit the form again as you may be double charged. Please contact us for further assistance instead.', 'memberpress'),
            'invalid_response_error' => __('The response from the server was invalid', 'memberpress'),
            'error_please_try_again' => __('An error occurred, please try again', 'memberpress'),
            'top_error' => sprintf(
            // translators: %1$s: open strong tag, %2$s: close strong tag, %3$s: error message
                esc_html__('%1$sERROR%2$s: %3$s', 'memberpress'),
                '<strong>',
                '</strong>',
                '%s'
            ),
        ];

        wp_localize_script(
            'twwe-mepr-stripe-form',
            'MeprStripeGateway',
            ['l10n_print_after' => 'MeprStripeGateway = ' . wp_json_encode($l10n)]
        );
    }

    /**
     * Get the appearance data for Stripe Elements
     *
     * @return array|stdClass
     */
    private function get_elements_appearance()
    {
        $appearance = [];

        $appearance = \MeprHooks::apply_filters('mepr-stripe-elements-appearance', $appearance);

        if (empty($appearance)) {
            return new \stdClass(); // {} in JSON
        }

        return $appearance;
    }

    /**
     * Get the terms options for the payment element
     *
     * @return array|stdClass
     */
    private function get_payment_element_terms()
    {
        $terms = [
            'applePay' => 'never',
            'auBecsDebit' => 'never',
            'bancontact' => 'never',
            'card' => 'never',
            'cashapp' => 'never',
            'googlePay' => 'never',
            'ideal' => 'never',
            'paypal' => 'never',
            'sepaDebit' => 'never',
            'sofort' => 'never',
            'usBankAccount' => 'never',
        ];

        $terms = \MeprHooks::apply_filters('mepr-stripe-payment-element-terms', $terms);

        if (empty($terms)) {
            return new \stdClass(); // {} in JSON
        }

        return $terms;
    }
}