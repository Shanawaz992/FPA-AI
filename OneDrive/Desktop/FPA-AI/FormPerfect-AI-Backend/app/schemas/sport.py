from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class SportBase(BaseModel):
    name: str
    description: Optional[str] = None
    category: Optional[str] = None

class SportCreate(SportBase):
    pass

class SportUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None

class Sport(SportBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True