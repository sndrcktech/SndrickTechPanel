"""add audit log

Revision ID: 0002
Revises: 0001
Create Date: 2024-06-12 17:30:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '0002'
down_revision = '0001'
branch_labels = None
depends_on = None

def upgrade():
    op.create_table(
        'audit_log',
        sa.Column('id', sa.Integer(), primary_key=True, index=True),
        sa.Column('user_email', sa.String(), index=True),
        sa.Column('action', sa.String(), index=True),
        sa.Column('data', sa.JSON()),
        sa.Column('timestamp', sa.DateTime(), index=True)
    )

def downgrade():
    op.drop_table('audit_log')
