from django.db import models
import uuid

class Profile(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    username = models.TextField(unique=True, blank=True, null=True)
    full_name = models.TextField(blank=True, null=True)
    name = models.TextField(blank=True, null=True)
    role = models.TextField(default='user')
    is_verified = models.BooleanField(default=False)
    has_pending_verification = models.BooleanField(default=False)
    phone_number = models.TextField(blank=True, null=True)
    location = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'profiles'
        verbose_name = "User Profile"
        verbose_name_plural = "User Profiles"

    def __str__(self):
        return self.name or self.full_name or str(self.id)

class VerificationDocument(models.Model):
    DOCUMENT_TYPES = [
        ('business_license', 'Business License'),
        ('property_deed', 'Property Deed'),
        ('national_id', 'National ID'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('verified', 'Verified'),
        ('rejected', 'Rejected'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user_id = models.UUIDField() # In unmanaged models, we often use UUIDField instead of ForeignKey to auth.users if it's external
    document_type = models.CharField(max_length=50, choices=DOCUMENT_TYPES)
    document_url = models.TextField()
    document_name = models.TextField(blank=True, null=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    admin_notes = models.TextField(blank=True, null=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(blank=True, null=True)
    reviewed_by = models.UUIDField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'verification_documents'
        verbose_name = "Verification Document"
        verbose_name_plural = "Verification Documents"

    def __str__(self):
        return f"{self.document_type} - {self.status}"
