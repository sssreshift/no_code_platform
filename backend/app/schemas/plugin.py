from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime
from enum import Enum


class PluginType(str, Enum):
    COMPONENT = "component"
    INTEGRATION = "integration"
    TEMPLATE = "template"
    THEME = "theme"


class PluginCategoryBase(BaseModel):
    name: str = Field(..., max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None


class PluginCategoryCreate(PluginCategoryBase):
    pass


class PluginCategoryUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=100)
    description: Optional[str] = None
    icon: Optional[str] = None


class PluginCategory(PluginCategoryBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class PluginBase(BaseModel):
    name: str = Field(..., max_length=255)
    slug: str = Field(..., max_length=255)
    description: Optional[str] = None
    long_description: Optional[str] = None
    version: str = Field(default="1.0.0", max_length=50)
    plugin_type: PluginType
    category_id: int
    config_schema: Optional[Dict[str, Any]] = None
    default_config: Optional[Dict[str, Any]] = None
    main_file: Optional[str] = None
    assets: Optional[Dict[str, Any]] = None
    dependencies: Optional[List[str]] = None
    is_free: bool = Field(default=True)
    price: Optional[float] = None
    currency: str = Field(default="USD", max_length=3)


class PluginCreate(PluginBase):
    pass


class PluginUpdate(BaseModel):
    name: Optional[str] = Field(None, max_length=255)
    description: Optional[str] = None
    long_description: Optional[str] = None
    version: Optional[str] = Field(None, max_length=50)
    plugin_type: Optional[PluginType] = None
    category_id: Optional[int] = None
    config_schema: Optional[Dict[str, Any]] = None
    default_config: Optional[Dict[str, Any]] = None
    main_file: Optional[str] = None
    assets: Optional[Dict[str, Any]] = None
    dependencies: Optional[List[str]] = None
    is_free: Optional[bool] = None
    price: Optional[float] = None
    currency: Optional[str] = Field(None, max_length=3)
    is_active: Optional[bool] = None
    is_featured: Optional[bool] = None


class Plugin(PluginBase):
    id: int
    author_id: int
    is_active: bool
    is_featured: bool
    is_verified: bool
    download_count: int
    rating: float
    review_count: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class PluginPublic(Plugin):
    """Public plugin schema for marketplace display"""
    category: Optional[PluginCategory] = None
    author_name: Optional[str] = None


class PluginInstallationBase(BaseModel):
    plugin_id: int
    app_id: int
    config: Optional[Dict[str, Any]] = None
    is_active: bool = Field(default=True)


class PluginInstallationCreate(PluginInstallationBase):
    pass


class PluginInstallationUpdate(BaseModel):
    config: Optional[Dict[str, Any]] = None
    is_active: Optional[bool] = None


class PluginInstallation(PluginInstallationBase):
    id: int
    user_id: int
    installed_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class PluginReviewBase(BaseModel):
    plugin_id: int
    rating: int = Field(..., ge=1, le=5)
    title: Optional[str] = Field(None, max_length=255)
    comment: Optional[str] = None


class PluginReviewCreate(PluginReviewBase):
    pass


class PluginReviewUpdate(BaseModel):
    rating: Optional[int] = Field(None, ge=1, le=5)
    title: Optional[str] = Field(None, max_length=255)
    comment: Optional[str] = None


class PluginReview(PluginReviewBase):
    id: int
    user_id: int
    is_verified: bool
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class PluginReviewPublic(PluginReview):
    """Public review schema with user info"""
    user_name: Optional[str] = None


class PluginSearchFilters(BaseModel):
    category_id: Optional[int] = None
    plugin_type: Optional[PluginType] = None
    is_free: Optional[bool] = None
    is_featured: Optional[bool] = None
    min_rating: Optional[float] = Field(None, ge=0, le=5)
    search_query: Optional[str] = None
    sort_by: Optional[str] = Field(default="download_count")  # download_count, rating, created_at
    sort_order: Optional[str] = Field(default="desc")  # asc, desc


class PluginStats(BaseModel):
    total_plugins: int
    total_categories: int
    total_installations: int
    featured_plugins: int
    free_plugins: int
    paid_plugins: int

