from django.contrib import admin
from .models import Service

@admin.register(Service)
class ServiceAdmin(admin.ModelAdmin):
    list_display = (
        'name', 'provider', 'category', 'price_per_hour', 
        'rating', 'total_bookings', 'is_available', 'created_at'
    )
    list_filter = ('category', 'is_available', 'created_at')
    search_fields = ('name', 'description', 'provider__username', 'service_area')
    ordering = ('-created_at',)
    readonly_fields = ('rating', 'total_bookings', 'created_at', 'updated_at')
