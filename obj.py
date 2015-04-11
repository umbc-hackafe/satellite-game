import uuid

class GameObj:
    def __init__(self, objstore):
        self._uuid = uuid.uuid4()
        self.new = True
        print(self._uuid)
        objstore.register(self)
    def __hash__(self):
        return int(self._uuid)
    def __eq__(self, obj):
        return int(self._uuid) == int(obj._uuid)

    def changed(self):
        if self.new:
            self.new = False
            return True
        else:
            return False

class RealObj(GameObj):
    def __init__(self, coords, radius, mass, *args, **kwargs):
        self.coords = coords
        self.radius = radius
        self.mass = mass
        super().__init__(*args, **kwargs)
