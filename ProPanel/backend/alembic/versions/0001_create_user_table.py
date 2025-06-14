"""create users table

Revision ID: 0001
Revises: 
Create Date: 2024-06-12 17:00:00.000000

"""
from alembic import op
import sqlalchemy as sa
import enum

# revision identifiers, used by Alembic.
revision = '0001'
down_revision = None
branch_labels = None
depends_on = None

class UserRoleEnum(str, enum.Enum):
    admin = "admin"
    user = "user"
    readonly = "readonly"

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('email', sa.String(), unique=True, index=True, nullable=False),
        sa.Column('full_name', sa.String(), nullable=True),
        sa.Column('hashed_password', sa.String(), nullable=False),
        sa.Column('is_active', sa.Boolean(), default=True),
        sa.Column('is_superuser', sa.Boolean(), default=False),
        sa.Column('role', sa.Enum('admin', 'user', 'readonly', name='userroleenum'), nullable=False, server_default='user'),
    )

def downgrade():
    op.drop_table('users')
    op.execute("DROP TYPE userroleenum;")
