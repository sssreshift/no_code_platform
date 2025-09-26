from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Layout(Base):
    __tablename__ = "layouts"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    layout_config = Column(JSON, nullable=False)  # React Grid Layout configuration
    breakpoints = Column(JSON, nullable=True)  # Responsive breakpoints config
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Foreign Keys
    app_id = Column(Integer, ForeignKey("apps.id"), nullable=False)
    
    # Relationships
    app = relationship("App", back_populates="layouts")
