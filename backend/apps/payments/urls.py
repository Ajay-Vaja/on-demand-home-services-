from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.create_payment_intent, name='create-payment'),
    path('confirm/', views.confirm_payment, name='confirm-payment'),
    path('my/', views.MyPaymentsView.as_view(), name='my-payments'),
    path('booking/<uuid:booking_id>/', views.get_payment_status, name='payment-status'),
]
