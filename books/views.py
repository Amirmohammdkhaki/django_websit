from django.shortcuts import render
from django.views import generic
from .models import Books
from django.urls import reverse_lazy ,reverse

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
    fields = ['title', 'author', 'description', 'price']
    success_url = reverse_lazy('book_list')  # بعد از ایجاد، به لیست هدایت شود



class BookUpdateView(generic.UpdateView):
    model = Books
    template_name = 'books/book_update.html'
    fields = ['title', 'author', 'description', 'price']
    
    def get_success_url(self):
        return reverse('book_detail', kwargs={'pk': self.object.id})
    

class BookDeleteView(generic.DeleteView):
    model = Books
    template_name = 'books/book_delete.html'
    success_url = reverse_lazy('book_list')
    context_object_name = 'book'

    
    
    


