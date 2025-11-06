from django.contrib import admin
from .models import Payment

@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = (
        'payment_id', 'customer_name', 'service_name', 'amount', 
        'payment_status', 'payment_method', 'created_at'
    )
    list_filter = ('payment_status', 'payment_method', 'created_at')
    search_fields = (
        'payment_id', 'transaction_id', 'booking__booking_id',
        'booking__customer__username'
    )
    ordering = ('-created_at',)
    readonly_fields = ('payment_id', 'stripe_payment_intent_id', 'created_at', 'updated_at')
    
    def customer_name(self, obj):
        return obj.booking.customer.get_full_name()
    customer_name.short_description = 'Customer'
    
    def service_name(self, obj):
        return obj.booking.service.name
    service_name.short_description = 'Service'
