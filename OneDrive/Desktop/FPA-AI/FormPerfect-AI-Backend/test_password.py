from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    # Truncate password to 72 bytes for bcrypt compatibility
    if len(password.encode('utf-8')) > 72:
        password = password.encode('utf-8')[:72].decode('utf-8', errors='ignore')
    return pwd_context.hash(password)

# Test with the guest password
try:
    test_password = "guest"
    print(f"Testing password: '{test_password}'")
    print(f"Password length: {len(test_password)} chars, {len(test_password.encode('utf-8'))} bytes")
    
    hashed = get_password_hash(test_password)
    print(f"✅ Password hashed successfully!")
    print(f"Hash length: {len(hashed)}")
    print(f"Hash: {hashed[:50]}...")
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
