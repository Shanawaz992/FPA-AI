from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

router = APIRouter()

@router.get("/", response_model=List[schemas.Skill])
async def read_skills(
    sport_id: int = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    if sport_id:
        skills = crud.get_skills_by_sport(db, sport_id=sport_id, skip=skip, limit=limit)
    else:
        skills = crud.get_skills(db, skip=skip, limit=limit)
    return skills

@router.get("/{skill_id}", response_model=schemas.Skill)
async def read_skill(
    skill_id: int,
    db: Session = Depends(get_db)
):
    db_skill = crud.get_skill(db, skill_id=skill_id)
    if db_skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill

@router.post("/", response_model=schemas.Skill)
async def create_skill(
    skill: schemas.SkillCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_skill(db=db, skill=skill)

@router.put("/{skill_id}", response_model=schemas.Skill)
async def update_skill(
    skill_id: int,
    skill_update: schemas.SkillUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_skill = crud.update_skill(db, skill_id=skill_id, skill_update=skill_update)
    if db_skill is None:
        raise HTTPException(status_code=404, detail="Skill not found")
    return db_skill

@router.delete("/{skill_id}")
async def delete_skill(
    skill_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    success = crud.delete_skill(db, skill_id=skill_id)
    if not success:
        raise HTTPException(status_code=404, detail="Skill not found")
    return {"message": "Skill deleted successfully"}