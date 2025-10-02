from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from typing import List, Any, Optional
from sqlalchemy import and_, or_, desc, asc

from app.core.database import get_db
from app.schemas import User, Plugin, PluginCreate, PluginUpdate, PluginPublic, PluginCategory, PluginCategoryCreate, PluginCategoryUpdate
from app.schemas.plugin import (
    PluginInstallation, PluginInstallationCreate, PluginInstallationUpdate,
    PluginReview, PluginReviewCreate, PluginReviewUpdate, PluginReviewPublic,
    PluginSearchFilters, PluginStats, PluginType
)
from app.services.auth import AuthService
from app.services.plugin import PluginService
from app.models.user import UserRole

router = APIRouter()


# Plugin Categories
@router.get("/categories", response_model=List[PluginCategory])
def get_plugin_categories(
    db: Session = Depends(get_db)
) -> Any:
    """Get all plugin categories"""
    plugin_service = PluginService(db)
    return plugin_service.get_categories()


@router.post("/categories", response_model=PluginCategory)
def create_plugin_category(
    category_data: PluginCategoryCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Create a new plugin category (admin only)"""
    if current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only admins can create plugin categories"
        )
    
    plugin_service = PluginService(db)
    return plugin_service.create_category(category_data)


# Plugin Marketplace
@router.get("/", response_model=List[PluginPublic])
def get_plugins(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    category_id: Optional[int] = Query(None),
    plugin_type: Optional[PluginType] = Query(None),
    is_free: Optional[bool] = Query(None),
    is_featured: Optional[bool] = Query(None),
    min_rating: Optional[float] = Query(None, ge=0, le=5),
    search_query: Optional[str] = Query(None),
    sort_by: str = Query("download_count"),
    sort_order: str = Query("desc"),
    db: Session = Depends(get_db)
) -> Any:
    """Get plugins with filtering and search"""
    plugin_service = PluginService(db)
    
    filters = PluginSearchFilters(
        category_id=category_id,
        plugin_type=plugin_type,
        is_free=is_free,
        is_featured=is_featured,
        min_rating=min_rating,
        search_query=search_query,
        sort_by=sort_by,
        sort_order=sort_order
    )
    
    return plugin_service.search_plugins(filters, skip=skip, limit=limit)


@router.get("/featured", response_model=List[PluginPublic])
def get_featured_plugins(
    limit: int = Query(10, ge=1, le=20),
    db: Session = Depends(get_db)
) -> Any:
    """Get featured plugins"""
    plugin_service = PluginService(db)
    return plugin_service.get_featured_plugins(limit=limit)


@router.get("/stats", response_model=PluginStats)
def get_plugin_stats(
    db: Session = Depends(get_db)
) -> Any:
    """Get plugin marketplace statistics"""
    plugin_service = PluginService(db)
    return plugin_service.get_stats()


@router.get("/{plugin_id}", response_model=PluginPublic)
def get_plugin(
    plugin_id: int,
    db: Session = Depends(get_db)
) -> Any:
    """Get plugin by ID"""
    plugin_service = PluginService(db)
    plugin = plugin_service.get_plugin_with_details(plugin_id)
    
    if not plugin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plugin not found"
        )
    
    return plugin


@router.post("/", response_model=Plugin)
def create_plugin(
    plugin_data: PluginCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Create a new plugin"""
    plugin_service = PluginService(db)
    return plugin_service.create_plugin(plugin_data, current_user.id)


@router.put("/{plugin_id}", response_model=Plugin)
def update_plugin(
    plugin_id: int,
    plugin_update: PluginUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Update a plugin (author or admin only)"""
    plugin_service = PluginService(db)
    plugin = plugin_service.get(plugin_id)
    
    if not plugin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plugin not found"
        )
    
    if plugin.author_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the plugin author or admin can update this plugin"
        )
    
    return plugin_service.update_plugin(plugin_id, plugin_update)


@router.delete("/{plugin_id}")
def delete_plugin(
    plugin_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Delete a plugin (author or admin only)"""
    plugin_service = PluginService(db)
    plugin = plugin_service.get(plugin_id)
    
    if not plugin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plugin not found"
        )
    
    if plugin.author_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the plugin author or admin can delete this plugin"
        )
    
    plugin_service.delete(plugin_id)
    return {"message": "Plugin deleted successfully"}


# Plugin Installation
@router.get("/{plugin_id}/installations", response_model=List[PluginInstallation])
def get_plugin_installations(
    plugin_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Get installations for a plugin (author or admin only)"""
    plugin_service = PluginService(db)
    plugin = plugin_service.get(plugin_id)
    
    if not plugin:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Plugin not found"
        )
    
    if plugin.author_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only the plugin author or admin can view installations"
        )
    
    return plugin_service.get_plugin_installations(plugin_id)


@router.post("/{plugin_id}/install", response_model=PluginInstallation)
def install_plugin(
    plugin_id: int,
    installation_data: PluginInstallationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Install a plugin to an app"""
    plugin_service = PluginService(db)
    return plugin_service.install_plugin(plugin_id, installation_data, current_user.id)


@router.put("/installations/{installation_id}", response_model=PluginInstallation)
def update_plugin_installation(
    installation_id: int,
    installation_update: PluginInstallationUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Update plugin installation configuration"""
    plugin_service = PluginService(db)
    return plugin_service.update_installation(installation_id, installation_update, current_user.id)


@router.delete("/installations/{installation_id}")
def uninstall_plugin(
    installation_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Uninstall a plugin from an app"""
    plugin_service = PluginService(db)
    plugin_service.uninstall_plugin(installation_id, current_user.id)
    return {"message": "Plugin uninstalled successfully"}


# Plugin Reviews
@router.get("/{plugin_id}/reviews", response_model=List[PluginReviewPublic])
def get_plugin_reviews(
    plugin_id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db)
) -> Any:
    """Get reviews for a plugin"""
    plugin_service = PluginService(db)
    return plugin_service.get_plugin_reviews(plugin_id, skip=skip, limit=limit)


@router.post("/{plugin_id}/reviews", response_model=PluginReview)
def create_plugin_review(
    plugin_id: int,
    review_data: PluginReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Create a review for a plugin"""
    plugin_service = PluginService(db)
    return plugin_service.create_review(plugin_id, review_data, current_user.id)


@router.put("/reviews/{review_id}", response_model=PluginReview)
def update_plugin_review(
    review_id: int,
    review_update: PluginReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Update a plugin review (author only)"""
    plugin_service = PluginService(db)
    return plugin_service.update_review(review_id, review_update, current_user.id)


@router.delete("/reviews/{review_id}")
def delete_plugin_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Delete a plugin review (author or admin only)"""
    plugin_service = PluginService(db)
    plugin_service.delete_review(review_id, current_user.id)
    return {"message": "Review deleted successfully"}




