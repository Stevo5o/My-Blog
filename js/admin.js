$(function () {

    Parse.$ = jQuery;

    Parse.initialize("769EVCQQ8bpBBDeHfXR4E4i77L8u5uvMksRsUWee", "4TCWeKtnZ91KAJ0UOI60S8cdVddUH3sIHoLOkS6y");

    var Blog = Parse.Object.extend('Blog', {
        create: function (title, content) {
            this.save({
                'title': title,
                'content': content,
                'author': Parse.User.current(),
                'authorName': Parse.User.current().get('username'),
                'time': new Date().toDateString(),
                'url': title.LowerCase()
                .replace(/[^\w ]+/g,'')
                .replace(/ +/g,'-')
            }, {
                    success: function (blog) {
                        alert('You added a new blog: ' + blog.get('title'));
                    },
                    error: function (blog, error) {
                        console.log(blog);
                        console.log(error);
                    }
                });
        },
        update: function(title, content) {
            this.set({
                'title': title,
                'content': content
            }).save(null, {
                success: function(blog) {
                    alert('Your blog ' + blog.get('title') + 'has been saved');
                },
                error: function(blog, error) {
                    console.log(blog);
                    console.log(error);
                }
            })
        }
    }),
        // define views
        Blogs = Blogs = Parse.Collection.extend({
            model: Blog
        }),
        LoginView = Parse.View.extend({
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
                    success: function (user) {
                        blogRouter.navigate('admin', { trigger: true });
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
            events: {
                'click .add-blog': 'add'
            },
            add: function () {
                blogRouter.navigate('add', { trigger: true });
            },
            render: function () {
                var attributes = this.model.toJSON();
                this.$el.html(this.template(attributes)); 
            }
        }),
        AddBlogView = Parse.View.extend({
            template: Handlebars.compile($('#add-tpl').html()),
            events: {
                'submit .form-add': 'submit'
            },
            submit: function (e) {
                // prevent default submit
                e.preventDefault();
                // take the form and put it into a data object
                var data = $(e.target).serializeArray(),
                    // create a new instance of Blog
                    blog = new Blog();
                // call .create()
                blog.create(data[0].value, $('textarea').val());
            },
            render: function () {
                this.$el.html(this.template()).find('textarea').wysihtml5();
            }
        }),
        EditBlogView = Parse.View.extend({
            template: Handlebars.compile($('#edit-tpl').html()),
            events: {
                'submit .form-edit': 'submit'
            },
            submit: function (e) {
                e.preventDefault();
                var data = $(e.target).serializeArray();
                this.model.update(data[0].value, $('textarea').val());
            },
            render: function () {
                var attributes = this.model.toJSON();
                this.$el.html(this.template(attributes));
            }
        }),
        BlogsAdminView = Parse.View.extend({
            template: Handlebars.compile($('#blogs-admin-tpl').html()),
            events: {
                'click .app-edit': 'edit'
            },
            edit: function (e) {
                e.preventDefault();
                var href = $(e.target).attr('href');
                blogRouter.navigate(href, {trigger: true});
            },
            render: function () {
                var collection = { blog: this.collection.toJSON() };
                this.$el.html(this.template(collection));
            }
        }),
        BlogRouter = Parse.Router.extend({
            // define some shared variables
            initialize: function (options) {
                this.blogs = new Blogs();
            },
            // runs whne router is started
            start: function () {
                Parse.history.start({ pushState: true });
                this.navigate('admin', { trigger: true });
            },
            
            // map functions to urls
            // add '{{URL pattern}}': '{{function name}}'
            routes: {
                'admin': 'admin',
                'login': 'login',
                'add': 'add',
                'edit/:id': 'edit'
            },
            admin: function () { 
                // get current user in Parse
                var currentUser = Parse.User.current();

                if (!currentUser) {
                    // url redirct in JS
                    blogRoutor.navigate('login', { trigger: true });
                } else {
                    var welcomeView = new WelcomeView({ model: currentUser });
                    welcomeView.render();
                    $('.main-container').html(welcomeView.el);
                
                    // this.blogs so it stores the content for other blogs
                    // define it in BlogRoutor.initialize()
                    this.blogs.fetch({
                        success: function (blogs) {
                            var blogsAdminView = new BlogsAdminView({ collection: blogs });
                            blogsAdminView.render();
                            $('.main-container').append(blogsAdminView.el);
                        },
                        error: function (blogs, error) {
                            console.log(error);
                        }
                    });
                }
            },
            login: function () {
                // render login view on page
                var loginView = new LoginView();
                loginView.render();
                $('.main-container').html(loginView.el);
            },
            add: function () {
                var addBlogView = new addBlogView();
                addBlogView.render();
                $('.main-container').html(addBlogView.el);
            },
            edit: function (id) { 
                // define a new query 
                var query = new Parse.Query(Blog);
            
                // pass the id as the first param in .get() func
                query.get(id, {
                    success: function (blog) {
                        // if the blog was retrieved successfully
                        var editBlogView = new EditBlogView({ model: blog });
                        editBlogView.render();
                        $('.main-container').html(editBlogView.el);
                    },
                    error: function (blog, error) {
                        console.log(error);
                    }
                }),                
                query.equalTo("url", id).find().then(function(blogs) {                    
                    
                    var blog = blogs[0];
                    
                });
            }
        }),
        blogRouter = new BlogRouter();
    blogRouter.start();

} ());
