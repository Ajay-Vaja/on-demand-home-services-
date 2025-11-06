from rest_framework import generics, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.db.models import Q, Avg
from .models import Service
from .serializers import ServiceSerializer, ServiceCreateSerializer

class ServiceListView(generics.ListAPIView):
    """List all available services with search and filtering"""
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category', 'service_area']
    ordering_fields = ['created_at', 'price_per_hour', 'rating', 'total_bookings']
    ordering = ['-rating', '-total_bookings']
    
    def get_queryset(self):
        queryset = Service.objects.filter(is_available=True).select_related('provider')
        
        # Filter by category
        category = self.request.query_params.get('category')
        if category:
            queryset = queryset.filter(category=category)
        
        # Filter by price range
        min_price = self.request.query_params.get('min_price')
        max_price = self.request.query_params.get('max_price')
        if min_price:
            queryset = queryset.filter(price_per_hour__gte=min_price)
        if max_price:
            queryset = queryset.filter(price_per_hour__lte=max_price)
        
        return queryset

class ServiceDetailView(generics.RetrieveAPIView):
    """Get service details"""
    queryset = Service.objects.select_related('provider').all()
    serializer_class = ServiceSerializer
    permission_classes = [AllowAny]

class ServiceCreateView(generics.CreateAPIView):
    """Create a new service (providers only)"""
    serializer_class = ServiceCreateSerializer
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        if request.user.user_type != 'provider':
            return Response(
                {'error': 'Only service providers can create services'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().post(request, *args, **kwargs)

class MyServicesView(generics.ListAPIView):
    """List services created by current provider"""
    serializer_class = ServiceSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Service.objects.filter(provider=self.request.user)

@api_view(['GET'])
@permission_classes([AllowAny])
def service_categories(request):
    """Get available service categories"""
    categories = [
        {'value': choice[0], 'label': choice[1]}
        for choice in Service.CATEGORY_CHOICES
    ]
    return Response(categories)

@api_view(['GET'])
@permission_classes([AllowAny])
def service_stats(request):
    """Get service statistics"""
    total_services = Service.objects.filter(is_available=True).count()
    total_providers = Service.objects.filter(is_available=True).values('provider').distinct().count()
    avg_price = Service.objects.filter(is_available=True).aggregate(
        avg_price=Avg('price_per_hour')
    )['avg_price'] or 0
    
    return Response({
        'total_services': total_services,
        'total_providers': total_providers,
        'average_price': round(float(avg_price), 2),
    })
