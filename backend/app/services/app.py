from typing import Optional, List
from sqlalchemy.orm import Session, joinedload

from app.models.app import App as AppModel
from app.schemas import AppCreate, AppUpdate
from app.services.base import BaseService


class AppService(BaseService[AppModel, AppCreate, AppUpdate]):
    def __init__(self, db: Session):
        super().__init__(AppModel, db)

    def get_by_slug(self, slug: str) -> Optional[AppModel]:
        """Get app by slug"""
        return self.db.query(AppModel).filter(AppModel.slug == slug).first()

    def get_by_slug_with_content(self, slug: str) -> Optional[AppModel]:
        """Get app by slug with all related content (components, pages, layouts)"""
        return (
            self.db.query(AppModel)
            .options(
                joinedload(AppModel.components),
                joinedload(AppModel.pages),
                joinedload(AppModel.layouts)
            )
            .filter(AppModel.slug == slug)
            .first()
        )

    def get_by_owner(self, owner_id: int, skip: int = 0, limit: int = 100) -> List[AppModel]:
        """Get apps by owner"""
        return (
            self.db.query(AppModel)
            .filter(AppModel.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_published_apps(self, skip: int = 0, limit: int = 100) -> List[AppModel]:
        """Get all published apps"""
        return (
            self.db.query(AppModel)
            .filter(AppModel.is_published == True)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_with_components(self, app_id: int) -> Optional[AppModel]:
        """Get app with components and layouts"""
        return (
            self.db.query(AppModel)
            .options(
                joinedload(AppModel.components),
                joinedload(AppModel.layouts)
            )
            .filter(AppModel.id == app_id)
            .first()
        )

    def create(self, obj_in: AppCreate, owner_id: int) -> AppModel:
        """Create new app"""
        app_data = obj_in.dict()
        app_data["owner_id"] = owner_id
        
        # Initialize default config if not provided
        if not app_data.get("config"):
            app_data["config"] = {
                "theme": "light",
                "layout": "grid",
                "responsive": True,
                "pages": [
                    {
                        "id": "home",
                        "name": "Home",
                        "path": "/",
                        "components": []
                    }
                ]
            }
        
        db_app = AppModel(**app_data)
        self.db.add(db_app)
        self.db.commit()
        self.db.refresh(db_app)
        return db_app

    def update_config(self, app_id: int, config: dict) -> Optional[AppModel]:
        """Update app configuration"""
        db_app = self.get(app_id)
        if db_app:
            db_app.config = config
            self.db.commit()
            self.db.refresh(db_app)
        return db_app

    def publish(self, app_id: int) -> Optional[AppModel]:
        """Publish app"""
        db_app = self.get(app_id)
        if db_app:
            db_app.is_published = True
            self.db.commit()
            self.db.refresh(db_app)
        return db_app

    def unpublish(self, app_id: int) -> Optional[AppModel]:
        """Unpublish app"""
        db_app = self.get(app_id)
        if db_app:
            db_app.is_published = False
            self.db.commit()
            self.db.refresh(db_app)
        return db_app

    def duplicate_app(self, app_id: int, new_name: str, new_slug: str, owner_id: int) -> Optional[AppModel]:
        """Duplicate an existing app"""
        original_app = self.get_with_components(app_id)
        if not original_app:
            return None
        
        # Create new app data
        app_data = {
            "name": new_name,
            "slug": new_slug,
            "description": f"Copy of {original_app.name}",
            "config": original_app.config.copy() if original_app.config else None,
            "is_published": False,
            "owner_id": owner_id
        }
        
        # Create new app
        new_app = AppModel(**app_data)
        self.db.add(new_app)
        self.db.commit()
        self.db.refresh(new_app)
        
        # Copy components and layouts would be handled by respective services
        # when this method is called from a higher-level service
        
        return new_app

    def search_apps(self, query: str, owner_id: Optional[int] = None, published_only: bool = False, 
                   skip: int = 0, limit: int = 100) -> List[AppModel]:
        """Search apps by name or description"""
        search_term = f"%{query}%"
        query_builder = self.db.query(AppModel).filter(
            AppModel.name.ilike(search_term) | 
            AppModel.description.ilike(search_term)
        )
        
        if owner_id:
            query_builder = query_builder.filter(AppModel.owner_id == owner_id)
        
        if published_only:
            query_builder = query_builder.filter(AppModel.is_published == True)
        
        return query_builder.offset(skip).limit(limit).all()

    def get_app_stats(self, app_id: int) -> dict:
        """Get app statistics"""
        app = self.get_with_components(app_id)
        if not app:
            return None
        
        return {
            "total_components": len(app.components),
            "total_layouts": len(app.layouts),
            "component_types": {},  # This would be calculated from components
            "last_modified": app.updated_at,
            "is_published": app.is_published,
            "config_size": len(str(app.config)) if app.config else 0
        }
