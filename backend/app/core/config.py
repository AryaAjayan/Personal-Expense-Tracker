from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Personal Expense Tracker"
    API_V1_STR: str = "/api"
    DATABASE_URL: str = "sqlite:///./expenses.db"

    class Config:
        case_sensitive = True

settings = Settings()
