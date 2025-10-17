from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    # Database
    database_url: str = "postgresql://postgres:postgres123@localhost:5432/clinica_medica"
    
    # Redis
    redis_url: str = "redis://localhost:6379"
    
    # Security
    secret_key: str = "your-secret-key-here-change-in-production"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 30
    
    # OpenAI
    openai_api_key: Optional[str] = None
    
    # WhatsApp
    whatsapp_session_path: str = "./whatsapp-sessions"
    
    # Environment
    environment: str = "development"
    
    # CORS - Permitir Lovable e outros frontends
    @property
    def allowed_origins(self) -> list:
        return [
            "http://localhost:5173",
            "http://localhost:3000",
            "https://*.lovableproject.com",
            "https://*.lovable.app",
            "*"  # Permitir todos durante desenvolvimento
        ]
    
    class Config:
        env_file = ".env"
        case_sensitive = False


settings = Settings()
