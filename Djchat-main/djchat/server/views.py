from django.db.models import Count
from drf_spectacular.utils import extend_schema
from rest_framework import viewsets
from rest_framework.exceptions import AuthenticationFailed, ValidationError
from rest_framework.response import Response

from .models import Category, Server
from .schema import server_list_docs
from .serializers import CategorySerializer, ServerSerializer


# Create your views here.
class CategoryViewSet(viewsets.ViewSet):
    queryset = Category.objects.all()

    @extend_schema(responses=CategorySerializer)
    def list(self, request):
        serializer = CategorySerializer(self.queryset, many=True)
        return Response(serializer.data)


class ServerListViewSet(viewsets.ViewSet):
    queryset = Server.objects.all()

    @server_list_docs
    def list(self, request):
        """
        List servers based on provided query parameters.

        This method allows you to retrieve a list of servers with various filtering options,
        such as filtering by category, user membership, server quantity, and specific server ID.

        Args:
            request (HttpRequest): The HTTP request object containing query parameters.

        Returns:
            Response: A response containing serialized server data based on the provided filters.

        Raises:
            AuthenticationFailed: If the user is not authenticated.
            ValidationError: If validation errors occur during filtering, such as an invalid server ID.

        Example:
        To list servers with the following filters:
        - Filter by the category "gaming"
        - Limit results to 10 servers
        - Show only the servers where the user is a member
        - Filter for a server with ID 5

        `GET /servers/?categories=gaming&qty=10&by_user=true&by_server_id=5`

        Query Parameters:
        - `categories` (str): Filter servers by a specific category name.
        - `qty` (int): Limit the number of server results to a specific quantity.
        - `by_user` (bool): Filter servers based on user membership (true/false).
        - `by_server_id` (int): Filter servers by a specific server ID.
            Useful for retrieving detailed information about a single server.

        Filtering Logic:
        - Servers are filtered by category name if the 'categories' parameter is provided.
        - Servers are filtered by user membership if the 'by_user' parameter is set to "true".
        - The 'qty' parameter limits the number of server results returned.
        - The 'by_server_id' parameter retrieves details for a specific server by its ID.

        Response Format:
            The response contains serialized server data in a JSON format.

        Server Annotation:
            If the resulting queryset contains servers, the queryset is annotated with the
            number of members each server has, providing insight into server popularity.

        Note:
            Use proper authentication to access this endpoint, as indicated by the
            'AuthenticationFailed' exception that is raised when not authenticated.
        """

        categories = request.query_params.get("categories")
        by_user = request.query_params.get("by_user") == "true"
        quantity = request.query_params.get("qty")
        by_server_id = request.query_params.get("by_server_id")

        # Check if user is authenticated
        # if not request.user.is_authenticated:
        #     raise AuthenticationFailed(detail="User is not authenticated")

        # Filter servers by categories
        if categories:
            self.queryset = self.queryset.filter(categories__name=categories)

        # Filter servers based on user id (if user is authenticated only)
        if by_user:
            if request.user.is_authenticated:
                user_id = request.user.id
                self.queryset = self.queryset.filter(members__id=user_id)
            else:
                raise AuthenticationFailed(detail="User is not authenticated")

        # Filter servers based on server id
        if by_server_id:
            try:
                self.queryset = self.queryset.filter(id=by_server_id)
                if not self.queryset.exists():
                    raise ValidationError(detail=f"Server of id {by_server_id} does not exist")
            except ValueError:
                raise ValidationError(detail=f"Error with status code {ValueError}")

        # Filter servers based on quantity (limit)
        if quantity:
            self.queryset = self.queryset[: int(quantity)]

        # Annotate with number of members if servers exist
        if self.queryset.exists():
            self.queryset = self.queryset.annotate(num_members=Count("members"))

        # Serialize the queryset and return as response
        serializer = ServerSerializer(self.queryset, many=True)
        return Response(serializer.data)
