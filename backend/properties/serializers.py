from rest_framework import serializers

class PropertySerializer(serializers.Serializer):
    """
    Simple serializer for demonstrating the isolation works.
    In the future, this would map to your exact Supabase table schema.
    """
    title = serializers.CharField(max_length=255)
    description = serializers.CharField(required=False, allow_blank=True)
    price = serializers.DecimalField(max_digits=12, decimal_places=2)
    location = serializers.CharField(max_length=255)
