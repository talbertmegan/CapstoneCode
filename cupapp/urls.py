from django.contrib import admin
from django.urls import include, path
from django.conf.urls import url
from cupapp import views
urlpatterns = [
    path('', views.Dashboard, name="dashboard"),
    path('login/',views.Login, name="login"), #make login view
    path('dashboard/', views.Dashboard, name="dashboard"), #make dashboard view that frontend goes in
    path('share/', views.Share, name="share"), #make share view for export of data
]
