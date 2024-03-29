#!/usr/bin/python3
""" FIFO caching """
from collections import OrderedDict
from base_caching import BaseCaching


class FIFOCache(BaseCaching):
    """ FIFO cache class"""
    def __init__(self):
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """ Add an item in the cache"""
        if key and item:
            self.cache_data[key] = item
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            first = next(iter(self.cache_data))
            self.cache_data.pop(first)
            print("DISCARD: {}".format(first))

    def get(self, key):
        """ Get an item by key"""
        if key and key in self.cache_data:
            return self.cache_data[key]
        return None
