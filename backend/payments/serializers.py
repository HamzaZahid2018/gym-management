from rest_framework import serializers
from .models import Payment, PaymentReminder
from users.serializers import UserDetailSerializer


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model."""
    customer_details = UserDetailSerializer(source='customer', read_only=True)
    month_display = serializers.CharField(source='get_month_display', read_only=True)
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = [
            'id', 'customer', 'customer_details', 'month', 'month_display', 'year',
            'amount', 'payment_status', 'payment_method', 'payment_date', 'due_date',
            'notes', 'is_overdue', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_is_overdue(self, obj):
        return obj.is_overdue


class PaymentDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for Payment model."""
    customer_details = UserDetailSerializer(source='customer', read_only=True)
    month_display = serializers.CharField(source='get_month_display', read_only=True)
    payment_method_display = serializers.CharField(source='get_payment_method_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)
    is_overdue = serializers.SerializerMethodField()
    days_overdue = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = [
            'id', 'customer', 'customer_details', 'month', 'month_display', 'year',
            'amount', 'payment_status', 'payment_status_display', 'payment_method',
            'payment_method_display', 'payment_date', 'due_date', 'notes',
            'is_overdue', 'days_overdue', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_is_overdue(self, obj):
        return obj.is_overdue

    def get_days_overdue(self, obj):
        return obj.days_overdue


class PaymentReminderSerializer(serializers.ModelSerializer):
    """Serializer for PaymentReminder model."""
    customer_email = serializers.CharField(source='customer.email', read_only=True)
    
    class Meta:
        model = PaymentReminder
        fields = [
            'id', 'payment', 'customer', 'customer_email', 'reminder_type',
            'sent_at', 'status'
        ]
        read_only_fields = ['id', 'sent_at']
