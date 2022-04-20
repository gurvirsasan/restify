from re import S
from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.generics import CreateAPIView, UpdateAPIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from django.http import JsonResponse
from django.shortcuts import get_object_or_404

from accounts.models import CustomUser
from accounts.serializers import AccountSerializer
from restaurants.models import Restaurant
from collections import OrderedDict


# view to create a new account
class CreateAccountView(CreateAPIView):
    serializer_class = AccountSerializer


class DeleteAccountView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, **kwargs):
        request.user.delete()
        return Response({'detail': "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


# view to update an account
class UpdateAccountView(UpdateAPIView):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class AccountView(APIView):
    serializer_class = AccountSerializer
    permission_classes = [IsAuthenticated]

    def get(self, request):
        response = {}

        response['username'] = request.user.username
        response['first_name'] = request.user.first_name
        response['last_name'] = request.user.last_name
        response['email'] = request.user.email
        if request.user.avatar:
            # response['avatar'] = 'http://localhost:8000/media/' + str(request.user.avatar)
            response['avatar'] = str(request.path).replace('accounts/profile/', 'media/') + str(request.user.avatar)

        restaurant = Restaurant.objects.filter(owner=request.user)

        if restaurant:
            data = list(restaurant.values())
            # data[0]['icon'] = 'http://localhost:8000/media/' + str(data[0]['icon'])
            data[0]['icon'] = str(request.path).replace('accounts/profile/', 'media/') + str(data[0]['icon'])
            response['restaurants_owned'] = data
        else:
            response['restaurants_owned'] = ['Not Applicable']

        response['restaurants_followed'] = []
        for followed in request.user.restaurants_followed.all():
            response['restaurants_followed'].append(OrderedDict([
                ('id', followed.id),
                ('name', followed.name),
                ('general_info', followed.general_info)
            ]))

        response['comments'] = []
        for comment in request.user.comments.all():
            response['comments'].append(OrderedDict([
                ('text', comment.text),
                ('likes', len(comment.likes.all()))
            ]))

        return JsonResponse({"user": response})
