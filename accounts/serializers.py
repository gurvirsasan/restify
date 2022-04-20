from django.contrib.auth.hashers import make_password
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer
from rest_framework import serializers, status
from django.core.exceptions import ValidationError


from accounts.models import CustomUser
from restaurants.models import Restaurant


# serializers for the accounts - custom user
class AccountSerializer(ModelSerializer):
    password = serializers.CharField(
        min_length=8,
        write_only=True,
        required=True,
        style={'input_type': 'password'}
    )
    password2 = serializers.CharField(
        min_length=8,
        write_only=True,
        required=True,
        style={'input_type': 'password'}
        )

    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'password', 'password2', 'first_name', 'last_name', 'avatar', 'email']

    def create(self, validated_data):
        if validated_data['password'] != validated_data['password2']:
            raise ValidationError({
                'password': "The two password fields didn't match"
            })
        validated_data.pop('password2')
        user = super().create(validated_data)
        user.set_password(validated_data['password'])
        user.save()
        return user

    def update(self, instance, validated_data):

        validated_data.pop('password2')
        if validated_data['username'] != '':
            instance.username = validated_data['username']
        if validated_data['password'] != '':
            instance.set_password(validated_data['password'])
        if validated_data.get('email', '') != '':
            instance.email = validated_data['email']
        if validated_data.get('first_name', '') != '':
            instance.first_name = validated_data['first_name']
        if validated_data.get('last_name', '') != '':
            instance.last_name = validated_data['last_name']
        if validated_data.get('avatar', '') != '':
            instance.avatar = validated_data['avatar']
        instance.save()
        return instance