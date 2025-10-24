"""
Script to create all tables in Supabase PostgreSQL database
Run this after updating DATABASE_URL in .env with your Supabase credentials
"""
import os
from dotenv import load_dotenv
from app.database import engine, Base
from app.models import user, sport, skill, submission, analysis

load_dotenv()

def setup_supabase_database():
    """Create all tables in the Supabase database"""
    print("=" * 60)
    print("Setting up Supabase Database")
    print("=" * 60)
    
    database_url = os.getenv("DATABASE_URL")
    
    if not database_url:
        print("❌ ERROR: DATABASE_URL not found in .env file")
        print("\nPlease update your .env file with your Supabase credentials:")
        print("DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres")
        return
    
    if "sqlite" in database_url.lower():
        print("⚠️  WARNING: DATABASE_URL is still pointing to SQLite")
        print("\nPlease update your .env file with your Supabase PostgreSQL connection string:")
        print("DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres")
        return
    
    print(f"\n✓ Database URL configured (PostgreSQL)")
    print(f"  Host: {database_url.split('@')[1].split('/')[0] if '@' in database_url else 'N/A'}")
    
    try:
        print("\n📊 Creating all database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ Database tables created successfully!")
        
        print("\n📋 Tables created:")
        print("  ✓ users")
        print("  ✓ sports")
        print("  ✓ skills")
        print("  ✓ submissions")
        print("  ✓ analyses")
        
        print("\n🎉 Supabase database setup complete!")
        print("=" * 60)
        
    except Exception as e:
        print(f"\n❌ ERROR: Failed to create tables")
        print(f"Error: {str(e)}")
        print("\nPlease check:")
        print("  1. Your Supabase credentials are correct")
        print("  2. Your database is accessible")
        print("  3. You have the necessary permissions")

if __name__ == "__main__":
    setup_supabase_database()
