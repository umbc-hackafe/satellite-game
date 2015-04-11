class ObjStore:
    def __init__(self):
        self._set = set()

    def register(self, obj):
        self._set.add(obj)

    def deregister(self, obj):
        self._set.discard(obj)

    def filter(self, keylambda):
        return filter(keylambda, self._set)

    def changed(self):
        return self.filter(lambda obj: obj.changed())
