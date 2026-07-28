from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Payment, MONTH_CHOICES
from datetime import date

User = get_user_model()


@receiver(post_save, sender=User)
def create_monthly_payment(sender, instance, created, **kwargs):
    """
    Signal to auto-create payment records for active members.
    This can be called periodically via a management command or Celery task.
    """
    pass  # This will be triggered by a scheduled task


def auto_create_monthly_payments():
    """
    Auto-create payment records for all active members for current month.
    This should be called monthly via a Celery task or management command.
    """
    today = date.today()
    month = today.month
    year = today.year

    from users.models import User
    active_members = User.objects.filter(status='active')

    created_count = 0
    for member in active_members:
        payment, created = Payment.objects.get_or_create(
            customer=member,
            month=month,
            year=year,
            defaults={
                'amount': get_payment_amount(member),
                'payment_status': 'unpaid'
            }
        )
        if created:
            created_count += 1

    return created_count


def get_payment_amount(user):
    """
    Calculate payment amount based on membership type.
    """
    membership_amounts = {
        'monthly': 50.00,
        'quarterly': 120.00,
        'yearly': 400.00,
    }
    return membership_amounts.get(user.membership_type, 50.00)


def mark_late_payments():
    """
    Auto-mark unpaid payments as late if they're past due date.
    """
    today = timezone.now().date()
    late_payments = Payment.objects.filter(
        payment_status='unpaid',
        due_date__lt=today
    )
    updated_count = late_payments.update(payment_status='late')
    return updated_count
