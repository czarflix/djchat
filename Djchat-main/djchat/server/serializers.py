from rest_framework import serializers

from .models import Category, Channel, Server


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"


class ChannelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Channel
        fields = "__all__"


class ServerSerializer(serializers.ModelSerializer):
    # Notice that we used this approach instead of using the queryset
    # because we will in most cases need to return the channel data with server data
    # This is called nested serialization
    # This isn't gonna work if we didn't add related_name to the channel model
    channel_server = ChannelSerializer(many=True, read_only=True)
    members_count = serializers.SerializerMethodField()
    categories = serializers.StringRelatedField(many=True)

    class Meta:
        model = Server
        exclude = ["members"]

    # This method is used to get the number of members in the server
    # num_members is added when we annotate the queryset in the view

    def get_members_count(self, obj):
        if hasattr(obj, "num_members"):
            return obj.num_members
        return None
