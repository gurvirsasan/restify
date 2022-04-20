# Create your views here.
from django.core.exceptions import PermissionDenied
from rest_framework import status
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView, RetrieveAPIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from django.http import HttpResponse, JsonResponse
from accounts.models import CustomUser
from rest_framework.pagination import PageNumberPagination

from restaurants.models import Restaurant, Comment, Blog, Menu, MenuItem
from restaurants.serializers import CommentLikeSerializer, RestaurantSearchSerializer, RestaurantSerializer, CommentSerializer, LikeSerializer, \
    BlogSerializer, GallerySerializer, BlogLikeSerializer, FollowSerializer, MenuItemSerializer
from notifications.models import Notification
from django.shortcuts import get_object_or_404


# View to list all the restaurants
class RestaurantList(ListAPIView):
    queryset = Restaurant.objects.all()
    serializer_class = RestaurantSerializer
    # permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination


# View to search for a restaurant
class RestaurantSearch(ListAPIView):
    serializer_class = RestaurantSearchSerializer
    # permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        queryset = []
        search_type = self.request.query_params.get('type')
       
        search_string = self.request.query_params.get('query')
        if ((search_string is not None) and (search_type is not None)):
            queryset = Restaurant.objects.all()
            search_string = search_string.lower()
            search_type = search_type.lower()
            if search_type == 'type':
                queryset = queryset.filter(type__icontains=search_string)
            if search_type == 'location':
                queryset = queryset.filter(location__icontains=search_string)
            if search_type == 'name':
                queryset = queryset.filter(name__icontains=search_string)
        return queryset


class SingleRestaurantView(RetrieveAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return get_object_or_404(Restaurant, id=self.kwargs['id'])


# View to create a restaurant post
class CreateRestaurantView(CreateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        if self.request.user.restaurants_owned is None:
            restaurant_response_obj = self.create(request, *args, **kwargs)
            restaurant = Restaurant.objects.get(pk=restaurant_response_obj.data['id'])
            self.request.user.restaurants_owned = restaurant
            self.request.user.save()

            # create menu object
            menu = Menu.objects.create()
            menu.name = restaurant.name
            restaurant.menu = menu

            menu.save()
            restaurant.save()
            return restaurant_response_obj
        else:
            return Response({'detail': "User already owns a restaurant!"}, status=status.HTTP_409_CONFLICT)


class DeleteRestaurantView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, **kwargs):
        restaurant = get_object_or_404(Restaurant, id=kwargs['id'])
        if restaurant.owner == request.user:
            restaurant.owner.restaurants_owned = None
            restaurant.delete()
            return Response({'detail': "Restaurant deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied()


class AddGalleryImageView(CreateAPIView):
    serializer_class = GallerySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['id'])
        img = serializer.save(restaurant=restaurant)
        restaurant.gallery.add(img)
        restaurant.save()

        return img


# View to update a restaurant
class UpdateRestaurantView(UpdateAPIView):
    serializer_class = RestaurantSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['id'])
        if restaurant.owner == self.request.user:
            return restaurant
        else:
            raise PermissionDenied()


# View to create a comment on a restaurant
class AddRestaurantCommentView(CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['id'])
        comment = serializer.save(restaurant=restaurant)
        restaurant.comments.add(comment)
        self.request.user.comments.add(comment)

        curr = self.request.user
        Notification.objects.create(user=restaurant.owner,
                                    message=f"{curr.first_name} {curr.last_name} has commented on your "
                                            f"restaurant {restaurant.name}", forUser=False)

        restaurant.save()
        self.request.user.save()  # save the user - added comments in user


# View to create a comment on a restaurant
class DeleteRestaurantCommentView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, **kwargs):
        comment = get_object_or_404(Comment, id=kwargs['commentid'])
        if comment.author == request.user:
            comment.delete()
            self.user.comments.renove(comment)
            return Response("Comment deleted successfully", status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied()


# View to add a like to a comment on a restaurant
class AddRestaurantCommentLikeView(UpdateAPIView):
    serializer_class = CommentLikeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        comment = get_object_or_404(Comment, id=self.kwargs['commentid'])
        if self.request.user in comment.likes.all():
            comment.likes.remove(self.request.user)
        else:
            comment.likes.add(self.request.user)
        # comment.save()


# View to update a blog post so that a user can like it
class LikeRestaurantView(UpdateAPIView):
    serializer_class = LikeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['id'])
        if self.request.user in restaurant.likes.all():
            restaurant.likes.remove(self.request.user)
        else:
            restaurant.likes.add(self.request.user)
        restaurant.save()

        curr = self.request.user
        Notification.objects.create(user=restaurant.owner,
                                    message=f'{curr.first_name} {curr.last_name} has '
                                            f'liked your restaurant {restaurant.name}')
        return self.request.user


