<?php
namespace TwwFormsAuth0\Controllers;

class TwweSubscriptionsCtrl {
    public static function get_last_subscription() {
        $subscriptions = self::get_subscriptions();

        if($subscriptions) {
            return $subscriptions[0];
        }

        return null;
    }

    public static function get_subscriptions() {
        if(!class_exists('MeprDb')) {
            return null;
        }

        $mepr_current_user = \MeprUtils::get_currentuserinfo();
       // var_dump($mepr_current_user);

        if(!$mepr_current_user) {
            return null;
        }

        $perpage = \MeprHooks::apply_filters('mepr_subscriptions_per_page', 10);
        $curr_page = 1;

        $sub_cols = array('id','user_id','product_id','subscr_id','status','created_at','expires_at','active');

        $table = \MeprSubscription::account_subscr_table(
        'created_at', 'DESC',
        $curr_page, '', 'any', $perpage, false,
        array(
            'member' => $mepr_current_user->user_login,
            'statuses' => array(
            \MeprSubscription::$active_str,
            \MeprSubscription::$suspended_str,
            \MeprSubscription::$cancelled_str
            )
        ),
        $sub_cols
    );        

        return $table['results'] ?? null;
    }

    public static function get_last_subscription_id() {
        $subscription = self::get_last_subscription();

        if($subscription && $subscription->id) {
            return $subscription->id;
        }

        return null;
    }

    public static function get_membership_id_from_last_subscription() {
        $subscription_id = self::get_last_subscription_id();
        $subscription = new \MeprSubscription($subscription_id);

        if($subscription) {
            $product = $subscription->product();

            return $product->ID;
        }

        return null;
    }
}