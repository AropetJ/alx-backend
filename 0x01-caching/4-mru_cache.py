#!/usr/bin/env python3
""" MRUCache module
"""
from base_caching import BaseCaching
from collections import OrderedDict


class MRUCache(BaseCaching):
    """MRUCache class
    """
    def __init__(self):
        """ Instantiation
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """ Add an item in the cache
        args:
            key: key to add
            item: item to add
        """
        if key is None or item is None:
            return

        if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
            mru_key, _ = self.cache_data.popitem(False)
            print("DISCARD:", mru_key)

        self.cache_data[key] = item
        self.cache_data.move_to_end(key, last=False)

    def get(self, key):
        """ Get an item by key
        args:
            key: key to get
        """
        if key is not None and key in self.cache_data:
            self.cache_data.move_to_end(key, last=False)
        return self.cache_data.get(key, None)
