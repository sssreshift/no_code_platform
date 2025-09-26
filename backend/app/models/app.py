from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, JSON, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class App(Base):
    __tablename__ = "apps"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    config = Column(JSON, nullable=True)  # JSON configuration of the app
    is_published = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign Keys
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Relationships
    owner = relationship("User", back_populates="apps")
    components = relationship("Component", back_populates="app", cascade="all, delete-orphan")
    layouts = relationship("Layout", back_populates="app", cascade="all, delete-orphan")
    pages = relationship("Page", back_populates="app", cascade="all, delete-orphan")
    plugin_installations = relationship("PluginInstallation", back_populates="app", cascade="all, delete-orphan")
