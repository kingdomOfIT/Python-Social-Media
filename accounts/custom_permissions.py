from rest_framework.permissions import BasePermission 

class IsTheSameUser(BasePermission):
    """
    Permission class to check if the requesting user is the same as the user being accessed.
    """
    def has_object_permission(self, request, view, user):
        """
        Check if the requesting user is the same as the user being accessed.

        Parameters:
        - request: The HTTP request object.
        - user: The user object being accessed.

        Returns:
        - True if the requesting user is the same as the user being accessed, False otherwise.
        """
        return request.user.id == user.id
