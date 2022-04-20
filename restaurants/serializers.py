from collections import OrderedDict

from rest_framework import serializers
from .models import Restaurant, Comment, Blog, Gallery, MenuItem


# Restaurant test
class RestaurantSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = []

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation = instance.id
        return representation


# Restaurant Serializer
class RestaurantSerializer(serializers.ModelSerializer):
    # Define the meta attributes for the serializer to reference
    class Meta:
        model = Restaurant
        fields = '__all__'
        depth = 3

    # Reformat the outputted json
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        owner = representation['owner']
        representation['owner'] = OrderedDict([
            ('id', owner.get('id')),
            ('username', owner.get('username')),
            ('email', owner.get('email'))
        ])

        if representation['icon']:
            representation['icon'] = str(representation['icon'])

        likes = representation['likes']
        likes_updated = []
        for like in likes:
            likes_updated.append(
                OrderedDict([
                    ('id', like.get('id')),
                    ('username', like.get('username')),
                    ('email', like.get('email'))
                ])
            )
        representation['likes'] = likes_updated

        for comment in representation['comments']:
            author = comment['author']
            author = OrderedDict([
                ('id', author.get('id')),
                ('username', author.get('username')),
                ('email', author.get('email'))
            ])
            comment['author'] = author

        blogs = representation['blogs']
        for blog in blogs:
            likes = blog['likes']
            user_updated = []
            for user in likes:
                user_updated.append(
                    OrderedDict([
                        ('id', user.get('id')),
                        ('username', user.get('username')),
                        ('email', user.get('email'))
                    ])
                )
            blog['likes'] = user_updated

        comments = representation['comments']
        for comment in comments:
            likes = comment['likes']
            user_updated = []
            for user in likes:
                user_updated.append(
                    OrderedDict([
                        ('id', user.get('id')),
                        ('username', user.get('username')),
                        ('email', user.get('email'))
                    ])
                )
            comment['likes'] = user_updated
        return representation

    # Create a restaurant
    def create(self, validated_data):
        return super().create(validated_data | {"owner": self.context['request'].user})


# Gallery Serializer
class GallerySerializer(serializers.ModelSerializer):
    # Define the meta attributes for the serializer to reference
    class Meta:
        model = Gallery
        fields = '__all__'


# Comment Serializer
class CommentSerializer(serializers.ModelSerializer):
    # Define the meta attributes for the serializer to reference
    class Meta:
        model = Comment
        fields = ['id', 'text']

    # Create a comment
    def create(self, validated_data):
        return super().create(validated_data | {"author": self.context['request'].user})


# Like Serializer
class LikeSerializer(serializers.ModelSerializer):
    # Define the meta attributes for the serializer to reference
    class Meta:
        model = Restaurant
        fields = []


# Follow Serializer
class FollowSerializer(serializers.ModelSerializer):
    # Define the meta attributes for the serializer to reference
    class Meta:
        model = Restaurant
        fields = []


# Blog serializer
class BlogSerializer(serializers.ModelSerializer):
    # Define the meta attributes for the serializer to reference
    class Meta:
        model = Blog
        fields = ['id', 'title', 'description', 'image', 'created_at']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        # add number of likes to representation based on likes model attribute
        representation['likes'] = len(instance.likes.all())
        representation['restaurant_name'] = instance.restaurant_set.all()[0].name
        representation['restaurant_id'] = instance.restaurant_set.all()[0].id
        return representation


# Blog Like Serializer
class BlogLikeSerializer(serializers.ModelSerializer):
    # Define the meta attributes for the serializer to reference
    class Meta:
        model = Blog
        fields = []


# Comment Like Serializer
class CommentLikeSerializer(serializers.ModelSerializer):
    # Define the meta attributes for the serializer to
    # reference
    class Meta:
        model = Comment
        fields = []


class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = '__all__'
