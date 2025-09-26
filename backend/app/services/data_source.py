import time
import json
from typing import Optional, List, Dict, Any
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, text
import httpx
import pymongo
import redis
import pandas as pd

from app.models.data_source import DataSource as DataSourceModel, DataSourceType
from app.schemas import (
    DataSourceCreate, DataSourceUpdate, DataSourceTestResult, 
    QueryRequest, QueryResult
)
from app.services.base import BaseService


class DataSourceService(BaseService[DataSourceModel, DataSourceCreate, DataSourceUpdate]):
    def __init__(self, db: Session):
        super().__init__(DataSourceModel, db)

    def get_by_owner(self, owner_id: int, skip: int = 0, limit: int = 100) -> List[DataSourceModel]:
        """Get data sources by owner"""
        return (
            self.db.query(DataSourceModel)
            .filter(DataSourceModel.owner_id == owner_id)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def get_by_name(self, owner_id: int, name: str) -> Optional[DataSourceModel]:
        """Get data source by name for a specific owner"""
        return (
            self.db.query(DataSourceModel)
            .filter(
                DataSourceModel.owner_id == owner_id,
                DataSourceModel.name == name
            )
            .first()
        )

    def create(self, obj_in: DataSourceCreate, owner_id: int) -> DataSourceModel:
        """Create new data source"""
        # Encrypt connection config (in production, use proper encryption)
        connection_config = self._encrypt_connection_config(obj_in.connection_config)
        
        ds_data = obj_in.dict(exclude={"connection_config"})
        ds_data["connection_config"] = connection_config
        ds_data["owner_id"] = owner_id
        
        db_ds = DataSourceModel(**ds_data)
        self.db.add(db_ds)
        self.db.commit()
        self.db.refresh(db_ds)
        return db_ds

    def test_connection(self, data_source: DataSourceModel) -> DataSourceTestResult:
        """Test data source connection"""
        try:
            start_time = time.time()
            
            # Decrypt connection config
            config = self._decrypt_connection_config(data_source.connection_config)
            
            if data_source.type == DataSourceType.MYSQL:
                result = self._test_mysql_connection(config, data_source.test_query)
            elif data_source.type == DataSourceType.POSTGRESQL:
                result = self._test_postgresql_connection(config, data_source.test_query)
            elif data_source.type == DataSourceType.MONGODB:
                result = self._test_mongodb_connection(config)
            elif data_source.type == DataSourceType.REST_API:
                result = self._test_rest_api_connection(config)
            elif data_source.type == DataSourceType.GRAPHQL:
                result = self._test_graphql_connection(config)
            elif data_source.type == DataSourceType.REDIS:
                result = self._test_redis_connection(config)
            else:
                return DataSourceTestResult(
                    success=False,
                    message="Unsupported data source type",
                    error="Data source type not implemented"
                )
            
            execution_time = (time.time() - start_time) * 1000
            result["execution_time_ms"] = execution_time
            
            return DataSourceTestResult(**result)
            
        except Exception as e:
            return DataSourceTestResult(
                success=False,
                message="Connection test failed",
                error=str(e)
            )

    def execute_query(self, data_source: DataSourceModel, query_request: QueryRequest) -> QueryResult:
        """Execute query on data source"""
        try:
            start_time = time.time()
            
            # Decrypt connection config
            config = self._decrypt_connection_config(data_source.connection_config)
            
            if data_source.type == DataSourceType.MYSQL:
                result = self._execute_mysql_query(config, query_request)
            elif data_source.type == DataSourceType.POSTGRESQL:
                result = self._execute_postgresql_query(config, query_request)
            elif data_source.type == DataSourceType.MONGODB:
                result = self._execute_mongodb_query(config, query_request)
            elif data_source.type == DataSourceType.REST_API:
                result = self._execute_rest_api_query(config, query_request)
            elif data_source.type == DataSourceType.GRAPHQL:
                result = self._execute_graphql_query(config, query_request)
            elif data_source.type == DataSourceType.REDIS:
                result = self._execute_redis_query(config, query_request)
            else:
                return QueryResult(
                    success=False,
                    error="Unsupported data source type"
                )
            
            execution_time = (time.time() - start_time) * 1000
            result["execution_time_ms"] = execution_time
            
            return QueryResult(**result)
            
        except Exception as e:
            return QueryResult(
                success=False,
                error=str(e)
            )

    def get_schema(self, data_source: DataSourceModel) -> Dict[str, Any]:
        """Get schema information for data source"""
        try:
            config = self._decrypt_connection_config(data_source.connection_config)
            
            if data_source.type == DataSourceType.MYSQL:
                return self._get_mysql_schema(config)
            elif data_source.type == DataSourceType.POSTGRESQL:
                return self._get_postgresql_schema(config)
            elif data_source.type == DataSourceType.MONGODB:
                return self._get_mongodb_schema(config)
            else:
                return {"error": "Schema introspection not supported for this data source type"}
                
        except Exception as e:
            return {"error": str(e)}

    # Encryption/Decryption helpers (simplified - use proper encryption in production)
    def _encrypt_connection_config(self, config: dict) -> dict:
        """Encrypt sensitive connection parameters"""
        # In production, use proper encryption like Fernet
        # For now, we'll just store as-is (NOT SECURE)
        return config

    def _decrypt_connection_config(self, config: dict) -> dict:
        """Decrypt connection parameters"""
        # In production, decrypt the config
        return config

    # Database connection test methods
    def _test_mysql_connection(self, config: dict, test_query: Optional[str] = None) -> dict:
        """Test MySQL connection"""
        connection_string = f"mysql+pymysql://{config['username']}:{config['password']}@{config['host']}:{config['port']}/{config['database']}"
        engine = create_engine(connection_string)
        
        with engine.connect() as conn:
            if test_query:
                result = conn.execute(text(test_query))
                data = [dict(row) for row in result.fetchmany(5)]
            else:
                result = conn.execute(text("SELECT 1 as test"))
                data = [dict(row) for row in result.fetchall()]
        
        return {
            "success": True,
            "message": "MySQL connection successful",
            "data": data
        }

    def _test_postgresql_connection(self, config: dict, test_query: Optional[str] = None) -> dict:
        """Test PostgreSQL connection"""
        connection_string = f"postgresql://{config['username']}:{config['password']}@{config['host']}:{config['port']}/{config['database']}"
        engine = create_engine(connection_string)
        
        with engine.connect() as conn:
            if test_query:
                result = conn.execute(text(test_query))
                data = [dict(row) for row in result.fetchmany(5)]
            else:
                result = conn.execute(text("SELECT 1 as test"))
                data = [dict(row) for row in result.fetchall()]
        
        return {
            "success": True,
            "message": "PostgreSQL connection successful",
            "data": data
        }

    def _test_mongodb_connection(self, config: dict) -> dict:
        """Test MongoDB connection"""
        client = pymongo.MongoClient(
            host=config['host'],
            port=config['port'],
            username=config.get('username'),
            password=config.get('password')
        )
        
        # Test connection
        client.server_info()
        
        # Get database list
        databases = client.list_database_names()
        
        return {
            "success": True,
            "message": "MongoDB connection successful",
            "data": [{"databases": databases}]
        }

    def _test_rest_api_connection(self, config: dict) -> dict:
        """Test REST API connection"""
        headers = config.get('headers', {})
        auth = None
        
        if config.get('auth_type') == 'bearer':
            headers['Authorization'] = f"Bearer {config.get('token')}"
        elif config.get('auth_type') == 'basic':
            auth = (config.get('username'), config.get('password'))
        
        with httpx.Client() as client:
            response = client.get(config['base_url'], headers=headers, auth=auth)
            response.raise_for_status()
        
        return {
            "success": True,
            "message": "REST API connection successful",
            "data": [{"status_code": response.status_code}]
        }

    def _test_graphql_connection(self, config: dict) -> dict:
        """Test GraphQL connection"""
        headers = config.get('headers', {})
        if config.get('token'):
            headers['Authorization'] = f"Bearer {config['token']}"
        
        # Simple introspection query
        query = {"query": "{ __schema { types { name } } }"}
        
        with httpx.Client() as client:
            response = client.post(
                config['endpoint'],
                json=query,
                headers=headers
            )
            response.raise_for_status()
            data = response.json()
        
        return {
            "success": True,
            "message": "GraphQL connection successful",
            "data": [data]
        }

    def _test_redis_connection(self, config: dict) -> dict:
        """Test Redis connection"""
        r = redis.Redis(
            host=config['host'],
            port=config['port'],
            password=config.get('password'),
            db=config.get('db', 0)
        )
        
        # Test connection
        r.ping()
        
        return {
            "success": True,
            "message": "Redis connection successful",
            "data": [{"ping": "pong"}]
        }

    # Query execution methods
    def _execute_mysql_query(self, config: dict, query_request: QueryRequest) -> dict:
        """Execute MySQL query"""
        connection_string = f"mysql+pymysql://{config['username']}:{config['password']}@{config['host']}:{config['port']}/{config['database']}"
        engine = create_engine(connection_string)
        
        with engine.connect() as conn:
            result = conn.execute(
                text(query_request.query),
                query_request.parameters or {}
            )
            
            if result.returns_rows:
                rows = result.fetchmany(query_request.limit)
                data = [dict(row) for row in rows]
                columns = list(result.keys()) if data else []
                row_count = len(data)
            else:
                data = []
                columns = []
                row_count = result.rowcount
        
        return {
            "success": True,
            "data": data,
            "columns": columns,
            "row_count": row_count
        }

    def _execute_postgresql_query(self, config: dict, query_request: QueryRequest) -> dict:
        """Execute PostgreSQL query"""
        connection_string = f"postgresql://{config['username']}:{config['password']}@{config['host']}:{config['port']}/{config['database']}"
        engine = create_engine(connection_string)
        
        with engine.connect() as conn:
            result = conn.execute(
                text(query_request.query),
                query_request.parameters or {}
            )
            
            if result.returns_rows:
                rows = result.fetchmany(query_request.limit)
                data = [dict(row) for row in rows]
                columns = list(result.keys()) if data else []
                row_count = len(data)
            else:
                data = []
                columns = []
                row_count = result.rowcount
        
        return {
            "success": True,
            "data": data,
            "columns": columns,
            "row_count": row_count
        }

    def _execute_mongodb_query(self, config: dict, query_request: QueryRequest) -> dict:
        """Execute MongoDB query"""
        client = pymongo.MongoClient(
            host=config['host'],
            port=config['port'],
            username=config.get('username'),
            password=config.get('password')
        )
        
        # Parse query (expecting JSON format)
        query_data = json.loads(query_request.query)
        database = query_data.get('database', config.get('database'))
        collection = query_data.get('collection')
        operation = query_data.get('operation', 'find')
        filter_query = query_data.get('filter', {})
        
        db = client[database]
        coll = db[collection]
        
        if operation == 'find':
            cursor = coll.find(filter_query).limit(query_request.limit)
            data = list(cursor)
            # Convert ObjectId to string
            for item in data:
                if '_id' in item:
                    item['_id'] = str(item['_id'])
        else:
            data = []
        
        return {
            "success": True,
            "data": data,
            "columns": list(data[0].keys()) if data else [],
            "row_count": len(data)
        }

    def _execute_rest_api_query(self, config: dict, query_request: QueryRequest) -> dict:
        """Execute REST API query"""
        headers = config.get('headers', {})
        auth = None
        
        if config.get('auth_type') == 'bearer':
            headers['Authorization'] = f"Bearer {config.get('token')}"
        elif config.get('auth_type') == 'basic':
            auth = (config.get('username'), config.get('password'))
        
        # Parse query to get endpoint and method
        query_data = json.loads(query_request.query)
        endpoint = query_data.get('endpoint', '')
        method = query_data.get('method', 'GET').upper()
        params = query_data.get('params', {})
        body = query_data.get('body', {})
        
        url = f"{config['base_url']}{endpoint}"
        
        with httpx.Client() as client:
            if method == 'GET':
                response = client.get(url, params=params, headers=headers, auth=auth)
            elif method == 'POST':
                response = client.post(url, json=body, params=params, headers=headers, auth=auth)
            else:
                response = client.request(method, url, json=body, params=params, headers=headers, auth=auth)
            
            response.raise_for_status()
            data = response.json()
        
        # Normalize data to list format
        if isinstance(data, dict):
            data = [data]
        elif not isinstance(data, list):
            data = [{"result": data}]
        
        return {
            "success": True,
            "data": data[:query_request.limit],
            "columns": list(data[0].keys()) if data else [],
            "row_count": len(data)
        }

    def _execute_graphql_query(self, config: dict, query_request: QueryRequest) -> dict:
        """Execute GraphQL query"""
        headers = config.get('headers', {})
        if config.get('token'):
            headers['Authorization'] = f"Bearer {config['token']}"
        
        query_data = {
            "query": query_request.query,
            "variables": query_request.parameters or {}
        }
        
        with httpx.Client() as client:
            response = client.post(
                config['endpoint'],
                json=query_data,
                headers=headers
            )
            response.raise_for_status()
            result = response.json()
        
        # Extract data from GraphQL response
        data = result.get('data', {})
        if isinstance(data, dict):
            # Flatten the data structure
            flattened = []
            for key, value in data.items():
                if isinstance(value, list):
                    flattened.extend(value)
                else:
                    flattened.append({key: value})
            data = flattened
        
        return {
            "success": True,
            "data": data[:query_request.limit],
            "columns": list(data[0].keys()) if data else [],
            "row_count": len(data)
        }

    def _execute_redis_query(self, config: dict, query_request: QueryRequest) -> dict:
        """Execute Redis query"""
        r = redis.Redis(
            host=config['host'],
            port=config['port'],
            password=config.get('password'),
            db=config.get('db', 0)
        )
        
        # Parse query (expecting JSON format with Redis command)
        query_data = json.loads(query_request.query)
        command = query_data.get('command')
        args = query_data.get('args', [])
        
        # Execute Redis command
        result = r.execute_command(command, *args)
        
        # Format result
        if isinstance(result, (list, tuple)):
            data = [{"index": i, "value": str(v)} for i, v in enumerate(result)]
        else:
            data = [{"result": str(result)}]
        
        return {
            "success": True,
            "data": data[:query_request.limit],
            "columns": list(data[0].keys()) if data else [],
            "row_count": len(data)
        }

    # Schema introspection methods
    def _get_mysql_schema(self, config: dict) -> dict:
        """Get MySQL schema information"""
        connection_string = f"mysql+pymysql://{config['username']}:{config['password']}@{config['host']}:{config['port']}/{config['database']}"
        engine = create_engine(connection_string)
        
        with engine.connect() as conn:
            # Get tables
            tables_result = conn.execute(text("SHOW TABLES"))
            tables = [row[0] for row in tables_result.fetchall()]
            
            schema = {"tables": {}}
            
            # Get columns for each table
            for table in tables:
                columns_result = conn.execute(text(f"DESCRIBE {table}"))
                columns = []
                for row in columns_result.fetchall():
                    columns.append({
                        "name": row[0],
                        "type": row[1],
                        "nullable": row[2] == "YES",
                        "key": row[3],
                        "default": row[4],
                        "extra": row[5]
                    })
                schema["tables"][table] = {"columns": columns}
        
        return schema

    def _get_postgresql_schema(self, config: dict) -> dict:
        """Get PostgreSQL schema information"""
        connection_string = f"postgresql://{config['username']}:{config['password']}@{config['host']}:{config['port']}/{config['database']}"
        engine = create_engine(connection_string)
        
        with engine.connect() as conn:
            # Get tables
            tables_result = conn.execute(text("""
                SELECT table_name FROM information_schema.tables 
                WHERE table_schema = 'public'
            """))
            tables = [row[0] for row in tables_result.fetchall()]
            
            schema = {"tables": {}}
            
            # Get columns for each table
            for table in tables:
                columns_result = conn.execute(text(f"""
                    SELECT column_name, data_type, is_nullable, column_default 
                    FROM information_schema.columns 
                    WHERE table_name = '{table}' AND table_schema = 'public'
                """))
                columns = []
                for row in columns_result.fetchall():
                    columns.append({
                        "name": row[0],
                        "type": row[1],
                        "nullable": row[2] == "YES",
                        "default": row[3]
                    })
                schema["tables"][table] = {"columns": columns}
        
        return schema

    def _get_mongodb_schema(self, config: dict) -> dict:
        """Get MongoDB schema information"""
        client = pymongo.MongoClient(
            host=config['host'],
            port=config['port'],
            username=config.get('username'),
            password=config.get('password')
        )
        
        database_name = config.get('database')
        db = client[database_name]
        
        collections = db.list_collection_names()
        schema = {"collections": collections}
        
        # Sample documents from each collection to infer schema
        for collection_name in collections:
            collection = db[collection_name]
            sample_doc = collection.find_one()
            if sample_doc:
                # Remove ObjectId for JSON serialization
                if '_id' in sample_doc:
                    sample_doc['_id'] = str(sample_doc['_id'])
                schema[collection_name] = {
                    "sample_document": sample_doc,
                    "fields": list(sample_doc.keys())
                }
        
        return schema
