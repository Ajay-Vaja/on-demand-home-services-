from django.urls import path
from . import views

urlpatterns = [
    path('', views.BookingCreateView.as_view(), name='booking-create'),
    path('my/', views.MyBookingsView.as_view(), name='my-bookings'),
    path('stats/', views.booking_stats, name='booking-stats'),
    path('<int:pk>/', views.BookingDetailView.as_view(), name='booking-detail'),
    path('<int:booking_id>/status/', views.update_booking_status, name='update-booking-status'),
]
