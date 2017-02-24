from rest_framework.permissions import IsAuthenticated

class IsAuthenticatedListCreateUser(IsAuthenticated):
    def has_permission(self, request, view):
        if request.method == 'POST':
            return True
        return super(IsAuthenticatedListCreateUser,
                     self).has_permission(request, view)
