from app.database import engine, Base
from app.models import user, sport, skill, submission, analysis

# Import all models to register them with Base
print("Creating all database tables...")
Base.metadata.create_all(bind=engine)
print("Database tables created successfully!")
