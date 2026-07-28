#!/usr/bin/env python3
import sqlite3
import os

# Create a simple SQLite database file
db_path = 'db.sqlite3'

# Remove existing file if present
if os.path.exists(db_path):
    os.remove(db_path)

# Create a new database file
conn = sqlite3.connect(db_path)
conn.close()

print(f"Database file '{db_path}' created successfully")