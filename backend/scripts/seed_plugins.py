#!/usr/bin/env python3
"""
Script to seed the plugin marketplace with sample data
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.plugin import PluginCategory, Plugin
from app.models.user import User
import json

def create_sample_categories(db: Session):
    """Create sample plugin categories"""
    categories_data = [
        {
            "name": "UI Components",
            "description": "Custom UI components and widgets",
            "icon": "widgets"
        },
        {
            "name": "Data Visualization",
            "description": "Charts, graphs, and data display components",
            "icon": "bar_chart"
        },
        {
            "name": "Forms & Inputs",
            "description": "Form components and input widgets",
            "icon": "dynamic_form"
        },
        {
            "name": "Navigation",
            "description": "Navigation components and menus",
            "icon": "navigation"
        },
        {
            "name": "Media",
            "description": "Image, video, and media components",
            "icon": "perm_media"
        },
        {
            "name": "Business",
            "description": "Business and productivity components",
            "icon": "business"
        },
        {
            "name": "Social",
            "description": "Social media and communication components",
            "icon": "share"
        },
        {
            "name": "E-commerce",
            "description": "Shopping and e-commerce components",
            "icon": "shopping_cart"
        }
    ]
    
    categories = []
    for cat_data in categories_data:
        # Check if category already exists
        existing = db.query(PluginCategory).filter(PluginCategory.name == cat_data["name"]).first()
        if not existing:
            category = PluginCategory(**cat_data)
            db.add(category)
            categories.append(category)
        else:
            categories.append(existing)
    
    db.commit()
    return categories

def create_sample_plugins(db: Session, categories: list, author_id: int):
    """Create sample plugins"""
    
    # Get category IDs by name
    category_map = {cat.name: cat.id for cat in categories}
    
    plugins_data = [
        {
            "name": "Advanced Data Table",
            "slug": "advanced-data-table",
            "description": "A powerful data table with sorting, filtering, pagination, and export capabilities",
            "long_description": "This plugin provides a comprehensive data table component with advanced features including column sorting, filtering, pagination, row selection, and data export to CSV/Excel formats. Perfect for displaying large datasets in your applications.",
            "version": "1.2.0",
            "plugin_type": "component",
            "category_id": category_map["Data Visualization"],
            "config_schema": {
                "type": "object",
                "properties": {
                    "pageSize": {
                        "type": "number",
                        "title": "Page Size",
                        "description": "Number of rows per page",
                        "default": 10
                    },
                    "enableSorting": {
                        "type": "boolean",
                        "title": "Enable Sorting",
                        "description": "Allow column sorting",
                        "default": True
                    },
                    "enableFiltering": {
                        "type": "boolean",
                        "title": "Enable Filtering",
                        "description": "Allow column filtering",
                        "default": True
                    },
                    "enableExport": {
                        "type": "boolean",
                        "title": "Enable Export",
                        "description": "Allow data export",
                        "default": True
                    }
                }
            },
            "default_config": {
                "pageSize": 10,
                "enableSorting": True,
                "enableFiltering": True,
                "enableExport": True
            },
            "is_free": False,
            "price": 29.99,
            "is_featured": True,
            "is_verified": True,
            "download_count": 1250,
            "rating": 4.8,
            "review_count": 89
        },
        {
            "name": "Interactive Charts",
            "slug": "interactive-charts",
            "description": "Beautiful, interactive charts and graphs for data visualization",
            "long_description": "Create stunning charts and graphs with this comprehensive charting library. Supports line charts, bar charts, pie charts, scatter plots, and more with interactive features like zoom, pan, and tooltips.",
            "version": "2.1.0",
            "plugin_type": "component",
            "category_id": category_map["Data Visualization"],
            "config_schema": {
                "type": "object",
                "properties": {
                    "chartType": {
                        "type": "string",
                        "title": "Chart Type",
                        "description": "Default chart type",
                        "enum": ["line", "bar", "pie", "scatter", "area"],
                        "default": "line"
                    },
                    "animation": {
                        "type": "boolean",
                        "title": "Enable Animation",
                        "description": "Enable chart animations",
                        "default": True
                    },
                    "responsive": {
                        "type": "boolean",
                        "title": "Responsive",
                        "description": "Make charts responsive",
                        "default": True
                    }
                }
            },
            "default_config": {
                "chartType": "line",
                "animation": True,
                "responsive": True
            },
            "is_free": True,
            "is_featured": True,
            "is_verified": True,
            "download_count": 3200,
            "rating": 4.9,
            "review_count": 156
        },
        {
            "name": "Contact Form Builder",
            "slug": "contact-form-builder",
            "description": "Drag-and-drop contact form builder with validation and email integration",
            "long_description": "Build professional contact forms with ease. Includes field validation, email notifications, spam protection, and integration with popular email services. Perfect for lead generation and customer inquiries.",
            "version": "1.5.0",
            "plugin_type": "component",
            "category_id": category_map["Forms & Inputs"],
            "config_schema": {
                "type": "object",
                "properties": {
                    "emailNotification": {
                        "type": "boolean",
                        "title": "Email Notifications",
                        "description": "Send email notifications",
                        "default": True
                    },
                    "spamProtection": {
                        "type": "boolean",
                        "title": "Spam Protection",
                        "description": "Enable spam protection",
                        "default": True
                    },
                    "autoResponse": {
                        "type": "boolean",
                        "title": "Auto Response",
                        "description": "Send auto-response to users",
                        "default": False
                    }
                }
            },
            "default_config": {
                "emailNotification": True,
                "spamProtection": True,
                "autoResponse": False
            },
            "is_free": True,
            "is_featured": False,
            "is_verified": True,
            "download_count": 2100,
            "rating": 4.6,
            "review_count": 78
        },
        {
            "name": "Image Gallery",
            "slug": "image-gallery",
            "description": "Responsive image gallery with lightbox and lazy loading",
            "long_description": "Display images in a beautiful, responsive gallery with lightbox functionality, lazy loading, and multiple layout options. Perfect for portfolios, product showcases, and photo galleries.",
            "version": "1.3.0",
            "plugin_type": "component",
            "category_id": category_map["Media"],
            "config_schema": {
                "type": "object",
                "properties": {
                    "layout": {
                        "type": "string",
                        "title": "Layout",
                        "description": "Gallery layout",
                        "enum": ["grid", "masonry", "carousel"],
                        "default": "grid"
                    },
                    "lightbox": {
                        "type": "boolean",
                        "title": "Lightbox",
                        "description": "Enable lightbox view",
                        "default": True
                    },
                    "lazyLoading": {
                        "type": "boolean",
                        "title": "Lazy Loading",
                        "description": "Enable lazy loading",
                        "default": True
                    }
                }
            },
            "default_config": {
                "layout": "grid",
                "lightbox": True,
                "lazyLoading": True
            },
            "is_free": True,
            "is_featured": False,
            "is_verified": True,
            "download_count": 1800,
            "rating": 4.7,
            "review_count": 92
        },
        {
            "name": "Social Media Feed",
            "slug": "social-media-feed",
            "description": "Display social media posts from multiple platforms",
            "long_description": "Integrate social media content from Twitter, Instagram, Facebook, and LinkedIn. Display posts in a unified feed with customizable styling and real-time updates.",
            "version": "2.0.0",
            "plugin_type": "integration",
            "category_id": category_map["Social"],
            "config_schema": {
                "type": "object",
                "properties": {
                    "platforms": {
                        "type": "array",
                        "title": "Platforms",
                        "description": "Social media platforms to include",
                        "items": {
                            "type": "string",
                            "enum": ["twitter", "instagram", "facebook", "linkedin"]
                        },
                        "default": ["twitter", "instagram"]
                    },
                    "postLimit": {
                        "type": "number",
                        "title": "Post Limit",
                        "description": "Maximum number of posts to display",
                        "default": 10
                    },
                    "autoRefresh": {
                        "type": "boolean",
                        "title": "Auto Refresh",
                        "description": "Automatically refresh feed",
                        "default": True
                    }
                }
            },
            "default_config": {
                "platforms": ["twitter", "instagram"],
                "postLimit": 10,
                "autoRefresh": True
            },
            "is_free": False,
            "price": 49.99,
            "is_featured": True,
            "is_verified": True,
            "download_count": 890,
            "rating": 4.5,
            "review_count": 45
        },
        {
            "name": "E-commerce Product Grid",
            "slug": "ecommerce-product-grid",
            "description": "Product grid component for e-commerce applications",
            "long_description": "Display products in a responsive grid with filtering, sorting, and quick view functionality. Includes shopping cart integration and wishlist features.",
            "version": "1.4.0",
            "plugin_type": "component",
            "category_id": category_map["E-commerce"],
            "config_schema": {
                "type": "object",
                "properties": {
                    "itemsPerRow": {
                        "type": "number",
                        "title": "Items Per Row",
                        "description": "Number of items per row",
                        "default": 4
                    },
                    "showFilters": {
                        "type": "boolean",
                        "title": "Show Filters",
                        "description": "Display filter options",
                        "default": True
                    },
                    "quickView": {
                        "type": "boolean",
                        "title": "Quick View",
                        "description": "Enable quick view modal",
                        "default": True
                    }
                }
            },
            "default_config": {
                "itemsPerRow": 4,
                "showFilters": True,
                "quickView": True
            },
            "is_free": False,
            "price": 39.99,
            "is_featured": False,
            "is_verified": True,
            "download_count": 650,
            "rating": 4.4,
            "review_count": 32
        },
        {
            "name": "Calendar Widget",
            "slug": "calendar-widget",
            "description": "Interactive calendar component with event management",
            "long_description": "A full-featured calendar component with event creation, editing, and management. Supports multiple views (month, week, day) and integrates with popular calendar services.",
            "version": "1.8.0",
            "plugin_type": "component",
            "category_id": category_map["UI Components"],
            "config_schema": {
                "type": "object",
                "properties": {
                    "defaultView": {
                        "type": "string",
                        "title": "Default View",
                        "description": "Default calendar view",
                        "enum": ["month", "week", "day"],
                        "default": "month"
                    },
                    "allowEventCreation": {
                        "type": "boolean",
                        "title": "Allow Event Creation",
                        "description": "Allow users to create events",
                        "default": True
                    },
                    "showWeekends": {
                        "type": "boolean",
                        "title": "Show Weekends",
                        "description": "Display weekends",
                        "default": True
                    }
                }
            },
            "default_config": {
                "defaultView": "month",
                "allowEventCreation": True,
                "showWeekends": True
            },
            "is_free": True,
            "is_featured": False,
            "is_verified": True,
            "download_count": 1400,
            "rating": 4.3,
            "review_count": 67
        },
        {
            "name": "Dark Theme Pack",
            "slug": "dark-theme-pack",
            "description": "Complete dark theme for your applications",
            "long_description": "Transform your application with this comprehensive dark theme. Includes custom color schemes, typography, and component styling for a modern, professional look.",
            "version": "1.0.0",
            "plugin_type": "theme",
            "category_id": category_map["UI Components"],
            "config_schema": {
                "type": "object",
                "properties": {
                    "accentColor": {
                        "type": "string",
                        "title": "Accent Color",
                        "description": "Primary accent color",
                        "default": "#2196F3"
                    },
                    "fontFamily": {
                        "type": "string",
                        "title": "Font Family",
                        "description": "Font family for the theme",
                        "default": "Inter"
                    }
                }
            },
            "default_config": {
                "accentColor": "#2196F3",
                "fontFamily": "Inter"
            },
            "is_free": True,
            "is_featured": True,
            "is_verified": True,
            "download_count": 2800,
            "rating": 4.7,
            "review_count": 124
        }
    ]
    
    plugins = []
    for plugin_data in plugins_data:
        # Check if plugin already exists
        existing = db.query(Plugin).filter(Plugin.slug == plugin_data["slug"]).first()
        if not existing:
            plugin_data["author_id"] = author_id
            plugin = Plugin(**plugin_data)
            db.add(plugin)
            plugins.append(plugin)
        else:
            plugins.append(existing)
    
    db.commit()
    return plugins

def main():
    """Main function to seed the database"""
    print("🌱 Seeding plugin marketplace...")
    
    # Get database session
    db = next(get_db())
    
    try:
        # Get the first user as the author (or create a default one)
        author = db.query(User).first()
        if not author:
            print("❌ No users found. Please create a user first.")
            return
        
        print(f"👤 Using author: {author.email}")
        
        # Create categories
        print("📁 Creating plugin categories...")
        categories = create_sample_categories(db)
        print(f"✅ Created {len(categories)} categories")
        
        # Create plugins
        print("🔌 Creating sample plugins...")
        plugins = create_sample_plugins(db, categories, author.id)
        print(f"✅ Created {len(plugins)} plugins")
        
        print("🎉 Plugin marketplace seeded successfully!")
        print("\n📊 Summary:")
        print(f"   - Categories: {len(categories)}")
        print(f"   - Plugins: {len(plugins)}")
        print(f"   - Free plugins: {len([p for p in plugins if p.is_free])}")
        print(f"   - Paid plugins: {len([p for p in plugins if not p.is_free])}")
        print(f"   - Featured plugins: {len([p for p in plugins if p.is_featured])}")
        
    except Exception as e:
        print(f"❌ Error seeding database: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()

