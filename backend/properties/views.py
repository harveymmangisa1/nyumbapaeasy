from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from .serializers import PropertySerializer

class IsPropertyOwner(permissions.BasePermission):
    """
    Custom permission to only allow landlords/agencies to create properties.
    """
    def has_permission(self, request, view):
        # We assume the user object populated by SupabaseAuthentication 
        # has a 'profile' attribute with the role.
        allowed_roles = ['landlord', 'real_estate_agency', 'lodge_owner', 'bnb_owner', 'admin']
        user_role = getattr(request.user, 'profile', {}).get('role')
        return user_role in allowed_roles

class PropertyCreateView(APIView):
    permission_classes = [permissions.IsAuthenticated, IsPropertyOwner]

    def post(self, request):
        # This is where you'd save to Supabase via their API or directly to the DB
        # For now, we'll just return a success message proving the isolation works.
        return Response({
            "message": "Access granted. You have the correct account type to add properties.",
            "user_id": request.user.id,
            "role": request.user.profile.get('role')
        }, status=status.HTTP_201_CREATED)
