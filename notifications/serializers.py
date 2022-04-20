from rest_framework import serializers
from .models import Notification
from accounts.models import CustomUser
from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user = representation['user']
        person = CustomUser.objects.get(id=user)
        representation['user'] = person.username + ' ' + person.last_name
        representation.pop('id')
        return representation

    def save(self, validated_data):
        return super().create(validated_data)
