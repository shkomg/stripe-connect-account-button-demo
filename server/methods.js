Meteor.methods({
  stripeConnectCheck: function (user) {
    var serviceData=user.services.stripe.process;
    if (Meteor.users.findOne({"services.stripe.id":serviceData.id})) {
      Meteor.setTimeout( function () {
        Meteor.users.update({_id:user._id},{$unset:{'services.stripe':""}}) 
      }, 3000);
      throw new Meteor.Error("duplicate-found", "Another account using the same Stripe account was found!");
    } else {
      Meteor.users.update({_id:Meteor.userId()},{$set:{'services.stripe':serviceData}});
    };
  },

  disconnectStripe: function () {
    HTTP.post('https://connect.stripe.com/oauth/deauthorize',
              { params: { client_secret: Meteor.settings.stripe_sk,
                          client_id: Meteor.settings.client_id,
                          stripe_user_id: Meteor.user().services.stripe.stripe_user_id
                        }
              }, function (e){
                if ((!e) || (e.response.data.error_description.indexOf('is not connected to stripe account')>-1)) {
                  Meteor.users.update({_id:Meteor.userId()}, {$unset:{'services.stripe':"1"}});
                } else {
                  console.log(e);
                };
              });
  }

});

