from pydantic import BaseModel, Field
from typing import Optional, Dict, Any, List
from datetime import datetime


class AppBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    slug: str = Field(..., min_length=1, max_length=255)
    config: Optional[Dict[str, Any]] = None
    is_published: bool = False


class AppCreate(AppBase):
    pass


class AppUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    config: Optional[Dict[str, Any]] = None
    is_published: Optional[bool] = None


class AppInDB(AppBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class App(AppInDB):
    pass


class AppWithComponents(App):
    components: List["Component"] = []
    layouts: List["Layout"] = []


class AppPublic(BaseModel):
    """Public app schema for published apps"""
    id: int
    name: str
    description: Optional[str] = None
    slug: str
    config: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class ComponentPublic(BaseModel):
    """Public component schema for published apps"""
    id: int
    name: str
    component_type: str
    props: Optional[Dict[str, Any]] = None
    styles: Optional[Dict[str, Any]] = None
    data_binding: Optional[Dict[str, Any]] = None
    events: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class PagePublic(BaseModel):
    """Public page schema for published apps"""
    id: int
    name: str
    page_definition: str  # JSON string

    class Config:
        from_attributes = True


class LayoutPublic(BaseModel):
    """Public layout schema for published apps"""
    id: int
    name: str
    layout_config: Dict[str, Any]
    breakpoints: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True


class AppWithContent(BaseModel):
    """Published app schema with full content for rendering"""
    id: int
    name: str
    description: Optional[str] = None
    slug: str
    config: Optional[Dict[str, Any]] = None
    created_at: datetime
    updated_at: Optional[datetime]
    pages: List[PagePublic] = []
    components: List[ComponentPublic] = []
    layouts: List[LayoutPublic] = []

    class Config:
        from_attributes = True


# Avoid circular imports
from .component import Component
from .layout import Layout

AppWithComponents.model_rebuild()
