<?php
namespace TwwFormsAuth0\Includes;

class TwwfAuth0Login {
    const CONNECTION = 'EMAIL-PASSWORD';
    const CLIENT_ID = 'NXQ5r3MXV6ho1X5pXlhYqFwCXyboyv5R';
    const CLIENT_SECRET = '6_mW8AawnKIh5tIsSSJV61_nIVYR-u6u5LcApOHQf_3FNEfwwelYbHJ_8ub6nORT';
    const AUTH0_CUSTOM_DOMAIN = 'https://login.tww-dev.com';
    const AUTH0_CREATE_USER_ENDPOINT = '/api/v2/users';
    public function twwf_auth0_login($email, $password) {

        $data = [
            'grant_type' => 'password',
            'username' => $email,
            'password' => $password,
            'client_id' => 'NXQ5r3MXV6ho1X5pXlhYqFwCXyboyv5R',
            'client_secret' => '6_mW8AawnKIh5tIsSSJV61_nIVYR-u6u5LcApOHQf_3FNEfwwelYbHJ_8ub6nORT',
            'scope' => 'openid profile email'
        ];

        $url = self::AUTH0_CUSTOM_DOMAIN . '/oauth/token';

        $json_data = json_encode($data);

        $response = wp_remote_post($url, [
            'body' => $json_data,
            'headers' => [
                'Content-Type' => 'application/json', // Specify content type as JSON
                'Accept' => 'application/json',
                'Cookie' => 'did=s%3Av0%3A57d667ce-68fb-4ee3-91fc-43d637d6bef0.rURr6tgzU%2FstIVBFHUm4XEFyitLrtbGi7Ol%2B4r7Rhm8; did_compat=s%3Av0%3A57d667ce-68fb-4ee3-91fc-43d637d6bef0.rURr6tgzU%2FstIVBFHUm4XEFyitLrtbGi7Ol%2B4r7Rhm8'
            ]
        ]);

        $response_body = json_decode(wp_remote_retrieve_body($response));

        return rest_ensure_response($response);

       // return new \WP_Error('login_error', 'Auth0 message again', ['status' => 400]);
    }
}