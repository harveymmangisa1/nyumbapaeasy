from django.db import models
import uuid

class Property(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    owner_id = models.UUIDField(null=True, blank=True)
    title = models.TextField(blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    currency = models.TextField(default='MWK')
    location = models.TextField(blank=True, null=True)
    district = models.TextField(blank=True, null=True)
    bedrooms = models.IntegerField(null=True, blank=True)
    bathrooms = models.DecimalField(max_digits=4, decimal_places=1, null=True, blank=True)
    area = models.DecimalField(max_digits=20, decimal_places=2, null=True, blank=True)
    listing_type = models.TextField(blank=True, null=True)
    status = models.TextField(default='available')
    is_verified = models.BooleanField(default=False)
    views = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        managed = False
        db_table = 'properties'
        verbose_name_plural = "Properties"

    def __str__(self):
        return self.title or str(self.id)
