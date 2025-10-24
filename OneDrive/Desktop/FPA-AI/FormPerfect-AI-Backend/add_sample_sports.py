from app.database import SessionLocal
from app.models.sport import Sport

db = SessionLocal()

# Check if sports already exist
existing_sports = db.query(Sport).count()
print(f"Existing sports count: {existing_sports}")

if existing_sports == 0:
    print("Adding sample sports...")
    
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
    print(f"✅ Added {len(sample_sports)} sports to the database!")
else:
    print(f"✓ Database already has {existing_sports} sports")

db.close()
