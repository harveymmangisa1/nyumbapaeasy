from django.contrib import admin
from .models import Profile, VerificationDocument

@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'role', 'is_verified', 'has_pending_verification', 'created_at')
    list_filter = ('role', 'is_verified', 'has_pending_verification')
    search_fields = ('name', 'full_name', 'username', 'id')
    readonly_fields = ('id', 'created_at', 'updated_at')

@admin.register(VerificationDocument)
class VerificationDocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'user_id', 'document_type', 'status', 'submitted_at')
    list_filter = ('document_type', 'status')
    search_fields = ('user_id', 'document_name')
    readonly_fields = ('id', 'submitted_at', 'created_at', 'updated_at')
