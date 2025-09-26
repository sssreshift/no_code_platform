from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime


class LayoutBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    layout_config: Dict[str, Any] = Field(..., description="React Grid Layout configuration")
    breakpoints: Optional[Dict[str, Any]] = Field(None, description="Responsive breakpoints config")


class LayoutCreate(LayoutBase):
    app_id: int


class LayoutUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    layout_config: Optional[Dict[str, Any]] = None
    breakpoints: Optional[Dict[str, Any]] = None


class LayoutInDB(LayoutBase):
    id: int
    app_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class Layout(LayoutInDB):
    pass
