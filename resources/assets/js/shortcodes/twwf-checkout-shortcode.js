const steps = [
    'account',
    'payment',
    'review',
];

const initCardContinue = () => {
    document.getElementById('tww-plus-button-continue-payment').addEventListener('click', (e) => {
        let paymentStepMiniDescription = document.querySelector('.tww-step--payment .tww-step__mini-description');
        paymentStepMiniDescription.innerHTML = 'Payment details saved';
        goToStep('review');
    });
}   

const createMessageContainer = (message) => {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('tww-plus-login__message');
    messageDiv.innerHTML = message;

    return messageDiv;
}

const createEmailFields = (email_address) => {
    const emailWrapper = document.createElement('div');
    emailWrapper.id = 'user_email1';
    emailWrapper.classList.add('tww-plus-login__fields-wrapper');

    const emailInputWrapper = document.createElement('div');
    emailInputWrapper.classList.add('tww-plus-login__fields-wrapper--email');


    const emailLabel = document.createElement('label');
    emailLabel.for = 'email';
    emailLabel.textContent = 'Email Address';

    const emailEditSpan = document.createElement('span');
    emailEditSpan.classList.add('tww-plus-login__email-edit-link');
    emailEditSpan.textContent = 'Edit';

    emailEditSpan.addEventListener('click', (e) => {
        e.preventDefault();
        let emailField = e.target.closest('.tww-plus-login__fields-wrapper--email').querySelector('input');

        if(emailField) {
            emailField.disabled = !emailField.disabled;
            e.target.classList.toggle('active');
            emailField.classList.toggle('disabled');
            document.querySelector('.tww-plus-login__fields-wrapper--password').classList.toggle('init');
            document.querySelector('.tww-plus-login__fields-wrapper--password').remove();
            document.getElementById('tww-plus-button-continue').innerHTML = 'Continue';

            let forgotPwd = document.querySelector('.tww-plus-login__forgot-password-wrapper');
            if(forgotPwd) {
                forgotPwd.remove();
            }

            setLoginState('createAccount', true);
        } else {
            console.log('no email field');
        }
    });

    const email = document.createElement('input');
    email.type = 'email';
    email.name = 'email';
    email.id = 'tww-plus-login-email';
    email.classList.add('tww-plus-login__email');
    email.classList.add('regular');
    email.value = email_address;
    email.placeholder = 'Email Address';

    email.appendChild(emailLabel);
    email.insertAdjacentElement(
        'afterend',
        emailEditSpan
    )

    email.addEventListener('blur', (e) => {
        if(!validateEmail(e.target.value)) {
            e.target.classList.add('invalid');
        } else {
            e.target.classList.remove('invalid');
        }
    });

    emailWrapper.appendChild(emailLabel);
    emailWrapper.appendChild(emailInputWrapper);
    emailInputWrapper.appendChild(email);

    emailInputWrapper.appendChild(emailEditSpan);

    return emailWrapper;
}

