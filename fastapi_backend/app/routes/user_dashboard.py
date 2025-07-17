from uuid import UUID
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select

from app.database import User, get_async_session
from app.models import Item
from app.schemas import ItemRead, ItemCreate, UserRead
from app.users import current_active_user

router = APIRouter(tags=["user-dashboard"])


@router.get("/dashboard/{user_id}", response_model=dict)
async def get_user_dashboard(
    user_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    """
    Get user dashboard data. Only the user themselves can access their dashboard.
    """
    # Check if the requested user_id matches the current user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own dashboard"
        )
    
    # Get user's items
    result = await db.execute(select(Item).filter(Item.user_id == user_id))
    items = result.scalars().all()
    
    # Return dashboard data
    return {
        "user": {
            "id": str(current_user.id),
            "email": current_user.email,
            "is_active": current_user.is_active,
            "is_verified": current_user.is_verified,
            "is_superuser": current_user.is_superuser,
        },
        "items": [ItemRead.model_validate(item) for item in items],
        "stats": {
            "total_items": len(items),
            "active_items": len([item for item in items if item.quantity and item.quantity > 0]),
        }
    }


@router.get("/dashboard/{user_id}/items", response_model=list[ItemRead])
async def get_user_items(
    user_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    """
    Get items for a specific user. Only the user themselves can access their items.
    """
    # Check if the requested user_id matches the current user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own items"
        )
    
    result = await db.execute(select(Item).filter(Item.user_id == user_id))
    items = result.scalars().all()
    return [ItemRead.model_validate(item) for item in items]


@router.get("/dashboard/{user_id}/profile", response_model=dict)
async def get_user_profile(
    user_id: UUID,
    current_user: User = Depends(current_active_user),
):
    """
    Get user profile information. Only the user themselves can access their profile.
    """
    # Check if the requested user_id matches the current user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only access your own profile"
        )
    
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "is_active": current_user.is_active,
        "is_verified": current_user.is_verified,
        "is_superuser": current_user.is_superuser,
    }


@router.post("/dashboard/{user_id}/items", response_model=ItemRead)
async def create_user_item(
    user_id: UUID,
    item: ItemCreate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    """
    Create an item for a specific user. Only the user themselves can create items.
    """
    # Check if the requested user_id matches the current user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only create items for yourself"
        )
    
    db_item = Item(**item.model_dump(), user_id=user_id)
    db.add(db_item)
    await db.commit()
    await db.refresh(db_item)
    return ItemRead.model_validate(db_item)


@router.delete("/dashboard/{user_id}/items/{item_id}")
async def delete_user_item(
    user_id: UUID,
    item_id: UUID,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    """
    Delete an item for a specific user. Only the user themselves can delete their items.
    """
    # Check if the requested user_id matches the current user
    if current_user.id != user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own items"
        )
    
    result = await db.execute(
        select(Item).filter(Item.id == item_id, Item.user_id == user_id)
    )
    item = result.scalars().first()

    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Item not found"
        )

    await db.delete(item)
    await db.commit()

    return {"message": "Item successfully deleted"} 