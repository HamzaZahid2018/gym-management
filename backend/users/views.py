from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .models import User
from .serializers import (
    UserSerializer, UserDetailSerializer,
    UserLoginSerializer, UserRegisterSerializer
)


class UserViewSet(viewsets.ModelViewSet):
    """
    ViewSet for User management.
    Provides CRUD operations and custom authentication actions.
    """
    queryset = User.objects.all()
    serializer_class = UserDetailSerializer
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.action == 'register':
            return UserRegisterSerializer
        elif self.action == 'login':
            return UserLoginSerializer
        elif self.action in ['list', 'retrieve']:
            return UserDetailSerializer
        return UserSerializer

    def get_permissions(self):
        if self.action in ['create', 'register', 'login']:
            return [AllowAny()]
        return super().get_permissions()

    def get_queryset(self):
        """Exclude staff/superusers from customer list — only show gym members."""
        qs = User.objects.all()
        if self.action in ['list', 'retrieve']:
            qs = qs.filter(is_staff=False, is_superuser=False)
        return qs

    @action(detail=False, methods=['post'], permission_classes=[AllowAny()])
    def register(self, request):
        """Register a new user."""
        serializer = UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserDetailSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[AllowAny()])
    def login(self, request):
        """Authenticate user and return JWT tokens."""
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data['user']
            refresh = RefreshToken.for_user(user)
            return Response({
                'user': UserDetailSerializer(user).data,
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def me(self, request):
        """Get current user profile."""
        user = request.user
        serializer = UserDetailSerializer(user)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def active_members(self, request):
        """Get all active members."""
        queryset = User.objects.filter(status='active')
        serializer = UserDetailSerializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def inactive_members(self, request):
        """Get all inactive members."""
        queryset = User.objects.filter(status='inactive')
        serializer = UserDetailSerializer(queryset, many=True)
        return Response(serializer.data)
