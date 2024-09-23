<?php
$is_logged_in = false;
$post_id = 20;
$billing_period = [
    'years' => 'Yearly',
    'months' => 'Monthly',
    'weeks' => 'Weekly',
];

$billing_period_total = [
    'years' => 'year',
    'months' => 'month',
    'weeks' => 'week',
];

$billing_period = $billing_period[get_post_meta($post_id, '_mepr_product_period_type', true)] ?? '';
$billing_period_total = $billing_period_total[get_post_meta($post_id, '_mepr_product_period_type', true)] ?? '';
$price = get_post_meta($post_id, '_mepr_product_price', true);
?>

<div class="register-template">
    <div class="register-template__order-summary">
        <div class="register-temlate__order-summary-header">
            <div><span>Order Summary</span></div>
        </div>
        <div class="register-template__order-summary-product">
            <h3>TWW+ (Monthly) Subscription</h3>
        </div>
        <div class="register-template__terms">
            <div class="register-template__terms-header">
                <div class="register-template__entry">
                    <div><span><?php echo $billing_period; ?> price</span></div>
                    <div><span><?php echo $price; ?></span></div>
                </div>
                <div class="register-template__entry--total">
                    <div><span>Total due every <?php echo $billing_period_total; ?></span></div>
                    <div><span><?php echo $price; ?></span></div>
                </div>
                <div class="register-template__entry--total">
                    <div><a href="#">Have a coupon?</a></div>
                </div>
            </div>
        </div>
    </div>
    <div class="register-template-container">
        <div class="register-checkout">

        <h1>Checkout</h1>

        <div class="tww-step tww-step--account <?php echo $is_logged_in ? '' : 'tww-step--open'; ?>">
            <div class="tww-step__header">
                <div class="tww-step--when-collapsed">
                    <h4>1) Account</h4>
                    <div class="tww-step__mini-description">
                        <span class="tww-step__email">philiparudy@gmail.com</span>
                    </div>
                </div>
                <div class="tww-step--when-collapsed">
                    <div class="tww-step__edit">
                        <a data-step="account" class="tww-step__edit-link">Edit</a>
                    </div>
                </div> 
            </div>  
            <div class="tww-step--when-open">
                <div class="tww-step--when-open-inner">
                    <div id="tww-plus-modal-inner" class="tww-plus-modal__inner">
                        <div class="tww-plus-modal__content">
                            <div class="tww-plus-modal__message">
                                <div id="success-message" class="tww-plus-success" style="color: green;"></div>
                            </div>
                            <form id="tww-login-form">
                                <div class="tww-plus-login-fields">
                                    <div class="tww-plus-login__fields-wrapper">
                                        <label>Email Address:</label>
                                        <input type="email" name="email" id="tww-plus-login-email" placeholder="Email">
                                    </div>
                                    <div class="tww-plus-login__fields-wrapper tww-plus-login__fields-wrapper--password check-if-has-account">
                                        <input type="password" name="password" id="tww-plus-login-password" placeholder="Password" class="tww-plus-login__password">
                                        <button class="tww-plus-password-eye-btn" type="button">
                                            <span class="tww-plus-password-eye dashicons dashicons-hidden"></span>
                                        </button>
                                    </div>
                                    <div class="tww-plus-login__fields-wrapper tww-plus-login__submit-wrapper">
                                        <button id="tww-plus-button-continue" class="loader-default loader-default--primary loader-default--full" type="submit">
                                            <div class="button-loader button-loader-absolute"></div> <span id="tww-plus-subscribe-button-text" style="visibility: visible;">Continue</span> 
                                        </button>
                                    </div>
                                    <div class="tww-plus-login__fields-wrapper check-if-has-account">
                                        <a id="forgot-password-link" href="https://www.thewellnessway.com/login/?action=forgot_password">Forgot password?</a>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>  
        </div>
        <div class="tww-step tww-step--payment <?php echo $is_logged_in ? 'tww-step--open' : ''; ?>">
            <div class="tww-step__header">
                <div class="tww-step--when-collapsed">
                    <h4>2) Payment</h4>
                    <div class="tww-step__mini-description">
                        <p>Card ending in <span class="tww-step__card-last-four">4452</span>
                    </div>
                </div>
                <div class="tww-step--when-collapsed">
                    <div class="tww-step__edit">
                        <a data-step="payment" class="tww-step__edit-link">Edit</a>
                    </div>
                </div>
            </div>
            <div class="tww-step--when-open tww-step__pms">
                <div class="tww-step--when-open-inner">
                <?php
                    if(class_exists('MeprProduct')) {
                        $product = new \MeprProduct($post_id);
                        $amount = $product->price;
                        $product_id = $product->ID;
                        $txn_id = uniqid();
                        $txn = new MeprTransaction($txn_id);
                        $user = new \MeprUser(1);
                        $mepr_options = \MeprOptions::fetch();
                        $integrations = $mepr_options->integrations;
                        $first_element = array_values($integrations)[0];
                        $gateway = new \MeprStripeGateway();
                        $gateway->load($first_element);

                        $gateway->display_on_site_form($txn);
                    }
                ?>
                </div>
            </div>
        </div>
        <div class="tww-step tww-step--review">
            <div class="tww-step__header">
                <h4>3) Review</h4>
                <div class="tww-step--when-collapsed">
                    <div class="tww-step__mini-description">
                        <p>Card ending in <span class="tww-step__card-last-four">4452</span>
                    </div>
                    <div class="tww-step__edit">
                        <a data-step="review" class="tww-step__edit-link">Edit</a>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </div>
</div>