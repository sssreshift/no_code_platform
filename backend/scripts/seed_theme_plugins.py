#!/usr/bin/env python3
"""
Script to seed theme plugins into the plugin marketplace
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.plugin import Plugin, PluginCategory
from app.models.user import User
import json

def create_theme_plugins(db: Session, author_id: int):
    """Create theme plugins"""
    
    # Get the UI Components category
    ui_category = db.query(PluginCategory).filter(PluginCategory.name == "UI Components").first()
    if not ui_category:
        print("❌ UI Components category not found")
        return []
    
    theme_plugins_data = [
        {
            "name": "DaisyUI Light Theme",
            "slug": "daisyui-light-theme",
            "description": "Clean and minimal light theme with subtle shadows using DaisyUI",
            "long_description": "A professional light theme built with DaisyUI components. Features clean typography, subtle shadows, and a modern color palette perfect for business applications and dashboards.",
            "version": "1.0.0",
            "plugin_type": "theme",
            "category_id": ui_category.id,
            "config_schema": {
                "type": "object",
                "properties": {
                    "primaryColor": {
                        "type": "string",
                        "title": "Primary Color",
                        "description": "Main brand color",
                        "default": "#3b82f6"
                    },
                    "fontFamily": {
                        "type": "string",
                        "title": "Font Family",
                        "description": "Typography font family",
                        "default": "Inter"
                    }
                }
            },
            "default_config": {
                "primaryColor": "#3b82f6",
                "fontFamily": "Inter"
            },
            "is_free": True,
            "is_featured": True,
            "is_verified": True,
            "download_count": 1500,
            "rating": 4.8,
            "review_count": 95
        },
        {
            "name": "DaisyUI Dark Theme",
            "slug": "daisyui-dark-theme",
            "description": "Modern dark theme with vibrant accents using DaisyUI",
            "long_description": "A sleek dark theme built with DaisyUI components. Features eye-friendly dark colors, vibrant accent colors, and modern design patterns perfect for night-time usage and modern applications.",
            "version": "1.0.0",
            "plugin_type": "theme",
            "category_id": ui_category.id,
            "config_schema": {
                "type": "object",
                "properties": {
                    "accentColor": {
                        "type": "string",
                        "title": "Accent Color",
                        "description": "Highlight accent color",
                        "default": "#f59e0b"
                    },
                    "contrast": {
                        "type": "string",
                        "title": "Contrast Level",
                        "description": "Dark theme contrast level",
                        "enum": ["low", "medium", "high"],
                        "default": "medium"
                    }
                }
            },
            "default_config": {
                "accentColor": "#f59e0b",
                "contrast": "medium"
            },
            "is_free": True,
            "is_featured": True,
            "is_verified": True,
            "download_count": 2200,
            "rating": 4.9,
            "review_count": 128
        },
        {
            "name": "Material Design 3 Theme",
            "slug": "material-design-3-theme",
            "description": "Google Material Design 3 theme with modern components",
            "long_description": "Complete Material Design 3 implementation with Google's latest design guidelines. Features dynamic color, improved accessibility, and modern component styling.",
            "version": "2.0.0",
            "plugin_type": "theme",
            "category_id": ui_category.id,
            "config_schema": {
                "type": "object",
                "properties": {
                    "colorScheme": {
                        "type": "string",
                        "title": "Color Scheme",
                        "description": "Material Design color scheme",
                        "enum": ["default", "dynamic", "custom"],
                        "default": "default"
                    },
                    "elevation": {
                        "type": "boolean",
                        "title": "Enable Elevation",
                        "description": "Use Material Design elevation",
                        "default": True
                    }
                }
            },
            "default_config": {
                "colorScheme": "default",
                "elevation": True
            },
            "is_free": True,
            "is_featured": False,
            "is_verified": True,
            "download_count": 1800,
            "rating": 4.7,
            "review_count": 87
        },
        {
            "name": "Tailwind UI Marketing Pro",
            "slug": "tailwind-ui-marketing-pro",
            "description": "High-converting marketing theme with modern design",
            "long_description": "Professional marketing theme built with Tailwind UI components. Optimized for conversions with modern design patterns, compelling CTAs, and responsive layouts perfect for landing pages and marketing sites.",
            "version": "1.5.0",
            "plugin_type": "theme",
            "category_id": ui_category.id,
            "config_schema": {
                "type": "object",
                "properties": {
                    "ctaStyle": {
                        "type": "string",
                        "title": "CTA Style",
                        "description": "Call-to-action button style",
                        "enum": ["primary", "secondary", "gradient"],
                        "default": "gradient"
                    },
                    "animationLevel": {
                        "type": "string",
                        "title": "Animation Level",
                        "description": "Animation intensity",
                        "enum": ["minimal", "moderate", "high"],
                        "default": "moderate"
                    }
                }
            },
            "default_config": {
                "ctaStyle": "gradient",
                "animationLevel": "moderate"
            },
            "is_free": False,
            "price": 149.99,
            "is_featured": True,
            "is_verified": True,
            "download_count": 650,
            "rating": 4.9,
            "review_count": 45
        },
        {
            "name": "Tailwind UI Dashboard Pro",
            "slug": "tailwind-ui-dashboard-pro",
            "description": "Professional dashboard theme for admin panels",
            "long_description": "Enterprise-grade dashboard theme built with Tailwind UI. Features advanced data visualization components, professional layouts, and comprehensive admin panel styling perfect for business applications.",
            "version": "2.1.0",
            "plugin_type": "theme",
            "category_id": ui_category.id,
            "config_schema": {
                "type": "object",
                "properties": {
                    "sidebarStyle": {
                        "type": "string",
                        "title": "Sidebar Style",
                        "description": "Dashboard sidebar design",
                        "enum": ["minimal", "detailed", "icon-only"],
                        "default": "detailed"
                    },
                    "dataDensity": {
                        "type": "string",
                        "title": "Data Density",
                        "description": "Information density level",
                        "enum": ["compact", "comfortable", "spacious"],
                        "default": "comfortable"
                    }
                }
            },
            "default_config": {
                "sidebarStyle": "detailed",
                "dataDensity": "comfortable"
            },
            "is_free": False,
            "price": 199.99,
            "is_featured": True,
            "is_verified": True,
            "download_count": 420,
            "rating": 4.8,
            "review_count": 32
        },
        {
            "name": "No-Code Minimal Theme",
            "slug": "no-code-minimal-theme",
            "description": "Minimalist theme perfect for no-code platforms",
            "long_description": "Ultra-clean minimal theme designed specifically for no-code platforms. Features maximum whitespace, clean typography, and distraction-free design perfect for building applications.",
            "version": "1.0.0",
            "plugin_type": "theme",
            "category_id": ui_category.id,
            "config_schema": {
                "type": "object",
                "properties": {
                    "whitespace": {
                        "type": "string",
                        "title": "Whitespace Level",
                        "description": "Amount of whitespace",
                        "enum": ["minimal", "moderate", "generous"],
                        "default": "generous"
                    },
                    "borderStyle": {
                        "type": "string",
                        "title": "Border Style",
                        "description": "Component border style",
                        "enum": ["none", "subtle", "defined"],
                        "default": "subtle"
                    }
                }
            },
            "default_config": {
                "whitespace": "generous",
                "borderStyle": "subtle"
            },
            "is_free": True,
            "is_featured": False,
            "is_verified": True,
            "download_count": 1100,
            "rating": 4.6,
            "review_count": 67
        },
        {
            "name": "Corporate Business Theme",
            "slug": "corporate-business-theme",
            "description": "Professional theme for business applications",
            "long_description": "Enterprise-ready business theme with professional styling, corporate color schemes, and business-focused components. Perfect for internal tools, dashboards, and business applications.",
            "version": "1.2.0",
            "plugin_type": "theme",
            "category_id": ui_category.id,
            "config_schema": {
                "type": "object",
                "properties": {
                    "brandColor": {
                        "type": "string",
                        "title": "Brand Color",
                        "description": "Corporate brand color",
                        "default": "#1e40af"
                    },
                    "formality": {
                        "type": "string",
                        "title": "Formality Level",
                        "description": "Design formality",
                        "enum": ["casual", "professional", "formal"],
                        "default": "professional"
                    }
                }
            },
            "default_config": {
                "brandColor": "#1e40af",
                "formality": "professional"
            },
            "is_free": True,
            "is_featured": False,
            "is_verified": True,
            "download_count": 950,
            "rating": 4.5,
            "review_count": 58
        },
        {
            "name": "Luxury Premium Theme",
            "slug": "luxury-premium-theme",
            "description": "Elegant theme with premium feel",
            "long_description": "High-end luxury theme with elegant design, premium typography, and sophisticated color schemes. Perfect for luxury brands, premium products, and high-end applications.",
            "version": "1.0.0",
            "plugin_type": "theme",
            "category_id": ui_category.id,
            "config_schema": {
                "type": "object",
                "properties": {
                    "elegance": {
                        "type": "string",
                        "title": "Elegance Level",
                        "description": "Design elegance",
                        "enum": ["subtle", "moderate", "high"],
                        "default": "moderate"
                    },
                    "typography": {
                        "type": "string",
                        "title": "Typography Style",
                        "description": "Font styling approach",
                        "enum": ["modern", "classic", "luxury"],
                        "default": "luxury"
                    }
                }
            },
            "default_config": {
                "elegance": "moderate",
                "typography": "luxury"
            },
            "is_free": False,
            "price": 99.99,
            "is_featured": True,
            "is_verified": True,
            "download_count": 280,
            "rating": 4.7,
            "review_count": 23
        }
    ]
    
    plugins = []
    for plugin_data in theme_plugins_data:
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
    """Main function to seed theme plugins"""
    print("🎨 Seeding theme plugins...")
    
    # Get database session
    db = next(get_db())
    
    try:
        # Get the first user as the author
        author = db.query(User).first()
        if not author:
            print("❌ No users found. Please create a user first.")
            return
        
        print(f"👤 Using author: {author.email}")
        
        # Create theme plugins
        print("🎨 Creating theme plugins...")
        plugins = create_theme_plugins(db, author.id)
        print(f"✅ Created {len(plugins)} theme plugins")
        
        print("🎉 Theme plugins seeded successfully!")
        print("\n📊 Summary:")
        print(f"   - Total theme plugins: {len(plugins)}")
        print(f"   - Free themes: {len([p for p in plugins if p.is_free])}")
        print(f"   - Premium themes: {len([p for p in plugins if not p.is_free])}")
        print(f"   - Featured themes: {len([p for p in plugins if p.is_featured])}")
        
        # Show theme details
        print("\n🎨 Theme Plugins:")
        for plugin in plugins:
            price_text = "Free" if plugin.is_free else f"${plugin.price}"
            print(f"   - {plugin.name} ({price_text}) - {plugin.download_count} downloads")
        
    except Exception as e:
        print(f"❌ Error seeding theme plugins: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    main()