const createPasswordFields = (confirm = false) => {
    const pwdField = document.createElement('div');
    pwdField.classList.add('tww-plus-login__fields-wrapper');
    pwdField.classList.add('tww-plus-login__fields-wrapper--password');
    pwdField.classList.add('init');

    const pwdInputWrapper = document.createElement('div');
    pwdInputWrapper.classList.add('tww-plus-login__fields-wrapper--password');
    pwdInputWrapper.style.position = 'relative';

    const pwdLabel = document.createElement('label');
    pwdLabel.for = 'user_password1';
    pwdLabel.textContent = 'Password';

    const password = document.createElement('input');
    password.type = 'password';
    password.name = 'password';
    password.name = password.name + (confirm ? 'Confirm' : '');
    password.id = 'user_password1';
    password.id = password.id + (confirm ? 'Confirm' : '');
    password.placeholder = 'Password';
    password.placeholder = password.placeholder + (confirm ? ' Confirm' : '');
    password.classList.add('tww-plus-login__password');
    password.classList.add('neutral');
    password.classList.add('tww-plus-login__password--' + (confirm ? 'confirm' : 'password'));

    const passwordEyeBtn = document.createElement('button');
    passwordEyeBtn.classList.add('tww-plus-password-eye-btn');
    passwordEyeBtn.type = 'button';

    const passwordEye = document.createElement('span');
    passwordEye.classList.add('tww-plus-password-eye');
    passwordEye.classList.add('dashicons');
    passwordEye.classList.add('dashicons-hidden');

    passwordEyeBtn.appendChild(passwordEye);

    passwordEyeBtn.addEventListener('click', () => {
        //check if password is visible
        if('password' === password.type) {
            password.type = 'text';
            passwordEye.classList.add('dashicons-visibility');
            passwordEye.classList.remove('dashicons-hidden');
        }
        else {
            password.type = 'password';
            passwordEye.classList.remove('dashicons-visibility');
            passwordEye.classList.add('dashicons-hidden');
        }
    });

    pwdField.appendChild(pwdLabel);
    pwdField.appendChild(pwdInputWrapper);
    pwdInputWrapper.appendChild(password);
    pwdInputWrapper.appendChild(passwordEyeBtn);

    return pwdField;
}

const createForgotPassword = (email) => {
    //create a forgot password link wrapped in a div
    const forgotPasswordWrapper = document.createElement('div');
    forgotPasswordWrapper.classList.add('tww-plus-login__forgot-password-wrapper');
    forgotPasswordWrapper.classList.add('init');

    const forgotPasswordLink = document.createElement('a');
    forgotPasswordLink.href = state.forgotPasswordUrl ?? '#';
    forgotPasswordLink.textContent = 'Forgot Password?';

    forgotPasswordWrapper.appendChild(forgotPasswordLink);

    return forgotPasswordWrapper;
}

const createContinueField = () => {
    const continueWrapper = document.createElement('div');
    continueWrapper.classList.add('tww-plus-login__fields-wrapper');
    continueWrapper.classList.add('tww-plus-login__submit-wrapper');

    const continueButton = document.createElement('button');
    continueButton.id = 'tww-plus-button-continue';
    continueButton.classList.add('loader-default');
    continueButton.classList.add('loader-default--primary');
    continueButton.classList.add('loader-default--full');

    const loader = document.createElement('div');
    loader.classList.add('button-loader');
    loader.classList.add('button-loader-absolute');

    const span = document.createElement('span');
    span.id = ('tww-plus-subscribe-button-text');
    span.textContent = 'Continue';

    continueButton.appendChild(loader);
    continueButton.appendChild(span);

    return continueButton;
}

const createLoginFlow = (fields, message, email, mount) => {
    const wrapper = document.createElement('div');
    wrapper.classList.add('tww-plus-login-flow');

    const wrapperInner = document.createElement('div');
    wrapperInner.classList.add('tww-plus-login-flow__inner');

    const loginFlowContent = document.createElement('div');
    loginFlowContent.classList.add('tww-plus-login-flow__content');

    

    const messageDiv = document.createElement('div');
    messageDiv.classList.add('tww-plus-login__message');

    if(message && typeof message === 'object') {
        messageDiv.appendChild(message);
    } else {    
        messageDiv.textContent = message ?? '';
    }

    if(loginFlowContent && fields) {
        for (const key in fields) {
            if (fields.hasOwnProperty(key) && null !== fields[key]) {
                let field = fields[key];
                loginFlowContent.appendChild(field);
            }
        }
    }

    wrapper.appendChild(wrapperInner);
    wrapperInner.appendChild(loginFlowContent);
    loginFlowContent.prepend(messageDiv);

    // we need to check if mount is an actual element
    if(mount && 'object' === typeof mount) {
        mount[0].innerHTML = '';
        mount[0].appendChild(wrapper);
        
    } else {
        document.body.appendChild(wrapper);
    }

    initFormValidation(document.getElementById('tww-login-form'), false);
}

const loginState = {
    createAccount: true,
}

setLoginState = (key, value) => {  
    loginState[key] = value;
}

