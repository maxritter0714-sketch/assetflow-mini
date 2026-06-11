"""create_initial_tables

Revision ID: 55cea03b5620
Revises:
Create Date: 2026-06-11 11:29:05.890374

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = '55cea03b5620'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "portfolios",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("currency", sa.String(3), nullable=False, server_default="USD"),
        sa.Column("created_at", sa.DateTime, nullable=True),
    )

    op.create_table(
        "transactions",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("portfolio_id", sa.String(36), sa.ForeignKey("portfolios.id"), nullable=False),
        sa.Column("symbol", sa.String(10), nullable=False),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("transaction_type", sa.String(4), nullable=False),
        sa.Column("shares", sa.Float, nullable=False),
        sa.Column("price_per_share", sa.Float, nullable=False),
        sa.Column("sector", sa.String(100), nullable=False, server_default=""),
        sa.Column("transaction_date", sa.Date, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=True),
    )

    op.create_table(
        "watchlist_items",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("symbol", sa.String(10), nullable=False, unique=True),
        sa.Column("name", sa.String(200), nullable=False),
        sa.Column("added_at", sa.DateTime, nullable=True),
    )

    op.create_table(
        "market_data_cache",
        sa.Column("id", sa.String(36), primary_key=True),
        sa.Column("cache_key", sa.String(255), nullable=False, unique=True),
        sa.Column("data_type", sa.String(50), nullable=False),
        sa.Column("data", sa.Text, nullable=False),
        sa.Column("expires_at", sa.DateTime, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=True),
    )

    op.create_index("ix_market_data_cache_key", "market_data_cache", ["cache_key"])
    op.create_index("ix_market_data_cache_expires_at", "market_data_cache", ["expires_at"])


def downgrade() -> None:
    op.drop_index("ix_market_data_cache_expires_at", table_name="market_data_cache")
    op.drop_index("ix_market_data_cache_key", table_name="market_data_cache")
    op.drop_table("market_data_cache")
    op.drop_table("watchlist_items")
    op.drop_table("transactions")
    op.drop_table("portfolios")
