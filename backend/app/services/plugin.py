from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import and_, or_, desc, asc, func

from app.models.plugin import Plugin, PluginCategory, PluginInstallation, PluginReview
from app.schemas.plugin import (
    PluginCreate, PluginUpdate, PluginCategoryCreate, PluginCategoryUpdate,
    PluginInstallationCreate, PluginInstallationUpdate, PluginReviewCreate,
    PluginReviewUpdate, PluginSearchFilters, PluginStats, PluginType
)
from app.services.base import BaseService


class PluginService(BaseService[Plugin, PluginCreate, PluginUpdate]):
    def __init__(self, db: Session):
        super().__init__(Plugin, db)

    def get_categories(self) -> List[PluginCategory]:
        """Get all plugin categories"""
        return self.db.query(PluginCategory).all()

    def create_category(self, category_data: PluginCategoryCreate) -> PluginCategory:
        """Create a new plugin category"""
        db_category = PluginCategory(**category_data.dict())
        self.db.add(db_category)
        self.db.commit()
        self.db.refresh(db_category)
        return db_category

    def search_plugins(self, filters: PluginSearchFilters, skip: int = 0, limit: int = 100) -> List[Plugin]:
        """Search plugins with filters"""
        query = self.db.query(Plugin).options(
            joinedload(Plugin.category),
            joinedload(Plugin.author)
        ).filter(Plugin.is_active == True)

        # Apply filters
        if filters.category_id:
            query = query.filter(Plugin.category_id == filters.category_id)
        
        if filters.plugin_type:
            query = query.filter(Plugin.plugin_type == filters.plugin_type)
        
        if filters.is_free is not None:
            query = query.filter(Plugin.is_free == filters.is_free)
        
        if filters.is_featured is not None:
            query = query.filter(Plugin.is_featured == filters.is_featured)
        
        if filters.min_rating:
            query = query.filter(Plugin.rating >= filters.min_rating)
        
        if filters.search_query:
            search_term = f"%{filters.search_query}%"
            query = query.filter(
                or_(
                    Plugin.name.ilike(search_term),
                    Plugin.description.ilike(search_term),
                    Plugin.long_description.ilike(search_term)
                )
            )

        # Apply sorting
        if filters.sort_by == "rating":
            sort_column = Plugin.rating
        elif filters.sort_by == "created_at":
            sort_column = Plugin.created_at
        elif filters.sort_by == "name":
            sort_column = Plugin.name
        else:  # download_count
            sort_column = Plugin.download_count

        if filters.sort_order == "asc":
            query = query.order_by(asc(sort_column))
        else:
            query = query.order_by(desc(sort_column))

        return query.offset(skip).limit(limit).all()

    def get_featured_plugins(self, limit: int = 10) -> List[Plugin]:
        """Get featured plugins"""
        return (
            self.db.query(Plugin)
            .options(
                joinedload(Plugin.category),
                joinedload(Plugin.author)
            )
            .filter(Plugin.is_active == True, Plugin.is_featured == True)
            .order_by(desc(Plugin.download_count))
            .limit(limit)
            .all()
        )

    def get_plugin_with_details(self, plugin_id: int) -> Optional[Plugin]:
        """Get plugin with category and author details"""
        return (
            self.db.query(Plugin)
            .options(
                joinedload(Plugin.category),
                joinedload(Plugin.author)
            )
            .filter(Plugin.id == plugin_id, Plugin.is_active == True)
            .first()
        )

    def create_plugin(self, plugin_data: PluginCreate, author_id: int) -> Plugin:
        """Create a new plugin"""
        plugin_dict = plugin_data.dict()
        plugin_dict["author_id"] = author_id
        
        db_plugin = Plugin(**plugin_dict)
        self.db.add(db_plugin)
        self.db.commit()
        self.db.refresh(db_plugin)
        return db_plugin

    def update_plugin(self, plugin_id: int, plugin_update: PluginUpdate) -> Optional[Plugin]:
        """Update a plugin"""
        db_plugin = self.get(plugin_id)
        if db_plugin:
            update_data = plugin_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_plugin, field, value)
            
            self.db.commit()
            self.db.refresh(db_plugin)
        return db_plugin

    def get_plugin_installations(self, plugin_id: int) -> List[PluginInstallation]:
        """Get all installations for a plugin"""
        return (
            self.db.query(PluginInstallation)
            .options(
                joinedload(PluginInstallation.app),
                joinedload(PluginInstallation.user)
            )
            .filter(PluginInstallation.plugin_id == plugin_id)
            .all()
        )

    def install_plugin(self, plugin_id: int, installation_data: PluginInstallationCreate, user_id: int) -> PluginInstallation:
        """Install a plugin to an app"""
        # Check if plugin exists and is active
        plugin = self.get(plugin_id)
        if not plugin or not plugin.is_active:
            raise ValueError("Plugin not found or not active")

        # Check if already installed
        existing = self.db.query(PluginInstallation).filter(
            and_(
                PluginInstallation.plugin_id == plugin_id,
                PluginInstallation.app_id == installation_data.app_id
            )
        ).first()

        if existing:
            raise ValueError("Plugin already installed in this app")

        # Create installation
        installation_dict = installation_data.dict()
        installation_dict["user_id"] = user_id
        
        db_installation = PluginInstallation(**installation_dict)
        self.db.add(db_installation)
        
        # Update download count
        plugin.download_count += 1
        
        self.db.commit()
        self.db.refresh(db_installation)
        return db_installation

    def update_installation(self, installation_id: int, installation_update: PluginInstallationUpdate, user_id: int) -> Optional[PluginInstallation]:
        """Update plugin installation"""
        db_installation = self.db.query(PluginInstallation).filter(
            PluginInstallation.id == installation_id,
            PluginInstallation.user_id == user_id
        ).first()

        if db_installation:
            update_data = installation_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_installation, field, value)
            
            self.db.commit()
            self.db.refresh(db_installation)
        return db_installation

    def uninstall_plugin(self, installation_id: int, user_id: int) -> bool:
        """Uninstall a plugin from an app"""
        db_installation = self.db.query(PluginInstallation).filter(
            PluginInstallation.id == installation_id,
            PluginInstallation.user_id == user_id
        ).first()

        if db_installation:
            self.db.delete(db_installation)
            self.db.commit()
            return True
        return False

    def get_plugin_reviews(self, plugin_id: int, skip: int = 0, limit: int = 20) -> List[PluginReview]:
        """Get reviews for a plugin"""
        return (
            self.db.query(PluginReview)
            .options(joinedload(PluginReview.user))
            .filter(PluginReview.plugin_id == plugin_id)
            .order_by(desc(PluginReview.created_at))
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_review(self, plugin_id: int, review_data: PluginReviewCreate, user_id: int) -> PluginReview:
        """Create a review for a plugin"""
        # Check if user already reviewed this plugin
        existing = self.db.query(PluginReview).filter(
            and_(
                PluginReview.plugin_id == plugin_id,
                PluginReview.user_id == user_id
            )
        ).first()

        if existing:
            raise ValueError("You have already reviewed this plugin")

        # Create review
        review_dict = review_data.dict()
        review_dict["user_id"] = user_id
        
        db_review = PluginReview(**review_dict)
        self.db.add(db_review)
        
        # Update plugin rating
        self._update_plugin_rating(plugin_id)
        
        self.db.commit()
        self.db.refresh(db_review)
        return db_review

    def update_review(self, review_id: int, review_update: PluginReviewUpdate, user_id: int) -> Optional[PluginReview]:
        """Update a plugin review"""
        db_review = self.db.query(PluginReview).filter(
            PluginReview.id == review_id,
            PluginReview.user_id == user_id
        ).first()

        if db_review:
            update_data = review_update.dict(exclude_unset=True)
            for field, value in update_data.items():
                setattr(db_review, field, value)
            
            # Update plugin rating
            self._update_plugin_rating(db_review.plugin_id)
            
            self.db.commit()
            self.db.refresh(db_review)
        return db_review

    def delete_review(self, review_id: int, user_id: int) -> bool:
        """Delete a plugin review"""
        db_review = self.db.query(PluginReview).filter(
            PluginReview.id == review_id,
            PluginReview.user_id == user_id
        ).first()

        if db_review:
            plugin_id = db_review.plugin_id
            self.db.delete(db_review)
            
            # Update plugin rating
            self._update_plugin_rating(plugin_id)
            
            self.db.commit()
            return True
        return False

    def _update_plugin_rating(self, plugin_id: int):
        """Update plugin rating based on reviews"""
        reviews = self.db.query(PluginReview).filter(PluginReview.plugin_id == plugin_id).all()
        
        if reviews:
            avg_rating = sum(review.rating for review in reviews) / len(reviews)
            review_count = len(reviews)
        else:
            avg_rating = 0.0
            review_count = 0

        plugin = self.get(plugin_id)
        if plugin:
            plugin.rating = round(avg_rating, 2)
            plugin.review_count = review_count

    def get_stats(self) -> PluginStats:
        """Get plugin marketplace statistics"""
        total_plugins = self.db.query(Plugin).filter(Plugin.is_active == True).count()
        total_categories = self.db.query(PluginCategory).count()
        total_installations = self.db.query(PluginInstallation).count()
        featured_plugins = self.db.query(Plugin).filter(
            Plugin.is_active == True, 
            Plugin.is_featured == True
        ).count()
        free_plugins = self.db.query(Plugin).filter(
            Plugin.is_active == True, 
            Plugin.is_free == True
        ).count()
        paid_plugins = total_plugins - free_plugins

        return PluginStats(
            total_plugins=total_plugins,
            total_categories=total_categories,
            total_installations=total_installations,
            featured_plugins=featured_plugins,
            free_plugins=free_plugins,
            paid_plugins=paid_plugins
        )




