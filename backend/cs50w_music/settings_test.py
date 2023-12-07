"""Disable api rate limiting in tests"""

from .settings import *
REST_FRAMEWORK["DEFAULT_THROTTLE_CLASSES"] = {}
REST_FRAMEWORK["DEFAULT_THROTTLE_RATES"] = {}