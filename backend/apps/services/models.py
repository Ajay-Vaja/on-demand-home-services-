from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator

class Service(models.Model):
    CATEGORY_CHOICES = [
        ('cleaning', 'Cleaning'),
        ('plumbing', 'Plumbing'),
        ('electrical', 'Electrical'),
        ('carpentry', 'Carpentry'),
        ('painting', 'Painting'),
        ('gardening', 'Gardening'),
        ('appliance_repair', 'Appliance Repair'),
        ('moving', 'Moving & Packing'),
        ('pest_control', 'Pest Control'),
        ('other', 'Other'),
    ]
    
    name = models.CharField(max_length=100, help_text="Service name")
    description = models.TextField(help_text="Detailed description of the service")
    category = models.CharField(
        max_length=20, 
        choices=CATEGORY_CHOICES,
        default='other',
        help_text="Service category"
    )
    price_per_hour = models.DecimalField(
        max_digits=10, 
        decimal_places=2,
        validators=[MinValueValidator(0.01)],
        help_text="Price per hour in INR"
    )
    provider = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='services',
        limit_choices_to={'user_type': 'provider'}
    )
    is_available = models.BooleanField(
        default=True,
        help_text="Whether this service is currently available for booking"
    )
    minimum_hours = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(24)],
        help_text="Minimum booking hours required"
    )
    maximum_hours = models.PositiveIntegerField(
        default=8,
        validators=[MinValueValidator(1), MaxValueValidator(24)],
        help_text="Maximum booking hours allowed"
    )
    service_area = models.CharField(
        max_length=200,
        blank=True,
        null=True,
        help_text="Geographic area where service is provided"
    )
    rating = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.00,
        validators=[MinValueValidator(0), MaxValueValidator(5)],
        help_text="Average rating from customers"
    )
    total_bookings = models.PositiveIntegerField(
        default=0,
        help_text="Total number of completed bookings"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.name} - {self.provider.get_full_name()}"
    
    def get_average_rating(self):
        """Calculate average rating from bookings"""
        from apps.bookings.models import Booking
        bookings = Booking.objects.filter(
            service=self, 
            status='completed',
            rating__isnull=False
        )
        if bookings.exists():
            return round(bookings.aggregate(
                avg_rating=models.Avg('rating')
            )['avg_rating'], 2)
        return 0.00
    
    def update_rating(self):
        """Update the service rating based on completed bookings"""
        self.rating = self.get_average_rating()
        self.save(update_fields=['rating'])
    
    class Meta:
        db_table = 'services'
        ordering = ['-created_at']
        verbose_name = 'Service'
        verbose_name_plural = 'Services'
