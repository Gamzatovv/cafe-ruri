import os


def _required(name: str) -> str:
    value = os.getenv(name, '').strip()
    if not value:
        raise RuntimeError(f'{name} must be set in the environment')
    return value


DATABASE_URL = os.getenv('DATABASE_URL', 'sqlite:///./data/restaurant.db')
ADMIN_PASSWORD = _required('ADMIN_PASSWORD')
CORS_ORIGINS = [item.strip() for item in os.getenv('CORS_ORIGINS', '').split(',') if item.strip()]

ORDER_EMAIL = os.getenv('ORDER_EMAIL', 'gamzatovvmail@gmail.com').strip()
SMTP_HOST = os.getenv('SMTP_HOST', 'smtp.gmail.com').strip()
SMTP_PORT = int(os.getenv('SMTP_PORT', '587'))
SMTP_USER = os.getenv('SMTP_USER', '').strip()
SMTP_PASSWORD = os.getenv('SMTP_PASSWORD', '')
MAIL_FROM = os.getenv('MAIL_FROM', SMTP_USER or ORDER_EMAIL).strip()
