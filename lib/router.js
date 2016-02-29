Router.configure({
  layoutTemplate: 'layoutMain'
});

Router.route('/', function () {
  if (Meteor.loggingIn()) {
    this.render('signingIn');
  } else if (!Meteor.userId()) {
    this.render('mainPage');
  } else {
    this.render('dashboard');
  }
});