const validatePassword = (password) => {
    if(!password) {
        return false;
    }

    return true;
}

const validatePasswordConfirm = (password, passwordConfirm) => {
    if(password !== passwordConfirm) {
        return false;
    }

    return true
}

const $ui = {
    loginFlowMount: document.querySelectorAll('.tww-step--account .tww-step--when-open #tww-login-form')
}

const initRegisterSteps = (email) => {
    const twwSteps = document.querySelectorAll('.tww-step');
    let fields = [];
    console.log('initRegisterSteps');
    console.log('state.currentUserEmail', state.currentUserEmail);
    console.log('email', email);
    email = email ?? state.currentUserEmail;
    fields['email'] = createEmailFields(email);
    fields['button'] = createContinueField();


    fields['button'].addEventListener('click', (e) => {
        e.preventDefault();
        let email = fields['email'].querySelector('input').value ?? null;
        window.setState('currentUserEmail', email);

        console.log('email', email);    

        fields['button'].innerHTML = `<img src="${state.iconsPath}/${window.twwLoaderSVG}.svg" alt="Loading...">`;

        clearErrors('.error-message', true);

        if(true === loginState.createAccount && email) {
            window.createMember({ email: email, username: fields['email'].querySelector('input').value, do_login: true, send_password_reset: false }).then((response) => {
                let message = document.querySelector('.tww-plus-login__message');
                if(message) {
                    message.remove();
                }

                let forgotPwd = document.querySelector('.tww-plus-login__forgot-password-wrapper');
                if(forgotPwd) {
                    forgotPwd.remove();
                }

                fields["password"] = createPasswordFields();
                fields['forgotPassword'] = createForgotPassword(state.currentUserEmail);
                let password = fields['password'].querySelector('input');

                fields['email'].querySelector('.tww-plus-login__email-edit-link').classList.add('active');
                fields['email'].querySelector('input').disabled = true;

                if(response.user_id) {
                    window.setState('currentUserId', response.user_id);
                }
                
                if(response.rest_nonce) {
                    window.setState('restNonce', response.rest_nonce); 
                }

                if(response.coupon_nonce) {
                    window.setState('couponNonce', response.coupon_nonce);
                }
                
                // set timeout and remove it instead
                setTimeout(() => {
                    fields["password"].classList.remove('init');
                    fields["forgotPassword"].classList.remove('init');
                    
                }, 300);   

                fields["password"].addEventListener('input', (e) => {
                    e.preventDefault();            

                    if(false === validatePassword(password.value)) {
                        password.classList.add('invalid');
                        password.classList.remove('valid');
                        password.classList.remove('neutral');
                    } else if (password.value) {
                        password.classList.remove('invalid');
                        password.classList.add('valid');
                        password.classList.remove('neutral');
                    }
                });
                
                if(response.tww_membership && window.twwFormsRegister.product_title && (response.tww_membership.product_title == window.twwFormsRegister.product_title)) {
                    //I want to disable goToStep
                    let message = "You are already subscribed to "+window.twwFormsRegister.product_title+". Please <a href='https://www.thewellnessway.com/login/'>login</a> or reset your password.";

                    fields['button'].insertAdjacentElement('afterend', errorDiv(message));
                    fields['button'].innerHTML = 'Continue'; 
                    
                } else if(response.message && 'success' === response.status && response.data && response.data.id) {
                    setLoginState('createAccount', false);
                    document.querySelector('#tww-login-form').prepend(createMessageContainer('Create your free account'));

                    fields['email'].insertAdjacentElement('afterend', fields['password']);
                    fields['button'].innerHTML = 'Create Account';

                    setLoginState('createAccount', 'update_password');
                } else if (response.code && 'member_exists' === response.code) {
                    setLoginState('createAccount', false);

                    document.querySelector('#tww-login-form').prepend(createMessageContainer('Welcome back &mdash; Please log in'));

                    fields['email'].insertAdjacentElement('afterend', fields['forgotPassword']);

                    fields['email'].insertAdjacentElement('afterend', fields['password']);
                    
                    fields['button'].innerHTML = 'Login';
                } else if (response.code && 'rest_cookie_invalid_nonce' === response.code) {
                    let message = "There was a timeout error. Please refresh your browser and try again. If you continue to have issues, please <a href='https://www.thewellnessway.com/help/'>contact support</a>.";
                    fields['button'].insertAdjacentElement('afterend', errorDiv(message));
                 }  else if (response.code && 'missing_params' === response.code) {
                    let message = "Please enter a valid email.";

                    fields['button'].insertAdjacentElement('afterend', errorDiv(message));
                    fields['button'].innerHTML = 'Continue';
                 }

                initFormValidation(document.getElementById('tww-login-form'));
            });
        } else if (false === loginState.createAccount) {
            window.login({ email: state.currentUserEmail, password: fields['password'].querySelector('input').value }).then((response) => {
                if(response.rest_nonce) {
                    window.setState('restNonce', response.rest_nonce);
                }

                if(response.coupon_nonce) {
                    window.setState('couponNonce', response.coupon_nonce);
                }

                if(response.user_id) {
                    window.setState('currentUserId', response.user_id);
                }

                if(response.user_email) {
                    window.setState('currentUserEmail', response.user_email);
                }

                if(response.success && response.message) {
                    let messageDiv = document.querySelector('.tww-plus-login__message');
                    if(messageDiv) {
                        messageDiv.remove();
                    }

                    let forgotPwd = document.querySelector('.tww-plus-login__forgot-password-wrapper');
                    if(forgotPwd) {
                        forgotPwd.remove();
                    }

                    goToStep('payment');
                    
                    let message = "Get started by logging in or creating your account.";
                    fields['email'] = createEmailFields(state.currentUserEmail);
                    fields['button'].innerHTML = 'Continue';
                    fields['password'] = null;

                    createLoginFlow(fields, message, state.currentUserEmail, mount);
                    setLoginState('createAccount', true);
                } else if (response.code && 'rest_cookie_invalid_nonce' === response.code) {
                    let message = "There was a timeout error. Please refresh your browser and try again. If you continue to have issues, please <a href='https://www.thewellnessway.com/help/'>contact support</a>.''";
                    fields['button'].insertAdjacentElement('afterend', errorDiv(message));
                 } else {
                    fields['button'].innerHTML = 'Login';
                    fields['button'].insertAdjacentElement('afterend', errorDiv(response.message));
                }
            });
        } else if ('update_password' === loginState.createAccount) {
            let new_password = fields['password'].querySelector('input').value;
            let enteredEmail = document.querySelector('.tww-plus-login__email').value;

            window.changePasswordRequest({ user_id: state.currentUserId, email: enteredEmail, new_password: new_password, do_check_current_password: false }).then((response) => {
                console.log('changePasswordRequest response', response);
                let message = document.querySelector('.tww-plus-login__message');
                if(message) {
                    message.remove();
                }

                let forgotPwd = document.querySelector('.tww-plus-login__forgot-password-wrapper');
                if(forgotPwd) {
                    forgotPwd.remove();
                }

                if(response.success && response.message) {
                    setLoginState('createAccount', true);

                    if(response.rest_nonce) {
                        window.setState('restNonce', response.rest_nonce);
                    }

                    if(response.coupon_nonce) {
                        window.setState('couponNonce', response.coupon_nonce);
                    }

                    if(response.user_email) {
                        window.setState('currentUserEmail', response.user_email);
                    }

                    goToStep('payment');

                    let message = "Welcome back! Please login to continue.";
                    fields['email'] = createEmailFields(state.currentUserEmail);
                    fields['button'].innerHTML = 'Continue';
                    fields['password'] = null;

                    createLoginFlow(fields, message, state.currentUserEmail, mount);
                } else if (response.code && ('password_invalid' === response.code || 'password_too_short' === response.code)) {
                    fields['button'].insertAdjacentElement('afterend', errorDiv(response.message));
                    fields['button'].innerHTML = 'Create Account';
                }
            });
        }


        if(null !== fields['password'] && undefined !== fields['password'] && false === validatePassword(fields['password'].querySelector('input').value)) {
            fields['password'].classList.add('invalid');
        }
    });

    if(twwSteps.length) {
        twwSteps.forEach( (step) => {
            let editButton = step.querySelector('.tww-step__edit-link');
            
            editButton.addEventListener('click', (e) => {
                e.preventDefault();

                e.target.classList.remove('prev-step-editable');
                e.target.classList.add('active');

                goToStep(e.target.getAttribute('data-step'));
            })
        })
    }

    let mount = document.querySelectorAll('.tww-step--account .tww-step--when-open #tww-login-form');
    createLoginFlow(fields, "Get started by logging in or creating your account.", fields['email'].querySelector('input').value, mount);
}

