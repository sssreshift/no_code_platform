from typing import Optional, List
from sqlalchemy.orm import Session
from collections import Counter

from app.models.component import Component as ComponentModel, ComponentType
from app.schemas import ComponentCreate, ComponentUpdate
from app.services.base import BaseService


class ComponentService(BaseService[ComponentModel, ComponentCreate, ComponentUpdate]):
    def __init__(self, db: Session):
        super().__init__(ComponentModel, db)

    def get_by_app(self, app_id: int) -> List[ComponentModel]:
        """Get all components for an app"""
        return (
            self.db.query(ComponentModel)
            .filter(ComponentModel.app_id == app_id)
            .order_by(ComponentModel.created_at)
            .all()
        )

    def get_by_type(self, app_id: int, component_type: ComponentType) -> List[ComponentModel]:
        """Get components by type for an app"""
        return (
            self.db.query(ComponentModel)
            .filter(
                ComponentModel.app_id == app_id,
                ComponentModel.component_type == component_type
            )
            .all()
        )

    def create(self, obj_in: ComponentCreate) -> ComponentModel:
        """Create new component with default properties"""
        component_data = obj_in.dict()
        
        # Set default properties based on component type
        if not component_data.get("props"):
            component_data["props"] = self._get_default_props(obj_in.component_type)
        
        # Set default styles
        if not component_data.get("styles"):
            component_data["styles"] = self._get_default_styles(obj_in.component_type)
        
        db_component = ComponentModel(**component_data)
        self.db.add(db_component)
        self.db.commit()
        self.db.refresh(db_component)
        return db_component

    def duplicate_component(self, component_id: int, new_name: str, app_id: Optional[int] = None) -> Optional[ComponentModel]:
        """Duplicate a component"""
        original = self.get(component_id)
        if not original:
            return None
        
        component_data = {
            "name": new_name,
            "component_type": original.component_type,
            "props": original.props.copy() if original.props else {},
            "styles": original.styles.copy() if original.styles else {},
            "data_binding": original.data_binding.copy() if original.data_binding else {},
            "events": original.events.copy() if original.events else {},
            "app_id": app_id or original.app_id
        }
        
        new_component = ComponentModel(**component_data)
        self.db.add(new_component)
        self.db.commit()
        self.db.refresh(new_component)
        return new_component

    def update_props(self, component_id: int, props: dict) -> Optional[ComponentModel]:
        """Update component properties"""
        component = self.get(component_id)
        if component:
            component.props = props
            self.db.commit()
            self.db.refresh(component)
        return component

    def update_styles(self, component_id: int, styles: dict) -> Optional[ComponentModel]:
        """Update component styles"""
        component = self.get(component_id)
        if component:
            component.styles = styles
            self.db.commit()
            self.db.refresh(component)
        return component

    def update_data_binding(self, component_id: int, data_binding: dict) -> Optional[ComponentModel]:
        """Update component data binding"""
        component = self.get(component_id)
        if component:
            component.data_binding = data_binding
            self.db.commit()
            self.db.refresh(component)
        return component

    def get_app_component_stats(self, app_id: int) -> dict:
        """Get component statistics for an app"""
        components = self.get_by_app(app_id)
        component_types = [c.component_type.value for c in components]
        type_counts = Counter(component_types)
        
        return {
            "total_components": len(components),
            "component_types": dict(type_counts),
            "has_data_binding": sum(1 for c in components if c.data_binding),
            "has_events": sum(1 for c in components if c.events),
        }

    def _get_default_props(self, component_type: ComponentType) -> dict:
        """Get default properties for component type"""
        defaults = {
            ComponentType.BUTTON: {
                "text": "Button",
                "variant": "primary",
                "size": "medium",
                "disabled": False
            },
            ComponentType.TEXT: {
                "content": "Text content",
                "variant": "body1",
                "color": "text.primary"
            },
            ComponentType.INPUT: {
                "placeholder": "Enter text...",
                "type": "text",
                "required": False,
                "disabled": False
            },
            ComponentType.TABLE: {
                "columns": [],
                "rows": [],
                "pagination": True,
                "sortable": True
            },
            ComponentType.CHART: {
                "type": "bar",
                "data": {},
                "options": {}
            },
            ComponentType.FORM: {
                "fields": [],
                "submitText": "Submit",
                "resetText": "Reset"
            },
            ComponentType.IMAGE: {
                "src": "",
                "alt": "Image",
                "width": "auto",
                "height": "auto"
            },
            ComponentType.CONTAINER: {
                "padding": "16px",
                "margin": "0px",
                "backgroundColor": "transparent"
            },
            ComponentType.TAB: {
                "tabs": [
                    {"label": "Tab 1", "content": "Content 1"},
                    {"label": "Tab 2", "content": "Content 2"}
                ]
            },
            ComponentType.MODAL: {
                "title": "Modal",
                "content": "Modal content",
                "size": "medium"
            },
            ComponentType.LIST: {
                "items": [],
                "variant": "bullet"
            },
            ComponentType.SELECT: {
                "options": [],
                "placeholder": "Select option...",
                "multiple": False
            },
            ComponentType.CHECKBOX: {
                "label": "Checkbox",
                "checked": False,
                "disabled": False
            },
            ComponentType.RADIO: {
                "options": [],
                "value": "",
                "disabled": False
            },
            ComponentType.TEXTAREA: {
                "placeholder": "Enter text...",
                "rows": 4,
                "disabled": False
            }
        }
        return defaults.get(component_type, {})

    def _get_default_styles(self, component_type: ComponentType) -> dict:
        """Get default styles for component type"""
        return {
            "width": "auto",
            "height": "auto",
            "margin": "4px",
            "padding": "8px",
        }
