from sqlalchemy.orm import Session
from sqlalchemy.exc import IntegrityError
from app import models, schemas
from app.models.submission import Submission

def get_submission(db: Session, submission_id: int):
    return db.query(Submission).filter(Submission.id == submission_id).first()

def get_submissions_by_user(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(Submission).filter(Submission.user_id == user_id).offset(skip).limit(limit).all()

def get_submissions_by_skill(db: Session, skill_id: int, skip: int = 0, limit: int = 100):
    return db.query(Submission).filter(Submission.skill_id == skill_id).offset(skip).limit(limit).all()

def get_submissions(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Submission).offset(skip).limit(limit).all()

def create_submission(db: Session, submission: schemas.SubmissionCreate, user_id: int):
    db_submission = Submission(
        user_id=user_id,
        skill_id=submission.skill_id,
        video_url=submission.video_url,
        title=submission.title,
        description=submission.description
    )
    try:
        db.add(db_submission)
        db.commit()
        db.refresh(db_submission)
        return db_submission
    except IntegrityError:
        db.rollback()
        return None

def update_submission(db: Session, submission_id: int, submission_update: schemas.SubmissionUpdate):
    db_submission = get_submission(db, submission_id)
    if not db_submission:
        return None

    update_data = submission_update.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_submission, field, value)

    try:
        db.commit()
        db.refresh(db_submission)
        return db_submission
    except IntegrityError:
        db.rollback()
        return None

def delete_submission(db: Session, submission_id: int):
    db_submission = get_submission(db, submission_id)
    if not db_submission:
        return False

    db.delete(db_submission)
    db.commit()
    return True