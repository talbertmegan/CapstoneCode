from django.shortcuts import render

# Create your views here.
from django.shortcuts import render
from django.http import HttpResponse, HttpResponseNotFound
#from cupsite.models import Lead 
#from display.serializers import LeadSerializer
#from rest_framework import generics
#import datetime
def Dashboard(request):
    return render(request,'cupapp/dashboard.html')

def Login(request):
    return render(request, 'cupapp/login.html')

def Share(request):
    return render(request, 'cupapp/share.html')

def RecordData(request):
    return render(request, 'cupapp/recorddata.html')
