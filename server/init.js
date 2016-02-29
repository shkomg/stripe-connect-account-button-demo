//STRIPE
ServiceConfiguration.configurations.remove({
  service: 'stripe'
});
ServiceConfiguration.configurations.insert({
    service: 'stripe',
    appId: Meteor.settings.client_id,
    secret: Meteor.settings.stripe_sk,
    scope: 'read_write'
});
