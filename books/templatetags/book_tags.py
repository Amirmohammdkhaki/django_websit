from django import template

register = template.Library()  # 'Library' با حرف بزرگ



@register.filter(name='to_lowercase')
def to_lowercase(value, arg=None):
    
        return f'{arg}:{value.lower()}'
    