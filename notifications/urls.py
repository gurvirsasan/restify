from django.urls import path
from .views import OwnerNotificationList, UserNotificationList

app_name = 'notifications'

urlpatterns = [
    path('owner/', OwnerNotificationList.as_view(), name='owner-notifications'),
    path('user/', UserNotificationList.as_view(), name='user-notifications'),
]
