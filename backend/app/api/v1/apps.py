from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any

from app.core.database import get_db
from app.schemas import User, App, AppCreate, AppUpdate, AppWithComponents, AppPublic, AppWithContent
from app.services.auth import AuthService
from app.services.app import AppService
from app.models.user import UserRole

router = APIRouter()

@router.get("/", response_model=List[App])
def get_apps(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Get user's apps"""
    app_service = AppService(db)
    apps = app_service.get_by_owner(current_user.id, skip=skip, limit=limit)
    return apps


@router.post("/", response_model=App)
def create_app(
    app_data: AppCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Create new app"""
    app_service = AppService(db)
    
    # Check if slug is unique
    existing_app = app_service.get_by_slug(app_data.slug)
    if existing_app:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="App with this slug already exists"
        )
    
    app = app_service.create(app_data, owner_id=current_user.id)
    return app


@router.get("/{app_id}", response_model=AppWithComponents)
def get_app(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Get app by ID with components"""
    app_service = AppService(db)
    app = app_service.get_with_components(app_id)
    
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )
    
    # Check if user owns the app or is admin
    if app.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        # If app is published, allow public access
        if not app.is_published:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to access this app"
            )
    
    return app


@router.get("/slug/{slug}", response_model=AppPublic)
def get_app_by_slug(
    slug: str,
    db: Session = Depends(get_db)
) -> Any:
    """Get published app by slug (public access)"""
    app_service = AppService(db)
    app = app_service.get_by_slug(slug)
    
    if not app or not app.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found or not published"
        )
    
    return app


@router.get("/slug/{slug}/content", response_model=AppWithContent)
def get_published_app_content(
    slug: str,
    db: Session = Depends(get_db)
) -> Any:
    """Get published app with full content (pages, components, layouts) for rendering"""
    app_service = AppService(db)
    app = app_service.get_by_slug_with_content(slug)
    
    if not app or not app.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found or not published"
        )
    
    return app


@router.get("/standalone/{slug}", response_model=AppWithContent)
def get_standalone_app(
    slug: str,
    db: Session = Depends(get_db)
) -> Any:
    """Get standalone published app (no authentication required)"""
    app_service = AppService(db)
    app = app_service.get_by_slug_with_content(slug)
    
    if not app or not app.is_published:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found or not published"
        )
    
    return app


@router.put("/{app_id}", response_model=App)
def update_app(
    app_id: int,
    app_update: AppUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Update app"""
    app_service = AppService(db)
    app = app_service.get(app_id)
    
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )
    
    # Check if user owns the app
    if app.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this app"
        )
    
    updated_app = app_service.update(app_id, app_update)
    return updated_app


@router.delete("/{app_id}")
def delete_app(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Delete app"""
    app_service = AppService(db)
    app = app_service.get(app_id)
    
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )
    
    # Check if user owns the app
    if app.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this app"
        )
    
    app_service.delete(app_id)
    return {"message": "App deleted successfully"}


@router.post("/{app_id}/publish")
def publish_app(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Publish app"""
    app_service = AppService(db)
    app = app_service.get(app_id)
    
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )
    
    # Check if user owns the app
    if app.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to publish this app"
        )
    
    published_app = app_service.publish(app_id)
    return {"message": "App published successfully", "app": published_app}


@router.post("/{app_id}/unpublish")
def unpublish_app(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Unpublish app"""
    app_service = AppService(db)
    app = app_service.get(app_id)
    
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )
    
    # Check if user owns the app
    if app.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to unpublish this app"
        )
    
    unpublished_app = app_service.unpublish(app_id)
    return {"message": "App unpublished successfully", "app": unpublished_app}
