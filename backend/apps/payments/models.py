from django.db import models
from apps.bookings.models import Booking
import uuid

class Payment(models.Model):
    PAYMENT_METHOD_CHOICES = [
        ('card', 'Credit/Debit Card'),
        ('upi', 'UPI'),
        ('wallet', 'Digital Wallet'),
    ]

    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('processing', 'Processing'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    payment_id = models.UUIDField(
        default=uuid.uuid4,
        unique=True,
        editable=False,
        help_text="Unique payment identifier"
    )
    booking = models.ForeignKey(
        Booking,
        on_delete=models.CASCADE,
        related_name='payment'
    )
    payment_method = models.CharField(
        max_length=15,
        choices=PAYMENT_METHOD_CHOICES,
        help_text="Payment method used"
    )
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='pending',
        help_text="Current payment status"
    )
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        help_text="Payment amount"
    )

    # Stripe Fields
    stripe_payment_intent_id = models.CharField(
        max_length=200,
        null=True,
        blank=True,
        help_text="Stripe Payment Intent ID"
    )
    transaction_id = models.CharField(
        max_length=100,
        unique=True,
        null=True,
        blank=True,
        help_text="Transaction ID from payment gateway"
    )

    # Timestamps
    payment_date = models.DateTimeField(
        auto_now_add=True,
        help_text="When payment was initiated"
    )
    processed_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text="When payment was successfully processed"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Payment {self.payment_id} - {self.booking.booking_id}"

    def save(self, *args, **kwargs):
        # Set processed timestamp when status changes to success
        if self.payment_status == 'success' and not self.processed_at:
            from django.utils import timezone
            self.processed_at = timezone.now()

        super().save(*args, **kwargs)

    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']
        verbose_name = 'Payment'
        verbose_name_plural = 'Payments'
