class ObjStore:
    def __init__(self):
        self._set = set()

    def register(self, obj):
        self._set.add(obj)

    def deregister(self, obj):
        self._set.discard(obj)

    def filter(self, objfunc=None, keylambda=None):
        if objfunc == None and keylambda == None:
            raise TypeError("either objfunc or keylambda must be supplied")

        matched = []
        # Do the if statement out here, so we don't have to repeat it within the
        # loop.
        if objfunc:
            for obj in self._set:
                if getattr(obj, objfunc)():
                    matched.append(obj)
        else:
            for obj in self.set:
                if keylambda(obj):
                    matched.append(obj)
        return matched
