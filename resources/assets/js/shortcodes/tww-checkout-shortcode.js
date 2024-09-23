console.log("we are the champions");
const twwfUser = {
    user_id: window.twwForms?.current_user_id,
    user_email: window.twwForms?.user_email,
    user_login: window.twwForms?.user_login,
}

const initRegisterSteps = () => {
    const twwSteps = document.querySelectorAll('.tww-step');

    if(!twwfUser.user_id || "0" === twwfUser.user_id) {  
        let mount = document.querySelectorAll('.tww-step--account .tww-step--when-open');

        let fields = window.createLoginFields(null, true);
        let message = "Welcome back! Please login to continue.";

        window.createLoginFlow(fields, message, null, mount);
    }

    if(twwSteps.length) {
        twwSteps.forEach( (step) => {
            let editButton = step.querySelector('.tww-step__edit-link');
            editButton.addEventListener('click', (e) => {
                console.log('edit button clicked');
                e.preventDefault();

                let closeAllSteps = document.querySelectorAll('.tww-step--open');

                if(closeAllSteps.length) {
                    closeAllSteps.forEach((step) => {
                        step.classList.remove('tww-step--open');
                    })
                }

                let stepToOpen = e.target.closest('.tww-step');
                let stepToClose = e.target.closest('.tww-step--open');

                if(stepToOpen) {
                    stepToOpen.classList.add('tww-step--open');
                }
                

                //i want to check if tww-step--open is in the classlist and if not add it and remove it from the others
            })
        })
    }
}

const initRegisterLogin = () => {
    const loginForm = document.getElementById('tww-login-form');

    const continueButton = document.getElementById('tww-plus-button-continue');
    const loginButton = document.getElementById('tww-login-button');
    const email = document.getElementById('tww-plus-login-email');
    const password = document.getElementById('tww-plus-login-password');
    const passwordEye = document.querySelector('.tww-plus-password-eye');
    const passwordEyeBtn = document.querySelector('.tww-plus-password-eye-btn');
    const useAuth0 = false;
    const getEl = (id) => document.getElementById(id);

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

    loginForm.addEventListener('input', (e) => {
        e.preventDefault();

        if(!email.value || !window.validateEmail(email.value)) {
            email.classList.add('invalid');
        } else {
            email.classList.remove('invalid');
        }

        if(!password.value) {
            password.classList.add('invalid');
        } else {
            password.classList.remove('invalid');
        }

        if(window.validateEmail(email.value) && password.value) {
            continueButton.disabled = false;
            console.log(password.value);
        } else {
            continueButton.disabled = true;
            console.log(password.value);
        }
    });

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

(function() {
    initRegisterSteps();
    initRegisterLogin();
})()