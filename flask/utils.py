import hashlib

def hash(to_hash):
    return hashlib.md5(to_hash.encode()).hexdigest()