#!/usr/bin/env python3
""" LIFOCache module
"""
from base_caching import BaseCaching


class LIFOCache(BaseCaching):
    class LIFOCache(BaseCaching):
        """
        LIFOCache class that inherits from BaseCaching.
        """

        def __init__(self):
            """
            Initializes an instance of the LIFOCache class.
            Args:
                None
            Returns:
                None
            """
            super().__init__()
            self.cache_data = {}
            self.keys_freq = []

    def __reorder_items(self, mru_key):
        """ Reorders the keys in self.keys_freq by frequency.
        Args:
            mru_key (str): Most recently used key.
        Returns:
                None
        """
        mru_freq = self.keys_freq[-1][1] + 1
        ins_pos = next((i for i, (key, freq) in enumerate(
            self.keys_freq) if key == mru_key), None)
        if ins_pos is not None:
            self.keys_freq.pop(ins_pos)
        for i, (key, freq) in enumerate(self.keys_freq):
            if freq > mru_freq:
                ins_pos = i
                break
        self.keys_freq.insert(ins_pos, (mru_key, mru_freq))

    def put(self, key, item):
        """ Adds an item to the cache.
        Args:
            key (str): Key of the item to add to the cache.
            item (str): Value of the item to add to the cache.
        Returns:
            None
        """
        if key not in self.cache_data:
            if len(self.cache_data) + 1 > BaseCaching.MAX_ITEMS:
                lfu_key, _ = self.keys_freq.pop(0)
                self.cache_data.pop(lfu_key)
                print("DISCARD:", lfu_key)
            self.cache_data[key] = item
            self.keys_freq.append((key, 0))
        else:
            self.cache_data[key] = item
            self.__reorder_items(key)

    def get(self, key):
        """ Retrieves an item from cache.
        Args:
            key (str): Key of the item to retrieve from the cache.
        Returns:
            Value of the requested item or None if key not found.
        """
        if key in self.cache_data:
            self.__reorder_items(key)
        return self.cache_data.get(key, None)
