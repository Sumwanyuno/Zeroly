// client/src/components/NotificationBtn.jsx
import React, { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../api.js";
import { Bell, Check, Sparkles, AlertCircle, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const NotificationBtn = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useContext(AuthContext);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    if (!userInfo) return;
    setLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await api.get("/api/notifications", config);
      setNotifications(data);
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userInfo) {
      fetchNotifications();
    }
    
    // Listen for custom event triggered by socket in AuthContext
    const handleNewNotification = () => {
      fetchNotifications();
    };
    window.addEventListener('new_notification', handleNewNotification);
    return () => {
      window.removeEventListener('new_notification', handleNewNotification);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userInfo]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const toggleDropdown = () => {
    if (!isOpen) {
      fetchNotifications();
    }
    setIsOpen(!isOpen);
  };

  const markAsRead = async (e, id) => {
    e.stopPropagation();
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await api.put(`/api/notifications/${id}/read`, {}, config);
      setNotifications(notifications.map(n => n._id === id ? { ...n, isRead: true } : n));
    } catch (err) {
      toast.error("Failed to mark as read");
      console.error(err);
    }
  };

  const markAllAsRead = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await api.put(`/api/notifications/read-all`, {}, config);
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      toast.success("All caught up!");
    } catch (err) {
      toast.error("Failed to mark all as read");
      console.error(err);
    }
  };

  const handleNotificationClick = (notification) => {
    if (!notification.isRead) {
      markAsRead({ stopPropagation: () => {} }, notification._id);
    }
    setIsOpen(false);
    if (notification.relatedItem) {
      navigate(`/item/${notification.relatedItem._id || notification.relatedItem}`);
    } else {
      navigate('/dashboard');
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getIconForType = (type) => {
    switch (type) {
      case 'wishlist_match': return <Sparkles className="text-yellow-500 w-5 h-5 flex-shrink-0" />;
      case 'new_request': return <Bell className="text-blue-500 w-5 h-5 flex-shrink-0" />;
      case 'request_update': return <RefreshCw className="text-green-500 w-5 h-5 flex-shrink-0" />;
      default: return <AlertCircle className="text-gray-500 w-5 h-5 flex-shrink-0" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="relative text-muted-foreground hover:text-primary transition-colors p-2 rounded-full hover:bg-muted focus:outline-none focus:ring-2 focus:ring-primary/30"
        aria-label="Notifications"
        aria-expanded={isOpen}
      >
        <Bell className="w-6 h-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-background">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-3 w-80 sm:w-96 bg-card border border-border rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right"
            role="dialog"
            aria-label="Notifications Panel"
          >
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-lg">Notifications</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllAsRead}
                  className="text-xs text-primary hover:underline font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>
            
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center">
                  <svg className="animate-spin h-6 w-6 mb-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p>Loading...</p>
                </div>
              ) : notifications.length > 0 ? (
                <div className="divide-y divide-border">
                  {notifications.map((notification) => (
                    <div 
                      key={notification._id} 
                      onClick={() => handleNotificationClick(notification)}
                      className={`p-4 flex gap-3 cursor-pointer hover:bg-muted/50 transition-colors ${!notification.isRead ? 'bg-primary/5' : ''}`}
                    >
                      <div className="mt-1">
                        {getIconForType(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className={`text-sm font-semibold truncate ${!notification.isRead ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {notification.title}
                          </p>
                          <span className="text-[10px] text-muted-foreground flex-shrink-0 ml-2">
                            {new Date(notification.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={`text-xs ${!notification.isRead ? 'text-foreground/90 font-medium' : 'text-muted-foreground'} line-clamp-2`}>
                          {notification.message}
                        </p>
                      </div>
                      {!notification.isRead && (
                        <div className="flex items-center">
                          <button 
                            onClick={(e) => markAsRead(e, notification._id)}
                            className="text-primary hover:text-primary/70 p-1 rounded-full hover:bg-primary/10 transition-colors"
                            title="Mark as read"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-10 text-center flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <Bell className="w-8 h-8 text-muted-foreground/50" />
                  </div>
                  <p className="text-muted-foreground font-medium">All caught up!</p>
                  <p className="text-xs text-muted-foreground/70 mt-1">Check back later for new alerts.</p>
                </div>
              )}
            </div>
            
            <div className="p-2 border-t border-border text-center bg-muted/10">
              <Link 
                to="/dashboard" 
                onClick={() => setIsOpen(false)}
                className="text-xs text-primary font-semibold hover:underline"
              >
                View all in Dashboard &rarr;
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBtn;
