from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import or_

from passlib.context import CryptContext

from app.models.user import User as UserModel
from app.schemas import UserCreate, UserUpdate, UserInDB
from app.services.base import BaseService

# Password hashing context (same as in auth.py)
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


class UserService(BaseService[UserModel, UserCreate, UserUpdate]):
    def __init__(self, db: Session):
        super().__init__(UserModel, db)

    def get_by_email(self, email: str) -> Optional[UserModel]:
        """Get user by email"""
        return self.db.query(UserModel).filter(UserModel.email == email).first()

    def get_by_username(self, username: str) -> Optional[UserModel]:
        """Get user by username"""
        return self.db.query(UserModel).filter(UserModel.username == username).first()

    def search_users(self, query: str, skip: int = 0, limit: int = 100) -> List[UserModel]:
        """Search users by email, username, first_name, or last_name"""
        search_term = f"%{query}%"
        return (
            self.db.query(UserModel)
            .filter(
                or_(
                    UserModel.email.ilike(search_term),
                    UserModel.username.ilike(search_term),
                    UserModel.first_name.ilike(search_term),
                    UserModel.last_name.ilike(search_term)
                )
            )
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create(self, obj_in: UserCreate) -> UserModel:
        """Create new user with hashed password"""
        # Hash the password
        hashed_password = pwd_context.hash(obj_in.password)
        
        # Create user data without password
        user_data = obj_in.dict(exclude={"password"})
        user_data["hashed_password"] = hashed_password
        
        # Create user
        db_user = UserModel(**user_data)
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def update(self, user_id: int, obj_in: UserUpdate) -> UserModel:
        """Update user"""
        db_user = self.get(user_id)
        if not db_user:
            return None
        
        update_data = obj_in.dict(exclude_unset=True)
        
        # Hash new password if provided
        if "password" in update_data:
            update_data["hashed_password"] = pwd_context.hash(update_data["password"])
            del update_data["password"]
        
        for field, value in update_data.items():
            setattr(db_user, field, value)
        
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def activate_user(self, user_id: int) -> UserModel:
        """Activate user account"""
        db_user = self.get(user_id)
        if db_user:
            db_user.is_active = True
            self.db.commit()
            self.db.refresh(db_user)
        return db_user

    def deactivate_user(self, user_id: int) -> UserModel:
        """Deactivate user account"""
        db_user = self.get(user_id)
        if db_user:
            db_user.is_active = False
            self.db.commit()
            self.db.refresh(db_user)
        return db_user

    def get_active_users(self, skip: int = 0, limit: int = 100) -> List[UserModel]:
        """Get all active users"""
        return (
            self.db.query(UserModel)
            .filter(UserModel.is_active == True)
            .offset(skip)
            .limit(limit)
            .all()
        )
