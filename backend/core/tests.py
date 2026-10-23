from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Operator


User = get_user_model()


class AuthenticationTests(APITestCase):
    def setUp(self):
        self.admin = User.objects.create_user(
            username='admin-test',
            email='admin@example.test',
            password='Strong-Admin-Password-42',
            name='Test Admin',
            role='ADMIN',
            status='ACTIVE',
        )
        self.operator = User.objects.create_user(
            username='operator-test',
            email='operator@example.test',
            password='Strong-Operator-Password-42',
            name='Test Operator',
            role='OPERATOR',
            status='ACTIVE',
        )
        self.operator_profile = Operator.objects.create(
            user=self.operator,
            name=self.operator.name,
            employee_id='TEST-OP-1',
        )

    def _login(self, identifier, password):
        return self.client.post(
            '/api/auth/login/',
            {'email': identifier, 'password': password},
            format='json',
        )

    def test_email_login_returns_jwt_and_role_and_me_accepts_access_token(self):
        response = self._login('admin@example.test', 'Strong-Admin-Password-42')

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)
        self.assertIn('refresh', response.data)
        self.assertEqual(response.data['user']['role'], 'ADMIN')

        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {response.data['access']}")
        current_user = self.client.get('/api/auth/me/')

        self.assertEqual(current_user.status_code, status.HTTP_200_OK)
        self.assertEqual(current_user.data['id'], self.admin.id)
        self.assertEqual(current_user.data['role'], 'ADMIN')

    def test_username_and_operator_id_login_return_operator_role(self):
        for identifier in ('operator-test', self.operator_profile.operator_id):
            with self.subTest(identifier=identifier):
                response = self._login(identifier, 'Strong-Operator-Password-42')
                self.assertEqual(response.status_code, status.HTTP_200_OK)
                self.assertEqual(response.data['user']['role'], 'OPERATOR')
                self.assertEqual(response.data['user']['operator_id'], self.operator_profile.operator_id)

    def test_invalid_password_is_rejected(self):
        response = self._login('admin@example.test', 'incorrect-password')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertNotIn('access', response.data)

    def test_refresh_endpoint_returns_a_new_access_token(self):
        login_response = self._login('admin@example.test', 'Strong-Admin-Password-42')

        response = self.client.post(
            '/api/auth/refresh/',
            {'refresh': login_response.data['refresh']},
            format='json',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('access', response.data)

    def test_current_user_requires_a_bearer_token(self):
        response = self.client.get('/api/auth/me/')

        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_vercel_origin_can_preflight_login_post(self):
        origin = 'https://industrial-waste-iq-project.vercel.app'
        response = self.client.options(
            '/api/auth/login/',
            HTTP_ORIGIN=origin,
            HTTP_ACCESS_CONTROL_REQUEST_METHOD='POST',
            HTTP_ACCESS_CONTROL_REQUEST_HEADERS='content-type',
        )

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Access-Control-Allow-Origin'], origin)
        self.assertIsNone(response.get('Access-Control-Allow-Credentials'))

    def test_operator_creation_requires_a_unique_initial_password(self):
        login_response = self._login('admin@example.test', 'Strong-Admin-Password-42')
        self.client.credentials(HTTP_AUTHORIZATION=f"Bearer {login_response.data['access']}")
        operator_data = {
            'name': 'New Operator',
            'email': 'new-operator@example.test',
            'employee_id': 'TEST-OP-2',
        }

        missing_password = self.client.post(
            '/api/admin/operators/',
            operator_data,
            format='json',
        )
        self.assertEqual(missing_password.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(email=operator_data['email']).exists())

        created_response = self.client.post(
            '/api/admin/operators/',
            {**operator_data, 'password': 'Unique-Operator-Password-42'},
            format='json',
        )
        self.assertEqual(created_response.status_code, status.HTTP_201_CREATED)
        created_user = User.objects.get(email=operator_data['email'])
        self.assertTrue(created_user.check_password('Unique-Operator-Password-42'))
