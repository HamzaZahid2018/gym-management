from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q

from .models import Payment, PaymentReminder
from .serializers import PaymentSerializer, PaymentDetailSerializer, PaymentReminderSerializer


class PaymentViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Payment management.
    Provides CRUD operations and filtering capabilities.
    """
    queryset = Payment.objects.all().select_related('customer')
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['customer__email', 'customer__first_name', 'customer__last_name']
    ordering_fields = ['payment_date', 'due_date', 'amount']
    ordering = ['-year', '-month']

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PaymentDetailSerializer
        return PaymentSerializer

    @action(detail=False, methods=['get'])
    def unpaid(self, request):
        """Get all unpaid payments."""
        queryset = self.queryset.filter(payment_status__in=['unpaid', 'late'])
        serializer = PaymentSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get all overdue payments."""
        today = timezone.now().date()
        queryset = self.queryset.filter(
            Q(payment_status='unpaid') | Q(payment_status='late'),
            due_date__lt=today
        )
        serializer = PaymentSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_customer(self, request):
        """Get payments filtered by customer."""
        customer_id = request.query_params.get('customer_id')
        if not customer_id:
            return Response(
                {'error': 'customer_id parameter is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        queryset = self.queryset.filter(customer_id=customer_id)
        serializer = PaymentSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_month(self, request):
        """Get payments filtered by month and year."""
        month = request.query_params.get('month')
        year = request.query_params.get('year')
        
        if not month or not year:
            return Response(
                {'error': 'month and year parameters are required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        queryset = self.queryset.filter(month=month, year=year)
        serializer = PaymentSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def mark_paid(self, request, pk=None):
        """Mark a payment as paid."""
        payment = self.get_object()
        payment.payment_status = 'paid'
        payment.payment_date = timezone.now()
        payment.payment_method = request.data.get('payment_method', payment.payment_method)
        payment.notes = request.data.get('notes', payment.notes)
        payment.save()
        serializer = PaymentDetailSerializer(payment)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def bulk_create(self, request):
        """Bulk create payments for multiple customers in a given month."""
        month = request.data.get('month')
        year = request.data.get('year')
        amount = request.data.get('amount')
        customer_ids = request.data.get('customer_ids')  # List of customer IDs

        if not all([month, year, amount, customer_ids]):
            return Response(
                {'error': 'month, year, amount, and customer_ids are required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        from users.models import User
        customers = User.objects.filter(id__in=customer_ids, status='active')
        
        created_payments = []
        for customer in customers:
            payment, created = Payment.objects.get_or_create(
                customer=customer,
                month=month,
                year=year,
                defaults={'amount': amount, 'payment_status': 'unpaid'}
            )
            if created:
                created_payments.append(payment)

        serializer = PaymentSerializer(created_payments, many=True)
        return Response({
            'created_count': len(created_payments),
            'payments': serializer.data
        }, status=status.HTTP_201_CREATED)

    @action(detail=False, methods=['post'])
    def send_reminders(self, request):
        """Send payment reminders for overdue payments."""
        today = timezone.now().date()
        overdue_payments = Payment.objects.filter(
            payment_status='unpaid',
            due_date__lt=today
        )

        reminder_type = request.data.get('reminder_type', 'email')
        reminders_sent = []

        for payment in overdue_payments:
            reminder = PaymentReminder.objects.create(
                payment=payment,
                customer=payment.customer,
                reminder_type=reminder_type,
                status='sent'
            )
            reminders_sent.append(reminder)

        serializer = PaymentReminderSerializer(reminders_sent, many=True)
        return Response({
            'count': len(reminders_sent),
            'reminders': serializer.data
        }, status=status.HTTP_201_CREATED)
