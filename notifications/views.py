from django.http import JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import NotificationSerializer
from .models import Notification
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.pagination import PageNumberPagination


# See notifications as a user. When a restaruant I follow makes a new blog
# post or updates its menu, search through notification object by user field,
# and sort by date by descending order.

# See notifications as a owner. When somenone follows, likes, and posts a
# comment on my restaruant. search through notification object by user field,
# and sort by date by descending order.
class OwnerNotificationList(ListAPIView):
    # queryset = self.get_queryset().order_by('-date')
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(user=user.id, forUser=False).order_by('-date')


class UserNotificationList(ListAPIView):
    # queryset = self.get_queryset().order_by('-date')
    serializer_class = NotificationSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = PageNumberPagination

    def get_queryset(self):
        user = self.request.user
        return Notification.objects.filter(user=user.id, forUser=True).order_by('-date')


    # def get(self, request):
    #     notifs = self.get_queryset().order_by('-date')
        # paginator = PageNumberPagination()
        # paginator.page_size = 10
        # page = paginator.paginate_queryset(notifs, request)
        # serializer = NotificationSerializer(notifs, many=True)
        # return Response(serializer.data)
