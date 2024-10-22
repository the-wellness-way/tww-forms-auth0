<?php
namespace TwwFormsAuth0\Shortcodes;

class TwwfAuth0TokenLinkShortcode extends TwwfShortcodes {
    public function set_sc_settings() {
        $this->sc_settings = [
            'name' => 'twwf_auth0_token_link',
            'handle' => 'twwf-auth0-token-link-shortcode',
        ];
    }

    public function render_shortcode($atts, $content = null) {
        if($this->sc_settings['handle']) {
            wp_enqueue_script($this->sc_settings['handle']);
        }

        ob_start();

        require_once TWW_FORMS_AUTH0_PLUGIN . 'templates/twwf-auth0-token-link-shortcode.php';

        return ob_get_clean();
    }
}