const handleEditableLink = (step) => {
    if(steps.indexOf(step) > -1) {
        let index = steps.indexOf(step);
        for (let i = -1; i < index; i++) {
            let prevStep = document.querySelector('.tww-step--' + steps[i]);

            if(prevStep) {
                let editLink = prevStep.querySelector('.tww-step__edit-link');
                editLink.classList.add('prev-step-editable');
            }
        }
    }
}

const goToStep = (step) => {
    const pageWrapper = document.querySelector('.register-template');
    const closeAllSteps = document.querySelectorAll('.tww-step');
    const stepToOpen = document.querySelector('.tww-step--' + step);

    closeAllSteps.forEach((stepEl) => {
        if(stepEl.classList.contains('tww-step--' + step)) {
            stepEl.classList.add('tww-step--open');
        } else {
            stepEl.classList.remove('tww-step--open');
        }
    });

    if('review' === step && window.innerWidth > 768) {     
        pageWrapper.classList.add('register-template--open');
    } else {
        pageWrapper.classList.remove('register-template--open');
    }

    window.setState('currentUserEmail', document.querySelector('.tww-plus-login__email').value);
    console.log("step currentEmail", state.currentUserEmail);
    console.log("step2 currentEmail", document.querySelector('.tww-plus-login__email').value);

    if ('account' === step) {
        initRegisterSteps(document.querySelector('.tww-plus-login__email').value);

        document.querySelector('.tww-step__email').innerHTML = '';
    } else {
        document.querySelector('.tww-step__email').innerHTML = document.querySelector('.tww-plus-login__email').value;
    }

    handleEditableLink(step)
}

