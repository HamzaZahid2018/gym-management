from django.contrib import admin
from .models import Payment, PaymentReminder


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    list_display = ['customer', 'month', 'year', 'amount', 'payment_status', 'due_date']
    list_filter = ['payment_status', 'payment_method', 'year', 'month']
    search_fields = ['customer__email', 'customer__first_name', 'customer__last_name']
    readonly_fields = ['created_at', 'updated_at']
    fieldsets = (
        ('Customer', {
            'fields': ('customer',)
        }),
        ('Payment Details', {
            'fields': ('month', 'year', 'amount', 'payment_status', 'payment_method', 'due_date', 'payment_date')
        }),
        ('Additional Info', {
            'fields': ('notes',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    ordering = ['-year', '-month']


@admin.register(PaymentReminder)
class PaymentReminderAdmin(admin.ModelAdmin):
    list_display = ['customer', 'payment', 'reminder_type', 'sent_at', 'status']
    list_filter = ['reminder_type', 'status', 'sent_at']
    search_fields = ['customer__email', 'payment__customer__first_name']
    readonly_fields = ['sent_at']
    ordering = ['-sent_at']
