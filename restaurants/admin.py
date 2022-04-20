from django.contrib import admin

# Register your models here.
from restaurants.models import MenuItem, Restaurant, Menu, Gallery, Comment, Blog

# Register Restaurant Model
admin.site.register(Restaurant)

# Register Restaurant Menu Model
admin.site.register(Menu)

# Register Restaurant Gallery Model
admin.site.register(Gallery)

# Register Restaurant Comment Model
admin.site.register(Comment)

# Register Restaurant Blog Model
admin.site.register(Blog)

# Register Restaurant MenuItem Model
admin.site.register(MenuItem)

