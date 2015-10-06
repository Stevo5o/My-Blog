$(function () {
	Parse.$ = jQuery;

	Parse.initialize("769EVCQQ8bpBBDeHfXR4E4i77L8u5uvMksRsUWee", "4TCWeKtnZ91KAJ0UOI60S8cdVddUH3sIHoLOkS6y");

	var Blog = Parse.Object.extend("Blog");
	var Blogs = Parse.Collection.extend({
		model: Blog
	});

	var BlogsView = Parse.View.extend({
		template: Handlebars.compile($('#blogs-tpl').html()),
		render: function () {
			var collection = {
				blog: this.collection.toJSON()
			};
			this.$el.html(this.template(collection));
		}
	});
	blogs = new Blogs();
	blogs.fetch({
		success: function (blogs) {
			var blogsView = new BlogsView({
				collection: blogs
			});
			blogsView.render();
			$('.main-container').html(blogsView.el);
		},
		error: function (blogs, error) {
			console.log(error);
		}
	});
});