from django.core.management.base import BaseCommand
from payments.signals import auto_create_monthly_payments


class Command(BaseCommand):
    help = 'Auto-create monthly payment records for all active members'

    def handle(self, *args, **options):
        created_count = auto_create_monthly_payments()
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully created {created_count} payment records'
            )
        )
