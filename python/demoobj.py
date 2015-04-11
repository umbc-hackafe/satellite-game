import obj

class DemoObj(obj.GameObj):
    def __init__(self, *args):
        super().__init__(*args)
        self.new = True
    def changed(self):
        if self.new == True:
            self.new = False
            return True
        return self.new
