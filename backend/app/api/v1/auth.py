from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.security import authenticate_user, create_access_token
from app.core.config import settings
from app.schemas.user import User, Token, UserLogin
from app.models.user import User as UserModel
from app.api.deps import get_db, get_current_user

router = APIRouter()

@router.post("/login", response_model=Token)
def login_for_access_token(
    user_data: UserLogin,
    db: Session = Depends(get_db)
):
    """Endpoint para login e obtenção de token JWT"""
    # Aceitar tanto email quanto username
    user = authenticate_user(db, user_data.email, user_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email/username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": User.from_orm(user)
    }

@router.get("/me", response_model=User)
def read_users_me(current_user: UserModel = Depends(get_current_user)):
    """Endpoint para obter dados do usuário atual"""
    return current_user