const coupon = {
    code: '',
};

const setCoupon = (key, value) => {
    coupon[key] = value;
}

const initCouponEntry = () => {
    const invoiceGroups = document.querySelectorAll('.twwe-invoice-group');
    const containers = document.querySelectorAll('.tww-coupon-entry-wrapper');
    const pricingContainers = document.querySelectorAll('.tww-pricing-container');
    const discountTable = document.querySelector('.tww-discount-table');

    const discountHTML = document.querySelector('.register-template__entry--discount');

    invoiceGroups.forEach((invoiceGroup) => {
        const couponInput = invoiceGroup.querySelector('.tww-coupon-input');
        const applyCouponButton = invoiceGroup.querySelector('.twwe-apply-coupon');
        let couponResultMount = invoiceGroup.querySelector('.tww-coupon-result-mount');
        const buttonLoader = invoiceGroup.querySelector('.button-loader');
        const spanLoader = invoiceGroup.querySelector('.button-text');
        const invoiceHTML = document.querySelectorAll('.twwe-invoice-html');

        if(applyCouponButton) {
            applyCouponButton.addEventListener('click', async (e) => {
                e.preventDefault();
                window.setState('couponCode', couponInput.value);
    
                if (!couponInput.value) {
                    couponInput.classList.add('invalid');
                    couponInput.classList.remove('valid');
                    couponInput.style.border = '1px solid red';  // Adjusted for better UX (red = invalid)
                } else {
                    couponInput.classList.remove('invalid');
                    couponInput.classList.add('valid');
                    couponInput.style.border = '1px solid green';  // Adjusted (green = valid)
                }
    
                clearErrors('.twwe-coupon-message', false);
                
                if(couponInput.value) {
                    doSkelly('.twwe-skeleton-mount', 'add');
    
                    spanLoader.innerHTML = '';
                    buttonLoader.innerHTML = `<img src="${window.state.iconsPath}/${window.twwLoaderSVG}.svg" alt="Loading...">`;
    
                    validateCoupon(couponInput.value, state.currentUserEmail).then((response) => {
                        if (true == response) {
                            invoiceGroup.querySelector('.twwe-coupon-message').appendChild(successDiv('Coupon code applied'));
                            getCheckoutState().then((response) => {
                                const couponInputs = document.querySelectorAll('.twwe-coupon-code');
                                couponInputs.forEach((input) => {
                                    input.value = state.couponCode;
                                });
    
    
                                invoiceHTML.forEach((invoice) => {
                                    invoice.innerHTML = response.data.invoice_html;
                                });
    
                                if(response.data.elements_options) {
                                    Object.entries(response.data.elements_options).forEach(([gatewayID, options]) => {
                                        document.getElementById('twwe-mepr-stripe-txn-amount').value = options.amount;
                                    });
                                }
    
    
                                spanLoader.innerHTML = 'Apply';
                                buttonLoader.innerHTML = '';
                                setTimeout(() => {
                                    doSkelly('.twwe-skeleton-mount', 'remove');
                                }, 300);
                            });
                        } else if (false === response) {
                            invoiceGroup.querySelector('.twwe-coupon-message').appendChild(errorDiv('Invalid coupon code'));
                        } else {
                            invoiceGroup.querySelector('.twwe-coupon-message').appendChild(errorDiv('There was an error applying the coupon'));
                        }
    
                        spanLoader.innerHTML = 'Apply';
                        buttonLoader.innerHTML = '';
                        setTimeout(() => {
                            doSkelly('.twwe-skeleton-mount', 'remove');
                        }, 300);
                    });  
                } else {
                    invoiceGroup.querySelector('.twwe-coupon-message').appendChild(errorDiv('Please enter a coupon code'));
                }
            });
        }
    });
}

