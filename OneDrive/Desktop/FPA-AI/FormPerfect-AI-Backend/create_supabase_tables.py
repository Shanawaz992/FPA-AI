"""
Simple script to create all tables in Supabase
"""
import os
import sys
from dotenv import load_dotenv
from sqlalchemy import create_engine, inspect, text
from sqlalchemy.exc import OperationalError

load_dotenv()

def create_supabase_tables():
    """Create all tables in Supabase database"""
    
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url or "postgresql" not in database_url.lower():
        print("❌ ERROR: PostgreSQL DATABASE_URL not configured in .env")
        return False
    
    print("Connecting to Supabase...")
    
    try:
        # Create engine with shorter timeout
        engine = create_engine(
            database_url,
            pool_pre_ping=True,
            connect_args={"connect_timeout": 10}
        )
        
        # Test connection
        with engine.connect() as conn:
            result = conn.execute(text("SELECT version();"))
            version = result.fetchone()[0]
            print(f"✓ Connected to PostgreSQL")
            print(f"  Version: {version[:50]}...")
        
        # Import models
        print("\nImporting models...")
        from app.database import Base
        from app.models import user, sport, skill, submission, analysis
        
        # Check existing tables
        inspector = inspect(engine)
        existing_tables = inspector.get_table_names()
        
        if existing_tables:
            print(f"\nExisting tables found: {', '.join(existing_tables)}")
            response = input("Do you want to recreate all tables? (yes/no): ")
            if response.lower() != 'yes':
                print("Aborted.")
                return False
            print("\nDropping existing tables...")
            Base.metadata.drop_all(bind=engine)
        
        # Create all tables
        print("Creating tables...")
        Base.metadata.create_all(bind=engine)
        
        # Verify tables were created
        inspector = inspect(engine)
        created_tables = inspector.get_table_names()
        
        print("\n✅ Success! Created tables:")
        for table in created_tables:
            print(f"  ✓ {table}")
        
        return True
        
    except OperationalError as e:
        print(f"\n❌ Connection Error: {str(e)}")
        print("\nPlease check:")
        print("  1. Your internet connection")
        print("  2. Supabase credentials in .env")
        print("  3. Supabase project is active")
        return False
    except Exception as e:
        print(f"\n❌ Error: {str(e)}")
        return False

if __name__ == "__main__":
    success = create_supabase_tables()
    sys.exit(0 if success else 1)
