from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class PageBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    app_id: int
    page_definition: Dict[str, Any]


class PageCreate(PageBase):
    pass


class PageUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    page_definition: Optional[Dict[str, Any]] = None


class Page(PageBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True


class PageResponse(BaseModel):
    id: int
    name: str
    app_id: int
    page_definition: Dict[str, Any]
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True
