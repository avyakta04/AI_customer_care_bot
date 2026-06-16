import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base, sessionmaker, relationship

DATABASE_URL = os.environ.get("DATABASE_URL", "sqlite:///echomind.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Customer(Base):
    __tablename__ = "customers"
    
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(100), nullable=True)
    previous_complaints = Column(Integer, default=0)
    escalation_frequency = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

class ChatSession(Base):
    __tablename__ = "sessions"
    
    id = Column(String(50), primary_key=True, index=True)
    customer_id = Column(String(50), ForeignKey("customers.id"))
    started_at = Column(DateTime, default=datetime.utcnow)
    status = Column(String(20), default="active") # active, closed
    
    messages = relationship("ChatMessage", back_populates="session")

class ChatMessage(Base):
    __tablename__ = "messages"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(String(50), ForeignKey("sessions.id"))
    query_text = Column(Text, nullable=False)
    predicted_response = Column(Text, nullable=True)
    emotion = Column(String(20), nullable=True)
    emotion_confidence = Column(Float, nullable=True)
    intent = Column(String(50), nullable=True)
    intent_confidence = Column(Float, nullable=True)
    urgency = Column(String(20), nullable=True)
    toxicity_score = Column(Float, default=0.0)
    is_safe = Column(Boolean, default=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    session = relationship("ChatSession", back_populates="messages")
    feedback = relationship("HindsightFeedback", uselist=False, back_populates="message")

class HindsightFeedback(Base):
    __tablename__ = "hindsight_feedback"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    message_id = Column(Integer, ForeignKey("messages.id"))
    feedback_score = Column(Integer, nullable=False) # 1 = Thumbs Up, -1 = Thumbs Down
    corrected_response = Column(Text, nullable=True)
    is_queued_for_retrain = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    message = relationship("ChatMessage", back_populates="feedback")

class SystemAnalytics(Base):
    __tablename__ = "system_analytics"
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    active_sessions = Column(Integer, default=0)
    supervision_rate = Column(Float, default=99.5)
    recovery_rate = Column(Float, default=88.5)
    interventions = Column(Integer, default=0)
    accuracy_index = Column(Float, default=94.6)

def init_db():
    Base.metadata.create_all(bind=engine)
    # Seed standard customer context and analytics for first load
    db = SessionLocal()
    try:
        # Check if seed exists
        if not db.query(Customer).filter(Customer.id == "CUST001").first():
            cust1 = Customer(id="CUST001", name="VIP Client", previous_complaints=4, escalation_frequency=2)
            cust2 = Customer(id="CUST002", name="Trialist User", previous_complaints=1, escalation_frequency=0)
            db.add_all([cust1, cust2])
            db.commit()
            print("Database seeded with sample customer metadata.")
    except Exception as e:
        print(f"Error seeding database: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
