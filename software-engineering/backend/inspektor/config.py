from enum import Enum
from typing import List

from pydantic_settings import BaseSettings, SettingsConfigDict


class Env(str, Enum):
    """
    Enum for the different environments Inspektor can run in.

    Local: Used for local development.
    """

    local = "local"


class DbSettings(BaseSettings):
    engine: str = "django.db.backends.postgresql"
    host: str
    port: int
    name: str
    user: str
    password: str


class AzureBlobStorageSettings(BaseSettings):
    account_name: str
    account_key: str
    endpoint: str
    container: str
    https: bool
    url_expiration_secs: int

    @property
    def connection_string(self) -> str:
        return (
            f"DefaultEndpointsProtocol={'https' if self.https else 'http'};"
            f"AccountName={self.account_name};"
            f"AccountKey={self.account_key};"
            f"BlobEndpoint={'https' if self.https else 'http'}://{self.endpoint};"
        )


class DjangoSettings(BaseSettings):
    secret_key: str
    allowed_hosts: List[str]
    url: str


class ClassificationEngineSettings(BaseSettings):
    path: str


class GlobalSettings(BaseSettings):
    """
    Global settings for Inspektor.

    Settings are loaded from environment variables and/or dotenv files.

    Environment variables will always take priority over values loaded from any dotenv file to allow for
    configuring sensitive settings (e.g passwords) in production environments.
    See https://docs.pydantic.dev/latest/usage/settings/#dotenv-env-support for more information.

    Groups of settings can be nested using double underscores in the environment variable name.
    For example, to set the database host, you would set the environment variable DB__HOST.
    Or to set the blob storage account name, you would set the environment variable BLOB_STORAGE__ACCOUNT_NAME.
    See https://docs.pydantic.dev/latest/usage/settings/#parsing-environment-variable-values for more information.
    """

    env: Env
    db: DbSettings
    blob_storage: AzureBlobStorageSettings
    classification_engine: ClassificationEngineSettings
    django: DjangoSettings

    model_config = SettingsConfigDict(
        env_nested_delimiter="__", env_file_encoding="utf-8"
    )


class LocalSettings(GlobalSettings):
    env: Env = Env.local
    model_config = SettingsConfigDict(
        env_file="backend/.env.local",
        env_nested_delimiter="__",
        env_file_encoding="utf-8",
    )


def get_default_settings() -> GlobalSettings:
    return LocalSettings()
