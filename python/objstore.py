class ObjStore:
    def __init__(self):
        self._set = set()

    def register(self, obj):
        self._set.add(obj)

    def deregister(self, obj):
        self._set.discard(obj)

    def changed(self):
        changed = []
        for obj in self._set:
            if obj.changed():
                changed.append(obj)
        return changed
