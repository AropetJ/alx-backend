#!/usr/bin/env python3
"""0-simple_helper_function.py
"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple[int, int]:
    """
    Calculate the start and end index for pagination.
    Parameters:
    - page (int): The current page number.
    - page_size (int): The number of items per page.
    Returns:
    - tuple[int, int]: A tuple containing the start index and the end index.
    """
    start_index = (page - 1) * page_size
    end_index = start_index + page_size
    return (start_index, end_index)
