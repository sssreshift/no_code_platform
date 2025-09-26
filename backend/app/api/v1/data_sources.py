from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any

from app.core.database import get_db
from app.schemas import (
    User, DataSource, DataSourceCreate, DataSourceUpdate, 
    DataSourcePublic, DataSourceTestResult, QueryRequest, QueryResult
)
from app.services.auth import AuthService
from app.services.data_source import DataSourceService
from app.models.user import UserRole

router = APIRouter()


@router.get("/", response_model=List[DataSourcePublic])
def get_data_sources(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Get user's data sources"""
    data_source_service = DataSourceService(db)
    data_sources = data_source_service.get_by_owner(current_user.id, skip=skip, limit=limit)
    return data_sources


@router.post("/", response_model=DataSourcePublic)
def create_data_source(
    data_source_data: DataSourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Create new data source"""
    data_source_service = DataSourceService(db)
    
    # Check if name is unique for the user
    existing_ds = data_source_service.get_by_name(current_user.id, data_source_data.name)
    if existing_ds:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Data source with this name already exists"
        )
    
    data_source = data_source_service.create(data_source_data, owner_id=current_user.id)
    return data_source


@router.get("/{data_source_id}", response_model=DataSource)
def get_data_source(
    data_source_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Get data source by ID (with connection config for owners)"""
    data_source_service = DataSourceService(db)
    data_source = data_source_service.get(data_source_id)
    
    if not data_source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data source not found"
        )
    
    # Check if user owns the data source
    if data_source.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this data source"
        )
    
    return data_source


@router.put("/{data_source_id}", response_model=DataSourcePublic)
def update_data_source(
    data_source_id: int,
    data_source_update: DataSourceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Update data source"""
    data_source_service = DataSourceService(db)
    data_source = data_source_service.get(data_source_id)
    
    if not data_source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data source not found"
        )
    
    # Check if user owns the data source
    if data_source.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to update this data source"
        )
    
    updated_data_source = data_source_service.update(data_source_id, data_source_update)
    return updated_data_source


@router.delete("/{data_source_id}")
def delete_data_source(
    data_source_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Delete data source"""
    data_source_service = DataSourceService(db)
    data_source = data_source_service.get(data_source_id)
    
    if not data_source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data source not found"
        )
    
    # Check if user owns the data source
    if data_source.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to delete this data source"
        )
    
    data_source_service.delete(data_source_id)
    return {"message": "Data source deleted successfully"}


@router.post("/{data_source_id}/test", response_model=DataSourceTestResult)
def test_data_source(
    data_source_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Test data source connection"""
    data_source_service = DataSourceService(db)
    data_source = data_source_service.get(data_source_id)
    
    if not data_source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data source not found"
        )
    
    # Check if user owns the data source
    if data_source.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to test this data source"
        )
    
    result = data_source_service.test_connection(data_source)
    return result


@router.post("/{data_source_id}/query", response_model=QueryResult)
def execute_query(
    data_source_id: int,
    query_request: QueryRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Execute query on data source"""
    data_source_service = DataSourceService(db)
    data_source = data_source_service.get(data_source_id)
    
    if not data_source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data source not found"
        )
    
    # Check if user owns the data source
    if data_source.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to query this data source"
        )
    
    # Check if data source is active
    if not data_source.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Data source is not active"
        )
    
    result = data_source_service.execute_query(data_source, query_request)
    return result


@router.get("/{data_source_id}/schema")
def get_data_source_schema(
    data_source_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(AuthService.get_current_user)
) -> Any:
    """Get data source schema information"""
    data_source_service = DataSourceService(db)
    data_source = data_source_service.get(data_source_id)
    
    if not data_source:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data source not found"
        )
    
    # Check if user owns the data source
    if data_source.owner_id != current_user.id and current_user.role != UserRole.ADMIN:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not enough permissions to access this data source schema"
        )
    
    # Check if data source is active
    if not data_source.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Data source is not active"
        )
    
    schema_info = data_source_service.get_schema(data_source)
    return schema_info
