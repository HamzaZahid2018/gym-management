from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

MEMBERSHIP_CHOICES = (
    ('monthly', 'Monthly'),
    ('quarterly', 'Quarterly'),
    ('yearly', 'Yearly'),
)

STATUS_CHOICES = (
    ('active', 'Active'),
    ('inactive', 'Inactive'),
    ('suspended', 'Suspended'),
)


class User(AbstractUser):
    """
    Extended User model with gym-specific fields.
    """
    phone_number = models.CharField(
        max_length=20,
        validators=[RegexValidator(r'^\+?1?\d{9,15}$', 'Enter a valid phone number.')],
        blank=True
    )
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True
    )

    groups = models.ManyToManyField(
        'auth.Group',
        related_name='gym_users',
        blank=True,
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        related_name='gym_users',
        blank=True,
    )
    address = models.TextField(blank=True)
    join_date = models.DateField(auto_now_add=True)
    membership_type = models.CharField(
        max_length=20,
        choices=MEMBERSHIP_CHOICES,
        default='monthly'
    )
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='active'
    )
    is_admin = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.get_full_name()} ({self.email})"

    @property
    def is_member(self):
        return self.status == 'active'
