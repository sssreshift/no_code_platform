from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, JSON, Float
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class PluginCategory(Base):
    __tablename__ = "plugin_categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    description = Column(Text, nullable=True)
    icon = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    plugins = relationship("Plugin", back_populates="category")


class Plugin(Base):
    __tablename__ = "plugins"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, index=True, nullable=False)
    description = Column(Text, nullable=True)
    long_description = Column(Text, nullable=True)
    version = Column(String(50), nullable=False, default="1.0.0")
    
    # Plugin metadata
    plugin_type = Column(String(50), nullable=False)  # component, integration, template, theme
    category_id = Column(Integer, ForeignKey("plugin_categories.id"), nullable=False)
    
    # Plugin configuration
    config_schema = Column(JSON, nullable=True)  # JSON schema for plugin configuration
    default_config = Column(JSON, nullable=True)  # Default configuration values
    
    # Plugin files and assets
    main_file = Column(Text, nullable=True)  # Main plugin file content
    assets = Column(JSON, nullable=True)  # CSS, JS, images, etc.
    dependencies = Column(JSON, nullable=True)  # Required dependencies
    
    # Pricing and availability
    is_free = Column(Boolean, default=True, nullable=False)
    price = Column(Float, nullable=True)
    currency = Column(String(3), default="USD", nullable=False)
    
    # Plugin status
    is_active = Column(Boolean, default=True, nullable=False)
    is_featured = Column(Boolean, default=False, nullable=False)
    is_verified = Column(Boolean, default=False, nullable=False)
    
    # Statistics
    download_count = Column(Integer, default=0, nullable=False)
    rating = Column(Float, default=0.0, nullable=False)
    review_count = Column(Integer, default=0, nullable=False)
    
    # Metadata
    author_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    category = relationship("PluginCategory", back_populates="plugins")
    author = relationship("User", back_populates="plugins")
    installations = relationship("PluginInstallation", back_populates="plugin")
    reviews = relationship("PluginReview", back_populates="plugin")


class PluginInstallation(Base):
    __tablename__ = "plugin_installations"

    id = Column(Integer, primary_key=True, index=True)
    plugin_id = Column(Integer, ForeignKey("plugins.id"), nullable=False)
    app_id = Column(Integer, ForeignKey("apps.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Installation configuration
    config = Column(JSON, nullable=True)  # User-specific configuration
    is_active = Column(Boolean, default=True, nullable=False)
    
    # Installation metadata
    installed_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    plugin = relationship("Plugin", back_populates="installations")
    app = relationship("App", back_populates="plugin_installations")
    user = relationship("User", back_populates="plugin_installations")


class PluginReview(Base):
    __tablename__ = "plugin_reviews"

    id = Column(Integer, primary_key=True, index=True)
    plugin_id = Column(Integer, ForeignKey("plugins.id"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    # Review content
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String(255), nullable=True)
    comment = Column(Text, nullable=True)
    
    # Review metadata
    is_verified = Column(Boolean, default=False, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    plugin = relationship("Plugin", back_populates="reviews")
    user = relationship("User", back_populates="plugin_reviews")
