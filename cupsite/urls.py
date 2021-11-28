"""cupsite URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import include, path
from django.conf.urls import url
from cupsite import views

urlpatterns = [
    path('', include('polls.urls')),
    path('login/',views.Login, name="login"), #make login view
    path('dashboard/', views.Dashboard, name="dashboard"), #make dashboard view that frontend goes in
    path('share/', views.Share, name="share"), #make share view for export of data
    path('polls/', include('polls.urls')),
    path('admin/', admin.site.urls),

]

""" 
from django.conf.urls import url
from display import views
from django.urls import path


urlpatterns = [
    path('',views.Display,name="display"),
    path('display/engineering', views.Engineering, name="engineering"),
    path('display/marketing', views.Marketing, name="marketing"),
    path('display/users', views.Users, name="users"),
    path('display/operations',views.Operations, name="operations"),
    path('display/customer',views.Customer, name="customer"),
    path('display/overall', views.Overall, name="overall"),
    path('display/events', views.eventDisp, name='calendar'),
    path('display/sales', views.Opportunities, name="sales"),
    path('api/lead/', views.LeadListCreate.as_view() ),

] """