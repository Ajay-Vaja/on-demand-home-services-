from rest_framework import serializers
from .models import Payment
from apps.bookings.serializers import BookingSerializer

class PaymentSerializer(serializers.ModelSerializer):
    booking_details = BookingSerializer(source='booking', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    
    class Meta:
        model = Payment
        fields = (
            'id', 'payment_id', 'booking', 'booking_details', 'payment_method',
            'payment_method_display', 'payment_status', 'payment_status_display',
            'amount', 'transaction_id', 'payment_date', 'processed_at', 'created_at', 'updated_at'
        )
        read_only_fields = (
            'id', 'payment_id', 'transaction_id', 'payment_date', 
            'processed_at', 'created_at', 'updated_at'
        )

class PaymentConfirmSerializer(serializers.Serializer):
    payment_intent_id = serializers.CharField()
    transaction_id = serializers.CharField(required=False)
