from django.shortcuts import render
from django.views import generic
from .models import Books
from django.urls import reverse_lazy, reverse

class BookListView(generic.ListView):
    model = Books
    template_name = 'books/book_list.html'
    context_object_name = 'books'





class BookDetailView(generic.DetailView):
    model = Books
    template_name = 'books/book_detail.html'
    context_object_name = 'book'




class BookCreateView(generic.CreateView):
    model = Books
    template_name = 'books/book_create.html'
    fields = ['title', 'author', 'description', 'price', 'cover']
    success_url = reverse_lazy('book_list')





class BookUpdateView(generic.UpdateView):
    model = Books
    template_name = 'books/book_update.html'
    fields = ['title', 'author', 'description', 'price', 'cover']




    
    def form_valid(self, form):
        # 1. ابتدا محتوای فایل را در حافظه ذخیره می‌کنیم
        new_cover = None
        if 'cover' in self.request.FILES:
            new_cover = self.request.FILES['cover'].read()
        
        # 2. تغییرات را ذخیره می‌کنیم (بدون تصویر جدید)
        book = form.save(commit=False)
        
        # 3. اگر تصویر جدید داریم، آن را پردازش می‌کنیم
        if new_cover:
            # حذف تصویر قبلی
            if book.cover:
                book.cover.delete()
            
            # ذخیره تصویر جدید
            from django.core.files.base import ContentFile
            book.cover.save(
                self.request.FILES['cover'].name,
                ContentFile(new_cover),
                save=False
            )
        
        # 4. ذخیره نهایی
        book.save()
        return super().form_valid(form)
    
    def get_success_url(self):
        return reverse('book_detail', kwargs={'pk': self.object.id})






class BookDeleteView(generic.DeleteView):
    model = Books
    template_name = 'books/book_delete.html'
    success_url = reverse_lazy('book_list')
    context_object_name = 'book'
    
    def delete(self, request, *args, **kwargs):
        # حذف خودکار تصویر هنگام حذف کتاب
        self.object = self.get_object()
        if self.object.cover:
            self.object.cover.delete()
        return super().delete(request, *args, **kwargs)