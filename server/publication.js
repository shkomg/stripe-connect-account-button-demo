Meteor.publish(null, function () {
  return Meteor.users.find({_id:this.userId},
                           {fields:{roles:1, services:1,
                                    emails:1, profile:1,
                                    username:1
                                   }
                           });
});
