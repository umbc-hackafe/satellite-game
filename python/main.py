#!/usr/bin/env python3

import sys
import time
import random
import argparse

import objstore
import obj

def main(args):
    running = True

    # Initialize the object store.
    store = objstore.ObjStore()

    # XXX: I don't know if this is a good method for measuring time delay; it
    # may only count process time, not including sleeps.
    curtime = time.process_time()

    while running:
        newtime = time.process_time()
        timediff = curtime - newtime
        curtime = newtime

        changed = store.changed()
        if changed:
            print("Changed: %d" % len(changed))

        if random.random() < 0.000001:
            print("Adding new object")
            obj.RealObj(1, 1, 1, objstore=store)

    return 0

def parse(args):
    parser = argparse.ArgumentParser()
    # parser.add_argument('name', type=int, nargs='+', help='an integer')
    return(parser.parse_args(args))

if __name__ == "__main__":
    sys.exit(main(parse(sys.argv[1:])))
