$(function () {
    Parse.$ = jQuery;

    Parse.initialize("769EVCQQ8bpBBDeHfXR4E4i77L8u5uvMksRsUWee", "4TCWeKtnZ91KAJ0UOI60S8cdVddUH3sIHoLOkS6y");
        // define views
        var LoginView = Parse.View.extend({
            template: Handlebars.compile($('#login-tpl').html()),
            events: {
                'submit .form-signin': 'login'
            },
            login: function (e) {

                // prevent default submit event
                e.preventDefault();

                // get data from th form and put them inot vars
                var data = $(e.target).serializeArray(),
                        username = data[0].value,
                        password = data[1].value;

                // call parse login function with those vars
                Parse.User.logIn(username, password, {
                    // if th username and password matches
                    success: function (user, error) {
                        alert('Welcome!');
                    },
                    // if there is an error
                    error: function (user, error) {
                        console.log(error);
                    }
                });
            },
            render: function () {
                this.$el.html(this.template());
            }
        }),
                WelcomeView = Parse.View.extend({
                    template: Handlebars.compile($('#welcome-tpl').html()),
                    render: function () {
                        var attributes = this.model.toJson();
                        this.$el.html(this.template(attributes));
                    }
                });  

    // Render login view on page
    var loginView = new LoginView();
    loginView.render();
    $('.main-container').html(loginView.el);

}());
