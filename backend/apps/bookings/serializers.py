from rest_framework import serializers
from django.utils import timezone
from datetime import timedelta
from .models import Booking
from apps.services.serializers import ServiceSerializer
from apps.users.serializers import UserSerializer

class BookingSerializer(serializers.ModelSerializer):
    service_details = ServiceSerializer(source='service', read_only=True)
    customer_details = UserSerializer(source='customer', read_only=True)
    booking_id = serializers.UUIDField(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    time_slot_display = serializers.CharField(source='get_time_slot_display', read_only=True)
    
    class Meta:
        model = Booking
        fields = (
            'id', 'booking_id', 'customer', 'customer_details', 'service', 'service_details',
            'booking_date', 'time_slot', 'time_slot_display', 'hours_requested', 
            'status', 'status_display', 'total_amount', 'special_instructions',
            'customer_address', 'customer_phone', 'rating', 'feedback',
            'created_at', 'updated_at', 'confirmed_at', 'completed_at'
        )
        read_only_fields = (
            'id', 'booking_id', 'customer', 'total_amount', 'created_at', 
            'updated_at', 'confirmed_at', 'completed_at'
        )

class BookingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = (
            'service', 'booking_date', 'time_slot', 'hours_requested',
            'special_instructions', 'customer_address', 'customer_phone'
        )
    
    def validate_booking_date(self, value):
        # Can't book for past dates
        if value < timezone.now().date():
            raise serializers.ValidationError("Cannot book for past dates")
        
        # Can't book more than 30 days in advance
        if value > timezone.now().date() + timedelta(days=30):
            raise serializers.ValidationError("Cannot book more than 30 days in advance")
        
        return value
    
    def validate(self, attrs):
        # Check if the time slot is available
        service = attrs['service']
        booking_date = attrs['booking_date']
        time_slot = attrs['time_slot']
        
        existing_booking = Booking.objects.filter(
            service=service,
            booking_date=booking_date,
            time_slot=time_slot,
            status__in=['pending', 'confirmed', 'in_progress']
        ).exists()
        
        if existing_booking:
            raise serializers.ValidationError("This time slot is already booked")
        
        # Check if service is available
        if not service.is_available:
            raise serializers.ValidationError("This service is currently not available")
        
        return attrs
    
    def create(self, validated_data):
        validated_data['customer'] = self.context['request'].user
        
        # Calculate total amount
        service = validated_data['service']
        hours_requested = validated_data['hours_requested']
        validated_data['total_amount'] = service.price_per_hour * hours_requested
        
        return super().create(validated_data)

class BookingStatusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = ('status',)
