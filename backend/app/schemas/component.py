from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
from datetime import datetime
from app.models.component import ComponentType


class ComponentBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    component_type: ComponentType
    props: Optional[Dict[str, Any]] = None
    styles: Optional[Dict[str, Any]] = None
    data_binding: Optional[Dict[str, Any]] = None
    events: Optional[Dict[str, Any]] = None


class ComponentCreate(ComponentBase):
    app_id: int


class ComponentUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    props: Optional[Dict[str, Any]] = None
    styles: Optional[Dict[str, Any]] = None
    data_binding: Optional[Dict[str, Any]] = None
    events: Optional[Dict[str, Any]] = None


class ComponentInDB(ComponentBase):
    id: int
    app_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class Component(ComponentInDB):
    pass


class ComponentWithPosition(Component):
    """Component with layout position information"""
    x: int = 0
    y: int = 0
    w: int = 1
    h: int = 1
