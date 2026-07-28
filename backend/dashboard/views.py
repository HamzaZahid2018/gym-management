from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.db.models import Count, Sum, Q
from django.utils import timezone
from datetime import timedelta

from users.models import User
from payments.models import Payment


class DashboardViewSet(viewsets.ViewSet):
    """
    ViewSet for dashboard statistics and analytics.
    """
    permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """
        Get overall dashboard statistics.
        """
        total_customers = User.objects.filter(is_staff=False).count()
        active_members = User.objects.filter(status='active', is_staff=False).count()
        inactive_members = User.objects.filter(status='inactive', is_staff=False).count()
        
        # Payment statistics
        total_paid_this_month = Payment.objects.filter(
            payment_status='paid',
            payment_date__month=timezone.now().month,
            payment_date__year=timezone.now().year
        ).aggregate(Sum('amount'))['amount__sum'] or 0

        total_unpaid = Payment.objects.filter(
            payment_status__in=['unpaid', 'late']
        ).count()

        overdue_payments = Payment.objects.filter(
            payment_status__in=['unpaid', 'late'],
            due_date__lt=timezone.now().date()
        ).count()

        data = {
            'total_customers': total_customers,
            'active_members': active_members,
            'inactive_members': inactive_members,
            'total_paid_this_month': float(total_paid_this_month),
            'total_unpaid': total_unpaid,
            'overdue_payments': overdue_payments,
        }
        return Response(data)

    @action(detail=False, methods=['get'])
    def membership_breakdown(self, request):
        """
        Get breakdown of members by membership type.
        """
        breakdown = User.objects.filter(
            is_staff=False
        ).values('membership_type').annotate(count=Count('id'))

        data = {item['membership_type']: item['count'] for item in breakdown}
        return Response(data)

    @action(detail=False, methods=['get'])
    def revenue_stats(self, request):
        """
        Get revenue statistics.
        """
        today = timezone.now().date()
        
        # Monthly revenue this year
        current_year = today.year
        monthly_revenue = []
        
        for month in range(1, 13):
            revenue = Payment.objects.filter(
                payment_status='paid',
                payment_date__month=month,
                payment_date__year=current_year
            ).aggregate(Sum('amount'))['amount__sum'] or 0
            
            monthly_revenue.append({
                'month': month,
                'revenue': float(revenue)
            })

        total_revenue = sum(item['revenue'] for item in monthly_revenue)

        return Response({
            'total_revenue': total_revenue,
            'monthly_revenue': monthly_revenue,
        })

    @action(detail=False, methods=['get'])
    def payment_status_breakdown(self, request):
        """
        Get breakdown of payments by status.
        """
        breakdown = Payment.objects.values('payment_status').annotate(
            count=Count('id'),
            total_amount=Sum('amount')
        )

        data = [
            {
                'status': item['payment_status'],
                'count': item['count'],
                'total_amount': float(item['total_amount'] or 0)
            }
            for item in breakdown
        ]
        return Response(data)

    @action(detail=False, methods=['get'])
    def recent_payments(self, request):
        """
        Get 10 most recent payments.
        """
        from payments.serializers import PaymentSerializer
        
        recent = Payment.objects.all().select_related('customer').order_by('-payment_date')[:10]
        serializer = PaymentSerializer(recent, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def new_members(self, request):
        """
        Get recently joined members (last 30 days).
        """
        from users.serializers import UserDetailSerializer
        
        thirty_days_ago = timezone.now().date() - timedelta(days=30)
        new_members = User.objects.filter(
            join_date__gte=thirty_days_ago,
            is_staff=False
        ).order_by('-join_date')[:10]
        
        serializer = UserDetailSerializer(new_members, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def due_payments(self, request):
        """
        Get payments due in the next 7 days.
        """
        from payments.serializers import PaymentSerializer
        
        today = timezone.now().date()
        due_in_7_days = today + timedelta(days=7)
        
        due_payments = Payment.objects.filter(
            payment_status='unpaid',
            due_date__gte=today,
            due_date__lte=due_in_7_days
        ).select_related('customer')
        
        serializer = PaymentSerializer(due_payments, many=True)
        return Response(serializer.data)
