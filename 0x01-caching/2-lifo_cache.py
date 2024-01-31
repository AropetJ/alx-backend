#!/usr/bin/python3
""" LIFO Caching """
from base_caching import BaseCaching
from collections import OrderedDict


class LIFOCache(BaseCaching):
    """
    LIFOCache class that inherits from BaseCaching.
    Attributes:
        cache_data (dict): Dictionary to store key-value pairs.
    """

    def __init__(self):
        """
        Initializes an instance of the LIFOCache class.
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """
        Adds a key-value pair to the cache.
        Args:
            key: The key to be added.
            item: The value associated with the key.
        Returns:
            None
        """
        if key is None or item is None:
            return

        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                last_key, _ = self.cache_data.popitem(True)
                print("DISCARD:", last_key)
        self.cache_data[key] = item
        self.cache_data.move_to_end(key, last=True)

    def get(self, key):
        """
        Retrieves the value associated with the given key from the cache.
        Args:
            key: The key to retrieve the value for.
        Returns:
            The value associated with the key, or None if the key is
            not found.
        """
        return self.cache_data.get(key, None)
