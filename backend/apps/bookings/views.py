from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import Booking
from .serializers import (
    BookingSerializer, 
    BookingCreateSerializer, 
    BookingStatusSerializer
)

class BookingCreateView(generics.CreateAPIView):
    """Create a new booking"""
    serializer_class = BookingCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        if request.user.user_type != 'customer':
            return Response(
                {'error': 'Only customers can create bookings'},
                status=status.HTTP_403_FORBIDDEN
            )
        # return super().post(request, *args, **kwargs)
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        # Use BookingSerializer to include booking_id in response
        read_serializer = BookingSerializer(serializer.instance)
        return Response(read_serializer.data, status=status.HTTP_201_CREATED)

        

class MyBookingsView(generics.ListAPIView):
    """List user's bookings"""
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    ordering = ['-created_at']
    
    def get_queryset(self):
        user = self.request.user
        queryset = Booking.objects.select_related('service', 'customer', 'service__provider')
        
        if user.user_type == 'customer':
            queryset = queryset.filter(customer=user)
        else:  # provider
            queryset = queryset.filter(service__provider=user)
        
        return queryset

class BookingDetailView(generics.RetrieveAPIView):
    """Get booking details"""
    serializer_class = BookingSerializer
    permission_classes = [IsAuthenticated]
    
    
    def get_queryset(self):
        user = self.request.user
        queryset = Booking.objects.select_related('service', 'customer', 'service__provider')
        
        if user.user_type == 'customer':
            return queryset.filter(customer=user)
        else:  # provider
            return queryset.filter(service__provider=user)
        
    def get_object(self):
        booking_id = self.kwargs.get('booking_id')
        queryset = self.get_queryset()
        return get_object_or_404(queryset, booking_id=booking_id)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_booking_status(request, booking_id):
    """Update booking status (providers only)"""
    try:
        booking = get_object_or_404(Booking, id=booking_id)
        
        # Check if user is the service provider
        if request.user != booking.service.provider:
            return Response(
                {'error': 'Only service provider can update booking status'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = BookingStatusSerializer(
            booking, 
            data=request.data, 
            partial=True
        )
        if serializer.is_valid():
            serializer.save()
            return Response({
                'message': 'Booking status updated successfully',
                'booking': BookingSerializer(booking).data
            })
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def booking_stats(request):
    """Get booking statistics for the user"""
    user = request.user
    
    if user.user_type == 'customer':
        queryset = Booking.objects.filter(customer=user)
    else:  # provider
        queryset = Booking.objects.filter(service__provider=user)
    
    total_bookings = queryset.count()
    completed_bookings = queryset.filter(status='completed').count()
    pending_bookings = queryset.filter(status='pending').count()
    
    return Response({
        'total_bookings': total_bookings,
        'completed_bookings': completed_bookings,
        'pending_bookings': pending_bookings,
        'completion_rate': round(
            (completed_bookings / total_bookings * 100) if total_bookings > 0 else 0, 
            2
        )
    })
