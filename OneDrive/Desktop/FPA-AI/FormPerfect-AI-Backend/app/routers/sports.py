from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models, schemas
from app.database import get_db
from app.routers.auth import get_current_user

router = APIRouter()

@router.post("/init-sample-data")
async def init_sample_sports(db: Session = Depends(get_db)):
    """Initialize database with sample sports data"""
    from app.models.sport import Sport
    
    existing_count = db.query(Sport).count()
    if existing_count > 0:
        return {"message": f"Database already has {existing_count} sports", "added": 0}
    
    sample_sports = [
        {"name": "Basketball", "description": "Shooting, dribbling, and passing techniques", "category": "team"},
        {"name": "Soccer", "description": "Ball control, shooting, and tactical positioning", "category": "team"},
        {"name": "Tennis", "description": "Forehand, backhand, and serve analysis", "category": "individual"},
        {"name": "Golf", "description": "Swing analysis and putting techniques", "category": "individual"},
        {"name": "Baseball", "description": "Batting, pitching, and fielding form", "category": "team"},
        {"name": "Swimming", "description": "Stroke technique and breathing patterns", "category": "water"},
        {"name": "Gym", "description": "Weight lifting form and exercise techniques", "category": "strength"},
        {"name": "Running", "description": "Running form and stride analysis", "category": "individual"},
        {"name": "Volleyball", "description": "Spiking, blocking, and serving techniques", "category": "team"},
        {"name": "Boxing", "description": "Punching form and defensive techniques", "category": "combat"},
    ]
    
    for sport_data in sample_sports:
        sport = Sport(**sport_data)
        db.add(sport)
    
    db.commit()
    return {"message": f"Successfully added {len(sample_sports)} sports", "added": len(sample_sports)}

@router.get("/", response_model=List[schemas.Sport])
async def read_sports(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    sports = crud.get_sports(db, skip=skip, limit=limit)
    return sports

@router.get("/{sport_id}", response_model=schemas.Sport)
async def read_sport(
    sport_id: int,
    db: Session = Depends(get_db)
):
    db_sport = crud.get_sport(db, sport_id=sport_id)
    if db_sport is None:
        raise HTTPException(status_code=404, detail="Sport not found")
    return db_sport

@router.post("/", response_model=schemas.Sport)
async def create_sport(
    sport: schemas.SportCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    return crud.create_sport(db=db, sport=sport)

@router.put("/{sport_id}", response_model=schemas.Sport)
async def update_sport(
    sport_id: int,
    sport_update: schemas.SportUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    db_sport = crud.update_sport(db, sport_id=sport_id, sport_update=sport_update)
    if db_sport is None:
        raise HTTPException(status_code=404, detail="Sport not found")
    return db_sport

@router.delete("/{sport_id}")
async def delete_sport(
    sport_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user)
):
    success = crud.delete_sport(db, sport_id=sport_id)
    if not success:
        raise HTTPException(status_code=404, detail="Sport not found")
    return {"message": "Sport deleted successfully"}