from django.shortcuts import render, get_object_or_404, redirect
from django.views import generic
from django.urls import reverse_lazy, reverse
from django.contrib.auth.decorators import login_required
from .models import Books, Comment
from .forms import CommentForm
from django.contrib.auth.mixins import LoginRequiredMixin


class BookListView(generic.ListView):
    model = Books
    paginate_by = 6
    allow_empty = True
    template_name = 'books/book_list.html'
    context_object_name = 'books'

@login_required
def book_detail_view(request, pk):
    book = get_object_or_404(Books, pk=pk)
    comments = book.comments.all().order_by('-datatime_created')  

    if request.method == 'POST':
        comment_form = CommentForm(request.POST)
        if comment_form.is_valid():
            new_comment = comment_form.save(commit=False)
            new_comment.book = book
            new_comment.user = request.user  
            new_comment.save()
            return redirect('book_detail', pk=book.pk)  # جلوگیری از ارسال مجدد فرم
    else:
        comment_form = CommentForm()

    return render(request, 'books/book_detail.html', {
        'book': book,
        'comments': comments,
        'comment_form': comment_form,  
    })


class BookCreateView(LoginRequiredMixin,generic.CreateView):
    model = Books
    template_name = 'books/book_create.html'
    fields = ['title', 'author', 'description', 'price', 'cover']
    success_url = reverse_lazy('book_list')


class BookUpdateView(LoginRequiredMixin,generic.UpdateView):
    model = Books
    template_name = 'books/book_update.html'
    fields = ['title', 'author', 'description', 'price', 'cover']

    def form_valid(self, form):
        new_cover = None
        if 'cover' in self.request.FILES:
            new_cover = self.request.FILES['cover'].read()
        
        book = form.save(commit=False)
        
        if new_cover:
            if book.cover:
                book.cover.delete()
            from django.core.files.base import ContentFile
            book.cover.save(
                self.request.FILES['cover'].name,
                ContentFile(new_cover),
                save=False
            )
        
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
        self.object = self.get_object()
        if self.object.cover:
            self.object.cover.delete()
        return super().delete(request, *args, **kwargs)




def comment_delete_view(request, pk):
    comment = get_object_or_404(Comment, pk=pk)

    # فقط نویسنده نظر یا ادمین اجازه حذف داشته باشه
    if comment.user == request.user or request.user.is_staff:
        comment.delete()

    # برگرد به صفحه جزئیات کتاب
    return redirect('book_detail', pk=comment.book.id)
