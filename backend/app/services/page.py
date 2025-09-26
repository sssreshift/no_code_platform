from sqlalchemy.orm import Session
from sqlalchemy import and_
from typing import List, Optional
import json
from app.models.page import Page
from app.schemas.page import PageCreate, PageUpdate
from app.services.base import BaseService


class PageService(BaseService[Page, PageCreate, PageUpdate]):
    def __init__(self, db: Session):
        super().__init__(Page, db)
    
    def create_page(self, page_data: PageCreate) -> Page:
        """Create a new page with JSON page definition"""
        # Convert page_definition to JSON string for storage
        page_dict = page_data.dict()
        page_dict['page_definition'] = json.dumps(page_data.page_definition)
        
        page = Page(**page_dict)
        self.db.add(page)
        self.db.commit()
        self.db.refresh(page)
        
        # Convert back to dict for response
        page_dict = {
            'id': page.id,
            'name': page.name,
            'app_id': page.app_id,
            'page_definition': json.loads(page.page_definition),
            'created_at': page.created_at,
            'updated_at': page.updated_at
        }
        
        return page_dict
    
    def get_page_by_app_id(self, app_id: int) -> Optional[dict]:
        """Get page by app_id (assuming one page per app for now)"""
        page = self.db.query(Page).filter(Page.app_id == app_id).first()
        
        if not page:
            return None
        
        return {
            'id': page.id,
            'name': page.name,
            'app_id': page.app_id,
            'page_definition': json.loads(page.page_definition),
            'created_at': page.created_at,
            'updated_at': page.updated_at
        }
    
    def update_page_by_app_id(self, app_id: int, page_data: PageUpdate) -> Optional[dict]:
        """Update page by app_id"""
        page = self.db.query(Page).filter(Page.app_id == app_id).first()
        
        if not page:
            return None
        
        # Update fields
        if page_data.name is not None:
            page.name = page_data.name
        
        if page_data.page_definition is not None:
            page.page_definition = json.dumps(page_data.page_definition)
        
        self.db.commit()
        self.db.refresh(page)
        
        return {
            'id': page.id,
            'name': page.name,
            'app_id': page.app_id,
            'page_definition': json.loads(page.page_definition),
            'created_at': page.created_at,
            'updated_at': page.updated_at
        }
    
    def delete_page_by_app_id(self, app_id: int) -> bool:
        """Delete page by app_id"""
        page = self.db.query(Page).filter(Page.app_id == app_id).first()
        
        if not page:
            return False
        
        self.db.delete(page)
        self.db.commit()
        return True
