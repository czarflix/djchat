from asgiref.sync import async_to_sync
from channels.generic.websocket import JsonWebsocketConsumer


class WebChatConsumer(JsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_name = "testserver"

    def connect(self):
        self.accept()
        async_to_sync(self.channel_layer.group_add)(
            self.room_name,
            self.channel_name,  # channel_name is the unique channel ID of request done by the client
        )

    # receive function is called when a message is received from websocket to the Consumer (server)
    # What happens is that the message is sent to the group (room) where all the other clients are connected
    def receive_json(self, content):
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
            {
                "type": "chat_message",  # type is the name of the function to be called in the group
                "new_message": content["message"],
            },
        )

    # This function must have the same name as the one in the receive function "chat_message"
    def chat_message(self, event):
        self.send_json(event)  # send_json is a function of JsonWebsocketConsumer

    def disconnect(self, close_code):
        pass
