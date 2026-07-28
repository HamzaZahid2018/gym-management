from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""
    password = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
            'phone_number', 'profile_picture', 'address', 'join_date',
            'membership_type', 'status', 'is_admin', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'join_date']

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        password = validated_data.pop('password', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        if password:
            instance.set_password(password)
        instance.save()
        return instance


class UserDetailSerializer(serializers.ModelSerializer):
    """Detailed serializer for User model."""
    
    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'phone_number', 'profile_picture', 'address', 'join_date',
            'membership_type', 'status', 'is_admin', 'is_staff', 'is_superuser',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'join_date']


class UserLoginSerializer(serializers.Serializer):
    """Serializer for user login."""
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            raise serializers.ValidationError('Email and password are required.')

        # Support login by email OR username
        user = None
        try:
            db_user = User.objects.get(email__iexact=email)
            user = authenticate(username=db_user.username, password=password)
        except User.DoesNotExist:
            # Try treating the input as a username directly
            user = authenticate(username=email, password=password)

        if not user:
            raise serializers.ValidationError('Invalid email or password.')

        if not user.is_active:
            raise serializers.ValidationError('This account is disabled.')

        data['user'] = user
        return data


class UserRegisterSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)
    phone_number = serializers.CharField(required=False, allow_blank=True)

    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password2', 'first_name', 'last_name', 'phone_number']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Passwords do not match.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create_user(**validated_data)
        return user
