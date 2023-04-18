from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool

from alembic import context

import os, sys
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(BASE_DIR, ".env"))
sys.path.append(BASE_DIR)

sys.path.append('../app')
from app.database import SQLALCHEMY_DATABASE_URL

sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '../app')))
from app.models import Base 

# db_user = os.environ.get("DATABASE_USERNAME")
# db_password = os.environ.get("DATABASE_PASSWORD")
# db_host = os.environ.get("DATABASE_HOSTNAME")
# db_port = os.environ.get("DATABASE_PORT")
# db_name = os.environ.get("DATABASE_NAME")

# DATABASE_URL = f"postgresql+psycopg2://{db_user}:{db_password}@{db_host}:{db_port}/{db_name}"
# print(DATABASE_URL, 'jajajaja')


config = context.config

config.set_main_option("sqlalchemy.url", SQLALCHEMY_DATABASE_URL)


if config.config_file_name is not None:
    fileConfig(config.config_file_name)


target_metadata = Base.metadata




def run_migrations_offline() -> None:

    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
 
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()