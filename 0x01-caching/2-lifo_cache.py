#!/usr/bin/python3
""" LIFO Caching """
from base_caching import BaseCaching


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

        if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
            last_key = next(reversed(self.cache_data))
            del self.cache_data[last_key]
            print(f"DISCARD: {last_key}\n")

        self.cache_data[key] = item

    def get(self, key):
        """
        Retrieves the value associated with the given key from the cache.
        Args:
            key: The key to retrieve the value for.
        Returns:
            The value associated with the key, or None if the key is
            not found.
        """
        if key is None or key not in self.cache_data:
            return None

        return self.cache_data[key]
