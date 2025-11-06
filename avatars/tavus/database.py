"""
Database helper for Knuut AI
Handles all database operations using Neon PostgreSQL
"""
import os
import logging
from typing import Optional, List, Dict, Any
from datetime import datetime, timedelta
import asyncpg
from dotenv import load_dotenv
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).parent.parent.parent / '.env')

logger = logging.getLogger("database")
logger.setLevel(logging.INFO)

class Database:
    """Database connection and operations manager"""
    
    def __init__(self):
        self.connection_string = os.getenv("DATABASE_URL")
        self.pool: Optional[asyncpg.Pool] = None
    
    async def connect(self):
        """Initialize database connection pool"""
        if not self.connection_string:
            logger.warning("DATABASE_URL not set, database operations will be disabled")
            return
        
        try:
            self.pool = await asyncpg.create_pool(
                self.connection_string,
                min_size=1,
                max_size=10,
                command_timeout=60
            )
            logger.info("Database connection pool created")
        except Exception as e:
            logger.error(f"Failed to create database pool: {e}")
            raise
    
    async def close(self):
        """Close database connection pool"""
        if self.pool:
            await self.pool.close()
            logger.info("Database connection pool closed")
    
    async def get_user(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Get user by ID"""
        if not self.pool:
            return None
        
        try:
            row = await self.pool.fetchrow(
                "SELECT * FROM users WHERE id = $1",
                user_id
            )
            return dict(row) if row else None
        except Exception as e:
            logger.error(f"Error getting user: {e}")
            return None
    
    async def create_user(self, email: Optional[str] = None, name: Optional[str] = None,
                         country: Optional[str] = None) -> Optional[str]:
        """Create a new user and return user ID"""
        if not self.pool:
            return None
        
        try:
            user_id = await self.pool.fetchval(
                """
                INSERT INTO users (email, name, country)
                VALUES ($1, $2, $3)
                RETURNING id
                """,
                email, name, country
            )
            logger.info(f"Created user: {user_id}")
            return str(user_id)
        except Exception as e:
            logger.error(f"Error creating user: {e}")
            return None
    
    async def create_group(self, name: str, description: str, group_type: str,
                          location_name: Optional[str] = None,
                          location_lat: Optional[float] = None,
                          location_lng: Optional[float] = None,
                          created_by: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Create a new group"""
        if not self.pool:
            return None
        
        try:
            row = await self.pool.fetchrow(
                """
                INSERT INTO groups (name, description, group_type, location_name, location_lat, location_lng, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING *
                """,
                name, description, group_type, location_name, location_lat, location_lng, created_by
            )
            group = dict(row)
            group['member_count'] = 0
            logger.info(f"Created group: {group['id']}")
            return group
        except Exception as e:
            logger.error(f"Error creating group: {e}")
            return None
    
    async def find_groups(self, group_type: Optional[str] = None,
                         location_lat: Optional[float] = None,
                         location_lng: Optional[float] = None,
                         max_distance_km: float = 10.0) -> List[Dict[str, Any]]:
        """Find groups with optional filters"""
        if not self.pool:
            return []
        
        try:
            query = "SELECT g.*, COUNT(gm.id) as member_count FROM groups g LEFT JOIN group_members gm ON g.id = gm.group_id"
            conditions = []
            params = []
            param_count = 0
            
            if group_type:
                param_count += 1
                conditions.append(f"g.group_type = ${param_count}")
                params.append(group_type)
            
            if location_lat and location_lng:
                # Distance calculation using Haversine formula (simplified)
                param_count += 1
                lat_param = param_count
                param_count += 1
                lng_param = param_count
                param_count += 1
                max_dist_param = param_count
                
                conditions.append(
                    f"(6371 * acos(cos(radians(${lat_param})) * cos(radians(g.location_lat)) * "
                    f"cos(radians(g.location_lng) - radians(${lng_param})) + "
                    f"sin(radians(${lat_param})) * sin(radians(g.location_lat)))) <= ${max_dist_param}"
                )
                params.extend([location_lat, location_lng, max_distance_km])
            
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            
            query += " GROUP BY g.id ORDER BY g.created_at DESC LIMIT 50"
            
            rows = await self.pool.fetch(query, *params)
            groups = [dict(row) for row in rows]
            logger.info(f"Found {len(groups)} groups")
            return groups
        except Exception as e:
            logger.error(f"Error finding groups: {e}")
            return []
    
    async def join_group(self, group_id: str, user_id: str) -> bool:
        """Join a group"""
        if not self.pool:
            return False
        
        try:
            await self.pool.execute(
                """
                INSERT INTO group_members (group_id, user_id)
                VALUES ($1, $2)
                ON CONFLICT (group_id, user_id) DO NOTHING
                """,
                group_id, user_id
            )
            logger.info(f"User {user_id} joined group {group_id}")
            return True
        except Exception as e:
            logger.error(f"Error joining group: {e}")
            return False
    
    async def create_event(self, title: str, description: str, event_date: str,
                          location_name: str, location_lat: Optional[float] = None,
                          location_lng: Optional[float] = None,
                          group_id: Optional[str] = None,
                          created_by: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Create a new event"""
        if not self.pool:
            return None
        
        try:
            row = await self.pool.fetchrow(
                """
                INSERT INTO events (title, description, event_date, location_name, location_lat, location_lng, group_id, created_by)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
                RETURNING *
                """,
                title, description, event_date, location_name, location_lat, location_lng, group_id, created_by
            )
            event = dict(row)
            event['rsvp_count'] = 0
            logger.info(f"Created event: {event['id']}")
            return event
        except Exception as e:
            logger.error(f"Error creating event: {e}")
            return None
    
    async def find_events(self, group_id: Optional[str] = None,
                         location_lat: Optional[float] = None,
                         location_lng: Optional[float] = None,
                         max_distance_km: float = 10.0,
                         upcoming_only: bool = True) -> List[Dict[str, Any]]:
        """Find events with optional filters"""
        if not self.pool:
            return []
        
        try:
            query = "SELECT e.*, COUNT(er.id) as rsvp_count FROM events e LEFT JOIN event_rsvps er ON e.id = er.event_id AND er.status = 'going'"
            conditions = []
            params = []
            param_count = 0
            
            if upcoming_only:
                param_count += 1
                conditions.append(f"e.event_date > NOW()")
            
            if group_id:
                param_count += 1
                conditions.append(f"e.group_id = ${param_count}")
                params.append(group_id)
            
            if location_lat and location_lng:
                param_count += 1
                lat_param = param_count
                param_count += 1
                lng_param = param_count
                param_count += 1
                max_dist_param = param_count
                
                conditions.append(
                    f"(6371 * acos(cos(radians(${lat_param})) * cos(radians(e.location_lat)) * "
                    f"cos(radians(e.location_lng) - radians(${lng_param})) + "
                    f"sin(radians(${lat_param})) * sin(radians(e.location_lat)))) <= ${max_dist_param}"
                )
                params.extend([location_lat, location_lng, max_distance_km])
            
            if conditions:
                query += " WHERE " + " AND ".join(conditions)
            
            query += " GROUP BY e.id ORDER BY e.event_date ASC LIMIT 50"
            
            rows = await self.pool.fetch(query, *params)
            events = [dict(row) for row in rows]
            logger.info(f"Found {len(events)} events")
            return events
        except Exception as e:
            logger.error(f"Error finding events: {e}")
            return []
    
    async def rsvp_event(self, event_id: str, user_id: str, status: str = "going") -> bool:
        """RSVP to an event"""
        if not self.pool:
            return False
        
        try:
            await self.pool.execute(
                """
                INSERT INTO event_rsvps (event_id, user_id, status)
                VALUES ($1, $2, $3)
                ON CONFLICT (event_id, user_id) DO UPDATE SET status = $3, rsvp_at = CURRENT_TIMESTAMP
                """,
                event_id, user_id, status
            )
            logger.info(f"User {user_id} RSVPed to event {event_id} with status {status}")
            return True
        except Exception as e:
            logger.error(f"Error RSVPing to event: {e}")
            return False
    
    async def track_usage(self, user_id: str, session_id: str, minutes: int, service_type: str):
        """Track usage for a user"""
        if not self.pool:
            return
        
        try:
            await self.pool.execute(
                """
                INSERT INTO usage_tracking (user_id, session_id, minutes_used, service_type)
                VALUES ($1, $2, $3, $4)
                """,
                user_id, session_id, minutes, service_type
            )
        except Exception as e:
            logger.error(f"Error tracking usage: {e}")
    
    async def get_user_usage(self, user_id: str, month_start: Optional[datetime] = None) -> int:
        """Get user's usage minutes for current month"""
        if not self.pool:
            return 0
        
        try:
            if not month_start:
                month_start = datetime.now().replace(day=1, hour=0, minute=0, second=0, microsecond=0)
            
            total = await self.pool.fetchval(
                """
                SELECT COALESCE(SUM(minutes_used), 0)
                FROM usage_tracking
                WHERE user_id = $1 AND timestamp >= $2
                """,
                user_id, month_start
            )
            return int(total) if total else 0
        except Exception as e:
            logger.error(f"Error getting user usage: {e}")
            return 0

# Global database instance
_db_instance: Optional[Database] = None

async def get_database() -> Database:
    """Get or create database instance"""
    global _db_instance
    if _db_instance is None:
        _db_instance = Database()
        await _db_instance.connect()
    return _db_instance