# View to update a blog post so that a user can like it
class FollowRestaurantView(UpdateAPIView):
    serializer_class = FollowSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['id'])

        if restaurant.owner == self.request.user:
            return self.request.user
        if self.request.user in restaurant.fans.all():
            self.request.user.restaurants_followed.remove(restaurant)
            restaurant.fans.remove(self.request.user)
            restaurant.followers -= 1
        else:
            self.request.user.restaurants_followed.add(restaurant)
            restaurant.fans.add(self.request.user)
            restaurant.followers += 1

        restaurant.save()
        self.request.user.save()

        curr = self.request.user
        Notification.objects.create(user=restaurant.owner,
                                    message=f'{curr.first_name} {curr.last_name} has '
                                            f'followed your restaurant {restaurant.name}', forUser=False)
        return self.request.user


# View to get all blog posts from a restaurant
class ListBlogsView(ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['id'])
        queryset = restaurant.blogs
        return queryset.order_by('-created_at')


# View to get all blog posts from all the restaurants followed by the user
class UserFeedView(ListAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        all_restaurants_followed = self.request.user.restaurants_followed.all()
        # blogs = Blog.objects.none()
        # for rest in all_restaurants_followed:
        #     print (rest)
        #     rest_blogs = rest.blogs
        #     # combine blogs and blogs into blogs
        #     blogs = blogs | rest_blogs
        blogs = Blog.objects.filter(restaurant__in=all_restaurants_followed)
        return blogs.order_by('-created_at')


# View to create a blog post that is listed inside the restaurant
class CreateBlogView(CreateAPIView):
    serializer_class = BlogSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['id'])
        if restaurant.owner == self.request.user:
            blog = serializer.save(restaurant=restaurant)
            fans = restaurant.fans.all()
            for fan in fans:
                Notification.objects.create(user=fan,
                                            message=f'{restaurant.name} has posted a new blog', forUser=True)
            restaurant.blogs.add(blog)
            restaurant.save()
        else:
            raise PermissionDenied()


# View to create a blog post that is listed inside the restaurant
class DeleteBlogView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, **kwargs):
        restaurant = get_object_or_404(Restaurant, id=kwargs['id'])
        blog = get_object_or_404(Blog, id=kwargs['blogid'])
        if restaurant.owner == request.user:
            blog.delete()
            return Response({'detail': "Blog deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied()


# View to like a blog post
class LikeBlogView(UpdateAPIView):
    serializer_class = BlogLikeSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['id'])
        blog_post = get_object_or_404(Blog, id=self.kwargs['blogid'])

        if self.request.user in blog_post.likes.all():
            blog_post.likes.remove(self.request.user)
        else:
            blog_post.likes.add(self.request.user)
            curr = self.request.user
            if blog_post.restaurant_set.first().owner != curr:
                Notification.objects.create(user=restaurant.owner,
                                            message=f"{curr.first_name} {curr.last_name} has liked your "
                                                    f"restaurant {restaurant.name} blog post about {blog_post.title}",
                                            forUser=False)

        blog_post.save()


# View to create a menu item for a restaurant
class AddMenuItem(CreateAPIView):
    serializer_class = MenuItemSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        restaurant = get_object_or_404(Restaurant, id=self.kwargs['id'])
        if restaurant.owner == self.request.user:
            menu_item = serializer.save()
            restaurant.menu.items.add(menu_item)
            restaurant.save()
            for fan in restaurant.fans.all():
                Notification.objects.create(user=fan,
                                            message=f'{restaurant.name} has added {menu_item.name} to their menu', forUser=True)
        else:
            raise PermissionDenied()


# View to create a delete a menu item
class DeleteMenuItem(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, **kwargs):
        restaurant = get_object_or_404(Restaurant, id=kwargs['id'])
        if restaurant.owner == request.user:
            item = get_object_or_404(MenuItem, id=kwargs['itemid'])
            restaurant.menu.items.remove(item)
            item.delete()
            for fan in restaurant.fans.all():
                Notification.objects.create(user=fan,
                                            message=f'{restaurant.name} has removed {item.name} from their menu', forUser=True)
            return Response({'detail': "Menu item deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        else:
            raise PermissionDenied()
