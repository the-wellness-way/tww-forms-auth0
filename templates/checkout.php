<?php
$is_logged_in = is_user_logged_in();
$email = wp_get_current_user()->user_email;
?>
<div class="mp_wrapper mp_wrapper--all">
<div class="register-template">
        <div class="register-template__order-summary mobile-stack-on">
            <div class="register-temlate__order-summary-header">
                <div><span>Order Summary</span></div>
            </div>
            <div class="register-template__order-summary-product">
                <h3><?php echo $product_title; ?></h3>
            </div>
            <div class="register-template__terms">
                <div class="twwe-invoice-group register-template__terms-header">
                    <div class="twwe-invoice-html">
                        <?php $this->render_invoice_html(); ?>
                    </div>

                    <?php if(!$coupon || (($coupon) && ! $coupon->is_valid($membership_id))): ?>
                    <div class="register-template__entry--coupon tww-coupon-entry-wrapper">
                        <div class="tww-coupon-inputs">
                            <div class="tww-apply-coupon-button-wrapper">
                                <p>Have a coupon?</p>
                                </div>
                            <div class="tww-coupon-entry-inner">
                                <div class="mp-form-row mepr_coupon mepr_coupon_<?php echo $membership_id; ?>">
                                    <input type="text" id="mepr_coupon_code-<?php echo $membership_id; ?>" class="twwe-coupon-code tww-coupon-input mepr-form-input mepr-coupon-code" name="mepr_coupon_code" value="<?php echo (isset($coupon_code))?esc_attr(stripslashes($coupon_code)):''; ?>" data-prdid="<?php echo $membership_id; ?>" /> <button class="twwe-apply-coupon radend"><div class="button-loader button-loader-absolute"></div> <span class="button-text" id="tww-plus-subscribe-button-text" style="visibility: visible;">Apply</span></button>
                                </div> 
                            </div>
                        </div>
                        <div class="twwe-coupon-message"></div>
                    </div>
                    <?php endif; ?>
                </div>
            </div>
            <div class="register-template__order-summary-footer">
                <span>Need help?</span> <a href="https://www.thewellnessway.com/help/">Contact TWW+ Support</a></p>
            </div>
        </div>

        <div class="register-template-container">
            <div class="register-checkout">

            <h1>Checkout</h1>

            <form method="post" id="mepr-stripe-payment-form" action="https://tww-dev.com/register/tww-yearly/#mepr_jump">
                <input type="hidden" id="mepr_coupon_code1" class="twwe-coupon-code mepr-form-input mepr-coupon-code" placeholder="Coupon Code:" name="mepr_coupon_code" value="<?php echo $coupon_code; ?>" data-prdid="<?php echo $membership_id; ?>">
                <input type="hidden" name="mepr_process_signup_form" value="<?php echo isset( $_GET['mepr_process_signup_form'] ) ? esc_attr( $_GET['mepr_process_signup_form'] ) : 1; ?>" />
                <input type="hidden" name="mepr_product_id" value="<?php echo esc_attr( $membership_id ); ?>" />
                <input type="hidden" name="mepr_transaction_id" value="<?php echo $txn->ID; ?>" />
                <input id="twwe-mepr-stripe-txn-amount" class="twwe-mepr-stripe-txn-amount" type="hidden" name="mepr_stripe_txn_amount" value="<?php echo isset( $price ) ? ($price * 100)  : ''; ?>" />

                <?php if ( \MeprUtils::is_user_logged_in() ) : ?>
                <input type="hidden" name="logged_in_purchase" value="19" />
                <input type="hidden" name="mepr_checkout_nonce" value="<?php echo esc_attr( wp_create_nonce( 'logged_in_purchase' ) ); ?>">
                <?php wp_referer_field(); ?>

                <script>
                    var inline_payment_methods = <?php echo json_encode($payment_methods); ?>;
                </script>

                <div class="mepr-payment-methods-radios<?php echo sizeof( $payment_methods ) === 1 ? ' mepr-hidden' : ''; ?>">
                    <?php echo \MeprOptionsHelper::payment_methods_radios( $payment_methods ); ?>
                </div>

                <?php endif; ?>  
                <div class="tww-step tww-step--account <?php echo $is_logged_in ? '' : 'tww-step--open'; ?>">
                    <div class="tww-step__header">
                        <div class="tww-step--when-collapsed">
                            <h4>1. Account</h4>
                            <div class="tww-step__mini-description">
                                <span class="tww-step__email "><?php echo $is_logged_in && $email ? $email : ''; ?></span>
                            </div>
                        </div>
                        <div class="tww-step--when-collapsed">
                            <div class="tww-step__edit">
                                <a data-step="account" class="tww-step__edit-link <?php echo $is_logged_in ? 'prev-step-editable' : ''; ?>">Edit</a>
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
                                    <div class="tww-checkout-login-form"  id="tww-login-form">  
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>  
                </div>

                <div class="tww-step tww-step--payment <?php echo $is_logged_in ? 'tww-step--open' : ''; ?>">
                    <div class="tww-step__header">
                        <div class="tww-step--when-collapsed">
                            <h4>2. Payment</h4>
                            <div class="tww-step__mini-description">
                                
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
                                <div class="register-template__payment-methods">

                                <div class="register-template__payment-methods-header">
                                    <div class="register-template__input-group register-template__input-group--names">
                                        <div class="register-template__input-item">
                                            <label>First Name</label>
                                            <div><input type="text" name="user_first_name" id="user_first_name1" ></div>
                                        </div>
                                        
                                        <div class="register-template__input-item">    
                                            <label>Last Name</label>
                                            <div><input type="text" name="user_last_name" id="user_last_name1" ></div>
                                        </div>
                                    </div>
                                </div>
                                <?php
                                    if(class_exists('MeprProduct')) {
                                        $order_bump_product_ids = isset($_GET['obs']) && is_array($_GET['obs']) ? array_map('intval', $_GET['obs']) : [];
                                        $order_bump_products = \MeprCheckoutCtrl::get_order_bump_products($product->ID, $order_bump_product_ids);

                                        $elements_options = [
                                            'mode' => 'subscription',
                                            'amount' => (int) $gateway->to_zero_decimal_amount($amount),
                                            'paymentMethodTypes' => $gateway->get_subscription_payment_method_types(),
                                        ];
                                    }
                                    /**
                                     * The following HTML is where stripe javascript will be injected
                                     */
                                ?>
                                <input type="hidden" name="mepr_payment_method" value="<?php echo esc_attr($gateway->settings->id); ?>" />

                                <div class="mepr-payment-method">
                                    <div class="mepr-stripe-elements">
                                        <div class="mepr-stripe-card-element" data-stripe-public-key="<?php echo esc_attr($gateway->get_public_key()); ?>" data-payment-method-id="<?php echo esc_attr($gateway->settings->id); ?>" data-locale-code="<?php echo esc_attr($gateway::get_locale_code()); ?>" data-elements-options="<?php echo isset($elements_options) ? esc_attr(wp_json_encode($elements_options)) : ''; ?>" data-user-email="<?php echo esc_attr($user->user_email); ?>"></div>   
                                        <div role="alert" class="mepr-stripe-card-errors"></div>
                                        <div role="alert" class="mepr-errors"></div>
                                    </div>
                                </div>

                                <a id="tww-plus-button-continue-payment" class="loader-default loader-default--primary loader-default--full">
                                    <div class="button-loader button-loader-absolute"></div> <span id="tww-plus-subscribe-button-text" style="visibility: visible;">Continue</span> 
                                </a>

                            </div>
                        </div>
                    </div> 
                </div>

                <div class="tww-step tww-step--review">
                    <div class="tww-step__header">
                        <h4>3. Review</h4>
                        <div class="tww-step--when-collapsed">
                            <div class="tww-step__mini-description">
                                <p>
                            </div>
                            <div class="tww-step__edit">
                                <a data-step="review" class="tww-step__edit-link">Edit</a>
                            </div>
                        </div>
                    </div>
                    <div class="tww-step--when-open tww-step__pms">
                        <div class="tww-step--when-open-inner">
                            <div class="register-template__step-box">
                                <div class="register-template__order-summary--review">
                                    <div class="register-temlate__order-summary-header">
                                        <div><span>Order Summary</span></div>
                                    </div>
                                    <div class="register-template__order-summary-product">
                                        <h3><?php echo $product_title;  ?></h3>
                                    </div>
                                    <div class="register-template__terms">
                                        <div class="twwe-invoice-group register-template__terms-header">
                                            <div class="twwe-invoice-html">
                                                <?php $this->render_invoice_html(); ?>
                                            </div>
                                            <?php if(!$coupon || (($coupon) && ! $coupon->is_valid($membership_id))) : ?>
                                            <div class="register-template__entry--coupon tww-coupon-entry-wrapper">
                                                <div class="tww-coupon-inputs">
                                                    <div class="tww-apply-coupon-button-wrapper">
                                                        <p>Have a coupon?</p>
                                                        </div>
                                                    <div class="tww-coupon-entry-inner">
                                                        <div class="mp-form-row mepr_coupon mepr_coupon_<?php echo $product->ID; ?>">
                                                            <input type="text" id="mepr_coupon_code-<?php echo $product->ID; ?>" class="twwe-coupon-code tww-coupon-input mepr-form-input mepr-coupon-code" name="mepr_coupon_code" value="<?php echo (isset($coupon_code)) ? esc_attr(stripslashes($coupon_code)) : ''; ?>" data-prdid="<?php echo $product->ID; ?>" /> <button class="twwe-apply-coupon radend"><div class="button-loader button-loader-absolute"></div> <span class="button-text" id="tww-plus-subscribe-button-text" style="visibility: visible;">Apply</span></button>
                                                        </div> 
                                                    </div>
                                                </div>
                                                <div class="twwe-coupon-message"></div>
                                            </div>
                                            <?php endif; ?>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            <!-- <div class="register-template__review-message">
                                <p>Automatic Renewal Terms</p>

                                <p>Your payment method will be automatically charged in advance $4.00 USD every 4 weeks for the first year.

                                <p>It will then be automatically charged $25.00 USD in advance every 4 weeks thereafter.

                                <p>Sales tax may apply.

                                <p>Your subscription will continue until you cancel. You can cancel your subscription online at any time in your Account settings, or during limited hours by chat or phone. Cancellations take effect at the end of your current billing period.
                            </div> -->

                            <div class="register-template__review-terms">
                                <p>By purchasing this item you agree to our <a href="https://www.thewellnessway.com/terms-conditions/">Terms of Service</a>.</p>
                            </div>

                            <div class="register-template__review-submit">
                                <div class="mp-form-submit">
                                    <div role="alert" class="mepr-stripe-card-errors"></div> 
                                    <div role="alert" class="mepr-errors"></div> 
                                    <button id="twwe-purchase-description-button" type="submit">
                                        <div class="twwe-purchase button-loader button-loader-absolute"></div> <span id="tww-plus-subscribe-button-text" class="twwe-purchase button-text" style="visibility: visible;">Purchase Subscription</span> 
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </form>

        </div>
        <div class="register-template__copyright non-mobile">
            <ul style="margin: 0;">
                <li>© 2024 The Wellness Way</li>
                <li><a href="https://www.thewellnessway.com/privacy-policy/">Privacy Policy</a></li>
            </ul>
        </div>
        </div>
</div><!-- register-template -->
</div><!-- mp_wrapper -->
<div class="mobile-footer">
    <div class="register-template__order-summary-footer mobile">
        <span>Need help?</span> <a href="https://www.thewellnessway.com/help/">Contact TWW+ Support</a></p>
    </div>
    <div class="register-template__copyright">
        <ul>
            <li>© 2024 The Wellness Way</li>
            <li><a href="https://www.thewellnessway.com/privacy-policy/">Privacy Policy</a></li>
        </ul>
    </div>
</div><!-- mobile-footer -->
