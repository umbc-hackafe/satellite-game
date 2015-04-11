import websockets
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

    def function_call(self, data):
        """Accepts a client function call request and performs the function as requested.

        Expects `data` to be a dictionary with some of the following keys:
        id: The id of the object on which to call the function. (required)
        name: The name of the function to call. (required)
        args: A list of positional arguments.
        kwargs: A dictionary of key:value arguments.
        """

        try:
            target = self.items_by_id[data["id"]]
            result = getattr(target, data["name"])(*(data.get("args", [])), **(data.get("kwargs", {})))
            return {"success": True, "result": result}
        except KeyError as e:
            print("Error, object with ID '{}' was not found.".format(data.get("id", None)))
            return {"success": False, "error": str(e)}
        except Exception as e:
            print("Error occurred while calling {}.{}".format(data.get("id", None), data.get("name", None)))
            raise e

    def send_updates(self):
        """Sends all updates for the server"""

        for client in self.client:
            for item in self.items:
                if hasattr(item, "jsonify"):
                    out = item.jsonify()
                else:
                    out = dict(item)

                client.send(json.dumps(out).encode('UTF-8'))

class Client:
    def __init__(self, api, socket):
        self.api = api
        self.socket = socket
        self.msg_queue = asyncio.Queue()

    @asyncio.coroutine
    def read(self):
        while True:
            data = yield from self.socket.recv()

            if data is None:
                print("Closing websocket")
                break

            data = json.loads(data)
            try:
                self.api.function_call(data)
            except Exception as e:
                print("Unable to call function from websocket data: ", e)

    @asyncio.coroutine
    def write(self):
        while True:
            msg = yield from self.msg_queue.get()
            yield from self.websocket.send(msg)

    def send(self, msg):
        self.msg_queue.put(msg)

class Server:
    def __init__(self, api, listen, port):
        self.listen = listen
        self.port = port
        self.api = api

    def start(self):
        """Begin serving websockets to clients, forever."""

        @asyncio.coroutine
        def websocket_server(websocket, path):
            client = Client(self.api, websocket)
            yield from asyncio.wait([client.read(), client.write()])

        start_ws_server = websockets.serve(websocket_server, self.listen, self.port)

        # Maybe don't do this? FIXME/TODO
        asyncio.get_event_loop().run_until_complete(start_ws_server)
        asyncio.get_event_loop().run_forever()

    def stop(self):
        """Close all websockets and stop listening."""
        pass
