import itertools
import asyncio
import json

class API:
    def __init__(self):
        # All registered clients
        self.clients = set()

        # All registered items
        self.items = set()

        # A map of items by their ID
        self.items_by_id = {}

        # Counter for used IDs
        self.id_counter = itertools.count()

        # Lock so we don't do weird things
        self.item_lock = asyncio.Lock()

    def register_client(self, client):
        """Registers a client (websocket?) to receive updates. It can be anything with a send() method."""

        self.clients.add(client)

    def register_item(self, item):
        """Registers an item to be sent with updates"""

        with self.item_lock:
            item.id = self.id_counter.next()

        return item.id

    def send_updates(self):
        """Sends all updates for the server"""

        for client in self.client:
            for item in self.items:
                if hasattr(item, "jsonify"):
                    out = item.jsonify()
                else:
                    out = dict(item)

                client.send(json.dumps(out).encode('UTF-8'))
