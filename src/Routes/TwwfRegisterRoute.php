<?php
namespace TwwFormsAuth0\Routes;

class TwwfRegisterRoute extends TwwfRoutes {
    const CONNECTION = 'EMAIL-PASSWORD';
    const CLIENT_ID = 'NXQ5r3MXV6ho1X5pXlhYqFwCXyboyv5R';
    const CLIENT_SECRET = '6_mW8AawnKIh5tIsSSJV61_nIVYR-u6u5LcApOHQf_3FNEfwwelYbHJ_8ub6nORT';
    const AUTH0_CUSTOM_DOMAIN = 'https://login.tww-dev.com';
    const AUTH0_CREATE_USER_ENDPOINT = '/api/v2/users';
    protected $routes = [
        'auth0-register' => [
            'methods' => 'POST',
            'callback' => 'auth0_register',
            'path' => '/auth0-register',
        ]
    ];

    public function boot() {
        $this->register_routes();
    }

    public function auth0_register(\WP_REST_Request $request) {
        $params = $request->get_params();
        $password = 'Wellness24$!tww';

        $data = [
            'client_id' => $params['client_id'],
            'email' => $params['email'],
            'password' => $params['password'],
            'connection' => self::CONNECTION,
            'user_metadata' => [
                "first_name" => $params['first_name'] ?? '',
                "last_name" => $params['last_name'] ?? '',
                'twwm_subscriptions' => []
            ]
        ];

        $url = self::AUTH0_CUSTOM_DOMAIN . self::AUTH0_CREATE_USER_ENDPOINT;

        $wp_remote_post = wp_remote_post($url, $data);

        $response = json_decode(wp_remote_retrieve_body($wp_remote_post));

        if(isset($response->error)) {
            return new \WP_Error('auth0_error', $response->message, ['status' => 400]);
        }

        return $response;
    }
}