from django.core.management.base import BaseCommand
from payments.signals import mark_late_payments


class Command(BaseCommand):
    help = 'Mark unpaid payments as late if past due date'

    def handle(self, *args, **options):
        updated_count = mark_late_payments()
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully marked {updated_count} payments as late'
            )
        )
