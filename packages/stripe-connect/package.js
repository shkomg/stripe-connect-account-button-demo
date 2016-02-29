Package.describe({
    summary: "Login service for Stripe accounts using Stripe Connect",
    name: "stripe-connect",
    version: "0.0.1",
    git: ""
});

Package.onUse( function (api) {
    api.versionsFrom('1.2');
    api.use('accounts-base', ['client', 'server']);
    api.imply('accounts-base', ['client', 'server']);
    api.use('accounts-oauth', ['client', 'server']);

    api.use('oauth', ['client', 'server']);
    api.use('oauth2', ['client', 'server']);
    api.use('http', ['server']);
    api.use('underscore', 'server');
    api.use('templating', 'client');
    api.use('random', 'client');
    api.use('service-configuration', ['client', 'server']);

    api.addFiles("lib/accounts_stripe.js");
    api.addFiles('lib/stripe_client.js', 'client');
    api.addFiles('lib/stripe_server.js', 'server');
});
