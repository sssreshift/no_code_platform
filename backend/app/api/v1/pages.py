from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Any, Optional
import json

from app.core.database import get_db
from app.models.app import App
from app.schemas.page import PageCreate, PageUpdate, PageResponse
from app.services.page import PageService
from app.services.auth import AuthService
from app.models.user import User

router = APIRouter()



@router.post("", response_model=dict)
def create_page(
    page_data: PageCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Create new page"""
    try:
        print(f"Creating page for app_id: {page_data.app_id}, user_id: {current_user.id}")
        print(f"Page data: {page_data.dict()}")
        
        # Verify app ownership
        app = db.query(App).filter(
            App.id == page_data.app_id,
            App.owner_id == current_user.id
        ).first()
        
        if not app:
            raise HTTPException(
                status_code=404,
                detail="App not found or you don't have permission to access it"
            )
        
        page_service = PageService(db)
        
        # Check if page already exists for this app
        existing_page = page_service.get_page_by_app_id(page_data.app_id)
        if existing_page:
            # Update existing page instead of creating new one
            update_data = PageUpdate(
                name=page_data.name,
                page_definition=page_data.page_definition
            )
            updated_page = page_service.update_page_by_app_id(page_data.app_id, update_data)
            if updated_page:
                return updated_page
            else:
                raise HTTPException(status_code=500, detail="Failed to update page")
        
        # Create new page
        page = page_service.create_page(page_data)
        return page
        
    except Exception as e:
        print(f"Error creating page: {str(e)}")
        print(f"Error type: {type(e)}")
        raise HTTPException(
            status_code=422,
            detail=f"Failed to create page: {str(e)}"
        )



@router.get("", response_model=dict)
def get_page(
    app_id: int = Query(..., description="App ID to get page for"),
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Get page by app_id"""
    # Verify app ownership
    app = db.query(App).filter(
        App.id == app_id,
        App.owner_id == current_user.id
    ).first()
    
    if not app:
        raise HTTPException(
            status_code=404,
            detail="App not found or you don't have permission to access it"
        )
    
    page_service = PageService(db)
    page = page_service.get_page_by_app_id(app_id)
    
    if not page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    return page


@router.put("", response_model=dict)
def update_page(
    app_id: int = Query(..., description="App ID to update page for"),
    page_data: PageUpdate = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Update page by app_id"""
    # Verify app ownership
    app = db.query(App).filter(
        App.id == app_id,
        App.owner_id == current_user.id
    ).first()
    
    if not app:
        raise HTTPException(
            status_code=404,
            detail="App not found or you don't have permission to access it"
        )
    
    page_service = PageService(db)
    updated_page = page_service.update_page_by_app_id(app_id, page_data)
    
    if not updated_page:
        raise HTTPException(status_code=404, detail="Page not found")
    
    return updated_page



@router.delete("")
def delete_page(
    app_id: int = Query(..., description="App ID to delete page for"),
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Delete page by app_id"""
    # Verify app ownership
    app = db.query(App).filter(
        App.id == app_id,
        App.owner_id == current_user.id
    ).first()
    
    if not app:
        raise HTTPException(
            status_code=404,
            detail="App not found or you don't have permission to access it"
        )
    
    page_service = PageService(db)
    success = page_service.delete_page_by_app_id(app_id)
    
    if not success:
        raise HTTPException(status_code=404, detail="Page not found")
    
    return {"message": "Page deleted successfully"}