// I want to reutrn some html to display the discount amount
const entryDiscount = (amount, couponCode) => {
    return `
    <div class="register-template__entry register-template__entry--discount">
        <div>Coupon code ${couponCode}</div>
        <div>$${amount}</div>
    </div>
    `;
}

const getCheckoutState = async () => {
    let payment_methods = [];
    payment_methods[0] = window.twwForms.gw_string;

    let data = {
        action: 'mepr_get_checkout_state',
        mepr_product_id: state.membershipId,
        mepr_coupon_code: state.couponCode,
        mepr_coupon_nonce: state.couponNonce,
        mpgft_gift_checkbox: false,
        mepr_payment_methods: payment_methods
    };

    // Return a new Promise to handle the AJAX request
    return new Promise((resolve, reject) => {
        jQuery.ajax({
            url: state.ajaxUrl,  // Your AJAX URL
            type: 'POST',
            dataType: 'json',
            data: data,
            success: function(response) {
                console.log('Success:', response);
                resolve(response);  // Resolve the Promise with the response
            },
            error: function(xhr, status, error) {
                console.error('Error:', error);
                reject(error);  // Reject the Promise with the error
            }
        });
    });
};

const validateCoupon = async (coupon, email) => {
    let data = {
        action: 'mepr_validate_coupon',
        code: coupon,  
        prd_id: parseInt(state.membershipId),  
        user_email: state.current_user_email,
        coupon_nonce: state.couponNonce
    };

    const formData = new URLSearchParams();

    for (const key in data) {
        formData.append(key, data[key]);
    }

    const response = await fetch(state.ajaxUrl, {
        method: 'POST',
        body: formData
    });

    if (!response.ok) {
        throw new Error('Network response was not ok');
    }

    return await response.json();
};

