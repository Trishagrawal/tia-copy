import enum
from datetime import datetime

from sqlalchemy import Text, Enum, ForeignKey, DateTime, Boolean, Integer, JSON, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class SenderType(str, enum.Enum):
    user = "user"
    tia = "tia"
    professor = "professor"


class MessageRole(str, enum.Enum):
    user_query = "user_query"
    tia_reply = "tia_reply"
    professor_reply = "professor_reply"
    system_note = "system_note"


class Message(Base):
    __tablename__ = "messages"

    message_id: Mapped[int] = mapped_column(primary_key=True)
    conversation_id: Mapped[int] = mapped_column(ForeignKey("conversations.conversation_id"), nullable=False)
    sender_type: Mapped[SenderType] = mapped_column(Enum(SenderType), nullable=False)
    sender_user_id: Mapped[int | None] = mapped_column(ForeignKey("users.user_id"))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    message_role: Mapped[MessageRole] = mapped_column(Enum(MessageRole), nullable=False)
    parent_message_id: Mapped[int | None] = mapped_column(ForeignKey("messages.message_id"))
    is_visible_to_user: Mapped[bool] = mapped_column(Boolean, default=True)
    metadata_json: Mapped[dict | None] = mapped_column("metadata", JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    # relationships
    conversation = relationship("Conversation", back_populates="messages")
    sender = relationship("User", foreign_keys=[sender_user_id])
    parent_message = relationship("Message", remote_side=[message_id])
