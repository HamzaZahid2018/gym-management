"""
Script to create sample data for the Gym Management System.

Usage:
    python manage.py shell < fixtures/create_sample_data.py
    
Or:
    python fixtures/create_sample_data.py
"""

import os
import sys
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gym_management.settings')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
django.setup()

from django.utils import timezone
from users.models import User
from payments.models import Payment
from datetime import date, timedelta

def create_sample_data():
    """Create sample customers and payments for testing."""
    
    # Sample customers data
    customers_data = [
        {
            'username': 'john_doe',
            'email': 'john@example.com',
            'first_name': 'John',
            'last_name': 'Doe',
            'phone_number': '+1234567890',
            'address': '123 Gym Street, City',
            'membership_type': 'monthly',
            'status': 'active',
        },
        {
            'username': 'jane_smith',
            'email': 'jane@example.com',
            'first_name': 'Jane',
            'last_name': 'Smith',
            'phone_number': '+1987654321',
            'address': '456 Fitness Ave, City',
            'membership_type': 'quarterly',
            'status': 'active',
        },
        {
            'username': 'mike_johnson',
            'email': 'mike@example.com',
            'first_name': 'Mike',
            'last_name': 'Johnson',
            'phone_number': '+1555666777',
            'address': '789 Health Blvd, City',
            'membership_type': 'yearly',
            'status': 'active',
        },
        {
            'username': 'sarah_williams',
            'email': 'sarah@example.com',
            'first_name': 'Sarah',
            'last_name': 'Williams',
            'phone_number': '+1444555666',
            'address': '321 Wellness Rd, City',
            'membership_type': 'monthly',
            'status': 'inactive',
        },
        {
            'username': 'alex_brown',
            'email': 'alex@example.com',
            'first_name': 'Alex',
            'last_name': 'Brown',
            'phone_number': '+1222333444',
            'address': '654 Exercise Ln, City',
            'membership_type': 'monthly',
            'status': 'active',
        },
    ]

    # Create customers
    print("Creating sample customers...")
    customers = []
    for data in customers_data:
        user, created = User.objects.get_or_create(
            email=data['email'],
            defaults={**data}
        )
        if created:
            user.set_password('password123')
            user.save()
            print(f"✓ Created customer: {user.first_name} {user.last_name}")
            customers.append(user)
        else:
            customers.append(user)
            print(f"⊗ Customer already exists: {user.first_name} {user.last_name}")

    # Create sample payments
    print("\nCreating sample payments...")
    today = date.today()
    months_to_create = 3

    for customer in customers:
        for month_offset in range(months_to_create):
            payment_date = today - timedelta(days=30 * month_offset)
            month = payment_date.month
            year = payment_date.year

            amount_map = {
                'monthly': 50.00,
                'quarterly': 120.00,
                'yearly': 400.00,
            }
            amount = amount_map.get(customer.membership_type, 50.00)

            payment, created = Payment.objects.get_or_create(
                customer=customer,
                month=month,
                year=year,
                defaults={
                    'amount': amount,
                    'payment_status': 'paid' if month_offset == 0 else 'unpaid',
                    'payment_method': 'cash',
                }
            )
            
            if created:
                if payment.payment_status == 'paid':
                    payment.payment_date = timezone.now()
                    payment.save()
                print(f"✓ Created payment for {customer.first_name} - {payment.get_month_display()} {year}")

    print("\n✅ Sample data created successfully!")

if __name__ == '__main__':
    create_sample_data()
