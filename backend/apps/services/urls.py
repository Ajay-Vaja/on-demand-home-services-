from django.urls import path
from . import views

urlpatterns = [
    path('', views.ServiceListView.as_view(), name='service-list'),
    path('create/', views.ServiceCreateView.as_view(), name='service-create'),
    path('my/', views.MyServicesView.as_view(), name='my-services'),
    path('categories/', views.service_categories, name='service-categories'),
    path('stats/', views.service_stats, name='service-stats'),
    path('<int:pk>/', views.ServiceDetailView.as_view(), name='service-detail'),
]
