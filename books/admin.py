from django.contrib import admin
from .models import Books , Comment

class CommentAdmin(admin.ModelAdmin):
    list_display = ('user','book', 'text','datatime_created')


admin.site.register(Books)
admin.site.register(Comment , CommentAdmin)  
