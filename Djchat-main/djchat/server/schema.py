from drf_spectacular.types import OpenApiTypes
from drf_spectacular.utils import OpenApiParameter, extend_schema

from .serializers import ServerSerializer

server_list_docs = extend_schema(
    responses=ServerSerializer(many=True),
    parameters=[
        OpenApiParameter(
            name="categories",
            type=OpenApiTypes.STR,
            location=OpenApiParameter.QUERY,
            description="Filter servers by a specific category name.",
        ),
        OpenApiParameter(
            name="by_user",
            type=OpenApiTypes.BOOL,
            location=OpenApiParameter.QUERY,
            description="Filter servers by user membership.",
        ),
        OpenApiParameter(
            name="qty",
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description="Limit the number of server results returned.",
        ),
        OpenApiParameter(
            name="by_server_id",
            type=OpenApiTypes.INT,
            location=OpenApiParameter.QUERY,
            description="Retrieve detailed information about a specific server.",
        ),
    ],
)
