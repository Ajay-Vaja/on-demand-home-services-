from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    USER_TYPE_CHOICES = [
        ('customer', 'Customer'),
        ('provider', 'Service Provider'),
    ]
    
    user_type = models.CharField(
        max_length=10,
        choices=USER_TYPE_CHOICES,
        default='customer',
        help_text="Type of user account"
    )
    phone_number = models.CharField(
        max_length=15, 
        blank=True, 
        null=True,
        help_text="Contact phone number"
    )
    address = models.TextField(
        blank=True, 
        null=True,
        help_text="Full address"
    )
    is_verified = models.BooleanField(
        default=False,
        help_text="Whether the user has verified their account"
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.username} ({self.get_user_type_display()})"

    def get_full_name(self):
        return f"{self.first_name} {self.last_name}".strip() or self.username

    class Meta:
        db_table = 'users'
        verbose_name = 'User'
        verbose_name_plural = 'Users'
