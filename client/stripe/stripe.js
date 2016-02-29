Template.stripe.events({
  'click .stripe-connect': function(e, t){
    Meteor.loginWithStripe({
      stripe_landing: 'login'
    }, function () {});
  },

  'click .stripe-disconnect': function(e, t){
    if (confirm("Are you sure?"))
      Meteor.call('disconnectStripe');
  }
});

Template.stripeConnect.rendered=function () {
  Meteor.call('stripeConnectCheck',Meteor.user(),function (err) {
    if (!err) {
      toastr.success("Stripe added, thank you!");
    } else if (err.error==='duplicate-found') {
      toastr.error("Another account using the same Stripe account was found!");
    } else {
      toastr.error(err.reason);
      console.log(err);
    };
  });
};




