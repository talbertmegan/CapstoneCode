from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound
#from cupsite.models import Lead 
#from display.serializers import LeadSerializer
#from rest_framework import generics
#import datetime
def Dashboard(request):
    return render(request,'cupsite/dashboard.html')

def Login(request):
    return render(request, 'cupsite/login.html')

def Share(request):
    return render(request, 'cupsite/share.html')
