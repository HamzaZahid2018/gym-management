from django.contrib import admin
from .models import User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ['username', 'email', 'phone_number', 'membership_type', 'status', 'join_date']
    list_filter = ['status', 'membership_type', 'created_at']
    search_fields = ['username', 'email', 'phone_number', 'first_name', 'last_name']
    fieldsets = (
        ('Personal Info', {
            'fields': ('username', 'password', 'email', 'first_name', 'last_name', 'phone_number', 'profile_picture', 'address')
        }),
        ('Membership', {
            'fields': ('membership_type', 'status', 'join_date')
        }),
        ('Admin', {
            'fields': ('is_admin', 'is_staff', 'is_superuser', 'groups', 'user_permissions')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )
    readonly_fields = ['join_date', 'created_at', 'updated_at']
    ordering = ['-created_at']
