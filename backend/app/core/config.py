from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    # Datapythaseendcd 
    DATABASE_URL: str = "mysql+pymysql://admin:reshift12345@database-1.cirbwefqfnpy.us-east-1.rds.amazonaws.com/ZeroCarbon12345"
    
    # Security
    SECRET_KEY: str = "reshift-nocode-platform-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # CORS
    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://127.0.0.1:3000"]
    
    # App
    APP_NAME: str = "Reshift NoCode Platform"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = True
    
    class Config:
        env_file = ".env"


settings = Settings()
