from sqlalchemy import Column, Integer, String, Text, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base


class Page(Base):
    __tablename__ = "pages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    app_id = Column(Integer, ForeignKey("apps.id"), nullable=False)
    page_definition = Column(Text, nullable=False)  # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationship
    app = relationship("App", back_populates="pages")
    
    def __repr__(self):
        return f"<Page(id={self.id}, name='{self.name}', app_id={self.app_id})>"
