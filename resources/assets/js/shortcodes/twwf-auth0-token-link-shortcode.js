const twwfState = {
    domain: 'https://twwf.auth0.com',
    clientId: 'YOUR_CLIENT'
    clientSecret: 'YOUR_SECRET',
    audience: 'https://twwf.auth0.com/api/v2/'
}

const initTwwfAuth0tokenShortcode = () => {
    let twwfAuth0TokenLinks = document.querySelectorAll('.twwf-auth0-token-link-shortcode');

    twwfAuth0TokenLinks.forEach((link) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            alert('Auth0 token link clicked');
        })
    })
}

(function () {
    initTwwfAuth0tokenShortcode();
})()