$(function() {
    Parse.$ = jQuery;

    Parse.initialize("769EVCQQ8bpBBDeHfXR4E4i77L8u5uvMksRsUWee", "4TCWeKtnZ91KAJ0UOI60S8cdVddUH3sIHoLOkS6y");

    var Blog = Parse.Object.extend('Blog', {
        create: function(title, content) {
            this.set({
                'title': title,
                'content': content,
                'author': Parse.User.current()
            }).save(null, {
                success: function(blog) {
                    alert('you added a new blog: ' + blog.get('title'));
                },
                error: function(blog, error) {
                    console.log(blog);
                    console.log(error);
                }
            });
        }
    });
    // define views
    var LoginView = Parse.View.extend({
            template: Handlebars.compile($('#login-tpl').html()),
            events: {
                'submit .form-signin': 'login'
            },
            login: function(e) {

                // prevent default submit event
                e.preventDefault();

                // get data from th form and put them inot vars
                var data = $(e.target).serializeArray(),
                    username = data[0].value,
                    password = data[1].value;

                // call parse login function with those vars
                Parse.User.logIn(username, password, {
                    // if th username and password matches
                    success: function(user) {
                        var welcomeView = new WelcomeView({
                            model: user
                        });
                        welcomeView.render();
                        $('.main-container').html(welcomeView.el);
                    },
                    // if there is an error
                    error: function(user, error) {
                        console.log(error);
                    }
                });
            },
            render: function() {
                this.$el.html(this.template());
            }
        }),
        WelcomeView = Parse.View.extend({
            template: Handlebars.compile($('#welcome-tpl').html()),
            events: {
                'click .add-blog': 'add'
            },
            add: function() {
                var addBlogView = new AddBlogView();
                addBlogView.render();
                $('.main-container').html(addBlogView.el);
            },
            render: function() {
                var attributes = this.model.toJSON();
                this.$el.html(this.template(attributes));
            }
        });

    // blog view
    var AddBlogView = Parse.View.extend({
        template: Handlebars.compile($('#add-tpl').html()),
        events: {
            'submit .form-add': 'submit'
        },
        submit: function(e) {
            // prevent default submit
            e.preventDefualt();
            // take the form and put it into a data object
            var data = $(e.target).serializeArray(),
                // create a new instance of Blog
                blog = new blog();
            // call .create()
            blog.create(data[0].value, data[1].value);
        },
        render: function(e) {
            this.$el.html(this.template());
        }
    });

    // render login view on page
    var loginView = new LoginView();
    loginView.render();
    $('.main-container').html(loginView.el);

}());
