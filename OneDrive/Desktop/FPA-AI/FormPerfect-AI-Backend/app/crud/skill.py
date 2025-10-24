from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import models, schemas
from app.models.skill import Skill

def get_skill(db: Session, skill_id: int):
    return db.query(Skill).filter(Skill.id == skill_id).first()

def get_skills_by_sport(db: Session, sport_id: int, skip: int = 0, limit: int = 100):
    return db.query(Skill).filter(Skill.sport_id == sport_id).offset(skip).limit(limit).all()

def get_skills(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Skill).offset(skip).limit(limit).all()

def create_skill(db: Session, skill: schemas.SkillCreate):
    db_skill = Skill(
        name=skill.name,
        description=skill.description,
        sport_id=skill.sport_id,
        difficulty_level=skill.difficulty_level
    )
    try:
        db.add(db_skill)
        db.commit()
        db.refresh(db_skill)
        return db_skill
    except IntegrityError:
        db.rollback()
        return None

def update_skill(db: Session, skill_id: int, skill_update: schemas.SkillUpdate):
    db_skill = get_skill(db, skill_id)
    if not db_skill:
        return None

    update_data = skill_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_skill, field, value)

    try:
        db.commit()
        db.refresh(db_skill)
        return db_skill
    except IntegrityError:
        db.rollback()
        return None

def delete_skill(db: Session, skill_id: int):
    db_skill = get_skill(db, skill_id)
    if not db_skill:
        return False

    db.delete(db_skill)
    db.commit()
    return True