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


class RegistrationTests(APITestCase):
    def _register(self, **overrides):
        registration_data = {
            'username': 'new-operator',
            'name': 'New Operator',
            'email': 'new-operator@example.test',
            'password': 'Unique-Registration-Password-42',
            'confirm_password': 'Unique-Registration-Password-42',
            'role': 'OPERATOR',
            'department': 'Waste Processing',
        }
        registration_data.update(overrides)
        return self.client.post(
            '/api/auth/register/',
            registration_data,
            format='json',
        )

    def test_operator_registration_hashes_password_and_can_log_in(self):
        response = self._register()

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(email='new-operator@example.test')
        self.assertEqual(user.username, 'new-operator')
        self.assertEqual(user.role, 'OPERATOR')
        self.assertTrue(user.check_password('Unique-Registration-Password-42'))
        self.assertNotEqual(user.password, 'Unique-Registration-Password-42')
        self.assertEqual(user.operator_profile.department, 'Waste Processing')
        self.assertTrue(user.operator_profile.employee_id.startswith('REG-'))

        login_response = self.client.post(
            '/api/auth/login/',
            {'email': user.email, 'password': 'Unique-Registration-Password-42'},
            format='json',
        )
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        self.assertEqual(login_response.data['user']['role'], 'OPERATOR')

    def test_client_can_register_but_public_admin_registration_is_rejected(self):
        client_response = self._register(
            username='new-client',
            name='New Client',
            email='new-client@example.test',
            role='CLIENT_VIEWER',
            department='',
        )
        self.assertEqual(client_response.status_code, status.HTTP_201_CREATED)
        client_user = User.objects.get(email='new-client@example.test')
        self.assertEqual(client_user.role, 'CLIENT_VIEWER')
        self.assertFalse(hasattr(client_user, 'operator_profile'))

        admin_response = self._register(
            username='new-admin',
            email='new-admin@example.test',
            role='ADMIN',
        )
        self.assertEqual(admin_response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(User.objects.filter(email='new-admin@example.test').exists())

    def test_duplicate_username_and_email_return_field_errors(self):
        User.objects.create_user(
            username='taken-name',
            email='taken@example.test',
            password='Existing-Password-42',
        )

        duplicate_username = self._register(username='taken-name')
        self.assertEqual(duplicate_username.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', duplicate_username.data)

        duplicate_email = self._register(email='TAKEN@example.test')
        self.assertEqual(duplicate_email.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('email', duplicate_email.data)

    def test_required_fields_confirmation_and_password_validation(self):
        missing_fields = self.client.post(
            '/api/auth/register/',
            {},
            format='json',
        )
        self.assertEqual(missing_fields.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', missing_fields.data)
        self.assertIn('email', missing_fields.data)
        self.assertIn('password', missing_fields.data)

        mismatch = self._register(confirm_password='different-password')
        self.assertEqual(mismatch.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('confirm_password', mismatch.data)
        self.assertFalse(User.objects.filter(username='new-operator').exists())

        weak_password = self._register(
            password='short',
            confirm_password='short',
        )
        self.assertEqual(weak_password.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('password', weak_password.data)
        self.assertFalse(User.objects.filter(username='new-operator').exists())

    def test_registered_client_cannot_access_admin_endpoint(self):
        response = self._register(
            username='restricted-client',
            email='restricted-client@example.test',
            role='CLIENT_VIEWER',
            department='',
        )
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='restricted-client')
        login = self.client.post(
            '/api/auth/login/',
            {'email': user.email, 'password': 'Unique-Registration-Password-42'},
            format='json',
        )
        self.client.credentials(
            HTTP_AUTHORIZATION=f"Bearer {login.data['access']}"
        )

        admin_response = self.client.get('/api/admin/dashboard/')
        self.assertEqual(admin_response.status_code, status.HTTP_403_FORBIDDEN)
