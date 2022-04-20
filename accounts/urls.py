from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView

from accounts.views import CreateAccountView, UpdateAccountView, AccountView, DeleteAccountView

app_name = 'accounts'

urlpatterns = [
    path('signup/', CreateAccountView.as_view(), name='signup'),
    path('update/', UpdateAccountView.as_view(), name='update'),
    path('profile/', AccountView.as_view(), name='profile'),
    path('signin/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('delete/', DeleteAccountView.as_view(), name='delete')
]