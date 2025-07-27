from django.db import models
from django.urls import reverse
from django.core.validators import FileExtensionValidator

class Books(models.Model):
    title = models.CharField(max_length=200)
    author = models.CharField(max_length=200)
    description = models.TextField()
    price = models.DecimalField(max_digits=5, decimal_places=2)
    cover = models.ImageField(
        upload_to='books/covers/%Y/%m/%d/',
        blank=True,
        null=True,
        validators=[FileExtensionValidator(['jpg', 'jpeg', 'png','webp'])]  # فقط این خط اضافه شد
    )

    def __str__(self):
        return f'{self.title} - {self.author}'

    def get_absolute_url(self):
        return reverse('book_detail', args=[self.id])