from fastapi import APIRouter
from . import auth, apps, components, data_sources, users, pages, plugins

api_router = APIRouter()

api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(users.router, prefix="/users", tags=["Users"])
api_router.include_router(apps.router, prefix="/apps", tags=["Applications"])
api_router.include_router(components.router, prefix="/components", tags=["Components"])
api_router.include_router(data_sources.router, prefix="/data-sources", tags=["Data Sources"])
api_router.include_router(pages.router, prefix="/pages", tags=["Pages"])
api_router.include_router(plugins.router, prefix="/plugins", tags=["Plugins"])

