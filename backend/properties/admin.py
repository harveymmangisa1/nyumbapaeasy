from django.contrib import admin
from .models import Property

@admin.register(Property)
class PropertyAdmin(admin.ModelAdmin):
    list_display = ('title', 'location', 'price', 'listing_type', 'status', 'is_verified', 'created_at')
    list_filter = ('listing_type', 'status', 'is_verified', 'district')
    search_fields = ('title', 'location', 'description')
    readonly_fields = ('id', 'created_at', 'updated_at')
