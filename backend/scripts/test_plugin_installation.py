#!/usr/bin/env python3
"""
Script to test plugin installation flow
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.plugin import Plugin, PluginInstallation
from app.models.app import App
from app.models.user import User
import json

def test_plugin_installation():
    """Test the plugin installation flow"""
    print("🧪 Testing plugin installation flow...")
    
    # Get database session
    db = next(get_db())
    
    try:
        # Get a user and app
        user = db.query(User).first()
        app = db.query(App).first()
        plugin = db.query(Plugin).first()
        
        if not user or not app or not plugin:
            print("❌ Missing required data (user, app, or plugin)")
            return
        
        print(f"👤 User: {user.email}")
        print(f"📱 App: {app.name}")
        print(f"🔌 Plugin: {plugin.name}")
        
        # Test installation
        installation_data = {
            "plugin_id": plugin.id,
            "app_id": app.id,
            "config": {
                "pageSize": 20,
                "enableSorting": True,
                "enableFiltering": True,
                "enableExport": False
            },
            "is_active": True
        }
        
        # Check if already installed
        existing = db.query(PluginInstallation).filter(
            PluginInstallation.plugin_id == plugin.id,
            PluginInstallation.app_id == app.id
        ).first()
        
        if existing:
            print("✅ Plugin already installed")
            print(f"   Installation ID: {existing.id}")
            print(f"   Config: {existing.config}")
            print(f"   Active: {existing.is_active}")
        else:
            # Create new installation
            installation = PluginInstallation(
                plugin_id=plugin.id,
                app_id=app.id,
                user_id=user.id,
                config=installation_data["config"],
                is_active=installation_data["is_active"]
            )
            
            db.add(installation)
            
            # Update download count
            plugin.download_count += 1
            
            db.commit()
            db.refresh(installation)
            
            print("✅ Plugin installed successfully!")
            print(f"   Installation ID: {installation.id}")
            print(f"   Config: {installation.config}")
            print(f"   Active: {installation.is_active}")
            print(f"   Installed at: {installation.installed_at}")
        
        # Test getting installations for the plugin
        installations = db.query(PluginInstallation).filter(
            PluginInstallation.plugin_id == plugin.id
        ).all()
        
        print(f"\n📊 Plugin installations: {len(installations)}")
        for inst in installations:
            print(f"   - App: {inst.app.name}, User: {inst.user.email}, Active: {inst.is_active}")
        
        # Test getting installations for the app
        app_installations = db.query(PluginInstallation).filter(
            PluginInstallation.app_id == app.id
        ).all()
        
        print(f"\n📱 App installations: {len(app_installations)}")
        for inst in app_installations:
            print(f"   - Plugin: {inst.plugin.name}, Active: {inst.is_active}")
        
        print("\n🎉 Plugin installation test completed successfully!")
        
    except Exception as e:
        print(f"❌ Error testing plugin installation: {e}")
        db.rollback()
    finally:
        db.close()

def test_plugin_search():
    """Test plugin search functionality"""
    print("\n🔍 Testing plugin search...")
    
    db = next(get_db())
    
    try:
        # Test different search criteria
        print("📋 All plugins:")
        all_plugins = db.query(Plugin).filter(Plugin.is_active == True).all()
        for plugin in all_plugins:
            print(f"   - {plugin.name} ({plugin.plugin_type}) - ${plugin.price if not plugin.is_free else 'Free'}")
        
        print("\n⭐ Featured plugins:")
        featured = db.query(Plugin).filter(
            Plugin.is_active == True,
            Plugin.is_featured == True
        ).all()
        for plugin in featured:
            print(f"   - {plugin.name}")
        
        print("\n🆓 Free plugins:")
        free = db.query(Plugin).filter(
            Plugin.is_active == True,
            Plugin.is_free == True
        ).all()
        for plugin in free:
            print(f"   - {plugin.name}")
        
        print("\n💰 Paid plugins:")
        paid = db.query(Plugin).filter(
            Plugin.is_active == True,
            Plugin.is_free == False
        ).all()
        for plugin in paid:
            print(f"   - {plugin.name} - ${plugin.price}")
        
        print("\n📊 Plugin types:")
        types = db.query(Plugin.plugin_type).distinct().all()
        for plugin_type in types:
            count = db.query(Plugin).filter(Plugin.plugin_type == plugin_type[0]).count()
            print(f"   - {plugin_type[0]}: {count} plugins")
        
    except Exception as e:
        print(f"❌ Error testing plugin search: {e}")
    finally:
        db.close()

def main():
    """Main test function"""
    print("🚀 Starting plugin marketplace tests...\n")
    
    test_plugin_installation()
    test_plugin_search()
    
    print("\n✅ All tests completed!")

if __name__ == "__main__":
    main()

