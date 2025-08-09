from django.urls import path
from .views import BookListView, book_detail_view, BookCreateView ,BookUpdateView , BookDeleteView ,comment_delete_view


urlpatterns = [
    path('', BookListView.as_view(), name='book_list'),
    path('<int:pk>/', book_detail_view, name='book_detail'),
    path('new/', BookCreateView.as_view(), name='book_create'), 
    path('<int:pk>/edit/', BookUpdateView.as_view(), name='book_update'),
    path('<int:pk>/delete/', BookDeleteView.as_view(),name='book_delete'),
    path('comment/<int:pk>/delete/', comment_delete_view, name='comment_delete')
    
]