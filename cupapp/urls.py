from django.contrib import admin
from django.urls import include, path
from django.conf.urls import url
from cupapp import views
urlpatterns = [
    path('', views.Login, name="logmein"),
    path('login/',views.Login, name="login"), #make login view
    path('dashboard/', views.Dashboard, name="dashboard"), #make dashboard view that frontend goes in
    path('share/', views.Share, name="share"), #make share view for export of data
    path('recording/', views.RecordData, name="Record Data"),
]
