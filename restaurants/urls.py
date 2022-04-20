from django.urls import path

from restaurants.views import RestaurantList, CreateRestaurantView, UpdateRestaurantView, AddRestaurantCommentView, \
    DeleteRestaurantCommentView, LikeRestaurantView, CreateBlogView, AddGalleryImageView, LikeBlogView, ListBlogsView, \
    FollowRestaurantView, AddRestaurantCommentLikeView, DeleteBlogView, DeleteRestaurantView, AddMenuItem, DeleteMenuItem, \
    SingleRestaurantView, UserFeedView, RestaurantSearch

app_name = 'restaurant'

urlpatterns = [
    # path('/', None, name=''),
    path('<int:id>/', SingleRestaurantView.as_view(), name="list-restaurant"),
    path('all/', RestaurantList.as_view(), name='list-restaurants'),
    path('search/', RestaurantSearch.as_view(), name='search-restaurants'),
    path('create/', CreateRestaurantView.as_view(), name='add-restaurant'),
    path('<int:id>/delete/', DeleteRestaurantView.as_view(), name='delete-restaurant'),
    path('<int:id>/update/', UpdateRestaurantView.as_view(), name='update-restaurant'),
    path('<int:id>/add-img/', AddGalleryImageView.as_view(), name='add-gallery'),
    path('<int:id>/comment/', AddRestaurantCommentView.as_view(), name='add-comment'),
    path('comment/<int:commentid>/delete/', DeleteRestaurantCommentView.as_view(), name='delete-comment'),
    path('<int:id>/comment/<int:commentid>/like/', AddRestaurantCommentLikeView.as_view(), name='add-comment-like'),
    path('<int:id>/like/', LikeRestaurantView.as_view(), name='add-like'),
    path('<int:id>/follow/', FollowRestaurantView.as_view(), name='add-follow'),
    path('<int:id>/blogs/', ListBlogsView.as_view(), name='gets-blog'),
    path('<int:id>/blog/', CreateBlogView.as_view(), name='add-blog'),
    path('<int:id>/blog/<int:blogid>/delete/', DeleteBlogView.as_view(), name='delete-blog'),
    path('<int:id>/blog/<int:blogid>/like/', LikeBlogView.as_view(), name='like-blog'),
    path('<int:id>/menu/add/', AddMenuItem.as_view(), name='add-menu-items'),
    path('<int:id>/menu/<int:itemid>/delete/', DeleteMenuItem.as_view(), name='delete-menu-items'),
    path('feed/', UserFeedView.as_view(), name='user-feed'),
]
