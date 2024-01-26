#!/usr/bin/env python3
'''
0-simple_helper_function.py
'''
from typing import Tuple


def index_range(page: int, page_size: int) -> tuple[int, int]:
    """
    Calculate start and end index for pagination.
    Parameters:
    page (int): The current page number.
    page_size (int): The number of items per page.
    Returns:
    tuple: A tuple containing the start and end index.
    """
    end_index = page * page_size
    start_index = end_index - page_size
    return (start_index, end_index)