const initFormValidation = ($form, invalid_css = true) => {
    $form.addEventListener('input', (e) => {
        e.preventDefault();

        let email = $form.querySelector('input[type="email"]');
        let password = $form.querySelector('input[type="password"]');
        let continueButton = document.getElementById('tww-plus-button-continue');

        if(true === invalid_css && email) {
            if(!email.value || !window.validateEmail(email.value)) {
                email.classList.add('invalid');
            } else {
                email.classList.remove('invalid');
            }
        }

        if(password) {
            if(!password.value) {
                password.classList.add('invalid');
            } else {
                password.classList.remove('invalid');
            }
        }   
    });
}

const initRegisterLogin = () => {
    const loginForm = document.getElementById('tww-login-form');

    const continueButton = document.getElementById('tww-plus-button-continue');
    const loginButton = document.getElementById('tww-login-button');
    let email = document.getElementById('user_email1');
    let password = document.getElementById('user_password1');
    const passwordConfirm = document.getElementById('mepr_user_password_confirm1');
    const passwordEye = document.querySelector('.tww-plus-password-eye');
    const passwordEyeBtn = document.querySelector('.tww-plus-password-eye-btn');
    const useAuth0 = false;
    const getEl = (id) => document.getElementById(id);

    initFormValidation(loginForm, false);

    if(passwordEyeBtn) {
        passwordEyeBtn.addEventListener('click', () => {
            if('password' === password.type) {
                password.type = 'text';
                passwordEye.classList.add('dashicons-visibility');
                passwordEye.classList.remove('dashicons-hidden');
            } else {
                password.type = 'password';
                passwordEye.classList.remove('dashicons-visibility');
                passwordEye.classList.add('dashicons-hidden');
            }
        });
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const buttonLoader = document.querySelector('.button-loader');
        const spanLoader = document.querySelector('.button-text');
        const spanButtonText = document.querySelector('#tww-plus-subscribe-button-text');
        let   hasAccount = false;

        if(false === hasAccount && "function" === typeof window.createMember) {
            let closestParent = e.target.closest('#tww-login-form');
            let button = closestParent.querySelector('#' + window.config.twwSubscribeButtonText)
            buttonLoader.innerHTML = `<img src="${window.state.iconsPath}/${window.twwLoaderSVG}.svg" alt="Loading...">`;

            createMember({ email: email.value, username: email.value }).then((response) => {
                if(button) {
                    button.style.visibility = 'visible';
                }

                if(buttonLoader) {
                    buttonLoader.innerHTML = '';
                }

                if(response.message && 'success' === response.status && response.data && response.data.id) {
                    // closestParent.appendChild(successDivAlt(response.message + ' Reloading page.'));

                    // if(response.redirect_url) {
                    //     window.location.href = response.redirect_url;
                    // } else {
                    //     setTimeout(() => {
                    //         window.location.reload();
                    //     }, 1000);
                    // }
                } else if (response.data && 400 === response.data.status) {
                    if(response.code && 'member_exists' === response.code) {
                        hasAccount = true;
                        const message = window.successDiv('You are already registered. Please login or reset your password.');
                        // we want to toggle the has-account class on the password fields

                        let checkIfHasAccount = document.querySelectorAll('.check-if-has-account');
                        spanButtonText.textContent = 'Login';
                        
                        if(checkIfHasAccount) {
                            checkIfHasAccount.forEach((field) => {
                                field.classList.remove('check-if-has-account');
                                field.classList.add('has-account');
                            })
                        }

                        //createPasswordModal(fields, message);
                    } else {
                        //refactor getEl(config.twwRegistrationFree).appendChild(errorDiv(response.message)); to closest form parent
                        // so e.target.id can be used to target the form
                        let closestParent = e.target.closest('.tww-plus-subscribe-form');
                        closestParent.appendChild(window.errorDiv(response.message));
                    }
                }
            }).catch((error) => {             
                window.getEl(window.config.twwRegistrationFree).appendChild(window.errorDiv(error.message));
            });
        }

        if(true === hasAccount && email.value && password.value && "function" === typeof window.twwLogin) {
            window.twwLogin({email: email.value, password: password.value, use_auth_0: useAuth0}).then(response => {
                if(response.coupon_nonce) {
                    window.setState('couponNonce', response.coupon_nonce);
                }

                if(response.success && response.message) {
                    getEl('tww-plus-modal-inner').appendChild(window.successDiv(response.message));
                   // window.location.reload();
                } else {
                    //refactor getEl('tww-plus-modal-inner').appendChild(errorDiv(response.message)); to closest form parent
                    window.getEl('tww-plus-modal-inner').appendChild(window.errorDiv(response.message));
                }

                if(buttonLoader && spanLoader) {
                    buttonLoader.innerHTML = '';
                    spanLoader.textContent = 'Login';
                }
            }).catch(error => {
                window.getEl('tww-plus-modal-inner').appendChild(window.errorDiv(error.message));

                if(document.querySelector('#' + e.target.id).querySelector('.loader-default--inner')) {
                    document.querySelector('#' + e.target.id).querySelector('.loader-default--inner').innerHTML = `<img src="${window.state.iconsPath}/${window.twwLoaderSVG}.svg" alt="Loading...">`;
                }
            });
        }
    })
}

