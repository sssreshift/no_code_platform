from pydantic import BaseModel, Field, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from app.models.data_source import DataSourceType


class DataSourceBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    type: DataSourceType
    connection_config: Dict[str, Any]
    test_query: Optional[str] = None
    is_active: bool = True

    @validator('connection_config')
    def validate_connection_config(cls, v, values):
        """Validate connection config based on data source type"""
        ds_type = values.get('type')
        if ds_type in [DataSourceType.MYSQL, DataSourceType.POSTGRESQL]:
            required_fields = ['host', 'port', 'database', 'username', 'password']
            for field in required_fields:
                if field not in v:
                    raise ValueError(f'{field} is required for {ds_type.value} connection')
        elif ds_type == DataSourceType.REST_API:
            if 'base_url' not in v:
                raise ValueError('base_url is required for REST API connection')
        return v


class DataSourceCreate(DataSourceBase):
    pass


class DataSourceUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=255)
    description: Optional[str] = None
    connection_config: Optional[Dict[str, Any]] = None
    test_query: Optional[str] = None
    is_active: Optional[bool] = None


class DataSourceInDB(DataSourceBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: Optional[datetime]

    class Config:
        from_attributes = True


class DataSource(DataSourceInDB):
    pass


class DataSourcePublic(BaseModel):
    """Public data source schema (without sensitive connection details)"""
    id: int
    name: str
    description: Optional[str] = None
    type: DataSourceType
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class DataSourceTestResult(BaseModel):
    """Result of data source connection test"""
    success: bool
    message: str
    data: Optional[List[Dict[str, Any]]] = None
    error: Optional[str] = None


class QueryRequest(BaseModel):
    """Request to execute query on data source"""
    query: str
    parameters: Optional[Dict[str, Any]] = None
    limit: Optional[int] = Field(100, le=1000)  # Max 1000 rows


class QueryResult(BaseModel):
    """Result of query execution"""
    success: bool
    data: Optional[List[Dict[str, Any]]] = None
    columns: Optional[List[str]] = None
    row_count: int = 0
    error: Optional[str] = None
    execution_time_ms: Optional[float] = None
