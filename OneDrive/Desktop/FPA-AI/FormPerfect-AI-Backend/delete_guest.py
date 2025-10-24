from app.database import SessionLocal
from app.models.user import User

db = SessionLocal()

# Delete existing guest user if it exists
guest_user = db.query(User).filter(User.username == "guest_user").first()
if guest_user:
    db.delete(guest_user)
    db.commit()
    print("✅ Deleted existing guest user")
else:
    print("ℹ️  No existing guest user found")

db.close()
