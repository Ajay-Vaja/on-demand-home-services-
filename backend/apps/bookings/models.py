from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator
from apps.services.models import Service
from datetime import datetime, timedelta
import uuid

class Booking(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('confirmed', 'Confirmed'),
        ('in_progress', 'In Progress'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    TIME_SLOT_CHOICES = [
        ('08:00', '8:00 AM'),
        ('09:00', '9:00 AM'),
        ('10:00', '10:00 AM'),
        ('11:00', '11:00 AM'),
        ('12:00', '12:00 PM'),
        ('13:00', '1:00 PM'),
        ('14:00', '2:00 PM'),
        ('15:00', '3:00 PM'),
        ('16:00', '4:00 PM'),
        ('17:00', '5:00 PM'),
        ('18:00', '6:00 PM'),
    ]
    
    booking_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        help_text="Unique booking identifier"
    )
    customer = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='bookings',
        limit_choices_to={'user_type': 'customer'}
    )
    service = models.ForeignKey(
        Service,
        on_delete=models.CASCADE,
        related_name='bookings'
    )
    booking_date = models.DateField(help_text="Date of service")
    time_slot = models.CharField(
        max_length=5,
        choices=TIME_SLOT_CHOICES,
        help_text="Time slot for the service"
    )
    hours_requested = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1), MaxValueValidator(24)],
        help_text="Number of hours requested"
    )
    status = models.CharField(
        max_length=15,
        choices=STATUS_CHOICES,
        default='pending',
        help_text="Current booking status"
    )
    total_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Total amount for the booking"
    )
    special_instructions = models.TextField(
        blank=True,
        null=True,
        help_text="Special instructions from customer"
    )
    customer_address = models.TextField(
        help_text="Service address provided by customer"
    )
    customer_phone = models.CharField(
        max_length=15,
        help_text="Customer contact number for this booking"
    )
    
    # Rating and feedback (filled after completion)
    rating = models.PositiveIntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(1), MaxValueValidator(5)],
        help_text="Customer rating (1-5 stars)"
    )
    feedback = models.TextField(
        blank=True,
        null=True,
        help_text="Customer feedback"
    )
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    
    def __str__(self):
        return f"Booking {self.booking_id} - {self.customer.username}"
    
    def save(self, *args, **kwargs):
        # Auto-calculate total amount
        if not self.total_amount:
            self.total_amount = self.service.price_per_hour * self.hours_requested
        
        # Set confirmation timestamp
        if self.status == 'confirmed' and not self.confirmed_at:
            self.confirmed_at = datetime.now()
        
        # Set completion timestamp
        if self.status == 'completed' and not self.completed_at:
            self.completed_at = datetime.now()
            # Update service rating and total bookings
            self.service.total_bookings += 1
            self.service.save(update_fields=['total_bookings'])
            if self.rating:
                self.service.update_rating()
        
        super().save(*args, **kwargs)
    
    class Meta:
        db_table = 'bookings'
        ordering = ['-created_at']
        verbose_name = 'Booking'
        verbose_name_plural = 'Bookings'
        unique_together = ['service', 'booking_date', 'time_slot']
