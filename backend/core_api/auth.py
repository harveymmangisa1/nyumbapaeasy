import jwt
from django.conf import settings
from rest_framework import authentication, exceptions
from django.contrib.auth.models import User

class SupabaseUser(User):
    """
    A lightweight wrapper for the User model that matches Supabase's ID.
    In a full implementation, you might want to mirror profiles here.
    """
    def __init__(self, token_payload):
        self.id = token_payload.get('sub')
        self.email = token_payload.get('email')
        self.is_authenticated = True
        self.profile = token_payload.get('profile', {}) # We can inject profile data here

    @property
    def is_anonymous(self):
        return False

class SupabaseAuthentication(authentication.BaseAuthentication):
    def authenticate(self, request):
        auth_header = request.META.get('HTTP_AUTHORIZATION')
        if not auth_header:
            return None

        try:
            token = auth_header.split(' ')[1]
            payload = jwt.decode(
                token, 
                settings.SUPABASE_JWT_SECRET, 
                algorithms=["HS256"],
                audience="authenticated"
            )
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed('Invalid token')
        except Exception as e:
            raise exceptions.AuthenticationFailed(str(e))

        # Fetch profile from Supabase profiles table
        profile = self.get_supabase_profile(payload.get('sub'))
        payload['profile'] = profile

        user = SupabaseUser(payload)
        return (user, None)

    def get_supabase_profile(self, user_id):
        import requests
        url = f"{settings.SUPABASE_URL}/rest/v1/profiles?id=eq.{user_id}&select=*"
        headers = {
            "apikey": settings.SUPABASE_SERVICE_KEY,
            "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}"
        }
        try:
            response = requests.get(url, headers=headers)
            if response.status_code == 200:
                data = response.json()
                return data[0] if data else {}
        except Exception:
            pass
        return {}