const initObserver = () => {
    document.querySelector('button.twwe-purchase').addEventListener('click', function() {
        // Select the iframe element
        var iframe = document.querySelector('iframe');
        
        if (!iframe) {
          console.error("Iframe not found.");
          return;
        }
        
        // Wait for the iframe to load
        iframe.onload = function() {
          // Get the iframe's document
          var iframeDocument = iframe.contentDocument || iframe.contentWindow.document;
          
          // Select the target element inside the iframe
          var targetElement = iframeDocument.querySelector('.mepr-stripe-card-errors');
          
          if (!targetElement) {
            console.error("Target element not found.");
            return;
          }
          
          // Create a MutationObserver to watch for changes in the target element
          var observer = new MutationObserver(function(mutationsList) {
            for (var mutation of mutationsList) {
              if (mutation.type === 'childList' || mutation.type === 'characterData') {
                // When the inner HTML changes, get the updated content
                var updatedContent = targetElement.innerHTML;
      
                // Update all elements with the same class on the page
                document.querySelectorAll('.mepr-stripe-card-errors').forEach(function(el) {
                  el.innerHTML = updatedContent;
                });
              }
            }
          });
      
          // Observe the target element for changes in its inner HTML
          observer.observe(targetElement, {
            childList: true,
            subtree: true,
            characterData: true
          });
        };
      });
}

const initInvoice = () => {
    const skeletonMounts = document.querySelectorAll('.twwe-skeleton-mount');
    
    setTimeout(() => {
        doSkelly('.twwe-skeleton-mount', 'remove')
    }, 200);
}

const doSkelly = (querySelector, action = 'add') => {
    const skeletonMounts = document.querySelectorAll(querySelector);
    
    skeletonMounts.forEach((mount) => {
        if('remove' === action) {
            mount.classList.remove('twwe-skeleton');
        } else {
            mount.classList.add('twwe-skeleton');
        }
    });;
}

const initSetEmail = () => {
    window.setState('currentUserEmail', window.twwForms.current_user_email ?? '');
}

const initPurchaseButton = () => {
    const purchaseButton = document.querySelector('#twwe-purchase-description-button');

    if(purchaseButton) {
        purchaseButton.addEventListener('click', (e) => {            
            purchaseButton.querySelector('.button-loader').innerHTML = `<img src="${window.state.iconsPath}/${window.twwLoaderSVG}.svg" alt="Loading...">`;
            purchaseButton.querySelector('.button-text').textContent = 'Processing...';
        });
    }
}

const initCoupon = () => {
    window.setState('couponCode', window.twwFormsRegister.coupon_code ?? '');
}

(function() {
    initCoupon();
    initSetEmail();
    //initPurchaseButton();
    initCouponEntry();
    initRegisterSteps();
    initRegisterLogin();
    initCardContinue();
    initInvoice();
})()