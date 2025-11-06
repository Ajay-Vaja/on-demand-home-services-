from rest_framework import serializers
from .models import Service
from apps.users.serializers import UserSerializer

class ServiceSerializer(serializers.ModelSerializer):
    provider_details = UserSerializer(source='provider', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)
    
    class Meta:
        model = Service
        fields = (
            'id', 'name', 'description', 'category', 'category_display',
            'price_per_hour', 'provider', 'provider_details', 'is_available',
            'minimum_hours', 'maximum_hours', 'service_area', 'rating',
            'total_bookings', 'created_at', 'updated_at'
        )
        read_only_fields = ('id', 'rating', 'total_bookings', 'created_at', 'updated_at')

class ServiceCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = (
            'name', 'description', 'category', 'price_per_hour',
            'minimum_hours', 'maximum_hours', 'service_area', 'is_available'
        )
    
    def create(self, validated_data):
        validated_data['provider'] = self.context['request'].user
        return super().create(validated_data)
