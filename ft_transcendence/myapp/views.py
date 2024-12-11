from django.shortcuts import render

# Create your views here.

# Vista para renderizar la página HTML
def home(request):
    return render(request, 'myapp/home.html')  # Asume que el archivo HTML está en templates/home.html
