#!/usr/bin/env python3
"""This module defines the BasicCache class, which is a caching system that
inherits from the BaseCaching class.
It provides methods for putting items into the cache and retrieving items
from the cache.
Example:
    cache = BasicCache()
    cache.put('key', 'value')
    result = cache.get('key')
    print(result)  # Output: value
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    def put(self, key, item):
        """Put an item into the cache.
        Args:
            key: The key of the item.
            item: The item to be stored in the cache.
        Returns:
            None
        """
        if key is not None and item is not None:
            self.cache_data[key] = item

    def get(self, key):
        """Get an item from the cache.
        Args:
            key: The key of the item to retrieve.
        Returns:
            The item associated with the key, or None if the key is not found
        """
        if key is not None:
            return self.cache_data.get(key)
        return None
