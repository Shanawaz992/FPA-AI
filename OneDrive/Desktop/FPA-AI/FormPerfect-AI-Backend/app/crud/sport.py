from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import models, schemas
from app.models.sport import Sport

def get_sport(db: Session, sport_id: int):
    return db.query(Sport).filter(Sport.id == sport_id).first()

def get_sport_by_name(db: Session, name: str):
    return db.query(Sport).filter(Sport.name == name).first()

def get_sports(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Sport).offset(skip).limit(limit).all()

def create_sport(db: Session, sport: schemas.SportCreate):
    db_sport = Sport(
        name=sport.name,
        description=sport.description,
        category=sport.category
    )
    try:
        db.add(db_sport)
        db.commit()
        db.refresh(db_sport)
        return db_sport
    except IntegrityError:
        db.rollback()
        return None

def update_sport(db: Session, sport_id: int, sport_update: schemas.SportUpdate):
    db_sport = get_sport(db, sport_id)
    if not db_sport:
        return None

    update_data = sport_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_sport, field, value)

    try:
        db.commit()
        db.refresh(db_sport)
        return db_sport
    except IntegrityError:
        db.rollback()
        return None

def delete_sport(db: Session, sport_id: int):
    db_sport = get_sport(db, sport_id)
    if not db_sport:
        return False

    db.delete(db_sport)
    db.commit()
    return True