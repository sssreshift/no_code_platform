from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
from enum import Enum as PyEnum


class ComponentType(PyEnum):
    BUTTON = "button"
    TEXT = "text"
    INPUT = "input"
    TABLE = "table"
    CHART = "chart"
    FORM = "form"
    IMAGE = "image"
    CONTAINER = "container"
    TAB = "tab"
    MODAL = "modal"
    LIST = "list"
    SELECT = "select"
    CHECKBOX = "checkbox"
    RADIO = "radio"
    TEXTAREA = "textarea"


class Component(Base):
    __tablename__ = "components"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    component_type = Column(Enum(ComponentType), nullable=False)
    props = Column(JSON, nullable=True)  # Component properties and configuration
    styles = Column(JSON, nullable=True)  # Component styling
    data_binding = Column(JSON, nullable=True)  # Data source bindings
    events = Column(JSON, nullable=True)  # Event handlers
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign Keys
    app_id = Column(Integer, ForeignKey("apps.id"), nullable=False)
    
    # Relationships
    app = relationship("App", back_populates="components")
