<?php
namespace TwwFormsAuth0\Flows;

class TwwfPrelogin {
    public function __construct() {
        add_action('wp_authenticate', [$this, 'check_user_name_for_special_chars'], 10, 2);
    }

    public function check_user_name_for_special_chars($username, $password) {
       // $username = preg_replace('/[^A-Za-z0-9]/', '', $username);

       
        return $username;
    }
}