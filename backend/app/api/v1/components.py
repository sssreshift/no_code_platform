from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any

from app.core.database import get_db
from app.schemas import User, Component, ComponentCreate, ComponentUpdate
from app.services.auth import AuthService
from app.services.component import ComponentService
from app.services.app import AppService
from app.models.user import UserRole

router = APIRouter()


@router.get("/app/{app_id}", response_model=List[Component])
def get_app_components(
    app_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Get all components for an app"""
    app_service = AppService(db)
    app = app_service.get(app_id)
    
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )
    
    # Check if user owns the app or app is published
    if app.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        if not app.is_published:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to access this app"
            )
    
    component_service = ComponentService(db)
    components = component_service.get_by_app(app_id)
    return components


@router.post("/", response_model=Component)
def create_component(
    component_data: ComponentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Create new component"""
    app_service = AppService(db)
    app = app_service.get(component_data.app_id)
    
    if not app:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="App not found"
        )
    
    # Check if user owns the app
    if app.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to modify this app"
        )
    
    component_service = ComponentService(db)
    component = component_service.create(component_data)
    return component


@router.get("/{component_id}", response_model=Component)
def get_component(
    component_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Get component by ID"""
    component_service = ComponentService(db)
    component = component_service.get(component_id)
    
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Component not found"
        )
    
    # Check if user owns the app
    app_service = AppService(db)
    app = app_service.get(component.app_id)
    
    if app.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        if not app.is_published:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not enough permissions to access this component"
            )
    
    return component


@router.put("/{component_id}", response_model=Component)
def update_component(
    component_id: int,
    component_update: ComponentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Update component"""
    component_service = ComponentService(db)
    component = component_service.get(component_id)
    
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Component not found"
        )
    
    # Check if user owns the app
    app_service = AppService(db)
    app = app_service.get(component.app_id)
    
    if app.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to modify this component"
        )
    
    updated_component = component_service.update(component_id, component_update)
    return updated_component


@router.delete("/{component_id}")
def delete_component(
    component_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Delete component"""
    component_service = ComponentService(db)
    component = component_service.get(component_id)
    
    if not component:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Component not found"
        )
    
    # Check if user owns the app
    app_service = AppService(db)
    app = app_service.get(component.app_id)
    
    if app.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to modify this component"
        )
    
    component_service.delete(component_id)
    return {"message": "Component deleted successfully"}
