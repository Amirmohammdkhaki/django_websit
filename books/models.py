# models.py
from django.db import models
from django.urls import reverse
from django.core.validators import FileExtensionValidator
from django.contrib.auth import get_user_model

class Books(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=5, decimal_places=2)
    cover = models.ImageField(
        upload_to='books/covers/%Y/%m/%d/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png','webp'])]
    )

    def __str__(self):
        return f'{self.title} - {self.author}'

    def get_absolute_url(self):
        return reverse('book_detail', args=[self.id])

class Comment(models.Model):
    user = models.ForeignKey(get_user_model(), on_delete=models.CASCADE)
    book = models.ForeignKey(Books, on_delete=models.CASCADE, related_name='comments')
    text = models.TextField()
    datatime_created = models.DateTimeField(auto_now_add=True)
    is_active=models.BooleanField(default=True)
    does_recommend=models.BooleanField(default=True)

    def __str__(self):
        return f'{self.user.username}: {self.book.title}'
