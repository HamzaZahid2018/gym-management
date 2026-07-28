from django.db import models
from django.utils import timezone
from users.models import User

PAYMENT_STATUS_CHOICES = (
    ('paid', 'Paid'),
    ('unpaid', 'Unpaid'),
    ('late', 'Late'),
    ('pending', 'Pending'),
)

PAYMENT_METHOD_CHOICES = (
    ('cash', 'Cash'),
    ('card', 'Card'),
    ('online', 'Online'),
    ('cheque', 'Cheque'),
)

MONTH_CHOICES = [
    (1, 'January'),
    (2, 'February'),
    (3, 'March'),
    (4, 'April'),
    (5, 'May'),
    (6, 'June'),
    (7, 'July'),
    (8, 'August'),
    (9, 'September'),
    (10, 'October'),
    (11, 'November'),
    (12, 'December'),
]


class Payment(models.Model):
    """
    Payment model to track customer payments.
    """
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    month = models.IntegerField(choices=MONTH_CHOICES)
    year = models.IntegerField()
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    payment_status = models.CharField(
        max_length=20,
        choices=PAYMENT_STATUS_CHOICES,
        default='unpaid'
    )
    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHOD_CHOICES,
        default='cash'
    )
    payment_date = models.DateTimeField(null=True, blank=True)
    due_date = models.DateField()
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-year', '-month']
        unique_together = ['customer', 'month', 'year']
        indexes = [
            models.Index(fields=['customer', 'year', 'month']),
            models.Index(fields=['payment_status']),
        ]

    def __str__(self):
        return f"{self.customer.get_full_name()} - {self.get_month_display()} {self.year}"

    def save(self, *args, **kwargs):
        # Set due date to last day of the month if not already set
        if not self.due_date:
            next_month = self.month % 12 + 1
            next_year = self.year if self.month < 12 else self.year + 1
            from datetime import date, timedelta
            first_day_next_month = date(next_year, next_month, 1)
            self.due_date = first_day_next_month - timedelta(days=1)

        # Auto-update payment status based on payment_date
        if self.payment_date and self.payment_status == 'unpaid':
            if self.payment_date.date() > self.due_date:
                self.payment_status = 'late'
            else:
                self.payment_status = 'paid'

        super().save(*args, **kwargs)

    @property
    def is_overdue(self):
        """Check if payment is overdue."""
        if self.payment_status == 'paid':
            return False
        return timezone.now().date() > self.due_date

    @property
    def days_overdue(self):
        """Get number of days overdue."""
        if not self.is_overdue:
            return 0
        return (timezone.now().date() - self.due_date).days


class PaymentReminder(models.Model):
    """
    Model to track payment reminders sent to customers.
    """
    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name='reminders')
    customer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payment_reminders')
    reminder_type = models.CharField(
        max_length=20,
        choices=[
            ('email', 'Email'),
            ('sms', 'SMS'),
            ('whatsapp', 'WhatsApp'),
        ]
    )
    sent_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(
        max_length=20,
        choices=[('sent', 'Sent'), ('failed', 'Failed'), ('delivered', 'Delivered')],
        default='sent'
    )

    class Meta:
        ordering = ['-sent_at']

    def __str__(self):
        return f"Reminder for {self.payment} - {self.reminder_type}"
