from django.utils import timezone
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Payment
from .serializers import PaymentSerializer
from apps.bookings.models import Booking
import uuid

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_payment_intent(request):
    """Create payment intent for booking (UPI/Wallet only, always succeeds)"""
    try:
        booking_id = request.data.get('booking_id')
        payment_method = request.data.get('payment_method', 'upi')

        booking = get_object_or_404(Booking, booking_id=booking_id, customer=request.user)
        existing_payments = Payment.objects.filter(booking=booking)
        if existing_payments.filter(payment_status='success').exists():
            return Response(
                {'error': 'Payment already exists for this booking'},
                status=status.HTTP_400_BAD_REQUEST
            )

        existing_payments.filter(payment_status='failed').delete()

        with transaction.atomic():
            payment = Payment.objects.create(
                booking=booking,
                payment_method=payment_method,
                amount=booking.total_amount,
                payment_status='processing'
            )
            return Response({
                'payment_id': payment.payment_id,
                'amount': float(booking.total_amount)
            })
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def confirm_payment(request):
    """Confirm payment for UPI/Wallet (always succeed)"""
    try:
        payment_id = request.data.get('payment_id')
        if not payment_id:
            return Response({'error': 'Missing payment_id'}, status=status.HTTP_400_BAD_REQUEST)
        payment = Payment.objects.get(payment_id=payment_id)
        if payment.booking.customer != request.user:
            return Response({'error': 'Access denied'}, status=status.HTTP_403_FORBIDDEN)
        with transaction.atomic():
            payment.payment_status = 'success'
            # Generate a unique transaction_id per payment
            if not payment.transaction_id:
                payment.transaction_id = f"DEMO-TXN-{uuid.uuid4().hex[:10]}"  # or use payment.payment_id
            payment.processed_at = timezone.now()
            payment.save()
            if payment.booking.status == 'pending':
                payment.booking.status = 'confirmed'
                payment.booking.save()
            return Response({
                'message': 'Payment confirmed successfully',
                'payment': PaymentSerializer(payment).data
            })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_payment_status(request, booking_id):
    """Get payment status for a booking"""
    try:
        booking = get_object_or_404(Booking, booking_id=booking_id)
        if (request.user.user_type == 'customer' and booking.customer != request.user) or \
           (request.user.user_type == 'provider' and booking.service.provider != request.user):
            return Response(
                {'error': 'Access denied'},
                status=status.HTTP_403_FORBIDDEN
            )
        payment = Payment.objects.filter(booking=booking).first()
        if payment:
            serializer = PaymentSerializer(payment)
            return Response(serializer.data)
        else:
            return Response({
                'message': 'No payment found for this booking',
                'booking_id': booking.booking_id
            })
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class MyPaymentsView(generics.ListAPIView):
    """List user's payments"""
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        queryset = Payment.objects.select_related('booking', 'booking__service', 'booking__customer')
        if user.user_type == 'customer':
            queryset = queryset.filter(booking__customer=user)
        else:  # provider
            queryset = queryset.filter(booking__service__provider=user)
        return queryset.order_by('-created_at')
